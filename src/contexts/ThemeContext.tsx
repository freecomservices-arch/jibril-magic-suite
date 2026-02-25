import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'middle' | 'ocean' | 'lime';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeClasses: Record<ThemeMode, string> = {
  light: '',
  dark: 'theme-dark',
  middle: 'theme-middle',
  ocean: 'theme-ocean',
  lime: 'theme-lime',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('jibril-theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('jibril-theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-middle', 'theme-ocean', 'theme-lime');
    const cls = themeClasses[theme];
    if (cls) root.classList.add(cls);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
