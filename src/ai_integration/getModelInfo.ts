import { ModelInfo } from './types';

export const getModelInfo = (): ModelInfo | null => {
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