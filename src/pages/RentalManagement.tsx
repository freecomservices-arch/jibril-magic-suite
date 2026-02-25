import React from 'react';
import { Home, FileText, DollarSign, AlertTriangle, CheckCircle2, Calendar, Plus, Receipt, Users, TrendingDown, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import AvatarInitials from '@/components/AvatarInitials';
import { formatMAD } from '@/data/mockData';

const baux = [
  { id: '1', locataire: 'Samira Alaoui', bien: 'Apt Haut Founty', loyer: 8500, debut: '2026-01-01', fin: '2027-01-01', statut: 'Actif', paiement: 'À jour' },
  { id: '2', locataire: 'Omar Benjelloun', bien: 'Local Commercial Talborjt', loyer: 15000, debut: '2025-06-01', fin: '2026-06-01', statut: 'Actif', paiement: 'En retard' },
  { id: '3', locataire: 'Marie Lefèvre', bien: 'Apt Marina', loyer: 12000, debut: '2025-09-01', fin: '2026-09-01', statut: 'Actif', paiement: 'À jour' },
];

const RentalManagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Gestion Locative
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Loi 67-12 — Baux et quittances</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Nouveau bail
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Baux Actifs" value={3} icon={FileText} variant="primary" />
        <StatCard title="Loyers Encaissés" value={formatMAD(35500)} icon={DollarSign} variant="accent" subtitle="Ce mois" />
        <StatCard title="Impayés" value={formatMAD(15000)} icon={TrendingDown} variant="warning" />
        <StatCard title="Reversements" value={formatMAD(30000)} icon={TrendingUp} variant="default" subtitle="Aux propriétaires" />
      </div>

      {/* Baux List */}
      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Baux en cours
          </h2>
        </div>
        <div className="divide-y divide-border">
          {baux.map(b => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-background-secondary transition-colors">
              <AvatarInitials name={b.locataire} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{b.locataire}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Home className="h-3 w-3" /> {b.bien}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatMAD(b.loyer)}/mois</p>
                <p className="text-xs text-muted-foreground">{b.debut} → {b.fin}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-md bg-success/15 text-success px-2 py-0.5 text-[10px] font-semibold">{b.statut}</span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                  b.paiement === 'À jour' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {b.paiement === 'À jour' ? <span className="flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> À jour</span> : <span className="flex items-center gap-0.5"><AlertTriangle className="h-3 w-3" /> Impayé</span>}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button className="rounded-md bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors" title="Quittance">
                  <Receipt className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors" title="Détails">
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalManagement;
