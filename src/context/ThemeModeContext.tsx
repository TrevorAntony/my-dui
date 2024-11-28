import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeModeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);
interface ThemeModeProviderProps {
  children: React.ReactNode;
}

export const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({ children }) => {
  const getPreferredMode = (): ThemeMode => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('flowbite-theme-mode') as ThemeMode;
    return savedMode || getPreferredMode();
  });

  const updateTheme = useCallback((newMode: ThemeMode) => {
    localStorage.setItem('flowbite-theme-mode', newMode);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newMode);
    setMode(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    updateTheme(newMode);
  }, [mode, updateTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Initial theme sync
    updateTheme(mode);

    const handleChange = (event: MediaQueryListEvent) => {
      const newMode = event.matches ? 'dark' : 'light';
      requestAnimationFrame(() => {
        updateTheme(newMode);
      });
    };

    const checkThemeSync = () => {
      const storedMode = localStorage.getItem('flowbite-theme-mode') as ThemeMode;
      const systemMode = getPreferredMode();
      if (storedMode && storedMode !== systemMode) {
        updateTheme(systemMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    document.addEventListener('visibilitychange', checkThemeSync);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      document.removeEventListener('visibilitychange', checkThemeSync);
    };
  }, [mode, updateTheme]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode: updateTheme, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextType => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};