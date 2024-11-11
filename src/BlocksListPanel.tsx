import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Layers, Search, Filter, FileText } from 'lucide-react';
import { ExtendedBlockData } from './types';

interface BlocksListPanelProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: ExtendedBlockData[];
    onBlockSelect: (blockId: string) => void;
    customization: any;
}

const BlocksListPanel: React.FC<BlocksListPanelProps> = ({
    isOpen,
    onClose,
    blocks,
    onBlockSelect,
    customization
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string>('all');
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isExpanded, setIsExpanded] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const blockTypes = ['class', 'class_function', 'class_standalone', 'code', 'standalone_function'];

    const fileNames = useMemo(() => {
        const uniqueFiles = new Set(blocks.map(block => block.id.split('.')[0]));
        return Array.from(uniqueFiles);
    }, [blocks]);

    const filteredBlocks = useMemo(() => {
        return blocks.filter(block =>
            (selectedType ? block.type === selectedType : true) &&
            (selectedFile !== 'all' ? block.id.startsWith(selectedFile) : true) &&
            (searchTerm ? block.id.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        );
    }, [blocks, selectedType, selectedFile, searchTerm]);

    const blockCounts = useMemo(() => {
        return blockTypes.reduce((acc, type) => {
            acc[type] = blocks.filter(block => block.type === type).length;
            return acc;
        }, {} as Record<string, number>);
    }, [blocks]);

    const getBlockColor = (blockType: string) => {
        return customization.blocks[blockType]?.borderColor || '#ffffff';
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'select' ||
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'option') {
            return;
        }
        event.preventDefault();
        setIsDragging(true);
        setOffset({ x: event.clientX - position.x, y: event.clientY - position.y });
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (isDragging && panelRef.current) {
            const navbarHeight = 64;
            const padding = 16;

            const canvasBounds = document.querySelector('.overflow-auto')?.getBoundingClientRect();
            if (!canvasBounds) return;

            let newX = event.clientX - offset.x;
            let newY = event.clientY - offset.y;

            const panelWidth = panelRef.current.offsetWidth;
            const panelHeight = panelRef.current.offsetHeight;

            newX = Math.max(canvasBounds.left + padding, Math.min(newX, canvasBounds.right - panelWidth - padding));
            newY = Math.max(canvasBounds.top + padding, Math.min(newY, canvasBounds.bottom - panelHeight - padding));

            newY = Math.max(navbarHeight + padding, newY);

            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    const inputSelectStyle = {
        fontSize: '0.625rem',
        backgroundColor: customization.ide.backgroundColor,
        color: customization.ide.textColor,
        border: `1px solid ${customization.canvas.gridColor}`,
        cursor: 'pointer'
    };

    return (
        <div
            ref={panelRef}
            className="fixed z-10 w-[250px] shadow-lg select-none rounded-lg"
            style={{
                top: position.y,
                left: position.x,
                cursor: isDragging ? 'grabbing' : 'grab',
                backgroundColor: customization.canvas.backgroundColor || 'rgba(255, 255, 255, 0.6)',
                border: `1px solid ${customization.canvas.gridColor}`,
                height: 'auto',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
            }}
            onDragStart={(e) => e.preventDefault()}
        >
            <div
                className="p-2"
                onMouseDown={(e) => {
                    const target = e.target as HTMLElement;
                    if (!target.closest('select') &&
                        !target.closest('input') &&
                        !target.closest('option')) {
                        handleMouseDown(e);
                    }
                }}
            >
                <div className="flex justify-between items-center mb-2"
                    style={{ borderBottom: `1px solid ${customization.canvas.gridColor}`, paddingBottom: '8px' }}>
                    <h2 className="text-xs font-bold flex items-center"
                        style={{
                            fontSize: '0.75rem',
                            color: customization.ide.textColor
                        }}>
                        <Layers size={16} className="mr-1" />
                        Blocks
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-opacity-20"
                        style={{ color: customization.ide.textColor }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div>
                    <div
                        className="flex justify-between items-center cursor-pointer mb-1"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        style={{ color: customization.ide.textColor }}
                    >
                        <h3 className="text-xs font-semibold" style={{ fontSize: '0.75rem' }}>
                            Block Counts
                        </h3>
                        <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '-' : '+'}</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[150px]' : 'max-h-0'}`}>
                        {blockTypes.map((type) => (
                            <div key={type} className="flex justify-between items-center mb-1">
                                <span className="text-xs capitalize" style={{ color: getBlockColor(type), fontSize: '0.625rem' }}>
                                    {type.replace('_', ' ')}:
                                </span>
                                <span className="text-xs font-semibold" style={{
                                    fontSize: '0.625rem',
                                    color: customization.ide.textColor
                                }}>
                                    {blockCounts[type]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex items-center mb-1">
                        <Search size={16} style={{ color: customization.ide.textColor }} className="mr-1" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-1 rounded text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ ...inputSelectStyle, cursor: 'text' }}
                        />
                    </div>
                    <div className="flex items-center mb-1">
                        <Filter size={16} style={{ color: customization.ide.textColor }} className="mr-1" />
                        <select
                            className="w-full p-1 rounded text-xs"
                            value={selectedType || ''}
                            onChange={(e) => setSelectedType(e.target.value || null)}
                            style={inputSelectStyle}
                        >
                            <option value="">All Types</option>
                            {blockTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <FileText size={16} style={{ color: customization.ide.textColor }} className="mr-1" />
                        <select
                            className="w-full p-1 rounded text-xs"
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            style={inputSelectStyle}
                        >
                            <option value="all">All Files</option>
                            {fileNames.map((file) => (
                                <option key={file} value={file}>
                                    {file}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-2 p-1 rounded-lg"
                    style={{
                        maxHeight: '250px',
                        overflowY: 'auto',
                        backgroundColor: customization.ide.backgroundColor,
                        border: `1px solid ${customization.canvas.gridColor}`
                    }}>
                    <h3 className="text-xs font-semibold mb-1"
                        style={{
                            fontSize: '0.75rem',
                            color: customization.ide.textColor
                        }}>
                        Blocks
                    </h3>
                    <ul className="space-y-1">
                        {filteredBlocks.map((block) => {
                            const blockName = block.id.split('.').pop() || block.id;
                            const fileName = block.id.split('.')[0];
                            return (
                                <li
                                    key={block.id}
                                    className="border p-1 rounded cursor-pointer hover:bg-opacity-80 transition-colors"
                                    onClick={() => onBlockSelect(block.id)}
                                    style={{
                                        borderLeftColor: getBlockColor(block.type),
                                        borderLeftWidth: '2px',
                                        backgroundColor: customization.blocks[block.type]?.backgroundColor,
                                        color: customization.blocks[block.type]?.textColor || '#000000',
                                        fontSize: '0.625rem',
                                    }}
                                >
                                    <span className="font-medium truncate">{blockName}</span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs">{block.type}</span>
                                        {selectedFile === 'all' && <span className="text-xs">{fileName}</span>}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default BlocksListPanel;