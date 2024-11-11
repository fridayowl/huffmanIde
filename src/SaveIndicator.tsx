// SaveIndicator.tsx
import React from 'react';

interface SaveIndicatorProps {
    hasUnsavedChanges: boolean;
    isAutoSaving: boolean;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
    hasUnsavedChanges,
    isAutoSaving
}) => {
    if (isAutoSaving) {
        return (
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full animate-pulse">
                Saving...
            </span>
        );
    }

    if (hasUnsavedChanges) {
        return (
            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                Unsaved changes
            </span>
        );
    }

    return null;
};
