import React, { useState, useEffect } from 'react';
import SystemStatus from './SystemStatus';
import ModelSelector from './ModelSelector';
import ModelTester from './ModelTester';
import StatusLog from './StatusLog';
import { checkOllamaInstallation, pullModel, sendPrompt } from './coreFunctions';
import { saveModelInfo } from './saveModelInfo';
import { getModelInfo } from './getModelInfo';
import { defaultModels } from './constants';
import { ModelConfig, ModelParameters } from './types';

// Define default parameters
const defaultParameters: ModelParameters = {
    temperature: 0.7,
    top_k: 40,
    top_p: 0.9,
    max_tokens: 2048
};

const AISetup: React.FC = () => {
    // State Management with guaranteed parameters
    const [selectedModel, setSelectedModel] = useState<ModelConfig>(defaultModels[0]);
    const [pullStatus, setPullStatus] = useState('');
    const [isPulling, setIsPulling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [testMessage, setTestMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [parameters, setParameters] = useState<ModelParameters>(defaultModels[0].parameters || defaultParameters);
    const [installedModels, setInstalledModels] = useState<string[]>([]);

    useEffect(() => {
        initializeSetup();
    }, []);

    const initializeSetup = async () => {
        setIsLoading(true);
        try {
            const savedInfo = getModelInfo();
            if (savedInfo?.selectedModel) {
                const model = defaultModels.find(m => m.name === savedInfo.selectedModel.name)
                    || savedInfo.selectedModel;
                setSelectedModel(model);
                setParameters(model.parameters || defaultParameters);
            }

            const { isInstalled: installed, installedModels: models } = await checkOllamaInstallation();
            setIsInstalled(installed);
            setInstalledModels(models);

            if (installed && models.length > 0) {
                const currentModel = savedInfo?.selectedModel?.name || models[0];
                if (!models.includes(currentModel)) {
                    setPullStatus(`${currentModel} not found. Please pull the model.`);
                }
            }
        } catch (error) {
            console.error('Failed to initialize:', error);
            setPullStatus('Failed to initialize Ollama setup.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModelSelect = (modelName: string) => {
        const model = defaultModels.find(m => m.name === modelName) || {
            name: modelName,
            displayName: modelName,
            description: 'Custom model',
            parameters: defaultParameters
        };

        setSelectedModel(model);
        setParameters(model.parameters || defaultParameters);
        saveModelInfo(model);
    };

    const handleParameterChange = (key: keyof ModelParameters, value: number) => {
        const newParams: ModelParameters = { ...parameters, [key]: value };
        setParameters(newParams);
        saveModelInfo({ ...selectedModel, parameters: newParams });
    };

    const handlePullModel = async () => {
        if (!selectedModel || isPulling) return;

        setIsPulling(true);
        setPullStatus(`Starting download of ${selectedModel.displayName}...`);
        try {
            await pullModel(
                selectedModel.name,
                (progress) => setPullStatus(current => `${current}\nProgress: ${progress}%`),
                (status) => setPullStatus(current => `${current}\n${status}`)
            );

            const { installedModels: models } = await checkOllamaInstallation();
            setInstalledModels(models);

        } catch (error) {
            console.error('Pull failed:', error);
            setPullStatus(current => `${current}\nFailed to pull model: ${error}`);
        } finally {
            setIsPulling(false);
        }
    };

    const handleSendPrompt = async () => {
        if (!selectedModel || !testMessage.trim() || !isInstalled || isSending) return;

        setIsSending(true);
        setResponse('');

        try {
            const result = await sendPrompt(selectedModel.name, testMessage, parameters);

            if (result.success) {
                setResponse(result.response || '');
            } else {
                setResponse(result.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Failed to send prompt:', error);
            setResponse('Error: Failed to get response from model');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <SystemStatus
                            isLoading={isLoading}
                            isInstalled={isInstalled}
                        />

                        <ModelSelector
                            selectedModel={selectedModel}
                            models={defaultModels}
                            installedModels={installedModels}
                            parameters={parameters}
                            isPulling={isPulling}
                            isInstalled={isInstalled}
                            onModelSelect={handleModelSelect}
                            onParameterChange={handleParameterChange}
                            onPullModel={handlePullModel}
                        />

                      
                    </div>

                    {/* Right Column */}
                    <div>
                        <ModelTester
                            testMessage={testMessage}
                            response={response}
                            isSending={isSending}
                            isInstalled={isInstalled}
                            onMessageChange={setTestMessage}
                            onSendPrompt={handleSendPrompt}
                        />
                        <StatusLog status={pullStatus} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISetup;