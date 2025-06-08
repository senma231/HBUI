import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ServiceManager.css';

interface HomebrewService {
  name: string;
  status: string;
  user: string;
  plist: string;
}

interface ServiceManagerProps {
  onClose: () => void;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [services, setServices] = useState<HomebrewService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await window.electronAPI.brewServices();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        setError(result.error || 'Failed to load services');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const executeServiceCommand = async (serviceName: string, action: 'start' | 'stop' | 'restart') => {
    setOperationLoading(`${serviceName}-${action}`);
    
    try {
      // Note: These commands would need to be implemented in the main process
      const command = `brew services ${action} ${serviceName}`;
      // For now, we'll simulate the operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload services after operation
      await loadServices();
    } catch (error) {
      console.error(`Error ${action}ing service ${serviceName}:`, error);
      setError(`Failed to ${action} service ${serviceName}`);
    } finally {
      setOperationLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'started':
      case 'running':
        return '#34C759';
      case 'stopped':
      case 'none':
        return '#FF3B30';
      case 'error':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'started':
        return t('service_running');
      case 'stopped':
      case 'none':
        return t('service_stopped');
      case 'error':
        return t('service_error');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="service-manager-overlay">
        <div className="service-manager-modal">
          <div className="service-manager-header">
            <h2>{t('service_manager')}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="service-manager-content">
            <div className="loading-spinner">{t('loading_services')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-manager-overlay" onClick={onClose}>
      <div className="service-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="service-manager-header">
          <h2>{t('service_manager')}</h2>
          <button onClick={loadServices} className="refresh-button" disabled={loading}>
            {t('refresh')}
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="service-manager-content">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="dismiss-error">×</button>
            </div>
          )}

          {services.length === 0 ? (
            <div className="no-services">
              <p>{t('no_services_found')}</p>
              <p className="suggestion">{t('install_services_suggestion')}</p>
            </div>
          ) : (
            <div className="services-list">
              <div className="services-header">
                <span className="service-name-header">{t('service_name')}</span>
                <span className="service-status-header">{t('service_status')}</span>
                <span className="service-actions-header">{t('actions')}</span>
              </div>
              
              {services.map((service) => (
                <div key={service.name} className="service-item">
                  <div className="service-info">
                    <span className="service-name">{service.name}</span>
                    <span className="service-user">{service.user && `(${service.user})`}</span>
                  </div>
                  
                  <div className="service-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    />
                    <span className="status-text">{getStatusText(service.status)}</span>
                  </div>
                  
                  <div className="service-actions">
                    {service.status.toLowerCase() === 'started' ? (
                      <>
                        <button
                          onClick={() => executeServiceCommand(service.name, 'stop')}
                          disabled={operationLoading === `${service.name}-stop`}
                          className="service-action-btn stop-btn"
                        >
                          {operationLoading === `${service.name}-stop` ? t('stopping') : t('stop')}
                        </button>
                        <button
                          onClick={() => executeServiceCommand(service.name, 'restart')}
                          disabled={operationLoading === `${service.name}-restart`}
                          className="service-action-btn restart-btn"
                        >
                          {operationLoading === `${service.name}-restart` ? t('restarting') : t('restart')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => executeServiceCommand(service.name, 'start')}
                        disabled={operationLoading === `${service.name}-start`}
                        className="service-action-btn start-btn"
                      >
                        {operationLoading === `${service.name}-start` ? t('starting') : t('start')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="service-manager-footer">
          <div className="service-info-text">
            <p>{t('service_manager_info')}</p>
          </div>
          <button onClick={onClose} className="close-modal-button">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;
