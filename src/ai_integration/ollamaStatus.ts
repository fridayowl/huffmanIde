// ollamaStatus.ts
import { fetch } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';

export interface OllamaStatus {
  isInstalled: boolean;
  isRunning: boolean;
  version?: string;
  error?: string;
  installedModels: string[];
}

/**
 * Checks the status of Ollama installation and service
 * @returns Promise<OllamaStatus> Object containing status information
 */
export async function checkOllamaStatus(): Promise<OllamaStatus> {
  const status: OllamaStatus = {
    isInstalled: false,
    isRunning: false,
    installedModels: []
  };

  try {
    // First, check if Ollama is installed by trying to run 'ollama list'
    const listCommand = new Command('ollama', ['list']);
    const listOutput = await listCommand.execute();
    
    if (listOutput.code === 0) {
      status.isInstalled = true;
      
      // Parse installed models from the output
      status.installedModels = listOutput.stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.split(' ')[0]);
    }

    // Then check if the Ollama API is accessible
    try {
      const response = await fetch('http://localhost:11434/api/version', {
        method: 'GET',
        timeout: 5 // 5 seconds timeout
      });

      if (response.ok) {
        status.isRunning = true;
        status.version = (response.data as { version: string }).version;
      }
    } catch (apiError) {
      // API is not accessible, but Ollama might still be installed
      status.error = 'Ollama API is not accessible. Please ensure the service is running.';
    }

  } catch (error) {
    // If the command fails, Ollama is not installed
    status.error = 'Ollama is not installed or not accessible.';
  }

  return status;
}

/**
 * Utility function to start the Ollama service
 * @returns Promise<boolean> True if service started successfully
 */
export async function startOllamaService(): Promise<boolean> {
  try {
    const startCommand = new Command('ollama', ['serve']);
    
    // Start Ollama service in background
    await startCommand.spawn();
    
    // Wait for service to be ready
    let attempts = 0;
    while (attempts < 10) {
      try {
        const status = await checkOllamaStatus();
        if (status.isRunning) {
          return true;
        }
      } catch (_) {
        // Ignore errors during polling
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to start Ollama service:', error);
    return false;
  }
}

/**
 * Checks if a specific model is installed
 * @param modelName Name of the model to check
 * @returns Promise<boolean> True if model is installed
 */
export async function isModelInstalled(modelName: string): Promise<boolean> {
  const status = await checkOllamaStatus();
  return status.installedModels.includes(modelName);
}