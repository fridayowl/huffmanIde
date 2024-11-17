import React, { useEffect, useState } from 'react';
import { TestTube, Plus, Trash2, Edit2, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import TestRecordDialog from './TestRecordDialog';
import TestTemplates from './TestTemplates';

interface TestRecord {
    id: string;
    name: string;
    required: 'Required' | 'Optional';
    status: 'Not Started' | 'In Progress' | 'Completed';
    result: 'Pass' | 'Fail' | 'Not Run';
    notes: string;
    dateCreated: string;
    lastModified: string;
}

interface TestingPanelProps {
    code: string;
    fileName: string;
    blockId?: string;
    isFromIDE?: boolean;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
        lineNumbersColor: string;
    };
}

export default function TestingPanel({
    code,
    fileName,
    blockId = 'Overall',
    isFromIDE = false,
    customization
}: TestingPanelProps) {
    const [records, setRecords] = useState<TestRecord[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TestRecord>();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        required: 'all',
        status: 'all',
        result: 'all'
    });
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const filteredRecords = records.filter(record => (
        (filters.required === 'all' || record.required === filters.required) &&
        (filters.status === 'all' || record.status === filters.status) &&
        (filters.result === 'all' || record.result === filters.result)
    ));

    const handleNewTest = () => {
        setEditingRecord(undefined);
        setIsDialogOpen(true);
    };

    // Load test records from localStorage
    const loadTestRecords = () => {
        const testFileName = `${fileName}.testing.json`;
        try {
            const existingTests = localStorage.getItem(testFileName);
            if (existingTests) {
                const testData = JSON.parse(existingTests);
                const targetKey = isFromIDE ? 'Overall' : blockId;
                setRecords(testData[targetKey] || []);
            }
        } catch (error) {
            console.error('Error loading test records:', error);
            setRecords([]);
        }
    };

    // Save test records to localStorage
    const saveTestRecords = (updatedRecords: TestRecord[]) => {
        const testFileName = `${fileName}.testing.json`;
        try {
            const existingTests = localStorage.getItem(testFileName);
            const testData = existingTests ? JSON.parse(existingTests) : {};
            const targetKey = isFromIDE ? 'Overall' : blockId;

            testData[targetKey] = updatedRecords;
            localStorage.setItem(testFileName, JSON.stringify(testData, null, 2));
        } catch (error) {
            console.error('Error saving test records:', error);
        }
    };
    useEffect(() => {
        loadTestRecords();
    }, [blockId, fileName]);
    
    const handleSaveTest = (record: TestRecord) => {
        const updatedRecords = editingRecord
            ? records.map(r => r.id === record.id ? record : r)
            : [...records, record];

        setRecords(updatedRecords);
        saveTestRecords(updatedRecords);
        setEditingRecord(undefined);
    };
    const handleDeleteTest = (id: string) => {
        const updatedRecords = records.filter(r => r.id !== id);
        setRecords(updatedRecords);
        saveTestRecords(updatedRecords);
    };
   
    const handleExportAll = () => {
        const data = JSON.stringify(records, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-records-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const handleTemplateSelect = (template: TestRecord) => {
        const newRecord = {
            ...template,
            id: `${template.id}-${Date.now()}`,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        const updatedRecords = [...records, newRecord];
        setRecords(updatedRecords);
        saveTestRecords(updatedRecords);
    };
    return (
        <div className=" fixed inset-0 z-50 rounded-lg border overflow-hidden relative" style={{
            backgroundColor: customization.backgroundColor,
            borderColor: `${customization.textColor}20`
        }}>
            {/* Header */}
            <div className="p-2 border-b flex justify-between items-center gap-2 relative z-20"
                style={{ borderColor: `${customization.textColor}20` }}>
                <div className="flex items-center gap-2">
                    <TestTube size={14} style={{ color: customization.highlightColor }} />
                    <h3 className="text-sm font-medium" style={{ color: customization.textColor }}>
                        Test Records
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-1 rounded hover:bg-white/5"
                        style={{ color: customization.textColor }}
                    >
                        <Filter size={14} />
                    </button>
                    <button
                        onClick={handleExportAll}
                        className="p-1 rounded hover:bg-white/5"
                        style={{ color: customization.textColor }}
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={handleNewTest}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                        style={{
                            backgroundColor: customization.textColor,
                            color: customization.backgroundColor
                        }}
                    >
                        <Plus size={12} />
                        New
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="relative"
                    style={{ borderColor: `${customization.textColor}20` }}>
                    <div className="flex gap-2">
                        <select
                            value={filters.required}
                            onChange={e => setFilters(f => ({ ...f, required: e.target.value }))}
                            className="px-1 py-0.5 rounded text-xs bg-white/5 border border-white/10"
                            style={{ color: customization.textColor }}
                        >
                            <option value="all">All Requirements</option>
                            <option value="Required">Required</option>
                            <option value="Optional">Optional</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                            className="px-1 py-0.5 rounded text-xs bg-white/5 border border-white/10"
                            style={{ color: customization.textColor }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <select
                            value={filters.result}
                            onChange={e => setFilters(f => ({ ...f, result: e.target.value }))}
                            className="px-1 py-0.5 rounded text-xs bg-white/5 border border-white/10"
                            style={{ color: customization.textColor }}
                        >
                            <option value="all">All Results</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                            <option value="Not Run">Not Run</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Records List */}
            <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                <TestTemplates
                    onSelectTemplate={handleTemplateSelect}
                    customization={customization}
                />
                {filteredRecords.map(record => (
                    <div
                        key={record.id}
                        className="p-2 rounded border cursor-pointer hover:bg-white/5"
                        style={{
                            backgroundColor: `${customization.highlightColor}05`,
                            borderColor: `${customization.textColor}10`
                        }}
                        onClick={() => setExpandedCard(expandedCard === record.id ? null : record.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium" style={{ color: customization.textColor }}>
                                        {record.name}
                                    </h4>
                                    <span className="text-xs px-1.5 rounded"
                                        style={{
                                            backgroundColor: record.result === 'Pass' ? '#10B98120' :
                                                record.result === 'Fail' ? '#EF444420' : 'transparent',
                                            color: record.result === 'Pass' ? '#10B981' :
                                                record.result === 'Fail' ? '#EF4444' :
                                                    `${customization.textColor}80`
                                        }}>
                                        {record.result}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingRecord(record);
                                        setIsDialogOpen(true);
                                    }}
                                    className="p-1 rounded hover:bg-white/10"
                                >
                                    <Edit2 size={12} style={{ color: customization.textColor }} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRecords(prev => prev.filter(r => r.id !== record.id));
                                    }}
                                    className="p-1 rounded hover:bg-white/10"
                                >
                                    <Trash2 size={12} style={{ color: '#EF4444' }} />
                                </button>
                                {expandedCard === record.id ? (
                                    <ChevronUp size={12} style={{ color: customization.textColor }} />
                                ) : (
                                    <ChevronDown size={12} style={{ color: customization.textColor }} />
                                )}
                            </div>
                        </div>

                        {expandedCard === record.id && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-2 text-xs" style={{ color: `${customization.textColor}80` }}>
                                    <span>{record.required}</span>
                                    <span>{record.status}</span>
                                </div>
                                {record.notes && (
                                    <p className="text-xs" style={{ color: `${customization.textColor}80` }}>
                                        {record.notes}
                                    </p>
                                )}
                                <div className="text-xs" style={{ color: `${customization.textColor}60` }}>
                                    Modified: {new Date(record.lastModified).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredRecords.length === 0 && (
                    <div
                        className="text-center py-4 text-xs"
                        style={{ color: `${customization.textColor}60` }}
                    >
                        No test records found
                    </div>
                )}
            </div>
             
            {/* Test Recording Dialog */}
            <TestRecordDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingRecord(undefined);
                }}
                customization={customization}
                initialData={editingRecord}
                onSave={handleSaveTest}
            />
        </div>
    );
}