import React, { useState, useRef, useEffect } from 'react';
import { Palette, Moon, Sun, Monitor, Waves, Leaf, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themes: { mode: ThemeMode; icon: React.FC<any>; label: string; color: string }[] = [
  { mode: 'lime', icon: Leaf, label: 'Vert Lime', color: 'bg-[hsl(71,80%,52%)]' },
  { mode: 'dark', icon: Moon, label: 'Sombre', color: 'bg-[hsl(217,91%,60%)]' },
  { mode: 'middle', icon: Monitor, label: 'Medium', color: 'bg-[hsl(215,16%,45%)]' },
  { mode: 'light', icon: Sun, label: 'Clair', color: 'bg-[hsl(224,76%,40%)]' },
  { mode: 'ocean', icon: Waves, label: 'Océan', color: 'bg-[hsl(199,89%,48%)]' },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = themes.find(t => t.mode === theme) || themes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background-secondary px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        title="Changer le thème"
      >
        <CurrentIcon className="h-4 w-4" />
        <Palette className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-44 rounded-lg border border-border/50 backdrop-blur-xl bg-card/90 modal-shadow animate-scale-in">
          <div className="px-3 py-2 border-b border-border/50">
            <p className="text-xs font-semibold text-card-foreground">Thème</p>
          </div>
          <div className="py-1">
            {themes.map(({ mode, icon: Icon, label, color }) => (
              <button
                key={mode}
                onClick={() => { setTheme(mode); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  theme === mode
                    ? 'text-primary bg-primary/10'
                    : 'text-card-foreground hover:bg-muted'
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${color} shrink-0`} />
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {theme === mode && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
