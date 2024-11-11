// useEditorState.ts
import { useState, useCallback } from 'react';

interface EditorState {
    isEditingEnabled: boolean;
    hasUnsavedChanges: boolean;
    isAutoSaving: boolean;
}

export function useEditorState() {
    const [state, setState] = useState<EditorState>({
        isEditingEnabled: false,
        hasUnsavedChanges: false,
        isAutoSaving: false
    });

    const enableEditing = useCallback(() => {
        setState(prev => ({ ...prev, isEditingEnabled: true }));
    }, []);

    const disableEditing = useCallback(() => {
        setState(prev => ({ ...prev, isEditingEnabled: false }));
    }, []);

    const setHasChanges = useCallback((hasChanges: boolean) => {
        setState(prev => ({ ...prev, hasUnsavedChanges: hasChanges }));
    }, []);

    const startAutoSave = useCallback(() => {
        setState(prev => ({ ...prev, isAutoSaving: true }));
    }, []);

    const endAutoSave = useCallback(() => {
        setState(prev => ({ ...prev, isAutoSaving: false }));
    }, []);

    return {
        ...state,
        enableEditing,
        disableEditing,
        setHasChanges,
        startAutoSave,
        endAutoSave
    };
}