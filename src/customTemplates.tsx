const customTemplates  = [
    {
        name: "VSCode Dark+",
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
    },
    {
        name: "Solarized Light",
        blocks: {
            class: {
                backgroundColor: "#FDF6E3",
                borderColor: "#268BD2",
                textColor: "#657B83",
                headerColor: "#EEE8D5"
            },
            class_function: {
                backgroundColor: "#EEE8D5",
                borderColor: "#2AA198",
                textColor: "#657B83",
                headerColor: "#FDF6E3"
            },
            code: {
                backgroundColor: "#FDF6E3",
                borderColor: "#CB4B16",
                textColor: "#657B83",
                headerColor: "#EEE8D5"
            },
            class_standalone: {
                backgroundColor: "#EEE8D5",
                borderColor: "#6C71C4",
                textColor: "#657B83",
                headerColor: "#FDF6E3"
            },
            standalone_function: {
                backgroundColor: "#FDF6E3",
                borderColor: "#B58900",
                textColor: "#657B83",
                headerColor: "#EEE8D5"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#268BD2", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#2AA198", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#6C71C4", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#D33682", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#2AA198", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#CB4B16", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FDF6E3",
            gridColor: "#EEE8D5",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FDF6E3",
            textColor: "#657B83",
            lineNumbersColor: "#93A1A1",
            highlightColor: "#EEE8D5"
        },
        buttons: {
            backgroundColor: "#268BD2",
            textColor: "#FDF6E3",
            hoverBackgroundColor: "#2AA198"
        }
    },
    {
        name: "Monokai",
        blocks: {
            class: {
                backgroundColor: "#272822",
                borderColor: "#A6E22E",
                textColor: "#F8F8F2",
                headerColor: "#3E3D32"
            },
            class_function: {
                backgroundColor: "#3E3D32",
                borderColor: "#66D9EF",
                textColor: "#F8F8F2",
                headerColor: "#272822"
            },
            code: {
                backgroundColor: "#272822",
                borderColor: "#FD971F",
                textColor: "#F8F8F2",
                headerColor: "#3E3D32"
            },
            class_standalone: {
                backgroundColor: "#3E3D32",
                borderColor: "#AE81FF",
                textColor: "#F8F8F2",
                headerColor: "#272822"
            },
            standalone_function: {
                backgroundColor: "#272822",
                borderColor: "#F92672",
                textColor: "#F8F8F2",
                headerColor: "#3E3D32"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#A6E22E", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#66D9EF", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#AE81FF", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#F92672", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#66D9EF", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#FD971F", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#272822",
            gridColor: "#3E3D32",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#272822",
            textColor: "#F8F8F2",
            lineNumbersColor: "#90908A",
            highlightColor: "#49483E"
        },
        buttons: {
            backgroundColor: "#A6E22E",
            textColor: "#272822",
            hoverBackgroundColor: "#66D9EF"
        }
    },
    {
        name: "GitHub Light",
        blocks: {
            class: {
                backgroundColor: "#FFFFFF",
                borderColor: "#0366D6",
                textColor: "#24292E",
                headerColor: "#F6F8FA"
            },
            class_function: {
                backgroundColor: "#F6F8FA",
                borderColor: "#28A745",
                textColor: "#24292E",
                headerColor: "#FFFFFF"
            },
            code: {
                backgroundColor: "#FFFFFF",
                borderColor: "#D73A49",
                textColor: "#24292E",
                headerColor: "#F6F8FA"
            },
            class_standalone: {
                backgroundColor: "#F6F8FA",
                borderColor: "#6F42C1",
                textColor: "#24292E",
                headerColor: "#FFFFFF"
            },
            standalone_function: {
                backgroundColor: "#FFFFFF",
                borderColor: "#E36209",
                textColor: "#24292E",
                headerColor: "#F6F8FA"
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#0366D6", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#28A745", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#6F42C1", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#D73A49", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#28A745", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#E36209", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#FFFFFF",
            gridColor: "#E1E4E8",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",
            textColor: "#24292E",
            lineNumbersColor: "#6A737D",
            highlightColor: "#F1F8FF"
        },
        buttons: {
            backgroundColor: "#0366D6",
            textColor: "#FFFFFF",
            hoverBackgroundColor: "#0056B3"
        }
    },
    {
        name: "Dracula",
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
        },
        
    }, {
        name: "Mars Aurora",
        blocks: {
            class: {
                backgroundColor: "#1C1E26",        // Deep space black
                borderColor: "#F28F3B",            // Mars-orange accent
                textColor: "#C5C8C6",              // Soft cosmic white text
                headerColor: "#2E303B"             // Dark nebula gray
            },
            class_function: {
                backgroundColor: "#2E303B",
                borderColor: "#96C2F1",            // Aurora blue border
                textColor: "#C5C8C6",              // Cosmic white text
                headerColor: "#3A3D46"             // Midnight shade
            },
            code: {
                backgroundColor: "#1C1E26",
                borderColor: "#FC5B5D",            // Bright planetary red
                textColor: "#ECEFF4",              // Bright white text
                headerColor: "#2E303B"             // Dark nebula gray
            },
            class_standalone: {
                backgroundColor: "#2E303B",
                borderColor: "#6A81D1",            // Galactic purple
                textColor: "#ECEFF4",              // Cosmic white text
                headerColor: "#3A3D46"             // Midnight shade
            },
            standalone_function: {
                backgroundColor: "#1C1E26",
                borderColor: "#F28F3B",            // Mars-orange accent
                textColor: "#C5C8C6",              // Soft cosmic white text
                headerColor: "#2E303B"             // Dark nebula gray
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
            backgroundColor: "#1C1E26",            // Deep cosmic black
            gridColor: "#3A3D46",                  // Dark grid lines for low-light environments
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#1C1E26",            // Dark cosmic black
            textColor: "#ECEFF4",                  // Cosmic white text for clarity
            lineNumbersColor: "#D8DEE9",           // Light gray for subtle numbering
            highlightColor: "#2E303B"              // Subtle highlight
        },
        buttons: {
            backgroundColor: "#F28F3B",            // Mars-orange accent
            textColor: "#1C1E26",                  // Cosmic black for button text
            hoverBackgroundColor: "#FC5B5D"        // Bright planetary red on hover
        }
    },
    {
        name: "Nebula Blaze",
        blocks: {
            class: {
                backgroundColor: "#FDFD96",            // Bright sunny yellow
                borderColor: "#FF5733",                // Fiery coral red
                textColor: "#2D2D2D",                  // Deep charcoal for contrast
                headerColor: "#6C5B7B"                 // Dusty lavender for a subtle touch
            },
            class_function: {
                backgroundColor: "#FFEAB6",            // Soft buttercream
                borderColor: "#FF6F61",                // Soft coral
                textColor: "#2D2D2D",                  // Deep charcoal
                headerColor: "#4ECDC4"                 // Bright teal
            },
            code: {
                backgroundColor: "#C1E1C1",            // Pale mint green
                borderColor: "#FF9A8B",                // Light peach
                textColor: "#1A1A1D",                  // Dark charcoal
                headerColor: "#F39C12"                 // Bright orange
            },
            class_standalone: {
                backgroundColor: "#E3F2FD",            // Light blue
                borderColor: "#2980B9",                // Vivid blue
                textColor: "#2D2D2D",                  // Deep charcoal
                headerColor: "#FF6F61"                 // Soft coral
            },
            standalone_function: {
                backgroundColor: "#FFE6E6",            // Very light pink
                borderColor: "#C0392B",                // Vivid red
                textColor: "#2D2D2D",                  // Deep charcoal
                headerColor: "#FF5733"                 // Fiery coral for emphasis
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FF5733", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FF6F61", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#4ECDC4", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#2980B9", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FF5733", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#2D2D2D", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#F0F8FF",              // Light azure blue
            gridColor: "#B0BEC5",                    // Cool gray grid lines
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",               // Bright white for focus
            textColor: "#2D2D2D",                     // Deep charcoal
            lineNumbersColor: "#607D8B",              // Soft gray
            highlightColor: "#FF9A8B"                 // Light peach highlight
        },
        buttons: {
            backgroundColor: "#FF5733",               // Fiery coral for focus
            textColor: "#FFFFFF",                     // White text for clarity
            hoverBackgroundColor: "#FF6F61"           // Soft coral on hover
        }
    },
    {
        "name": "Starry Night Dream",
        "blocks": {
            "class": {
                "backgroundColor": "#1E1E78",            // Deep midnight blue
                "borderColor": "#FFD700",                // Gold for warmth
                "textColor": "#F0E68C",                  // Pale khaki for contrast
                "headerColor": "#6A5ACD"                 // Slate blue for subtle elegance
            },
            "class_function": {
                "backgroundColor": "#3B5998",            // Rich blue reminiscent of night sky
                "borderColor": "#FF6347",                // Tomato red for brightness
                "textColor": "#FFFFFF",                   // White for clarity
                "headerColor": "#FFDA44"                 // Bright yellow for a vibrant touch
            },
            "code": {
                "backgroundColor": "#B0C4DE",            // Light steel blue for tranquility
                "borderColor": "#8B4513",                // Saddle brown for earthiness
                "textColor": "#2F4F4F",                  // Dark slate gray for readability
                "headerColor": "#FFD700"                 // Gold for highlighting
            },
            "class_standalone": {
                "backgroundColor": "#4682B4",            // Steel blue for calmness
                "borderColor": "#FF4500",                // Orange red for contrast
                "textColor": "#FFFFFF",                   // White for clarity
                "headerColor": "#8A2BE2"                 // Blue violet for a creative touch
            },
            "standalone_function": {
                "backgroundColor": "#7B68EE",            // Medium slate blue for coolness
                "borderColor": "#B22222",                // Firebrick red for warmth
                "textColor": "#F5FFFA",                  // Mint cream for softness
                "headerColor": "#FFA500"                 // Orange for brightness
            }
        },
        "connections": {
            "idecontainsclass": { "lineColor": "#FFD700", "arrowHead": "triangle", "lineStyle": "solid" },
            "class_contains_functions": { "lineColor": "#FF6347", "arrowHead": "diamond", "lineStyle": "dashed" },
            "class_contains_standalone": { "lineColor": "#6A5ACD", "arrowHead": "diamond", "lineStyle": "dotted" },
            "inherits": { "lineColor": "#4682B4", "arrowHead": "triangle", "lineStyle": "solid" },
            "composes": { "lineColor": "#FFD700", "arrowHead": "diamond", "lineStyle": "dashed" },
            "idecontainsstandalonecode": { "lineColor": "#2F4F4F", "arrowHead": "arrow", "lineStyle": "solid" }
        },
        "canvas": {
            "backgroundColor": "#2C3E50",              // Dark slate blue for depth
            "gridColor": "#34495E",                    // Dark gray for subtle grid lines
            "gridSpacing": 20
        },
        "ide": {
            "backgroundColor": "#FFFFFF",               // Bright white for focus
            "textColor": "#2F4F4F",                     // Dark slate gray for readability
            "lineNumbersColor": "#7D3C98",              // Purple for a creative touch
            "highlightColor": "#FF6347"                 // Tomato red for highlight
        },
        "buttons": {
            "backgroundColor": "#FF6347",               // Tomato red for focus
            "textColor": "#FFFFFF",                     // White text for clarity
            "hoverBackgroundColor": "#FFD700"           // Gold on hover for brightness
        }
    },
    {
        "name": "Ghibli Dreamscape",
        "blocks": {
            "class": {
                "backgroundColor": "#E7E6D5",            // Soft beige for a gentle background
                "borderColor": "#8B5B29",                // Warm brown for a cozy feel
                "textColor": "#3D3D3D",                  // Charcoal for good readability
                "headerColor": "#A3C6D4"                 // Soft blue for a calming header
            },
            "class_function": {
                "backgroundColor": "#B2E0B2",            // Light mint green for freshness
                "borderColor": "#FFB74D",                // Warm gold for elegance
                "textColor": "#3D3D3D",                  // Charcoal for contrast
                "headerColor": "#F0A500"                 // Golden yellow for warmth
            },
            "code": {
                "backgroundColor": "#F0E6D2",            // Pale cream for a soft touch
                "borderColor": "#C22D2D",                // Deep red for emphasis
                "textColor": "#2A2A2A",                  // Dark gray for legibility
                "headerColor": "#FF6F61"                 // Coral for a pop of color
            },
            "class_standalone": {
                "backgroundColor": "#F9E79F",            // Soft pastel yellow
                "borderColor": "#5D6D7E",                // Cool blue-gray for subtlety
                "textColor": "#3D3D3D",                  // Charcoal for consistency
                "headerColor": "#F39C12"                 // Bright orange for vibrancy
            },
            "standalone_function": {
                "backgroundColor": "#FFEDCC",            // Light peach for warmth
                "borderColor": "#D35400",                // Dark orange for depth
                "textColor": "#3D3D3D",                  // Charcoal for contrast
                "headerColor": "#A3C6D4"                 // Soft blue for a cohesive feel
            }
        },
        "connections": {
            "idecontainsclass": { "lineColor": "#F39C12", "arrowHead": "triangle", "lineStyle": "solid" },
            "class_contains_functions": { "lineColor": "#FFB74D", "arrowHead": "diamond", "lineStyle": "dashed" },
            "class_contains_standalone": { "lineColor": "#A3C6D4", "arrowHead": "diamond", "lineStyle": "dotted" },
            "inherits": { "lineColor": "#5D6D7E", "arrowHead": "triangle", "lineStyle": "solid" },
            "composes": { "lineColor": "#FF6F61", "arrowHead": "diamond", "lineStyle": "dashed" },
            "idecontainsstandalonecode": { "lineColor": "#2A2A2A", "arrowHead": "arrow", "lineStyle": "solid" }
        },
        "canvas": {
            "backgroundColor": "#F0F4F8",              // Light pastel blue for a serene canvas
            "gridColor": "#D5DBDB",                    // Soft gray for grid lines
            "gridSpacing": 20
        },
        "ide": {
            "backgroundColor": "#FFFFFF",               // Bright white for clarity
            "textColor": "#3D3D3D",                     // Charcoal for readability
            "lineNumbersColor": "#BDC3C7",              // Light gray for subtlety
            "highlightColor": "#FFB74D"                 // Warm gold highlight for focus
        },
        "buttons": {
            "backgroundColor": "#FF6F61",               // Coral for vibrant buttons
            "textColor": "#FFFFFF",                     // White for clarity
            "hoverBackgroundColor": "#FFB74D"           // Warm gold on hover for brightness
        }
    }




    , {
        name: "Starlit Mars",
        blocks: {
            class: {
                backgroundColor: "#F5F7FA",        // Light cosmic gray
                borderColor: "#FF6F61",            // Mars-inspired coral
                textColor: "#0D1B2A",              // Dark navy for readability
                headerColor: "#81A1C1"             // Aurora sky blue
            },
            class_function: {
                backgroundColor: "#FFFFFF",        // Bright white
                borderColor: "#FEB47B",            // Warm sunset orange
                textColor: "#0D1B2A",              // Dark navy text
                headerColor: "#89CFFD"             // Light sky blue
            },
            code: {
                backgroundColor: "#E3F2FD",        // Sky blue tint
                borderColor: "#FF6F61",            // Mars coral border
                textColor: "#0D1B2A",              // Dark navy text
                headerColor: "#81A1C1"             // Aurora blue
            },
            class_standalone: {
                backgroundColor: "#FFFFFF",        // Pure white
                borderColor: "#89CFFD",            // Soft sky blue
                textColor: "#0D1B2A",              // Dark navy for readability
                headerColor: "#FEB47B"             // Warm sunset accent
            },
            standalone_function: {
                backgroundColor: "#F5F7FA",        // Light cosmic gray
                borderColor: "#81A1C1",            // Aurora blue border
                textColor: "#0D1B2A",              // Dark navy text
                headerColor: "#FF6F61"             // Mars coral for emphasis
            }
        },
        connections: {
            idecontainsclass: { lineColor: "#FF6F61", arrowHead: "triangle", lineStyle: "solid" },
            class_contains_functions: { lineColor: "#FEB47B", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#81A1C1", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#89CFFD", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#FF6F61", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#0D1B2A", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#F0F5FA",            // Very light sky blue
            gridColor: "#B0C5D8",                  // Soft gray grid for low contrast
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#FFFFFF",            // Bright white for focus
            textColor: "#0D1B2A",                  // Dark navy for contrast
            lineNumbersColor: "#4A637D",           // Medium gray for subtle line numbers
            highlightColor: "#81A1C1"              // Light aurora blue highlight
        },
        buttons: {
            backgroundColor: "#FF6F61",            // Mars coral
            textColor: "#FFFFFF",                  // White text for clarity
            hoverBackgroundColor: "#FEB47B"        // Sunset orange on hover
        }
    }
,
    {
        name: "Forest Night",
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
                        name: "One Dark Pro",
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
                    },
                    {
                        name: "Material Ocean",
                        blocks: {
                            class: {
                                backgroundColor: "#0F111A",
                                borderColor: "#89DDFF",
                                textColor: "#A6ACCD",
                                headerColor: "#1A1C25"
                            },
                            class_function: {
                                backgroundColor: "#1A1C25",
                                borderColor: "#82AAFF",
                                textColor: "#A6ACCD",
                                headerColor: "#0F111A"
                            },
                            code: {
                                backgroundColor: "#0F111A",
                                borderColor: "#F78C6C",
                                textColor: "#A6ACCD",
                                headerColor: "#1A1C25"
                            },
                            class_standalone: {
                                backgroundColor: "#1A1C25",
                                borderColor: "#C792EA",
                                textColor: "#A6ACCD",
                                headerColor: "#0F111A"
                            },
                            standalone_function: {
                                backgroundColor: "#0F111A",
                                borderColor: "#FFCB6B",
                                textColor: "#A6ACCD",
                                headerColor: "#1A1C25"
                            }
                        },
                        connections: {
                            idecontainsclass: { lineColor: "#89DDFF", arrowHead: "triangle", lineStyle: "solid" },
                            class_contains_functions: { lineColor: "#82AAFF", arrowHead: "diamond", lineStyle: "dashed" },
                            class_contains_standalone: { lineColor: "#C792EA", arrowHead: "diamond", lineStyle: "dotted" },
                            inherits: { lineColor: "#FF5370", arrowHead: "triangle", lineStyle: "solid" },
                            composes: { lineColor: "#82AAFF", arrowHead: "diamond", lineStyle: "dashed" },
                            idecontainsstandalonecode: { lineColor: "#F78C6C", arrowHead: "arrow", lineStyle: "solid" }
                        },
                        canvas: {
                            backgroundColor: "#0F111A",
                            gridColor: "#1A1C25",
                            gridSpacing: 20
                        },
                        ide: {
                            backgroundColor: "#0F111A",
                            textColor: "#A6ACCD",
                            lineNumbersColor: "#4B526D",
                            highlightColor: "#1A1C25"
                        },
                        buttons: {
                            backgroundColor: "#89DDFF",
                            textColor: "#0F111A",
                            hoverBackgroundColor: "#82AAFF"
                        }
                    },
                    {
                        name: "Ayu Light",
                        blocks: {
                            class: {
                                backgroundColor: "#FAFAFA",
                                borderColor: "#FF9940",
                                textColor: "#5C6773",
                                headerColor: "#F3F3F3"
                            },
                            class_function: {
                                backgroundColor: "#F3F3F3",
                                borderColor: "#F2AE49",
                                textColor: "#5C6773",
                                headerColor: "#FAFAFA"
                            },
                            code: {
                                backgroundColor: "#FAFAFA",
                                borderColor: "#86B300",
                                textColor: "#5C6773",
                                headerColor: "#F3F3F3"
                            },
                            class_standalone: {
                                backgroundColor: "#F3F3F3",
                                borderColor: "#FA8D3E",
                                textColor: "#5C6773",
                                headerColor: "#FAFAFA"
                            },
                            standalone_function: {
                                backgroundColor: "#FAFAFA",
                                borderColor: "#55B4D4",
                                textColor: "#5C6773",
                                headerColor: "#F3F3F3"
                            }
                        },
                        connections: {
                            idecontainsclass: { lineColor: "#FF9940", arrowHead: "triangle", lineStyle: "solid" },
                            class_contains_functions: { lineColor: "#F2AE49", arrowHead: "diamond", lineStyle: "dashed" },
                            class_contains_standalone: { lineColor: "#FA8D3E", arrowHead: "diamond", lineStyle: "dotted" },
                            inherits: { lineColor: "#F07178", arrowHead: "triangle", lineStyle: "solid" },
                            composes: { lineColor: "#F2AE49", arrowHead: "diamond", lineStyle: "dashed" },
                            idecontainsstandalonecode: { lineColor: "#86B300", arrowHead: "arrow", lineStyle: "solid" }
                        },
                        canvas: {
                            backgroundColor: "#FAFAFA",
                            gridColor: "#F3F3F3",
                            gridSpacing: 20
                        },
                        ide: {
                            backgroundColor: "#FAFAFA",
                            textColor: "#5C6773",
                            lineNumbersColor: "#828C99",
                            highlightColor: "#F0F0F0"
                        },
                        buttons: {
                            backgroundColor: "#FF9940",
                            textColor: "#FAFAFA",
                            hoverBackgroundColor: "#F2AE49"
                        }
                    },
                    {
                        name: "Night Owl",
                        blocks: {
                            class: {
                                backgroundColor: "#011627",
                                borderColor: "#82AAFF",
                                textColor: "#D6DEEB",
                                headerColor: "#01121F"
                            },
                            class_function: {
                                backgroundColor: "#01121F",
                                borderColor: "#C792EA",
                                textColor: "#D6DEEB",
                                headerColor: "#011627"
                            },
                            code: {
                                backgroundColor: "#011627",
                                borderColor: "#ADDB67",
                                textColor: "#D6DEEB",
                                headerColor: "#01121F"
                            },
                            class_standalone: {
                                backgroundColor: "#01121F",
                                borderColor: "#7FDBCA",
                                textColor: "#D6DEEB",
                                headerColor: "#011627"
                            },
                            standalone_function: {
                                backgroundColor: "#011627",
                                borderColor: "#F78C6C",
                                textColor: "#D6DEEB",
                                headerColor: "#01121F"
                            }
                        },
                        connections: {
                            idecontainsclass: { lineColor: "#82AAFF", arrowHead: "triangle", lineStyle: "solid" },
                            class_contains_functions: { lineColor: "#C792EA", arrowHead: "diamond", lineStyle: "dashed" },
                            class_contains_standalone: { lineColor: "#7FDBCA", arrowHead: "diamond", lineStyle: "dotted" },
                            inherits: { lineColor: "#EF5350", arrowHead: "triangle", lineStyle: "solid" },
                            composes: { lineColor: "#C792EA", arrowHead: "diamond", lineStyle: "dashed" },
                            idecontainsstandalonecode: { lineColor: "#ADDB67", arrowHead: "arrow", lineStyle: "solid" }
                        },
                        canvas: {
                            backgroundColor: "#011627",
                            gridColor: "#01121F",
                            gridSpacing: 20
                        },
                        ide: {
                            backgroundColor: "#011627",
                            textColor: "#D6DEEB",
                            lineNumbersColor: "#4B6479",
                            highlightColor: "#01121F"
                        },
                        buttons: {
                            backgroundColor: "#82AAFF",
                            textColor: "#011627",
                            hoverBackgroundColor: "#C792EA"
                        }
                    },
                    {
                        name: "Cobalt2",
                        blocks: {
                            class: {
                                backgroundColor: "#193549",
                                borderColor: "#FFC600",
                                textColor: "#FFFFFF",
                                headerColor: "#122738"
                            },
                            class_function: {
                                backgroundColor: "#122738",
                                borderColor: "#FF9D00",
                                textColor: "#FFFFFF",
                                headerColor: "#193549"
                            },
                            code: {
                                backgroundColor: "#193549",
                                borderColor: "#3AD900",
                                textColor: "#FFFFFF",
                                headerColor: "#122738"
                            },
                            class_standalone: {
                                backgroundColor: "#122738",
                                borderColor: "#FF628C",
                                textColor: "#FFFFFF",
                                headerColor: "#193549"
                            },
                            standalone_function: {
                                backgroundColor: "#193549",
                                borderColor: "#80FCFF",
                                textColor: "#FFFFFF",
                                headerColor: "#122738"
                            }
                        },
                        connections: {
                            idecontainsclass: { lineColor: "#FFC600", arrowHead: "triangle", lineStyle: "solid" },
                            class_contains_functions: { lineColor: "#FF9D00", arrowHead: "diamond", lineStyle: "dashed" },
                            class_contains_standalone: { lineColor: "#FF628C", arrowHead: "diamond", lineStyle: "dotted" },
                            inherits: { lineColor: "#FF628C", arrowHead: "triangle", lineStyle: "solid" },
                            composes: { lineColor: "#FF9D00", arrowHead: "diamond", lineStyle: "dashed" },
                            idecontainsstandalonecode: { lineColor: "#3AD900", arrowHead: "arrow", lineStyle: "solid" }
                        },
                        canvas: {
                            backgroundColor: "#193549",
                            gridColor: "#122738",
                            gridSpacing: 20
                        },
                        ide: {
                            backgroundColor: "#193549",
                            textColor: "#FFFFFF",
                            lineNumbersColor: "#0D3A58",
                            highlightColor: "#0D3A58"
                        },
                        buttons: {
                            backgroundColor: "#FFC600",
                            textColor: "#193549",
                            hoverBackgroundColor: "#FF9D00"
                        }
                    },
                    {
                        name: "Synthwave '84",
                        blocks: {
                            class: {
                                backgroundColor: "#262335",
                                borderColor: "#FF7EDB",
                                textColor: "#F92AFF",
                                headerColor: "#241B2F"
                            },
                            class_function: {
                                backgroundColor: "#241B2F",
                                borderColor: "#36F9F6",
                                textColor: "#F92AFF",
                                headerColor: "#262335"
                            },
                            code: {
                                backgroundColor: "#262335",
                                borderColor: "#FEDE5D",
                                textColor: "#F92AFF",
                                headerColor: "#241B2F"
                            },
                            class_standalone: {
                                backgroundColor: "#241B2F",
                                borderColor: "#FF8B39",
                                textColor: "#F92AFF",
                                headerColor: "#262335"
                            },
                            standalone_function: {
                                backgroundColor: "#262335",
                                borderColor: "#72F1B8",
                                textColor: "#F92AFF",
                                headerColor: "#241B2F"
                            }
                        },
                        connections: {
                            idecontainsclass: { lineColor: "#FF7EDB", arrowHead: "triangle", lineStyle: "solid" },
                            class_contains_functions: { lineColor: "#36F9F6", arrowHead: "diamond", lineStyle: "dashed" },
                            class_contains_standalone: { lineColor: "#FF8B39", arrowHead: "diamond", lineStyle: "dotted" },
                            inherits: { lineColor: "#FE4450", arrowHead: "triangle", lineStyle: "solid" },
                            composes: { lineColor: "#36F9F6", arrowHead: "diamond", lineStyle: "dashed" },
                            idecontainsstandalonecode: { lineColor: "#FEDE5D", arrowHead: "arrow", lineStyle: "solid" }
                        },
                        canvas: {
                            backgroundColor: "#262335",
                            gridColor: "#241B2F",
                            gridSpacing: 20
                        },
                        ide: {
                            backgroundColor: "#262335",
                            textColor: "#F92AFF",
                            lineNumbersColor: "#495495",
                            highlightColor: "#241B2F"
                        },
                        buttons: {
                            backgroundColor: "#FF7EDB",
                            textColor: "#262335",
                            hoverBackgroundColor: "#36F9F6"
                        }
                    },
    {
        name: "Google Playground",
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
    },
    {
        name: "One Piece Adventure",
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
        name: "Retro Terminal",
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
            class_contains_functions: { lineColor: "#00FF00", arrowHead: "diamond", lineStyle: "dashed" },
            class_contains_standalone: { lineColor: "#00FF00", arrowHead: "diamond", lineStyle: "dotted" },
            inherits: { lineColor: "#00FF00", arrowHead: "triangle", lineStyle: "solid" },
            composes: { lineColor: "#00FF00", arrowHead: "diamond", lineStyle: "dashed" },
            idecontainsstandalonecode: { lineColor: "#00FF00", arrowHead: "arrow", lineStyle: "solid" }
        },
        canvas: {
            backgroundColor: "#000000",
            gridColor: "#003300",
            gridSpacing: 20
        },
        ide: {
            backgroundColor: "#000000",
            textColor: "#00FF00",
            lineNumbersColor: "#008800",
            highlightColor: "#003300"
        },
        buttons: {
            backgroundColor: "#008800",
            textColor: "#00FF00",
            hoverBackgroundColor: "#00AA00"
        }
    },
    {
        name: "Matrix Reloaded",
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
        name: "Neon Cyberpunk",
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
    },
    {
        name: "Candy Crush Saga",
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
    }
                ];

                export default customTemplates;