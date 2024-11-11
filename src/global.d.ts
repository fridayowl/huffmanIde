interface Window {
  __TAURI__: {
    fs: {
      writeFile(options: { contents: string; path: string }): Promise<void>;
      readFile(path: string): Promise<string>;
      readDir(path: string, options?: { recursive: boolean }): Promise<any[]>;
    };
    dialog: {
      open(options: {
        directory?: boolean;
        multiple?: boolean;
        filters?: Array<{
          name: string;
          extensions: string[];
        }>;
        defaultPath?: string;
      }): Promise<string | string[] | null>;
      save(options: {
        filters?: Array<{
          name: string;
          extensions: string[];
        }>;
        defaultPath?: string;
      }): Promise<string | null>;
    };
    path: {
      basename(path: string): Promise<string>;
      join(...paths: string[]): Promise<string>;
    };
  };
}