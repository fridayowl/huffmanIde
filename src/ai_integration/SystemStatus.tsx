import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Terminal, Info } from 'lucide-react';
import { Command } from '@tauri-apps/api/shell';
import { fetch } from '@tauri-apps/api/http';
import { isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';

const SystemStatus: React.FC<{ isLoading: boolean; isInstalled: boolean }> = ({
    isLoading: initialLoading,
    isInstalled: initialInstalled
}) => {
    const [status, setStatus] = useState({
        isLoading: initialLoading,
        isInstalled: initialInstalled,
        error: '',
        apiAccessible: false,
        shellAccessible: false
    });

    useEffect(() => {
        checkSystemStatus();
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        try {
            const permissionGranted = await isPermissionGranted();
            if (!permissionGranted) {
                await requestPermission();
            }
        } catch (error) {
            console.error('Failed to request notification permission:', error);
        }
    };

    const checkSystemStatus = async () => {
        setStatus(prev => ({ ...prev, isLoading: true, error: '' }));

        try {
            // Check shell access first
            let shellWorks = false;
            try {
                const command = new Command('ollama', ['list']);
                await command.execute();
                shellWorks = true;
            } catch (shellError) {
                console.error('Shell execution failed:', shellError);
            }

            // Check API access
            let apiWorks = false;
            try {
                const response = await fetch('http://localhost:11434/api/version');
                apiWorks = response.ok;
            } catch (apiError) {
                console.error('API check failed:', apiError);
            }

            setStatus({
                isLoading: false,
                isInstalled: shellWorks || apiWorks,
                error: !shellWorks && !apiWorks ?
                    'Unable to access Ollama. Please ensure Ollama is installed and running.' : '',
                apiAccessible: apiWorks,
                shellAccessible: shellWorks
            });

        } catch (error) {
            setStatus({
                isLoading: false,
                isInstalled: false,
                error: 'Failed to check Ollama status. Please verify your installation.',
                apiAccessible: false,
                shellAccessible: false
            });
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">System Status</h2>
                {status.isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                ) : status.isInstalled ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                )}
            </div>

            <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                    {status.isInstalled ? 'Ollama is accessible' : 'Ollama access issues detected'}
                </p>

                {/* Detailed Status */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        <span className={status.shellAccessible ? "text-green-400" : "text-yellow-400"}>
                            Shell Access: {status.shellAccessible ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span className={status.apiAccessible ? "text-green-400" : "text-yellow-400"}>
                            API Access: {status.apiAccessible ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {status.error && (
                    <div className="mt-4 bg-yellow-400/10 text-yellow-400 p-3 rounded-lg text-sm">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Status Check Failed</p>
                                <p className="mt-1">{status.error}</p>
                                {!status.shellAccessible && (
                                    <p className="mt-2">
                                        If you're using the packaged version, try running the application with elevated permissions.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Installation Link */}
                {!status.isInstalled && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm">
                        <p className="text-gray-300">
                            Need to install Ollama? Visit{' '}
                            <a
                                href="https://ollama.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                ollama.ai
                            </a>
                            {' '}for installation instructions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemStatus;