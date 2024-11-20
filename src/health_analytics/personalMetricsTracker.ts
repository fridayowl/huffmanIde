export interface MoodEntry {
    value: 1 | 2 | 3 | 4 | 5;
    timestamp: number;
    note?: string;
}

export interface FocusEntry {
    score: number;
    startTime: number;
    endTime: number;
    distractions: number;
}

export interface EnergyEntry {
    level: number;
    timestamp: number;
    factors: {
        sleep?: number;
        caffeine?: number;
        exercise?: number;
    };
}

export class PersonalMetricsTracker {
    private static readonly STORAGE_KEY = 'personal_metrics';
    
    private metrics: {
        moods: MoodEntry[];
        focusSessions: FocusEntry[];
        energyLevels: EnergyEntry[];
        dailyStressLevel: number;
        lastUpdate: number;
    };

    constructor() {
        this.metrics = this.loadMetrics();
    }

    private loadMetrics() {
        const defaultMetrics = {
            moods: [],
            focusSessions: [],
            energyLevels: [],
            dailyStressLevel: 0,
            lastUpdate: Date.now()
        };

        try {
            const stored = localStorage.getItem(PersonalMetricsTracker.STORAGE_KEY);
            if (!stored) return defaultMetrics;

            const parsed = JSON.parse(stored);
            if (!this.isSameDay(new Date(parsed.lastUpdate))) {
                return defaultMetrics;
            }
            return parsed;
        } catch (error) {
            console.error('Error loading personal metrics:', error);
            return defaultMetrics;
        }
    }

    private saveMetrics() {
        try {
            localStorage.setItem(
                PersonalMetricsTracker.STORAGE_KEY,
                JSON.stringify(this.metrics)
            );
        } catch (error) {
            console.error('Error saving personal metrics:', error);
        }
    }

    private isSameDay(date: Date): boolean {
        const now = new Date();
        return date.getDate() === now.getDate() &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }

    public logMood(mood: MoodEntry) {
        this.metrics.moods.push(mood);
        this.metrics.lastUpdate = Date.now();
        this.saveMetrics();
    }

    public startFocusSession(): number {
        const sessionId = Date.now();
        this.metrics.focusSessions.push({
            score: 0,
            startTime: sessionId,
            endTime: 0,
            distractions: 0
        });
        this.saveMetrics();
        return sessionId;
    }

    public endFocusSession(sessionId: number, score: number) {
        const session = this.metrics.focusSessions.find(s => s.startTime === sessionId);
        if (session) {
            session.endTime = Date.now();
            session.score = score;
            this.saveMetrics();
        }
    }

    public logDistraction(sessionId: number) {
        const session = this.metrics.focusSessions.find(s => s.startTime === sessionId);
        if (session) {
            session.distractions++;
            this.saveMetrics();
        }
    }

    public updateEnergyLevel(energy: EnergyEntry) {
        this.metrics.energyLevels.push(energy);
        this.metrics.lastUpdate = Date.now();
        this.saveMetrics();
    }

    public updateStressLevel(level: number) {
        this.metrics.dailyStressLevel = level;
        this.metrics.lastUpdate = Date.now();
        this.saveMetrics();
    }

    public getDailyAverageMood(): number {
        if (this.metrics.moods.length === 0) return 0;
        const sum = this.metrics.moods.reduce((acc, mood) => acc + mood.value, 0);
        return sum / this.metrics.moods.length;
    }

    public getAverageFocusScore(): number {
        const completedSessions = this.metrics.focusSessions.filter(s => s.endTime > 0);
        if (completedSessions.length === 0) return 0;
        const sum = completedSessions.reduce((acc, session) => acc + session.score, 0);
        return sum / completedSessions.length;
    }

    public getCurrentEnergyLevel(): number {
        if (this.metrics.energyLevels.length === 0) return 0;
        return this.metrics.energyLevels[this.metrics.energyLevels.length - 1].level;
    }

    public getMetrics() {
        return {
            averageMood: this.getDailyAverageMood(),
            focusScore: this.getAverageFocusScore(),
            energyLevel: this.getCurrentEnergyLevel(),
            stressLevel: this.metrics.dailyStressLevel,
            totalFocusSessions: this.metrics.focusSessions.length,
            moodTrend: this.metrics.moods.slice(-5)
        };
    }
}