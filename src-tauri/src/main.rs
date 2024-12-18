#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::Manager;
use serde::Serialize;
use tauri::api::dialog;

#[derive(Serialize)]
pub struct CloneResult {
    success: bool,
    message: String,
    files: Vec<String>,
    path: String,
}

#[tauri::command]
async fn clone_repository(
    url: String,
    branch: Option<String>,
    custom_path: Option<String>,
) -> Result<CloneResult, String> {
    // Get directory based on custom_path or user selection
    let (directory, repo_path) = if let Some(path) = custom_path {
        let path_buf = PathBuf::from(path);
        let parent = path_buf.parent()
            .ok_or_else(|| "Invalid path".to_string())?
            .to_path_buf();
        (parent, path_buf)
    } else {
        // Ask user to select directory using dialog
        let directory = match dialog::blocking::FileDialogBuilder::new().pick_folder() {
            Some(path) => path,
            None => return Ok(CloneResult {
                success: false,
                message: "No directory selected".to_string(),
                files: vec![],
                path: String::new(),
            }),
        };

        // Get repository name from URL
        let repo_name = url.split('/')
            .last()
            .and_then(|s| s.strip_suffix(".git"))
            .unwrap_or("repository");

        (directory.clone(), directory.join(repo_name))
    };

    let repo_path_str = repo_path.to_string_lossy().to_string();

    // Check if directory already exists
    if repo_path.exists() {
        return Ok(CloneResult {
            success: false,
            message: format!("Directory {} already exists", repo_path_str),
            files: vec![],
            path: repo_path_str,
        });
    }

    // Ensure parent directory exists
    if let Some(parent) = repo_path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
        }
    }

    // Build git clone command
    let mut cmd = Command::new("git");
    cmd.arg("clone");
    cmd.arg("--depth").arg("1"); // Shallow clone for speed
    
    if let Some(branch_name) = branch {
        cmd.arg("-b").arg(branch_name);
    }
    
    cmd.arg(&url);
    cmd.arg(&repo_path_str);

    // Execute git clone
    let output = cmd.output().map_err(|e| format!("Failed to execute git command: {}", e))?;

    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr);
        // Clean up any partially created directory
        if repo_path.exists() {
            let _ = fs::remove_dir_all(&repo_path);
        }
        return Ok(CloneResult {
            success: false,
            message: error_message.to_string(),
            files: vec![],
            path: repo_path_str,
        });
    }

    // Read directory contents after successful clone
    let mut files = Vec::new();
    read_directory_recursive(&repo_path, &mut files)?;

    Ok(CloneResult {
        success: true,
        message: format!("Repository cloned successfully to {}", repo_path_str),
        files,
        path: repo_path_str,
    })
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

fn read_directory_recursive(dir: &Path, files: &mut Vec<String>) -> Result<(), String> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();
            
            if path.is_file() {
                if let Some(extension) = path.extension() {
                    // Only add Python files
                    if extension == "py" {
                        if let Some(path_str) = path.to_str() {
                            files.push(path_str.to_string());
                        }
                    }
                }
            } else if path.is_dir() {
                // Skip .git directory
                if path.file_name().and_then(|n| n.to_str()) != Some(".git") {
                    read_directory_recursive(&path, files)?;
                }
            }
        }
    }
    Ok(())
}

#[tauri::command]
async fn check_git_installation() -> Result<bool, String> {
    let output = Command::new("git")
        .arg("--version")
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(output.status.success())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Get the main window
            let window = app.get_window("main").unwrap();

            // Get the monitor size
            if let Some(monitor) = window.current_monitor().unwrap() {
                let screen_size = monitor.size();
                let width = (screen_size.width as f32 * 0.9) as u32;
                let height = (screen_size.height as f32 * 0.9) as u32;

                // Set the window size to 90% of screen dimensions
                window.set_size(tauri::Size::Physical(tauri::PhysicalSize { width, height })).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            clone_repository,
            read_file,
            check_git_installation,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}