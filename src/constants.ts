import { PythonIDECustomization } from "./types";

// constants.ts
export const AUTOSAVE_DELAY = 15000; // 15 seconds

export const BUILT_IN_FUNCTIONS = new Set([
    'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
    'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod',
    'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr',
    'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
    'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min',
    'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
    'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str',
    'sum', 'super', 'tuple', 'type', 'vars', 'zip'
]);

export const DEFAULT_CUSTOMIZATION: PythonIDECustomization = {
    backgroundColor: '#1E293B',
    textColor: '#E2E8F0',
    lineNumbersColor: '#64748B',
    highlightColor: '#2563EB'
};



