import React, { useEffect, useState } from 'react';
import { relaunch } from '@tauri-apps/api/process';
import { checkUpdate, installUpdate, UpdateResult } from '@tauri-apps/api/updater';
import { getVersion } from '@tauri-apps/api/app';

type ToastProps = {
    message: string;
    type: 'success' | 'error' | 'info';
};

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

const AutoUpdater: React.FC = () => {
    const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [updateVersion, setUpdateVersion] = useState<string>("");
    const [currentVersion, setCurrentVersion] = useState<string>("");

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const checkForUpdates = async () => {
        try {
            setChecking(true);
            setError(null);

            // Get current version
            const version = await getVersion();
            setCurrentVersion(version);
            console.log('Current version:', version);

            console.log('Checking for updates...');
            const update: UpdateResult = await checkUpdate();
            console.log('Update check result:', update);

            if (update.manifest?.version && update.shouldUpdate) {
                console.log('Update available:', update.manifest.version);
                setUpdateAvailable(true);
                setUpdateVersion(update.manifest.version);
                showToast(`Version ${update.manifest.version} is available to install.`, 'info');
            } else {
                console.log('No update available');
                showToast(`You're running the latest version (${version}).`, 'success');
            }
        } catch (err: unknown) {
            console.error('Update check failed:', err);
            const errorMessage = err instanceof Error
                ? `Update check failed: ${err.message}`
                : 'Failed to check for updates';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setChecking(false);
        }
    };

    const installNewUpdate = async () => {
        try {
            console.log('Installing update...');
            await installUpdate();
            showToast("Update installed. Restarting application...", 'success');

            setTimeout(async () => {
                console.log('Relaunching application...');
                await relaunch();
            }, 3000);
        } catch (err: unknown) {
            console.error('Update installation failed:', err);
            const errorMessage = err instanceof Error
                ? `Update installation failed: ${err.message}`
                : 'Failed to install update';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        }
    };

    useEffect(() => {
        checkForUpdates();
        const interval = setInterval(checkForUpdates, 4 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-1">Update Error</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={checkForUpdates}
                    disabled={checking}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (updateAvailable) {
        return (
            <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">Update Available</h3>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-blue-600">
                            A new version of HuffmanIDE ({updateVersion}) is available
                        </span>
                        <span className="text-sm text-blue-400">
                            Current version: {currentVersion}
                        </span>
                    </div>
                    <button
                        onClick={installNewUpdate}
                        disabled={checking}
                        className={`
              ml-4 px-4 py-2 rounded-md
              ${checking
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                            }
              transition-colors duration-200
            `}
                    >
                        {checking ? 'Checking...' : 'Install Update'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} />}
        </>
    );
};

export default AutoUpdater;