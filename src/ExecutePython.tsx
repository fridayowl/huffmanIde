import React, { useState, useCallback } from 'react';
import { Play, Loader2, XCircle, Terminal, X, RefreshCw, Download } from 'lucide-react';
import { Command } from '@tauri-apps/api/shell';
import { writeTextFile, removeFile } from '@tauri-apps/api/fs';
import { join, downloadDir } from '@tauri-apps/api/path';

interface ExecutePythonProps {
    fileName: string | null;
    currentCode: string | null;
    onClose: () => void;
    customization?: any;
}

const ExecutePython: React.FC<ExecutePythonProps> = ({
    fileName,
    currentCode,
    onClose,
    customization = {
        backgroundColor: '#1E293B',
        textColor: '#E2E8F0',
        highlightColor: '#2563EB'
    }
}) => {
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);

    const clearOutput = () => {
        setOutput('');
        setError('');
        setExecutionTime(null);
    };

    const executePythonScript = useCallback(async () => {
        if (!currentCode || !fileName) {
            setError('No code or filename provided');
            return;
        }

        try {
            const startTime = performance.now();
            setIsRunning(true);
            setOutput('');
            setError('');

            const downloadsPath = await downloadDir();
            const tempFilePath = await join(downloadsPath, 'temp_script.py');

            await writeTextFile(tempFilePath, currentCode);

            try {
               const command = new Command('python', [tempFilePath]);
               // const prompt = "Who is the father of India?";
              //  const command = new Command('ollama', ['run', 'llama3', prompt]);
                console.log(command)
                let outputText = '';
                let errorText = '';

                command.stdout.on('data', line => {
                    outputText += line + '\n';
                    setOutput(outputText.trim());
                });

                command.stderr.on('data', line => {
                    errorText += line + '\n';
                    setError(errorText.trim());
                });

                const result = await command.execute();
                const endTime = performance.now();
                setExecutionTime(endTime - startTime);
                console.log('Execution result:', result);

            } finally {
                try {
                    await removeFile(tempFilePath);
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
            }

        } catch (err) {
            console.error('Failed to execute Python script:', err);
            setError(prev => prev + `\nExecution error: ${err}`);
        } finally {
            setIsRunning(false);
        }
    }, [currentCode, fileName]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl m-4 overflow-hidden"
                style={{ backgroundColor: customization.backgroundColor }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: customization.backgroundColor }}>
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: customization.textColor }}>
                        <Terminal size={20} />
                        Python Execution
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearOutput}
                            className="p-1 rounded hover:bg-opacity-80 text-white"
                            title="Clear Output"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-opacity-80 text-white"
                            title="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4" style={{ color: customization.textColor }}>
                    {/* File info and execution controls */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm opacity-70">File: </span>
                            <span className="font-mono">{fileName}</span>
                            {executionTime && (
                                <span className="ml-4 text-sm opacity-70">
                                    Execution time: {executionTime.toFixed(2)}ms
                                </span>
                            )}
                        </div>
                        <button
                            onClick={executePythonScript}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-4 py-2 rounded text-white transition-colors
                                ${isRunning
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    Run Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output section */}
                    <div className="space-y-4 max-h-[60vh] overflow-auto" style={{ backgroundColor: customization.backgroundColor }}>
                        {output && (
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ backgroundColor: customization.backgroundColor }}>
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center" style={{ backgroundColor: customization.highlightColor }}>
                                    <h4 className="font-semibold">Output</h4>
                                    <Download size={16} className="opacity-60 hover:opacity-100 cursor-pointer" />
                                </div>
                                <pre className="p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
                                    {output}
                                </pre>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
                                <div className="bg-red-50 dark:bg-red-900 px-4 py-2 flex items-center gap-2">
                                    <XCircle size={16} className="text-red-500" />
                                    <h4 className="font-semibold text-red-600 dark:text-red-400">Error</h4>
                                </div>
                                <pre className="p-4 font-mono text-sm text-red-600 dark:text-red-400 overflow-auto whitespace-pre-wrap">
                                    {error}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutePython;