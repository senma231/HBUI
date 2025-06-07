// Mock Electron API for web demo
window.electronAPI = {
  brewSearch: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    return {
      success: true,
      data: [`${query}`, `${query}-dev`, `${query}-cli`, `lib${query}`, `${query}-tools`]
    };
  },
  brewList: async () => {
    return {
      success: true,
      data: ['git', 'node', 'python3', 'wget', 'curl', 'vim', 'htop']
    };
  },
  brewInfo: async (packageName) => {
    return {
      success: true,
      data: `${packageName}: A popular package\nVersion: 1.0.0\nDescription: Mock package info`
    };
  },
  brewInstall: async (packageName) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: `Successfully installed ${packageName}` };
  },
  brewUninstall: async (packageName) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: `Successfully uninstalled ${packageName}` };
  },
  brewUpdate: async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, data: 'Homebrew updated successfully' };
  },
  brewUpgrade: async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { success: true, data: 'All packages upgraded successfully' };
  },
  brewDoctor: async () => {
    return { success: true, data: 'Your system is ready to brew.' };
  }
};
