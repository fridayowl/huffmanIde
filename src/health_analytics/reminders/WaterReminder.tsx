import React, { useState, useEffect } from 'react';
import { Droplets, Settings, Bell, BellOff } from 'lucide-react';
import { CircularTimer } from './CircularTimer';

import ReminderDialog from './ReminderDialog';
import { TIMER_KEYS, getStoredTimer, setStoredTimer, getStoredSettings, setStoredSettings } from './timerUtils';

export const WaterReminder: React.FC = () => {
    const [settings, setSettings] = useState(() =>
        getStoredSettings(TIMER_KEYS.WATER_SETTINGS)
    );

    const [timer, setTimer] = useState(() =>
        getStoredTimer(TIMER_KEYS.WATER)
    );

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const storedTimer = getStoredTimer(TIMER_KEYS.WATER);
        setTimer(storedTimer);

        const interval = window.setInterval(() => {  // Added window.
            setTimer(prev => {
                if (!prev.isActive) return prev;

                const newTimeLeft = Math.max(0, prev.timeLeft - 1000);
                const newState = {
                    ...prev,
                    timeLeft: newTimeLeft,
                    lastUpdateTime: Date.now()
                };

                setStoredTimer(TIMER_KEYS.WATER, newState);
                return newState;
            });
        }, 1000);

        return () => window.clearInterval(interval);  // Added window.
    }, [settings]);

    const handleSettingsChange = (newSettings: typeof settings) => {
        setSettings(newSettings);
        setStoredSettings(TIMER_KEYS.WATER_SETTINGS, newSettings);
    };

    const handleTimerToggle = () => {
        const newState = {
            timeLeft: settings.interval * 60 * 1000,
            isActive: !timer.isActive,
            lastUpdateTime: Date.now()
        };
        setTimer(newState);
        setStoredTimer(TIMER_KEYS.WATER, newState);
    };

    return (
        <div className="w-48 h-48 bg-gradient-to-br from-cyan-800 to-cyan-900 rounded-xl shadow-lg">
            <div className="h-full p-3 flex flex-col">
                <div className="flex justify-between items-center mb-1">
                    <Droplets className="w-4 h-4 text-cyan-300" />
                    <div className="flex gap-3">
                        {settings.notificationsEnabled ? (
                            <Bell className="w-4 h-4 text-cyan-300" />
                        ) : (
                            <BellOff className="w-4 h-4 text-gray-400" />
                        )}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="hover:bg-cyan-300/10 rounded transition-colors"
                        >
                            <Settings className="w-4 h-4 text-cyan-300" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center -mt-2">
                    <div className="text-center">
                        <CircularTimer
                            progress={timer.isActive ? timer.timeLeft / (settings.interval * 60 * 1000) : 0}
                            color="#67e8f9"
                            size={70}
                        />
                        <div className="mt-1 text-base font-medium text-cyan-100">
                            {timer.isActive ? `${Math.ceil(timer.timeLeft / 60000)}m` : 'Paused'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleTimerToggle}
                    className="w-full py-1.5 bg-cyan-300/20 hover:bg-cyan-300/30 
                             text-cyan-200 text-xs font-medium rounded-lg transition-all
                             border border-cyan-300/20"
                >
                    {timer.isActive ? 'Reset Timer' : 'Start Timer'}
                </button>
            </div>

            <ReminderDialog
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title="Water Reminder Settings"
                settings={settings}
                onSettingsChange={handleSettingsChange}
                variant="water"
            />
        </div>
    );
};
