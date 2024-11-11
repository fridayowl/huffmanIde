import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertTriangle, Copy } from 'lucide-react';

interface TestResult {
    type: 'unit' | 'edge' | 'comparison';
    name: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error?: string;
}

interface FocusedTestPanelProps {
    code: string;
    onClose: () => void;
    customization: {
        backgroundColor?: string;
        textColor?: string;
        highlightColor?: string;
        ide?: {
            backgroundColor?: string;
            textColor?: string;
        };
        buttons?: {
            backgroundColor?: string;
            textColor?: string;
        };
    };
}

export default function FocusedTestPanel({
    code,
    onClose,
    customization,
}: FocusedTestPanelProps) {
    const [selectedType, setSelectedType] = useState<'unit' | 'edge' | 'comparison'>('unit');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const getFunctionInfo = (code: string) => {
        const functionMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)/);
        if (functionMatch) {
            return {
                name: functionMatch[1],
                params: functionMatch[2].split(',').map((p) => p.trim()),
            };
        }
        return null;
    };

    const functionInfo = getFunctionInfo(code);

    const getTestCases = (type: 'unit' | 'edge' | 'comparison') => {
        switch (type) {
            case 'unit':
                return [
                    { name: 'Basic Functionality', input: 'normal_input', expectedOutput: 'expected_result' },
                    { name: 'Standard Input', input: '42', expectedOutput: '42' },
                    { name: 'Simple String', input: '"test"', expectedOutput: 'test' },
                ];
            case 'edge':
                return [
                    { name: 'Empty Input', input: '', expectedOutput: 'None' },
                    { name: 'Very Large Number', input: '999999999', expectedOutput: 'handled_large_number' },
                    { name: 'Special Characters', input: '!@#$%^', expectedOutput: 'handled_special_chars' },
                    { name: 'Null Input', input: 'None', expectedOutput: 'handled_null' },
                ];
            case 'comparison':
                return [
                    { name: 'Case Sensitivity', input: 'Test', expectedOutput: 'test' },
                    { name: 'Whitespace Handling', input: '  spaced  ', expectedOutput: 'spaced' },
                    { name: 'Number Format', input: '42.0', expectedOutput: '42' },
                ];
        }
    };

    const executeCode = async (input: string): Promise<string> => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (code.includes('print')) return `Output: ${input}`;
            if (code.includes('return')) return input;
            if (code.includes('if') && code.includes('else')) {
                return input ? 'condition met' : 'condition not met';
            }
            return 'executed successfully';
        } catch (error: any) {
            throw new Error(`Execution failed: ${error.message}`);
        }
    };

    const runTests = async () => {
        setIsRunning(true);
        const testCases = getTestCases(selectedType);
        const results: TestResult[] = [];

        try {
            for (const testCase of testCases) {
                try {
                    const actualOutput = await executeCode(testCase.input);
                    results.push({
                        type: selectedType,
                        name: testCase.name,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput,
                        passed: actualOutput.toString() === testCase.expectedOutput.toString(),
                    });
                } catch (error: any) {
                    results.push({
                        type: selectedType,
                        name: testCase.name,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: 'ERROR',
                        passed: false,
                        error: error.message,
                    });
                }
            }
        } finally {
            setTestResults(results);
            setIsRunning(false);
        }
    };

    const copyResults = () => {
        const resultsText = testResults
            .map(
                (result) =>
                    `Test: ${result.name}\n` +
                    `Input: ${result.input}\n` +
                    `Expected: ${result.expectedOutput}\n` +
                    `Actual: ${result.actualOutput}\n` +
                    `Status: ${result.passed ? 'PASSED' : 'FAILED'}` +
                    (result.error ? `\nError: ${result.error}` : '')
            )
            .join('\n\n');

        navigator.clipboard.writeText(resultsText);
    };

    return (
        <div
            className="w-full rounded-lg shadow-lg overflow-hidden flex flex-col"
            style={{
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                maxHeight: '400px',
            }}
        >
            {/* Header with inline test types */}
            <div
                className="p-4 border-b flex-shrink-0 flex items-center gap-4"
                style={{ backgroundColor: customization.highlightColor }}
            >
                <h2 className="text-lg font-semibold flex-shrink-0">
                    {functionInfo ? `Testing: ${functionInfo.name}()` : 'Code Testing'}
                </h2>
                <div className="flex space-x-2">
                    {(['unit', 'edge', 'comparison'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className="px-3 py-1 rounded text-sm transition-colors duration-200"
                            style={{
                                backgroundColor: selectedType === type
                                    ? customization.buttons?.backgroundColor
                                    : 'transparent',
                                color: selectedType === type
                                    ? customization.buttons?.textColor
                                    : customization.textColor,
                                border: `1px solid ${selectedType === type
                                    ? customization.buttons?.backgroundColor
                                    : customization.textColor}`
                            }}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)} Tests
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto">
                {/* Test Information */}
                <div className="p-4 border-b" style={{ backgroundColor: customization.backgroundColor }}>
                    <h3 className="font-medium mb-2">Test Description</h3>
                    <p className="text-sm opacity-80">
                        {selectedType === 'unit' && 'Testing basic functionality and standard inputs'}
                        {selectedType === 'edge' && 'Testing boundary conditions and extreme cases'}
                        {selectedType === 'comparison' && 'Comparing expected vs actual outputs'}
                    </p>
                </div>

                {/* Results Section */}
                <div className="p-4" style={{ backgroundColor: customization.backgroundColor }}>
                    {/* Fixed Action Buttons */}
                    <div
                        className="sticky top-0 z-10 flex justify-between mb-4 py-2"
                        style={{ backgroundColor: customization.backgroundColor }}
                    >
                        <button
                            onClick={runTests}
                            disabled={isRunning}
                            className="px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2"
                            style={{
                                backgroundColor: customization.buttons?.backgroundColor,
                                color: customization.buttons?.textColor,
                                opacity: isRunning ? 0.7 : 1
                            }}
                        >
                            <Play size={16} />
                            {isRunning ? 'Running...' : 'Run Tests'}
                        </button>
                        {testResults.length > 0 && (
                            <button
                                onClick={copyResults}
                                className="px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2"
                                style={{
                                    backgroundColor: customization.buttons?.backgroundColor,
                                    color: customization.buttons?.textColor,
                                }}
                            >
                                <Copy size={16} />
                                Copy Results
                            </button>
                        )}
                    </div>

                    {/* Scrollable Results List */}
                    <div className="space-y-4">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className="p-4 rounded"
                                style={{
                                    backgroundColor: customization.ide?.backgroundColor || customization.highlightColor,
                                    border: `1px solid ${result.passed ? '#10B981' : '#EF4444'}`
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {result.passed ? (
                                        <CheckCircle className="text-green-500" size={20} />
                                    ) : (
                                        <XCircle className="text-red-500" size={20} />
                                    )}
                                    <span className="font-medium">{result.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-medium mb-1">Input:</div>
                                        <div className="font-mono p-2 rounded opacity-90">{result.input}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium mb-1">Expected Output:</div>
                                        <div className="font-mono p-2 rounded opacity-90">{result.expectedOutput}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="font-medium mb-1">Actual Output:</div>
                                        <div className="font-mono p-2 rounded opacity-90">{result.actualOutput}</div>
                                    </div>
                                    {result.error && (
                                        <div className="col-span-2 text-red-500">
                                            <div className="font-medium mb-1">Error:</div>
                                            <div className="font-mono p-2 rounded opacity-90">{result.error}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}