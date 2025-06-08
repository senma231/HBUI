// Global type definitions for the Homebrew UI application

// Package type definitions
export interface PackageInfo {
  name: string;
  version?: string;
  description?: string;
  homepage?: string;
  dependencies?: string[];
  dependents?: string[];
  size?: number;
  installDate?: Date;
  type: 'formula' | 'cask';
  installed: boolean;
  outdated?: boolean;
  pinned?: boolean;
}

export interface PackageTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface EnhancedPackage extends PackageInfo {
  tags: PackageTag[];
}

export interface SearchOptions {
  type?: 'all' | 'formula' | 'cask';
  sortBy?: 'name' | 'relevance' | 'downloads';
  includeDescriptions?: boolean;
}

export interface BrewResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: {
      // Basic operations
      brewSearch: (query: string, options?: SearchOptions) => Promise<BrewResponse<PackageInfo[]>>;
      brewList: () => Promise<BrewResponse<PackageInfo[]>>;
      brewInfo: (packageName: string) => Promise<BrewResponse<PackageInfo>>;
      brewInstall: (packageName: string) => Promise<BrewResponse<string>>;
      brewUninstall: (packageName: string) => Promise<BrewResponse<string>>;
      brewUpdate: () => Promise<BrewResponse<string>>;
      brewUpgrade: (packageName?: string) => Promise<BrewResponse<string>>;
      brewDoctor: () => Promise<BrewResponse<string>>;

      // Enhanced operations
      brewDeps: (packageName: string) => Promise<BrewResponse<string[]>>;
      brewUses: (packageName: string) => Promise<BrewResponse<string[]>>;
      brewOutdated: () => Promise<BrewResponse<PackageInfo[]>>;
      brewServices: () => Promise<BrewResponse<any[]>>;

      // Package management
      getPackageDetails: (packageName: string) => Promise<BrewResponse<PackageInfo>>;
      searchPackages: (query: string, options?: SearchOptions) => Promise<BrewResponse<PackageInfo[]>>;

      // Tag management
      getPackageTags: (packageName: string) => Promise<BrewResponse<PackageTag[]>>;
      addPackageTag: (packageName: string, tag: PackageTag) => Promise<BrewResponse<boolean>>;
      removePackageTag: (packageName: string, tagId: string) => Promise<BrewResponse<boolean>>;
      getAllTags: () => Promise<BrewResponse<PackageTag[]>>;
      createTag: (tag: Omit<PackageTag, 'id'>) => Promise<BrewResponse<PackageTag>>;
      deleteTag: (tagId: string) => Promise<BrewResponse<boolean>>;
    };
  }
}

export {};
