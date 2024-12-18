import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, ChevronLeft, ChevronRight as ChevronRightExpand, Settings, Edit, Trash2, Save, Info } from 'lucide-react';
import { dialog } from '@tauri-apps/api';
import { readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join, basename } from '@tauri-apps/api/path';

import LoadingDialog from './LoadingDialog';
import DocumentationList from './DocumentationList';
import CreateFileButton from './CreateFileButton';
import GitCloneButton from './git_integration/GitCloneButton';

export interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileSystemItem[];
    content?: string;
    path: string;  // Absolute path of the item
}

interface OpenEditorFile {
    name: string;        // Display name
    path: string;        // Absolute path
    content: string;     // File content
}

interface DirectoryProps {
    items: FileSystemItem[];
    onFolderSelect: (folder: FileSystemItem[]) => void;
    onFileSelect: (fileContent: string, fileName: string, filePath: string) => void;
}

export interface DirectoryHandle {
    updateOpenEditorContent: (filePath: string, newContent: string) => void;
    handleFolderSelect: () => Promise<void>;
    handleFileCreate: (fileName?: string) => void;
}

const commonFileTypes = [
    '.py', '.js', '.ts', '.tsx', '.jsx',
    '.html', '.css', '.scss', '.less',
    '.java', '.c', '.cpp', '.cs', '.go',
    '.rb', '.php', '.swift', '.kt', '.rs',
    '.sql', '.json', '.xml', '.yaml', '.md'
];

const Directory = forwardRef<DirectoryHandle, DirectoryProps>(({ items, onFolderSelect, onFileSelect }, ref) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [visibleTypes, setVisibleTypes] = useState<string[]>(commonFileTypes);
    const [openEditors, setOpenEditors] = useState<OpenEditorFile[]>([]);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditorsExpanded, setIsEditorsExpanded] = useState(true);
    const [isSourceExpanded, setIsSourceExpanded] = useState(true);
    const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(true);

    // Restore open editors from localStorage on mount
    useEffect(() => {
        try {
            const storedEditors = localStorage.getItem('openEditors');
            if (storedEditors) {
                const parsedEditors = JSON.parse(storedEditors);
                // Verify stored files still exist and load their content
                const validEditors = parsedEditors.filter((editor: OpenEditorFile) => {
                    const content = localStorage.getItem(`file_${editor.path}`);
                    return content !== null;
                });
                setOpenEditors(validEditors);
            }
        } catch (error) {
            console.error('Error restoring editors:', error);
        }
    }, []);

    const handleFileCreate = useCallback(async (fileName: string, content: string) => {
        try {
            // Create unique file path
            const filePath = fileName; // For new files, using fileName as path initially

            const newEditor = {
                name: fileName,
                path: filePath,
                content: content
            };

            setOpenEditors(prev => {
                const updated = [...prev, newEditor];
                localStorage.setItem('openEditors', JSON.stringify(updated));
                return updated;
            });

            localStorage.setItem(`file_${filePath}`, content);
            setCurrentFile(filePath);
            onFileSelect(content, fileName, filePath);

        } catch (error) {
            console.error('Error creating file:', error);
            await dialog.message('Failed to create file', { type: 'error' });
        }
    }, [onFileSelect]);

    const handleFileSelect = useCallback(async (file: FileSystemItem) => {
        if (file.type === 'file' && file.content && file.path) {
            try {
                const existingFileIndex = openEditors.findIndex(f => f.path === file.path);

                if (existingFileIndex !== -1) {
                    // File already open
                    const confirmOverwrite = await dialog.confirm('File already open', {
                        title: `File "${file.name}" is already open. Do you want to reload it?`,
                        type: 'warning'
                    });

                    if (confirmOverwrite) {
                        const updatedOpenEditors = [...openEditors];
                        updatedOpenEditors[existingFileIndex] = {
                            name: file.name,
                            path: file.path,
                            content: file.content
                        };
                        setOpenEditors(updatedOpenEditors);
                        localStorage.setItem('openEditors', JSON.stringify(updatedOpenEditors));
                        localStorage.setItem(`file_${file.path}`, file.content);
                    } else {
                        // Use existing content
                        file.content = openEditors[existingFileIndex].content;
                    }
                } else {
                    // New file to open
                    const updatedOpenEditors = [...openEditors, {
                        name: file.name,
                        path: file.path,
                        content: file.content
                    }];
                    setOpenEditors(updatedOpenEditors);
                    localStorage.setItem('openEditors', JSON.stringify(updatedOpenEditors));
                    localStorage.setItem(`file_${file.path}`, file.content);
                }

                setCurrentFile(file.path);
                onFileSelect(file.content, file.name, file.path);
            } catch (error) {
                console.error('Error processing file:', error);
                await dialog.message('Failed to process file', { type: 'error' });
            }
        }
    }, [onFileSelect, openEditors]);

    const handleOpenEditorSelect = async (file: OpenEditorFile) => {
        try {
            const content = localStorage.getItem(`file_${file.path}`);
            if (content) {
                setCurrentFile(file.path);
                onFileSelect(content, file.name, file.path);
            } else {
                // Try to reload from disk
                const reloadedContent = await readTextFile(file.path);
                localStorage.setItem(`file_${file.path}`, reloadedContent);
                setCurrentFile(file.path);
                onFileSelect(reloadedContent, file.name, file.path);
            }
        } catch (error) {
            console.error('Error loading file:', error);
            await dialog.message('Failed to load file. It may have been moved or deleted.', { type: 'error' });
            handleDeleteFile(file.path);
        }
    };

    const handleDeleteFile = async (filePath: string) => {
        try {
            const file = openEditors.find(f => f.path === filePath);
            if (!file) return;

            const confirmDelete = await dialog.confirm('Close File', {
                title: `Are you sure you want to close ${file.name}?`,
                type: 'warning'
            });

            if (confirmDelete) {
                localStorage.removeItem(`file_${filePath}`);
                setOpenEditors(prev => {
                    const updated = prev.filter(f => f.path !== filePath);
                    localStorage.setItem('openEditors', JSON.stringify(updated));
                    return updated;
                });
                if (currentFile === filePath) {
                    setCurrentFile(null);
                }
            }
        } catch (error) {
            console.error('Error closing file:', error);
            await dialog.message('Failed to close file', { type: 'error' });
        }
    };

    const handleSaveFile = async (filePath: string) => {
        try {
            const file = openEditors.find(f => f.path === filePath);
            const content = file ? localStorage.getItem(`file_${filePath}`) : null;

            if (file && content) {
                const savePath = await dialog.save({
                    filters: [{
                        name: 'All Files',
                        extensions: ['*']
                    }],
                    defaultPath: file.name
                });

                if (savePath) {
                    await writeTextFile(savePath, content);
                    await dialog.message('File saved successfully!', { type: 'info' });
                }
            }
        } catch (error) {
            console.error('Error saving file:', error);
            await dialog.message('Failed to save file', { type: 'error' });
        }
    };

    const handleFileInfo = async (filePath: string) => {
        try {
            const file = openEditors.find(f => f.path === filePath);
            if (file) {
                const content = localStorage.getItem(`file_${filePath}`);
                if (content) {
                    const fileSize = new Blob([content]).size;
                    const lineCount = content.split('\n').length;
                    const message = [
                        `File: ${file.name}`,
                        `Path: ${file.path}`,
                        `Size: ${fileSize} bytes`,
                        `Lines: ${lineCount}`,
                        `Type: ${file.name.split('.').pop()?.toUpperCase() || 'Unknown'}`
                    ].join('\n');

                    await dialog.message(message, {
                        title: 'File Information',
                        type: 'info'
                    });
                }
            }
        } catch (error) {
            console.error('Error showing file info:', error);
            await dialog.message('Failed to get file information', { type: 'error' });
        }
    };

    const handleFolderSelect = useCallback(async () => {
        try {
            setIsLoading(true);

            const selectedPath = await dialog.open({
                directory: true,
                multiple: false,
                title: 'Select a folder'
            });

            if (!selectedPath) {
                return;
            }

            const entries = await readDir(selectedPath as string, { recursive: true });

            const processEntries = async (entries: any[], parentPath: string = ''): Promise<FileSystemItem[]> => {
                const items: FileSystemItem[] = [];

                for (const entry of entries) {
                    const entryPath = entry.path;
                    const name = await basename(entryPath);

                    if (entry.children) {
                        // Process directory
                        const folder: FileSystemItem = {
                            name,
                            type: 'folder',
                            path: entryPath,
                            children: await processEntries(entry.children, entryPath)
                        };
                        items.push(folder);
                    } else {
                        try {
                            // Process file
                            const content = await readTextFile(entryPath);
                            const file: FileSystemItem = {
                                name,
                                type: 'file',
                                content,
                                path: entryPath
                            };
                            items.push(file);
                            localStorage.setItem(`file_${entryPath}`, content);
                        } catch (error) {
                            console.error(`Error reading file ${entryPath}:`, error);
                        }
                    }
                }

                return items;
            };

            const processedFiles = await processEntries(entries);
            onFolderSelect(processedFiles);

        } catch (error) {
            console.error("Error processing folder:", error);
            await dialog.message('Failed to process folder', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [onFolderSelect]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        updateOpenEditorContent: (filePath: string, newContent: string) => {
            setOpenEditors(prev => {
                const updated = prev.map(file =>
                    file.path === filePath ? { ...file, content: newContent } : file
                );
                localStorage.setItem('openEditors', JSON.stringify(updated));
                return updated;
            });
            localStorage.setItem(`file_${filePath}`, newContent);
        },
        handleFolderSelect,
        handleFileCreate: (fileName?: string) => {
            const defaultContent = '# New Python File\n';
            if (fileName) {
                handleFileCreate(fileName, defaultContent);
            } else {
                handleFileCreate('untitled.py', defaultContent);
            }
        }
    }), [handleFolderSelect, handleFileCreate]);

    // Directory Item component for rendering files and folders
    const DirectoryItem: React.FC<{
        item: FileSystemItem;
        depth: number;
        visibleTypes: string[];
    }> = ({ item, depth, visibleTypes }) => {
        const [isOpen, setIsOpen] = useState(false);

        // Click handler for files and folders
        const handleClick = () => {
            if (item.type === 'folder') {
                setIsOpen(!isOpen);
            } else if (item.type === 'file') {
                handleFileSelect(item);
            }
        };

        // Get appropriate icon color based on file extension
        const getFileIconColor = (fileName: string) => {
            const ext = fileName.split('.').pop()?.toLowerCase();
            switch (ext) {
                case 'py': return 'text-blue-400';
                case 'js':
                case 'jsx':
                case 'ts':
                case 'tsx': return 'text-yellow-400';
                case 'json': return 'text-green-400';
                case 'md': return 'text-purple-400';
                case 'css': return 'text-pink-400';
                case 'html': return 'text-orange-400';
                default: return 'text-gray-400';
            }
        };

        // Filter files based on visible file types
        if (item.type === 'file') {
            const extension = '.' + item.name.split('.').pop()?.toLowerCase();
            if (!visibleTypes.includes(extension)) {
                return null;
            }
        }

        return (
            <div>
                <div
                    className={`
                        group relative flex items-center py-1 px-2 cursor-pointer
                        hover:bg-gray-800/50 transition-all duration-200
                        ${depth > 0 ? 'ml-4' : ''}
                    `}
                    onClick={handleClick}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                        opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                    <div className="relative flex items-center gap-2 py-1">
                        {item.type === 'folder' ? (
                            <>
                                {isOpen ? (
                                    <ChevronDown size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                ) : (
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                )}
                                    <Folder size={16} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                </>
                            ) : (
                                <File size={16} className={`${getFileIconColor(item.name)} group-hover:text-white transition-colors`} />
                            )}

                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {item.name}
                            </span>
                        </div>
                    </div>

                    {/* Children */}
                    {item.type === 'folder' && isOpen && item.children && (
                        <div className="pl-2 border-l border-gray-800/50 ml-2">
                            {item.children.map((child, index) => (
                                <DirectoryItem
                                    key={`${child.path}-${index}`}
                                    item={child}
                                    depth={depth + 1}
                                    visibleTypes={visibleTypes}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        };

    // Expandable section header component
    const ExpandableHeader: React.FC<{
        title: string;
        isExpanded: boolean;
        onToggle: () => void;
    }> = ({ title, isExpanded, onToggle }) => (
        <div
            onClick={onToggle}
            className="group flex items-center py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all duration-200"
        >
            {isExpanded ? (
                <ChevronDown size={16} className="mr-2 text-gray-400 group-hover:text-white transition-colors" />
            ) : (
                <ChevronRight size={16} className="mr-2 text-gray-400 group-hover:text-white transition-colors" />
            )}
            <h3 className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                {title}
            </h3>
        </div>
    );

    // Filter items based on visible file types
    const filteredItems = useMemo(() => {
        const filterItems = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.filter(item => {
                if (item.type === 'folder') {
                    const filteredChildren = item.children ? filterItems(item.children) : [];
                    return filteredChildren.length > 0;
                } else {
                    const extension = '.' + item.name.split('.').pop()?.toLowerCase();
                    return visibleTypes.includes(extension);
                }
            }).map(item => {
                if (item.type === 'folder' && item.children) {
                    return { ...item, children: filterItems(item.children) };
                }
                return item;
            });
        };
        return filterItems(items);
    }, [items, visibleTypes]);

    return (
        <div
            className={`bg-[#1a1f2d] border-r border-gray-800/30 transition-all duration-300 h-full flex flex-col`}
            style={{ width: isMinimized ? "100px" : "300px" }}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800/30 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                {!isMinimized && <h2 className="text-white font-medium">Directory</h2>}
                <div className="flex">
                    {!isMinimized && (
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                        >
                            <Settings size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
                    >
                        {isMinimized ? <ChevronRightExpand size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4">
                        {/* Action Buttons */}
                        <button
                            onClick={handleFolderSelect}
                            className="group relative w-full bg-[#2b3240] backdrop-blur-xl rounded-lg overflow-hidden
                                hover:-translate-y-0.5 transition-all duration-300 
                                hover:shadow-lg hover:shadow-indigo-500/20 mb-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2b3240] to-[#363d4e] 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative py-2.5 px-4 flex items-center justify-center gap-2">
                                <Folder
                                    size={16}
                                    className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                                />
                                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                    Select Folder
                                </span>
                            </div>
                        </button>

                        <div className="mb-2">
                            <GitCloneButton onFolderSelect={onFolderSelect} />
                        </div>

                        <div className="mb-4">
                            <CreateFileButton onFileCreate={handleFileCreate} />
                        </div>

                        {/* File Type Settings */}
                        {isSettingsOpen && (
                            <div className="border-t border-gray-800/30 pt-4 mb-4">
                                <h3 className="text-white font-medium mb-2">File Types</h3>
                                <div className="flex justify-between mb-2">
                                    <button
                                        onClick={() => setVisibleTypes([...commonFileTypes])}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={() => setVisibleTypes([])}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="max-h-40 overflow-y-auto">
                                    {commonFileTypes.map(fileType => (
                                        <label
                                            key={fileType}
                                            className="flex items-center mb-1 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer group transition-all duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={visibleTypes.includes(fileType)}
                                                onChange={() => {
                                                    setVisibleTypes(prev =>
                                                        prev.includes(fileType)
                                                            ? prev.filter(type => type !== fileType)
                                                            : [...prev, fileType]
                                                    );
                                                }}
                                                className="mr-2 bg-gray-700 border-gray-600 text-indigo-600 rounded"
                                            />
                                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                                {fileType}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File List Sections */}
                        <div className="mt-4">
                            {/* Open Editors Section */}
                            <div className="mb-4">
                                <ExpandableHeader
                                    title="Open Editors"
                                    isExpanded={isEditorsExpanded}
                                    onToggle={() => setIsEditorsExpanded(!isEditorsExpanded)}
                                />
                                {isEditorsExpanded && (
                                    <div className="space-y-1 mt-1">
                                        {openEditors.map((file, index) => (
                                            <div
                                                key={`${file.path}-${index}`}
                                                className="group relative bg-gray-800/30 backdrop-blur-xl rounded-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                                                    opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative flex items-center justify-between p-2">
                                                    <div
                                                        className="flex items-center flex-grow overflow-hidden cursor-pointer"
                                                        onClick={() => handleOpenEditorSelect(file)}
                                                    >
                                                        <Edit size={16} className="mr-2 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                                        <span className="text-sm text-gray-300 group-hover:text-white truncate transition-colors">
                                                            {file.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleFileInfo(file.path)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                                                        >
                                                            <Info size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveFile(file.path)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                                                        >
                                                            <Save size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFile(file.path)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Source Section */}
                            <div className="mb-4">
                                <ExpandableHeader
                                    title="Source"
                                    isExpanded={isSourceExpanded}
                                    onToggle={() => setIsSourceExpanded(!isSourceExpanded)}
                                />
                                {isSourceExpanded && (
                                    <div className="space-y-1 mt-1">
                                        {filteredItems.map((item, index) => (
                                            <DirectoryItem
                                                key={`${item.path}-${index}`}
                                                item={item}
                                                depth={0}
                                                visibleTypes={visibleTypes}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Dialog */}
            <LoadingDialog
                isOpen={isLoading}
                title="Loading Folder"
                message="Please wait while we process your folder structure..."
            />
        </div>
    );
});

export default Directory;