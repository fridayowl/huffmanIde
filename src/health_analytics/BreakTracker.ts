interface BreakSettings {
  breakInterval: number; // in minutes
  breakDuration: number; // in minutes
  dailyBreakTarget: number; // number of breaks
}

export class BreakTracker {
  private static readonly STORAGE_KEY = 'break_tracker_settings';
  private static readonly HISTORY_KEY = 'break_history';
  private settings: BreakSettings;
  private lastBreakTime: number;
  private breaksTaken: number;

  constructor() {
    this.settings = this.loadSettings();
    const history = this.loadHistory();
    this.lastBreakTime = history.lastBreakTime || Date.now();
    this.breaksTaken = history.breaksTaken || 0;
  }

  private loadSettings(): BreakSettings {
    const defaultSettings: BreakSettings = {
      breakInterval: 45,
      breakDuration: 5,
      dailyBreakTarget: 8
    };

    try {
      const stored = localStorage.getItem(BreakTracker.STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (error) {
      console.error('Error loading break settings:', error);
      return defaultSettings;
    }
  }

  private loadHistory() {
    const defaultHistory = {
      lastBreakTime: Date.now(),
      breaksTaken: 0,
      date: new Date().toDateString()
    };

    try {
      const stored = localStorage.getItem(BreakTracker.HISTORY_KEY);
      if (!stored) return defaultHistory;

      const history = JSON.parse(stored);
      if (history.date !== new Date().toDateString()) {
        return defaultHistory;
      }
      return history;
    } catch (error) {
      console.error('Error loading break history:', error);
      return defaultHistory;
    }
  }

  private saveHistory() {
    const history = {
      lastBreakTime: this.lastBreakTime,
      breaksTaken: this.breaksTaken,
      date: new Date().toDateString()
    };
    localStorage.setItem(BreakTracker.HISTORY_KEY, JSON.stringify(history));
  }

  public updateSettings(newSettings: Partial<BreakSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(BreakTracker.STORAGE_KEY, JSON.stringify(this.settings));
  }

  public getSettings(): BreakSettings {
    return { ...this.settings };
  }

  public getTimeLeft(): number {
    return Math.max(0, 
      (this.lastBreakTime + this.settings.breakInterval * 60 * 1000) - Date.now()
    );
  }

  public getBreakProgress(): number {
    return (this.breaksTaken / this.settings.dailyBreakTarget) * 100;
  }

  public logBreak(): void {
    this.lastBreakTime = Date.now();
    this.breaksTaken++;
    this.saveHistory();
  }

  public getBreaksTaken(): number {
    return this.breaksTaken;
  }

  public needsBreak(): boolean {
    return this.getTimeLeft() <= 0;
  }
}