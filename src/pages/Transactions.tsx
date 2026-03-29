import React, { useState, useCallback, useRef, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { FileText, DollarSign, CheckCircle2, Clock, Plus, Building2, Users, GripVertical, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatMAD, Transaction } from '@/data/mockData';
import type { Property, Contact } from '@/data/mockData';
import { cn } from '@/lib/utils';
import TransactionFormModal from '@/components/modals/CreateTransactionModal';
import { StatCardSkeleton, KanbanCardSkeleton } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

const saleStages = ['Offre', 'Compromis', 'Notaire', 'Signé'] as const;
const locationStages = ['Visite', 'Bail', 'État des lieux', 'Quittances'] as const;

const stageColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Offre': { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30', dot: 'bg-info' },
  'Compromis': { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  'Notaire': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
  'Signé': { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  'Visite': { bg: 'bg-info/10', text: 'text-info', border: 'border-info/30', dot: 'bg-info' },
  'Bail': { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  'État des lieux': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
  'Quittances': { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
};

interface KanbanCardProps {
  tx: Transaction;
  properties: Property[];
  contacts: Contact[];
  onDragStart: (e: React.DragEvent, txId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  type: 'Vente' | 'Location';
}

const KanbanCard: React.FC<KanbanCardProps> = ({ tx, properties, contacts, onDragStart, onEdit, onDelete, type }) => {
  const property = properties.find(p => p.id === tx.propertyId);
  const contact = contacts.find(c => c.id === tx.contactId);
  const accentColor = type === 'Vente' ? 'text-primary' : 'text-accent';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, tx.id)}
      className="group rounded-lg border border-border bg-card p-3 mb-2 last:mb-0 cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md transition-all duration-200 active:scale-[0.97] active:shadow-lg"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground mt-0.5 shrink-0 transition-colors" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-card-foreground flex items-center gap-1 truncate">
            <Building2 className={cn("h-3 w-3 shrink-0", accentColor)} />
            {property?.title || 'Bien'}
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
            <Users className="h-3 w-3 shrink-0" /> {contact?.name || 'Client'}
          </p>
          <p className={cn("text-xs font-bold mt-1.5", accentColor)}>
            {formatMAD(tx.amount)}{type === 'Location' ? '/mois' : ''}
          </p>
          {tx.documents && tx.documents.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <FileText className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground">{tx.documents.length} doc{tx.documents.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="rounded-md p-1 text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-colors"
            title="Modifier"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="rounded-md p-1 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  stage: string;
  transactions: Transaction[];
  properties: Property[];
  contacts: Contact[];
  onDragStart: (e: React.DragEvent, txId: string) => void;
  onDrop: (e: React.DragEvent, stage: string) => void;
  onEditTx: (tx: Transaction) => void;
  onDeleteTx: (tx: Transaction) => void;
  type: 'Vente' | 'Location';
  isOver: boolean;
  onDragOver: (e: React.DragEvent, stage: string) => void;
  onDragLeave: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage, transactions, properties, contacts, onDragStart, onDrop, onEditTx, onDeleteTx, type, isOver, onDragOver, onDragLeave,
}) => {
  const colors = stageColors[stage];

  return (
    <div
      onDragOver={(e) => onDragOver(e, stage)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, stage)}
      className={cn(
        "rounded-xl p-3 border transition-all duration-200 min-h-[200px] flex flex-col",
        isOver ? "bg-primary/5 border-primary/40 ring-2 ring-primary/20 scale-[1.01]" : "bg-background-secondary border-border/50"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", colors.dot)} />
          <span className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold", colors.bg, colors.text, colors.border)}>{stage}</span>
        </div>
        <span className={cn("text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center", transactions.length > 0 ? `${colors.bg} ${colors.text}` : "text-muted-foreground")}>{transactions.length}</span>
      </div>
      <div className="flex-1 space-y-0">
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <KanbanCard key={tx.id} tx={tx} properties={properties} contacts={contacts} onDragStart={onDragStart} onEdit={() => onEditTx(tx)} onDelete={() => onDeleteTx(tx)} type={type} />
          ))
        ) : (
          <div className={cn("rounded-lg border-2 border-dashed p-6 text-center transition-colors flex-1 flex flex-col items-center justify-center", isOver ? "border-primary/40 bg-primary/5" : "border-border/50")}>
            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2">
              <Plus className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-[10px] text-muted-foreground">{isOver ? 'Déposer ici' : 'Glisser une carte ici'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StageProgress: React.FC<{ stages: readonly string[]; transactions: Transaction[] }> = ({ stages, transactions }) => (
  <div className="flex items-center gap-1 mb-4">
    {stages.map((stage, i) => {
      const count = transactions.filter(t => t.stage === stage).length;
      const colors = stageColors[stage];
      return (
        <React.Fragment key={stage}>
          <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border", colors.bg, colors.text, colors.border)}>
            <div className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
            {stage} ({count})
          </div>
          {i < stages.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />}
        </React.Fragment>
      );
    })}
  </div>
);

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const draggedTxId = useRef<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txData, propData, contactData] = await Promise.all([
          api.transactions.list(),
          api.properties.list(),
          api.contacts.list(),
        ]);

        setTransactions((Array.isArray(txData) ? txData : []).map((t: any) => ({
          id: String(t.id),
          propertyId: String(t.property_id || t.propertyId || ''),
          contactId: String(t.contact_id || t.contactId || ''),
          type: t.type || 'Vente',
          stage: t.stage || 'Offre',
          amount: t.amount || 0,
          commission: t.commission || 0,
          agentId: String(t.agent_id || t.agentId || ''),
          createdAt: t.created_at || t.createdAt || new Date().toISOString(),
          documents: Array.isArray(t.documents) ? t.documents : [],
        })));

        setProperties((Array.isArray(propData) ? propData : []).map((p: any) => ({
          id: String(p.id),
          title: p.title || '',
          type: p.type || 'Appartement',
          transaction: p.transaction || 'Vente',
          price: p.price || 0,
          surface: p.surface || 0,
          city: p.city || '',
          quartier: p.quartier || '',
          address: p.address || '',
          description: p.description || '',
          status: p.status || 'Disponible',
          mandat: p.mandat || 'Simple',
          agentId: String(p.agent_id || ''),
          photos: Array.isArray(p.photos) ? p.photos : [],
          createdAt: p.created_at || new Date().toISOString(),
        })));

        setContacts((Array.isArray(contactData) ? contactData : []).map((c: any) => ({
          id: String(c.id),
          name: c.name || '',
          type: c.type || 'Acquéreur',
          phone: c.phone || '',
          email: c.email,
          score: c.score ?? 50,
          agentId: String(c.agent_id || ''),
          createdAt: c.created_at || new Date().toISOString(),
        })));
      } catch (err) {
        console.error('Erreur chargement transactions:', err);
        toast.error('Impossible de charger les transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const confirmDelete = async () => {
    if (deletingTx) {
      try {
        await api.transactions.delete(deletingTx.id);
        setTransactions(prev => prev.filter(t => t.id !== deletingTx.id));
        toast.success('Transaction supprimée');
      } catch (err) {
        console.error('Erreur suppression transaction:', err);
        toast.error('Impossible de supprimer la transaction');
      } finally {
        setDeletingTx(null);
      }
    }
  };

  const totalCommissions = transactions.reduce((s, t) => s + t.commission, 0);
  const venteTx = transactions.filter(t => t.type === 'Vente');
  const locationTx = transactions.filter(t => t.type === 'Location');

  const handleDragStart = useCallback((e: React.DragEvent, txId: string) => {
    draggedTxId.current = txId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', txId);
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '0.5';
    requestAnimationFrame(() => { el.style.opacity = '1'; });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }, []);

  const handleDragLeave = useCallback(() => { setDragOverStage(null); }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const txId = draggedTxId.current || e.dataTransfer.getData('text/plain');
    if (!txId) return;
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, stage: newStage as Transaction['stage'] } : t));
    draggedTxId.current = null;
  }, []);

  const openCreate = () => { setEditingTx(null); setModalOpen(true); };
  const openEdit = (tx: Transaction) => { setEditingTx(tx); setModalOpen(true); };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="flex justify-between"><div><Skeleton className="h-7 w-52" /><Skeleton className="h-4 w-64 mt-2" /></div><Skeleton className="h-10 w-44 rounded-lg" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <Skeleton className="h-5 w-36 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-muted/30 p-3 min-h-[200px] space-y-2">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <KanbanCardSkeleton /><KanbanCardSkeleton />
                </div>
              ))}
            </div>
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
              <FileText className="h-6 w-6 text-primary" />
              Transactions & Dossiers
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{transactions.length} transactions en cours · Glissez les cartes entre les colonnes</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Nouvelle transaction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 card-shadow flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Commissions totales</p>
              <p className="text-xl font-bold font-heading text-card-foreground">{formatMAD(totalCommissions)}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 card-shadow flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-3"><CheckCircle2 className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Ventes en cours</p>
              <p className="text-xl font-bold font-heading text-card-foreground">{venteTx.length}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 card-shadow flex items-center gap-3">
            <div className="rounded-lg bg-accent/10 p-3"><Clock className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Locations en cours</p>
              <p className="text-xl font-bold font-heading text-card-foreground">{locationTx.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-primary" /> Pipeline de Vente
          </h2>
          <StageProgress stages={saleStages} transactions={venteTx} />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {saleStages.map(stage => (
              <KanbanColumn key={stage} stage={stage} transactions={venteTx.filter(t => t.stage === stage)} properties={properties} contacts={contacts} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} isOver={dragOverStage === stage} type="Vente" onEditTx={openEdit} onDeleteTx={setDeletingTx} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-accent" /> Pipeline de Location
          </h2>
          <StageProgress stages={locationStages} transactions={locationTx} />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {locationStages.map(stage => (
              <KanbanColumn key={stage} stage={stage} transactions={locationTx.filter(t => t.stage === stage)} properties={properties} contacts={contacts} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} isOver={dragOverStage === stage} type="Location" onEditTx={openEdit} onDeleteTx={setDeletingTx} />
            ))}
          </div>
        </div>
      </div>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTx(null); }}
        initialData={editingTx}
      onSubmit={async (data) => {
          try {
            if (editingTx) {
              await api.transactions.update(editingTx.id, data);
              setTransactions(prev => prev.map(t => t.id === editingTx.id ? {
                ...t,
                propertyId: data.propertyId,
                contactId: data.contactId,
                type: data.type,
                stage: data.stage as Transaction['stage'],
                amount: data.amount,
                commission: data.commission,
              } : t));
            } else {
              const created = await api.transactions.create(data);
              const newTx: Transaction = {
                id: String(created?.id || `t${Date.now()}`),
                propertyId: data.propertyId,
                contactId: data.contactId,
                type: data.type,
                stage: data.stage as Transaction['stage'],
                amount: data.amount,
                commission: data.commission,
                agentId: '2',
                createdAt: new Date().toISOString().split('T')[0],
                documents: [],
              };
              setTransactions(prev => [...prev, newTx]);
            }
          } catch (err) {
            console.error('Erreur sauvegarde transaction:', err);
            toast.error('Impossible de sauvegarder la transaction');
          }
        }}
      />
      <AlertDialog open={!!deletingTx} onOpenChange={(open) => !open && setDeletingTx(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette transaction ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
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

export default Transactions;
