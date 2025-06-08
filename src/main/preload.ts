const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Basic Homebrew operations
  brewSearch: (query, options) => ipcRenderer.invoke('brew-search', query, options),
  brewList: () => ipcRenderer.invoke('brew-list'),
  brewInfo: (packageName) => ipcRenderer.invoke('brew-info', packageName),
  brewInstall: (packageName) => ipcRenderer.invoke('brew-install', packageName),
  brewUninstall: (packageName) => ipcRenderer.invoke('brew-uninstall', packageName),
  brewUpdate: () => ipcRenderer.invoke('brew-update'),
  brewUpgrade: (packageName) => ipcRenderer.invoke('brew-upgrade', packageName),
  brewDoctor: () => ipcRenderer.invoke('brew-doctor'),

  // Enhanced operations
  brewDeps: (packageName) => ipcRenderer.invoke('brew-deps', packageName),
  brewUses: (packageName) => ipcRenderer.invoke('brew-uses', packageName),
  brewOutdated: () => ipcRenderer.invoke('brew-outdated'),
  brewServices: () => ipcRenderer.invoke('brew-services'),

  // Package management
  getPackageDetails: (packageName) => ipcRenderer.invoke('get-package-details', packageName),
  searchPackages: (query, options) => ipcRenderer.invoke('brew-search', query, options),

  // Tag management (placeholder for future implementation)
  getPackageTags: (packageName) => ipcRenderer.invoke('get-package-tags', packageName),
  addPackageTag: (packageName, tag) => ipcRenderer.invoke('add-package-tag', packageName, tag),
  removePackageTag: (packageName, tagId) => ipcRenderer.invoke('remove-package-tag', packageName, tagId),
  getAllTags: () => ipcRenderer.invoke('get-all-tags'),
  createTag: (tag) => ipcRenderer.invoke('create-tag', tag),
  deleteTag: (tagId) => ipcRenderer.invoke('delete-tag', tagId),
});


