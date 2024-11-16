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

interface StreamingExecuteOllamaResult {
    success: boolean;
    error?: string;
}

/**
 * Executes a prompt against the Ollama API with streaming response
 * @param prompt - The prompt to send to the model
 * @param onToken - Callback function that receives each token as it arrives
 * @param onComplete - Callback function called when streaming is complete
 * @param onError - Callback function called when an error occurs
 * @param format - Optional response format (default: "json")
 * @returns Promise<StreamingExecuteOllamaResult>
 */
export async function executeOllamaStreaming(
    prompt: string,
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void,
    format: string = "json"
): Promise<StreamingExecuteOllamaResult> {
    const modelInfo = getModelInfo();
    
    if (!modelInfo) {
        onError("No model information found in storage");
        return { success: false, error: "No model information found in storage" };
    }

    if (!prompt.trim()) {
        onError("Prompt is required");
        return { success: false, error: "Prompt is required" };
    }

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: Body.json({
                model: modelInfo.selectedModel.name,
                prompt: prompt,
                stream: true,
                format,
                parameters: {
                    temperature: modelInfo.selectedModel.parameters?.temperature,
                    top_k: modelInfo.selectedModel.parameters?.top_k,
                    top_p: modelInfo.selectedModel.parameters?.top_p,
                    max_tokens: modelInfo.selectedModel.parameters?.max_tokens
                }
            }),
            responseType: ResponseType.Text
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Split the response by newlines to get individual JSON objects
        const chunks = (response.data as string).split('\n').filter(Boolean);
        let fullResponse = '';

        for (const chunk of chunks) {
            try {
                const parsed = JSON.parse(chunk) as OllamaResponse;
                fullResponse += parsed.response;
                onToken(parsed.response);

                if (parsed.done) {
                    // Handle JSON format if needed
                    if (format === "json") {
                        try {
                            const jsonResponse = JSON.parse(fullResponse);
                            const finalResponse = jsonResponse.code || JSON.stringify(jsonResponse, null, 2);
                            onComplete(finalResponse);
                        } catch (parseError) {
                            onComplete(fullResponse);
                        }
                    } else {
                        onComplete(fullResponse);
                    }
                }
            } catch (parseError) {
                console.error('Error parsing chunk:', parseError);
            }
        }

        return { success: true };

    } catch (error) {
        const errorMessage = 'Failed to get response from model. Make sure Ollama is running.';
        onError(errorMessage);
        return { success: false, error: errorMessage };
    }
}

// Helper function to get model info (unchanged)
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

export async function checkOllamaAPI(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:11434/api/version');
        return response.ok;
    } catch (error) {
        console.error('Failed to connect to Ollama API:', error);
        return false;
    }
}