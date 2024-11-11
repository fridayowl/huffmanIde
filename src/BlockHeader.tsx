import React from 'react';
import { FileText, Eye, Play, Maximize2 } from 'lucide-react';

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
            className="group rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{
                backgroundColor: blockStyle.backgroundColor,
                border: `2px solid ${blockStyle.borderColor}`,
                color: blockStyle.textColor,
                width: '300px',
                height: '60px', // Increased height for better visibility
                marginLeft: '20px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Hover overlay with animation */}
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Pulsing dot to attract attention */}
            <div className="absolute right-3 top-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>

            <div className="flex justify-between items-center w-full relative">
                <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm font-bold truncate">{fileName}</span>
                </div>

                {/* Button with hover effect */}
                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full group-hover:bg-blue-500/20 transition-all duration-300">
                    <Maximize2 size={14} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">Open IDE</span>
                </div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Click to open in IDE
                </div>
            </div>
        </div>
    );
};

// Update the Block component's header to make it more obvious it's clickable
const BlockHeader: React.FC<{
    name: string;
    customization: any;
    onHeaderClick: () => void;
}> = ({ name, customization, onHeaderClick }) => {
    return (
        <div
            onClick={onHeaderClick}
            className="group p-2 flex justify-between items-center cursor-pointer transition-all duration-300"
            style={{
                backgroundColor: customization.headerColor,
                borderBottom: `1px solid ${customization.borderColor}`
            }}
        >
            <h3 className="font-bold text-lg flex items-center">
                {name}
                <div
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-sm px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${customization.borderColor}1A` }} // Lightly tinted borderColor
                >
                    <Maximize2 size={14} style={{ color: customization.borderColor }} />
                    <span style={{ color: customization.borderColor }}>Open in IDE</span>
                </div>
            </h3>

            {/* Interactive hover indicator */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: customization.borderColor }} />
                <span className="text-sm" style={{ color: customization.borderColor }}>Click to open IDE</span>
            </div>
        </div>

    );
};

export { ShowIDEBlock, BlockHeader };