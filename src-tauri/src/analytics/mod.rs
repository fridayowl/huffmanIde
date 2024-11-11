use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;
use reqwest::Client;
use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use uuid::Uuid;
use geoip2::DatabaseReader;

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSession {
    pub session_id: String,
    pub start_time: DateTime<Utc>,
    pub user_id: String,
    pub location: Option<Location>,
    pub system_info: SystemInfo,
    pub idle_time: i64,
    pub active_time: i64,
    pub focus_time: i64,
    pub break_time: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Location {
    pub country: String,
    pub city: String,
    pub timezone: String,
    pub ip: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub os_version: String,
    pub cpu_cores: i32,
    pub memory_total: i64,
    pub memory_available: i64,
    pub python_version: String,
    pub screen_resolution: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeveloperMetrics {
    pub session_id: String,
    pub timestamp: DateTime<Utc>,
    pub coding_time: i64,
    pub lines_written: i32,
    pub errors_encountered: i32,
    pub successful_compilations: i32,
    pub failed_compilations: i32,
    pub debug_time: i64,
    pub keyboard_intensity: f32,
    pub mouse_intensity: f32,
    pub active_files: i32,
    pub test_coverage: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthMetrics {
    pub session_id: String,
    pub timestamp: DateTime<Utc>,
    pub break_count: i32,
    pub break_duration: i64,
    pub focus_duration: i64,
    pub posture_alerts: i32,
    pub eye_strain_alerts: i32,
    pub keyboard_intensity: f32,
    pub stress_indicators: i32,
}

pub struct AnalyticsManager {
    pool: SqlitePool,
    http_client: Client,
    geo_reader: DatabaseReader,
}

impl AnalyticsManager {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect("sqlite:analytics.db")
            .await?;

        // Initialize database tables
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                start_time TEXT NOT NULL,
                location_json TEXT,
                system_info_json TEXT NOT NULL,
                idle_time INTEGER,
                active_time INTEGER,
                focus_time INTEGER,
                break_time INTEGER
            )
            "#,
        )
        .execute(&pool)
        .await?;

        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS developer_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                coding_time INTEGER,
                lines_written INTEGER,
                errors_encountered INTEGER,
                successful_compilations INTEGER,
                failed_compilations INTEGER,
                debug_time INTEGER,
                keyboard_intensity REAL,
                mouse_intensity REAL,
                active_files INTEGER,
                test_coverage REAL,
                FOREIGN KEY(session_id) REFERENCES sessions(session_id)
            )
            "#,
        )
        .execute(&pool)
        .await?;

        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS health_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                break_count INTEGER,
                break_duration INTEGER,
                focus_duration INTEGER,
                posture_alerts INTEGER,
                eye_strain_alerts INTEGER,
                keyboard_intensity REAL,
                stress_indicators INTEGER,
                FOREIGN KEY(session_id) REFERENCES sessions(session_id)
            )
            "#,
        )
        .execute(&pool)
        .await?;

        Ok(Self {
            pool,
            http_client: Client::new(),
            geo_reader: DatabaseReader::from_path("GeoLite2-City.mmdb")?,
        })
    }

    pub async fn start_session(&self, user_id: &str) -> Result<UserSession, Box<dyn std::error::Error>> {
        let session_id = Uuid::new_v4().to_string();
        let start_time = Utc::now();
        
        // Get location data
        let ip = self.get_public_ip().await?;
        let location = self.get_location(&ip).await?;
        
        // Get system information
        let system_info = self.get_system_info()?;

        let session = UserSession {
            session_id,
            start_time,
            user_id: user_id.to_string(),
            location: Some(location),
            system_info,
            idle_time: 0,
            active_time: 0,
            focus_time: 0,
            break_time: 0,
        };

        // Save session to database
        self.save_session(&session).await?;

        Ok(session)
    }

    pub async fn save_developer_metrics(&self, metrics: DeveloperMetrics) -> Result<(), Box<dyn std::error::Error>> {
        sqlx::query(
            r#"
            INSERT INTO developer_metrics (
                session_id, timestamp, coding_time, lines_written, errors_encountered,
                successful_compilations, failed_compilations, debug_time,
                keyboard_intensity, mouse_intensity, active_files, test_coverage
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            "#,
        )
        .bind(&metrics.session_id)
        .bind(metrics.timestamp)
        .bind(metrics.coding_time)
        .bind(metrics.lines_written)
        .bind(metrics.errors_encountered)
        .bind(metrics.successful_compilations)
        .bind(metrics.failed_compilations)
        .bind(metrics.debug_time)
        .bind(metrics.keyboard_intensity)
        .bind(metrics.mouse_intensity)
        .bind(metrics.active_files)
        .bind(metrics.test_coverage)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn save_health_metrics(&self, metrics: HealthMetrics) -> Result<(), Box<dyn std::error::Error>> {
        sqlx::query(
            r#"
            INSERT INTO health_metrics (
                session_id, timestamp, break_count, break_duration, focus_duration,
                posture_alerts, eye_strain_alerts, keyboard_intensity, stress_indicators
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            "#,
        )
        .bind(&metrics.session_id)
        .bind(metrics.timestamp)
        .bind(metrics.break_count)
        .bind(metrics.break_duration)
        .bind(metrics.focus_duration)
        .bind(metrics.posture_alerts)
        .bind(metrics.eye_strain_alerts)
        .bind(metrics.keyboard_intensity)
        .bind(metrics.stress_indicators)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    async fn get_public_ip(&self) -> Result<String, Box<dyn std::error::Error>> {
        let ip = self.http_client
            .get("https://api.ipify.org")
            .send()
            .await?
            .text()
            .await?;
        Ok(ip)
    }

    async fn get_location(&self, ip: &str) -> Result<Location, Box<dyn std::error::Error>> {
        let ip_addr: std::net::IpAddr = ip.parse()?;
        let city = self.geo_reader.lookup(ip_addr)?;

        Ok(Location {
            country: city.country.unwrap().names.get("en").unwrap().to_string(),
            city: city.city.unwrap().names.get("en").unwrap().to_string(),
            timezone: city.location.unwrap().time_zone.unwrap().to_string(),
            ip: ip.to_string(),
        })
    }

    fn get_system_info(&self) -> Result<SystemInfo, Box<dyn std::error::Error>> {
        let sys_info = sys_info::System::new();
        
        Ok(SystemInfo {
            os: std::env::consts::OS.to_string(),
            os_version: sys_info.os_version()?,
            cpu_cores: num_cpus::get() as i32,
            memory_total: sys_info.memory()?.total,
            memory_available: sys_info.memory()?.free,
            python_version: self.get_python_version()?,
            screen_resolution: self.get_screen_resolution()?,
        })
    }

    async fn get_usage_trends(&self, user_id: &str, days: i32) -> Result<Vec<DeveloperMetrics>, Box<dyn std::error::Error>> {
        let metrics = sqlx::query_as!(
            DeveloperMetrics,
            r#"
            SELECT * FROM developer_metrics dm
            JOIN sessions s ON dm.session_id = s.session_id
            WHERE s.user_id = $1
            AND dm.timestamp >= datetime('now', '-' || $2 || ' days')
            ORDER BY dm.timestamp DESC
            "#,
            user_id,
            days
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(metrics)
    }

    async fn get_health_trends(&self, user_id: &str, days: i32) -> Result<Vec<HealthMetrics>, Box<dyn std::error::Error>> {
        let metrics = sqlx::query_as!(
            HealthMetrics,
            r#"
            SELECT * FROM health_metrics hm
            JOIN sessions s ON hm.session_id = s.session_id
            WHERE s.user_id = $1
            AND hm.timestamp >= datetime('now', '-' || $2 || ' days')
            ORDER BY hm.timestamp DESC
            "#,
            user_id,
            days
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(metrics)
    }
}

// Tauri commands for the frontend
#[tauri::command]
async fn start_analytics_session(user_id: String, state: tauri::State<'_, AnalyticsManager>) -> Result<UserSession, String> {
    state.start_session(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn save_developer_metrics(metrics: DeveloperMetrics, state: tauri::State<'_, AnalyticsManager>) -> Result<(), String> {
    state.save_developer_metrics(metrics)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn save_health_metrics(metrics: HealthMetrics, state: tauri::State<'_, AnalyticsManager>) -> Result<(), String> {
    state.save_health_metrics(metrics)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_user_analytics(user_id: String, days: i32, state: tauri::State<'_, AnalyticsManager>) -> Result<serde_json::Value, String> {
    let usage_trends = state.get_usage_trends(&user_id, days).await.map_err(|e| e.to_string())?;
    let health_trends = state.get_health_trends(&user_id, days).await.map_err(|e| e.to_string())?;

    Ok(serde_json::json!({
        "usage_trends": usage_trends,
        "health_trends": health_trends
    }))
}