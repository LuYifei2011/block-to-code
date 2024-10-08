import { ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  newWindow: (filePath, width, height) => ipcRenderer.send('newWindow', filePath, width, height),
  openFileDialog: () => ipcRenderer.invoke('openFileDialog'),
  saveFileDialog: () => ipcRenderer.invoke('saveFileDialog'),
  readFile: (filePath) => ipcRenderer.sendSync('readFile', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('writeFile', filePath, data),
  setStore: (key, value) => ipcRenderer.send('setStore', key, value),
  getStore: (key) => ipcRenderer.sendSync('getStore', key)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
/* if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
} */

window.electron = electronAPI
window.api = api
