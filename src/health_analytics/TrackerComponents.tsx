import React, { useState, useEffect } from 'react';
import { Droplets, Coffee, Settings2 } from 'lucide-react';
import { WaterTracker } from './WaterTracker';
import { BreakTracker } from './BreakTracker';

interface WaterSettingsProps {
    settings: {
        waterInterval: number;
        waterIntakeAmount: number;
        dailyTarget: number;
    };
    onSave: (settings: any) => void;
}

interface BreakSettingsProps {
    settings: {
        breakInterval: number;
        breakDuration: number;
        dailyBreakTarget: number;
    };
    onSave: (settings: any) => void;
}

export const WaterIntakeCard: React.FC<{
    waterTracker: WaterTracker;
    onSettingsOpen: () => void;
}> = ({ waterTracker, onSettingsOpen }) => {
    const [timeLeft, setTimeLeft] = useState(waterTracker.getTimeLeft());
    const [waterLevel, setWaterLevel] = useState(waterTracker.getWaterLevel());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(waterTracker.getTimeLeft());
            setWaterLevel(waterTracker.getWaterLevel());
        }, 1000);

        return () => clearInterval(interval);
    }, [waterTracker]);

    return (
        <div className="relative w-[300px] h-[300px] bg-gradient-to-br from-cyan-950 to-cyan-900 rounded-xl border border-white/5 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                </div>
                <button
                    onClick={onSettingsOpen}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Settings2 className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Water Intake</h3>
                <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white">
                    {Math.ceil(timeLeft / 60000)}min
                </div>
            </div>

            <div className="relative h-40 w-20 mx-auto mb-4 bg-white/5 rounded-lg overflow-hidden">
                <div
                    className="absolute bottom-0 w-full bg-cyan-400/80 transition-all duration-1000 rounded-lg"
                    style={{ height: `${waterLevel}%` }}
                />
            </div>

            <button
                onClick={() => {
                    waterTracker.logWaterIntake();
                    setWaterLevel(waterTracker.getWaterLevel());
                    setTimeLeft(waterTracker.getTimeLeft());
                }}
                className="w-full py-2 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 rounded-lg transition-colors"
            >
                Log Water Intake
            </button>
        </div>
    );
};

export const BreakReminderCard: React.FC<{
    breakTracker: BreakTracker;
    onSettingsOpen: () => void;
}> = ({ breakTracker, onSettingsOpen }) => {
    const [timeLeft, setTimeLeft] = useState(breakTracker.getTimeLeft());
    const [breakProgress, setBreakProgress] = useState(breakTracker.getBreakProgress());
    const totalTime = breakTracker.getSettings().breakInterval * 60 * 1000;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(breakTracker.getTimeLeft());
            setBreakProgress(breakTracker.getBreakProgress());
        }, 1000);

        return () => clearInterval(interval);
    }, [breakTracker]);

    const progress = (timeLeft / totalTime) * 100;

    return (
        <div className="relative w-[300px] h-[300px] bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl border border-white/5 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    <Coffee className="w-5 h-5 text-purple-400" />
                </div>
                <button
                    onClick={onSettingsOpen}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Settings2 className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Break Reminder</h3>
                <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white">
                    {breakTracker.getBreaksTaken()} of {breakTracker.getSettings().dailyBreakTarget}
                </div>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ffffff10"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000"
                    />
                    <text
                        x="50"
                        y="50"
                        dy="0.3em"
                        textAnchor="middle"
                        fill="white"
                        className="text-3xl font-bold"
                    >
                        {Math.ceil(timeLeft / 60000)}m
                    </text>
                </svg>
            </div>

            <button
                onClick={() => {
                    breakTracker.logBreak();
                    setTimeLeft(breakTracker.getTimeLeft());
                    setBreakProgress(breakTracker.getBreakProgress());
                }}
                className="w-full py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 rounded-lg transition-colors"
            >
                Start Break
            </button>
        </div>
    );
};

export const WaterSettings: React.FC<WaterSettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-white">Water Settings</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Reminder Interval (minutes)</label>
                    <input
                        type="number"
                        name="waterInterval"
                        value={formData.waterInterval}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="1"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Intake Amount (ml)</label>
                    <input
                        type="number"
                        name="waterIntakeAmount"
                        value={formData.waterIntakeAmount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="50"
                        step="50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Daily Target (ml)</label>
                    <input
                        type="number"
                        name="dailyTarget"
                        value={formData.dailyTarget}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="500"
                        step="100"
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
                Save Water Settings
            </button>
        </div>
    );
};

export const BreakSettings: React.FC<BreakSettingsProps> = ({ settings, onSave }) => {
    const [formData, setFormData] = useState(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-white">Break Settings</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Break Interval (minutes)</label>
                    <input
                        type="number"
                        name="breakInterval"
                        value={formData.breakInterval}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="1"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Break Duration (minutes)</label>
                    <input
                        type="number"
                        name="breakDuration"
                        value={formData.breakDuration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="1"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Daily Break Target</label>
                    <input
                        type="number"
                        name="dailyBreakTarget"
                        value={formData.dailyBreakTarget}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                        min="1"
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
                Save Break Settings
            </button>
        </div>
    );
};