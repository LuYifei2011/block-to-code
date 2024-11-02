/// <reference types="vite/client" />

interface Window {
  electron: any;
  api: {
    newWindow: (filePath: string, width?: number, height?: number) => void;
    openFileDialog: () => Promise<string>;
    saveFileDialog: () => Promise<string>;
    readFile: (filePath: string) => string;
    writeFile: (filePath: string, data: string) => Promise<boolean>;
    setStore: (key: string, value: any) => void;
    getStore: (key: string) => any;
    resizeWindow: (width: number, height: number) => void;
    maximizeWindow: () => void;
    restoreWindow: () => void;
  };
}