import { Command } from '@tauri-apps/api/shell';
import { writeTextFile, removeFile } from '@tauri-apps/api/fs';
import { join, downloadDir } from '@tauri-apps/api/path';

export interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: number;
}

export class PythonExecutor {
    private pythonCommand: string | null = null;

    async initialize(): Promise<boolean> {
        try {
            // Try python3 first
            try {
                await new Command('python3', ['--version']).execute();
                this.pythonCommand = 'python3';
                return true;
            } catch {
                // If python3 fails, try python
                await new Command('python', ['--version']).execute();
                this.pythonCommand = 'python';
                return true;
            }
        } catch (error) {
            this.pythonCommand = null;
            return false;
        }
    }

    async executeCode(
        code: string,
        onOutput?: (output: string) => void,
        onError?: (error: string) => void
    ): Promise<ExecutionResult> {
        if (!this.pythonCommand) {
            throw new Error('Python is not initialized');
        }

        const startTime = performance.now();
        let outputText = '';
        let errorText = '';

        try {
            // Create temporary file
            const downloadsPath = await downloadDir();
            const tempFilePath = await join(downloadsPath, `temp_script_${Date.now()}.py`);

            // Write code to file
            await writeTextFile(tempFilePath, code);

            try {
                // Execute Python command
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