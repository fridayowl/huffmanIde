interface WaterSettings {
  waterInterval: number; // in minutes
  waterIntakeAmount: number; // in ml
  dailyTarget: number; // in ml
}

export class WaterTracker {
  private static readonly STORAGE_KEY = 'water_tracker_settings';
  private static readonly HISTORY_KEY = 'water_intake_history';
  private settings: WaterSettings;
  private lastIntakeTime: number;
  private todayIntake: number;

  constructor() {
    this.settings = this.loadSettings();
    const history = this.loadHistory();
    this.lastIntakeTime = history.lastIntakeTime || Date.now();
    this.todayIntake = history.todayIntake || 0;
  }

  private loadSettings(): WaterSettings {
    const defaultSettings: WaterSettings = {
      waterInterval: 60,
      waterIntakeAmount: 250,
      dailyTarget: 2500
    };

    try {
      const stored = localStorage.getItem(WaterTracker.STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (error) {
      console.error('Error loading water settings:', error);
      return defaultSettings;
    }
  }

  private loadHistory() {
    const defaultHistory = {
      lastIntakeTime: Date.now(),
      todayIntake: 0,
      date: new Date().toDateString()
    };

    try {
      const stored = localStorage.getItem(WaterTracker.HISTORY_KEY);
      if (!stored) return defaultHistory;

      const history = JSON.parse(stored);
      if (history.date !== new Date().toDateString()) {
        return defaultHistory;
      }
      return history;
    } catch (error) {
      console.error('Error loading water history:', error);
      return defaultHistory;
    }
  }

  private saveHistory() {
    const history = {
      lastIntakeTime: this.lastIntakeTime,
      todayIntake: this.todayIntake,
      date: new Date().toDateString()
    };
    localStorage.setItem(WaterTracker.HISTORY_KEY, JSON.stringify(history));
  }

  public updateSettings(newSettings: Partial<WaterSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(WaterTracker.STORAGE_KEY, JSON.stringify(this.settings));
  }

  public getSettings(): WaterSettings {
    return { ...this.settings };
  }

  public getTimeLeft(): number {
    return Math.max(0, 
      (this.lastIntakeTime + this.settings.waterInterval * 60 * 1000) - Date.now()
    );
  }

  public getWaterLevel(): number {
    return (this.todayIntake / this.settings.dailyTarget) * 100;
  }

  public logWaterIntake(amount?: number): void {
    const intakeAmount = amount || this.settings.waterIntakeAmount;
    this.lastIntakeTime = Date.now();
    this.todayIntake += intakeAmount;
    this.saveHistory();
  }

  public getTodayIntake(): number {
    return this.todayIntake;
  }

  public needsWater(): boolean {
    return this.getTimeLeft() <= 0;
  }
}