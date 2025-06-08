import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PackageTag } from '../../types/global';
import './TagManager.css';

interface TagManagerProps {
  onClose: () => void;
  onTagsUpdated: () => void;
}

const TagManager: React.FC<TagManagerProps> = ({ onClose, onTagsUpdated }) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<PackageTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#007AFF');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedColors = [
    '#007AFF', '#34C759', '#FF3B30', '#FF9500',
    '#AF52DE', '#FF2D92', '#5AC8FA', '#FFCC00',
    '#8E8E93', '#00C7BE', '#30B0C7', '#32D74B'
  ];

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.getAllTags();
      if (result.success && result.data) {
        setTags(result.data);
      } else {
        setError(result.error || 'Failed to load tags');
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setLoading(true);
    try {
      const tagData = {
        name: newTagName.trim(),
        color: newTagColor,
        description: newTagDescription.trim() || undefined
      };

      const result = await window.electronAPI.createTag(tagData);
      if (result.success && result.data) {
        setTags(prev => [...prev, result.data]);
        setNewTagName('');
        setNewTagDescription('');
        setNewTagColor('#007AFF');
        onTagsUpdated();
      } else {
        setError(result.error || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      setError('Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    if (!confirm(t('confirm_delete_tag'))) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.deleteTag(tagId);
      if (result.success) {
        setTags(prev => prev.filter(tag => tag.id !== tagId));
        onTagsUpdated();
      } else {
        setError(result.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tag-manager-overlay" onClick={onClose}>
      <div className="tag-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tag-manager-header">
          <h2>{t('manage_tags')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="tag-manager-content">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="dismiss-error">×</button>
            </div>
          )}

          <div className="create-tag-section">
            <h3>{t('create_new_tag')}</h3>
            <div className="tag-form">
              <div className="form-row">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={t('tag_name')}
                  className="tag-name-input"
                  maxLength={20}
                />
                <div className="color-picker">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="color-input"
                  />
                  <div className="predefined-colors">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                placeholder={t('tag_description_optional')}
                className="tag-description-input"
                maxLength={100}
              />
              <button
                onClick={createTag}
                disabled={loading || !newTagName.trim()}
                className="create-tag-button"
              >
                {loading ? t('creating') : t('create_tag')}
              </button>
            </div>
          </div>

          <div className="existing-tags-section">
            <h3>{t('existing_tags')} ({tags.length})</h3>
            {loading && tags.length === 0 ? (
              <div className="loading-spinner">{t('loading')}</div>
            ) : (
              <div className="tags-list">
                {tags.length === 0 ? (
                  <div className="no-tags">{t('no_tags_created')}</div>
                ) : (
                  tags.map(tag => (
                    <div key={tag.id} className="tag-item">
                      <div className="tag-info">
                        <span 
                          className="tag-preview"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                        {tag.description && (
                          <span className="tag-description">{tag.description}</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="delete-tag-button"
                        disabled={loading}
                      >
                        {t('delete')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="tag-manager-footer">
          <button onClick={onClose} className="close-modal-button">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagManager;
