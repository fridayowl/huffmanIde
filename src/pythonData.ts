import { PythonSnippet } from "./types";

export const pythonSnippets: Record<string, PythonSnippet> = {
    'if': {
        code: 'if condition:\n\t',
        description: 'Create an if statement'
    },
    'for': {
        code: 'for item in iterable:\n\t',
        description: 'Create a for loop'
    },
    'while': {
        code: 'while condition:\n\t',
        description: 'Create a while loop'
    },
    'def': {
        code: 'def function_name(parameters):\n\t',
        description: 'Define a new function'
    },
    'class': {
        code: 'class ClassName:\n\tdef __init__(self):\n\t\t',
        description: 'Create a new class'
    },
    'try': {
        code: 'try:\n\t\n\texcept Exception as e:\n\t',
        description: 'Create a try-except block'
    },
    'with': {
        code: 'with expression as variable:\n\t',
        description: 'Create a with statement'
    },
    'lambda': {
        code: 'lambda x: ',
        description: 'Create a lambda function'
    },
    'list': {
        code: '[x for x in iterable]',
        description: 'Create a list comprehension'
    },
    'dict': {
        code: '{key: value for item in iterable}',
        description: 'Create a dictionary comprehension'
    }
};

export const pythonKeywords: string[] = [
    'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
    'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import',
    'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise',
    'return', 'True', 'try', 'while', 'with', 'yield'
];


export const pythonBuiltins: string[] = [
    'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
    'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr',
    'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float',
    'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help',
    'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
    'list', 'locals', 'map', 'max', 'min', 'next', 'object', 'oct', 'open',
    'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round',
    'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super',
    'tuple', 'type', 'vars', 'zip'
];

export const pythonDocs: Record<string, string> = {
    'if': 'Conditional statement for control flow',
    'for': 'Create a for loop to iterate over a sequence',
    'while': 'Create a while loop that continues as long as a condition is true',
    'def': 'Define a new function',
    'class': 'Define a new class',
    'try': 'Create a try-except block for error handling',
    'with': 'Context manager for resource management',
    'lambda': 'Create an anonymous function',
    'print': 'Print objects to the text stream',
    'len': 'Return the length of an object',
    'range': 'Create a sequence of numbers',
    'str': 'Create a new string object',
    'list': 'Create a new list object',
    'dict': 'Create a new dictionary object',
    'int': 'Convert a number or string to an integer',
    'float': 'Convert a number or string to a floating point number',
    'bool': 'Convert a value to a Boolean',
    'input': 'Read a string from standard input',
    'open': 'Open a file and return a file object',
    // Add more documentation as needed
};
