import { fetch, Body, ResponseType } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';
import { ModelConfig, ModelParameters } from './types';
import { sendNotification } from '@tauri-apps/api/notification';
import { homeDir, join } from '@tauri-apps/api/path';

// Known Ollama paths for macOS
const OLLAMA_PATHS = [
  '/usr/local/bin/ollama',
  '/opt/homebrew/bin/ollama',
  '/opt/local/bin/ollama'
];
interface ModelInfo {
  name: string;
  size: string;
  modified: string;
  digest: string;
}

export interface ModelDetails {
  models: ModelInfo[];
}
/**
 * Find the correct Ollama path
 */
async function findOllamaPath(): Promise<string | null> {
  for (const path of OLLAMA_PATHS) {
    try {
      const command = new Command('ls', [path]);
      const result = await command.execute();
      if (result.code === 0) {
        return path;
      }
    } catch (error) {
      continue;
    }
  }
  return null;
}

export async function checkOllamaAPI(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/version', {
      method: 'GET',
      timeout: 5.0
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to Ollama API:', error);
    return false;
  }
}

async function getModelsViaAPI(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      timeout: 5.0
    });
    
    if (response.ok) {
      const data = response.data as { models: { name: string }[] };
      return data.models.map(m => m.name);
    }
  } catch (error) {
    console.error('Failed to get models via API:', error);
  }
  return [];
}

async function getModelsViaShell(ollamaPath: string): Promise<string[]> {
  try {
    const command = new Command(ollamaPath, ['list']);
    const output = await command.execute();
    
    if (output.code === 0) {
      return output.stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.split(' ')[0]);
    }
  } catch (error) {
    console.error('Failed to get models via shell:', error);
  }
  return [];
}

export async function checkOllamaInstallation(): Promise<{ 
  isInstalled: boolean; 
  installedModels: string[];
  apiAccessible: boolean;
  shellAccessible: boolean;
}> {
  let apiAccessible = false;
  let shellAccessible = false;
  let installedModels: string[] = [];

  // Check API
  apiAccessible = await checkOllamaAPI();
  if (apiAccessible) {
    const apiModels = await getModelsViaAPI();
    installedModels = [...apiModels];
  }

  // Check Shell
  const ollamaPath = await findOllamaPath();
  if (ollamaPath) {
    shellAccessible = true;
    const shellModels = await getModelsViaShell(ollamaPath);
    installedModels = [...new Set([...installedModels, ...shellModels])];
  }

  return {
    isInstalled: apiAccessible || shellAccessible,
    installedModels,
    apiAccessible,
    shellAccessible
  };
}
export async function getAvailableModels(): Promise<ModelDetails> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      timeout: 5.0
    });
    
    if (response.ok) {
      return response.data as ModelDetails;
    }
    return { models: [] };
  } catch (error) {
    console.error('Failed to fetch model details:', error);
    return { models: [] };
  }
}

export async function pullModel(
  modelName: string, 
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<boolean> {
  // Try API first
  try {
    const response = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      body: Body.json({ name: modelName }),
      responseType: ResponseType.Text
    });

    if (response.ok) {
      onProgress(100);
      onStatus('Model pulled successfully via API');
      return true;
    }
  } catch (apiError) {
    console.error('API pull failed, trying shell method:', apiError);
  }

  // Try shell method
  try {
    const ollamaPath = await findOllamaPath();
    if (!ollamaPath) {
      throw new Error('Ollama executable not found');
    }

    const command = new Command(ollamaPath, ['pull', modelName]);

    command.stdout.on('data', line => {
      const progressMatch = line.match(/(\d+)%/);
      if (progressMatch) {
        onProgress(parseInt(progressMatch[1]));
      }
      onStatus(line);
    });

    command.stderr.on('data', line => {
      onStatus(line);
    });

    const result = await command.execute();
    
    if (result.code === 0) {
      try {
        await sendNotification({
          title: 'Model Download Complete',
          body: `Successfully downloaded ${modelName}`
        });
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
      return true;
    }
  } catch (error) {
    console.error('Failed to pull model:', error);
    onStatus(`Error: ${error}`);
  }

  return false;
}

export async function sendPrompt(
  model: string,
  prompt: string,
  parameters: ModelParameters
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
    console.error('Failed to send prompt:', error);
    return {
      success: false,
      error: 'Failed to get response from model. Make sure Ollama is running and accessible.'
    };
  }
}

export async function createCustomModel(
  customModelName: string,
  modelfileContent: string,
  onStatus: (status: string) => void
): Promise<boolean> {
  // Try API first
  try {
    const response = await fetch('http://localhost:11434/api/create', {
      method: 'POST',
      body: Body.json({
        name: customModelName,
        modelfile: modelfileContent
      })
    });

    if (response.ok) {
      onStatus('Model created successfully via API');
      await sendNotification({
        title: 'Custom Model Created',
        body: `Successfully created model: ${customModelName}`
      });
      return true;
    }
  } catch (apiError) {
    console.error('Failed to create model via API:', apiError);
    onStatus('API creation failed, trying shell method...');
  }

  // Try shell method
  try {
    const ollamaPath = await findOllamaPath();
    if (!ollamaPath) {
      throw new Error('Ollama executable not found');
    }

    const home = await homeDir();
    const tempPath = await join(home, `${customModelName}_${Date.now()}.modelfile`);

    // Write modelfile using Command
    const writeCommand = new Command('sh', ['-c', `echo '${modelfileContent.replace(/'/g, "'\\''")}' > "${tempPath}"`]);
    await writeCommand.execute();

    const createCommand = new Command(ollamaPath, ['create', customModelName, tempPath]);
    
    createCommand.stdout.on('data', line => {
      onStatus(line);
    });

    createCommand.stderr.on('data', line => {
      onStatus(line);
    });

    const result = await createCommand.execute();
    
    // Clean up
    const rmCommand = new Command('rm', [tempPath]);
    await rmCommand.execute();
    
    if (result.code === 0) {
      await sendNotification({
        title: 'Custom Model Created',
        body: `Successfully created model: ${customModelName}`
      });
      return true;
    }
  } catch (error) {
    console.error('Failed to create custom model:', error);
    onStatus(`Error: ${error}`);
  }

  return false;
}