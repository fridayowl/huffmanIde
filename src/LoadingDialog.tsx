import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingDialogProps {
  title: string;
  message: string;
  isOpen: boolean;
}

const LoadingDialog = ({ title, message, isOpen }: LoadingDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingDialog;