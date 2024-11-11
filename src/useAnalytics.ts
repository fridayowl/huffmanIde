// hooks/useAnalytics.ts
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Types for analytics data
interface AnalyticsSession {
  session_id: string;
  start_time: string;
  location?: {
    city: string;
    country: string;
  };
  system_info?: {
    python_version: string;
  };
}

interface IDEMetrics {
  linesOfCode: number;
  errorCount: number;
  compilationSuccess: number;
  compilationFailure: number;
  activeFiles: number;
  testCoverage: number;
}

interface HealthMetrics {
  breakCount: number;
  breakDuration: number;
  focusDuration: number;
  postureAlerts: number;
  eyeStrainAlerts: number;
  keyboardIntensity: number;
  stressIndicators: number;
}

interface AnalyticsState {
  usage_trends: Array<{
    timestamp: string;
    coding_time: number;
    lines_written: number;
    successful_compilations: number;
    failed_compilations: number;
    test_coverage: number;
  }>;
  health_trends: Array<{
    timestamp: string;
    focus_duration: number;
    break_duration: number;
    posture_alerts: number;
    eye_strain_alerts: number;
  }>;
}

export const useAnalytics = (userId: string) => {
  const [session, setSession] = useState<AnalyticsSession | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsState | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize analytics session
  useEffect(() => {
    const startSession = async () => {
      try {
        // Get system information
        const sysInfo = await invoke('get_system_info');
        
        // Get user's location (you might want to use a geolocation service)
        const location = await invoke('get_location');
        
        // Create new session
        const sessionData = await invoke('create_analytics_session', {
          userId,
          timestamp: new Date().toISOString(),
          systemInfo: sysInfo,
          location: location
        });

        setSession(sessionData as AnalyticsSession);
        setIsTracking(true);
      } catch (error) {
        console.error('Failed to start analytics session:', error);
        // Implement retry logic here if needed
      }
    };

    startSession();
  }, [userId]);

  // Set up periodic metrics tracking
  useEffect(() => {
    if (!session) return;

    const trackingInterval = setInterval(() => {
      trackMetrics();
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(trackingInterval);
  }, [session]);

  const trackMetrics = async () => {
    if (!session?.session_id) return;

    try {
      const ideMetrics = await calculateIDEMetrics();
      await invoke('save_developer_metrics', {
        metrics: {
          session_id: session.session_id,
          timestamp: new Date().toISOString(),
          coding_time: await getActiveTimeInMinutes(),
          lines_written: ideMetrics.linesOfCode,
          errors_encountered: ideMetrics.errorCount,
          successful_compilations: ideMetrics.compilationSuccess,
          failed_compilations: ideMetrics.compilationFailure,
          test_coverage: ideMetrics.testCoverage
        }
      });

      const healthMetrics = await calculateHealthMetrics();
      await invoke('save_health_metrics', {
        metrics: {
          session_id: session.session_id,
          timestamp: new Date().toISOString(),
          break_count: healthMetrics.breakCount,
          break_duration: healthMetrics.breakDuration,
          focus_duration: healthMetrics.focusDuration,
          posture_alerts: healthMetrics.postureAlerts,
          eye_strain_alerts: healthMetrics.eyeStrainAlerts
        }
      });

      // Fetch updated analytics
      const analytics = await invoke('get_user_analytics', { 
        userId,
        days: 30
      }) as AnalyticsState;

      setMetrics(analytics);
    } catch (error) {
      console.error('Failed to track metrics:', error);
    }
  };

  // Helper functions for calculating metrics
  const calculateIDEMetrics = async (): Promise<IDEMetrics> => {
    try {
      // Get IDE state from Tauri backend
      const state = await invoke('get_ide_state');
      
      return {
        linesOfCode: await invoke('count_total_lines'),
        errorCount: await invoke('get_error_count'),
        compilationSuccess: await invoke('get_successful_compilations'),
        compilationFailure: await invoke('get_failed_compilations'),
        activeFiles: await invoke('get_open_file_count'),
        testCoverage: await invoke('calculate_test_coverage')
      };
    } catch (error) {
      console.error('Failed to calculate IDE metrics:', error);
      return {
        linesOfCode: 0,
        errorCount: 0,
        compilationSuccess: 0,
        compilationFailure: 0,
        activeFiles: 0,
        testCoverage: 0
      };
    }
  };

  const calculateHealthMetrics = async (): Promise<HealthMetrics> => {
    try {
      return {
        breakCount: await invoke('get_break_count'),
        breakDuration: await invoke('get_total_break_time'),
        focusDuration: await invoke('get_focus_time'),
        postureAlerts: await invoke('get_posture_alert_count'),
        eyeStrainAlerts: await invoke('get_eye_strain_alert_count'),
        keyboardIntensity: await invoke('get_keyboard_intensity'),
        stressIndicators: await invoke('calculate_stress_level')
      };
    } catch (error) {
      console.error('Failed to calculate health metrics:', error);
      return {
        breakCount: 0,
        breakDuration: 0,
        focusDuration: 0,
        postureAlerts: 0,
        eyeStrainAlerts: 0,
        keyboardIntensity: 0,
        stressIndicators: 0
      };
    }
  };

  const getActiveTimeInMinutes = async (): Promise<number> => {
    try {
      return await invoke('get_active_time_minutes');
    } catch (error) {
      console.error('Failed to get active time:', error);
      return 0;
    }
  };

  return {
    metrics,
    isTracking,
    session,
    lastUpdate
  };
};