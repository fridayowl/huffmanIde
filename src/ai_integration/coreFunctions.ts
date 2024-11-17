// coreFunctions.ts
import { fetch, Body, ResponseType } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';
import { ModelConfig, ModelParameters } from './types';

export async function checkOllamaAPI(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/version');
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to Ollama API:', error);
    return false;
  }
}

export async function checkOllamaInstallation(): Promise<{ isInstalled: boolean; installedModels: string[] }> {
  try {
    const command = new Command('ollama', ['list']);
    const output = await command.execute();

    const apiAccessible = await checkOllamaAPI();
    if (!apiAccessible) {
      return { isInstalled: false, installedModels: [] };
    }

    const models = output.stdout
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split(' ')[0]);

    return { isInstalled: true, installedModels: models };
  } catch (error) {
    console.error('Failed to check Ollama installation:', error);
    return { isInstalled: false, installedModels: [] };
  }
}

export async function pullModel(
  modelName: string, 
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<boolean> {
  try {
    const command = new Command('ollama', ['pull', modelName]);

    command.stdout.on('data', line => {
      const progressMatch = line.match(/(\d+)%/);
      if (progressMatch) {
        onProgress(parseInt(progressMatch[1]));
      }
      onStatus(line);  // Changed: directly pass the line string
    });

    command.stderr.on('data', line => {
      onStatus(line);  // Changed: directly pass the line string
    });

    await command.execute();
    return true;
  } catch (error) {
    console.error('Failed to pull model:', error);
    return false;
  }
}

export async function sendPrompt(
  model: string,
  prompt: string,
  parameters: ModelParameters  // Changed: use proper type
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: Body.json({
        model,
        prompt,
        format: "json",
        stream: false,
        ...parameters
      }),
      responseType: ResponseType.JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.data as { response: string };
    
    try {
      const jsonResponse = JSON.parse(result.response);
      return {
        success: true,
        response: jsonResponse.code || JSON.stringify(jsonResponse, null, 2)
      };
    } catch {
      return { success: true, response: result.response };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get response from model. Make sure Ollama is running.'
    };
  }
}

export async function createCustomModel(
  customModelName: string,
  modelfileContent: string,
  onStatus: (status: string) => void
): Promise<boolean> {
  try {
    // Create temporary Modelfile
    const modelfilePath = `/tmp/${customModelName}.modelfile`;
    const createFile = new Command('bash', ['-c', `echo '${modelfileContent.replace(/'/g, "'\\''")}' > ${modelfilePath}`]);
    await createFile.execute();

    // Create model using Ollama
    const createCommand = new Command('ollama', ['create', customModelName, modelfilePath]);
    
    createCommand.stdout.on('data', line => {
      onStatus(line);  // Changed: directly pass the line string
    });

    createCommand.stderr.on('data', line => {
      onStatus(line);  // Changed: directly pass the line string
    });

    await createCommand.execute();
    
    // Clean up
    await new Command('rm', [modelfilePath]).execute();
    
    return true;
  } catch (error) {
    console.error('Failed to create custom model:', error);
    return false;
  }
}