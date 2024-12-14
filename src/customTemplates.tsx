// Theme Categories
export const THEME_CATEGORIES = {
    IDE_INSPIRED: "IDE & Editor Inspired",
    MOVIES_TV: "Movies & TV",
    ANIME_MANGA: "Anime & Manga",
    NATURE: "Nature & Environment",
    CYBERPUNK: "Cyberpunk & Sci-fi",
    GAMES: "Games & Entertainment",
    ACCESSIBILITY: "Accessibility",
    BRANDS: "Brand Inspired",
    CLASSIC: "Classic Themes"
};

const customTemplates = [
    {
        name: "VSCode Dark+",

        category: THEME_CATEGORIES.IDE_INSPIRED,
        blocks: {
            class: {
                backgroundColor: "#1E1E1E",
                borderColor: "#569CD6",
                textColor: "#D4D4D4",
                headerColor: "#252526"
            },
            class_function: {
                backgroundColor: "#252526",
                borderColor: "#4EC9B0",
                textColor: "#D4D4D4",
                headerColor: "#2D2D2D"
            },
            code: {
                backgroundColor: "#1E1E1E",
                borderColor: "#CE9178",
                textColor: "#D4D4D4",
                headerColor: "#252526"
            },
            class_standalone: {
                backgroundColor: "#252526",
                borderColor: "#9CDCFE",
                textColor: "#D4D4D4",
                headerColor: "#2D2D2D"
            },
            standalone_function: {
                backgroundColor: "#1E1E1E",
                borderColor: "#DCDCAA",
                textColor: "#D4D4D4",
                headerColor: "#252526"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#569CD6", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#4EC9B0", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#9CDCFE", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#C586C0", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#4EC9B0", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#CE9178", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#1E1E1E",
            gridColor: "#333333",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#1E1E1E",
            textColor: "#D4D4D4",
            lineNumbersColor: "#858585",
            highlightColor: "#264F78"
        },
        buttons: {
            backgroundColor: "#0E639C",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#1177BB"
        }
    }, {
        name: "Dracula",
        category: THEME_CATEGORIES.IDE_INSPIRED,

        blocks: {
            class: {
                backgroundColor: "#282A36",
                borderColor: "#50FA7B",
                textColor: "#F8F8F2",
                headerColor: "#44475A"
            },
            class_function: {
                backgroundColor: "#44475A",
                borderColor: "#8BE9FD",
                textColor: "#F8F8F2",
                headerColor: "#282A36"
            },
            code: {
                backgroundColor: "#282A36",
                borderColor: "#FFB86C",
                textColor: "#F8F8F2",
                headerColor: "#44475A"
            },
            class_standalone: {
                backgroundColor: "#44475A",
                borderColor: "#BD93F9",
                textColor: "#F8F8F2",
                headerColor: "#282A36"
            },
            standalone_function: {
                backgroundColor: "#282A36",
                borderColor: "#FF79C6",
                textColor: "#F8F8F2",
                headerColor: "#44475A"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#50FA7B", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#8BE9FD", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#BD93F9", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#FF79C6", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#8BE9FD", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#FFB86C", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#282A36",
            gridColor: "#44475A",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#282A36",
            textColor: "#F8F8F2",
            lineNumbersColor: "#6272A4",
            highlightColor: "#44475A"
        },
        buttons: {
            backgroundColor: "#50FA7B",
            textColor: "#282A36",
            hoverBackgroundColor: "#8BE9FD"
        }
    },
    {
        name: "Nord",
        category: THEME_CATEGORIES.IDE_INSPIRED,

        blocks: {
            class: {
                backgroundColor: "#2E3440",
                borderColor: "#88C0D0",
                textColor: "#D8DEE9",
                headerColor: "#3B4252"
            },
            class_function: {
                backgroundColor: "#3B4252",
                borderColor: "#81A1C1",
                textColor: "#D8DEE9",
                headerColor: "#2E3440"
            },
            code: {
                backgroundColor: "#2E3440",
                borderColor: "#EBCB8B",
                textColor: "#D8DEE9",
                headerColor: "#3B4252"
            },
            class_standalone: {
                backgroundColor: "#3B4252",
                borderColor: "#B48EAD",
                textColor: "#D8DEE9",
                headerColor: "#2E3440"
            },
            standalone_function: {
                backgroundColor: "#2E3440",
                borderColor: "#A3BE8C",
                textColor: "#D8DEE9",
                headerColor: "#3B4252"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#88C0D0", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#81A1C1", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#B48EAD", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#BF616A", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#81A1C1", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#EBCB8B", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#2E3440",
            gridColor: "#3B4252",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#2E3440",
            textColor: "#D8DEE9",
            lineNumbersColor: "#4C566A",
            highlightColor: "#3B4252"
        },
        buttons: {
            backgroundColor: "#88C0D0",
            textColor: "#2E3440",
            hoverBackgroundColor: "#81A1C1"
        }
    },
    {
        name: "One Dark Pro",
        category: THEME_CATEGORIES.IDE_INSPIRED,

        blocks: {
            class: {
                backgroundColor: "#282C34",
                borderColor: "#98C379",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            },
            class_function: {
                backgroundColor: "#21252B",
                borderColor: "#61AFEF",
                textColor: "#ABB2BF",
                headerColor: "#282C34"
            },
            code: {
                backgroundColor: "#282C34",
                borderColor: "#E5C07B",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            },
            class_standalone: {
                backgroundColor: "#21252B",
                borderColor: "#C678DD",
                textColor: "#ABB2BF",
                headerColor: "#282C34"
            },
            standalone_function: {
                backgroundColor: "#282C34",
                borderColor: "#56B6C2",
                textColor: "#ABB2BF",
                headerColor: "#21252B"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#98C379", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#61AFEF", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#C678DD", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#E06C75", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#61AFEF", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#E5C07B", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#282C34",
            gridColor: "#3E4451",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#282C34",
            textColor: "#ABB2BF",
            lineNumbersColor: "#4B5363",
            highlightColor: "#2C313A"
        },
        buttons: {
            backgroundColor: "#98C379",
            textColor: "#282C34",
            hoverBackgroundColor: "#61AFEF"
        }
    }, {
        name: "Matrix Reloaded",
        category: THEME_CATEGORIES.MOVIES_TV,

        blocks: {
            class: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#003300"
            },
            class_function: {
                backgroundColor: "#001100",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#002200"
            },
            code: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#001100"
            },
            class_standalone: {
                backgroundColor: "#001100",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#002200"
            },
            standalone_function: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#00FF00",
                headerColor: "#001100"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#00FF00", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#66FF66", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#33FF33", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#00CC00", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#00AA00", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#009900", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#000000",
            gridColor: "#001100",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#000000",
            textColor: "#00FF00",
            lineNumbersColor: "#008800",
            highlightColor: "#002200"
        },
        buttons: {
            backgroundColor: "#008800",
            textColor: "#00FF00",
            hoverBackgroundColor: "#00AA00"
        }
    },
    {
        name: "Starry Night Dream",
        category: THEME_CATEGORIES.MOVIES_TV,

        blocks: {
            class: {
                backgroundColor: "#1E1E78",
                borderColor: "#FFD700",
                textColor: "#F0E68C",
                headerColor: "#6A5ACD"
            },
            class_function: {
                backgroundColor: "#3B5998",
                borderColor: "#FF6347",
                textColor: "#FFFFFF",
                headerColor: "#FFDA44"
            },
            code: {
                backgroundColor: "#B0C4DE",
                borderColor: "#8B4513",
                textColor: "#2F4F4F",
                headerColor: "#FFD700"
            },
            class_standalone: {
                backgroundColor: "#4682B4",
                borderColor: "#FF4500",
                textColor: "#FFFFFF",
                headerColor: "#8A2BE2"
            },
            standalone_function: {
                backgroundColor: "#7B68EE",
                borderColor: "#B22222",
                textColor: "#F5FFFA",
                headerColor: "#FFA500"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FFD700", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FF6347", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#6A5ACD", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#4682B4", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FFD700", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#2F4F4F", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#2C3E50",
            gridColor: "#34495E",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#2F4F4F",
            lineNumbersColor: "#7D3C98",
            highlightColor: "#FF6347"
        },
        buttons: {
            backgroundColor: "#FF6347",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#FFD700"
        }
    },
    {
        name: "Mars Aurora",
        category: THEME_CATEGORIES.MOVIES_TV,

        blocks: {
            class: {
                backgroundColor: "#1C1E26",
                borderColor: "#F28F3B",
                textColor: "#C5C8C6",
                headerColor: "#2E303B"
            },
            class_function: {
                backgroundColor: "#2E303B",
                borderColor: "#96C2F1",
                textColor: "#C5C8C6",
                headerColor: "#3A3D46"
            },
            code: {
                backgroundColor: "#1C1E26",
                borderColor: "#FC5B5D",
                textColor: "#ECEFF4",
                headerColor: "#2E303B"
            },
            class_standalone: {
                backgroundColor: "#2E303B",
                borderColor: "#6A81D1",
                textColor: "#ECEFF4",
                headerColor: "#3A3D46"
            },
            standalone_function: {
                backgroundColor: "#1C1E26",
                borderColor: "#F28F3B",
                textColor: "#C5C8C6",
                headerColor: "#2E303B"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#F28F3B", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#96C2F1", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#6A81D1", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#FC5B5D", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#F28F3B", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#ECEFF4", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#1C1E26",
            gridColor: "#3A3D46",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#1C1E26",
            textColor: "#ECEFF4",
            lineNumbersColor: "#D8DEE9",
            highlightColor: "#2E303B"
        },
        buttons: {
            backgroundColor: "#F28F3B",
            textColor: "#1C1E26",
            hoverBackgroundColor: "#FC5B5D"
        }
    }, {
        name: "One Piece Adventure",
        category: THEME_CATEGORIES.ANIME_MANGA,

        blocks: {
            class: {
                backgroundColor: "#D42A2A",
                borderColor: "#FFD700",
                textColor: "#FFFFFF",
                headerColor: "#8B0000"
            },
            class_function: {
                backgroundColor: "#1E90FF",
                borderColor: "#FFD700",
                textColor: "#FFFFFF",
                headerColor: "#4169E1"
            },
            code: {
                backgroundColor: "#228B22",
                borderColor: "#FFD700",
                textColor: "#FFFFFF",
                headerColor: "#006400"
            },
            class_standalone: {
                backgroundColor: "#FF8C00",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#FF4500"
            },
            standalone_function: {
                backgroundColor: "#8A2BE2",
                borderColor: "#FFD700",
                textColor: "#FFFFFF",
                headerColor: "#4B0082"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FFD700", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#00BFFF", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#FF69B4", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#32CD32", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FF4500", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#9370DB", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#87CEEB",
            gridColor: "#E0FFFF",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#F0E68C",
            textColor: "#000000",
            lineNumbersColor: "#8B4513",
            highlightColor: "#FFDAB9"
        },
        buttons: {
            backgroundColor: "#FF4500",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#FF6347"
        }
    },
    {
        name: "Candy Crush Saga",
        category: THEME_CATEGORIES.GAMES,

        blocks: {
            class: {
                backgroundColor: "#FF69B4",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#FF1493"
            },
            class_function: {
                backgroundColor: "#00CED1",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#008B8B"
            },
            code: {
                backgroundColor: "#32CD32",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#228B22"
            },
            class_standalone: {
                backgroundColor: "#FFA500",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#FF8C00"
            },
            standalone_function: {
                backgroundColor: "#9370DB",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#8A2BE2"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FF69B4", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#00CED1", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#FFA500", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#32CD32", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#9370DB", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#FF69B4", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FFF5EE",
            gridColor: "#FFE4E1",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFAFA",
            textColor: "#000000",
            lineNumbersColor: "#A9A9A9",
            highlightColor: "#FFB6C1"
        },
        buttons: {
            backgroundColor: "#FF69B4",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#FF1493"
        }
    },
    {
        name: "Ghibli Dreamscape",
        category: THEME_CATEGORIES.ANIME_MANGA,

        blocks: {
            class: {
                backgroundColor: "#E7E6D5",
                borderColor: "#8B5B29",
                textColor: "#3D3D3D",
                headerColor: "#A3C6D4"
            },
            class_function: {
                backgroundColor: "#B2E0B2",
                borderColor: "#FFB74D",
                textColor: "#3D3D3D",
                headerColor: "#F0A500"
            },
            code: {
                backgroundColor: "#F0E6D2",
                borderColor: "#C22D2D",
                textColor: "#2A2A2A",
                headerColor: "#FF6F61"
            },
            class_standalone: {
                backgroundColor: "#F9E79F",
                borderColor: "#5D6D7E",
                textColor: "#3D3D3D",
                headerColor: "#F39C12"
            },
            standalone_function: {
                backgroundColor: "#FFEDCC",
                borderColor: "#D35400",
                textColor: "#3D3D3D",
                headerColor: "#A3C6D4"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#F39C12", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FFB74D", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#A3C6D4", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#5D6D7E", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FF6F61", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#2A2A2A", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#F0F4F8",
            gridColor: "#D5DBDB",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#3D3D3D",
            lineNumbersColor: "#BDC3C7",
            highlightColor: "#FFB74D"
        },
        buttons: {
            backgroundColor: "#FF6F61",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#FFB74D"
        }
    }, {
        name: "Forest Night",
        category: THEME_CATEGORIES.NATURE,

        blocks: {
            class: {
                backgroundColor: "#2B303B",
                borderColor: "#A3BE8C",
                textColor: "#ECEFF4",
                headerColor: "#3B4252"
            },
            class_function: {
                backgroundColor: "#3B4252",
                borderColor: "#BF616A",
                textColor: "#ECEFF4",
                headerColor: "#4C566A"
            },
            code: {
                backgroundColor: "#2B303B",
                borderColor: "#D08770",
                textColor: "#ECEFF4",
                headerColor: "#3B4252"
            },
            class_standalone: {
                backgroundColor: "#3B4252",
                borderColor: "#5E81AC",
                textColor: "#ECEFF4",
                headerColor: "#4C566A"
            },
            standalone_function: {
                backgroundColor: "#2B303B",
                borderColor: "#A3BE8C",
                textColor: "#ECEFF4",
                headerColor: "#3B4252"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#A3BE8C", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#BF616A", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#5E81AC", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#D08770", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#BF616A", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#ECEFF4", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#2B303B",
            gridColor: "#4C566A",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#2B303B",
            textColor: "#ECEFF4",
            lineNumbersColor: "#D8DEE9",
            highlightColor: "#3B4252"
        },
        buttons: {
            backgroundColor: "#A3BE8C",
            textColor: "#2B303B",
            hoverBackgroundColor: "#BF616A"
        }
    },
    {
        name: "Neon Cyberpunk",
        category: THEME_CATEGORIES.CYBERPUNK,

        blocks: {
            class: {
                backgroundColor: "#0D0221",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#1A0B2E"
            },
            class_function: {
                backgroundColor: "#170B3B",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#210F47"
            },
            code: {
                backgroundColor: "#0D0221",
                borderColor: "#FF1493",
                textColor: "#00FFFF",
                headerColor: "#1A0B2E"
            },
            class_standalone: {
                backgroundColor: "#170B3B",
                borderColor: "#FF00FF",
                textColor: "#00FFFF",
                headerColor: "#210F47"
            },
            standalone_function: {
                backgroundColor: "#0D0221",
                borderColor: "#FF1493",
                textColor: "#00FFFF",
                headerColor: "#1A0B2E"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FF00FF", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#00FFFF", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#FF1493", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#FF69B4", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#1E90FF", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#00FF00", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#0D0221",
            gridColor: "#1A0B2E",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#0D0221",
            textColor: "#00FFFF",
            lineNumbersColor: "#FF00FF",
            highlightColor: "#170B3B"
        },
        buttons: {
            backgroundColor: "#FF00FF",
            textColor: "#00FFFF",
            hoverBackgroundColor: "#FF1493"
        }
    }, {
        name: "Protanopia Friendly",
        category: THEME_CATEGORIES.ACCESSIBILITY,

        blocks: {
            class: {
                backgroundColor: "#F7F7F7",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#E0E0E0"
            },
            class_function: {
                backgroundColor: "#E0E0E0",
                borderColor: "#87CEEB",
                textColor: "#000000",
                headerColor: "#F7F7F7"
            },
            code: {
                backgroundColor: "#F7F7F7",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#E0E0E0"
            },
            class_standalone: {
                backgroundColor: "#E0E0E0",
                borderColor: "#87CEEB",
                textColor: "#000000",
                headerColor: "#F7F7F7"
            },
            standalone_function: {
                backgroundColor: "#F7F7F7",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#E0E0E0"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FFD700", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#87CEEB", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#FFD700", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#87CEEB", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FFD700", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#000000", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            lineNumbersColor: "#808080",
            highlightColor: "#F0F0F0"
        },
        buttons: {
            backgroundColor: "#FFD700",
            textColor: "#000000",
            hoverBackgroundColor: "#87CEEB"
        }
    },
    {
        name: "High Contrast",
        category: THEME_CATEGORIES.ACCESSIBILITY,

        blocks: {
            class: {
                backgroundColor: "#000000",
                borderColor: "#FFFFFF",
                textColor: "#FFFFFF",
                headerColor: "#1A1A1A"
            },
            class_function: {
                backgroundColor: "#1A1A1A",
                borderColor: "#FFFF00",
                textColor: "#FFFFFF",
                headerColor: "#000000"
            },
            code: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#FFFFFF",
                headerColor: "#1A1A1A"
            },
            class_standalone: {
                backgroundColor: "#1A1A1A",
                borderColor: "#FFFF00",
                textColor: "#FFFFFF",
                headerColor: "#000000"
            },
            standalone_function: {
                backgroundColor: "#000000",
                borderColor: "#00FF00",
                textColor: "#FFFFFF",
                headerColor: "#1A1A1A"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FFFFFF", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FFFF00", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#00FF00", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#FFFFFF", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FFFF00", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#00FF00", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#000000",
            gridColor: "#333333",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#000000",
            textColor: "#FFFFFF",
            lineNumbersColor: "#808080",
            highlightColor: "#1A1A1A"
        },
        buttons: {
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            hoverBackgroundColor: "#FFFF00"
        }
    },
    {
        name: "Deuteranopia Friendly",
        category: THEME_CATEGORIES.ACCESSIBILITY,

        blocks: {
            class: {
                backgroundColor: "#F5F5F5",
                borderColor: "#4169E1",
                textColor: "#000000",
                headerColor: "#E6E6FA"
            },
            class_function: {
                backgroundColor: "#E6E6FA",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#F5F5F5"
            },
            code: {
                backgroundColor: "#F5F5F5",
                borderColor: "#4169E1",
                textColor: "#000000",
                headerColor: "#E6E6FA"
            },
            class_standalone: {
                backgroundColor: "#E6E6FA",
                borderColor: "#FFD700",
                textColor: "#000000",
                headerColor: "#F5F5F5"
            },
            standalone_function: {
                backgroundColor: "#F5F5F5",
                borderColor: "#4169E1",
                textColor: "#000000",
                headerColor: "#E6E6FA"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#4169E1", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FFD700", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#4169E1", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#FFD700", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#4169E1", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#000000", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            lineNumbersColor: "#808080",
            highlightColor: "#F0F0F0"
        },
        buttons: {
            backgroundColor: "#4169E1",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#FFD700"
        }
    }, {
        name: "Google Playground",
        category: THEME_CATEGORIES.BRANDS,

        blocks: {
            class: {
                backgroundColor: "#4285F4",
                borderColor: "#FBBC05",
                textColor: "#FFFFFF",
                headerColor: "#34A853"
            },
            class_function: {
                backgroundColor: "#EA4335",
                borderColor: "#4285F4",
                textColor: "#FFFFFF",
                headerColor: "#FBBC05"
            },
            code: {
                backgroundColor: "#34A853",
                borderColor: "#EA4335",
                textColor: "#FFFFFF",
                headerColor: "#4285F4"
            },
            class_standalone: {
                backgroundColor: "#FBBC05",
                borderColor: "#34A853",
                textColor: "#000000",
                headerColor: "#EA4335"
            },
            standalone_function: {
                backgroundColor: "#4285F4",
                borderColor: "#FBBC05",
                textColor: "#FFFFFF",
                headerColor: "#EA4335"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#EA4335", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FBBC05", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#34A853", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#4285F4", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#EA4335", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#34A853", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FFFFFF",
            gridColor: "#E0E0E0",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#F1F3F4",
            textColor: "#202124",
            lineNumbersColor: "#5F6368",
            highlightColor: "#E8F0FE"
        },
        buttons: {
            backgroundColor: "#1A73E8",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#1967D2"
        }
    }
];



export default customTemplates;