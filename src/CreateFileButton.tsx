import React, { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { dialog, fs } from '@tauri-apps/api';

interface CreateFileButtonProps {
    onFileCreate?: (fileName: string, content: string) => void;
}

const CreateFileButton: React.FC<CreateFileButtonProps> = ({ onFileCreate }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [fileName, setFileName] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);

    const handleCreateFile = async () => {
        try {
            setIsCreating(true);
            setShowPrompt(false);

            // Ensure the file has a .py extension
            const fullFileName = fileName.endsWith('.py') ? fileName : `${fileName}.py`;

            // Get save location from user
            const savePath = await dialog.save({
                defaultPath: fullFileName,
                filters: [{ name: 'Python Files', extensions: ['py'] }]
            });

            if (!savePath) return;

            // Create empty file content
            const initialContent = '# New Python File\n\n';

            // Write file to system
            await fs.writeTextFile(savePath, initialContent);

            // Store in localStorage for the editor
            localStorage.setItem(`file_${fullFileName}`, initialContent);

            // Update open editors through callback
            if (onFileCreate) {
                onFileCreate(fullFileName, initialContent);
            }

            await dialog.message('File created successfully!', {
                title: 'Success',
                type: 'info'
            });

        } catch (error) {
            console.error('Error creating file:', error);
            await dialog.message('Failed to create file. Please try again.', {
                title: 'Error',
                type: 'error'
            });
        } finally {
            setIsCreating(false);
            setFileName(''); // Clear the filename after creation
        }
    };

    return (
        <>
            <button
                onClick={() => setShowPrompt(true)}
                disabled={isCreating}
                className="group relative w-full bg-[#2b3240] backdrop-blur-xl rounded-lg overflow-hidden
                    hover:-translate-y-0.5 transition-all duration-300 
                    hover:shadow-lg hover:shadow-indigo-500/20"
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b3240] to-[#363d4e] 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Button content */}
                <div className="relative py-2.5 px-4 flex items-center justify-center gap-2">
                    <FilePlus
                        size={16}
                        className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {isCreating ? 'Creating...' : 'Create New File'}
                    </span>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>

            {/* Custom Prompt Modal */}
            {showPrompt && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold">Enter File Name</h2>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="border border-gray-300 p-2 rounded mt-2 w-full"
                            placeholder="File name"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowPrompt(false)}
                                className="px-4 py-2 bg-gray-200 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFile}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateFileButton;
