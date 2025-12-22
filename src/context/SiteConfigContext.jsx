import React, { createContext, useContext, useState, useEffect } from 'react';
import piml from 'piml';

const SiteConfigContext = createContext();

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/site-config.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          setConfig(parsed.config);
        }
      } catch (error) {
        console.error('Failed to load site config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
};
