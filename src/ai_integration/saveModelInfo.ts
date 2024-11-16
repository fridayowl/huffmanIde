import { ModelInfo } from './types';

export const saveModelInfo = (
    selectedModel: ModelInfo['selectedModel'],
    instructions?: { id: number; text: string; }[],
    modelfile?: string,
    customModelName?: string
): void => {
    try {
        const modelInfo: ModelInfo = {
            selectedModel,
            lastUpdated: new Date().toISOString(),
        };

        // Only include customization if any of its fields are present
        if (instructions || modelfile || customModelName) {
            modelInfo.customization = {
                instructions: instructions || [],
                modelfile: modelfile || '',
                customModelName: customModelName || ''
            };
        }

        localStorage.setItem('Model_Info', JSON.stringify(modelInfo));
    } catch (error) {
        console.error('Failed to save model info to localStorage:', error);
    }
};
