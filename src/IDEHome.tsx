import React, { useState, useRef, useEffect } from 'react';
import NavBarMinimal from './NavBar';
import MultiCanvasManager, { MultiCanvasManagerHandle } from './MultiCanvasManager';
import Directory, { FileSystemItem, DirectoryHandle } from './Directory';
import DisableDefaultZoom from './DisableZoom';
import Home from './Home';
import OnboardingDialog from './OnboardingDialog';
function IDEHome() {
  const [directoryStructure, setDirectoryStructure] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const directoryRef = useRef<DirectoryHandle>(null);
  const multiCanvasRef = useRef<MultiCanvasManagerHandle>(null);
  const [showOnboarding, setShowOnboarding] = useState(true); 
  useEffect(() => {
    const storedFileName = localStorage.getItem('selectedFileName');
    const storedFileContent = localStorage.getItem('selectedFileContent');
    if (storedFileName && storedFileContent) {
      setSelectedFileName(storedFileName);
      setSelectedFile(storedFileContent);
    }
  }, []);

  const handleFolderSelect = (folder: FileSystemItem[]) => {
    setDirectoryStructure(folder);
    setShowOnboarding(false);
  };
  useEffect(() => {
    const hasFiles = Object.keys(localStorage).some(key => key.startsWith('file_'));
    setShowOnboarding(!hasFiles);
  }, []);
  const handleFileSelect = (fileContent: string, fileName: string) => {
    // Create a new canvas instance for this file
    if (multiCanvasRef.current) {
      multiCanvasRef.current.addCanvas(fileName, fileContent);
    }
    localStorage.setItem('selectedFileName', fileName);
    localStorage.setItem('selectedFileContent', fileContent);
    setShowOnboarding(false);
  };

  const handleIDEContentChange = (fileName: string, newContent: string) => {
    if (directoryRef.current) {
      directoryRef.current.updateOpenEditorContent(fileName, newContent);
    }
    localStorage.setItem(`file_${fileName}`, newContent);

  };
  const handleOpenFolder = async () => {
    if (directoryRef.current) {
      await directoryRef.current.handleFolderSelect();
      setShowOnboarding(false);
    }
  };

  const handleCreateFile = () => {
    if (directoryRef.current) {
      directoryRef.current.handleFileCreate();
      setShowOnboarding(false);
    }
  };

  return (
    
    <div className="App flex flex-col h-screen">
      <DisableDefaultZoom />
      <NavBarMinimal />
      <div className="flex-grow flex overflow-hidden">
        <Directory
          ref={directoryRef}
          items={directoryStructure}
          onFolderSelect={handleFolderSelect}
          onFileSelect={handleFileSelect}
        />
        <main className="flex-grow overflow-hidden">
          <MultiCanvasManager
            ref={multiCanvasRef}
            onCodeChange={handleIDEContentChange}
          />
          
        </main>
      </div>
      {showOnboarding && (
        <OnboardingDialog
          onOpenFolder={handleOpenFolder}
          onCreateFile={handleCreateFile}
        />
      )}
    </div>
    
  );
}

export default IDEHome;