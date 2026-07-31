import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_WEBSITE_CONFIG } from '../lib/defaultData';
import { api } from '../lib/api';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [websites, setWebsites] = useState([]);
  const [activeConfig, setActiveConfig] = useState(DEFAULT_WEBSITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default logged in for easy admin dashboard access

  const refreshWebsites = async () => {
    setLoading(true);
    try {
      const list = await api.getAllWebsites();
      setWebsites(list);
    } catch (e) {
      console.error('Failed to load websites:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWebsites();
  }, []);

  const saveWebsite = async (config) => {
    const saved = await api.saveWebsite(config);
    await refreshWebsites();
    return saved;
  };

  const deleteWebsite = async (id) => {
    await api.deleteWebsite(id);
    await refreshWebsites();
  };

  const duplicateWebsite = async (config) => {
    const newConfig = {
      ...config,
      id: '',
      title: `${config.title || config.girlfriendName} (Copy)`,
      slug: `${config.slug}-copy-${Date.now().toString(36)}`,
      girlfriendName: `${config.girlfriendName}`
    };
    return await saveWebsite(newConfig);
  };

  return (
    <StoreContext.Provider value={{
      websites,
      activeConfig,
      setActiveConfig,
      loading,
      refreshWebsites,
      saveWebsite,
      deleteWebsite,
      duplicateWebsite,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
