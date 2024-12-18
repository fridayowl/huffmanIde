import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { invoke } from '@tauri-apps/api';
import { ask, message, open, save } from '@tauri-apps/api/dialog';
import { dirname, basename } from '@tauri-apps/api/path';
import { readDir, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import GitCloneModal from './GitCloneModal';
import { FileSystemItem } from '../Directory';

interface CloneResult {
    success: boolean;
    message: string;
    files: string[];
    path: string;
}

interface CloneParams {
    url: string;
    branch?: string;
    customPath?: string;
}

interface GitCloneButtonProps {
    onFolderSelect: (items: FileSystemItem[]) => void;
}

const GitCloneButton: React.FC<GitCloneButtonProps> = ({ onFolderSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCloning, setIsCloning] = useState<boolean>(false);

    const processFolder = async (path: string): Promise<FileSystemItem[]> => {
        try {
            // Get the repository folder name
            const repoName = await basename(path);

            // Read the contents of the repository folder
            const entries = await readDir(path, { recursive: true });

            // Create the root folder structure
            const rootFolder: FileSystemItem = {
                name: repoName,
                type: 'folder',
                path: path,
                children: []
            };

            const processEntries = async (entries: any[]): Promise<FileSystemItem[]> => {
                const items: FileSystemItem[] = [];

                for (const entry of entries) {
                    try {
                        const name = await basename(entry.path);

                        // Skip .git directory and hidden files
                        if (name === '.git' || name.startsWith('.')) continue;

                        if (entry.children) {
                            // Process directory
                            const children = await processEntries(entry.children);
                            if (children.length > 0) {
                                items.push({
                                    name,
                                    type: 'folder',
                                    children,
                                    path: entry.path
                                });
                            }
                        } else {
                            try {
                                // Process file
                                const content = await readTextFile(entry.path);
                                items.push({
                                    name,
                                    type: 'file',
                                    content,
                                    path: entry.path
                                });
                            } catch (error) {
                                console.error(`Error reading file ${entry.path}:`, error);
                                continue;
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing entry:`, error);
                        continue;
                    }
                }

                return items;
            };

            // Process all entries and assign them as children of the root folder
            rootFolder.children = await processEntries(entries);

            // Return an array containing just the root folder
            return [rootFolder];

        } catch (error) {
            console.error('Error processing folder:', error);
            throw new Error(`Failed to process folder structure: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleClone = async ({ url, branch }: CloneParams): Promise<void> => {
        try {
            setIsCloning(true);

            // Initial clone attempt
            let result = await invoke<CloneResult>('clone_repository', {
                url,
                branch,
            });

            if (!result.success) {
                if (result.message.includes('already exists')) {
                    // First, ask if they want to rename
                    const shouldRename = await ask('Would you like to rename the folder?', {
                        title: 'Folder already exists',
                        type: 'warning'
                    });

                    if (shouldRename) {
                        // Get the parent directory
                        const parentDir = await dirname(result.path);

                        // Let user choose a new name via save dialog
                        const newPath = await save({
                            defaultPath: result.path,
                            title: 'Choose a new name for the repository',
                            filters: [{
                                name: 'Folder',
                                extensions: ['']
                            }]
                        });

                        if (!newPath) {
                            const shouldChangeLocation = await ask(
                                'Would you like to select a different location instead?',
                                { title: 'Select Different Location', type: 'info' }
                            );

                            if (shouldChangeLocation) {
                                const differentPath = await open({
                                    directory: true,
                                    multiple: false,
                                    defaultPath: parentDir,
                                    title: 'Choose location for repository'
                                });

                                if (!differentPath) {
                                    await message('Clone cancelled', { type: 'info' });
                                    return;
                                }

                                result = await invoke<CloneResult>('clone_repository', {
                                    url,
                                    branch,
                                    customPath: differentPath as string
                                });
                            } else {
                                await message('Clone cancelled', { type: 'info' });
                                return;
                            }
                        } else {
                            // Try clone with the new name
                            result = await invoke<CloneResult>('clone_repository', {
                                url,
                                branch,
                                customPath: newPath
                            });
                        }

                        if (result.success) {
                            try {
                                const folderContents = await processFolder(result.path);
                                onFolderSelect(folderContents);
                                await message(`Repository cloned successfully!\nLocation: ${result.path}`, {
                                    title: 'Success',
                                    type: 'info'
                                });
                            } catch (error) {
                                console.error('Error processing cloned folder:', error);
                                await message(
                                    'Repository cloned successfully, but there was an error reading some files. ' +
                                    'Please try selecting the folder manually.',
                                    { title: 'Partial Success', type: 'warning' }
                                );
                            }
                        } else {
                            throw new Error(result.message);
                        }
                    } else {
                        // If they don't want to rename, ask if they want to choose a different location
                        const shouldChangeLocation = await ask(
                            'Would you like to select a different location instead?',
                            { title: 'Select Different Location', type: 'info' }
                        );

                        if (shouldChangeLocation) {
                            const differentPath = await open({
                                directory: true,
                                multiple: false,
                                defaultPath: await dirname(result.path),
                                title: 'Choose location for repository'
                            });

                            if (!differentPath) {
                                await message('Clone cancelled', { type: 'info' });
                                return;
                            }

                            result = await invoke<CloneResult>('clone_repository', {
                                url,
                                branch,
                                customPath: differentPath as string
                            });

                            if (result.success) {
                                try {
                                    const folderContents = await processFolder(result.path);
                                    onFolderSelect(folderContents);
                                    await message(`Repository cloned successfully!\nLocation: ${result.path}`, {
                                        title: 'Success',
                                        type: 'info'
                                    });
                                } catch (error) {
                                    console.error('Error processing cloned folder:', error);
                                    await message(
                                        'Repository cloned successfully, but there was an error reading some files. ' +
                                        'Please try selecting the folder manually.',
                                        { title: 'Partial Success', type: 'warning' }
                                    );
                                }
                            } else {
                                throw new Error(result.message);
                            }
                        } else {
                            await message('Clone cancelled', { type: 'info' });
                            return;
                        }
                    }
                } else {
                    throw new Error(result.message);
                }
            } else {
                // Process successful clone
                try {
                    const folderContents = await processFolder(result.path);
                    onFolderSelect(folderContents);
                    await message(`Repository cloned successfully!\nLocation: ${result.path}`, {
                        title: 'Success',
                        type: 'info'
                    });
                } catch (error) {
                    console.error('Error processing cloned folder:', error);
                    await message(
                        'Repository cloned successfully, but there was an error reading some files. ' +
                        'Please try selecting the folder manually.',
                        { title: 'Partial Success', type: 'warning' }
                    );
                }
            }

            setIsModalOpen(false);

        } catch (error) {
            console.error('Clone error:', error);
            await message(
                error instanceof Error ? error.message : 'Failed to clone repository',
                { title: 'Error', type: 'error' }
            );
        } finally {
            setIsCloning(false);
        }
    };

    const handleSecureClone = async (params: CloneParams) => {
        try {
            let cloneUrl = params.url;
            if (params.url.includes('@')) {
                cloneUrl = params.url;
            }

            await handleClone({
                url: cloneUrl,
                branch: params.branch,
                customPath: params.customPath
            });
        } catch (error) {
            console.error('Secure clone error:', error);
            throw error;
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group relative w-full bg-[#2b3240] backdrop-blur-xl rounded-lg overflow-hidden
                    hover:-translate-y-0.5 transition-all duration-300 
                    hover:shadow-lg hover:shadow-indigo-500/20"
                disabled={isCloning}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b3240] to-[#363d4e] 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative py-2.5 px-4 flex items-center justify-center gap-2">
                    <GitBranch
                        size={16}
                        className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {isCloning ? 'Cloning...' : 'Clone Repository'}
                    </span>
                </div>
            </button>

            <GitCloneModal
                isOpen={isModalOpen}
                onClose={() => !isCloning && setIsModalOpen(false)}
                onClone={handleSecureClone}
                isCloning={isCloning}
            />
        </>
    );
};

export default GitCloneButton;