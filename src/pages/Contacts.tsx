import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import {
  Users, Search, Plus, Phone, Mail, MessageSquare, Star,
  Lock, Unlock, UserCheck, UserPlus, Filter, ArrowUpRight, Edit, Trash2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { mockContacts, formatMAD } from '@/data/mockData';
import type { Contact } from '@/data/mockData';
import AvatarInitials from '@/components/AvatarInitials';
import EmptyState from '@/components/EmptyState';
import ContactFormModal from '@/components/modals/CreateContactModal';
import { ContactRowSkeleton, StatCardSkeleton, usePageLoading } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';

const typeColors: Record<string, string> = {
  'Acquéreur': 'bg-primary/15 text-primary',
  'Vendeur': 'bg-accent/15 text-accent',
  'Locataire': 'bg-info/15 text-info',
  'Propriétaire': 'bg-warning/15 text-warning',
};

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive';
  const bg = score >= 80 ? 'bg-success/10' : score >= 50 ? 'bg-warning/10' : 'bg-destructive/10';
  return (
    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${color} ${bg}`}>
      <Star className="h-3 w-3" /> {score}%
    </div>
  );
};

const ContactRow: React.FC<{ contact: Contact; onEdit: () => void; onDelete: () => void }> = ({ contact, onEdit, onDelete }) => (
  <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 card-shadow hover:elevated-shadow transition-all animate-fade-in">
    <AvatarInitials name={contact.name} size="lg" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-card-foreground">{contact.name}</h3>
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${typeColors[contact.type]}`}>{contact.type}</span>
        {contact.lockedBy && (
          <span className="flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
            <Lock className="h-3 w-3" /> Verrouillé
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {contact.phone}</span>
        {contact.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {contact.email}</span>}
      </div>
      {contact.exigences && <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">📋 {contact.exigences}</p>}
      {contact.budget && <p className="mt-1 text-xs font-medium text-primary">Budget : {formatMAD(contact.budget)}</p>}
    </div>
    <div className="flex flex-col items-end gap-2">
      <ScoreBadge score={contact.score} />
      <div className="flex gap-1">
        <button onClick={onEdit} className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button onClick={onDelete} className="rounded-md bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors" title="Supprimer">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <button className="rounded-md bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors" title="Appeler">
          <Phone className="h-3.5 w-3.5" />
        </button>
        <button className="rounded-md bg-success/10 p-2 text-success hover:bg-success/20 transition-colors" title="WhatsApp">
          <MessageSquare className="h-3.5 w-3.5" />
        </button>
        {contact.email && (
          <button className="rounded-md bg-info/10 p-2 text-info hover:bg-info/20 transition-colors" title="Email">
            <Mail className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  </div>
);

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const loading = usePageLoading(600);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const confirmDelete = () => {
    if (deletingContact) {
      setContacts(prev => prev.filter(c => c.id !== deletingContact.id));
      toast.success(`"${deletingContact.name}" supprimé`);
      setDeletingContact(null);
    }
  };

  const filtered = contacts.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && c.type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: contacts.length,
    acquereurs: contacts.filter(c => c.type === 'Acquéreur').length,
    vendeurs: contacts.filter(c => c.type === 'Vendeur').length,
    locataires: contacts.filter(c => c.type === 'Locataire').length,
  };

  const openCreate = () => { setEditingContact(null); setModalOpen(true); };
  const openEdit = (c: Contact) => { setEditingContact(c); setModalOpen(true); };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="flex justify-between"><div><Skeleton className="h-7 w-40" /><Skeleton className="h-4 w-56 mt-2" /></div><Skeleton className="h-10 w-40 rounded-lg" /></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <ContactRowSkeleton key={i} />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            CRM Contacts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{stats.total} contacts • {stats.acquereurs} acquéreurs • {stats.vendeurs} vendeurs</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <UserPlus className="h-4 w-4" /> Nouveau contact
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Acquéreurs', count: stats.acquereurs, icon: UserCheck, color: 'text-primary bg-primary/10' },
          { label: 'Vendeurs', count: stats.vendeurs, icon: ArrowUpRight, color: 'text-accent bg-accent/10' },
          { label: 'Locataires', count: stats.locataires, icon: Users, color: 'text-info bg-info/10' },
          { label: 'Score moyen', count: contacts.length > 0 ? Math.round(contacts.reduce((s, c) => s + c.score, 0) / contacts.length) + '%' : '0%', icon: Star, color: 'text-warning bg-warning/10' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 card-shadow">
            <div className={`rounded-lg p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
            <div>
              <p className="text-lg font-bold font-heading text-card-foreground">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un contact..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
          <option value="">Tous types</option>
          {['Acquéreur', 'Vendeur', 'Locataire', 'Propriétaire'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(c => <ContactRow key={c.id} contact={c} onEdit={() => openEdit(c)} onDelete={() => setDeletingContact(c)} />)}
        </div>
      ) : (
        <EmptyState variant="contacts" icon={Users} title="Aucun contact trouvé" description="Ajoutez votre premier contact." actionLabel="Ajouter un contact" onAction={openCreate} />
      )}
    </div>

    <ContactFormModal
      open={modalOpen}
      onClose={() => { setModalOpen(false); setEditingContact(null); }}
      initialData={editingContact}
      onSubmit={(data) => {
        if (editingContact) {
          setContacts(prev => prev.map(c => c.id === editingContact.id ? {
            ...c,
            name: data.name,
            type: data.type,
            phone: data.phone,
            email: data.email || undefined,
            budget: typeof data.budget === 'number' ? data.budget : undefined,
            exigences: data.exigences || undefined,
            notes: data.notes || undefined,
            score: typeof data.score === 'number' ? data.score : c.score,
          } : c));
        } else {
          const newContact: Contact = {
            id: `c${Date.now()}`,
            name: data.name, type: data.type, phone: data.phone,
            email: data.email || undefined,
            budget: typeof data.budget === 'number' ? data.budget : undefined,
            exigences: data.exigences || undefined,
            notes: data.notes || undefined,
            score: typeof data.score === 'number' ? data.score : 50,
            agentId: '2', createdAt: new Date().toISOString().split('T')[0],
          };
          setContacts(prev => [newContact, ...prev]);
        }
      }}
    />
    <AlertDialog open={!!deletingContact} onOpenChange={(open) => !open && setDeletingContact(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce contact ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer « {deletingContact?.name} » ? Cette action est irréversible.
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

export default Contacts;
