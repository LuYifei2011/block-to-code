import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  newWindow: (filePath: string, width?: number, height?: number) => ipcRenderer.send('newWindow', filePath, width, height),
  openFileDialog: () => ipcRenderer.invoke('openFileDialog'),
  saveFileDialog: () => ipcRenderer.invoke('saveFileDialog'),
  readFile: (filePath: string) => ipcRenderer.sendSync('readFile', filePath),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('writeFile', filePath, data),
  setStore: (key: string, value: any) => ipcRenderer.send('setStore', key, value),
  getStore: (key: string) => ipcRenderer.sendSync('getStore', key)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}