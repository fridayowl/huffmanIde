import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { Eye, EyeOff, RefreshCw, Play, X, Settings, Download } from 'lucide-react';

interface CustomIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string) => void;
    fileName: string;
    onClose: () => void;
    customization?: {
        backgroundColor?: string;
        textColor?: string;
        lineNumbersColor?: string;
        highlightColor?: string;
    };
}

const CustomIDE = forwardRef<unknown, CustomIDEProps>(({
    fileContent,
    onCodeChange,
    fileName,
    onClose,
    customization = {
        backgroundColor: '#1E293B',
        textColor: '#E2E8F0',
        lineNumbersColor: '#64748B',
        highlightColor: '#2563EB'
    }
}, _ref) => {
    const [content, setContent] = useState(fileContent || '');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const lineHeight = 20;
    const headerHeight = 40;
    const extraLines = 2;
    const bottomPadding = 20;

    useEffect(() => {
        if (fileContent !== null) {
            setContent(fileContent);
            updateContentHeight(fileContent);
        }
    }, [fileContent]);

    const updateContentHeight = useCallback((text: string) => {
        const lines = text.split('\n').length;
        setContentHeight((lines + extraLines) * lineHeight + headerHeight + bottomPadding);
    }, []);

    const handleContentChange = useCallback(() => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerText;
            setContent(newContent);
            updateContentHeight(newContent);
            onCodeChange(newContent);
        }
    }, [onCodeChange, updateContentHeight]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderLineNumbers = () => {
        return content.split('\n').map((_, index) => (
            <div
                key={index}
                className="text-right select-none"
                style={{
                    height: `${lineHeight}px`,
                    fontSize: '10px',
                    lineHeight: `${lineHeight}px`,
                    color: customization.lineNumbersColor
                }}
            >
                {index + 1}
            </div>
        ));
    };

    return (
        <div
            ref={containerRef}
            className="rounded-lg shadow-md overflow-hidden flex flex-col"
            style={{
                backgroundColor: customization.backgroundColor,
                height: `${contentHeight}px`,
                width: '600px'
            }}
        >
            <div
                className="py-2 px-4 font-semibold flex justify-between items-center"
                style={{
                    backgroundColor: customization.highlightColor,
                    color: customization.textColor,
                    height: `${headerHeight}px`
                }}
            >
                <span>{fileName}</span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded hover:bg-opacity-80"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded hover:bg-opacity-80"
                        title="Download File"
                    >
                        <Download size={16} />
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-2 rounded hover:bg-opacity-80"
                        title="Settings"
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-opacity-80"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            <div className="flex flex-grow overflow-auto">
                <div
                    className="p-1 w-8 text-right select-none"
                    style={{
                        backgroundColor: customization.lineNumbersColor,
                        opacity: 0.2
                    }}
                >
                    {renderLineNumbers()}
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    className="flex-grow p-1 font-mono text-sm outline-none whitespace-pre"
                    onInput={handleContentChange}
                    style={{
                        backgroundColor: customization.backgroundColor,
                        color: customization.textColor,
                        lineHeight: `${lineHeight}px`,
                        fontSize: '12px',
                        overflowY: 'auto',
                        height: `${contentHeight - headerHeight}px`,
                        paddingBottom: `${bottomPadding}px`
                    }}
                >
                    {content}
                </div>
            </div>

            {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                    <h3 className="font-semibold mb-2">Editor Settings</h3>
                    {/* Add settings options here */}
                </div>
            )}
        </div>
    );
});

export default CustomIDE;