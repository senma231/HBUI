import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CacheManager.css';

interface CacheInfo {
  downloads: {
    size: string;
    count: number;
    path: string;
  };
  cache: {
    size: string;
    count: number;
    path: string;
  };
  logs: {
    size: string;
    count: number;
    path: string;
  };
}

interface CacheManagerProps {
  onClose: () => void;
}

const CacheManager: React.FC<CacheManagerProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cleanupLoading, setCleanupLoading] = useState<string | null>(null);

  useEffect(() => {
    loadCacheInfo();
  }, []);

  const loadCacheInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: These commands would need to be implemented in the main process
      // For now, we'll simulate the cache information
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated cache data
      setCacheInfo({
        downloads: {
          size: '2.3 GB',
          count: 45,
          path: '/usr/local/var/homebrew/downloads'
        },
        cache: {
          size: '856 MB',
          count: 23,
          path: '/usr/local/var/homebrew/cache'
        },
        logs: {
          size: '124 MB',
          count: 156,
          path: '/usr/local/var/log'
        }
      });
    } catch (error) {
      console.error('Error loading cache info:', error);
      setError('Failed to load cache information');
    } finally {
      setLoading(false);
    }
  };

  const cleanupCache = async (type: 'downloads' | 'cache' | 'logs' | 'all') => {
    if (!confirm(t('confirm_cache_cleanup', { type: t(type) }))) {
      return;
    }

    setCleanupLoading(type);
    
    try {
      // Note: These commands would need to be implemented in the main process
      // brew cleanup --prune=all (for downloads and cache)
      // rm -rf /usr/local/var/log/* (for logs, with caution)
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload cache info after cleanup
      await loadCacheInfo();
    } catch (error) {
      console.error(`Error cleaning up ${type}:`, error);
      setError(`Failed to cleanup ${type}`);
    } finally {
      setCleanupLoading(null);
    }
  };

  const formatSize = (sizeStr: string) => {
    return sizeStr;
  };

  const getCacheTypeIcon = (type: string) => {
    switch (type) {
      case 'downloads':
        return '📥';
      case 'cache':
        return '🗄️';
      case 'logs':
        return '📋';
      default:
        return '📁';
    }
  };

  if (loading) {
    return (
      <div className="cache-manager-overlay">
        <div className="cache-manager-modal">
          <div className="cache-manager-header">
            <h2>{t('cache_manager')}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="cache-manager-content">
            <div className="loading-spinner">{t('loading_cache_info')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cache-manager-overlay" onClick={onClose}>
      <div className="cache-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cache-manager-header">
          <h2>{t('cache_manager')}</h2>
          <button onClick={loadCacheInfo} className="refresh-button" disabled={loading}>
            {t('refresh')}
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="cache-manager-content">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="dismiss-error">×</button>
            </div>
          )}

          {cacheInfo && (
            <>
              <div className="cache-overview">
                <h3>{t('cache_overview')}</h3>
                <div className="cache-summary">
                  <div className="summary-item">
                    <span className="summary-label">{t('total_cache_size')}:</span>
                    <span className="summary-value">
                      {/* Calculate total size - this would be done properly in real implementation */}
                      ~3.3 GB
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{t('total_files')}:</span>
                    <span className="summary-value">
                      {cacheInfo.downloads.count + cacheInfo.cache.count + cacheInfo.logs.count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cache-categories">
                <div className="cache-category">
                  <div className="category-header">
                    <span className="category-icon">{getCacheTypeIcon('downloads')}</span>
                    <div className="category-info">
                      <h4>{t('download_cache')}</h4>
                      <p className="category-description">{t('download_cache_description')}</p>
                    </div>
                  </div>
                  <div className="category-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('size')}:</span>
                      <span className="stat-value">{formatSize(cacheInfo.downloads.size)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('files')}:</span>
                      <span className="stat-value">{cacheInfo.downloads.count}</span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => cleanupCache('downloads')}
                      disabled={cleanupLoading === 'downloads'}
                      className="cleanup-btn"
                    >
                      {cleanupLoading === 'downloads' ? t('cleaning') : t('clean_downloads')}
                    </button>
                  </div>
                </div>

                <div className="cache-category">
                  <div className="category-header">
                    <span className="category-icon">{getCacheTypeIcon('cache')}</span>
                    <div className="category-info">
                      <h4>{t('build_cache')}</h4>
                      <p className="category-description">{t('build_cache_description')}</p>
                    </div>
                  </div>
                  <div className="category-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('size')}:</span>
                      <span className="stat-value">{formatSize(cacheInfo.cache.size)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('files')}:</span>
                      <span className="stat-value">{cacheInfo.cache.count}</span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => cleanupCache('cache')}
                      disabled={cleanupLoading === 'cache'}
                      className="cleanup-btn"
                    >
                      {cleanupLoading === 'cache' ? t('cleaning') : t('clean_cache')}
                    </button>
                  </div>
                </div>

                <div className="cache-category">
                  <div className="category-header">
                    <span className="category-icon">{getCacheTypeIcon('logs')}</span>
                    <div className="category-info">
                      <h4>{t('log_files')}</h4>
                      <p className="category-description">{t('log_files_description')}</p>
                    </div>
                  </div>
                  <div className="category-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('size')}:</span>
                      <span className="stat-value">{formatSize(cacheInfo.logs.size)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('files')}:</span>
                      <span className="stat-value">{cacheInfo.logs.count}</span>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => cleanupCache('logs')}
                      disabled={cleanupLoading === 'logs'}
                      className="cleanup-btn warning"
                    >
                      {cleanupLoading === 'logs' ? t('cleaning') : t('clean_logs')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bulk-actions">
                <button
                  onClick={() => cleanupCache('all')}
                  disabled={cleanupLoading === 'all'}
                  className="cleanup-all-btn"
                >
                  {cleanupLoading === 'all' ? t('cleaning_all') : t('clean_all_cache')}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="cache-manager-footer">
          <div className="warning-text">
            <p>{t('cache_cleanup_warning')}</p>
          </div>
          <button onClick={onClose} className="close-modal-button">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheManager;
