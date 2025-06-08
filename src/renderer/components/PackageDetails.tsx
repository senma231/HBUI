import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PackageInfo } from '../../types/global';
import './PackageDetails.css';

interface PackageDetailsProps {
  packageName: string;
  onClose: () => void;
  onInstall?: (packageName: string) => void;
  onUninstall?: (packageName: string) => void;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({
  packageName,
  onClose,
  onInstall,
  onUninstall
}) => {
  const { t } = useTranslation();
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [dependents, setDependents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackageDetails();
  }, [packageName]);

  const loadPackageDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get package details
      const detailsResult = await window.electronAPI.getPackageDetails(packageName);
      if (detailsResult.success && detailsResult.data) {
        setPackageInfo(detailsResult.data);
      } else {
        setError(detailsResult.error || 'Failed to load package details');
      }

      // Get dependencies
      const depsResult = await window.electronAPI.brewDeps(packageName);
      if (depsResult.success && depsResult.data) {
        setDependencies(depsResult.data);
      }

      // Get dependents
      const usesResult = await window.electronAPI.brewUses(packageName);
      if (usesResult.success && usesResult.data) {
        setDependents(usesResult.data);
      }
    } catch (error) {
      console.error('Error loading package details:', error);
      setError('Failed to load package information');
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = () => {
    if (onInstall && packageInfo) {
      onInstall(packageInfo.name);
    }
  };

  const handleUninstall = () => {
    if (onUninstall && packageInfo) {
      onUninstall(packageInfo.name);
    }
  };

  if (loading) {
    return (
      <div className="package-details-overlay">
        <div className="package-details-modal">
          <div className="package-details-header">
            <h2>{t('loading')}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="package-details-content">
            <div className="loading-spinner">
              {t('loading_package_details')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-details-overlay">
        <div className="package-details-modal">
          <div className="package-details-header">
            <h2>{t('error')}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="package-details-content">
            <div className="error-message">
              {error}
            </div>
            <button onClick={loadPackageDetails} className="retry-button">
              {t('retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!packageInfo) {
    return null;
  }

  return (
    <div className="package-details-overlay" onClick={onClose}>
      <div className="package-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="package-details-header">
          <div className="package-title">
            <h2>{packageInfo.name}</h2>
            <span className={`package-type ${packageInfo.type}`}>
              {packageInfo.type}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="package-details-content">
          <div className="package-info-section">
            <div className="package-meta">
              {packageInfo.version && (
                <div className="meta-item">
                  <strong>{t('version')}:</strong> {packageInfo.version}
                </div>
              )}
              <div className="meta-item">
                <strong>{t('status')}:</strong>
                <span className={`status ${packageInfo.installed ? 'installed' : 'not-installed'}`}>
                  {packageInfo.installed ? t('installed') : t('not_installed')}
                </span>
              </div>
              {packageInfo.outdated && (
                <div className="meta-item">
                  <span className="status outdated">{t('outdated')}</span>
                </div>
              )}
            </div>

            {packageInfo.description && (
              <div className="description-section">
                <h3>{t('description')}</h3>
                <p>{packageInfo.description}</p>
              </div>
            )}

            {packageInfo.homepage && (
              <div className="homepage-section">
                <h3>{t('homepage')}</h3>
                <a href={packageInfo.homepage} target="_blank" rel="noopener noreferrer">
                  {packageInfo.homepage}
                </a>
              </div>
            )}

            {dependencies.length > 0 && (
              <div className="dependencies-section">
                <h3>{t('dependencies')}</h3>
                <div className="dependency-list">
                  {dependencies.map((dep, index) => (
                    <span key={index} className="dependency-item">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {dependents.length > 0 && (
              <div className="dependents-section">
                <h3>{t('used_by')}</h3>
                <div className="dependent-list">
                  {dependents.map((dep, index) => (
                    <span key={index} className="dependent-item">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="package-actions">
            {packageInfo.installed ? (
              <button 
                onClick={handleUninstall}
                className="action-button uninstall-button"
              >
                {t('uninstall')}
              </button>
            ) : (
              <button 
                onClick={handleInstall}
                className="action-button install-button"
              >
                {t('install')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
