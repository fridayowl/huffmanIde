import React from 'react';
import { Folder, FilePlus, Sparkles, ChevronRight } from 'lucide-react';

interface OnboardingDialogProps {
    onOpenFolder: () => void;
    onCreateFile: () => void;
}

const OnboardingDialog = ({ onOpenFolder, onCreateFile }: OnboardingDialogProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-[#1a1f2d] rounded-xl shadow-2xl w-[600px] p-8 border border-gray-800/50">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Sparkles className="w-12 h-12 text-indigo-400" />
                            <div className="absolute inset-0 animate-pulse bg-indigo-500/20 rounded-full blur-xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome to Huffman IDE
                    </h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                        Get started by selecting an existing folder or creating a new Python file.
                        Visualize your code structure and enhance your development workflow.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Open Folder Button */}
                    <button
                        onClick={onOpenFolder}
                        className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50
              hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg opacity-0 
              group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-lg">
                                    <Folder className="w-8 h-8 text-indigo-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Open Folder</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Select an existing project folder to start working with your code
                            </p>
                            <div className="flex items-center justify-end text-indigo-400 text-sm group-hover:translate-x-1 transition-transform">
                                Browse folders <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </button>

                    {/* Create File Button */}
                    <button
                        onClick={onCreateFile}
                        className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50
              hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 
              group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <FilePlus className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Create New File</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Start fresh by creating a new Python file for your project
                            </p>
                            <div className="flex items-center justify-end text-purple-400 text-sm group-hover:translate-x-1 transition-transform">
                                Create file <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        You can always access these options later through the directory panel
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingDialog;