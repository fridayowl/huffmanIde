interface TimerState {
    timeLeft: number;
    isActive: boolean;
    lastUpdateTime: number;
}

interface TimerSettings {
    interval: number;
    notificationsEnabled: boolean;
}

export const TIMER_KEYS = {
    BREAK: 'break-timer',
    WATER: 'water-timer',
    BREAK_SETTINGS: 'break-settings',
    WATER_SETTINGS: 'water-settings'
} as const;

export const getStoredTimer = (key: string): TimerState => {
    const stored = localStorage.getItem(key);
    if (!stored) return { timeLeft: 0, isActive: false, lastUpdateTime: Date.now() };
    
    const timer = JSON.parse(stored);
    if (timer.isActive) {
        const elapsed = Date.now() - timer.lastUpdateTime;
        timer.timeLeft = Math.max(0, timer.timeLeft - elapsed);
        timer.lastUpdateTime = Date.now();
        localStorage.setItem(key, JSON.stringify(timer));
    }
    return timer;
};

export const setStoredTimer = (key: string, state: TimerState) => {
    localStorage.setItem(key, JSON.stringify({
        ...state,
        lastUpdateTime: Date.now()
    }));
};

export const getStoredSettings = (key: string): TimerSettings => {
    const stored = localStorage.getItem(key);
    if (key.includes('break')) {
        return stored ? JSON.parse(stored) : { interval: 1, notificationsEnabled: true };
    }
    return stored ? JSON.parse(stored) : { interval: 60, notificationsEnabled: true };
};

export const setStoredSettings = (key: string, settings: TimerSettings) => {
    localStorage.setItem(key, JSON.stringify(settings));
};
