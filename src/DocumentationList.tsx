import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface DocumentationFile {
    name: string;
    content: string;
    lastUpdated: string;
    author: string;
}

interface DocumentationListProps {
    fileName: string | null;
}

const DocumentationList: React.FC<DocumentationListProps> = ({ fileName }) => {
    const [docs, setDocs] = useState<DocumentationFile[]>([]);
    const [expandedFiles, setExpandedFiles] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const getAllDocumentationFiles = () => {
            const documentationFiles: DocumentationFile[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (key && key.endsWith('.documentation.json')) {
                    try {
                        const content = localStorage.getItem(key);
                        if (content) {
                            const parsedContent = JSON.parse(content);

                            Object.entries(parsedContent).forEach(([docName, value]: [string, any]) => {
                                documentationFiles.push({
                                    name: `${key}/${docName}`,
                                    content: value.documentation || 'No documentation available',
                                    lastUpdated: value.lastUpdated || new Date().toISOString(),
                                    author: value.author || 'System'
                                });
                            });
                        }
                    } catch (error) {
                        console.error(`Error parsing documentation file ${key}:`, error);
                    }
                }
            }

            return documentationFiles;
        };

        const allDocs = getAllDocumentationFiles();
        setDocs(allDocs);

        // Initialize expanded state
        const initialExpandedState = allDocs.reduce((acc: { [key: string]: boolean }, doc) => {
            const filename = extractFilename(doc.name);
            if (filename) {
                acc[filename] = false;
            }
            return acc;
        }, {});
        setExpandedFiles(initialExpandedState);
    }, [fileName]);

    // Helper function to extract filename
    const extractFilename = (name: string): string | null => {
        const match = name.match(/\((.*?\.py)\)/);
        if (match) {
            return match[1];
        }
        // If no parentheses, check if it's a direct .py file
        if (name.endsWith('.py')) {
            const parts = name.split('/');
            return parts[parts.length - 1];
        }
        return null;
    };

    // Helper function to extract block name
    const extractBlockName = (name: string): string => {
        const parts = name.split('/')[1];
        const blockMatch = parts.match(/(.*?)\s*\(/);
        return blockMatch ? blockMatch[1] : parts;
    };

    // Group docs by their actual filename
    const groupedDocs = docs.reduce((acc: { [key: string]: DocumentationFile[] }, doc) => {
        const filename = extractFilename(doc.name);
        if (filename) {
            if (!acc[filename]) {
                acc[filename] = [];
            }
            acc[filename].push(doc);
        }
        return acc;
    }, {});

    const toggleExpanded = (filename: string) => {
        setExpandedFiles(prev => ({
            ...prev,
            [filename]: !prev[filename]
        }));
    };

    if (docs.length === 0) {
        return (
            <div className="text-sm text-gray-500 p-2">
                No documentation available
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {Object.entries(groupedDocs).map(([filename, fileDocs]) => (
                <div key={filename} className="rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleExpanded(filename)}
                        className="w-full flex items-center px-4 py-2 bg-gray-800/30 hover:bg-gray-700/50 
                        transition-all duration-200"
                    >
                        <div className="flex items-center w-full">
                            <FileText size={16} className="mr-2 text-gray-400" />
                            <span className="flex-1 text-left text-sm text-gray-300">
                                {filename}
                            </span>
                            {expandedFiles[filename] ? (
                                <ChevronDown size={16} className="text-gray-400" />
                            ) : (
                                <ChevronRight size={16} className="text-gray-400" />
                            )}
                        </div>
                    </button>

                    {expandedFiles[filename] && (
                        <div className="pl-6 py-1 bg-gray-800/20">
                            {fileDocs.map((doc, index) => {
                                const name = doc.name
                                const blockName = name.split(' ')[0];
                                console.log("blockname",doc)
                                return (
                                    <div
                                        key={index}
                                        className="group relative"
                                    >
                                        <div className="flex items-center px-4 py-2 hover:bg-gray-700/30 
                                            cursor-pointer transition-all duration-200">
                                            <ChevronRight size={14} className="mr-2 text-gray-400 
                                                group-hover:text-gray-300" />
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-300 group-hover:text-white">
                                                    {blockName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                                                    {' • '}
                                                    Author: {doc.author}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DocumentationList;