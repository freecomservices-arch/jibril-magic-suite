import React from 'react';
import PageTransition from '@/components/PageTransition';
import { Globe, Search, Users, Building2, AlertCircle, CheckCircle2, Filter, Plus, RefreshCw, UserPlus, ExternalLink, Copy } from 'lucide-react';
import AvatarInitials from '@/components/AvatarInitials';
import StatCard from '@/components/StatCard';

const scrapedLeads = [
  { id: '1', source: 'Avito.ma', type: 'Bien', title: 'Appartement 3ch Agadir Founty', price: '1 600 000 DH', phone: '+212 6 XX XX XX XX', status: 'Nouveau', date: '25/02/2026' },
  { id: '2', source: 'Mubawab', type: 'Bien', title: 'Villa avec piscine Marina', price: '5 200 000 DH', phone: '+212 6 XX XX XX XX', status: 'Qualifié', date: '24/02/2026' },
  { id: '3', source: 'Facebook', type: 'Personne', title: 'MRE cherche investissement Agadir', price: '-', phone: '+33 6 XX XX XX XX', status: 'Nouveau', date: '24/02/2026' },
  { id: '4', source: 'LinkedIn', type: 'Personne', title: 'Cadre expatrié — relocation Agadir', price: '-', phone: '+212 6 XX XX XX XX', status: 'Doublon', date: '23/02/2026' },
  { id: '5', source: 'Avito.ma', type: 'Bien', title: 'Terrain constructible Taghazout', price: '3 800 000 DH', phone: '+212 6 XX XX XX XX', status: 'Assigné', date: '23/02/2026' },
];

const sourceIcons: Record<string, string> = {
  'Avito.ma': '🟠',
  'Mubawab': '🔵',
  'Facebook': '📘',
  'LinkedIn': '💼',
};

const statusColors: Record<string, string> = {
  'Nouveau': 'bg-info/15 text-info',
  'Qualifié': 'bg-success/15 text-success',
  'Doublon': 'bg-destructive/15 text-destructive',
  'Assigné': 'bg-primary/15 text-primary',
};

const Scraping: React.FC = () => {
  return (
    <PageTransition>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Scraping & Acquisition
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Leads scrapés depuis Avito, Mubawab, Facebook, LinkedIn</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <RefreshCw className="h-4 w-4" /> Lancer un scan
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Ajouter source
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Leads Scrapés" value={125} icon={Users} variant="primary" subtitle="Ce mois" />
        <StatCard title="Biens Détectés" value={89} icon={Building2} variant="accent" />
        <StatCard title="Doublons" value={12} icon={Copy} variant="warning" subtitle="Détectés automatiquement" />
        <StatCard title="Qualifiés IA" value={45} icon={CheckCircle2} variant="default" />
      </div>

      {/* Leads Table */}
      <div className="rounded-lg border border-border bg-card card-shadow overflow-hidden">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> Leads Récents
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="h-3 w-3" /> Filtrer
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Source</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Titre</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Prix</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scrapedLeads.map(l => (
                <tr key={l.id} className="hover:bg-background-secondary transition-colors">
                  <td className="px-5 py-3 text-sm">{sourceIcons[l.source]} {l.source}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${l.type === 'Bien' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {l.type === 'Bien' ? <Building2 className="h-3 w-3 inline mr-0.5" /> : <Users className="h-3 w-3 inline mr-0.5" />}
                      {l.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-card-foreground max-w-xs truncate">{l.title}</td>
                  <td className="px-5 py-3 text-sm text-primary font-semibold">{l.price}</td>
                  <td className="px-5 py-3"><span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusColors[l.status]}`}>{l.status}</span></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{l.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="rounded-md bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors" title="Importer">
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Voir source">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Scraping;
