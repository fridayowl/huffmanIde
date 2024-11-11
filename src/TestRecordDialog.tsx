import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface TestRecordDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
        lineNumbersColor: string;
    };
    initialData?: TestRecord;
    onSave: (record: TestRecord) => void;
}

export default function TestRecordDialog({
    isOpen,
    onClose,
    customization,
    initialData,
    onSave
}: TestRecordDialogProps) {
    const [testData, setTestData] = useState<Partial<TestRecord>>({
        name: '',
        required: 'Required',
        status: 'Not Started',
        result: 'Not Run',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setTestData(initialData);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!testData.name) return;

        const record: TestRecord = {
            id: initialData?.id || `test-${Date.now()}`,
            name: testData.name,
            required: testData.required as 'Required' | 'Optional',
            status: testData.status as 'Not Started' | 'In Progress' | 'Completed',
            result: testData.result as 'Pass' | 'Fail' | 'Not Run',
            notes: testData.notes || '',
            dateCreated: initialData?.dateCreated || new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        onSave(record);
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={handleOverlayClick}
            onMouseDown={e => e.stopPropagation()}
            style={{ backdropFilter: 'blur(4px)' }}
        >
            <div
                className="relative w-[600px] rounded-lg shadow-xl transform transition-all"
                style={{
                    backgroundColor: customization.backgroundColor,
                    pointerEvents: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Dialog Header */}
                <div
                    className="p-4 border-b flex justify-between items-center"
                    style={{ borderColor: `${customization.textColor}20` }}
                >
                    <h3 className="font-semibold" style={{ color: customization.textColor }}>
                        {initialData ? 'Edit Test Record' : 'Record New Test'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: customization.textColor }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Dialog Content */}
                <form
                    onSubmit={e => { e.preventDefault(); handleSave(); }}
                    className="p-6 space-y-4"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Test Name Input */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1" style={{ color: customization.textColor }}>
                            Test Name
                        </label>
                        <input
                            type="text"
                            value={testData.name || ''}
                            onChange={e => setTestData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 rounded-lg focus:ring-2 focus:outline-none"
                            style={{
                                backgroundColor: `${customization.highlightColor}20`,
                                color: customization.textColor,
                                border: `1px solid ${customization.textColor}20`,
                                zIndex: 60,
                                position: 'relative'
                            }}
                            required
                        />
                    </div>

                    {/* Dropdowns Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Required Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1" style={{ color: customization.textColor }}>
                                Required
                            </label>
                            <select
                                value={testData.required}
                                onChange={e => setTestData(prev => ({ ...prev, required: e.target.value as 'Required' | 'Optional' }))}
                                className="w-full p-2 rounded-lg focus:ring-2 focus:outline-none appearance-none"
                                style={{
                                    backgroundColor: `${customization.highlightColor}20`,
                                    color: customization.textColor,
                                    border: `1px solid ${customization.textColor}20`,
                                    zIndex: 60,
                                    position: 'relative'
                                }}
                            >
                                <option value="Required">Required</option>
                                <option value="Optional">Optional</option>
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1" style={{ color: customization.textColor }}>
                                Status
                            </label>
                            <select
                                value={testData.status}
                                onChange={e => setTestData(prev => ({ ...prev, status: e.target.value as 'Not Started' | 'In Progress' | 'Completed' }))}
                                className="w-full p-2 rounded-lg focus:ring-2 focus:outline-none appearance-none"
                                style={{
                                    backgroundColor: `${customization.highlightColor}20`,
                                    color: customization.textColor,
                                    border: `1px solid ${customization.textColor}20`,
                                    zIndex: 60,
                                    position: 'relative'
                                }}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        {/* Result Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1" style={{ color: customization.textColor }}>
                                Result
                            </label>
                            <select
                                value={testData.result}
                                onChange={e => setTestData(prev => ({ ...prev, result: e.target.value as 'Pass' | 'Fail' | 'Not Run' }))}
                                className="w-full p-2 rounded-lg focus:ring-2 focus:outline-none appearance-none"
                                style={{
                                    backgroundColor: `${customization.highlightColor}20`,
                                    color: customization.textColor,
                                    border: `1px solid ${customization.textColor}20`,
                                    zIndex: 60,
                                    position: 'relative'
                                }}
                            >
                                <option value="Not Run">Not Run</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes Textarea */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1" style={{ color: customization.textColor }}>
                            Notes
                        </label>
                        <textarea
                            value={testData.notes || ''}
                            onChange={e => setTestData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                            className="w-full p-2 rounded-lg focus:ring-2 focus:outline-none resize-none"
                            style={{
                                backgroundColor: `${customization.highlightColor}20`,
                                color: customization.textColor,
                                border: `1px solid ${customization.textColor}20`,
                                zIndex: 60,
                                position: 'relative'
                            }}
                        />
                    </div>

                    {/* Dialog Footer */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                            style={{ color: customization.textColor }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                            style={{
                                backgroundColor: customization.highlightColor,
                                color: '#FFFFFF'
                            }}
                        >
                            {initialData ? 'Update' : 'Save'} Test Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}