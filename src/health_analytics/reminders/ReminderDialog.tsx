import React from 'react';
import { X } from 'lucide-react';

interface ReminderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    settings: {
        interval: number;
        notificationsEnabled: boolean;
    };
    onSettingsChange: (settings: any) => void;
    variant: 'water' | 'break';
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
    isOpen,
    onClose,
    title,
    settings,
    onSettingsChange,
    variant
}) => {
    if (!isOpen) return null;

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const buttonClasses = variant === 'water'
        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
        : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400';

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-72 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg"
                onClick={handleContainerClick}
            >
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700/50 rounded-lg"
                        aria-label="Close settings"
                    >
                        <X className="w-3 h-3 text-gray-400" />
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="interval" className="text-xs text-gray-400">
                            Interval (minutes)
                        </label>
                        <input
                            id="interval"
                            type="number"
                            value={settings.interval}
                            onChange={(e) => onSettingsChange({
                                ...settings,
                                interval: Math.max(1, parseInt(e.target.value))
                            })}
                            className="w-full mt-1 px-2 py-1.5 text-sm bg-gray-700/50 rounded-lg text-white"
                            min="1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="notifications"
                            type="checkbox"
                            checked={settings.notificationsEnabled}
                            onChange={(e) => onSettingsChange({
                                ...settings,
                                notificationsEnabled: e.target.checked
                            })}
                            className="rounded bg-gray-700/50"
                        />
                        <label
                            htmlFor="notifications"
                            className="text-xs text-gray-400 cursor-pointer"
                        >
                            Enable notifications
                        </label>
                    </div>
                    <button
                        onClick={onClose}
                        className={`w-full py-1.5 text-sm rounded-lg transition-colors ${buttonClasses}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderDialog;