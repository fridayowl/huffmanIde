import React, { useState, useEffect } from 'react';
import { Command, AlertCircle, GitBranch, Lock, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api';

interface GitCloneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClone: (data: { url: string; branch?: string }) => Promise<void>;
    isCloning: boolean;
}

interface InputProps {
    label: React.ReactNode;
    id: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    id,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled
}) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                focus:ring-indigo-500 focus:border-transparent transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);

const GitCloneModal: React.FC<GitCloneModalProps> = ({
    isOpen,
    onClose,
    onClone,
    isCloning
}) => {
    const [repoUrl, setRepoUrl] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [gitInstalled, setGitInstalled] = useState<boolean>(true);

    useEffect(() => {
        const checkGit = async () => {
            try {
                const isInstalled = await invoke<boolean>('check_git_installation');
                setGitInstalled(isInstalled);
            } catch (error) {
                setGitInstalled(false);
            }
        };
        checkGit();
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isCloning) onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isCloning, onClose]);

    const resetForm = () => {
        setRepoUrl('');
        setBranch('');
        setUsername('');
        setToken('');
        setIsPrivate(false);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setError('');

            if (!repoUrl) {
                setError('Repository URL is required');
                return;
            }

            if (!gitInstalled) {
                setError('Git is not installed on your system');
                return;
            }

            let cloneUrl = repoUrl;
            if (isPrivate && username && token) {
                // Handle credentials for private repositories
                const urlObj = new URL(repoUrl);
                cloneUrl = `${urlObj.protocol}//${username}:${token}@${urlObj.host}${urlObj.pathname}`;
            }

            await onClone({
                url: cloneUrl,
                branch: branch || undefined
            });

            resetForm();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to clone repository');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => !isCloning && onClose()} />

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-gray-900 rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <Command className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-xl font-semibold text-white">Clone Repository</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white rounded-lg 
                                hover:bg-gray-800 transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isCloning}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {!gitInstalled && (
                            <div className="flex items-center gap-2 p-4 text-amber-400 bg-amber-400/10 rounded-lg">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">
                                    Git is not installed on your system. Please install Git to use this feature.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 p-4 text-red-400 bg-red-400/10 rounded-lg">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <Input
                            label="Repository URL"
                            id="repo-url"
                            value={repoUrl}
                            onChange={setRepoUrl}
                            placeholder="https://github.com/username/repository.git"
                            disabled={isCloning}
                        />

                        <Input
                            label={
                                <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4" />
                                    <span>Branch (optional)</span>
                                </div>
                            }
                            id="branch"
                            value={branch}
                            onChange={setBranch}
                            placeholder="main"
                            disabled={isCloning}
                        />

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    disabled={isCloning}
                                    className="w-4 h-4 rounded border-gray-600 text-indigo-600 
                                        focus:ring-indigo-500 bg-gray-700"
                                />
                                <span className="text-sm text-gray-300 flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Private Repository
                                </span>
                            </label>

                            {isPrivate && (
                                <div className="space-y-4 pt-4">
                                    <Input
                                        label="Username"
                                        id="username"
                                        value={username}
                                        onChange={setUsername}
                                        disabled={isCloning}
                                    />
                                    <Input
                                        label="Access Token"
                                        id="token"
                                        type="password"
                                        value={token}
                                        onChange={setToken}
                                        disabled={isCloning}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                        <button
                            onClick={onClose}
                            disabled={isCloning}
                            className="px-4 py-2 text-gray-300 bg-gray-800 rounded-lg font-medium
                                hover:bg-gray-700 transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isCloning || !gitInstalled || !repoUrl || (isPrivate && (!username || !token))}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg font-medium
                                hover:bg-indigo-700 transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                                focus:ring-offset-gray-900"
                        >
                            {isCloning ? 'Cloning...' : 'Clone Repository'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitCloneModal;