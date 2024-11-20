import { useDateAwareMetrics } from './useDateAwareMetrics';

// Type definitions
interface CodingPeriod {
  start: number;
  end: number;
  duration: number;
}

interface BreakPeriod {
  start: number;
  end: number | null;
  duration: number;
}

interface TimeMetrics {
  sessionStart: number;
  sessionEnd: number | null;
  activeEditingTime: number;
  continuousCodingPeriods: CodingPeriod[];
  breaks: BreakPeriod[];
  lastActivityTimestamp: number;
  totalKeystrokes: number;
  isCurrentlyActive: boolean;
  fileName: string;
}

interface FileMetrics {
  fileName: string;
  totalEditingTime: number;
  lastModified: number;
  sessions: TimeMetrics[];
}

interface DailyTimeMetrics {
  date: string;
  totalCodingTime: number;
  totalBreakTime: number;
  longestCodingStreak: number;
  averageCodingStreak: number;
  totalSessions: number;
  fileMetrics: Record<string, FileMetrics>;
  metrics: TimeMetrics[];
}

export class TimeMetricsTracker {
  private static readonly ACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes
  private static readonly LOCAL_STORAGE_KEY = 'coding_time_metrics';
  private static readonly LAST_ACCESS_KEY = 'coding_time_last_access';
  private static readonly CLEANUP_THRESHOLD = 30; // Days to keep metrics

  private currentMetrics: TimeMetrics;
  private activityCheckInterval: NodeJS.Timeout | null = null;
  private lastKeystrokeTime: number = Date.now();
  private fileName: string;
  private currentDate: string;

  constructor(fileName: string = 'untitled') {
    this.fileName = fileName;
    this.currentDate = this.getCurrentDate();
    this.currentMetrics = this.initializeMetrics();
    this.startActivityTracking();
    this.initializeNewDay();
    this.setupDateTransitionCheck();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getInitialDailyMetrics(): DailyTimeMetrics {
    return {
      date: this.currentDate,
      totalCodingTime: 0,
      totalBreakTime: 0,
      longestCodingStreak: 0,
      averageCodingStreak: 0,
      totalSessions: 0,
      fileMetrics: {},
      metrics: []
    };
  }

  private initializeMetrics(): TimeMetrics {
    return {
      sessionStart: Date.now(),
      sessionEnd: null,
      activeEditingTime: 0,
      continuousCodingPeriods: [],
      breaks: [],
      lastActivityTimestamp: Date.now(),
      totalKeystrokes: 0,
      isCurrentlyActive: true,
      fileName: this.fileName
    };
  }

  private setupDateTransitionCheck(): void {
    // Check for date transitions every minute
    setInterval(() => {
      const newDate = this.getCurrentDate();
      if (newDate !== this.currentDate) {
        this.handleDateTransition(newDate);
      }
    }, 60000);
  }

  private handleDateTransition(newDate: string): void {
    // Save current metrics before transitioning
    this.saveMetrics();
    
    // Update current date
    this.currentDate = newDate;
    
    // Initialize new day's metrics
    this.initializeNewDay();
    
    // Reset current metrics
    this.currentMetrics = this.initializeMetrics();
    
    // Update last access
    localStorage.setItem(TimeMetricsTracker.LAST_ACCESS_KEY, newDate);
  }

  private initializeNewDay(): void {
    const metrics = this.loadMetrics(this.currentDate);
    if (!metrics) {
      this.saveMetricsForDate(this.currentDate, this.getInitialDailyMetrics());
    }
  }

  private loadMetrics(date: string): DailyTimeMetrics | null {
    try {
      const stored = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
      if (!stored) return null;
      
      const allMetrics = JSON.parse(stored) as Record<string, DailyTimeMetrics>;
      return allMetrics[date] || null;
    } catch (error) {
      console.error(`Error loading metrics for ${date}:`, error);
      return null;
    }
  }

  private saveMetricsForDate(date: string, metrics: DailyTimeMetrics): void {
    try {
      const stored = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
      const allMetrics = stored ? JSON.parse(stored) : {};
      
      allMetrics[date] = metrics;
      
      localStorage.setItem(TimeMetricsTracker.LOCAL_STORAGE_KEY, JSON.stringify(allMetrics));
      localStorage.setItem(TimeMetricsTracker.LAST_ACCESS_KEY, date);
    } catch (error) {
      console.error(`Error saving metrics for ${date}:`, error);
    }
  }

  private startActivityTracking(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
    }

    this.activityCheckInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.currentMetrics.lastActivityTimestamp;

      if (timeSinceLastActivity >= TimeMetricsTracker.ACTIVITY_TIMEOUT && 
          this.currentMetrics.isCurrentlyActive) {
        this.currentMetrics.isCurrentlyActive = false;
        this.recordBreak(this.currentMetrics.lastActivityTimestamp);
      }
    }, 30000);
  }

  public recordActivity(): void {
    const now = Date.now();
    const wasInactive = !this.currentMetrics.isCurrentlyActive;
    
    this.currentMetrics.lastActivityTimestamp = now;
    this.currentMetrics.isCurrentlyActive = true;

    if (wasInactive && this.currentMetrics.breaks.length > 0) {
      const lastBreak = this.currentMetrics.breaks[this.currentMetrics.breaks.length - 1];
      if (!lastBreak.end) {
        lastBreak.end = now;
        lastBreak.duration = lastBreak.end - lastBreak.start;
      }
    }

    if (wasInactive || this.currentMetrics.continuousCodingPeriods.length === 0) {
      this.currentMetrics.continuousCodingPeriods.push({
        start: now,
        end: now,
        duration: 0
      });
    } else {
      const currentPeriod = this.currentMetrics.continuousCodingPeriods[
        this.currentMetrics.continuousCodingPeriods.length - 1
      ];
      currentPeriod.end = now;
      currentPeriod.duration = currentPeriod.end - currentPeriod.start;
    }

    this.saveMetrics();
  }

  private recordBreak(startTime: number): void {
    if (this.currentMetrics.continuousCodingPeriods.length > 0) {
      const currentPeriod = this.currentMetrics.continuousCodingPeriods[
        this.currentMetrics.continuousCodingPeriods.length - 1
      ];
      currentPeriod.end = startTime;
      currentPeriod.duration = currentPeriod.end - currentPeriod.start;
    }

    this.currentMetrics.breaks.push({
      start: startTime,
      end: null,
      duration: 0
    });

    this.saveMetrics();
  }

  public recordKeystroke(): void {
    const now = Date.now();
    this.currentMetrics.totalKeystrokes++;
    
    const timeSinceLastKeystroke = now - this.lastKeystrokeTime;
    if (timeSinceLastKeystroke < 5000) {
      this.currentMetrics.activeEditingTime += timeSinceLastKeystroke;
    }
    
    this.lastKeystrokeTime = now;
    this.recordActivity();
  }

  private saveMetrics(): void {
    try {
      let dailyMetrics = this.loadMetrics(this.currentDate) as DailyTimeMetrics;
      
      if (!dailyMetrics) {
        dailyMetrics = this.getInitialDailyMetrics();
      }

      const totalCodingTime = this.currentMetrics.continuousCodingPeriods.reduce(
        (total, period) => total + period.duration,
        0
      );

      const totalBreakTime = this.currentMetrics.breaks.reduce(
        (total, breakPeriod) => total + (breakPeriod.duration || 0),
        0
      );

      const longestStreak = Math.max(
        ...this.currentMetrics.continuousCodingPeriods.map(period => period.duration),
        0
      );

      // Initialize file metrics if needed
      if (!dailyMetrics.fileMetrics[this.fileName]) {
        dailyMetrics.fileMetrics[this.fileName] = {
          fileName: this.fileName,
          totalEditingTime: 0,
          lastModified: Date.now(),
          sessions: []
        };
      }

      // Update file metrics
      const fileMetrics = dailyMetrics.fileMetrics[this.fileName];
      fileMetrics.totalEditingTime = this.currentMetrics.activeEditingTime;
      fileMetrics.lastModified = Date.now();
      fileMetrics.sessions = [this.currentMetrics];

      // Calculate total coding time from all files
      dailyMetrics.totalCodingTime = Object.values(dailyMetrics.fileMetrics)
        .reduce((total, metrics) => total + metrics.totalEditingTime, 0);

      // Update other daily metrics
      dailyMetrics.totalBreakTime = totalBreakTime;
      dailyMetrics.longestCodingStreak = Math.max(
        dailyMetrics.longestCodingStreak,
        longestStreak
      );
      dailyMetrics.totalSessions++;
      dailyMetrics.averageCodingStreak = dailyMetrics.totalCodingTime / dailyMetrics.totalSessions;

      this.saveMetricsForDate(this.currentDate, dailyMetrics);
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  public endSession(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }

    this.currentMetrics.sessionEnd = Date.now();
    this.saveMetrics();
  }

  public static getDailyMetrics(date: string = new Date().toISOString().split('T')[0]): DailyTimeMetrics | null {
    try {
      const stored = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
      if (!stored) return null;

      const allMetrics = JSON.parse(stored) as Record<string, DailyTimeMetrics>;
      return allMetrics[date] || null;
    } catch (error) {
      console.error('Error getting daily metrics:', error);
      return null;
    }
  }

  public static getFileMetrics(
    fileName: string,
    date: string = new Date().toISOString().split('T')[0]
  ): FileMetrics | null {
    const dailyMetrics = TimeMetricsTracker.getDailyMetrics(date);
    if (!dailyMetrics || !dailyMetrics.fileMetrics[fileName]) return null;
    return dailyMetrics.fileMetrics[fileName];
  }

  public static getAllMetrics(): Record<string, DailyTimeMetrics> {
    try {
      const stored = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Record<string, DailyTimeMetrics>) : {};
    } catch (error) {
      console.error('Error getting all metrics:', error);
      return {};
    }
  }

  public static cleanupOldMetrics(): void {
    try {
      const allMetrics = TimeMetricsTracker.getAllMetrics();
      const currentDate = new Date();
      const threshold = new Date();
      threshold.setDate(currentDate.getDate() - TimeMetricsTracker.CLEANUP_THRESHOLD);

      const filteredMetrics = Object.entries(allMetrics)
        .reduce((acc, [date, metrics]) => {
          if (new Date(date) >= threshold) {
            acc[date] = metrics;
          }
          return acc;
        }, {} as Record<string, DailyTimeMetrics>);

      localStorage.setItem(
        TimeMetricsTracker.LOCAL_STORAGE_KEY,
        JSON.stringify(filteredMetrics)
      );
    } catch (error) {
      console.error('Error cleaning up old metrics:', error);
    }
  }

  public getCurrentMetrics(): TimeMetrics {
    return { ...this.currentMetrics };
  }
}