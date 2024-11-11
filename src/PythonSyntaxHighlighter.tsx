import React, { useMemo } from 'react';

interface SyntaxHighlighterProps {
    code: string;
    customization?: {
        backgroundColor?: string;
        textColor?: string;
    };
}

// Define syntax highlighting colors with configurable transparency
const colors = {
    // Core Language Keywords
    keyword: '#FF79C6',       // Bright pink - stands out for language constructs
    builtin: '#BD93F9',      // Soft purple - distinguishable for built-in functions

    // Literals and Values
    string: '#F1FA8C',       // Soft yellow - easy on the eyes for strings
    number: '#FF6E6E',       // Coral red - distinctive for numeric values
    boolean: '#FF79C6',      // Matching keywords for true/false
    null: '#FF79C6',         // Matching keywords for null/None

    // Structural Elements
    function: '#50FA7B',     // Bright green - prominent for function names
    class: '#8BE9FD',        // Cyan - distinctive for class names
    decorator: '#FFB86C',    // Soft orange - decorators stand out

    // Variables and Properties
    variable: '#F8F8F2',     // Soft white - neutral for variables
    property: '#8BE9FD',     // Cyan - matches class style
    parameter: '#FFB86C',    // Soft orange - distinguishes parameters

    // Operators and Punctuation
    operator: '#FF79C6',     // Bright pink - matches keywords
    parentheses: '#F8F8F2',  // Soft white - subtle but visible
    bracket: '#F8F8F2',      // Soft white - matches parentheses
    punctuation: '#F8F8F2',  // Soft white - consistent with brackets

    // Comments and Documentation
    comment: '#6272A4',      // Muted blue - less prominent but readable
    docstring: '#6272A4',    // Matching comments for consistency

    // Special Syntax
    regex: '#FFB86C',        // Soft orange - stands out for patterns
    escape: '#FF79C6',       // Bright pink - highlights escape sequences

    // Meta Information
    meta: '#BD93F9',         // Soft purple - for meta information
    markup: '#8BE9FD',       // Cyan - for markup elements

    // Default and Selection
    default: '#F8F8F2',      // Soft white - base text color
    selectionBg: '#44475A',  // Dark selection background
    selectionFg: '#F8F8F2',  // Light selection text

    // Semantic Meanings
    error: '#FF5555',        // Bright red - for errors
    warning: '#FFB86C',      // Soft orange - for warnings
    success: '#50FA7B',      // Bright green - for success
    info: '#8BE9FD',         // Cyan - for information

    // UI Integration
    lineNumber: '#6272A4',   // Muted blue - subtle line numbers
    activeLineNumber: '#F8F8F2', // Soft white - current line
    gutterBg: '#282A36',     // Dark background - for gutters

    // Diff and Version Control
    added: '#50FA7B',        // Bright green - added code
    modified: '#FFB86C',     // Soft orange - modified code
    deleted: '#FF5555',      // Bright red - deleted code

    // Special Highlights
    important: '#FF79C6',    // Bright pink - important elements
    definition: '#50FA7B',   // Bright green - definitions
    reference: '#8BE9FD'     // Cyan - references
};
const fontStack = [
    'DejaVu Sans Mono',  
    'Ubuntu Mono',  
    'Cascadia Code', 
    'Monaco',    
    'JetBrains Mono',           // Primary choice - excellent coding font
    'Fira Code',                // Great fallback with ligatures
    'Source Code Pro',          // Adobe's coding font                // Classic macOS coding font
    'Consolas',                 // Windows default coding font
    'Liberation Mono',          // Open source alternative
    'Menlo',                    // Another macOS font
    'monospace'                 // Final fallback
].join(', ');

// Python keywords and built-in functions
const PYTHON_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);

const PYTHON_BUILTINS = new Set([
    'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
    'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod',
    'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr',
    'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
    'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min',
    'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
    'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str',
    'sum', 'super', 'tuple', 'type', 'vars', 'zip'
]);

export default function PythonSyntaxHighlighter({ code, customization }: SyntaxHighlighterProps) {
    const tokens = useMemo(() => tokenize(code), [code]);
    const backgroundColor = customization?.backgroundColor || '#1E1E1E';
    const textColor = customization?.textColor || '#D4D4D4';

    return (
        <pre
            style={{
                backgroundColor,
                color: textColor,
                fontFamily: fontStack,
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '12px',
                margin: 0,
                overflowX: 'auto',
                tabSize: 4,
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
            }}
        >
            {tokens.map((token, index) => (
                <span
                    key={index}
                    style={{
                        color: getTokenColor(token),
                        fontWeight: getTokenFontWeight(token),
                        fontFeatureSettings: "'calt' 1, 'ss01' 1, 'ss02' 1" 
                    }}
                >
                    {token.value}
                </span>
            ))}
        </pre>
    );
}

interface Token {
    type: string;
    value: string;
}

function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;

    while (current < code.length) {
        let char = code[current];

        // Handle whitespace
        if (/\s/.test(char)) {
            let value = '';
            while (current < code.length && /\s/.test(code[current])) {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'whitespace', value });
            continue;
        }

        // Handle comments
        if (char === '#') {
            let value = char;
            current++;
            while (current < code.length && code[current] !== '\n') {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'comment', value });
            continue;
        }

        // Handle strings
        if (char === '"' || char === "'") {
            const quote = char;
            let value = char;
            current++;

            while (current < code.length) {
                if (code[current] === '\\' && code[current + 1] === quote) {
                    value += code[current] + code[current + 1];
                    current += 2;
                    continue;
                }
                if (code[current] === quote) {
                    value += code[current];
                    current++;
                    break;
                }
                value += code[current];
                current++;
            }
            tokens.push({ type: 'string', value });
            continue;
        }

        // Handle numbers
        if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(code[current + 1]))) {
            let value = '';
            let hasDot = false;

            while (current < code.length) {
                if (code[current] === '.' && !hasDot) {
                    hasDot = true;
                    value += code[current];
                } else if (/[0-9]/.test(code[current])) {
                    value += code[current];
                } else {
                    break;
                }
                current++;
            }
            tokens.push({ type: 'number', value });
            continue;
        }

        // Handle operators
        if (/[+\-*/%=<>!&|^~]/.test(char)) {
            let value = char;
            current++;

            // Handle multi-character operators
            if (['=', '<', '>', '!', '&', '|'].includes(char) && code[current] === '=') {
                value += '=';
                current++;
            }
            tokens.push({ type: 'operator', value });
            continue;
        }

        // Handle parentheses and brackets
        if (/[(){}\[\]]/.test(char)) {
            tokens.push({ type: 'parentheses', value: char });
            current++;
            continue;
        }

        // Handle identifiers (variables, functions, keywords)
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (current < code.length && /[a-zA-Z0-9_]/.test(code[current])) {
                value += code[current];
                current++;
            }

            // Determine token type based on the identifier
            let type = 'variable';
            if (PYTHON_KEYWORDS.has(value)) {
                type = 'keyword';
            } else if (PYTHON_BUILTINS.has(value)) {
                type = 'builtin';
            } else if (code[current] === '(') {
                type = 'function';
            } else if (/^[A-Z]/.test(value)) {
                type = 'class';
            }

            tokens.push({ type, value });
            continue;
        }

        // Handle decorators
        if (char === '@') {
            let value = char;
            current++;
            while (current < code.length && /[a-zA-Z0-9_]/.test(code[current])) {
                value += code[current];
                current++;
            }
            tokens.push({ type: 'decorator', value });
            continue;
        }

        // Handle any other characters
        tokens.push({ type: 'default', value: char });
        current++;
    }

    return tokens;
}

function getTokenColor(token: Token): string {
    return colors[token.type as keyof typeof colors] || colors.default;
}

function getTokenFontWeight(token: Token): string {
    switch (token.type) {
        case 'keyword':
        case 'builtin':
        case 'class':
            return 'bold';
        default:
            return 'normal';
    }
}