import { Command } from '@tauri-apps/api/shell';
import { writeTextFile, removeFile, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import { join, appDir, downloadDir } from '@tauri-apps/api/path';

export interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: number;
}

export class PythonExecutor {
    private pythonCommand: string | null = null;
    private tempDir: string | null = null;

    async initialize(): Promise<boolean> {
        try {
            // Create temp directory for execution
            const appDirPath = await appDir();
            this.tempDir = await join(appDirPath, 'temp');
            try {
                await createDir('temp', { dir: BaseDirectory.App, recursive: true });
            } catch (error) {
                // Directory might already exist
                console.log('Temp directory already exists or creation failed:', error);
            }

            // Try different Python commands with full paths
            const possibleCommands = [
                'python3',
                'python',
                '/usr/bin/python3',
                '/usr/bin/python',
                'C:\\Python39\\python.exe',
                'C:\\Python310\\python.exe',
                'C:\\Python311\\python.exe'
            ];

            for (const cmd of possibleCommands) {
                try {
                    const result = await new Command(cmd, ['--version']).execute();
                    if (result.code === 0) {
                        this.pythonCommand = cmd;
                        console.log(`Python found: ${cmd}`);
                        return true;
                    }
                } catch (error) {
                    console.log(`Command ${cmd} failed:`, error);
                    continue;
                }
            }

            // If we get here, no Python command worked
            console.error('No Python installation found');
            return false;

        } catch (error) {
            console.error('Error initializing Python executor:', error);
            this.pythonCommand = null;
            return false;
        }
    }

    async executeCode(
        code: string,
        onOutput?: (output: string) => void,
        onError?: (error: string) => void
    ): Promise<ExecutionResult> {
        if (!this.pythonCommand || !this.tempDir) {
            throw new Error('Python executor not initialized');
        }

        const startTime = performance.now();
        let outputText = '';
        let errorText = '';

        try {
            // Create temporary file with timestamp to avoid conflicts
            const timestamp = Date.now();
            const tempFilePath = await join(this.tempDir, `temp_script_${timestamp}.py`);

            // Write code to file
            await writeTextFile(tempFilePath, code);

            try {
                // Execute Python command with full path
                const command = new Command(this.pythonCommand, [tempFilePath]);

                // Handle stdout
                command.stdout.on('data', line => {
                    outputText += line + '\n';
                    onOutput?.(line + '\n');
                });

                // Handle stderr
                command.stderr.on('data', line => {
                    errorText += line + '\n';
                    onError?.(line + '\n');
                });

                // Execute and wait for completion
                await command.execute();

            } finally {
                // Cleanup
                try {
                    await removeFile(tempFilePath);
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
            }

            return {
                output: outputText.trim(),
                error: errorText.trim() || null,
                executionTime: performance.now() - startTime
            };

        } catch (error) {
            return {
                output: outputText.trim(),
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                executionTime: performance.now() - startTime
            };
        }
    }

    getPythonCommand(): string | null {
        return this.pythonCommand;
    }
}

export const pythonExecutor = new PythonExecutor();