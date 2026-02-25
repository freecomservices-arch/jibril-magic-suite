import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'middle';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('jibril-theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('jibril-theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-middle');
    if (theme === 'dark') root.classList.add('theme-dark');
    else if (theme === 'middle') root.classList.add('theme-middle');
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
