import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, ChevronLeft, ChevronRight as ChevronRightExpand, Settings, Edit, Trash2, Save, Info } from 'lucide-react';
import { dialog } from '@tauri-apps/api';
import { readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import GitCloneButton from './GitCloneButton';
import LoadingDialog from './LoadingDialog';
import DocumentationList from './DocumentationList';
import CreateFileButton from './CreateFileButton';

export interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileSystemItem[];
    content?: string;
}

interface OpenEditorFile {
    name: string;
    content: string;
}

interface DirectoryProps {
    items: FileSystemItem[];
    onFolderSelect: (folder: FileSystemItem[]) => void;
    onFileSelect: (fileContent: string, fileName: string) => void; 
}

export interface DirectoryHandle {
    updateOpenEditorContent: (fileName: string, newContent: string) => void;
    handleFolderSelect: () => Promise<void>;  // Add this method
    handleFileCreate: (fileName?: string) => void;  // Add this method
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

    // Add debounce function
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Debounced minimize function
    const debouncedMinimize = useCallback(
        debounce((shouldMinimize: boolean) => {
            setIsMinimized(shouldMinimize);
        }, 300),
        []
    );

    // Mouse event handlers
    const handleMouseLeave = useCallback(() => {
        debouncedMinimize(true);
    }, [debouncedMinimize]);

    const handleMouseEnter = useCallback(() => {
        debouncedMinimize(false);
    }, [debouncedMinimize]);

    useEffect(() => {
        const storedEditors = localStorage.getItem('openEditors');
        if (storedEditors) {
            setOpenEditors(JSON.parse(storedEditors));
        }
    }, []);

   

    const handleFileCreate = useCallback((fileName: string, content: string) => {
        const newEditor = {
            name: fileName,
            content: content
        };
        setOpenEditors(prev => {
            const updated = [...prev, newEditor];
            localStorage.setItem('openEditors', JSON.stringify(updated));
            return updated;
        });
        setCurrentFile(fileName);
        onFileSelect(content, fileName);
    }, [onFileSelect]);


    const handleFileSelect = useCallback(async (file: FileSystemItem) => {
        if (file.type === 'file' && file.content) {
            try {
                const existingFileIndex = openEditors.findIndex(f => f.name === file.name);
                if (existingFileIndex !== -1) {
                    const confirmOverwrite = await dialog.confirm('File already open', {
                        title: `File "${file.name}" is already open. Do you want to overwrite it?`,
                        type: 'warning'
                    });

                    if (confirmOverwrite) {
                        const updatedOpenEditors = [...openEditors];
                        updatedOpenEditors[existingFileIndex] = { name: file.name, content: file.content };
                        setOpenEditors(updatedOpenEditors);
                        localStorage.setItem('openEditors', JSON.stringify(updatedOpenEditors));
                    } else {
                        file.content = openEditors[existingFileIndex].content;
                    }
                } else {
                    const updatedOpenEditors = [...openEditors, { name: file.name, content: file.content }];
                    setOpenEditors(updatedOpenEditors);
                    localStorage.setItem('openEditors', JSON.stringify(updatedOpenEditors));
                }

                setCurrentFile(file.name);
                onFileSelect(file.content, file.name);
            } catch (error) {
                console.error('Error processing file:', error);
                await dialog.message('Error', {
                    title: 'Failed to process file. Please try again.',
                    type: 'error'
                });
            }
        }
    }, [onFileSelect, openEditors]);

    const handleOpenEditorSelect = (file: OpenEditorFile) => {
        // Construct the storage key
        const storageKey = `file_${file.name}`;

        // Retrieve the file content from localStorage
        const fileContent = localStorage.getItem(storageKey);

        if (fileContent) {
            // If content exists in localStorage, set it as the current file
            setCurrentFile(file.name);
            onFileSelect(fileContent, file.name);
        } else {
            console.error(`File with name ${file.name} not found in localStorage.`);
        }
    };
    const handleDeleteFile = async (fileName: string) => {
        const confirmDelete = await dialog.confirm('Delete File', {
            title: `Are you sure you want to delete ${fileName}?`,
            type: 'warning'
        });

        if (confirmDelete) {
            localStorage.removeItem(`file_${fileName}`);
            setOpenEditors(prev => {
                const updated = prev.filter(file => file.name !== fileName);
                localStorage.setItem('openEditors', JSON.stringify(updated));
                return updated;
            });
            if (currentFile === fileName) {
                setCurrentFile(null);
            }
        }
    };

    const handleSaveFile = async (fileName: string) => {
        const fileContent = openEditors.find(file => file.name === fileName)?.content;
        if (fileContent) {
            try {
                const savePath = await dialog.save({
                    filters: [{
                        name: 'All Files',
                        extensions: ['*']
                    }],
                    defaultPath: fileName
                });

                if (savePath) {
                    await writeTextFile(savePath, fileContent);
                    await dialog.message('Success', {
                        title: 'File saved successfully!',
                        type: 'info'
                    });
                }
            } catch (error) {
                console.error('Error saving file:', error);
                await dialog.message('Error', {
                    title: 'Failed to save file. Please try again.',
                    type: 'error'
                });
            }
        }
    };

    const handleFileInfo = async (fileName: string) => {
        const file = openEditors.find(file => file.name === fileName);
        if (file) {
            const fileSize = new Blob([file.content]).size;
            const lineCount = file.content.split('\n').length;
            await dialog.message('File Information', {
                title: `File: ${fileName}\nSize: ${fileSize} bytes\nLines: ${lineCount}`,
                type: 'info'
            });
        }
    };

    const handleFolderSelect = useCallback(async () => {
        try {
            setIsLoading(true);

            // Open folder selection dialog using Tauri
            const selectedPath = await dialog.open({
                directory: true,
                multiple: false,
                title: 'Select a folder'
            });

            if (!selectedPath) {
                setIsLoading(false);
                return;
            }

            // Read the directory recursively
            const entries = await readDir(selectedPath as string, { recursive: true });
            const fileSystem: FileSystemItem[] = [];

            // Helper function to build file system structure
            const processEntries = async (entries: any[], parentPath: string = ''): Promise<FileSystemItem[]> => {
                const items: FileSystemItem[] = [];

                for (const entry of entries) {
                    const relativePath = entry.path.replace(selectedPath as string, '');
                    const pathParts = relativePath.split('/').filter((p: string) => p);
                    const name = pathParts[pathParts.length - 1];

                    if (entry.children) {
                        // It's a directory
                        const folder: FileSystemItem = {
                            name,
                            type: 'folder',
                            children: await processEntries(entry.children, `${parentPath}/${name}`)
                        };
                        items.push(folder);
                    } else {
                        // It's a file
                        try {
                            const content = await readTextFile(entry.path);
                            const file: FileSystemItem = {
                                name,
                                type: 'file',
                                content
                            };
                            items.push(file);
                            const storageKey = `file_${name}`;
                            localStorage.setItem(storageKey, content);
                        } catch (error) {
                            console.error(`Error reading file ${entry.path}:`, error);
                        }
                    }
                }

                return items;
            };

            const processedFiles = await processEntries(entries);
            onFolderSelect(processedFiles);

        } catch (error) {
            console.error("Error processing folder:", error);
            await dialog.message('Error', {
                title: 'Failed to process folder. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [onFolderSelect]);
    useImperativeHandle(ref, () => ({
        updateOpenEditorContent: (fileName: string, newContent: string) => {
            setOpenEditors(prev => {
                const updated = prev.map(file =>
                    file.name === fileName ? { ...file, content: newContent } : file
                );
                localStorage.setItem('openEditors', JSON.stringify(updated));
                return updated;
            });
        },
        handleFolderSelect: async () => {
            await handleFolderSelect();
        },
        handleFileCreate: (fileName?: string) => {
            // Show the create file dialog with optional pre-filled filename
            const defaultContent = '# New Python File\n';
            if (fileName) {
                handleFileCreate(fileName, defaultContent);
            } else {
                // This assumes CreateFileButton will handle showing the dialog
                // You may need to implement additional logic to show a file creation dialog
                handleFileCreate('untitled.py', defaultContent);
            }
        }
    }), [handleFolderSelect, handleFileCreate]);
    const toggleFileType = (fileType: string) => {
        setVisibleTypes(prev =>
            prev.includes(fileType)
                ? prev.filter(type => type !== fileType)
                : [...prev, fileType]
        );
    };

    const selectAllFileTypes = () => {
        setVisibleTypes([...commonFileTypes]);
    };

    const clearAllFileTypes = () => {
        setVisibleTypes([]);
    };


    const DirectoryItem: React.FC<{
        item: FileSystemItem;
        depth: number;
        visibleTypes: string[];
    }> = ({ item, depth, visibleTypes }) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleClick = () => {
            if (item.type === 'folder') {
                setIsOpen(!isOpen);
            } else if (item.type === 'file') {
                handleFileSelect(item);
            }
        };
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

        if (item.type === 'file') {
            const extension = '.' + item.name.split('.').pop()?.toLowerCase();
            if (!visibleTypes.includes(extension)) {
                return null;
            }
        }
       //comment
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
                    {/* Selection highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                    opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                    {/* Content */}
                    <div className="relative flex items-center gap-2 py-1">
                        {/* Folder/File Icon */}
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

                        {/* File/Folder Name */}
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
                            key={index} 
                            item={child} 
                            depth={depth + 1} 
                            visibleTypes={visibleTypes} /> 
                         ))}
                    </div>
                )}
            </div> 
        );
    };

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

    return (
        <div
            className={`bg-[#1a1f2d] border-r border-gray-800/30 transition-all duration-300`}
            style={{ width: isMinimized ? "100px" : "300px" }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
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
                <div className="p-4">
                    {/* Main Action Buttons */}
                    <button
                        onClick={handleFolderSelect}
                        className="group relative w-full bg-[#2b3240] backdrop-blur-xl rounded-lg overflow-hidden
        hover:-translate-y-0.5 transition-all duration-300 
        hover:shadow-lg hover:shadow-indigo-500/20"
                    >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2b3240] to-[#363d4e] 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Button content */}
                        <div className="relative py-2.5 px-4 flex items-center justify-center gap-2">
                            <Folder
                                size={16}
                                className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                            />
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                Select Folder
                            </span>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </button>
                    <div className="mt-2">
                        <GitCloneButton />
                    </div>
                    <div className="mt-2 ">
                        <CreateFileButton onFileCreate={handleFileCreate} />
                    </div>

                    {/* File Type Settings */}
                    {isSettingsOpen && (
                        <div className="mt-4 border-t border-gray-800/30 pt-4">
                            <h3 className="text-white font-medium mb-2">File Types</h3>
                            <div className="flex justify-between mb-2">
                                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Select All
                                </button>
                                <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                {commonFileTypes.map(fileType => (
                                    <label key={fileType}
                                        className="flex items-center mb-1 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer group transition-all duration-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={visibleTypes.includes(fileType)}
                                            onChange={() => toggleFileType(fileType)}
                                            className="mr-2 bg-gray-700 border-gray-600 text-indigo-600 rounded"
                                        />
                                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{fileType}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* File List Section */}
                    <div className="mt-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {/* Open Editors Section */}
                        <div className="mb-4">
                            <ExpandableHeader
                                title="Open Editors"
                                isExpanded={isEditorsExpanded}
                                onToggle={() => setIsEditorsExpanded(!isEditorsExpanded)}
                            />
                            {isEditorsExpanded && openEditors.map((file, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gray-800/30 backdrop-blur-xl rounded-lg mb-1 overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center justify-between p-2">
                                        <div className="flex items-center flex-grow overflow-hidden"
                                            onClick={() => handleOpenEditorSelect(file)}
                                        >
                                            <Edit size={16} className="mr-2 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                            <span className="text-sm text-gray-300 group-hover:text-white truncate transition-colors">
                                                {file.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleFileInfo(file.name); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                                            >
                                                <Info size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSaveFile(file.name); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.name); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Documentation Section */}
                        <div className="mb-4">
                            <ExpandableHeader
                                title="Documentation"
                                isExpanded={isDocumentationExpanded}
                                onToggle={() => setIsDocumentationExpanded(!isDocumentationExpanded)}
                            />
                            {isDocumentationExpanded && (
                                <div className="text-gray-300">
                                    <DocumentationList fileName={currentFile || 'untitled'} />
                                </div>
                            )}
                        </div>

                        {/* Source Section */}
                        <div>
                            <ExpandableHeader
                                title="Source"
                                isExpanded={isSourceExpanded}
                                onToggle={() => setIsSourceExpanded(!isSourceExpanded)}
                            />
                            {isSourceExpanded && (
                                <div className="space-y-1">
                                    {filteredItems.map((item, index) => (
                                        <DirectoryItem
                                            key={index}
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
            )}

            <LoadingDialog
                isOpen={isLoading}
                title="Loading Folder"
                message="Please wait while we process your folder structure..."
            />
        </div>
    );
});

export default Directory;