// =============================================================================
// JIBRIL IMMO PRO — PAGE SCRAPING (PRODUCTION)
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Globe, RefreshCw, Search, Play, Clock, CheckCircle2,
  AlertCircle, Phone, MapPin, Tag, ExternalLink, Trash2,
  Terminal, ChevronDown, ChevronUp, Eye, Plus,
  Database, Zap, Timer, Activity,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Source {
  id: string;
  name: string;
  url: string;
  active: boolean;
  created_at: string;
}

interface Lead {
  id: string;
  title: string;
  price: number;
  city: string;
  source: string;
  type: string;
  phone: string;
  url: string;
  status: string;
  created_at: string;
}

interface ScanLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// ─── Source icons ────────────────────────────────────────────────────────────
const sourceIcons: Record<string, string> = {
  avito: '🟠',
  mubawab: '🔵',
  facebook: '🔷',
};

const sourceColors: Record<string, string> = {
  avito: 'bg-warning/15 text-warning border-warning/20',
  mubawab: 'bg-info/15 text-info border-info/20',
  facebook: 'bg-primary/15 text-primary border-primary/20',
};

const statusColors: Record<string, string> = {
  new: 'bg-success/15 text-success border-success/20',
  contacted: 'bg-info/15 text-info border-info/20',
  qualified: 'bg-primary/15 text-primary border-primary/20',
  rejected: 'bg-destructive/15 text-destructive border-destructive/20',
};

// ─── Default sources (if API returns empty) ─────────────────────────────────
const DEFAULT_SOURCES = [
  { id: 'avito', name: 'Avito', key: 'avito' },
  { id: 'mubawab', name: 'Mubawab', key: 'mubawab' },
  { id: 'facebook', name: 'Facebook Groups', key: 'facebook' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function Scraping() {
  const [sources, setSources] = useState<Source[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set(['avito', 'mubawab', 'facebook']));
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [scanDuration, setScanDuration] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanHistory, setScanHistory] = useState<{ date: string; sources: string; leads: number; duration: string }[]>([]);

  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '' });

  const consoleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // ─── Load data ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sourcesData, leadsData] = await Promise.all([
        api.sources.list().catch(() => []),
        api.leads.list().catch(() => []),
      ]);
      setSources(Array.isArray(sourcesData) ? sourcesData : sourcesData?.results || []);
      const mappedLeads = (Array.isArray(leadsData) ? leadsData : leadsData?.results || []).map((l: any) => ({
        id: String(l.id),
        title: l.title || '',
        price: l.price || 0,
        city: l.city || l.location || '',
        source: l.source || '',
        type: l.type || '',
        phone: l.phone || l.telephone || '',
        url: l.url || '',
        status: l.status || 'new',
        created_at: l.created_at || new Date().toISOString(),
      }));
      setLeads(mappedLeads);
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Add custom source ──────────────────────────────────────────────────
  const handleAddSource = async () => {
    const name = newSource.name.trim();
    const url = newSource.url.trim();
    if (!name || !url) {
      toast({ title: 'Erreur', description: 'Nom et URL requis', variant: 'destructive' });
      return;
    }
    try {
      await api.sources.create({ name, url, active: true });
      toast({ title: 'Source ajoutée', description: `"${name}" a été ajoutée` });
      setNewSource({ name: '', url: '' });
      setAddSourceOpen(false);
      loadData();
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : "Échec de l'ajout", variant: 'destructive' });
    }
  };

  // ─── Delete custom source ──────────────────────────────────────────────
  const handleDeleteSource = async (id: string) => {
    try {
      await api.sources.delete(id);
      setSources(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Source supprimée' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  // ─── Toggle source active/inactive ─────────────────────────────────────
  const handleToggleSourceActive = async (source: Source) => {
    try {
      await api.sources.update(source.id, { active: !source.active });
      setSources(prev => prev.map(s => s.id === source.id ? { ...s, active: !s.active } : s));
      toast({ title: source.active ? 'Source désactivée' : 'Source activée' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de modifier la source', variant: 'destructive' });
    }
  };

  // ─── Console log helper ─────────────────────────────────────────────────
  const addLog = useCallback((message: string, type: ScanLog['type'] = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
    setTimeout(() => consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight, behavior: 'smooth' }), 50);
  }, []);

  // ─── Toggle source ─────────────────────────────────────────────────────
  const toggleSource = (key: string) => {
    setSelectedSources(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ─── Launch scan ────────────────────────────────────────────────────────
  const handleScan = async () => {
    if (selectedSources.size === 0) {
      toast({ title: 'Erreur', description: 'Sélectionnez au moins une source', variant: 'destructive' });
      return;
    }

    setScanning(true);
    setConsoleOpen(true);
    setLogs([]);
    setScanDuration(null);
    const startTime = Date.now();

    const sourcesToScan = Array.from(selectedSources);
    addLog(`🚀 Lancement du scan sur ${sourcesToScan.length} source(s)...`, 'info');

    let totalNewLeads = 0;

    for (const source of sourcesToScan) {
      addLog(`🔍 Scan de ${source.toUpperCase()} en cours...`, 'info');
      try {
        const result = await api.scraping.scan(source);
        const count = result?.leads_count || result?.count || 0;
        totalNewLeads += count;
        addLog(`✅ ${source.toUpperCase()} : ${count} lead(s) trouvé(s)`, 'success');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        addLog(`❌ ${source.toUpperCase()} : ${msg}`, 'error');
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    setScanDuration(parseFloat(duration));
    addLog(`🏁 Scan terminé en ${duration}s — ${totalNewLeads} nouveau(x) lead(s)`, 'success');

    // Update history
    setScanHistory(prev => [
      { date: new Date().toLocaleString('fr-FR'), sources: sourcesToScan.join(', '), leads: totalNewLeads, duration: `${duration}s` },
      ...prev,
    ]);

    // Reload leads
    try {
      const leadsData = await api.leads.list();
      const mapped = (Array.isArray(leadsData) ? leadsData : leadsData?.results || []).map((l: any) => ({
        id: String(l.id),
        title: l.title || '',
        price: l.price || 0,
        city: l.city || l.location || '',
        source: l.source || '',
        type: l.type || '',
        phone: l.phone || l.telephone || '',
        url: l.url || '',
        status: l.status || 'new',
        created_at: l.created_at || new Date().toISOString(),
      }));
      setLeads(mapped);
    } catch { /* ignore */ }

    setScanning(false);
    toast({ title: 'Scan terminé', description: `${totalNewLeads} nouveau(x) lead(s) récupéré(s) en ${duration}s` });
  };

  // ─── Delete lead ────────────────────────────────────────────────────────
  const handleDeleteLead = async (id: string) => {
    try {
      await api.leads.delete(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast({ title: 'Lead supprimé' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le lead', variant: 'destructive' });
    }
  };

  // ─── Filter leads ──────────────────────────────────────────────────────
  const filteredLeads = leads.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.source.toLowerCase().includes(q);
  });

  // ─── Stats ──────────────────────────────────────────────────────────────
  const newLeadsToday = leads.filter(l => {
    try { return new Date(l.created_at).toDateString() === new Date().toDateString(); } catch { return false; }
  }).length;

  // ─── Format price ──────────────────────────────────────────────────────
  const formatPrice = (price: number) => {
    if (!price) return '—';
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(price);
  };

  // ─── Loading skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="flex justify-between">
            <div><Skeleton className="h-7 w-56" /><Skeleton className="h-4 w-36 mt-2" /></div>
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-5">
        {/* ─── Header ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Scraping & Acquisition
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {leads.length} leads • {sources.length || DEFAULT_SOURCES.length} sources configurées
            </p>
          </div>
          <Button onClick={handleScan} disabled={scanning} className="gap-2">
            {scanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {scanning ? 'Scan en cours...' : 'Lancer le Scan Complet'}
          </Button>
        </div>

        {/* ─── Stat Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Leads" value={leads.length} subtitle="Tous les leads scrapés" icon={Database} variant="primary" />
          <StatCard title="Nouveaux Leads" value={newLeadsToday} subtitle="Aujourd'hui" icon={Zap} variant="accent" />
          <StatCard title="Durée du scan" value={scanDuration ? `${scanDuration}s` : '—'} subtitle="Dernier scan" icon={Timer} />
          <StatCard
            title="Statut"
            value={scanning ? 'En cours' : 'Prêt'}
            subtitle={scanning ? 'Scan actif...' : 'En attente'}
            icon={Activity}
            variant={scanning ? 'warning' : 'default'}
          />
        </div>

        {/* ─── Main Content ──────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ─── Sidebar : Sources ────────────────────────────────────── */}
          <div className="w-full lg:w-64 shrink-0 space-y-3">
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Sources par défaut
              </h3>
              <div className="space-y-3">
                {DEFAULT_SOURCES.map(s => (
                  <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedSources.has(s.key)}
                      onCheckedChange={() => toggleSource(s.key)}
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {sourceIcons[s.key] || '🌐'} {s.name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Custom API sources with checkboxes */}
              {sources.length > 0 && (
                <>
                  <div className="border-t border-border pt-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Mes sources</h4>
                    <div className="space-y-2">
                      {sources.map(s => (
                        <div key={s.id} className="flex items-center gap-2 group">
                          <Checkbox
                            checked={selectedSources.has(s.name.toLowerCase())}
                            onCheckedChange={() => toggleSource(s.name.toLowerCase())}
                          />
                          <span className={`text-sm truncate flex-1 ${s.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                            🌐 {s.name}
                          </span>
                          <Switch
                            checked={s.active}
                            onCheckedChange={() => handleToggleSourceActive(s)}
                            className="scale-75"
                          />
                          <button
                            onClick={() => handleDeleteSource(s.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-destructive hover:bg-destructive/10 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={handleScan}
                disabled={scanning || selectedSources.size === 0}
                className="w-full gap-2"
                size="sm"
              >
                {scanning ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                {scanning ? 'Scan...' : 'Scanner'}
              </Button>
            </div>

            {/* Add source dialog */}
            <Dialog open={addSourceOpen} onOpenChange={setAddSourceOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Plus className="h-3.5 w-3.5" /> Ajouter une source
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une source de scraping</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nom de la source</label>
                    <Input
                      value={newSource.name}
                      onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                      placeholder="Ex: Avito Agadir Particulier"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">URL</label>
                    <Input
                      value={newSource.url}
                      onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                      placeholder="https://www.avito.ma/..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleAddSource} className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* ─── Main Zone ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-4">
            <Tabs defaultValue="results">
              <TabsList>
                <TabsTrigger value="results" className="gap-1.5">
                  <Search className="h-3.5 w-3.5" /> Résultats ({filteredLeads.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Historique
                </TabsTrigger>
              </TabsList>

              {/* ─── Tab: Results ──────────────────────────────────────── */}
              <TabsContent value="results" className="space-y-4">
                {/* Search bar */}
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 max-w-md">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un lead..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>

                {/* Table */}
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Aucun lead trouvé</p>
                    <p className="text-sm mt-1">Lancez un scan pour récupérer des leads</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Source</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Titre</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Prix</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Localisation</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Téléphone</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredLeads.map(lead => (
                            <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${sourceColors[lead.source.toLowerCase()] || 'bg-muted text-muted-foreground'}`}>
                                  {sourceIcons[lead.source.toLowerCase()] || '🌐'} {lead.source}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[220px]">{lead.title || '—'}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-heading text-sm font-bold text-primary">{formatPrice(lead.price)}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" /> {lead.city || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Tag className="h-3 w-3" /> {lead.type || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {lead.phone ? (
                                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                                    <Phone className="h-3 w-3" /> {lead.phone}
                                  </a>
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  {lead.url && (
                                    <a
                                      href={lead.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" /> Voir
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* ─── Tab: History ──────────────────────────────────────── */}
              <TabsContent value="history" className="space-y-4">
                {scanHistory.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Aucun historique</p>
                    <p className="text-sm mt-1">L'historique des scans apparaîtra ici</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Sources</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Leads</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Durée</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {scanHistory.map((h, i) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 text-sm text-foreground">{h.date}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{h.sources}</td>
                              <td className="px-4 py-3">
                                <Badge variant="default" className="text-[10px]">{h.leads}</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{h.duration}</td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 text-sm text-success">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ─── Console Live ───────────────────────────────────────────── */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => setConsoleOpen(!consoleOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/50 hover:bg-muted/80 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              Console Live
              {logs.length > 0 && (
                <Badge variant="secondary" className="text-[10px]">{logs.length}</Badge>
              )}
            </span>
            {consoleOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
          </button>
          {consoleOpen && (
            <div
              ref={consoleRef}
              className="h-48 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-background"
            >
              {logs.length === 0 ? (
                <p className="text-muted-foreground italic">En attente d'un scan...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'success' ? 'text-success' :
                      log.type === 'error' ? 'text-destructive' :
                      log.type === 'warning' ? 'text-warning' :
                      'text-foreground'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
