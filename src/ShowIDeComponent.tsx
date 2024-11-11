import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface ShowIDEBlockProps {
    fileName: string;
    onShow: () => void;
    customization: {
        blocks?: {
            code?: {
                backgroundColor?: string;
                borderColor?: string;
                textColor?: string;
                headerColor?: string;
            };
        };
    };
}

const ShowIDEBlock: React.FC<ShowIDEBlockProps> = ({ fileName, onShow, customization }) => {
    const blockStyle = customization.blocks?.code || {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        textColor: '#000000',
        headerColor: '#F0F0F0',
    };

    return (
        <div
            onClick={onShow}
            className="rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
            style={{
                backgroundColor: blockStyle.backgroundColor,
                border: `2px solid ${blockStyle.borderColor}`,
                color: blockStyle.textColor,
                width: '300px',  // Set width to 300px
                height: '40px',  // Increased height for button space
                marginLeft: '20px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',   // Center-align content vertically
                padding: '0 10px',
            }}
        >
            <div
                className="flex justify-between items-center w-full"
                style={{ backgroundColor: blockStyle.headerColor }}
            >
                <div className="flex items-center">
                    <FileText size={12} className="mr-2" />
                    <span className="text-sm font-bold truncate">{fileName}</span>
                </div>
                <button
                    onClick={onShow}
                    className="flex items-center text-sm font-bold text-gray-700 hover:text-blue-600"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <Eye size={14} className="mr-1" />
                    Show
                </button>
            </div>
        </div>
    );
};

export default ShowIDEBlock;
