// SystemStatus.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface SystemStatusProps {
    isLoading: boolean;
    isInstalled: boolean;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ isLoading, isInstalled }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
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
            <p className="text-gray-400 text-sm">
                {isInstalled ? 'Ollama is installed and ready' : 'Ollama installation not detected'}
            </p>
            {!isInstalled && (
                <div className="mt-4 bg-yellow-400/10 text-yellow-400 p-3 rounded-lg text-sm">
                    Please install Ollama before continuing. Visit{' '}
                    <a
                        href="https://ollama.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-yellow-300"
                    >
                        ollama.ai
                    </a>
                </div>
            )}
        </div>
    );
};

export default SystemStatus;