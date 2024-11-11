import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, FileText, Code, Box, X } from 'lucide-react';

interface CodeFlowAnimationProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeFlowAnimation: React.FC<CodeFlowAnimationProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<{ type: string; code: string[], id: number }[]>([]);

  const sampleCode = `class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.processed = None

    def process(self):
        self.processed = self.clean_data()
        return self.processed

    def clean_data(self):
        return [x for x in self.data if x is not None]

# Standalone code
print("Processing data...")
data = [1, None, 3, None, 5]

# Create processor instance
processor = DataProcessor(data)
result = processor.process()
print(f"Result: {result}")`;

  useEffect(() => {
    if (!isOpen) return;

    setStage(0);
    setBlocks([]);
    setCodeLines(sampleCode.split('\n'));

    const timer1 = setTimeout(() => setStage(1), 1000);
    const timer2 = setTimeout(() => setStage(2), 2000);
    const timer3 = setTimeout(() => {
      setStage(3);
      animateBlocks();
    }, 3000);

    const navigationTimer = setTimeout(() => {
      // navigate('/ide');
    }, 1008000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(navigationTimer);
    };
  }, [isOpen, navigate]);

  const animateBlocks = () => {
    const blocks: { type: string; code: string[], id: number }[] = [];
    const lines = sampleCode.split('\n');
    let currentBlock: string[] = [];
    let currentType = '';
    let idCounter = 0;

    lines.forEach((line) => {
      if (line.trimStart().startsWith('class ')) {
        if (currentBlock.length > 0) {
          blocks.push({ type: currentType, code: currentBlock, id: idCounter++ });
          currentBlock = [];
        }
        currentType = 'class';
        currentBlock = [line];
      } else if (line.trimStart().startsWith('def ')) {
        if (currentBlock.length > 0) {
          blocks.push({ type: currentType, code: currentBlock, id: idCounter++ });
          currentBlock = [];
        }
        currentType = 'function';
        currentBlock = [line];
      } else {
        if (currentBlock.length === 0) {
          currentType = 'code';
        }
        currentBlock.push(line);
      }
    });

    if (currentBlock.length > 0) {
      blocks.push({ type: currentType, code: currentBlock, id: idCounter++ });
    }

    blocks.forEach((block, index) => {
      setTimeout(() => {
        setBlocks((prev) => [...prev, block]);
      }, index * 500);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-gray-900 rounded-lg shadow-xl w-[800px] h-[600px] overflow-hidden relative ${stage === 1 ? 'animate-zoomIn' : stage === 3 ? 'animate-panDown' : ''}`}>
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-400" size={24} />
            <h2 className="text-white text-lg font-medium">Converting Python Code</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 h-[calc(100%-4rem)] flex flex-col items-center justify-center">
          {stage === 0 && (
            <div className="flex flex-col items-center gap-4 animate-fadeIn">
              <FileText className="text-indigo-400 animate-bounce" size={48} />
              <p className="text-white text-lg">Analyzing Python File...</p>
            </div>
          )}

          {stage === 1 && (
            <div className="w-full max-w-lg animate-fadeIn">
              <div className="bg-gray-800 p-4 rounded-lg">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm text-gray-300 animate-slideIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="flex items-center gap-8 animate-pulse">
              <Code className="text-indigo-400" size={36} />
              <div className="w-32 h-2 bg-indigo-400 rounded animate-flow" />
              <Box className="text-indigo-400" size={36} />
            </div>
          )}

          {stage === 3 && (
            <div className="w-full grid grid-cols-2 gap-6 animate-fadeIn relative">
              <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
                <h3 className="text-white mb-2 font-medium">Original Code</h3>
                {codeLines.map((line, index) => (
                  <div key={index} className="font-mono text-sm text-gray-300">
                    {line}
                  </div>
                ))}
              </div>

              <div className="space-y-4 overflow-auto max-h-[400px] relative">
                <h3 className="text-white font-medium">Generated Blocks</h3>
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`p-4 rounded-lg animate-slideIn relative ${block.type === 'class'
                      ? 'bg-indigo-500/20 border border-indigo-500/40'
                      : block.type === 'function'
                        ? 'bg-green-500/20 border border-green-500/40'
                        : 'bg-gray-700/50 border border-gray-600/40'
                      }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-xs text-gray-400 mb-2 capitalize">{block.type} Block</div>
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                      {block.code.join('\n')}
                    </pre>
                    {index > 0 && (
                      <div
                        className={`absolute top-0 left-0 w-1 h-full bg-${index % 2 === 0 ? 'indigo' : 'green'}-400`}
                        style={{ left: '-4px', height: '100%' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes flow {
            0%, 100% { transform: scaleX(0); opacity: 0; }
            50% { transform: scaleX(1); opacity: 1; }
          }
          @keyframes zoomIn {
            from { transform: scale(1); }
            to { transform: scale(1.2); }
          }
          @keyframes panDown {
            from { transform: translateY(0); }
            to { transform: translateY(50px); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease forwards;
          }
          .animate-flow {
            animation: flow 1s ease-in-out infinite;
          }
          .animate-zoomIn {
            animation: zoomIn 1.5s ease forwards;
          }
          .animate-panDown {
            animation: panDown 1.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default CodeFlowAnimation;
