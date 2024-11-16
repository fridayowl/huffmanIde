// AISetup.tsx
import React, { useState, useEffect } from 'react';
import { Command } from '@tauri-apps/api/shell';
import {
    AlertTriangle,
    CheckCircle,
    Download,
    Send,
    Loader2,
    Terminal,
    FileText,
    Settings,
    BookOpen,
    Code2,
    Save,
    Plus,
    Trash2
} from 'lucide-react';
import { fetch, Body, ResponseType } from '@tauri-apps/api/http';
import { saveModelInfo } from './saveModelInfo';
// Types and Interfaces
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

interface Instruction {
    id: number;
    text: string;
}

// Default configurations
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
    },
    {
        name: 'qwen2.5-coder',
        displayName: 'Qwen 2B',
        description: 'Specialized model for code generation and analysis',
        parameters: {
            temperature: 0.8,
            top_k: 40,
            top_p: 0.95,
            max_tokens: 2048
        }
    }
];

const defaultInstructions: Instruction[] = [
    {
        id: 1,
        text: 'You are a Python expert and code generator. Focus on writing clean, efficient, and well-documented code.'
    },
    {
        id: 2,
        text: 'Always explain the code you generate with detailed comments and include type hints when appropriate.'
    },
    {
        id: 3,
        text: 'When suggesting libraries, include pip install commands and version requirements.'
    },
    {
        id: 4,
        text: 'Follow PEP 8 style guidelines and provide error handling best practices.'
    }
];

const AISetup: React.FC = () => {
    // State Management
    const [selectedModel, setSelectedModel] = useState<ModelConfig>(defaultModels[0]);
    const [pullStatus, setPullStatus] = useState<string>('');
    const [isPulling, setIsPulling] = useState(false);
    const [pullProgress, setPullProgress] = useState(0);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [testMessage, setTestMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [parameters, setParameters] = useState(defaultModels[0].parameters);
    const [installedModels, setInstalledModels] = useState<string[]>([]);

    // Model Customization State
    const [showCustomization, setShowCustomization] = useState(false);
    const [customModelName, setCustomModelName] = useState('');
    const [instructions, setInstructions] = useState<Instruction[]>(defaultInstructions);
    const [modelfileContent, setModelfileContent] = useState('');
    const [activeTab, setActiveTab] = useState<'instructions' | 'modelfile'>('instructions');
    const [isCreatingModel, setIsCreatingModel] = useState(false);

    // Initialize and check installation
    useEffect(() => {
        checkOllamaInstallation();
    }, []);

    // Core Functions
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

    const pullModel = async () => {
        if (!selectedModel) return;

        try {
            setIsPulling(true);
            setPullProgress(0);
            setPullStatus(`Starting download of ${selectedModel.displayName}...`);

            const command = new Command('ollama', ['pull', selectedModel.name]);

            command.stdout.on('data', line => {
                const progressMatch = line.match(/(\d+)%/);
                if (progressMatch) {
                    setPullProgress(parseInt(progressMatch[1]));
                }
                setPullStatus(prev => prev + '\n' + line);
            });

            command.stderr.on('data', line => {
                setPullStatus(prev => prev + '\n' + line);
            });

            await command.execute();
            setPullProgress(100);
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
                stream: false,
                ...parameters
            });

            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                body: requestBody,
                responseType: ResponseType.JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = response.data as OllamaResponse;

            try {
                const jsonResponse = JSON.parse(result.response);
                if (jsonResponse.code) {
                    setResponse(jsonResponse.code);
                } else {
                    setResponse(JSON.stringify(jsonResponse, null, 2));
                }
            } catch (parseError) {
                setResponse(result.response);
            }

        } catch (error) {
            console.error('Failed to send prompt:', error);
            setResponse('Error: Failed to get response from model. Make sure Ollama is running.');
        } finally {
            setIsSending(false);
        }
    };

    // Model Customization Functions
    const addInstruction = () => {
        setInstructions([
            ...instructions,
            { id: Date.now(), text: '' }
        ]);
    };
    const handleModelSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const model = defaultModels.find(m => m.name === e.target.value);
        if (model) {
            setSelectedModel(model);
            setParameters(model.parameters);

            // Save to localStorage whenever model is changed
            saveModelInfo(
                model,
                instructions,
                modelfileContent,
                customModelName
            );
        }
    };  

    const removeInstruction = (id: number) => {
        setInstructions(instructions.filter(inst => inst.id !== id));
    };

    const updateInstruction = (id: number, text: string) => {
        const updatedInstructions = instructions.map(inst =>
            inst.id === id ? { ...inst, text } : inst
        );
        setInstructions(updatedInstructions);

        // Save whenever instructions are updated
        saveModelInfo(
            selectedModel,
            updatedInstructions,
            modelfileContent,
            customModelName
        );
    };

    const generateModelfile = () => {
        const instructionsText = instructions
            .map(inst => inst.text)
            .filter(text => text.trim())
            .join('\n');

        const newModelfile = `FROM ${selectedModel.name}

# System instructions for model behavior
SYSTEM """
${instructionsText}
"""

# Parameter configurations
PARAMETER temperature ${parameters?.temperature || 0.7}
PARAMETER top_k ${parameters?.top_k || 40}
PARAMETER top_p ${parameters?.top_p || 0.9}
PARAMETER max_tokens ${parameters?.max_tokens || 2048}

# Response template
TEMPLATE """{{.System}}

Context: Python Development Environment
User: {{.Prompt}}
Assistant: I'll help you with that.

{{.Response}}
"""

# Stop sequences
STOP "User:"
STOP "Context:"
STOP "Assistant:"`;

        setModelfileContent(newModelfile);
        setActiveTab('modelfile');
    };

    const createCustomModel = async () => {
        if (!customModelName || !modelfileContent || isCreatingModel) return;

        try {
            setIsCreatingModel(true);
            setPullStatus(`Creating custom model ${customModelName}...`);

            // Create temporary Modelfile
            const modelfilePath = `/tmp/${customModelName}.modelfile`;
            const createFile = new Command('bash', ['-c', `echo '${modelfileContent.replace(/'/g, "'\\''")}' > ${modelfilePath}`]);
            await createFile.execute();

            // Create model using Ollama
            const createCommand = new Command('ollama', ['create', customModelName, modelfilePath]);

            createCommand.stdout.on('data', line => {
                setPullStatus(prev => prev + '\n' + line);
            });

            createCommand.stderr.on('data', line => {
                setPullStatus(prev => prev + '\n' + line);
            });

            await createCommand.execute();
            setPullStatus(prev => prev + `\nCustom model ${customModelName} created successfully!`);

            // Clean up
            await new Command('rm', [modelfilePath]).execute();

            // Refresh installed models
            await checkOllamaInstallation();

            // Reset form
            setCustomModelName('');
            setShowCustomization(false);
        } catch (error) {
            setPullStatus(prev => prev + `\nError creating custom model: ${error}`);
        } finally {
            setIsCreatingModel(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">AI Model Setup</h1>
                <p className="text-gray-400">Configure and test your AI language models</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Status & Model Selection */}
                <div className="lg:col-span-3 space-y-6">
                    {/* System Status */}
                    <div className="bg-gray-800 rounded-lg p-4">
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
                        <p className="text-gray-400 text-sm mb-4">
                            {isInstalled ? 'Ollama is installed and ready' : 'Ollama installation not detected'}
                        </p>
                        {!isInstalled && (
                            <div className="bg-yellow-400/10 text-yellow-400 p-3 rounded-lg text-sm">
                                Please install Ollama before continuing. Visit{' '}
                                <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">
                                    ollama.ai
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Model Selection */}
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">Select Model</h2>
                        <select
                            value={selectedModel.name}
                            onChange={handleModelSelection}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
                        >
                            {defaultModels.map((model) => (
                                <option key={model.name} value={model.name}>
                                    {model.displayName}
                                </option>
                            ))}
                            {installedModels
                                .filter(model => !defaultModels.some(dm => dm.name === model))
                                .map(model => (
                                    <option key={model} value={model}>
                                        {model} (Custom)
                                    </option>
                                ))
                            }
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                <Settings size={18} />
                                Settings
                            </button>
                            <button
                                onClick={pullModel}
                                disabled={isPulling || !isInstalled}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isPulling ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
                                )}
                                {isPulling ? 'Pulling' : 'Pull'}
                            </button>
                        </div>


                        {showSettings && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-sm font-semibold mb-4">Model Parameters</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Temperature (0-1)</label>
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
                                        <label className="block text-sm text-gray-300 mb-1">Max Tokens</label>
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
                    </div>

                    {/* Model Customization Button */}
                    <button
                        onClick={() => setShowCustomization(!showCustomization)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                        <Code2 className="w-5 h-5" />
                        {showCustomization ? 'Hide Customization' : 'Customize Model'}
                    </button>

                    {/* Model Customization Panel */}
                    {showCustomization && (
                        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Model Customization</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('instructions')}
                                        className={`px-3 py-1 rounded-lg flex items-center gap-1 ${activeTab === 'instructions' ? 'bg-blue-600' : 'bg-gray-700'
                                            }`}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Instructions
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('modelfile')}
                                        className={`px-3 py-1 rounded-lg flex items-center gap-1 ${activeTab === 'modelfile' ? 'bg-blue-600' : 'bg-gray-700'
                                            }`}
                                    >
                                        <Code2 className="w-4 h-4" />
                                        Modelfile
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={customModelName}
                                onChange={(e) => setCustomModelName(e.target.value)}
                                placeholder="custom-model-name"
                                className="w-full bg-gray-700 rounded p-2"
                            />

                            {activeTab === 'instructions' && (
                                <div className="space-y-3">
                                    {instructions.map((instruction) => (
                                        <div key={instruction.id} className="flex gap-2">
                                            <textarea
                                                value={instruction.text}
                                                onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                                                placeholder="Enter instruction..."
                                                className="flex-1 bg-gray-700 rounded p-2 min-h-[60px] text-sm"
                                            />
                                            <button
                                                onClick={() => removeInstruction(instruction.id)}
                                                className="px-2 text-gray-400 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={addInstruction}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Instruction
                                        </button>
                                        <button
                                            onClick={generateModelfile}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'modelfile' && (
                                <div className="space-y-3">
                                    <textarea
                                        value={modelfileContent}
                                        onChange={(e) => setModelfileContent(e.target.value)}
                                        className="w-full bg-gray-700 rounded p-3 font-mono text-sm min-h-[200px]"
                                    />
                                    <button
                                        onClick={createCustomModel}
                                        disabled={isCreatingModel || !customModelName || !modelfileContent}
                                        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCreatingModel ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        {isCreatingModel ? 'Creating...' : 'Create Model'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pull Status */}
                    {pullStatus && (
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal size={16} className="text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-300">Status Log</h3>
                            </div>
                            <pre className="bg-gray-900 p-3 rounded-lg overflow-auto max-h-40 text-sm">
                                {pullStatus}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Center Column - Add your visualization or other content here */}
                <div className="lg:col-span-6">
                    {/* Add your content here */}
                </div>

                {/* Right Column - Test Model */}
                <div className="lg:col-span-3">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-gray-400" />
                            <h2 className="text-xl font-semibold">Test Model</h2>
                        </div>
                        <div className="space-y-4">
                            <textarea
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                                placeholder="Enter your prompt here..."
                                className="w-full h-48 px-4 py-2 bg-gray-700 text-white rounded-lg resize-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={sendPrompt}
                                    disabled={isSending || !isInstalled || !testMessage.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                                    <div className="text-sm whitespace-pre-wrap overflow-auto max-h-48">
                                        {response}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISetup;