import React, { useState, useEffect } from 'react';
import { Play, XCircle, Terminal, X, Download, Loader2, RefreshCw, Copy } from 'lucide-react';
import { pythonExecutor, ExecutionResult } from '../pythonExecutor';

interface RunPanelProps {
    code?: string | null;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
        lineNumbersColor: string;
    };
    onBeforeRun?: () => Promise<void>;
    isRunning: boolean;
    setIsRunning: (running: boolean) => void;
}

export const RunPanel: React.FC<RunPanelProps> = ({
    code,
    customization,
    onBeforeRun,
    isRunning,
    setIsRunning
}) => {
    const [isPythonAvailable, setIsPythonAvailable] = useState<boolean>(false);
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [history, setHistory] = useState<ExecutionResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Initialize Python
    useEffect(() => {
        const initPython = async () => {
            const available = await pythonExecutor.initialize();
            setIsPythonAvailable(available);
            if (!available) {
                setError('Python is not installed or not accessible. Please install Python to run code.');
            }
        };

        initPython();
    }, []);

    // Clear output when code changes
    useEffect(() => {
        setOutput('');
        setError('');
        setExecutionTime(null);
    }, [code]);

    const executeCode = async () => {
        if (!code || !isPythonAvailable) return;

        setIsRunning(true);
        setOutput('');
        setError('');

        try {
            // Always attempt to save first
            if (onBeforeRun) {
                try {
                    await onBeforeRun();
                } catch (saveError) {
                    console.error('Failed to save before running:', saveError);
                    const continueAnyway = window.confirm('Failed to save changes. Run anyway?');
                    if (!continueAnyway) {
                        setIsRunning(false);
                        return;
                    }
                }
            }

            const result = await pythonExecutor.executeCode(
                code,
                (newOutput) => setOutput(prev => prev + newOutput),
                (newError) => setError(prev => prev + newError)
            );

            setExecutionTime(result.executionTime);
            setHistory(prev => [result, ...prev].slice(0, 10));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
        } finally {
            setIsRunning(false);
        }
    };

    const handleCopy = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
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
        <div className="rounded-lg border overflow-hidden shadow-lg mb-4"
            style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.textColor}10`,
                minHeight: '40vh'
            }}>
            {/* Header */}
            <div className="p-3 border-b flex justify-between items-center"
                style={{
                    backgroundColor: `${customization.highlightColor}10`,
                    borderColor: `${customization.textColor}10`
                }}>
                <div className="flex items-center gap-2">
                    <Terminal size={16} style={{ color: customization.textColor }} />
                    <h3 className="text-sm font-medium" style={{ color: customization.textColor }}>
                        Python Execution
                        {pythonExecutor.getPythonCommand() && ` (${pythonExecutor.getPythonCommand()})`}
                        {executionTime && ` - ${executionTime.toFixed(2)}ms`}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title="Execution History">
                        <RefreshCw size={14} style={{ color: customization.textColor }} />
                    </button>
                    {(output || error) && (
                        <>
                            <button
                                onClick={() => handleCopy(output || error)}
                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                title="Copy Output">
                                <Copy size={14} style={{ color: customization.textColor }} />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                title="Download Output">
                                <Download size={14} style={{ color: customization.textColor }} />
                            </button>
                            <button
                                onClick={clearOutput}
                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                title="Clear Output">
                                <X size={14} style={{ color: customization.textColor }} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="p-4">
                {/* Run Button */}
                <button
                    onClick={executeCode}
                    disabled={isRunning || !code || !isPythonAvailable}
                    className="w-full px-4 py-2 mb-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                    style={{
                        backgroundColor: customization.highlightColor,
                        color: customization.textColor,
                        opacity: (isRunning || !code || !isPythonAvailable) ? 0.5 : 1
                    }}>
                    {isRunning ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            <span>
                                {!isPythonAvailable
                                    ? 'Python Not Found'
                                    : !code
                                        ? 'No Code to Run'
                                        : 'Run Python Code'}
                            </span>
                        </>
                    )}
                </button>

                {/* Output Area */}
                <div className="space-y-4 max-h-[calc(40vh-130px)] overflow-auto">
                    {showHistory ? (
                        <div className="space-y-4">
                            <h5 className="font-medium" style={{ color: customization.textColor }}>
                                Execution History
                            </h5>
                            {history.map((result, index) => (
                                <div
                                    key={index}
                                    className="p-2 rounded"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <div className="text-xs opacity-70 mb-1" style={{ color: customization.textColor }}>
                                        Execution time: {result.executionTime.toFixed(2)}ms
                                    </div>
                                    {result.output && (
                                        <pre className="text-xs whitespace-pre-wrap" style={{ color: customization.textColor }}>
                                            {result.output}
                                        </pre>
                                    )}
                                    {result.error && (
                                        <div className="text-red-400 text-xs mt-1">
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
                                    className="p-2 rounded font-mono text-xs"
                                    style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
                                    <pre className="whitespace-pre-wrap text-xs" style={{ color: customization.textColor }}>
                                        {output}
                                    </pre>
                                </div>
                            )}
                            {error && (
                                <div className="p-2 rounded flex items-start gap-2 text-red-400 text-xs">
                                    <XCircle size={16} className="mt-1 flex-shrink-0" />
                                    <pre className="text-xs whitespace-pre-wrap">
                                        {error}
                                    </pre>
                                </div>
                            )}
                            {!output && !error && !isRunning && (
                                <div className="text-xs opacity-70 text-center" style={{ color: customization.textColor }}>
                                    Click 'Run Code' to execute
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RunPanel;