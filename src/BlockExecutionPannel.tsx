import React, { useState, useEffect } from 'react';
import { Play, XCircle, Terminal, X, Download, Loader2, RefreshCw, Copy } from 'lucide-react';

interface BlockExecutionPanelProps {
    code: string;
    customization: {
        ide?: {
            backgroundColor?: string;
            textColor?: string;
            highlightColor?: string;
        };
        buttons?: {
            backgroundColor?: string;
            textColor?: string;
            hoverBackgroundColor?: string;
        };
    };
    isVisible: boolean;
    onClose: () => void;
}

interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: number;
}

const BlockExecutionPanel: React.FC<BlockExecutionPanelProps> = ({
    code,
    customization,
    isVisible,
    onClose
}) => {
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [history, setHistory] = useState<ExecutionResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setShowHistory(false);
        }
    }, [isVisible]);

    const executeCode = async () => {
        setIsRunning(true);
        setOutput('');
        setError('');

        const startTime = performance.now();

        try {
            // Here we would normally send the code to a backend service
            // For now, we'll simulate execution with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate running Python code and getting output
            let simulatedOutput = '';
            const lines = code.split('\n');
            for (const line of lines) {
                if (line.trim().startsWith('print')) {
                    const content = line.match(/print\((.*)\)/)?.[1] || '';
                    // Remove quotes if present
                    simulatedOutput += content.replace(/['"]/g, '') + '\n';
                }
            }

            setOutput(simulatedOutput || 'Code executed successfully.');

            // Add to history
            setHistory(prev => [{
                output: simulatedOutput,
                error: null,
                executionTime: performance.now() - startTime
            }, ...prev].slice(0, 10)); // Keep last 10 executions

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);

            setHistory(prev => [{
                output: '',
                error: errorMessage,
                executionTime: performance.now() - startTime
            }, ...prev].slice(0, 10));
        } finally {
            const endTime = performance.now();
            setExecutionTime(endTime - startTime);
            setIsRunning(false);
        }
    };

    const handleCopy = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const handleDownload = () => {
        const content = `
Code:
${code}

Output:
${output}

${error ? `Errors:\n${error}` : ''}

Execution Time: ${executionTime?.toFixed(2)}ms
Timestamp: ${new Date().toLocaleString()}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `execution-output-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearOutput = () => {
        setOutput('');
        setError('');
        setExecutionTime(null);
    };

    return (
        <div className="border-t" style={{
            backgroundColor: customization?.ide?.backgroundColor || '#1E293B',
            color: customization?.ide?.textColor || '#E2E8F0'
        }}>
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Terminal size={16} />
                    <h4 className="font-semibold">Code Execution</h4>
                    {executionTime && (
                        <span className="text-xs opacity-70">
                            ({executionTime.toFixed(2)}ms)
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-1 rounded hover:bg-opacity-80"
                        style={{ color: customization?.ide?.highlightColor }}
                        title="Execution History"
                    >
                        <RefreshCw size={14} />
                    </button>
                    {(output || error) && (
                        <>
                            <button
                                onClick={() => handleCopy(output || error)}
                                className="p-1 rounded hover:bg-opacity-80"
                                style={{ color: customization?.ide?.highlightColor }}
                                title="Copy Output"
                            >
                                <Copy size={14} />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-1 rounded hover:bg-opacity-80"
                                style={{ color: customization?.ide?.highlightColor }}
                                title="Download Output"
                            >
                                <Download size={14} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={clearOutput}
                        className="p-1 rounded hover:bg-opacity-80"
                        style={{ color: customization?.ide?.textColor }}
                        title="Clear Output"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-b border-gray-700">
                <button
                    onClick={executeCode}
                    disabled={isRunning}
                    className="px-3 py-1 rounded text-sm flex items-center gap-2 transition-opacity"
                    style={{
                        backgroundColor: customization?.buttons?.backgroundColor || '#2563EB',
                        color: customization?.buttons?.textColor || '#FFFFFF',
                        opacity: isRunning ? 0.7 : 1
                    }}
                >
                    {isRunning ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Play size={14} />
                    )}
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>

            {/* Output Area */}
            <div className="p-4 space-y-4">
                {showHistory ? (
                    <div className="space-y-4">
                        <h5 className="font-medium">Execution History</h5>
                        {history.map((result, index) => (
                            <div
                                key={index}
                                className="p-2 rounded"
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                            >
                                <div className="text-xs opacity-70 mb-1">
                                    Execution time: {result.executionTime.toFixed(2)}ms
                                </div>
                                {result.output && (
                                    <pre className="text-sm whitespace-pre-wrap">
                                        {result.output}
                                    </pre>
                                )}
                                {result.error && (
                                    <div className="text-red-400 text-sm mt-1">
                                        {result.error}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {output && (
                            <div
                                className="p-2 rounded font-mono text-sm"
                                style={{ backgroundColor: 'rgba(0, 88, 0, 0.2)' }}
                            >
                                <pre className="whitespace-pre-wrap">{output}</pre>
                            </div>
                        )}
                        {error && (
                            <div className="p-2 rounded flex items-start gap-2 text-red-400">
                                <XCircle size={16} className="mt-1 flex-shrink-0" />
                                <pre className="text-sm whitespace-pre-wrap">{error}</pre>
                            </div>
                        )}
                        {!output && !error && !isRunning && (
                            <div className="text-sm opacity-70 text-center">
                                Click 'Run Code' to execute this block
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlockExecutionPanel;