// ModelTester.tsx
import React from 'react';
import { Send, Loader2, Terminal } from 'lucide-react';

interface ModelTesterProps {
    testMessage: string;
    response: string;
    isSending: boolean;
    isInstalled: boolean;
    onMessageChange: (message: string) => void;
    onSendPrompt: () => void;
}

const ModelTester: React.FC<ModelTesterProps> = ({
    testMessage,
    response,
    isSending,
    isInstalled,
    onMessageChange,
    onSendPrompt,
}) => {
    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Send className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold">Test Model</h2>
            </div>

            <div className="space-y-4">
                <textarea
                    value={testMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="w-full h-48 px-4 py-3 bg-gray-700 text-white rounded-lg resize-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={onSendPrompt}
                    disabled={isSending || !isInstalled || !testMessage.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                    {isSending ? 'Generating Response...' : 'Send Prompt'}
                </button>

                {response && (
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Terminal className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-semibold text-gray-300">Response:</h3>
                        </div>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-[400px]">
                            {response}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModelTester;