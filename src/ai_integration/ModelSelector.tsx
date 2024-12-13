import React, { useEffect, useState } from 'react';
import { Settings, Download, Loader2, HardDrive } from 'lucide-react';
import { ModelConfig, ModelParameters } from './types';
import { getAvailableModels } from './coreFunctions';

interface ModelInfo {
    name: string;
    size: string;
    modified: string;
    digest: string;
}

interface ModelSelectorProps {
    selectedModel: ModelConfig;
    models: ModelConfig[];
    installedModels: string[];
    parameters: ModelParameters;
    isPulling: boolean;
    isInstalled: boolean;
    onModelSelect: (model: string) => void;
    onParameterChange: (key: keyof ModelParameters, value: number) => void;
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
    const [modelDetails, setModelDetails] = useState<ModelInfo[]>([]);

    useEffect(() => {
        fetchModelDetails();
    }, [installedModels]);

    const fetchModelDetails = async () => {
        const { models } = await getAvailableModels();
        setModelDetails(models || []);
    };

    const formatSize = (bytes: string) => {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        let size = parseInt(bytes);
        let i = 0;
        while (size >= 1024 && i < sizes.length - 1) {
            size /= 1024;
            i++;
        }
        return `${size.toFixed(2)} ${sizes[i]}`;
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Model Configuration</h2>
            </div>

            <div className="space-y-6">
                <div className="overflow-hidden rounded-lg border border-gray-700">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Model</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Size</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {modelDetails.map((model) => (
                                <tr key={model.name} className="hover:bg-gray-700/50">
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-white">{model.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        {formatSize(model.size)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onModelSelect(model.name)}
                                            className={`px-3 py-1 rounded-md text-sm ${selectedModel.name === model.name
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                        >
                                            {selectedModel.name === model.name ? 'Selected' : 'Select'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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