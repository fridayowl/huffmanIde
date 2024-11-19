interface TimeMetrics {
  sessionStart: number;
  sessionEnd: number | null;
  activeEditingTime: number;
  continuousCodingPeriods: Array<{
    start: number;
    end: number;
    duration: number;
  }>;
  breaks: Array<{
    start: number;
    end: number | null;
    duration: number;
  }>;
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
  private static readonly ACTIVITY_TIMEOUT = 2 * 60 * 1000;
  private static readonly LOCAL_STORAGE_KEY = 'coding_time_metrics';
  
  private currentMetrics: TimeMetrics;
  private activityCheckInterval: NodeJS.Timeout | null = null;
  private lastKeystrokeTime: number = Date.now();
  private fileName: string;

  constructor(fileName: string = 'untitled') {
    this.fileName = fileName;
    this.currentMetrics = this.initializeMetrics();
    this.startActivityTracking();
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

  private startActivityTracking() {
    this.activityCheckInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.currentMetrics.lastActivityTimestamp;

      if (timeSinceLastActivity >= TimeMetricsTracker.ACTIVITY_TIMEOUT && this.currentMetrics.isCurrentlyActive) {
        this.currentMetrics.isCurrentlyActive = false;
        this.recordBreak(this.currentMetrics.lastActivityTimestamp);
      }
    }, 30000);
  }

  public recordActivity() {
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
  }

  private recordBreak(startTime: number) {
    this.currentMetrics.breaks.push({
      start: startTime,
      end: null,
      duration: 0
    });

    if (this.currentMetrics.continuousCodingPeriods.length > 0) {
      const currentPeriod = this.currentMetrics.continuousCodingPeriods[
        this.currentMetrics.continuousCodingPeriods.length - 1
      ];
      currentPeriod.end = startTime;
      currentPeriod.duration = currentPeriod.end - currentPeriod.start;
    }
  }

  public recordKeystroke() {
    const now = Date.now();
    this.currentMetrics.totalKeystrokes++;
    
    const timeSinceLastKeystroke = now - this.lastKeystrokeTime;
    if (timeSinceLastKeystroke < 5000) {
      this.currentMetrics.activeEditingTime += timeSinceLastKeystroke;
    }
    
    this.lastKeystrokeTime = now;
    this.recordActivity();
  }

  public endSession() {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
    }

    this.currentMetrics.sessionEnd = Date.now();
    this.saveMetrics();
  }

  private saveMetrics() {
   const today = new Date().toISOString().split('T')[0];
    const existingData = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
    let dailyMetrics: Record<string, DailyTimeMetrics> = existingData ? JSON.parse(existingData) : {};

    if (!dailyMetrics[today]) {
        dailyMetrics[today] = {
            date: today,
            totalCodingTime: 0,
            totalBreakTime: 0,
            longestCodingStreak: 0,
            averageCodingStreak: 0,
            totalSessions: 0,
            fileMetrics: {}, // Initialize empty fileMetrics object
            metrics: []
        };
    }

    // Ensure fileMetrics exists
    if (!dailyMetrics[today].fileMetrics) {
        dailyMetrics[today].fileMetrics = {};
    }

    // Initialize or update file metrics
    if (!dailyMetrics[today].fileMetrics[this.fileName]) {
        dailyMetrics[today].fileMetrics[this.fileName] = {
            fileName: this.fileName,
            totalEditingTime: 0,
            lastModified: Date.now(),
            sessions: []
        };
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
      ...this.currentMetrics.continuousCodingPeriods.map(period => period.duration)
    );

    // Update file metrics
    dailyMetrics[today].fileMetrics[this.fileName].totalEditingTime += this.currentMetrics.activeEditingTime;
    dailyMetrics[today].fileMetrics[this.fileName].lastModified = Date.now();
    dailyMetrics[today].fileMetrics[this.fileName].sessions.push(this.currentMetrics);

    // Update daily metrics
    dailyMetrics[today].metrics.push(this.currentMetrics);
    dailyMetrics[today].totalCodingTime += totalCodingTime;
    dailyMetrics[today].totalBreakTime += totalBreakTime;
    dailyMetrics[today].longestCodingStreak = Math.max(
      dailyMetrics[today].longestCodingStreak,
      longestStreak
    );
    dailyMetrics[today].totalSessions++;
    dailyMetrics[today].averageCodingStreak = totalCodingTime / dailyMetrics[today].totalSessions;

    localStorage.setItem(TimeMetricsTracker.LOCAL_STORAGE_KEY, JSON.stringify(dailyMetrics));
  }

  public static getDailyMetrics(date: string = new Date().toISOString().split('T')[0]): DailyTimeMetrics | null {
    const existingData = localStorage.getItem(TimeMetricsTracker.LOCAL_STORAGE_KEY);
    if (!existingData) return null;

    const allMetrics = JSON.parse(existingData);
    return allMetrics[date] || null;
  }

  public static getFileMetrics(fileName: string, date: string = new Date().toISOString().split('T')[0]): FileMetrics | null {
    const dailyMetrics = TimeMetricsTracker.getDailyMetrics(date);
    if (!dailyMetrics || !dailyMetrics.fileMetrics[fileName]) return null;
    return dailyMetrics.fileMetrics[fileName];
  }

  public getCurrentMetrics(): TimeMetrics {
    return { ...this.currentMetrics };
  }
}