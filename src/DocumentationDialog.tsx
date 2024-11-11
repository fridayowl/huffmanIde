import React, { useState, useEffect } from 'react';
import { X, Save, Edit, BookOpen, RefreshCw, FileText } from 'lucide-react';

interface Documentation {
    documentation: string;
    lastUpdated: string;
    author: string;
    summary?: string;
}

interface DocumentationFile {
    [key: string]: Documentation;
}

interface DocumentationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    blockId: string;
    fileName: string;
    customization: {
        ide?: {
            backgroundColor?: string;
            textColor?: string;
            highlightColor?: string;
        };
        buttons?: {
            backgroundColor?: string;
            textColor?: string;
        };
    };
}

const DocumentationDialog: React.FC<DocumentationDialogProps> = ({
    isOpen,
    onClose,
    blockId,
    fileName,
    customization
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [documentation, setDocumentation] = useState<Documentation>({
        documentation: '',
        lastUpdated: new Date().toISOString(),
        author: 'System',
        summary: ''
    });
    const [editedContent, setEditedContent] = useState('');

    const getDocumentationFile = () => {
        const docFileName = `${fileName}.documentation.json`;
        try {
            const existingDocs = localStorage.getItem(docFileName);
            if (!existingDocs) return {};
            return JSON.parse(existingDocs) as DocumentationFile;
        } catch (error) {
            console.error('Error parsing documentation file:', error);
            return {};
        }
    };

    const generateSummary = (content: string): string => {
        if (!content) return 'No documentation available.';
        const words = content.split(' ');
        if (words.length <= 10) return content;
        return `${words.slice(0, 10).join(' ')}... (${words.length} words total)`;
    };

    const loadDocumentation = () => {
        setIsLoading(true);
        try {
            const blockIdFiltered = blockId.split(".").pop();
            if (!blockIdFiltered) {
                throw new Error('Invalid blockId');
            }

            const documentationFile = getDocumentationFile();

            if (documentationFile && documentationFile[blockIdFiltered]) {
                const doc = documentationFile[blockIdFiltered];
                setDocumentation({
                    ...doc,
                    summary: generateSummary(doc.documentation)
                });
                setEditedContent(doc.documentation);
            } else {
                const newBlockDoc = {
                    documentation: `Documentation for ${blockIdFiltered}`,
                    lastUpdated: new Date().toISOString(),
                    author: "System",
                    summary: `Documentation for ${blockIdFiltered}`
                };
                documentationFile[blockIdFiltered] = newBlockDoc;
                localStorage.setItem(`${fileName}.documentation.json`, JSON.stringify(documentationFile));
                setDocumentation(newBlockDoc);
                setEditedContent(newBlockDoc.documentation);
            }
        } catch (error) {
            console.error('Error loading documentation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!editedContent.trim()) return;

        try {
            const blockIdFiltered = blockId.split(".").pop();
            if (!blockIdFiltered) {
                throw new Error('Invalid blockId');
            }

            const documentationFile = getDocumentationFile();
            const newDoc = {
                documentation: editedContent.trim(),
                lastUpdated: new Date().toISOString(),
                author: "Current User",
                summary: generateSummary(editedContent.trim())
            };

            documentationFile[blockIdFiltered] = newDoc;
            localStorage.setItem(
                `${fileName}.documentation.json`,
                JSON.stringify(documentationFile, null, 2)
            );

            onClose();
        } catch (error) {
            console.error('Error saving documentation:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadDocumentation();
        }
    }, [isOpen, blockId, fileName]);

    const refreshSummary = () => {
        setDocumentation(prev => ({
            ...prev,
            summary: generateSummary(prev.documentation)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="w-[600px] flex flex-col rounded-lg overflow-hidden shadow-lg"
                style={{ backgroundColor: customization.ide?.backgroundColor }}
            >
                {/* Header */}
                <div
                    className="flex justify-between items-center px-3 py-2 border-b border-opacity-20"
                    style={{
                        backgroundColor: customization.ide?.highlightColor,
                        borderColor: customization.ide?.textColor
                    }}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} style={{ color: customization.ide?.textColor }} />
                        <h2 className="text-sm font-medium" style={{ color: customization.ide?.textColor }}>
                            {blockId.split(".").pop()}
                        </h2>
                    </div>
                    <div className="flex items-center gap-1">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-2 py-1 text-xs rounded hover:bg-opacity-80"
                                style={{
                                    backgroundColor: customization.buttons?.backgroundColor,
                                    color: customization.buttons?.textColor
                                }}
                            >
                                <Edit size={12} className="mr-1" />
                                Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-2 py-1 text-xs rounded hover:bg-opacity-80"
                                    style={{
                                        backgroundColor: customization.buttons?.backgroundColor,
                                        color: customization.buttons?.textColor
                                    }}
                                >
                                    <Save size={12} className="mr-1" />
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center px-2 py-1 text-xs rounded hover:bg-opacity-80"
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: '#ffffff'
                                    }}
                                >
                                    <X size={12} className="mr-1" />
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-opacity-80 ml-1"
                            style={{
                                backgroundColor: customization.buttons?.backgroundColor,
                                color: customization.buttons?.textColor
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col p-3 gap-2">
                    {isEditing ? (
                        <div className="flex-grow">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-full min-h-[200px] p-2 rounded border resize-none focus:outline-none focus:ring-1"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#000000',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5'
                                }}
                                placeholder="Enter documentation here..."
                                autoFocus
                            />
                        </div>
                    ) : (
                        <>
                            <div
                                className="rounded p-2 text-xs"
                                style={{
                                    backgroundColor: `${customization.ide?.highlightColor}40`,
                                    borderLeft: `2px solid ${customization.buttons?.backgroundColor}`
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium uppercase tracking-wider opacity-70"
                                        style={{ color: customization.ide?.textColor }}>
                                        AI Summary
                                    </span>
                                    <button
                                        onClick={refreshSummary}
                                        className="opacity-50 hover:opacity-100"
                                    >
                                        <RefreshCw size={12} style={{ color: customization.ide?.textColor }} />
                                    </button>
                                </div>
                                <p style={{ color: customization.ide?.textColor }}>
                                    {documentation.summary}
                                </p>
                            </div>

                            <div
                                className="flex-grow p-2 rounded overflow-auto"
                                style={{
                                    backgroundColor: `${customization.ide?.highlightColor}20`,
                                    color: customization.ide?.textColor,
                                    minHeight: '150px',
                                    maxHeight: '300px'
                                }}
                            >
                                <pre className="whitespace-pre-wrap font-sans text-xs">
                                    {documentation.documentation}
                                </pre>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="px-3 py-2 flex justify-between items-center text-[10px]"
                    style={{
                        borderTop: `1px solid ${customization.ide?.textColor}20`,
                        color: customization.ide?.textColor
                    }}
                >
                    <div className="flex items-center gap-1">
                        <FileText size={10} />
                        <span>Last updated: {new Date(documentation.lastUpdated).toLocaleString()}</span>
                    </div>
                    <span>Author: {documentation.author}</span>
                </div>
            </div>
        </div>
    );
};

export default DocumentationDialog;