import React, { useState, useEffect } from 'react';
import { Command } from '@tauri-apps/api/shell';
import { AlertTriangle, CheckCircle, Download, Send, Loader2, Terminal, FileText, Settings } from 'lucide-react';
 
import { fetch, Body, ResponseType } from '@tauri-apps/api/http';
interface ModelConfig {
    name: string;
    displayName: string;
    description: string;
    parameters?: {
        temperature?: number;
        top_k?: number;
        top_p?: number;
        max_tokens?: number;
    };
}
interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

const defaultModels: ModelConfig[] = [
    {
        name: 'gemma:2b',
        displayName: 'Gemma 2B',
        description: 'Lightweight model good for general tasks',
        parameters: {
            temperature: 0.7,
            top_k: 40,
            top_p: 0.9,
            max_tokens: 2048
        }
    },
    {
        name: 'gemma:7b',
        displayName: 'Gemma 7B',
        description: 'More capable model for complex tasks',
        parameters: {
            temperature: 0.7,
            top_k: 40,
            top_p: 0.9,
            max_tokens: 2048
        }
    }
];

const AISetup: React.FC = () => {
    // State Management
    const [selectedModel, setSelectedModel] = useState<ModelConfig>(defaultModels[0]);
    const [pullStatus, setPullStatus] = useState<string>('');
    const [isPulling, setIsPulling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [testMessage, setTestMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [parameters, setParameters] = useState(defaultModels[0].parameters);
    const [installedModels, setInstalledModels] = useState<string[]>([]);

    // Initialize and check installation
    useEffect(() => {
        checkOllamaInstallation();
    }, []);

    
    const pullModel = async () => {
        if (!selectedModel) return;

        try {
            setIsPulling(true);
            setPullStatus(`Starting download of ${selectedModel.displayName}...`);

            const command = new Command('ollama', ['pull', selectedModel.name]);

            command.stdout.on('data', line => {
                setPullStatus(prev => prev + '\n' + line);
            });

            command.stderr.on('data', line => {
                setPullStatus(prev => prev + '\n' + line);
            });

            await command.execute();
            setPullStatus(prev => prev + `\n${selectedModel.displayName} successfully pulled!`);
            checkOllamaInstallation();
        } catch (error) {
            setPullStatus(prev => prev + `\nError pulling ${selectedModel.displayName}: ` + error);
        } finally {
            setIsPulling(false);
        }
    };

    const sendPrompt = async () => {
        if (!selectedModel || !testMessage.trim() || !isInstalled) {
            return;
        }

        try {
            setIsSending(true);
            setResponse('');

            const requestBody: Body = Body.json({
                model: selectedModel.name,
                prompt: testMessage,
                format: "json",
                stream: false
            });

            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                body: requestBody,
                responseType: ResponseType.JSON  // Specify response type as JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Type assertion for the response data
            const result = response.data as OllamaResponse;

            try {
                // Parse the response string as JSON and pretty print it
                const jsonResponse = JSON.parse(result.response);
                setResponse(JSON.stringify(jsonResponse, null, 2));
            } catch (parseError) {
                // If JSON parsing fails, show the raw response
                setResponse(result.response);
            }

        } catch (error) {
            console.error('Failed to send prompt:', error);
            setResponse('Error: Failed to get response from model. Make sure Ollama is running.');
        } finally {
            setIsSending(false);
        }
    };
    const checkOllamaAPI = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/version');
            return response.ok;
        } catch (error) {
            console.error('Failed to connect to Ollama API:', error);
            return false;
        }
    };
    const checkOllamaInstallation = async () => {
        try {
            const command = new Command('ollama', ['list']);
            const output = await command.execute();

            // Check if API is accessible
            const apiAccessible = await checkOllamaAPI();
            if (!apiAccessible) {
                setPullStatus('Ollama API is not accessible. Make sure Ollama is running.');
                setIsInstalled(false);
                setIsLoading(false);
                return;
            }

            setIsInstalled(true);
            const models = output.stdout.split('\n')
                .filter(line => line.trim())
                .map(line => line.split(' ')[0]);

            setInstalledModels(models);
            setIsLoading(false);

            if (!models.includes(selectedModel.name)) {
                setPullStatus(`${selectedModel.displayName} not found. Please pull the model.`);
            }
        } catch (error) {
            setIsInstalled(false);
            setIsLoading(false);
            setPullStatus('Ollama is not installed or not accessible.');
        }
    };
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">AI Model Setup</h1>
                    <p className="text-gray-400">Configure and test your AI language models</p>
                </div>

                {/* Status Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">System Status</h2>
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                        ) : isInstalled ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        )}
                    </div>
                    <p className="text-gray-400 mb-4">
                        {isInstalled ? 'Ollama is installed and ready' : 'Ollama installation not detected'}
                    </p>
                    {!isInstalled && (
                        <div className="bg-yellow-400/10 text-yellow-400 p-4 rounded-lg">
                            Please install Ollama before continuing. Visit{' '}
                            <a
                                href="https://ollama.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-yellow-300"
                            >
                                ollama.ai
                            </a>
                            {' '}for installation instructions.
                        </div>
                    )}
                </div>

                {/* Model Selection and Pull Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Select Model</h2>
                            <select
                                value={selectedModel.name}
                                onChange={(e) => {
                                    const model = defaultModels.find(m => m.name === e.target.value);
                                    if (model) {
                                        setSelectedModel(model);
                                        setParameters(model.parameters);
                                    }
                                }}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                            >
                                {defaultModels.map((model) => (
                                    <option key={model.name} value={model.name}>
                                        {model.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg
                                    hover:bg-gray-600 transition-colors duration-200"
                            >
                                <Settings size={20} />
                                Settings
                            </button>
                            <button
                                onClick={pullModel}
                                disabled={isPulling || !isInstalled}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-colors duration-200"
                            >
                                {isPulling ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
                                )}
                                {isPulling ? 'Pulling...' : 'Pull Model'}
                            </button>
                        </div>
                    </div>

                    {/* Model Settings Dialog */}
                    {showSettings && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Model Parameters</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">
                                        Temperature (0-1)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={parameters?.temperature}
                                        onChange={(e) => setParameters(prev => ({
                                            ...prev,
                                            temperature: parseFloat(e.target.value)
                                        }))}
                                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">
                                        Max Tokens
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="4096"
                                        value={parameters?.max_tokens}
                                        onChange={(e) => setParameters(prev => ({
                                            ...prev,
                                            max_tokens: parseInt(e.target.value)
                                        }))}
                                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pull Status */}
                    {pullStatus && (
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal size={16} className="text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-300">Pull Status</h3>
                            </div>
                            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                                {pullStatus}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Test Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-gray-400" />
                        <h2 className="text-xl font-semibold">Test Model</h2>
                    </div>
                    <div className="space-y-4">
                        <textarea
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            placeholder="Enter your prompt here..."
                            className="w-full h-32 px-4 py-2 bg-gray-700 text-white rounded-lg resize-none
                                border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={sendPrompt}
                                disabled={isSending || !isInstalled || !testMessage.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-colors duration-200"
                            >
                                {isSending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {isSending ? 'Generating...' : 'Send Prompt'}
                            </button>
                        </div>
                        {response && (
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Terminal size={16} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-300">Response:</h3>
                                </div>
                                <div className="text-sm whitespace-pre-wrap">{response}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISetup;