import React from 'react';
import PageTransition from '@/components/PageTransition';
import { FileText, ArrowRight, DollarSign, CheckCircle2, Clock, AlertCircle, Plus, Building2, Users } from 'lucide-react';
import { mockTransactions, mockProperties, mockContacts, formatMAD } from '@/data/mockData';
import AvatarInitials from '@/components/AvatarInitials';

const saleStages = ['Offre', 'Compromis', 'Notaire', 'Signé'];
const locationStages = ['Visite', 'Bail', 'État des lieux', 'Quittances'];

const stageColors: Record<string, string> = {
  'Offre': 'bg-info/15 text-info border-info/30',
  'Compromis': 'bg-warning/15 text-warning border-warning/30',
  'Notaire': 'bg-primary/15 text-primary border-primary/30',
  'Signé': 'bg-success/15 text-success border-success/30',
  'Visite': 'bg-info/15 text-info border-info/30',
  'Bail': 'bg-warning/15 text-warning border-warning/30',
  'État des lieux': 'bg-primary/15 text-primary border-primary/30',
  'Quittances': 'bg-success/15 text-success border-success/30',
};

const Transactions: React.FC = () => {
  const totalCommissions = mockTransactions.reduce((s, t) => s + t.commission, 0);
  const venteTx = mockTransactions.filter(t => t.type === 'Vente');
  const locationTx = mockTransactions.filter(t => t.type === 'Location');

  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Transactions & Dossiers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{mockTransactions.length} transactions en cours</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Nouvelle transaction
        </button>
      </div>

      {/* Summary Cards */}
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

      {/* Pipeline Vente */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-primary" />
          Pipeline de Vente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {saleStages.map(stage => {
            const txInStage = venteTx.filter(t => t.stage === stage);
            return (
              <div key={stage} className="rounded-lg bg-background-secondary p-3 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${stageColors[stage]}`}>{stage}</span>
                  <span className="text-xs text-muted-foreground">{txInStage.length}</span>
                </div>
                {txInStage.length > 0 ? txInStage.map(tx => {
                  const property = mockProperties.find(p => p.id === tx.propertyId);
                  const contact = mockContacts.find(c => c.id === tx.contactId);
                  return (
                    <div key={tx.id} className="rounded-md border border-border bg-card p-3 mb-2 last:mb-0">
                      <p className="text-xs font-medium text-card-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-primary" /> {property?.title || 'Bien'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" /> {contact?.name || 'Client'}
                      </p>
                      <p className="text-xs font-semibold text-primary mt-1">{formatMAD(tx.amount)}</p>
                    </div>
                  );
                }) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-center space-y-2">
                    <svg className="h-12 w-16 mx-auto" viewBox="0 0 80 60" fill="none">
                      <rect x="10" y="10" width="24" height="16" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.1" />
                      <rect x="10" y="30" width="24" height="16" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.07" />
                      <path d="M40 26L50 18" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
                    </svg>
                    <p className="text-[10px] text-muted-foreground">Aucune transaction</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Location */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-accent" />
          Pipeline de Location
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {locationStages.map(stage => {
            const txInStage = locationTx.filter(t => t.stage === stage);
            return (
              <div key={stage} className="rounded-lg bg-background-secondary p-3 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${stageColors[stage]}`}>{stage}</span>
                  <span className="text-xs text-muted-foreground">{txInStage.length}</span>
                </div>
                {txInStage.length > 0 ? txInStage.map(tx => {
                  const property = mockProperties.find(p => p.id === tx.propertyId);
                  const contact = mockContacts.find(c => c.id === tx.contactId);
                  return (
                    <div key={tx.id} className="rounded-md border border-border bg-card p-3 mb-2 last:mb-0">
                      <p className="text-xs font-medium text-card-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-accent" /> {property?.title || 'Bien'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" /> {contact?.name || 'Client'}
                      </p>
                      <p className="text-xs font-semibold text-accent mt-1">{formatMAD(tx.amount)}/mois</p>
                    </div>
                  );
                }) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-center space-y-2">
                    <svg className="h-12 w-16 mx-auto" viewBox="0 0 80 60" fill="none">
                      <rect x="10" y="10" width="24" height="16" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.1" />
                      <rect x="10" y="30" width="24" height="16" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.07" />
                      <path d="M40 26L50 18" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
                    </svg>
                    <p className="text-[10px] text-muted-foreground">Aucune transaction</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Transactions;
