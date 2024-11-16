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
            // Try to parse as JSON first
            const responseObj = JSON.parse(response);
            if (responseObj.code) {
                // Clean up the code part
                return responseObj.code
                    .replace(/\\n/g, '\n')  // Replace escaped newlines
                    .replace(/^```python\n|```$/g, '')  // Remove code block markers if present
                    .trim();
            }
            if (responseObj.python_code) {
                // Clean up the code part
                return responseObj.code
                    .replace(/\\n/g, '\n')  // Replace escaped newlines
                    .replace(/^```python\n|```$/g, '')  // Remove code block markers if present
                    .trim();
            }
        } catch (e) {
            // If not valid JSON, clean up the raw text
        }

        // Remove any JSON-like wrapper content
        const lines = response.split('\n');
        const cleanedLines = lines
            .filter(line => {
                const trimmed = line.trim();
                return !(
                    trimmed.startsWith('{') ||
                    trimmed.startsWith('}') ||
                    trimmed.includes('"thoughts":') ||
                    trimmed.includes('"code":') ||
                    trimmed.includes('"solutions":') ||
                    !trimmed
                );
            })
            .map(line => line.trim())
            .filter(line => line);

        return cleanedLines.join('\n');
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
                    console.log('Token:', token);
                    generatedCode += token;
                },
                (fullResponse) => {
                    console.log('✅ Full response received:', fullResponse);
                    const formattedCode = formatCodeResponse(fullResponse);
                    console.log('Formatted code:', formattedCode);
                    onCodeGenerated(formattedCode);
                },
                (error) => {
                    console.error('❌ Error:', error);
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