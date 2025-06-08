import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PackageInfo, PackageTag } from '../../types/global';
import './BatchOperations.css';

interface BatchOperationsProps {
  selectedPackages: PackageInfo[];
  availableTags: PackageTag[];
  onBatchInstall: (packages: string[]) => void;
  onBatchUninstall: (packages: string[]) => void;
  onBatchTag: (packages: string[], tag: PackageTag) => void;
  onClearSelection: () => void;
  onClose: () => void;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({
  selectedPackages,
  availableTags,
  onBatchInstall,
  onBatchUninstall,
  onBatchTag,
  onClearSelection,
  onClose
}) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<PackageTag | null>(null);
  const [loading, setLoading] = useState(false);

  const installedPackages = selectedPackages.filter(pkg => pkg.installed);
  const notInstalledPackages = selectedPackages.filter(pkg => !pkg.installed);

  const handleBatchInstall = async () => {
    if (notInstalledPackages.length === 0) return;
    
    setLoading(true);
    try {
      const packageNames = notInstalledPackages.map(pkg => pkg.name);
      await onBatchInstall(packageNames);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchUninstall = async () => {
    if (installedPackages.length === 0) return;
    
    if (!confirm(t('confirm_batch_uninstall', { count: installedPackages.length }))) {
      return;
    }
    
    setLoading(true);
    try {
      const packageNames = installedPackages.map(pkg => pkg.name);
      await onBatchUninstall(packageNames);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchTag = async () => {
    if (!selectedTag || selectedPackages.length === 0) return;
    
    setLoading(true);
    try {
      const packageNames = selectedPackages.map(pkg => pkg.name);
      await onBatchTag(packageNames, selectedTag);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="batch-operations-overlay" onClick={onClose}>
      <div className="batch-operations-modal" onClick={(e) => e.stopPropagation()}>
        <div className="batch-operations-header">
          <h3>{t('batch_operations')}</h3>
          <span className="selected-count">
            {t('selected_packages', { count: selectedPackages.length })}
          </span>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="batch-operations-content">
          <div className="selected-packages-summary">
            <div className="summary-item">
              <span className="summary-label">{t('total_selected')}:</span>
              <span className="summary-value">{selectedPackages.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('installed')}:</span>
              <span className="summary-value">{installedPackages.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('not_installed')}:</span>
              <span className="summary-value">{notInstalledPackages.length}</span>
            </div>
          </div>

          <div className="batch-actions-section">
            <h4>{t('installation_actions')}</h4>
            <div className="action-buttons">
              <button
                onClick={handleBatchInstall}
                disabled={loading || notInstalledPackages.length === 0}
                className="batch-install-btn"
              >
                {loading ? t('installing') : t('install_selected', { count: notInstalledPackages.length })}
              </button>
              <button
                onClick={handleBatchUninstall}
                disabled={loading || installedPackages.length === 0}
                className="batch-uninstall-btn"
              >
                {loading ? t('uninstalling') : t('uninstall_selected', { count: installedPackages.length })}
              </button>
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className="batch-tagging-section">
              <h4>{t('tagging_actions')}</h4>
              <div className="tag-selection">
                <select
                  value={selectedTag?.id || ''}
                  onChange={(e) => {
                    const tag = availableTags.find(t => t.id === e.target.value);
                    setSelectedTag(tag || null);
                  }}
                  className="tag-selector"
                >
                  <option value="">{t('select_tag')}</option>
                  {availableTags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBatchTag}
                  disabled={loading || !selectedTag || selectedPackages.length === 0}
                  className="batch-tag-btn"
                >
                  {loading ? t('tagging') : t('add_tag_to_selected')}
                </button>
              </div>
            </div>
          )}

          <div className="selected-packages-list">
            <h4>{t('selected_packages_list')}</h4>
            <div className="packages-grid">
              {selectedPackages.map(pkg => (
                <div key={pkg.name} className="selected-package-item">
                  <span className="package-name">{pkg.name}</span>
                  <span className={`package-status ${pkg.installed ? 'installed' : 'not-installed'}`}>
                    {pkg.installed ? t('installed') : t('not_installed')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="batch-operations-footer">
          <button onClick={onClearSelection} className="clear-selection-btn">
            {t('clear_selection')}
          </button>
          <button onClick={onClose} className="close-modal-btn">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchOperations;
