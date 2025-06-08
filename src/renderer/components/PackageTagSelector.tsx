import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PackageTag } from '../../types/global';
import './PackageTagSelector.css';

interface PackageTagSelectorProps {
  packageName: string;
  onClose: () => void;
  onTagsUpdated: () => void;
}

const PackageTagSelector: React.FC<PackageTagSelectorProps> = ({
  packageName,
  onClose,
  onTagsUpdated
}) => {
  const { t } = useTranslation();
  const [allTags, setAllTags] = useState<PackageTag[]>([]);
  const [packageTags, setPackageTags] = useState<PackageTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, [packageName]);

  const loadTags = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all available tags
      const allTagsResult = await window.electronAPI.getAllTags();
      if (allTagsResult.success && allTagsResult.data) {
        setAllTags(allTagsResult.data);
      }

      // Load current package tags
      const packageTagsResult = await window.electronAPI.getPackageTags(packageName);
      if (packageTagsResult.success && packageTagsResult.data) {
        setPackageTags(packageTagsResult.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = async (tag: PackageTag) => {
    const isCurrentlyTagged = packageTags.some(pt => pt.id === tag.id);
    
    try {
      if (isCurrentlyTagged) {
        // Remove tag
        const result = await window.electronAPI.removePackageTag(packageName, tag.id);
        if (result.success) {
          setPackageTags(prev => prev.filter(pt => pt.id !== tag.id));
          onTagsUpdated();
        } else {
          setError(result.error || 'Failed to remove tag');
        }
      } else {
        // Add tag
        const result = await window.electronAPI.addPackageTag(packageName, tag);
        if (result.success) {
          setPackageTags(prev => [...prev, tag]);
          onTagsUpdated();
        } else {
          setError(result.error || 'Failed to add tag');
        }
      }
    } catch (error) {
      console.error('Error toggling tag:', error);
      setError('Failed to update tag');
    }
  };

  if (loading) {
    return (
      <div className="tag-selector-overlay">
        <div className="tag-selector-modal">
          <div className="tag-selector-header">
            <h3>{t('manage_package_tags')}</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="tag-selector-content">
            <div className="loading-spinner">{t('loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tag-selector-overlay" onClick={onClose}>
      <div className="tag-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tag-selector-header">
          <div className="header-info">
            <h3>{t('manage_package_tags')}</h3>
            <span className="package-name">{packageName}</span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="tag-selector-content">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="dismiss-error">×</button>
            </div>
          )}

          {allTags.length === 0 ? (
            <div className="no-tags-available">
              <p>{t('no_tags_available')}</p>
              <p className="suggestion">{t('create_tags_first')}</p>
            </div>
          ) : (
            <div className="tags-grid">
              {allTags.map(tag => {
                const isSelected = packageTags.some(pt => pt.id === tag.id);
                return (
                  <div
                    key={tag.id}
                    className={`tag-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    <span 
                      className="tag-color"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="tag-name">{tag.name}</span>
                    {tag.description && (
                      <span className="tag-description">{tag.description}</span>
                    )}
                    <div className="tag-checkbox">
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {packageTags.length > 0 && (
            <div className="current-tags-section">
              <h4>{t('current_tags')}:</h4>
              <div className="current-tags">
                {packageTags.map(tag => (
                  <span
                    key={tag.id}
                    className="current-tag"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tag-selector-footer">
          <button onClick={onClose} className="done-button">
            {t('done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageTagSelector;
