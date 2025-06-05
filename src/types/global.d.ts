// Global type definitions for the Homebrew UI application

declare global {
  interface Window {
    electronAPI: {
      brewSearch: (query: string) => Promise<{ success: boolean; data?: string[]; error?: string }>;
      brewList: () => Promise<{ success: boolean; data?: string[]; error?: string }>;
      brewInfo: (packageName: string) => Promise<{ success: boolean; data?: string; error?: string }>;
      brewInstall: (packageName: string) => Promise<{ success: boolean; data?: string; error?: string }>;
      brewUninstall: (packageName: string) => Promise<{ success: boolean; data?: string; error?: string }>;
      brewUpdate: () => Promise<{ success: boolean; data?: string; error?: string }>;
      brewUpgrade: (packageName?: string) => Promise<{ success: boolean; data?: string; error?: string }>;
      brewDoctor: () => Promise<{ success: boolean; data?: string; error?: string }>;
    };
  }
}

export {};
