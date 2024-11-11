import React, { useState, useEffect, useRef } from 'react';
import { PythonIDECustomization } from './types';
import { AUTOSAVE_DELAY, DEFAULT_CUSTOMIZATION } from './constants';

export const usePythonIDEState = (fileContent: string | null, propCustomization: PythonIDECustomization) => {
    const [content, setContent] = useState(fileContent || '');
    const [editBuffer, setEditBuffer] = useState(fileContent || '');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [localCustomization, setLocalCustomization] = useState<PythonIDECustomization>({
        ...DEFAULT_CUSTOMIZATION,
        ...propCustomization
    });
    const [contentHeight, setContentHeight] = useState(0);
    const [showExecutionPanel, setShowExecutionPanel] = useState(false);
    const [isEditingEnabled, setIsEditingEnabled] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    useEffect(() => {
        setLocalCustomization({ ...DEFAULT_CUSTOMIZATION, ...propCustomization });
    }, [propCustomization]);

    return {
        content,
        setContent,
        editBuffer,
        setEditBuffer,
        isFlowVisible,
        setIsFlowVisible,
        isRefreshing,
        setIsRefreshing,
        isRunning,
        setIsRunning,
        localCustomization,
        contentHeight,
        setContentHeight,
        showExecutionPanel,
        setShowExecutionPanel,
        isEditingEnabled,
        setIsEditingEnabled,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        isAutoSaving,
        setIsAutoSaving
    };
};
