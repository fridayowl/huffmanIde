import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import ComingSoon from './ComingSoon';
import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';

interface ShareFlowProps {
    canvasRef: React.RefObject<HTMLDivElement>;
}

const ShareFlow: React.FC<ShareFlowProps> = ({ canvasRef }) => {
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleShare = async () => {
        if (!canvasRef.current) return;

        try {
            // Create canvas from the element
            const canvas = await html2canvas(canvasRef.current);

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob!);
                }, 'image/png');
            });

            // Convert blob to Uint8Array for Tauri
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Open save dialog
            const filePath = await save({
                filters: [{
                    name: 'Image',
                    extensions: ['png']
                }],
                defaultPath: 'flow-screenshot.png'
            });

            // If user selected a path, save the file
            if (filePath) {
                await writeBinaryFile(filePath, uint8Array);
            }
        } catch (error) {
            console.error("Error creating screenshot:", error);
            setShowComingSoon(true);
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="group relative px-3 py-2 bg-blue-600 text-white rounded-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                title="Share"
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Button content */}
                <div className="relative z-10 flex items-center">
                    <Share2 size={16} className="mr-2" />
                    <span className="text-sm">Share</span>
                </div>
            </button>
            {showComingSoon && (
                <ComingSoon
                    feature="Flow Screenshot"
                    onClose={() => setShowComingSoon(false)}
                />
            )}
        </>
    );
};

export default ShareFlow;