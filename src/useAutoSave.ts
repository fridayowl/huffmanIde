import { useEffect, useRef } from 'react';
import { AUTOSAVE_DELAY } from './constants';

export const useAutoSave = (
    isEditingEnabled: boolean,
    hasUnsavedChanges: boolean,
    handleSave: (isAutoSave: boolean) => void
) => {
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastEditTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        if (isEditingEnabled && hasUnsavedChanges) {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }

            autoSaveTimerRef.current = setTimeout(() => {
                const timeSinceLastEdit = Date.now() - lastEditTimeRef.current;
                if (timeSinceLastEdit >= AUTOSAVE_DELAY) {
                    handleSave(true);
                }
            }, AUTOSAVE_DELAY);
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [isEditingEnabled, hasUnsavedChanges, handleSave]);

    return { lastEditTimeRef };
};