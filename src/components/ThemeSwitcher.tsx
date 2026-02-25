import React from 'react';
import { Moon, Sun, Monitor, Waves, Leaf } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themes: { mode: ThemeMode; icon: React.FC<any>; label: string }[] = [
  { mode: 'dark', icon: Moon, label: 'Sombre' },
  { mode: 'middle', icon: Monitor, label: 'Medium' },
  { mode: 'light', icon: Sun, label: 'Clair' },
  { mode: 'ocean', icon: Waves, label: 'Océan' },
  { mode: 'lime', icon: Leaf, label: 'Lime' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border border-border bg-background-secondary p-0.5 gap-0.5">
      {themes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
            theme === mode
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
