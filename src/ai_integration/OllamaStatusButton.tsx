import React, { useEffect, useState, useRef } from 'react';
import { checkOllamaStatus, OllamaStatus } from './ollamaStatus';
import {
    Brain,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Power,
    Info,
    Settings,
    ChevronDown,
    X
} from 'lucide-react';
import AISetup from './AISetup';

const OllamaStatusButton = () => {
    const [status, setStatus] = useState<OllamaStatus | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDialogOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                setIsDialogOpen(false);
            }
            if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
                setShowDetails(false);
            }
        };

        if (isDialogOpen || showDetails) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        if (isDialogOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isDialogOpen, showDetails]);

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const ollamaStatus = await checkOllamaStatus();
            setStatus(ollamaStatus);

            const storedModel = localStorage.getItem('selectedOllamaModel');
            if (storedModel && ollamaStatus.installedModels.includes(storedModel)) {
                setSelectedModel(storedModel);
            } else if (ollamaStatus.installedModels.length > 0) {
                setSelectedModel(ollamaStatus.installedModels[0]);
                localStorage.setItem('selectedOllamaModel', ollamaStatus.installedModels[0]);
            }
        } catch (error) {
            console.error('Error checking Ollama status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleModelSelect = (model: string) => {
        setSelectedModel(model);
        localStorage.setItem('selectedOllamaModel', model);
        setShowDetails(false);
    };

    const getStatusConfig = () => {
        if (!status) {
            return {
                bgColor: 'bg-gray-600',
                textColor: 'text-gray-100',
                icon: null,
                text: 'Checking Ollama',
                pulseColor: 'bg-gray-400'
            };
        }

        if (!status.isInstalled) {
            return {
                bgColor: 'bg-red-600',
                textColor: 'text-red-100',
                icon: AlertTriangle,
                text: 'Not Installed',
                pulseColor: 'bg-red-400'
            };
        }

        if (!status.isRunning) {
            return {
                bgColor: 'bg-yellow-600',
                textColor: 'text-yellow-100',
                icon: Power,
                text: 'Not Running',
                pulseColor: 'bg-yellow-400'
            };
        }

        return {
            bgColor: 'bg-green-600',
            textColor: 'text-green-100',
            icon: Brain,
            text: selectedModel || 'Ready',
            pulseColor: 'bg-green-400'
        };
    };

    const config = getStatusConfig();

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => status?.isRunning && setShowDetails(!showDetails)}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg ${config.bgColor} ${config.textColor} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                    {isChecking ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Brain className="w-5 h-5" />
                            <span className="font-medium">{config.text}</span>
                            {status?.isRunning && (
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
                            )}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <span className="flex h-2 w-2 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`} />
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseColor}`} />
                                </span>
                            </div>
                        </>
                    )}
                </button>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    title="AI Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Details Dropdown */}
            {showDetails && status && (
                <div
                    ref={detailsRef}
                    className="absolute top-full mt-2 w-72 p-4 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700"
                >
                    <div className="space-y-4">
                        {/* Status Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Status</span>
                                {status.isRunning ? (
                                    <span className="text-green-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Running
                                    </span>
                                ) : (
                                    <span className="text-yellow-400 flex items-center gap-1">
                                        <Power className="w-4 h-4" />
                                        Stopped
                                    </span>
                                )}
                            </div>
                            {status.version && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Version</span>
                                    <span className="text-gray-300">{status.version}</span>
                                </div>
                            )}
                        </div>

                        {/* Models Section */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-300">Installed Models</h4>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {status.installedModels.map((model) => (
                                    <button
                                        key={model}
                                        onClick={() => handleModelSelect(model)}
                                        className={`w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${selectedModel === model
                                            ? 'bg-green-600/20 text-green-400'
                                            : 'hover:bg-gray-700/50 text-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{model}</span>
                                            {selectedModel === model && (
                                                <CheckCircle2 className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {status.error && (
                            <div className="flex items-start gap-2 p-2 bg-red-900/20 rounded">
                                <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm">{status.error}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40">
                    <div className="fixed inset-4 z-50 flex items-center justify-center">
                        <div
                            ref={dialogRef}
                            className="bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <h2 className="text-xl font-semibold text-white">AI Model Setup</h2>
                                <button
                                    onClick={() => setIsDialogOpen(false)}
                                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <AISetup />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OllamaStatusButton;