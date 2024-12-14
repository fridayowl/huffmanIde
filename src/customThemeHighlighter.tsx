// Import only the required types
export interface CodeHighlighterConfig {
    keyword: string;
    operator: string;
    variable: string;
    string: string;
    comment: string;
    function: string;
    class: string;
    number: string;
    property: string;
    tag: string;
    attribute: string;
}

/**
 * Gets the code highlighter configuration for a specific theme
 * @param themeName - The name of the theme
 * @returns The code highlighter configuration for the theme if found, otherwise returns VSCode Dark+ as default
 */
export function getCustomThemeCodeHighlighter(themeName: string): CodeHighlighterConfig {
    // Default VSCode Dark+ highlighting
    const defaultHighlighter: CodeHighlighterConfig = {
        keyword: "#569CD6",
        operator: "#D4D4D4",
        variable: "#9CDCFE",
        string: "#CE9178",
        comment: "#6A9955",
        function: "#DCDCAA",
        class: "#4EC9B0",
        number: "#B5CEA8",
        property: "#9CDCFE",
        tag: "#569CD6",
        attribute: "#9CDCFE"
    };

    // Map of all theme highlighters
    const themeHighlighters: Record<string, CodeHighlighterConfig> = {
        "VSCode Dark+": defaultHighlighter,
        "Dracula": {
            keyword: "#FF79C6",
            operator: "#FF79C6",
            variable: "#F8F8F2",
            string: "#F1FA8C",
            comment: "#6272A4",
            function: "#50FA7B",
            class: "#50FA7B",
            number: "#BD93F9",
            property: "#FF79C6",
            tag: "#FF79C6",
            attribute: "#50FA7B"
        },
        "Nord": {
            keyword: "#81A1C1",
            operator: "#81A1C1",
            variable: "#D8DEE9",
            string: "#A3BE8C",
            comment: "#4C566A",
            function: "#88C0D0",
            class: "#8FBCBB",
            number: "#B48EAD",
            property: "#81A1C1",
            tag: "#81A1C1",
            attribute: "#88C0D0"
        },
        "One Dark Pro": {
            keyword: "#C678DD",
            operator: "#56B6C2",
            variable: "#E06C75",
            string: "#98C379",
            comment: "#5C6370",
            function: "#61AFEF",
            class: "#E5C07B",
            number: "#D19A66",
            property: "#E06C75",
            tag: "#E06C75",
            attribute: "#98C379"
        },
        "Matrix Reloaded": {
            keyword: "#00FF00",
            operator: "#66FF66",
            variable: "#33FF33",
            string: "#00DD00",
            comment: "#006600",
            function: "#00FF00",
            class: "#00FF00",
            number: "#00FF00",
            property: "#33FF33",
            tag: "#00FF00",
            attribute: "#66FF66"
        },
        "Starry Night Dream": {
            keyword: "#FFD700",
            operator: "#FF6347",
            variable: "#F0E68C",
            string: "#FFD700",
            comment: "#6A5ACD",
            function: "#FF6347",
            class: "#FFD700",
            number: "#FF4500",
            property: "#F0E68C",
            tag: "#FFD700",
            attribute: "#FF6347"
        },
        "Mars Aurora": {
            keyword: "#F28F3B",
            operator: "#96C2F1",
            variable: "#C5C8C6",
            string: "#FC5B5D",
            comment: "#6A81D1",
            function: "#96C2F1",
            class: "#F28F3B",
            number: "#FC5B5D",
            property: "#C5C8C6",
            tag: "#F28F3B",
            attribute: "#96C2F1"
        },
        "One Piece Adventure": {
            keyword: "#D42A2A",
            operator: "#1E90FF",
            variable: "#FFD700",
            string: "#228B22",
            comment: "#8A2BE2",
            function: "#FF8C00",
            class: "#D42A2A",
            number: "#1E90FF",
            property: "#FFD700",
            tag: "#D42A2A",
            attribute: "#FFD700"
        },
        "Candy Crush Saga": {
            keyword: "#FF69B4",
            operator: "#00CED1",
            variable: "#32CD32",
            string: "#FFA500",
            comment: "#9370DB",
            function: "#FF1493",
            class: "#FF69B4",
            number: "#00CED1",
            property: "#32CD32",
            tag: "#FF69B4",
            attribute: "#FFA500"
        },
        "Ghibli Dreamscape": {
            keyword: "#8B5B29",
            operator: "#A3C6D4",
            variable: "#3D3D3D",
            string: "#FFB74D",
            comment: "#BDC3C7",
            function: "#F0A500",
            class: "#8B5B29",
            number: "#F39C12",
            property: "#3D3D3D",
            tag: "#8B5B29",
            attribute: "#A3C6D4"
        },
        "Forest Night": {
            keyword: "#A3BE8C",
            operator: "#81A1C1",
            variable: "#D8DEE9",
            string: "#EBCB8B",
            comment: "#4C566A",
            function: "#88C0D0",
            class: "#8FBCBB",
            number: "#B48EAD",
            property: "#81A1C1",
            tag: "#A3BE8C",
            attribute: "#88C0D0"
        },
        "Neon Cyberpunk": {
            keyword: "#FF00FF",
            operator: "#00FFFF",
            variable: "#FF1493",
            string: "#00FF00",
            comment: "#4B0082",
            function: "#00FFFF",
            class: "#FF00FF",
            number: "#FF1493",
            property: "#00FFFF",
            tag: "#FF00FF",
            attribute: "#00FFFF"
        },
        "Protanopia Friendly": {
            keyword: "#FFD700",
            operator: "#87CEEB",
            variable: "#000000",
            string: "#FFD700",
            comment: "#808080",
            function: "#87CEEB",
            class: "#FFD700",
            number: "#87CEEB",
            property: "#000000",
            tag: "#FFD700",
            attribute: "#87CEEB"
        },
        "High Contrast": {
            keyword: "#FFFFFF",
            operator: "#FFFF00",
            variable: "#FFFFFF",
            string: "#00FF00",
            comment: "#808080",
            function: "#FFFF00",
            class: "#FFFFFF",
            number: "#00FF00",
            property: "#FFFFFF",
            tag: "#FFFF00",
            attribute: "#00FF00"
        },
        "Deuteranopia Friendly": {
            keyword: "#4169E1",
            operator: "#FFD700",
            variable: "#000000",
            string: "#4169E1",
            comment: "#808080",
            function: "#FFD700",
            class: "#4169E1",
            number: "#FFD700",
            property: "#000000",
            tag: "#4169E1",
            attribute: "#FFD700"
        },
        "Google Playground": {
            keyword: "#4285F4",
            operator: "#EA4335",
            variable: "#34A853",
            string: "#FBBC05",
            comment: "#808080",
            function: "#4285F4",
            class: "#EA4335",
            number: "#34A853",
            property: "#4285F4",
            tag: "#EA4335",
            attribute: "#34A853"
        }
    };

    // Return the requested theme's highlighter or default if not found
    return themeHighlighters[themeName] || defaultHighlighter;
}



// Example usage:
// const highlighter = getCustomThemeCodeHighlighter("Dracula");
// console.log(highlighter.keyword); // "#FF79C6"