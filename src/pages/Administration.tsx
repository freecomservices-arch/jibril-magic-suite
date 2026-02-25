import React from 'react';
import { Shield, Users, Settings, Activity, Database, FileCheck, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AvatarInitials from '@/components/AvatarInitials';

const logs = [
  { user: 'Admin Jibril', action: 'Modification bien P1', date: '25/02/2026 10:30', ip: '192.168.1.10' },
  { user: 'Amin Belhaj', action: 'Ajout contact C8', date: '25/02/2026 09:45', ip: '192.168.1.12' },
  { user: 'Sarah Idrissi', action: 'Création transaction T3', date: '24/02/2026 16:20', ip: '192.168.1.15' },
  { user: 'Admin Jibril', action: 'Export statistiques PDF', date: '24/02/2026 14:00', ip: '192.168.1.10' },
];

const Administration: React.FC = () => {
  const { allUsers } = useAuth();
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion des utilisateurs, paramètres & conformité CNDP</p>
      </div>
      {/* Users */}
      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Utilisateurs ({allUsers.length})</h2>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Ajouter</button>
        </div>
        <div className="divide-y divide-border">
          {allUsers.map(u => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3 hover:bg-background-secondary transition-colors">
              <AvatarInitials name={u.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email} • {u.phone}</p>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${u.role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'}`}>{u.role}</span>
              <div className="flex gap-1">
                <button className="rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Edit className="h-3.5 w-3.5" /></button>
                {u.role !== 'admin' && <button className="rounded-md bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Audit Logs */}
      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Logs d'Activité</h2>
        </div>
        <div className="divide-y divide-border">
          {logs.map((l, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-background-secondary transition-colors">
              <AvatarInitials name={l.user} size="sm" />
              <div className="flex-1"><p className="text-sm text-card-foreground"><span className="font-medium">{l.user}</span> — {l.action}</p></div>
              <p className="text-xs text-muted-foreground">{l.date}</p>
              <p className="text-xs text-muted-foreground font-mono">{l.ip}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Settings, title: 'Paramètres Agence', desc: 'Nom, logo, adresse, téléphone' },
          { icon: Database, title: 'Backups', desc: 'Sauvegarde et restauration des données' },
          { icon: FileCheck, title: 'Conformité CNDP', desc: 'Consentements, droit à l\'oubli, logs' },
        ].map(s => (
          <div key={s.title} className="rounded-lg border border-border bg-card p-5 card-shadow hover:elevated-shadow transition-all cursor-pointer group">
            <div className="rounded-lg bg-primary/10 p-3 w-fit mb-3"><s.icon className="h-5 w-5 text-primary" /></div>
            <h3 className="font-heading text-sm font-semibold text-card-foreground">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Administration;
