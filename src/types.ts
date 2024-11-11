// types.ts
export interface BlockData {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    x: number;
    y: number;
    connections: ConnectionData[];
    lineNumber: number;
    parentClass?: string;
    height?: number;
}

export interface ExtendedBlockData extends BlockData {
    width: number;
    isVisible?: boolean;
     isTestingOpen?: boolean;
}

export interface ConnectionData {
    id: string;
    to: string;
    type: 'inherits' | 'composes' | 'class_contains_functions' | 'class_contains_standalone' | 'idecontainsclass' | 'idecontainsstandalonecode';
    fromConnector: string;
    toConnector: string;
}

export interface Connection {
    id: string;
    start: string;
    end: string;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    type: ConnectionData['type'];
    fromConnector: string;
    toConnector: string;
    startBlockType: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    endBlockType: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    isVisible?: boolean;
}

export interface Template {
    name: string;
    canvas?: {
        backgroundColor?: string;
    };
    blocks?: {
        class?: {
            backgroundColor?: string;
        };
        class_function?: {
            backgroundColor?: string;
        };
    };
    connections?: {
        inherits?: {
            lineColor?: string;
        };
    };
}

export interface PythonIDECustomization {
    backgroundColor: string;
    textColor: string;
    lineNumbersColor: string;
    highlightColor: string;
}

export interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newContent: string, lineNumber: number) => void;  // Updated signature
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    customization: PythonIDECustomization;
    onClassNameClick: (className: string, lineNumber: number) => void;
    onClose: () => void;
    onEditingStateChange?: (isEditing: boolean) => void;
     onBlocksUpdate?: (blocks: ExtendedBlockData[]) => void;
     
}


export interface PythonIDEHandle {
    updateContent?: (content: string) => void;
    handleBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
}
export interface PythonSnippet {
    code: string;
    description: string;
}

export interface CompletionOption {
    label: string;
    type: 'snippet' | 'keyword' | 'function';
    detail: string;
    info: string;
    boost: number;
    apply?: string;
}

export interface TooltipInfo {
    pos: number;
    above: boolean;
    create: () => { dom: HTMLElement };
}


export interface CanvasData {
    id: string;
    fileName: string;
    fileContent: string;
}

export interface IDESidePanelProps {
  customization: {
    backgroundColor: string;
    textColor: string;
    highlightColor: string;
  };
}