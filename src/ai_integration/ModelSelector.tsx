// ModelSelector.tsx
import React from 'react';
import { Settings, Download, Loader2 } from 'lucide-react';
import { ModelConfig, ModelParameters } from './types';

interface ModelSelectorProps {
    selectedModel: ModelConfig;
    models: ModelConfig[];
    installedModels: string[];
    parameters: ModelParameters;
    isPulling: boolean;
    isInstalled: boolean;
    onModelSelect: (model: string) => void;
    onParameterChange: (key: keyof ModelParameters, value: number) => void;  // Fixed type here
    onPullModel: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
    selectedModel,
    models,
    installedModels,
    parameters,
    isPulling,
    isInstalled,
    onModelSelect,
    onParameterChange,
    onPullModel,
}) => {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Model Configuration</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <select
                        value={selectedModel.name}
                        onChange={(e) => onModelSelect(e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                    >
                        {models.map((model) => (
                            <option key={model.name} value={model.name}>
                                {model.displayName}
                            </option>
                        ))}
                        {installedModels
                            .filter(model => !models.some(m => m.name === model))
                            .map(model => (
                                <option key={model} value={model}>
                                    {model} (Custom)
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Temperature</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={parameters.temperature}
                            onChange={(e) => onParameterChange('temperature', parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>0</span>
                            <span>{parameters.temperature}</span>
                            <span>1</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Max Tokens</label>
                        <input
                            type="number"
                            min="1"
                            max="4096"
                            value={parameters.max_tokens}
                            onChange={(e) => onParameterChange('max_tokens', parseInt(e.target.value))}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {parameters.top_k !== undefined && (
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Top K</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={parameters.top_k}
                                onChange={(e) => onParameterChange('top_k', parseInt(e.target.value))}
                                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {parameters.top_p !== undefined && (
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Top P</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={parameters.top_p}
                                onChange={(e) => onParameterChange('top_p', parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-1">
                                <span>0</span>
                                <span>{parameters.top_p}</span>
                                <span>1</span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onPullModel}
                    disabled={isPulling || !isInstalled}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isPulling ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    {isPulling ? 'Pulling Model...' : 'Pull Model'}
                </button>
            </div>
        </div>
    );
};

export default ModelSelector;