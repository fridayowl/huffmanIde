import React, { useEffect, useState } from 'react';
import { relaunch } from '@tauri-apps/api/process';
import { checkUpdate, installUpdate, UpdateResult } from '@tauri-apps/api/updater';
import { getVersion } from '@tauri-apps/api/app';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 transition-opacity duration-300";
    const typeClasses = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {message}
        </div>
    );
};

interface AutoUpdaterState {
    updateAvailable: boolean;
    checking: boolean;
    error: string | null;
    toast: ToastProps | null;
    updateVersion: string;
    currentVersion: string;
}

const AutoUpdater: React.FC = () => {
    const [state, setState] = useState<AutoUpdaterState>({
        updateAvailable: false,
        checking: false,
        error: null,
        toast: null,
        updateVersion: "",
        currentVersion: ""
    });

    const showToast = (message: string, type: ToastProps['type']): void => {
        setState(prev => ({ ...prev, toast: { message, type } }));
        setTimeout(() => setState(prev => ({ ...prev, toast: null })), 3000);
    };

    const dismissError = (): void => {
        setState(prev => ({ ...prev, error: null }));
    };

    const checkForUpdates = async (): Promise<void> => {
        if (state.checking) return;

        try {
            setState(prev => ({
                ...prev,
                checking: true,
                error: null,
                updateAvailable: false
            }));

            const version = await getVersion();
            setState(prev => ({ ...prev, currentVersion: version }));

            const { shouldUpdate, manifest } = await checkUpdate();

            if (shouldUpdate && manifest?.version) {
                setState(prev => ({
                    ...prev,
                    updateAvailable: true,
                    updateVersion: manifest.version
                }));
                showToast(`Version ${manifest.version} is available to install.`, 'info');
            } else {
                showToast(`You're running the latest version (${version}).`, 'success');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? `Update check failed: ${err.message}`
                : 'Failed to check for updates';
            setState(prev => ({ ...prev, error: errorMessage }));
            showToast(errorMessage, 'error');
        } finally {
            setState(prev => ({ ...prev, checking: false }));
        }
    };

    const installNewUpdate = async (): Promise<void> => {
        if (state.checking) return;

        try {
            setState(prev => ({ ...prev, checking: true }));
            await installUpdate();
            showToast("Update installed. Restarting application...", 'success');

            setTimeout(async () => {
                await relaunch();
            }, 3000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? `Update installation failed: ${err.message}`
                : 'Failed to install update';
            setState(prev => ({ ...prev, error: errorMessage }));
            showToast(errorMessage, 'error');
        } finally {
            setState(prev => ({ ...prev, checking: false }));
        }
    };

    useEffect(() => {
        checkForUpdates();
        const interval = setInterval(checkForUpdates, 4 * 60 * 60 * 1000); // Check every 4 hours
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {state.error && (
                <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-red-800 mb-1">Update Error</h3>
                            <p className="text-red-600">{state.error}</p>
                            <button
                                onClick={() => checkForUpdates()}
                                disabled={state.checking}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 underline mr-4"
                            >
                                Try Again
                            </button>
                        </div>
                        <button
                            onClick={dismissError}
                            className="text-red-400 hover:text-red-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {state.updateAvailable && !state.error && (
                <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">Update Available</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-blue-600">
                                A new version of HuffmanIDE ({state.updateVersion}) is available
                            </span>
                            <span className="text-sm text-blue-400">
                                Current version: {state.currentVersion}
                            </span>
                        </div>
                        <button
                            onClick={() => installNewUpdate()}
                            disabled={state.checking}
                            className={`
                                ml-4 px-4 py-2 rounded-md
                                ${state.checking
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                                }
                                transition-colors duration-200
                            `}
                        >
                            {state.checking ? 'Checking...' : 'Install Update'}
                        </button>
                    </div>
                </div>
            )}

            {state.toast && <Toast message={state.toast.message} type={state.toast.type} />}
        </div>
    );
};

export default AutoUpdater;