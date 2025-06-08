import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import { PackageInfo, SearchOptions, BrewResponse, PackageTag } from '../types/global';
import PackageDetails from './components/PackageDetails';
import TagManager from './components/TagManager';
import PackageTagSelector from './components/PackageTagSelector';
import BatchOperations from './components/BatchOperations';
import ServiceManager from './components/ServiceManager';
import CacheManager from './components/CacheManager';

// Legacy interface for backward compatibility
interface Package {
  name: string;
  installed: boolean;
  description?: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [installedPackages, setInstalledPackages] = useState<PackageInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'installed' | 'maintenance'>('search');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'all' | 'formula' | 'cask'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState<string | null>(null);
  const [packageTags, setPackageTags] = useState<Map<string, PackageTag[]>>(new Map());
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [availableTags, setAvailableTags] = useState<PackageTag[]>([]);
  const [showServiceManager, setShowServiceManager] = useState(false);
  const [showCacheManager, setShowCacheManager] = useState(false);

  // Load installed packages on component mount
  useEffect(() => {
    loadInstalledPackages();
    loadSearchHistory();
    loadPackageTags();
    loadAvailableTags();
  }, []);

  const loadInstalledPackages = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewList();
      if (result.success && result.data) {
        setInstalledPackages(result.data);
      }
    } catch (error) {
      console.error('Failed to load installed packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const saveSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const loadPackageTags = async () => {
    try {
      // Load tags for all packages (we'll optimize this later)
      const allPackages = [...packages, ...installedPackages];
      const tagsMap = new Map<string, PackageTag[]>();

      for (const pkg of allPackages) {
        const result = await window.electronAPI.getPackageTags(pkg.name);
        if (result.success && result.data) {
          tagsMap.set(pkg.name, result.data);
        }
      }

      setPackageTags(tagsMap);
    } catch (error) {
      console.error('Error loading package tags:', error);
    }
  };

  const refreshPackageTags = () => {
    loadPackageTags();
  };

  const loadAvailableTags = async () => {
    try {
      const result = await window.electronAPI.getAllTags();
      if (result.success && result.data) {
        setAvailableTags(result.data);
      }
    } catch (error) {
      console.error('Error loading available tags:', error);
    }
  };

  const togglePackageSelection = (packageName: string) => {
    setSelectedPackages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(packageName)) {
        newSelection.delete(packageName);
      } else {
        newSelection.add(packageName);
      }
      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedPackages(new Set());
  };

  const getSelectedPackageObjects = (): PackageInfo[] => {
    const allPackages = [...packages, ...installedPackages];
    return allPackages.filter(pkg => selectedPackages.has(pkg.name));
  };

  const handleBatchInstall = async (packageNames: string[]) => {
    for (const packageName of packageNames) {
      try {
        await installPackage(packageName);
      } catch (error) {
        console.error(`Failed to install ${packageName}:`, error);
      }
    }
    clearSelection();
    setShowBatchOperations(false);
  };

  const handleBatchUninstall = async (packageNames: string[]) => {
    for (const packageName of packageNames) {
      try {
        await uninstallPackage(packageName);
      } catch (error) {
        console.error(`Failed to uninstall ${packageName}:`, error);
      }
    }
    clearSelection();
    setShowBatchOperations(false);
  };

  const handleBatchTag = async (packageNames: string[], tag: PackageTag) => {
    for (const packageName of packageNames) {
      try {
        await window.electronAPI.addPackageTag(packageName, tag);
      } catch (error) {
        console.error(`Failed to tag ${packageName}:`, error);
      }
    }
    refreshPackageTags();
    setShowBatchOperations(false);
  };

  const searchPackages = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchOptions: SearchOptions = {
        type: searchType === 'all' ? undefined : searchType,
        includeDescriptions: true
      };

      const result = await window.electronAPI.searchPackages(searchQuery, searchOptions);
      if (result.success && result.data) {
        // Mark packages as installed if they exist in installedPackages
        const packageList = result.data.map(pkg => ({
          ...pkg,
          installed: installedPackages.some(installed => installed.name === pkg.name)
        }));
        setPackages(packageList);
        saveSearchHistory(searchQuery);
      }
    } catch (error) {
      console.error('Failed to search packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const installPackage = async (packageName: string) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewInstall(packageName);
      if (result.success) {
        await loadInstalledPackages();
        // Update the package list to reflect installation
        setPackages(prev => prev.map(pkg =>
          pkg.name === packageName ? { ...pkg, installed: true } : pkg
        ));
        // Close package details if open
        if (selectedPackage === packageName) {
          setSelectedPackage(null);
        }
      } else {
        alert(`${t('install_failed')}: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to install package:', error);
      alert(`${t('install_failed')}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const uninstallPackage = async (packageName: string) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewUninstall(packageName);
      if (result.success) {
        await loadInstalledPackages();
        // Update the package list to reflect uninstallation
        setPackages(prev => prev.map(pkg =>
          pkg.name === packageName ? { ...pkg, installed: false } : pkg
        ));
        // Close package details if open
        if (selectedPackage === packageName) {
          setSelectedPackage(null);
        }
      } else {
        alert(`${t('uninstall_failed')}: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to uninstall package:', error);
      alert(`${t('uninstall_failed')}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateHomebrew = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewUpdate();
      if (result.success) {
        alert(t('update_success'));
      } else {
        alert(`${t('update_failed')}: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to update Homebrew:', error);
      alert(`${t('update_failed')}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const upgradePackages = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewUpgrade();
      if (result.success) {
        alert(t('upgrade_success'));
        await loadInstalledPackages();
      } else {
        alert(`${t('upgrade_failed')}: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to upgrade packages:', error);
      alert(`${t('upgrade_failed')}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const runDoctor = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.brewDoctor();
      if (result.success) {
        alert(`${t('doctor_result')}:\n${result.data}`);
      } else {
        alert(`${t('doctor_failed')}: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to run brew doctor:', error);
      alert(`${t('doctor_failed')}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app_title')}</h1>
        <div className="language-selector">
          <button onClick={() => changeLanguage('zh-CN')}>简体中文</button>
          <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
          <button onClick={() => changeLanguage('en')}>English</button>
        </div>
      </header>

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          {t('search_packages')}
        </button>
        <button 
          className={activeTab === 'installed' ? 'active' : ''}
          onClick={() => setActiveTab('installed')}
        >
          {t('installed_packages')}
        </button>
        <button 
          className={activeTab === 'maintenance' ? 'active' : ''}
          onClick={() => setActiveTab('maintenance')}
        >
          {t('maintenance')}
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'search' && (
          <div className="search-tab">
            <div className="search-controls">
              <div className="search-bar">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  onKeyPress={(e) => e.key === 'Enter' && searchPackages()}
                />
                <button onClick={searchPackages} disabled={loading}>
                  {loading ? t('searching') : t('search')}
                </button>
              </div>

              <div className="search-filters">
                <div className="search-type-selector">
                  <label>{t('search_type')}:</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'all' | 'formula' | 'cask')}
                  >
                    <option value="all">{t('search_type_all')}</option>
                    <option value="formula">{t('search_type_formula')}</option>
                    <option value="cask">{t('search_type_cask')}</option>
                  </select>
                </div>
              </div>

              {searchHistory.length > 0 && (
                <div className="search-history">
                  <label>{t('recent_searches')}:</label>
                  <div className="history-items">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        className="history-item"
                        onClick={() => {
                          setSearchQuery(query);
                          searchPackages();
                        }}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedPackages.size > 0 && (
              <div className="batch-selection-bar">
                <span className="selection-count">
                  {t('selected_packages', { count: selectedPackages.size })}
                </span>
                <div className="batch-actions">
                  <button
                    onClick={() => setShowBatchOperations(true)}
                    className="batch-operations-btn"
                  >
                    {t('batch_operations')}
                  </button>
                  <button
                    onClick={clearSelection}
                    className="clear-selection-btn"
                  >
                    {t('clear_selection')}
                  </button>
                </div>
              </div>
            )}

            <div className="package-list">
              {packages.map((pkg) => (
                <div key={pkg.name} className={`package-item enhanced ${selectedPackages.has(pkg.name) ? 'selected' : ''}`}>
                  <div className="package-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPackages.has(pkg.name)}
                      onChange={() => togglePackageSelection(pkg.name)}
                    />
                  </div>
                  <div className="package-info">
                    <div className="package-header">
                      <span className="package-name" onClick={() => setSelectedPackage(pkg.name)}>
                        {pkg.name}
                      </span>
                      <span className={`package-type ${pkg.type}`}>
                        {pkg.type}
                      </span>
                      {pkg.installed && <span className="installed-badge">{t('installed')}</span>}
                    </div>
                    {pkg.description && (
                      <p className="package-description">{pkg.description}</p>
                    )}
                  </div>
                  <div className="package-actions">
                    <button
                      onClick={() => setSelectedPackage(pkg.name)}
                      className="details-btn"
                    >
                      {t('details')}
                    </button>
                    <button
                      onClick={() => setShowTagSelector(pkg.name)}
                      className="tags-btn"
                    >
                      {t('tags')}
                    </button>
                    {pkg.installed ? (
                      <button
                        onClick={() => uninstallPackage(pkg.name)}
                        disabled={loading}
                        className="uninstall-btn"
                      >
                        {t('uninstall')}
                      </button>
                    ) : (
                      <button
                        onClick={() => installPackage(pkg.name)}
                        disabled={loading}
                        className="install-btn"
                      >
                        {t('install')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'installed' && (
          <div className="installed-tab">
            <div className="tab-header">
              <h2>{t('installed_packages')} ({installedPackages.length})</h2>
              <button onClick={loadInstalledPackages} disabled={loading}>
                {t('refresh')}
              </button>
            </div>

            <div className="package-list">
              {installedPackages.map((pkg) => (
                <div key={pkg.name} className={`package-item enhanced ${selectedPackages.has(pkg.name) ? 'selected' : ''}`}>
                  <div className="package-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPackages.has(pkg.name)}
                      onChange={() => togglePackageSelection(pkg.name)}
                    />
                  </div>
                  <div className="package-info">
                    <div className="package-header">
                      <span className="package-name" onClick={() => setSelectedPackage(pkg.name)}>
                        {pkg.name}
                      </span>
                      <span className={`package-type ${pkg.type}`}>
                        {pkg.type}
                      </span>
                      <span className="installed-badge">{t('installed')}</span>
                      {pkg.version && (
                        <span className="version-badge">v{pkg.version}</span>
                      )}
                    </div>
                    {pkg.description && (
                      <p className="package-description">{pkg.description}</p>
                    )}
                  </div>
                  <div className="package-actions">
                    <button
                      onClick={() => setSelectedPackage(pkg.name)}
                      className="details-btn"
                    >
                      {t('details')}
                    </button>
                    <button
                      onClick={() => setShowTagSelector(pkg.name)}
                      className="tags-btn"
                    >
                      {t('tags')}
                    </button>
                    <button
                      onClick={() => uninstallPackage(pkg.name)}
                      disabled={loading}
                      className="uninstall-btn"
                    >
                      {t('uninstall')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-tab">
            <h2>{t('maintenance')}</h2>
            <div className="maintenance-actions">
              <button onClick={updateHomebrew} disabled={loading}>
                {t('update_homebrew')}
              </button>
              <button onClick={upgradePackages} disabled={loading}>
                {t('upgrade_packages')}
              </button>
              <button onClick={runDoctor} disabled={loading}>
                {t('run_doctor')}
              </button>
              <button onClick={() => setShowTagManager(true)} disabled={loading}>
                {t('manage_tags')}
              </button>
              <button onClick={() => setShowServiceManager(true)} disabled={loading}>
                {t('service_manager')}
              </button>
              <button onClick={() => setShowCacheManager(true)} disabled={loading}>
                {t('cache_manager')}
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedPackage && (
        <PackageDetails
          packageName={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onInstall={installPackage}
          onUninstall={uninstallPackage}
        />
      )}

      {showTagManager && (
        <TagManager
          onClose={() => setShowTagManager(false)}
          onTagsUpdated={refreshPackageTags}
        />
      )}

      {showTagSelector && (
        <PackageTagSelector
          packageName={showTagSelector}
          onClose={() => setShowTagSelector(null)}
          onTagsUpdated={refreshPackageTags}
        />
      )}

      {showBatchOperations && (
        <BatchOperations
          selectedPackages={getSelectedPackageObjects()}
          availableTags={availableTags}
          onBatchInstall={handleBatchInstall}
          onBatchUninstall={handleBatchUninstall}
          onBatchTag={handleBatchTag}
          onClearSelection={clearSelection}
          onClose={() => setShowBatchOperations(false)}
        />
      )}

      {showServiceManager && (
        <ServiceManager
          onClose={() => setShowServiceManager(false)}
        />
      )}

      {showCacheManager && (
        <CacheManager
          onClose={() => setShowCacheManager(false)}
        />
      )}
    </div>
  );
};

export default App;
