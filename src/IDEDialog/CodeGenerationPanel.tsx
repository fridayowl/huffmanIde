import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Loader2, X } from 'lucide-react';
import { executeOllamaStreaming, checkOllamaAPI } from '../ai_integration/executeOllama';

interface Customization {
    backgroundColor: string;
    textColor: string;
    highlightColor: string;
}

interface CodeGenerationPanelProps {
    customization: Customization;
    onClose: () => void;
    onCodeGenerated: (code: string) => void;
}

const CodeGenerationPanel: React.FC<CodeGenerationPanelProps> = ({
    customization,
    onClose,
    onCodeGenerated,
}) => {
    const [prompt, setPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const formatCodeResponse = (response: string): string => {
        try {
            // First try to parse as JSON
            const responseObj = JSON.parse(response);
            if (responseObj.code || responseObj.python_code) {
                const codeContent = responseObj.code || responseObj.python_code;
                return formatPythonCode(
                    codeContent
                        .replace(/\\n/g, '\n')
                        .replace(/^```python\n|```$/g, '')
                        .trim()
                );
            }
        } catch (e) {
            // If not JSON, clean up the raw text
        }

        // Clean up raw text response
        return formatPythonCode(
            response
                .replace(/^```python\n|```$/g, '')  // Remove code block markers
                .split('\n')
                .filter(line => {
                    const trimmed = line.trim();
                    return !(
                        trimmed.startsWith('{') ||
                        trimmed.startsWith('}') ||
                        trimmed.includes('"thoughts":') ||
                        trimmed.includes('"code":') ||
                        trimmed.includes('"solutions":')
                    );
                })
                .join('\n')
                .trim()
        );
    };

    const formatPythonCode = (code: string): string => {
        const lines = code.split('\n');
        const formattedLines: string[] = [];
        let indentLevel = 0;
        const INDENT = '    '; // 4 spaces for Python

        for (let line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines but preserve them
            if (!trimmedLine) {
                formattedLines.push('');
                continue;
            }

            // Decrease indent for lines starting with specific keywords
            if (trimmedLine.startsWith('elif ') ||
                trimmedLine.startsWith('else:') ||
                trimmedLine.startsWith('except ') ||
                trimmedLine.startsWith('finally:') ||
                (trimmedLine.startsWith('return ') && !trimmedLine.endsWith(':')) ||
                (trimmedLine.startsWith('class ') && trimmedLine.includes('(')) ||
                (trimmedLine.startsWith('def ') && !trimmedLine.startsWith('def __'))) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Special handling for nested class definitions
            if (trimmedLine.startsWith('class ') && !trimmedLine.includes('(')) {
                formattedLines.push(INDENT.repeat(indentLevel) + trimmedLine);
                indentLevel += 1;
                continue;
            }

            // Add the line with proper indentation
            formattedLines.push(INDENT.repeat(indentLevel) + trimmedLine);

            // Increase indent after lines ending with ':'
            if (trimmedLine.endsWith(':')) {
                indentLevel += 1;
            }
            // Handle method definitions
            else if (trimmedLine.startsWith('def ')) {
                if (!trimmedLine.endsWith(':')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
            }
            // Decrease indent after standalone return/break/continue statements
            else if (trimmedLine.startsWith('return ') ||
                trimmedLine === 'break' ||
                trimmedLine === 'continue') {
                indentLevel = Math.max(0, indentLevel - 1);
            }
        }

        return formattedLines.join('\n');
    };
    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            const isApiAccessible = await checkOllamaAPI();

            if (!isApiAccessible) {
                setError('Ollama API is not accessible. Please make sure Ollama is running.');
                return;
            }

            let generatedCode = '';

            await executeOllamaStreaming(
                `Generate Python code for: ${prompt}. Return only the Python code without any explanations or JSON formatting.`,
                (token) => {
                    generatedCode += token;
                },
                (fullResponse) => {
                    const formattedCode = formatCodeResponse(fullResponse);
                    onCodeGenerated(formattedCode);
                },
                (error) => {
                    setError(error);
                }
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Failed to generate code');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div
            className="absolute z-50 right-4 top-16 w-96 rounded-lg shadow-xl border"
            style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.textColor}20`,
            }}
        >
            <div
                className="p-3 border-b flex justify-between items-center"
                style={{
                    borderColor: `${customization.textColor}20`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-indigo-400" />
                    <span className="font-medium" style={{ color: customization.textColor }}>
                        Generate Python Code
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-white/5"
                    style={{ color: customization.textColor }}
                >
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the Python code you want to generate..."
                    className="w-full p-3 rounded-lg resize-none focus:ring-2 focus:outline-none"
                    style={{
                        backgroundColor: `${customization.highlightColor}10`,
                        color: customization.textColor,
                        border: `1px solid ${customization.textColor}20`,
                    }}
                    rows={4}
                />

                {error && (
                    <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                    style={{
                        backgroundColor: customization.highlightColor,
                        opacity: isGenerating || !prompt.trim() ? 0.5 : 1,
                        color: 'white',
                    }}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Wand2 size={16} />
                            <span>Generate Code</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CodeGenerationPanel;