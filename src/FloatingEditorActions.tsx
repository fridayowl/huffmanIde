import React, { useState, useEffect } from 'react';
import { Edit, Save, Loader2, Check, AlertTriangle } from 'lucide-react';

interface FloatingEditorActionsProps {
    isEditingEnabled: boolean;
    hasUnsavedChanges: boolean;
    isAutoSaving: boolean;
    onToggleEditing: () => void;
    onSave: () => void;
}

const FloatingEditorActions: React.FC<FloatingEditorActionsProps> = ({
    isEditingEnabled,
    hasUnsavedChanges,
    isAutoSaving,
    onToggleEditing,
    onSave
}) => {
    const [showSaveIndicator, setShowSaveIndicator] = useState<boolean>(false);
    const [saveMessage, setSaveMessage] = useState<string>('');

    // Handle save indicator visibility and messages
    useEffect(() => {
        if (isAutoSaving) {
            setShowSaveIndicator(true);
            setSaveMessage('Auto-saving...');
        } else if (hasUnsavedChanges) {
            setShowSaveIndicator(true);
            setSaveMessage('Unsaved changes');
        } else {
            setShowSaveIndicator(false);
            setSaveMessage('');
        }
    }, [isAutoSaving, hasUnsavedChanges]);

    return (
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
            {/* Save Status Indicator - Slides in from right */}
            {showSaveIndicator && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/90 text-white shadow-lg backdrop-blur-sm animate-slideInRight">
                    {isAutoSaving ? (
                        <>
                            <Loader2 size={14} className="animate-spin text-blue-400" />
                            <span className="text-xs text-blue-400">Auto-saving...</span>
                        </>
                    ) : hasUnsavedChanges ? (
                        <>
                            <AlertTriangle size={14} className="text-amber-400" />
                            <span className="text-xs text-amber-400">Unsaved changes</span>
                        </>
                    ) : (
                        <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-xs text-green-400">All changes saved</span>
                        </>
                    )}
                </div>
            )}

            {/* Edit/Save FAB */}
            <button
                onClick={isEditingEnabled ? onSave : onToggleEditing}
                className="group relative flex items-center gap-2 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 blur-md group-hover:opacity-50 transition-opacity" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon and label container */}
                <div className="relative flex items-center gap-2">
                    {isEditingEnabled ? (
                        <>
                            <Save size={20} />
                            <span className="text-sm font-medium pr-1">Save</span>
                        </>
                    ) : (
                        <>
                            <Edit size={20} />
                            <span className="text-sm font-medium pr-1">Edit</span>
                        </>
                    )}
                </div>
            </button>

            <style >{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease forwards;
        }
      `}</style>
        </div>
    );
};

export default FloatingEditorActions;
