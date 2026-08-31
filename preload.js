// Elysia — 预加载脚本（contextBridge 暴露安全 API）
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  appInfo: () => ipcRenderer.invoke('app:info'),
  listModels: () => ipcRenderer.invoke('models:list'),
  addModelFolder: () => ipcRenderer.invoke('models:addFolder'),
  addModelUrl: (payload) => ipcRenderer.invoke('models:addUrl', payload),
  removeModelUrl: (url) => ipcRenderer.invoke('models:removeUrl', url),
  captureScreen: () => ipcRenderer.invoke('screen:capture'),
  listCharacters: () => ipcRenderer.invoke('characters:list'),
  readCharacter: (file) => ipcRenderer.invoke('characters:read', file),
  writeCharacter: (file, data) => ipcRenderer.invoke('characters:write', { file, data }),
  deleteCharacter: (file) => ipcRenderer.invoke('characters:delete', file),
  chooseAvatar: () => ipcRenderer.invoke('characters:chooseAvatar'),
  exportCharacter: (data) => ipcRenderer.invoke('characters:export', data),
  importCharacter: () => ipcRenderer.invoke('characters:import'),
  openPath: (p) => ipcRenderer.invoke('shell:openPath', p),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings) => ipcRenderer.invoke('settings:set', settings),
});
