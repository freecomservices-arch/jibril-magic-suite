import React, { useState, useMemo, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { Shield, Users, Settings, Activity, Database, FileCheck, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext';
import AvatarInitials from '@/components/AvatarInitials';
import CreateUserModal, { type UserFormData } from '@/components/modals/CreateUserModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { UserRowSkeleton } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

interface AuditLog {
  user: string;
  action: string;
  date: string;
  ip: string;
}

const fallbackLogs: AuditLog[] = [
  { user: 'Admin Jibril', action: 'Modification bien P1', date: '25/02/2026 10:30', ip: '192.168.1.10' },
  { user: 'Amin Belhaj', action: 'Ajout contact C8', date: '25/02/2026 09:45', ip: '192.168.1.12' },
  { user: 'Sarah Idrissi', action: 'Création transaction T3', date: '24/02/2026 16:20', ip: '192.168.1.15' },
  { user: 'Admin Jibril', action: 'Export statistiques PDF', date: '24/02/2026 14:00', ip: '192.168.1.10' },
];

const Administration: React.FC = () => {
  const { allUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, logsData] = await Promise.all([
          api.users.list().catch(() => null),
          api.auditLogs.list().catch(() => null),
        ]);

        if (usersData && Array.isArray(usersData) && usersData.length > 0) {
          setUsers(usersData.map((u: any) => ({
            id: String(u.id),
            name: u.name || u.full_name || '',
            username: u.username || '',
            email: u.email || '',
            phone: u.phone || '',
            role: u.role || 'agent',
          })));
        } else {
          setUsers(allUsers);
        }

        if (logsData && Array.isArray(logsData) && logsData.length > 0) {
          setLogs(logsData.map((l: any) => ({
            user: l.user || l.user_name || '',
            action: l.action || '',
            date: l.date || (l.created_at ? new Date(l.created_at).toLocaleDateString('fr-FR') + ' ' + new Date(l.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''),
            ip: l.ip || l.ip_address || '',
          })));
        } else {
          setLogs(fallbackLogs);
        }
      } catch (err) {
        console.error('Erreur chargement administration:', err);
        setUsers(allUsers);
        setLogs(fallbackLogs);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [allUsers]);

  const filtered = useMemo(() => users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  const openCreate = () => { setEditingUser(null); setModalOpen(true); };
  const openEdit = (u: User) => { setEditingUser(u); setModalOpen(true); };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await api.users.update(editingUser.id, data);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? {
          ...u, name: data.name, username: data.username, email: data.email, phone: data.phone, role: data.role,
        } : u));
        addLog(`Modification utilisateur ${data.name}`);
        toast.success(`"${data.name}" modifié`);
      } else {
        const created = await api.users.create(data);
        const newUser: User = {
          id: String(created?.id || `u${Date.now()}`),
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
        };
        setUsers(prev => [...prev, newUser]);
        addLog(`Ajout utilisateur ${data.name}`);
        toast.success(`"${data.name}" créé`);
      }
    } catch (err) {
      console.error('Erreur sauvegarde utilisateur:', err);
      toast.error('Impossible de sauvegarder l\'utilisateur');
    }
  };

  const confirmDelete = async () => {
    if (deletingUser) {
      try {
        await api.users.delete(deletingUser.id);
        setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
        addLog(`Suppression utilisateur ${deletingUser.name}`);
        toast.success(`"${deletingUser.name}" supprimé`);
      } catch (err) {
        console.error('Erreur suppression utilisateur:', err);
        toast.error('Impossible de supprimer l\'utilisateur');
      } finally {
        setDeletingUser(null);
      }
    }
  };

  const addLog = (action: string) => {
    setLogs(prev => [{
      user: 'Admin Jibril',
      action,
      date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      ip: '192.168.1.10',
    }, ...prev]);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-64 mt-2" /></div>
          <div className="rounded-lg border border-border bg-card card-shadow">
            <div className="border-b border-border px-5 py-4"><Skeleton className="h-5 w-36" /></div>
            {[...Array(5)].map((_, i) => <UserRowSkeleton key={i} />)}
          </div>
          <div className="rounded-lg border border-border bg-card card-shadow">
            <div className="border-b border-border px-5 py-4"><Skeleton className="h-5 w-32" /></div>
            {[...Array(4)].map((_, i) => <UserRowSkeleton key={i} />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gestion des utilisateurs, paramètres & conformité CNDP</p>
      </div>

      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Utilisateurs ({users.length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-32" />
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
              <AvatarInitials name={u.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email} • {u.phone}</p>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${u.role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent-foreground'}`}>{u.role}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(u)} className="rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                {u.role !== 'admin' && (
                  <button onClick={() => setDeletingUser(u)} className="rounded-md bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Logs d'Activité
            <span className="text-xs font-normal text-muted-foreground">({logs.length})</span>
          </h2>
        </div>
        <div className="divide-y divide-border max-h-80 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
              <AvatarInitials name={l.user} size="sm" />
              <div className="flex-1"><p className="text-sm text-card-foreground"><span className="font-medium">{l.user}</span> — {l.action}</p></div>
              <p className="text-xs text-muted-foreground">{l.date}</p>
              <p className="text-xs text-muted-foreground font-mono">{l.ip}</p>
            </div>
          ))}
        </div>
      </div>

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

    <CreateUserModal
      open={modalOpen}
      onClose={() => { setModalOpen(false); setEditingUser(null); }}
      initialData={editingUser}
      onSubmit={handleSubmit}
    />

    <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Supprimer « {deletingUser?.name} » ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </PageTransition>
  );
};

export default Administration;