import React, { useRef, useEffect, useCallback, forwardRef, useState, useImperativeHandle } from 'react';
import { EditorHeader } from './EditorHeader';
import ExecutePython from './ExecutePython';
import { EditorCore } from './EditorCore';
import { usePythonIDEState } from './usePythonIDEState';
import { useCursorManagement } from './useCursorManagement';
import { useKeyboardHandlers } from './useKeyboardHandlers';
import type { PythonIDEProps, PythonIDEHandle } from './types';
import { standardizePythonCharacters } from './standardizePythonCharacters';
import IDEDialog from './IDEDialog';


const LINE_HEIGHT = 20;
const HEADER_HEIGHT = 40;
const EXTRA_LINES = 2;
const BOTTOM_PADDING = 20;

const PythonIDE = forwardRef<PythonIDEHandle, PythonIDEProps>(({
    fileContent,
    onCodeChange,
    onBlockCodeChange,
    fileName,
    onFlowVisibilityChange,
    customization: propCustomization,
    onClose, 
}, ref) => {
    // Refs
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Custom hooks for state and functionality
    const {
        content,
        setContent,
        editBuffer,
        setEditBuffer,
        isFlowVisible,
        setIsFlowVisible,
        isRunning,
        setIsRunning,
        localCustomization,
        contentHeight,
        setContentHeight,
        showExecutionPanel,
        setShowExecutionPanel, 
    } = usePythonIDEState(fileContent, propCustomization);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Update the key to reload
   
    const handleHeaderClick = useCallback(() => {
        setIsDialogOpen(true);
    }, []);
    useImperativeHandle(ref, () => ({
        handleBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => {
            // Break content into lines
            const lines = content.split('\n');
            const blockName = id.split('.').pop() || '';

            // Create regex patterns for different block types
            const classDeclarationRegex = new RegExp(`class\\s+${blockName}\\s*:`, 'g');
            const functionDeclarationRegex = new RegExp(`def\\s+${blockName}\\s*\\(`, 'g');
            const isStandaloneBlock = id.includes('Block_') || blockName.startsWith('standalone_');

            // Find block bounds
            let blockStart = -1;
            let blockEnd = -1;
            let indentationLevel = 0;

            if (isStandaloneBlock) {
                blockStart = lineNumber - 1;  // Adjust for 0-based index

                // Find the end of the standalone block
                for (let i = blockStart; i < lines.length; i++) {
                    const currentLine = lines[i].trim();
                    if (currentLine.startsWith('class ') || currentLine.startsWith('def ')) {
                        blockEnd = i;
                        break;
                    }
                    if (i === lines.length - 1) {
                        blockEnd = lines.length;
                    }
                }
            } else {
                // Find the block to replace for classes and functions
                for (let i = 0; i < lines.length; i++) {
                    const currentLine = lines[i];

                    // Check for class or function declaration
                    if (classDeclarationRegex.test(currentLine)) {
                        blockStart = i;
                        indentationLevel = currentLine.length - currentLine.trimLeft().length;
                    } else if (functionDeclarationRegex.test(currentLine)) {
                        blockStart = i;
                        indentationLevel = currentLine.length - currentLine.trimLeft().length;
                    }

                    if (blockStart !== -1) {
                        // Find block end
                        for (let j = i + 1; j < lines.length; j++) {
                            const nextLine = lines[j];
                            const nextLineIndentation = nextLine.length - nextLine.trimLeft().length;

                            // Check for end of block based on indentation
                            if (nextLine.trim() !== '' && nextLineIndentation <= indentationLevel) {
                                blockEnd = j;
                                break;
                            }

                            // Handle case where block extends to end of file
                            if (j === lines.length - 1) {
                                blockEnd = j + 1;
                            }
                        }
                        break;
                    }
                }
            }

            // If block found, replace it
            if (blockStart !== -1 && blockEnd !== -1) {
                // For functions that are part of a class, adjust indentation
                let adjustedNewCode = [...newCode];
                if (!isStandaloneBlock && id.includes('.')) {
                    const baseIndentation = ' '.repeat(indentationLevel);
                    adjustedNewCode = newCode.map(line =>
                        line.trim() ? baseIndentation + line : line
                    );
                }

                const updatedLines = [
                    ...lines.slice(0, blockStart),
                    ...adjustedNewCode,
                    ...lines.slice(blockEnd)
                ];

                const updatedContent = updatedLines.join('\n');
                setContent(updatedContent);
                setEditBuffer(updatedContent);
                updateContentHeight(updatedContent);
                onCodeChange(updatedContent, lineNumber);
                onFlowVisibilityChange(false);

                setRefreshKey(prev => prev + 1)
                // Update local storage
                if (fileName) {
                    localStorage.setItem(`file_${fileName}`, updatedContent);
                }
            }
        }
    }));
    const { getCursorPosition, setCursorPosition } = useCursorManagement(editorRef);
    const { handleKeyDown } = useKeyboardHandlers(
        editorRef,
        getCursorPosition,
        setCursorPosition,
        setEditBuffer
    );

    const [lastTap, setLastTap] = useState(0);
    const DOUBLE_TAP_DELAY = 300; // milliseconds

    // Handle double tap/click for editor area
    const handleEditorTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent text selection on double click
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;

        if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
            // Double tap occurred
            setIsDialogOpen(true);
        }

        setLastTap(now);
    }, [lastTap]);
    
    // Utility functions
    const updateContentHeight = useCallback((text: string) => {
        const lines = text.split('\n').length;
        setContentHeight((lines + EXTRA_LINES) * LINE_HEIGHT + HEADER_HEIGHT + BOTTOM_PADDING + 80 );
    }, [setContentHeight]);

    // Effect to update content when file changes
    useEffect(() => {
       
        if (fileContent !== null) {
            const standardizedContent = standardizePythonCharacters(fileContent);
            setContent(standardizedContent);
            setEditBuffer(standardizedContent);
            updateContentHeight(standardizedContent);
        }
    }, [fileContent, setContent, setEditBuffer, updateContentHeight]);


    const handleRun = useCallback(() => {
        setIsRunning(true);
        setShowExecutionPanel(true);

        setTimeout(() => {
            setIsRunning(false);
        }, 500);
    }, [setIsRunning, setShowExecutionPanel]);

    const handleToggleFlow = useCallback(() => {
        setIsFlowVisible(prev => !prev);
        if (onFlowVisibilityChange) {
            onFlowVisibilityChange(!isFlowVisible);
        }

    }, [isFlowVisible, onFlowVisibilityChange, setIsFlowVisible]);

 
    const handleIDEDialogSave = useCallback((newContent: string) => {
        try {
             
            // First, update the file in localStorage
            if (fileName) {
                // Store the new content in localStorage with the file_ prefix
                localStorage.setItem(`file_${fileName}`, newContent);
               
                // Also update any related stored documentation
                const docFileName = `${fileName}.documentation.json`;
                const existingDocs = localStorage.getItem(docFileName);
                if (existingDocs) {
                    try {
                        const docs = JSON.parse(existingDocs);
                        // Update the last modified timestamp for documentation
                        Object.keys(docs).forEach(key => {
                            docs[key].lastModified = new Date().toISOString();
                        });
                        localStorage.setItem(docFileName, JSON.stringify(docs));
                    } catch (docError) {
                        console.error('Error updating documentation:', docError);
                    }
                }

                // Get the current line number - default to line 1 if we can't determine it
                const lines = newContent.split('\n');
                const cursorState = getCursorPosition();
                const lineNumber = cursorState ? cursorState.lineNumber : 1;

                // Notify parent component of changes with the line number
                if (onCodeChange) {
                    onCodeChange(newContent, lineNumber);
                }
            }

            // Update local state
            setContent(newContent);
            //setEditBuffer(newContent);

            // Update content height to accommodate new content
            updateContentHeight(newContent);
            onFlowVisibilityChange(false);
            
           setRefreshKey(prev => prev +1 )
            return true; // Indicate successful save
            
        } catch (error) {
            console.error('Error saving file content:', error);
            return false; // Indicate failed save
        }
    }, [fileName, onCodeChange, onBlockCodeChange, setContent, setEditBuffer, updateContentHeight, getCursorPosition]); 
    
    useEffect(() => {
            onFlowVisibilityChange(true);
        
    }, [refreshKey, fileContent, updateContentHeight]);
    return (
        <div
            ref={containerRef}
            className="w-[600px] rounded-lg shadow-md overflow-hidden flex flex-col"
            style={{
                backgroundColor: localCustomization.backgroundColor,
                height: `${contentHeight}px`
            }}
        >
            <EditorHeader
                fileName={fileName}
                isRunning={isRunning}
                onHeaderClick={handleHeaderClick}
                isFlowVisible={isFlowVisible}
                onRun={handleRun}
                onToggleFlow={handleToggleFlow}
                onClose={onClose}
                style={{
                    backgroundColor: localCustomization.highlightColor,
                    color: localCustomization.textColor,
                    height: `${HEADER_HEIGHT}px`
                }}
            />
            <div
                className="relative group"
                onClick={handleEditorTap}
                onTouchEnd={handleEditorTap}
            >
                {/* Hover hint */}
                <div className="absolute top-2 right-2 bg-blue-500/10 px-3 py-1 rounded-full 
                              opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 
                              pointer-events-none">
                    <span className="text-xs text-blue-400">Double click to expand</span>
                </div>

                {/* Add subtle highlight on hover */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 
                              transition-all duration-300 pointer-events-none" />

            <EditorCore
                editorRef={editorRef} 
                content={content}  
                lineHeight={LINE_HEIGHT}
                contentHeight={contentHeight}
                headerHeight={HEADER_HEIGHT}
                customization={localCustomization}
            />


            {showExecutionPanel && (
                <div className="border-t border-gray-700">
                    <ExecutePython
                        fileName={fileName}
                        currentCode={content}
                        onClose={() => setShowExecutionPanel(false)}
                        customization={{
                            backgroundColor: localCustomization.backgroundColor,
                            textColor: localCustomization.textColor,
                            highlightColor: localCustomization.highlightColor
                        }}
                    />
                </div>
            )}
            </div>
            {isDialogOpen && (
                <IDEDialog
                    code={content}
                    fileName={fileName}
                    onClose={() => setIsDialogOpen(false)}
                    customization={localCustomization}
                    onCodeChange={handleIDEDialogSave}
                    blockId='Overall'
                    sourceType="ide"
                />
            )}
        </div>
    );
});

export default PythonIDE;