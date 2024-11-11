import React, { createContext, useContext, useState, useEffect } from 'react';

interface EditorContextType {
    isEditingEnabled: boolean;
    hasUnsavedChanges: boolean;
    isAutoSaving: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
    setHasChanges: (hasChanges: boolean) => void;
    startAutoSave: () => void;
    endAutoSave: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Custom hook to manage editor state
function useEditorState(): EditorContextType {
    const [isEditingEnabled, setIsEditingEnabled] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    const enableEditing = () => setIsEditingEnabled(true);
    const disableEditing = () => setIsEditingEnabled(false);

    const setHasChanges = (hasChanges: boolean) => setHasUnsavedChanges(hasChanges);

    const startAutoSave = () => setIsAutoSaving(true);
    const endAutoSave = () => setIsAutoSaving(false);

    return {
        isEditingEnabled,
        hasUnsavedChanges,
        isAutoSaving,
        enableEditing,
        disableEditing,
        setHasChanges,
        startAutoSave,
        endAutoSave,
    };
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const editorState = useEditorState();

    return (
        <>
            <EditorContext.Provider value={editorState}>
                {children}
            </EditorContext.Provider>
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}
            </style>
        </>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}
