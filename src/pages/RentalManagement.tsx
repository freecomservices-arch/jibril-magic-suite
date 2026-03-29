import React, { useState, useMemo } from 'react';
import PageTransition from '@/components/PageTransition';
import { Home, FileText, DollarSign, AlertTriangle, CheckCircle2, Plus, Receipt, TrendingDown, TrendingUp, Edit, Trash2, Phone, Mail, Search, Filter, X, Eye, Download } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { StatCardSkeleton, BailRowSkeleton } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import AvatarInitials from '@/components/AvatarInitials';
import { formatMAD } from '@/data/mockData';
import CreateBailModal, { type Bail, type BailFormData } from '@/components/modals/CreateBailModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useLeases, useLeaseMutations } from '@/hooks/useQueries';

interface Quittance {
  id: string;
  bailId: string;
  mois: string;
  montant: number;
  statut: 'Payé' | 'En attente' | 'Impayé';
  datePaiement?: string;
}

const generateQuittances = (bail: Bail): Quittance[] => {
  const start = new Date(bail.debut);
  const now = new Date();
  const quittances: Quittance[] = [];
  const current = new Date(start);
  let i = 0;
  while (current <= now && i < 12) {
    const mois = current.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const isPast = current < new Date(now.getFullYear(), now.getMonth(), 1);
    quittances.push({
      id: `q${bail.id}-${i}`,
      bailId: bail.id,
      mois,
      montant: bail.loyer + (bail.charges || 0),
      statut: isPast ? (bail.paiement === 'À jour' ? 'Payé' : 'Impayé') : 'En attente',
      datePaiement: isPast && bail.paiement === 'À jour' ? new Date(current.getFullYear(), current.getMonth(), 5).toLocaleDateString('fr-FR') : undefined,
    });
    current.setMonth(current.getMonth() + 1);
    i++;
  }
  return quittances.reverse();
};

const paiementColors: Record<string, string> = {
  'À jour': 'bg-success/10 text-success',
  'En retard': 'bg-warning/10 text-warning',
  'Impayé': 'bg-destructive/10 text-destructive',
};

const statutColors: Record<string, string> = {
  'Actif': 'bg-success/15 text-success',
  'Expiré': 'bg-muted text-muted-foreground',
  'Résilié': 'bg-destructive/15 text-destructive',
};

const RentalManagement: React.FC = () => {
  const { data: baux = [], isLoading } = useLeases();
  const { createLease, updateLease, deleteLease } = useLeaseMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBail, setEditingBail] = useState<Bail | null>(null);
  const [deletingBail, setDeletingBail] = useState<Bail | null>(null);
  const [detailBail, setDetailBail] = useState<Bail | null>(null);
  const [search, setSearch] = useState('');
  const [filterPaiement, setFilterPaiement] = useState('');

  const filtered = useMemo(() => baux.filter(b => {
    if (search && !b.locataire.toLowerCase().includes(search.toLowerCase()) && !b.bien.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPaiement && b.paiement !== filterPaiement) return false;
    return true;
  }), [baux, search, filterPaiement]);

  const stats = useMemo(() => {
    const actifs = baux.filter(b => b.statut === 'Actif').length;
    const loyersTotal = baux.filter(b => b.statut === 'Actif').reduce((s, b) => s + b.loyer, 0);
    const impayes = baux.filter(b => b.paiement !== 'À jour' && b.statut === 'Actif').reduce((s, b) => s + b.loyer, 0);
    const reversements = loyersTotal - impayes;
    return { actifs, loyersTotal, impayes, reversements };
  }, [baux]);

  const openCreate = () => { setEditingBail(null); setModalOpen(true); };
  const openEdit = (b: Bail) => { setEditingBail(b); setModalOpen(true); };

  const handleSubmit = (data: BailFormData) => {
    if (editingBail) {
      updateLease.mutate({ id: editingBail.id, data: data as Record<string, unknown> });
      toast.success('Bail modifié');
    } else {
      createLease.mutate(data as Record<string, unknown>);
    }
  };

  const confirmDelete = () => {
    if (deletingBail) {
      deleteLease.mutate(deletingBail.id);
      setDeletingBail(null);
    }
  };

  const togglePaiement = (id: string) => {
    const bail = baux.find(b => b.id === id);
    if (!bail) return;
    const next = bail.paiement === 'À jour' ? 'En retard' : bail.paiement === 'En retard' ? 'Impayé' : 'À jour';
    updateLease.mutate({ id, data: { paiement: next } });
    toast.success('Statut de paiement mis à jour');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="flex justify-between"><div><Skeleton className="h-7 w-44" /><Skeleton className="h-4 w-56 mt-2" /></div><Skeleton className="h-10 w-36 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="rounded-lg border border-border bg-card card-shadow">
            <div className="border-b border-border px-5 py-4"><Skeleton className="h-5 w-28" /></div>
            {[...Array(3)].map((_, i) => <BailRowSkeleton key={i} />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Gestion Locative
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Loi 67-12 — Baux, quittances et paiements</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Nouveau bail
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Baux Actifs" value={stats.actifs} icon={FileText} variant="primary" />
        <StatCard title="Loyers Encaissés" value={formatMAD(stats.loyersTotal)} icon={DollarSign} variant="accent" subtitle="Ce mois" />
        <StatCard title="Impayés" value={formatMAD(stats.impayes)} icon={TrendingDown} variant="warning" />
        <StatCard title="Reversements" value={formatMAD(stats.reversements)} icon={TrendingUp} variant="default" subtitle="Aux propriétaires" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un bail…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
        </div>
        <select value={filterPaiement} onChange={e => setFilterPaiement(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
          <option value="">Tous paiements</option>
          <option value="À jour">À jour</option>
          <option value="En retard">En retard</option>
          <option value="Impayé">Impayé</option>
        </select>
        {(search || filterPaiement) && (
          <button onClick={() => { setSearch(''); setFilterPaiement(''); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" /> Réinitialiser
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Baux ({filtered.length})
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            Aucun bail trouvé.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <AvatarInitials name={b.locataire} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{b.locataire}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Home className="h-3 w-3" /> {b.bien}
                  </p>
                  {b.telephone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {b.telephone}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatMAD(b.loyer)}/mois</p>
                  <p className="text-xs text-muted-foreground">{new Date(b.debut).toLocaleDateString('fr-FR')} → {new Date(b.fin).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statutColors[b.statut]}`}>{b.statut}</span>
                  <button onClick={() => togglePaiement(b.id)} className={`rounded-md px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-80 transition-opacity ${paiementColors[b.paiement]}`}>
                    {b.paiement === 'À jour' ? <span className="flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> À jour</span> : <span className="flex items-center gap-0.5"><AlertTriangle className="h-3 w-3" /> {b.paiement}</span>}
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setDetailBail(b)} className="rounded-md bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors" title="Quittances">
                    <Receipt className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => openEdit(b)} className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeletingBail(b)} className="rounded-md bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition-colors" title="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <CreateBailModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingBail(null); }} initialData={editingBail} onSubmit={handleSubmit} />

    <AlertDialog open={!!deletingBail} onOpenChange={(open) => !open && setDeletingBail(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce bail ?</AlertDialogTitle>
          <AlertDialogDescription>Supprimer le bail de « {deletingBail?.locataire} » pour « {deletingBail?.bien} » ? Cette action est irréversible.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog open={!!detailBail} onOpenChange={(v) => !v && setDetailBail(null)}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Quittances — {detailBail?.locataire}
          </DialogTitle>
        </DialogHeader>
        {detailBail && (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-1">
              <p><span className="font-medium">Bien :</span> {detailBail.bien}</p>
              <p><span className="font-medium">Loyer :</span> {formatMAD(detailBail.loyer)}/mois {detailBail.charges ? `+ ${formatMAD(detailBail.charges)} charges` : ''}</p>
              <p><span className="font-medium">Période :</span> {new Date(detailBail.debut).toLocaleDateString('fr-FR')} → {new Date(detailBail.fin).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {generateQuittances(detailBail).map(q => (
                <div key={q.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-card-foreground capitalize">{q.mois}</p>
                    {q.datePaiement && <p className="text-[10px] text-muted-foreground">Payé le {q.datePaiement}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary">{formatMAD(q.montant)}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      q.statut === 'Payé' ? 'bg-success/10 text-success' :
                      q.statut === 'Impayé' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>{q.statut}</span>
                    <button className="rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Télécharger quittance">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </PageTransition>
  );
};

export default RentalManagement;