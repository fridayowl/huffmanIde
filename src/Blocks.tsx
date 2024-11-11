import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube, AlertTriangle, Copy, Wand2, ScrollText, Play } from 'lucide-react';
import { checkPythonSyntax, SyntaxError } from './pythonsyntaxChecker';
import ComingSoon from './ComingSoon';
import BlockExecutionPanel from './BlockExecutionPannel';
import DocumentationDialog from './DocumentationDialog';
import FocusedTestPanel from './FocusedTestPanel';
import IDEDialog from './IDEDialog';
import PythonSyntaxHighlighter from './PythonSyntaxHighlighter';
import { BlockHeader } from './BlockHeader';


interface BlockProps {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    lineNumber?: number;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    customization: any;
    isConnectorVisible?: boolean;
    parentClass?: string;
    initialWidth: number;
    onWidthChange: (width: number) => void;
    onSelect: () => void;
    isSelected: boolean;
    fileName: string;
    isExecutionVisible?: boolean;
    height?: number;
    onHeightChange?: (height: number) => void;
    onTestingPanelChange: (blockId: string, isOpen: boolean) => void;
    isTestingPanelOpen?: boolean;
}

interface Documentation {
    [key: string]: {
        documentation: string;
        lastUpdated: string;
        author: string;
    };
}

const defaultBlockStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    textColor: '#000000',
    headerColor: '#f0f0f0'
};

const Block: React.FC<BlockProps> = ({
    id,
    type,
    name,
    location,
    author,
    fileType,
    code,
    lineNumber,
    onVisibilityChange,
    onBlockCodeChange,
    customization,
    isConnectorVisible = true,
    parentClass,
    initialWidth,
    onWidthChange,
    onSelect,
    isSelected,
    fileName,
    height,
    onHeightChange,
    onTestingPanelChange,
    isTestingPanelOpen = false,
}) => {
    // State management
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isDocumentationVisible, setIsDocumentationVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);
    const [calculatedWidth, setCalculatedWidth] = useState(initialWidth);
    const [syntaxErrors, setSyntaxErrors] = useState<SyntaxError[]>([]);
    const [hasSyntaxError, setHasSyntaxError] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isLogsVisible, setIsLogsVisible] = useState(false);
    const [isExecutionVisible, setIsExecutionVisible] = useState(false);
    const [blockHeight, setBlockHeight] = useState(height || 150);
    const [isTestingVisible, setIsTestingVisible] = useState(isTestingPanelOpen);
    const [lastTap, setLastTap] = useState(0);
    const DOUBLE_TAP_DELAY = 300;
    const [showDoubleTapHint, setShowDoubleTapHint] = useState(false);
    // Refs
    const codeRef = useRef<HTMLPreElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Add new state for IDE dialog
    const [showIDEDialog, setShowIDEDialog] = useState(false);

    // Handler for block header click
    const handleBlockHeaderClick = () => {
        setShowIDEDialog(true);
    };
    // Style
    const blockStyle = customization?.blocks?.[type] || defaultBlockStyle;
    // Handle double tap/click for the block
    const handleBlockTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;

        if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
            // Double tap occurred
            setShowIDEDialog(true);
        }

        setLastTap(now);
    }, [lastTap]);
    const handleMouseEnter = useCallback(() => {
        const timer = setTimeout(() => {
            setShowDoubleTapHint(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setShowDoubleTapHint(false);
    }, []);
    const calculateBlockHeight = useCallback(() => {
        let newHeight = 60; // Header height
        const lineCount = currentCode.split('\n').length;
        newHeight += lineCount * 20 + 40;

        if (isDetailsVisible) newHeight += 120;
        if (isDocumentationVisible) newHeight += 300;
        if (isTestingVisible) newHeight += 400;
        if (isExecutionVisible) newHeight += 300;
        if (syntaxErrors.length > 0) {
            newHeight += (syntaxErrors.length * 24) + 40;
        }

        return newHeight;
    }, [
        currentCode,
        isDetailsVisible,
        isDocumentationVisible,
        isTestingVisible,
        isExecutionVisible,
        syntaxErrors.length
    ]);

    // Syntax error handling
    const adjustErrorLineNumbers = (errors: SyntaxError[], blockLineNumber: number): SyntaxError[] => {
        return errors.map(error => ({
            ...error,
            line: error.line + blockLineNumber - 1
        }));
    };

    // Event handlers
    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCurrentCode(newCode);
        const errors = checkPythonSyntax(newCode);
        const adjustedErrors = adjustErrorLineNumbers(errors, lineNumber || 1);
        const validErrors = adjustedErrors.filter(error => error.line > 0);
        setSyntaxErrors(validErrors);
        setHasSyntaxError(validErrors.length > 0);
    };

    const handleSave = () => {
        setIsEditing(false);
        const codeLines = currentCode.split('\n');
        onBlockCodeChange(id, codeLines, lineNumber || 1);
    };

    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        if (action === (() => setIsEditing(true))) {
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 100);
        }
    };

    const handleCopyErrorAndCode = () => {
        const errorText = syntaxErrors.map(error => `Line ${error.line}: ${error.message}`).join('\n');
        const textToCopy = `Errors:\n${errorText}\n\nCode:\n${currentCode}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Errors and code copied to clipboard!');
        });
    };

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        onVisibilityChange(id, newVisibility);
    };

    const handleTestingClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newIsTestingVisible = !isTestingVisible;
        setIsTestingVisible(newIsTestingVisible);
        onTestingPanelChange(id, newIsTestingVisible);
    }, [id, isTestingVisible, onTestingPanelChange]);

    const handleExecutionClose = () => {
        setIsExecutionVisible(false);
    };

    // Render helpers
    const renderCodeWithLineNumbers = () => {
        const lines = currentCode.split('\n');
        const startLineNumber = lineNumber || 1;
        return (
            <div className="flex">
                {/* Line Numbers */}
                <div className="mr-4 font-mono text-gray-500 select-none" style={{ minWidth: '2em' }}>
                    {lines.map((_, index) => (
                        <div key={index} className="text-right">
                            {startLineNumber + index}
                        </div>
                    ))}
                </div>
                {/* Syntax Highlighted Code */}
                <div className="flex-1">
                    <PythonSyntaxHighlighter
                        code={currentCode}
                        customization={{
                            backgroundColor: 'transparent',
                            textColor: customization.ide?.textColor || '#000000'
                        }}
                    />
                </div>
            </div>
        );
    };


    const renderEditableCode = () => (
        <>
            <textarea
                ref={textareaRef}
                value={currentCode}
                onChange={handleCodeChange}
                className="w-full p-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={currentCode.split('\n').length}
                style={{
                    backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                    color: customization.ide?.textColor || '#000000',
                    paddingLeft: '20px',
                    resize: 'none',
                    minHeight: '100px',
                    caretColor: customization.ide?.textColor || '#000000',
                }}
                autoFocus
                spellCheck={false}
                onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const newValue = currentCode.substring(0, start) + '    ' + currentCode.substring(end);
                        setCurrentCode(newValue);
                        setTimeout(() => {
                            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                        }, 0);
                    }
                }}
            />
            <div className="mt-2 flex space-x-2">
                <button
                    onClick={(e) => handleButtonClick(e, handleSave)}
                    className="px-4 py-2 text-white rounded hover:bg-opacity-80 transition-colors duration-200 flex items-center"
                    style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                >
                    <Save size={16} className="mr-2" />
                    Save
                </button>
                {syntaxErrors.length > 0 && (
                    <>
                        <button
                            onClick={(e) => handleButtonClick(e, handleCopyErrorAndCode)}
                            className="px-4 py-2 text-white rounded hover:bg-opacity-80 flex items-center"
                            style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                        >
                            <Copy size={16} className="mr-2" />
                            Copy Error and Code
                        </button>
                        <button
                            onClick={(e) => handleButtonClick(e, () => setShowComingSoon(true))}
                            className="px-4 py-2 text-white rounded hover:bg-opacity-80 flex items-center"
                            style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                        >
                            <Wand2 size={16} className="mr-2" />
                            Fix using AI
                        </button>
                    </>
                )}
            </div>
        </>
    );

    const handleIdeCodeChange = useCallback((newCode: string) => {
        setCurrentCode(newCode);
        const errors = checkPythonSyntax(newCode);
        const adjustedErrors = adjustErrorLineNumbers(errors, lineNumber || 1);
        const validErrors = adjustedErrors.filter(error => error.line > 0);
        setSyntaxErrors(validErrors);
        setHasSyntaxError(validErrors.length > 0);

        // Split into lines and notify parent
        const codeLines = newCode.split('\n');
        onBlockCodeChange(id, codeLines, lineNumber || 1);
    }, [id, lineNumber, onBlockCodeChange]);


    // Effects
    useEffect(() => {
        setIsTestingVisible(isTestingPanelOpen);
    }, [isTestingPanelOpen]);

    useEffect(() => {
        const errors = checkPythonSyntax(currentCode);
        const adjustedErrors = adjustErrorLineNumbers(errors, lineNumber || 1);
        const validErrors = adjustedErrors.filter(error => error.line > 0);
        setSyntaxErrors(validErrors);
        setHasSyntaxError(validErrors.length > 0);
    }, [currentCode, lineNumber]);

    useEffect(() => {
        if (codeRef.current && containerRef.current) {
            const codeWidth = codeRef.current.scrollWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const newWidth = Math.max(codeWidth, containerWidth, initialWidth);

            if (newWidth !== calculatedWidth) {
                setCalculatedWidth(newWidth);
                onWidthChange(newWidth);
            }
        }
    }, [code, onWidthChange, calculatedWidth, initialWidth]);

    useEffect(() => {
        const newHeight = calculateBlockHeight();
        if (newHeight !== blockHeight) {
            setBlockHeight(newHeight);
            if (onHeightChange) {
                onHeightChange(newHeight);
            }
        }
    }, [calculateBlockHeight, blockHeight, onHeightChange]);

    if (!isConnectorVisible) {
        return null;
    }

    const glowEffectClass = isSelected ? 'ring-4 ring-green-500 shadow-xl shadow-blue-500/50' : '';
    const errorBorderStyle = hasSyntaxError ? {
        borderColor: 'red',
        borderWidth: '2px',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
    } : {};

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-3xl rounded-lg shadow-md overflow-hidden ${glowEffectClass}`}
            style={{
                ...errorBorderStyle,
                backgroundColor: blockStyle?.backgroundColor || defaultBlockStyle.backgroundColor,
                borderColor: hasSyntaxError ? 'red' : (blockStyle?.borderColor || defaultBlockStyle.borderColor),
                color: blockStyle?.textColor || defaultBlockStyle.textColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                paddingLeft: '20px',
                width: `850px`,
                cursor: 'pointer',
                height: `${blockHeight}px`,
                transition: 'height 0.3s ease-in-out',
                overflow: 'hidden'
            }}
            onClick={() => onSelect()}
           
        >
          
            {/* Header Section */}
            {/* <div className="p-2 flex justify-between items-center"
                onClick={handleBlockHeaderClick}
                style={{
                    backgroundColor: blockStyle?.headerColor || defaultBlockStyle.headerColor,
                    paddingLeft: '20px',
                    borderBottom: hasSyntaxError ? '2px solid red' : 'none'
                }}>
                <h3 className="font-bold text-lg flex items-center">
                    {hasSyntaxError && <AlertTriangle size={20} className="mr-2 text-red-500" />}
                    {name}
                    {lineNumber && <span className="ml-2 text-sm font-normal">(Line {lineNumber})</span>}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => handleButtonClick(e, () => setIsDetailsVisible(!isDetailsVisible))}
                        className={`p-1 rounded transition-all duration-200 ${isDetailsVisible ? 'shadow-lg' : 'hover:bg-opacity-80'}`}
                        title="Details"
                        style={{
                            backgroundColor: isDetailsVisible
                                ? `${customization.buttons?.backgroundColor}dd`
                                : customization.buttons?.backgroundColor,
                            color: customization.buttons?.textColor,
                            transform: isDetailsVisible ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isDetailsVisible ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                    >
                        <Info size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => setIsEditing(!isEditing))}
                        className={`p-1 rounded transition-all duration-200 ${isEditing ? 'shadow-lg' : 'hover:bg-opacity-80'}`}
                        title={isEditing ? "Save" : "Edit"}
                        style={{
                            backgroundColor: isEditing
                                ? `${customization.buttons?.backgroundColor}dd`
                                : customization.buttons?.backgroundColor,
                            color: customization.buttons?.textColor,
                            transform: isEditing ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isEditing ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                    >
                        {isEditing ? <Save size={16} /> : <Edit size={16} />}
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => setIsDocumentationVisible(!isDocumentationVisible))}
                        className={`p-1 rounded transition-all duration-200 ${isDocumentationVisible ? 'shadow-lg' : 'hover:bg-opacity-80'}`}
                        title="Documentation"
                        style={{
                            backgroundColor: isDocumentationVisible
                                ? `${customization.buttons?.backgroundColor}dd`
                                : customization.buttons?.backgroundColor,
                            color: customization.buttons?.textColor,
                            transform: isDocumentationVisible ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isDocumentationVisible ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        onClick={handleTestingClick}
                        className={`p-1 rounded transition-all duration-200 ${isTestingVisible ? 'shadow-lg' : 'hover:bg-opacity-80'}`}
                        title="Testing"
                        style={{
                            backgroundColor: isTestingVisible
                                ? `${customization.buttons?.backgroundColor}dd`
                                : customization.buttons?.backgroundColor,
                            color: customization.buttons?.textColor,
                            transform: isTestingVisible ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isTestingVisible ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                    >
                        <TestTube size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => setIsExecutionVisible(!isExecutionVisible))}
                        className={`p-1 rounded transition-all duration-200 ${isExecutionVisible ? 'shadow-lg' : 'hover:bg-opacity-80'}`}
                        title="Run Code"
                        style={{
                            backgroundColor: isExecutionVisible
                                ? `${customization.buttons?.backgroundColor}dd`
                                : customization.buttons?.backgroundColor,
                            color: customization.buttons?.textColor,
                            transform: isExecutionVisible ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: isExecutionVisible ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                        }}
                    >
                        <Play size={16} />
                    </button>
                </div>
            </div> */}
            <BlockHeader
                name={name}
                customization={blockStyle}
                onHeaderClick={handleBlockHeaderClick}
                
            />

            {/* Details Section */}
            {isDetailsVisible && (
                <div className="px-4 py-2 bg-gray-100" style={{ paddingLeft: '20px' }}>
                    <p className="text-sm">Type: {type}</p>
                    <p className="text-sm">File: {fileType}</p>
                    <p className="text-sm">Location: {location}</p>
                    <p className="text-sm">Author: {author}</p>
                    {lineNumber && <p className="text-sm">Line Number: {lineNumber}</p>}
                    {parentClass && <p className="text-sm">Parent Class: {parentClass}</p>}
                </div>
            )}

            {/* Code Section */}
            {isVisible && (
                <div className="p-4" style={{ paddingLeft: '20px' }} >
                    {isEditing ? (
                        renderEditableCode()
                    ) : (
                        <pre
                            ref={codeRef}
                            className="w-full p-2 border rounded overflow-auto font-mono text-sm"
                            style={{
                                backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                                color: customization.ide?.textColor || '#000000',
                                paddingLeft: '20px'
                            }}
                              
                            >
                            {renderCodeWithLineNumbers()}
                        </pre>
                    )}

                    {/* Syntax Errors */}
                    {syntaxErrors.length > 0 && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded">
                            <h4 className="font-semibold flex items-center">
                                <AlertTriangle size={16} className="mr-2 text-red-500" />
                                Syntax Errors:
                            </h4>
                            <ul className="list-disc list-inside">
                                {syntaxErrors.map((error, index) => (
                                    <li key={index} className="text-sm text-red-700">
                                        Line {error.line}: {error.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Documentation Dialog */}
            {isDocumentationVisible && (
                <DocumentationDialog
                    isOpen={isDocumentationVisible}
                    onClose={() => setIsDocumentationVisible(false)}
                    blockId={id}
                    fileName={fileName}
                    customization={customization}
                />
            )}

            {/* Testing Panel */}
            {isTestingVisible && (
                <FocusedTestPanel
                    code={currentCode}
                    onClose={() => setIsTestingVisible(false)}
                    customization={customization}
                />
            )}

            {/* Execution Panel */}
            {isExecutionVisible && (
                <BlockExecutionPanel
                    code={currentCode}
                    customization={customization}
                    isVisible={isExecutionVisible}
                    onClose={handleExecutionClose}
                />
            )}

            {/* Coming Soon Modal */}
            {showComingSoon && (
                <ComingSoon
                    feature="AI-powered code fixing"
                    onClose={() => setShowComingSoon(false)}
                />
            )}
            {showIDEDialog && (
                <IDEDialog
                    code={currentCode}
                    fileName={`${name} (${fileName})`}
                    onClose={() => setShowIDEDialog(false)}
                    customization={customization.ide}
                    onCodeChange={handleIdeCodeChange}
                    sourceType="block"
                    blockId={id}
                />
            )}
        </div>
    );
};

// Block variants exports
export const ClassBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const FunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const ClassStandaloneBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const CodeBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const StandaloneFunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;

export default {
    ClassBlock,
    FunctionBlock,
    ClassStandaloneBlock,
    CodeBlock,
    StandaloneFunctionBlock
};