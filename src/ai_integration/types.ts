export interface ModelInfo {
    selectedModel: {
        name: string;
        displayName: string;
        description: string;
        parameters?: {
            temperature?: number;
            top_k?: number;
            top_p?: number;
            max_tokens?: number;
        };
    };
    customization?: {
        instructions: {
            id: number;
            text: string;
        }[];
        modelfile: string;
        customModelName: string;
    };
    lastUpdated: string;
}