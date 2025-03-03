import React, { useState, useEffect } from 'react';
import { BookOpen, Edit, Save, RefreshCw, FileText, X } from 'lucide-react';
import { IDESidePanelProps } from './types';

interface Documentation {
    documentation: string;
    lastUpdated: string;
    author: string;
    summary?: string;
}

interface DocumentationFile {
    [key: string]: Documentation;
}

export const DocumentationPanel: React.FC<IDESidePanelProps & {
    fileName: string;
    blockId: string;
    isFromIDE?: boolean;
}> = ({
    customization,
    fileName,
    blockId ,
    isFromIDE = false
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
                const documentationFile = getDocumentationFile();
                const docKey = isFromIDE ? 'Overall' : blockId;

                if (documentationFile && documentationFile[docKey]) {
                    const doc = documentationFile[docKey];
                    setDocumentation({
                        ...doc,
                        summary: generateSummary(doc.documentation)
                    });
                    setEditedContent(doc.documentation);
                } else {
                    const newBlockDoc = {
                        documentation: `Documentation for ${docKey}`,
                        lastUpdated: new Date().toISOString(),
                        author: "System",
                        summary: `Documentation for ${docKey}`
                    };
                    documentationFile[docKey] = newBlockDoc;
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
                const documentationFile = getDocumentationFile();
                const docKey = isFromIDE ? 'Overall' : blockId;

                const newDoc = {
                    documentation: editedContent.trim(),
                    lastUpdated: new Date().toISOString(),
                    author: "Current User",
                    summary: generateSummary(editedContent.trim())
                };

                documentationFile[docKey] = newDoc;
                localStorage.setItem(
                    `${fileName}.documentation.json`,
                    JSON.stringify(documentationFile, null, 2)
                );

                setDocumentation(newDoc);
                setIsEditing(false);
            } catch (error) {
                console.error('Error saving documentation:', error);
            }
        };

        const refreshSummary = () => {
            setDocumentation(prev => ({
                ...prev,
                summary: generateSummary(prev.documentation)
            }));
        };

        useEffect(() => {
            loadDocumentation();
        }, [blockId, fileName]);

        return (
            <div
                className="rounded-lg border overflow-hidden shadow-lg mb-4 relative"
                style={{
                    backgroundColor: customization.backgroundColor,
                    borderColor: `${customization.textColor}10`,
                    height: '40vh',
                    position: 'relative', // Add this to establish stacking context
                    zIndex: 0 // Base z-index
                }}
            >
                {/* Header */}
                <div
                    className="p-3 border-b flex justify-between items-center"
                    style={{
                        backgroundColor: `${customization.highlightColor}10`,
                        borderColor: `${customization.textColor}10`,
                        position: 'relative',
                        zIndex: 2 // Higher than content area
                    }}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} style={{ color: customization.textColor }} />
                        <h3 className="text-sm font-medium" style={{ color: customization.textColor }}>
                            Documentation {isFromIDE ? '(Overall)' : `for ${blockId}`}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1 rounded hover:bg-white/10"
                                style={{ color: customization.textColor }}
                            >
                                <Edit size={14} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-1 rounded hover:bg-white/10"
                                    style={{ color: customization.textColor }}
                                >
                                    <Save size={14} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-1 rounded hover:bg-white/10"
                                    style={{ color: customization.textColor }}
                                >
                                    <X size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className="p-4 h-[calc(40vh-120px)] overflow-y-auto"
                    style={{
                        position: 'relative',
                        zIndex: 1 // Higher than base, lower than header
                    }}
                >
                    {isEditing ? (
                        <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-full resize-none p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                style={{
                                    backgroundColor: `${customization.highlightColor}10`,
                                    color: customization.textColor,
                                    border: `1px solid ${customization.textColor}20`,
                                    position: 'relative',
                                    zIndex: 3, // Highest in the stack
                                    pointerEvents: 'auto', // Explicitly enable pointer events
                                    cursor: 'text' // Explicitly set cursor
                                }}
                                spellCheck={false}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <>
                            <div
                                className="mb-4 p-2 rounded text-xs"
                                style={{
                                    backgroundColor: `${customization.highlightColor}20`,
                                    borderLeft: `2px solid ${customization.highlightColor}`
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium opacity-80" style={{ color: customization.textColor }}>
                                        AI Summary
                                    </span>
                                    <button onClick={refreshSummary} className="opacity-50 hover:opacity-100">
                                        <RefreshCw size={12} style={{ color: customization.textColor }} />
                                    </button>
                                </div>
                                <p style={{ color: customization.textColor }}>
                                    {documentation.summary}
                                </p>
                            </div>

                            <div className="whitespace-pre-wrap text-sm" style={{ color: customization.textColor }}>
                                {documentation.documentation}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2 flex justify-between items-center text-[10px] border-t"
                    style={{
                        borderColor: `${customization.textColor}20`,
                        color: customization.textColor,
                        backgroundColor: customization.backgroundColor,
                        position: 'relative',
                        zIndex: 2 // Higher than content area
                    }}
                >
                    <div className="flex items-center gap-1">
                        <FileText size={10} />
                        <span>Last updated: {new Date(documentation.lastUpdated).toLocaleString()}</span>
                    </div>
                    <span>Author: {documentation.author}</span>
                </div>
            </div>
        );
    
    };