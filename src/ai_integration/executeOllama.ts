import { ModelInfo } from './types';
import { fetch, Body, ResponseType } from '@tauri-apps/api/http';

interface ModelParameters {
    temperature?: number;
    top_k?: number;
    top_p?: number;
    max_tokens?: number;
}

interface OllamaRequest {
    model: string;
    prompt: string;
    format?: string;
    stream?: boolean;
    parameters?: ModelParameters;
}

interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

interface ExecuteOllamaResult {
    success: boolean;
    data?: string;
    error?: string;
}

/**
 * Gets the stored model information from localStorage
 * @returns ModelInfo | null
 */
const getModelInfo = (): ModelInfo | null => {
    try {
        const storedInfo = localStorage.getItem('Model_Info');
        if (!storedInfo) {
            return null;
        }
        const parsedInfo: ModelInfo = JSON.parse(storedInfo);
        return parsedInfo;
    } catch (error) {
        console.error('Failed to retrieve model info from localStorage:', error);
        return null;
    }
};

/**
 * Executes a prompt against the Ollama API using stored model information
 * @param prompt - The prompt to send to the model
 * @param format - Optional response format (default: "json")
 * @returns Promise<ExecuteOllamaResult>
 */
export async function executeOllama(
    prompt: string,
    format: string = "json"
): Promise<ExecuteOllamaResult> {
    // Get model info from storage
    const modelInfo = getModelInfo();
    
    if (!modelInfo) {
        return {
            success: false,
            error: "No model information found in storage"
        };
    }

    if (!prompt.trim()) {
        return {
            success: false,
            error: "Prompt is required"
        };
    }

    try {
        const requestBody: OllamaRequest = {
            model: modelInfo.selectedModel.name,
            prompt: prompt,
            format,
            stream: false,
            parameters: {
                temperature: modelInfo.selectedModel.parameters?.temperature,
                top_k: modelInfo.selectedModel.parameters?.top_k,
                top_p: modelInfo.selectedModel.parameters?.top_p,
                max_tokens: modelInfo.selectedModel.parameters?.max_tokens
            }
        };

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: Body.json(requestBody),
            responseType: ResponseType.JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = response.data as OllamaResponse;

        // Handle JSON response
        if (format === "json") {
            try {
                const jsonResponse = JSON.parse(result.response);
                // If response contains code property, return just the code
                if (jsonResponse.code) {
                    return {
                        success: true,
                        data: jsonResponse.code
                    };
                }
                // Otherwise return formatted JSON
                return {
                    success: true,
                    data: JSON.stringify(jsonResponse, null, 2)
                };
            } catch (parseError) {
                // If JSON parsing fails, return raw response
                return {
                    success: true,
                    data: result.response
                };
            }
        }

        // Return raw response for non-JSON formats
        return {
            success: true,
            data: result.response
        };

    } catch (error) {
        console.error('Failed to execute Ollama prompt:', error);
        return {
            success: false,
            error: 'Failed to get response from model. Make sure Ollama is running.'
        };
    }
}

/**
 * Checks if the Ollama API is accessible
 * @returns Promise<boolean>
 */
export async function checkOllamaAPI(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:11434/api/version');
        return response.ok;
    } catch (error) {
        console.error('Failed to connect to Ollama API:', error);
        return false;
    }
}