import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkOllamaStatus, OllamaStatus } from './ollamaStatus';
import {
    Brain,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Power,
    Info,
    Settings
} from 'lucide-react';
import ollamaLogo from '../assets/ollamalog.png'

const OllamaStatusButton = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<OllamaStatus | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const ollamaStatus = await checkOllamaStatus();
            setStatus(ollamaStatus);
        } catch (error) {
            console.error('Error checking Ollama status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkStatus();
        // Check status every 30 seconds
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

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
            icon: null ,
            text: 'Ready',
            pulseColor: 'bg-green-400'
        };
    };

    const config = getStatusConfig();
    const IconComponent = config.icon;

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg ${config.bgColor} ${config.textColor} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                    {isChecking ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                                <img src={ollamaLogo} alt="Ollama Logo" className="w-5 h-5" />
                            <span className="font-medium">{config.text}</span>

                            {/* Animated pulse indicator */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <span className={`flex h-2 w-2 relative`}>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseColor}`}></span>
                                </span>
                            </div>
                        </>
                    )}
                </button>

                {/* Settings Button */}
                <button
                    onClick={() => navigate('/aisetup')}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    title="AI Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Popup details panel */}
            {showDetails && status && (
                <div className="absolute top-full mt-2 w-64 p-4 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Installation</span>
                            {status.isInstalled ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Service</span>
                            {status.isRunning ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <Power className="w-4 h-4 text-yellow-400" />
                            )}
                        </div>
                        {status.version && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Version</span>
                                <span className="text-gray-300">{status.version}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Models</span>
                            <span className="text-gray-300">{status.installedModels.length}</span>
                        </div>
                        {status.error && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-red-900/20 rounded">
                                <Info className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm">{status.error}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OllamaStatusButton;