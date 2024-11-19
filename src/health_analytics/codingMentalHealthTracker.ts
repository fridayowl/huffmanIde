import { EditorView, ViewUpdate } from '@codemirror/view';
import { StateField } from '@codemirror/state';
import { Diagnostic } from '@codemirror/lint';

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
  private static readonly PAUSE_THRESHOLD = 2000; // 2 seconds

  private editor: EditorView;
  private fileName: string;
  private metrics: MentalMetrics[] = [];
  private lastKeystroke: number = Date.now();
  private keystrokes: number = 0;
  private deletions: number = 0;
  private errors: number = 0;
  private pauses: number = 0;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;
  private lastActivityTime: number = Date.now();
  private currentDate: string;

  constructor(editor: EditorView, fileName: string) {
    this.editor = editor;
    this.fileName = fileName;
    this.currentDate = new Date().toISOString().split('T')[0];
    this.setupListeners();
    this.startTracking();
  }

  private setupListeners() {
    this.editor.dom.addEventListener('keydown', this.handleKeydown);
  }

  public handleEditorUpdate(update: ViewUpdate) {
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

  private handleKeydown = (event: KeyboardEvent) => {
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
    const typingSpeed = this.keystrokes / ((Date.now() - this.lastActivityTime) / 60000);
    const normalizedSpeed = Math.min(typingSpeed / 60, 1);
    const errorImpact = Math.max(0, 1 - (this.errors * 0.1));
    const pauseImpact = Math.max(0, 1 - (this.pauses * 0.05));
    
    return (normalizedSpeed * 0.4 + errorImpact * 0.3 + pauseImpact * 0.3) * 100;
  }

  private recordMetrics() {
    const currentMetrics: MentalMetrics = {
      fileName: this.fileName,
      timestamp: Date.now(),
      patterns: {
        errorRate: this.keystrokes > 0 ? this.errors / this.keystrokes : 0,
        deletionFrequency: this.keystrokes > 0 ? this.deletions / this.keystrokes : 0,
        typingSpeed: this.keystrokes / ((Date.now() - this.lastActivityTime) / 60000),
        pauseFrequency: this.pauses / ((Date.now() - this.lastActivityTime) / 60000),
        codeComplexity: this.calculateCodeComplexity()
      },
      sessionDuration: Date.now() - this.lastActivityTime,
      breakDuration: 0,
      flowScore: this.calculateFlowScore()
    };

    this.metrics.push(currentMetrics);
    this.saveMetrics(currentMetrics);
  }

  private saveMetrics(currentMetrics: MentalMetrics) {
    const stored = localStorage.getItem(CodingMentalHealthTracker.STORAGE_KEY);
    let allMetrics: AllMentalMetrics = stored ? JSON.parse(stored) : {};
    
    // Initialize or get daily metrics
    if (!allMetrics[this.currentDate]) {
      allMetrics[this.currentDate] = {
        date: this.currentDate,
        totalFlowScore: 0,
        averageFlowScore: 0,
        totalSessions: 0,
        fileMetrics: {},
        metrics: []
      };
    }

    const dailyMetrics = allMetrics[this.currentDate];

    // Initialize or update file metrics
    if (!dailyMetrics.fileMetrics[this.fileName]) {
      dailyMetrics.fileMetrics[this.fileName] = {
        fileName: this.fileName,
        totalFlowScore: 0,
        averageFlowScore: 0,
        lastModified: Date.now(),
        sessions: []
      };
    }

    // Update file metrics
    const fileMetrics = dailyMetrics.fileMetrics[this.fileName];
    fileMetrics.sessions.push(currentMetrics);
    fileMetrics.lastModified = Date.now();
    fileMetrics.totalFlowScore += currentMetrics.flowScore;
    fileMetrics.averageFlowScore = fileMetrics.totalFlowScore / fileMetrics.sessions.length;

    // Update daily aggregates
    dailyMetrics.metrics.push(currentMetrics);
    dailyMetrics.totalSessions++;
    dailyMetrics.totalFlowScore += currentMetrics.flowScore;
    dailyMetrics.averageFlowScore = dailyMetrics.totalFlowScore / dailyMetrics.totalSessions;

    localStorage.setItem(CodingMentalHealthTracker.STORAGE_KEY, JSON.stringify(allMetrics));
  }

  private startTracking() {
    this.trackingInterval = setInterval(() => this.recordMetrics(), 60000);
  }

  public cleanup() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.editor.dom.removeEventListener('keydown', this.handleKeydown);
    this.recordMetrics();
  }

  public static getDailyMetrics(date: string = new Date().toISOString().split('T')[0]): DailyMentalMetrics | null {
    const stored = localStorage.getItem(CodingMentalHealthTracker.STORAGE_KEY);
    if (!stored) return null;

    const allMetrics: AllMentalMetrics = JSON.parse(stored);
    return allMetrics[date] || null;
  }

  public static getFileMetrics(fileName: string, date: string = new Date().toISOString().split('T')[0]): FileMetrics | null {
    const dailyMetrics = CodingMentalHealthTracker.getDailyMetrics(date);
    if (!dailyMetrics || !dailyMetrics.fileMetrics[fileName]) return null;
    return dailyMetrics.fileMetrics[fileName];
  }

  public static getAllMetrics(): AllMentalMetrics {
    const stored = localStorage.getItem(CodingMentalHealthTracker.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  public recordActivity() {
    const now = Date.now();
    if (now - this.lastActivityTime > CodingMentalHealthTracker.PAUSE_THRESHOLD) {
      this.pauses++;
    }
    this.lastActivityTime = now;
  }
}