import { EditorView, ViewUpdate } from '@codemirror/view';

interface CodingPatterns {
  errorRate: number;
  deletionFrequency: number;
  typingSpeed: number;
  pauseFrequency: number;
  codeComplexity: number;
}

interface MentalMetrics {
  fileName: string;
  timestamp: number;
  patterns: CodingPatterns;
  sessionDuration: number;
  breakDuration: number;
  flowScore: number;
}

interface FileMetrics {
  fileName: string;
  totalFlowScore: number;
  averageFlowScore: number;
  lastModified: number;
  sessions: MentalMetrics[];
}

interface DailyMentalMetrics {
  date: string;
  totalFlowScore: number;
  averageFlowScore: number;
  totalSessions: number;
  fileMetrics: Record<string, FileMetrics>;
  metrics: MentalMetrics[];
}

interface AllMentalMetrics {
  [date: string]: DailyMentalMetrics;
}

export class CodingMentalHealthTracker {
  private static readonly STORAGE_KEY = 'mental_health_metrics';
  private static readonly LAST_ACCESS_KEY = 'mental_health_last_access';
  private static readonly PAUSE_THRESHOLD = 2000; // 2 seconds
  private static readonly CLEANUP_THRESHOLD = 30; // Days to keep metrics

  private editor: EditorView;
  private fileName: string;
  private metrics: MentalMetrics[] = [];
  private lastKeystroke: number = Date.now();
  private keystrokes: number = 0;
  private deletions: number = 0;
  private errors: number = 0;
  private pauses: number = 0;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;
  private dateCheckInterval: ReturnType<typeof setInterval> | null = null;
  private lastActivityTime: number = Date.now();
  private currentDate: string;

  constructor(editor: EditorView, fileName: string) {
    this.editor = editor;
    this.fileName = fileName;
    this.currentDate = this.getCurrentDate();
    
    this.initializeNewDay();
    this.setupListeners();
    this.startTracking();
    this.startDateChecking();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private setupListeners(): void {
    this.editor.dom.addEventListener('keydown', this.handleKeydown);
  }

  private initializeNewDay(): void {
    const currentDate = this.getCurrentDate();
    const lastAccessDate = localStorage.getItem(CodingMentalHealthTracker.LAST_ACCESS_KEY);

    if (currentDate !== lastAccessDate) {
      const initialMetrics: DailyMentalMetrics = {
        date: currentDate,
        totalFlowScore: 0,
        averageFlowScore: 0,
        totalSessions: 0,
        fileMetrics: {},
        metrics: []
      };

      const allMetrics = CodingMentalHealthTracker.getAllMetrics();
      if (!allMetrics[currentDate]) {
        allMetrics[currentDate] = initialMetrics;
        localStorage.setItem(CodingMentalHealthTracker.STORAGE_KEY, JSON.stringify(allMetrics));
      }

      localStorage.setItem(CodingMentalHealthTracker.LAST_ACCESS_KEY, currentDate);
      this.currentDate = currentDate;
      this.resetDailyCounters();
    }

    this.cleanupOldMetrics();
  }

  private resetDailyCounters(): void {
    this.keystrokes = 0;
    this.deletions = 0;
    this.errors = 0;
    this.pauses = 0;
    this.metrics = [];
    this.lastActivityTime = Date.now();
    this.lastKeystroke = Date.now();
  }

  private startDateChecking(): void {
    this.dateCheckInterval = setInterval(() => {
      const newDate = this.getCurrentDate();
      if (newDate !== this.currentDate) {
        this.handleDateTransition(newDate);
      }
    }, 60000); // Check every minute
  }

  private handleDateTransition(newDate: string): void {
    this.recordMetrics();
    this.currentDate = newDate;
    this.initializeNewDay();
  }

  private cleanupOldMetrics(): void {
    try {
      const allMetrics = CodingMentalHealthTracker.getAllMetrics();
      const currentDate = new Date();
      const threshold = new Date();
      threshold.setDate(currentDate.getDate() - CodingMentalHealthTracker.CLEANUP_THRESHOLD);

      const filteredMetrics = Object.entries(allMetrics).reduce((acc, [date, metrics]) => {
        if (new Date(date) >= threshold) {
          acc[date] = metrics;
        }
        return acc;
      }, {} as AllMentalMetrics);

      localStorage.setItem(CodingMentalHealthTracker.STORAGE_KEY, JSON.stringify(filteredMetrics));
    } catch (error) {
      console.error('Error cleaning up old metrics:', error);
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    const now = Date.now();
    const timeSinceLastStroke = now - this.lastKeystroke;

    if (timeSinceLastStroke > CodingMentalHealthTracker.PAUSE_THRESHOLD) {
      this.pauses++;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.deletions++;
    }

    this.keystrokes++;
    this.lastKeystroke = now;
    this.recordMetrics();
  };

  public handleEditorUpdate(update: ViewUpdate): void {
    if (update.docChanged) {
      this.keystrokes++;
      const now = Date.now();
      const timeSinceLastStroke = now - this.lastKeystroke;

      if (timeSinceLastStroke > CodingMentalHealthTracker.PAUSE_THRESHOLD) {
        this.pauses++;
      }

      update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        if (toA - fromA > toB - fromB) {
          this.deletions++;
        }
      });

      this.lastKeystroke = now;
      this.recordMetrics();
    }
  }

  private calculateTypingSpeed(): number {
    const now = Date.now();
    const durationMinutes = (now - this.lastActivityTime) / 60000;

    if (durationMinutes < 0.1) return 0;
    return this.keystrokes / durationMinutes;
  }

  private calculateCodeComplexity(): number {
    const content = this.editor.state.doc.toString();
    const lines = content.split('\n');
    
    let complexity = 0;
    const complexityPatterns = [
      /if\s*\(/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /\?\s*./g,
    ];

    lines.forEach(line => {
      complexityPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) complexity += matches.length;
      });
    });

    return complexity;
  }

  private calculateFlowScore(): number {
    const typingSpeed = this.calculateTypingSpeed();
    const normalizedSpeed = Math.min(typingSpeed / 60, 1);
    const errorImpact = Math.max(0, 1 - (this.errors * 0.1));
    const pauseImpact = Math.max(0, 1 - (this.pauses * 0.05));
    
    return (normalizedSpeed * 0.4 + errorImpact * 0.3 + pauseImpact * 0.3) * 100;
  }

  private startTracking(): void {
    this.trackingInterval = setInterval(() => this.recordMetrics(), 60000);
  }

  private recordMetrics(): void {
    const currentMetrics: MentalMetrics = {
      fileName: this.fileName,
      timestamp: Date.now(),
      patterns: {
        errorRate: this.keystrokes > 0 ? this.errors / this.keystrokes : 0,
        deletionFrequency: this.keystrokes > 0 ? this.deletions / this.keystrokes : 0,
        typingSpeed: this.calculateTypingSpeed(),
        pauseFrequency: this.pauses / ((Date.now() - this.lastActivityTime) / 60000),
        codeComplexity: this.calculateCodeComplexity()
      },
      sessionDuration: Date.now() - this.lastActivityTime,
      breakDuration: 0,
      flowScore: this.calculateFlowScore()
    };

    this.metrics.push(currentMetrics);
    this.saveMetrics(currentMetrics, this.currentDate);
  }

  private saveMetrics(currentMetrics: MentalMetrics, currentDate: string): void {
    try {
      const allMetrics = CodingMentalHealthTracker.getAllMetrics();
      
      if (!allMetrics[currentDate]) {
        allMetrics[currentDate] = {
          date: currentDate,
          totalFlowScore: 0,
          averageFlowScore: 0,
          totalSessions: 0,
          fileMetrics: {},
          metrics: []
        };
      }

      const dailyMetrics = allMetrics[currentDate];

      if (!dailyMetrics.fileMetrics[this.fileName]) {
        dailyMetrics.fileMetrics[this.fileName] = {
          fileName: this.fileName,
          totalFlowScore: 0,
          averageFlowScore: 0,
          lastModified: Date.now(),
          sessions: []
        };
      }

      const fileMetrics = dailyMetrics.fileMetrics[this.fileName];
      fileMetrics.sessions.push(currentMetrics);
      fileMetrics.lastModified = Date.now();
      fileMetrics.totalFlowScore += currentMetrics.flowScore;
      fileMetrics.averageFlowScore = fileMetrics.totalFlowScore / fileMetrics.sessions.length;

      dailyMetrics.metrics.push(currentMetrics);
      dailyMetrics.totalSessions++;
      dailyMetrics.totalFlowScore += currentMetrics.flowScore;
      dailyMetrics.averageFlowScore = dailyMetrics.totalFlowScore / dailyMetrics.totalSessions;

      localStorage.setItem(CodingMentalHealthTracker.STORAGE_KEY, JSON.stringify(allMetrics));
      localStorage.setItem(CodingMentalHealthTracker.LAST_ACCESS_KEY, currentDate);
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  public cleanup(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    if (this.dateCheckInterval) {
      clearInterval(this.dateCheckInterval);
      this.dateCheckInterval = null;
    }
    this.editor.dom.removeEventListener('keydown', this.handleKeydown);
    this.recordMetrics();
  }

  public recordActivity(): void {
    const now = Date.now();
    if (now - this.lastActivityTime > CodingMentalHealthTracker.PAUSE_THRESHOLD) {
      this.pauses++;
    }
    this.lastActivityTime = now;
    this.recordMetrics();
  }

  public static getDailyMetrics(date: string = new Date().toISOString().split('T')[0]): DailyMentalMetrics | null {
    try {
      const stored = localStorage.getItem(CodingMentalHealthTracker.STORAGE_KEY);
      if (!stored) return null;

      const allMetrics = JSON.parse(stored) as AllMentalMetrics;
      return allMetrics[date] || null;
    } catch (error) {
      console.error('Error getting daily metrics:', error);
      return null;
    }
  }

  public static getFileMetrics(fileName: string, date: string = new Date().toISOString().split('T')[0]): FileMetrics | null {
    try {
      const dailyMetrics = CodingMentalHealthTracker.getDailyMetrics(date);
      if (!dailyMetrics || !dailyMetrics.fileMetrics[fileName]) return null;
      return dailyMetrics.fileMetrics[fileName];
    } catch (error) {
      console.error('Error getting file metrics:', error);
      return null;
    }
  }

  public static getAllMetrics(): AllMentalMetrics {
    try {
      const stored = localStorage.getItem(CodingMentalHealthTracker.STORAGE_KEY);
      return stored ? JSON.parse(stored) as AllMentalMetrics : {};
    } catch (error) {
      console.error('Error getting all metrics:', error);
      return {};
    }
  }
}