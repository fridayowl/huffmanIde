// StatusLog.tsx
import React from 'react';
import { Terminal } from 'lucide-react';

interface StatusLogProps {
    status: string;
}

const StatusLog: React.FC<StatusLogProps> = ({ status }) => {
    if (!status) return null;

    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-2.5">
            <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-300">Status Log</h3>
            </div>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-48 text-sm text-gray-300">
                {status}
            </pre>
        </div>
    );
};

export default StatusLog;