// Utility function to standardize special characters in Python code
export const standardizePythonCharacters = (code: string): string => {
    // Map of special characters to their standard Python equivalents
    const characterMap: { [key: string]: string } = {
        // Quotes
        '“': '"',     // Left double quote
        '”': '"',     // Right double quote
        '‘': "'",     // Left single quote
        '’': "'",     // Right single quote
        '`': "'",     // Backtick to single quote

        // Dashes
        '–': '-',     // En dash to hyphen
        '—': '-',     // Em dash to hyphen
        '−': '-',     // Minus sign to hyphen

        // Ellipsis and dots
        '…': '...',   // Ellipsis to three dots
        '․': '.',     // One dot leader to period
        '‥': '..',    // Two dot leader to periods

        // Spaces and whitespace
        '\u00A0': ' ', // Non-breaking space to regular space
        '\u2003': ' ', // Em space to regular space
        '\u2002': ' ', // En space to regular space
        '\u2004': ' ', // Three-per-em space to regular space
        '\u2005': ' ', // Four-per-em space to regular space

        // Other common substitutions
        '≤': '<=',    // Less than or equal
        '≥': '>=',    // Greater than or equal
        '≠': '!=',    // Not equal
        '×': '*',     // Multiplication sign to asterisk
        '÷': '/',     // Division sign to forward slash
        '≈': '==',    // Almost equal to double equals
        '≡': '=='     // Identical to double equals
    };

    // Replace each special character with its standard equivalent
    let standardizedCode = code;
    Object.entries(characterMap).forEach(([fancy, standard]) => {
        standardizedCode = standardizedCode.replace(new RegExp(fancy, 'g'), standard);
    });

    // // Additional cleanup for common edge cases
    // standardizedCode = standardizedCode
    //     // Normalize multiple consecutive spaces to single space
    //     .replace(/\s+/g, ' ')
    //     // Fix spacing around operators
    //     .replace(/\s*([+\-*/%=<>!&|^])\s*/g, ' $1 ')
    //     // Remove spaces after opening and before closing parentheses
    //     .replace(/\(\s+/g, '(')
    //     .replace(/\s+\)/g, ')')
    //     // Ensure single space after commas
    //     .replace(/,\s*/g, ', ')
    //     // Remove trailing whitespace from lines
    //     .replace(/[ \t]+$/gm, '')
    //     // Normalize line endings to \n
    //     .replace(/\r\n?/g, '\n')
    //     // Remove multiple consecutive empty lines
    //     .replace(/\n\s*\n\s*\n/g, '\n\n');

    return standardizedCode;
};

// Export test helper to verify character standardization
export const testStandardization = (input: string, expected: string): boolean => {
    const standardized = standardizePythonCharacters(input);
    const isMatch = standardized === expected;
    if (!isMatch) {
        console.log('Standardization Test Failed:');
        console.log('Input:', input);
        console.log('Expected:', expected);
        console.log('Actual:', standardized);
    }
    return isMatch;
};
