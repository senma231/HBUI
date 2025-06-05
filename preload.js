const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Homebrew operations
  brewSearch: (query) => ipcRenderer.invoke('brew-search', query),
  brewList: () => ipcRenderer.invoke('brew-list'),
  brewInfo: (packageName) => ipcRenderer.invoke('brew-info', packageName),
  brewInstall: (packageName) => ipcRenderer.invoke('brew-install', packageName),
  brewUninstall: (packageName) => ipcRenderer.invoke('brew-uninstall', packageName),
  brewUpdate: () => ipcRenderer.invoke('brew-update'),
  brewUpgrade: (packageName) => ipcRenderer.invoke('brew-upgrade', packageName),
  brewDoctor: () => ipcRenderer.invoke('brew-doctor'),
});
