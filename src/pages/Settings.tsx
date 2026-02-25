import React from 'react';
import PageTransition from '@/components/PageTransition';
import { Settings, Moon, Sun, Monitor, Waves, Leaf, Bell, Globe, Download, Lock, User, Palette } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import AvatarInitials from '@/components/AvatarInitials';

const themes: { mode: ThemeMode; icon: React.FC<any>; label: string; desc: string }[] = [
  { mode: 'lime', icon: Leaf, label: 'Vert Lime', desc: 'Charcoal & lime — audacieux et moderne' },
  { mode: 'dark', icon: Moon, label: 'Mode Sombre', desc: 'Bleu nuit profond — confortable' },
  { mode: 'middle', icon: Monitor, label: 'Mode Medium', desc: 'Gris ardoise — équilibre parfait' },
  { mode: 'light', icon: Sun, label: 'Mode Clair', desc: 'Blanc perle — lumineux et pro' },
  { mode: 'ocean', icon: Waves, label: 'Bleu Océan', desc: 'Bleu profond — immersif' },
];

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <PageTransition>
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Paramètres
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personnalisez votre expérience</p>
      </div>

      {/* Profile */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-primary" /> Profil
        </h2>
        <div className="flex items-center gap-4">
          <AvatarInitials name={user?.name || 'U'} size="lg" />
          <div>
            <p className="text-lg font-semibold text-card-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role} • {user?.phone}</p>
          </div>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-primary" /> Thème d'affichage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map(t => (
            <button
              key={t.mode}
              onClick={() => setTheme(t.mode)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                theme === t.mode ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <t.icon className={`h-5 w-5 ${theme === t.mode ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-semibold text-card-foreground">{t.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Other Settings */}
      {[
        { icon: Bell, title: 'Notifications', desc: 'Push in-app, email et WhatsApp' },
        { icon: Globe, title: 'Langue', desc: 'Français (interface) — Arabe (annonces)' },
        { icon: Download, title: 'Export de mes données', desc: 'Télécharger toutes vos données (CNDP)' },
        { icon: Lock, title: 'Changer mot de passe', desc: 'Modifier votre mot de passe actuel' },
      ].map(s => (
        <div key={s.title} className="rounded-lg border border-border bg-card p-5 card-shadow flex items-center gap-4 cursor-pointer hover:elevated-shadow transition-all">
          <div className="rounded-lg bg-primary/10 p-3"><s.icon className="h-5 w-5 text-primary" /></div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-card-foreground">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
          </div>
          <span className="text-muted-foreground">→</span>
        </div>
      ))}
    </div>
    </PageTransition>
  );
};

export default SettingsPage;
