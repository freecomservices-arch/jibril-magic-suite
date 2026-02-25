import React, { useState, useMemo } from 'react';
import PageTransition from '@/components/PageTransition';
import { Globe, Search, Users, Building2, CheckCircle2, Filter, Plus, RefreshCw, UserPlus, ExternalLink, Copy, X, Loader2, Trash2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Lead = {
  id: string;
  source: string;
  type: 'Bien' | 'Personne';
  title: string;
  price: string;
  phone: string;
  status: 'Nouveau' | 'Qualifié' | 'Doublon' | 'Assigné' | 'Importé';
  date: string;
  url?: string;
};

type ScrapingSource = {
  id: string;
  name: string;
  url: string;
  active: boolean;
};

const initialLeads: Lead[] = [
  { id: '1', source: 'Avito.ma', type: 'Bien', title: 'Appartement 3ch Agadir Founty', price: '1 600 000 DH', phone: '+212 6 XX XX XX XX', status: 'Nouveau', date: '25/02/2026', url: 'https://avito.ma/example1' },
  { id: '2', source: 'Mubawab', type: 'Bien', title: 'Villa avec piscine Marina', price: '5 200 000 DH', phone: '+212 6 XX XX XX XX', status: 'Qualifié', date: '24/02/2026', url: 'https://mubawab.ma/example2' },
  { id: '3', source: 'Facebook', type: 'Personne', title: 'MRE cherche investissement Agadir', price: '-', phone: '+33 6 XX XX XX XX', status: 'Nouveau', date: '24/02/2026', url: 'https://facebook.com/example3' },
  { id: '4', source: 'LinkedIn', type: 'Personne', title: 'Cadre expatrié — relocation Agadir', price: '-', phone: '+212 6 XX XX XX XX', status: 'Doublon', date: '23/02/2026', url: 'https://linkedin.com/example4' },
  { id: '5', source: 'Avito.ma', type: 'Bien', title: 'Terrain constructible Taghazout', price: '3 800 000 DH', phone: '+212 6 XX XX XX XX', status: 'Assigné', date: '23/02/2026', url: 'https://avito.ma/example5' },
];

const initialSources: ScrapingSource[] = [
  { id: 's1', name: 'Avito.ma', url: 'https://avito.ma', active: true },
  { id: 's2', name: 'Mubawab', url: 'https://mubawab.ma', active: true },
  { id: 's3', name: 'Facebook', url: 'https://facebook.com', active: true },
  { id: 's4', name: 'LinkedIn', url: 'https://linkedin.com', active: false },
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
  'Importé': 'bg-muted text-muted-foreground',
};

const randomTitles: Record<string, string[]> = {
  'Avito.ma': [
    'Appartement 2ch centre Agadir', 'Duplex vue mer Taghazout', 'Local commercial Hay Mohammadi',
    'Studio meublé Agadir Bay', 'Riad rénové Taroudant',
  ],
  'Mubawab': [
    'Villa contemporaine Sonaba', 'Appartement neuf Tilila', 'Penthouse Marina Agadir',
    'Terrain zone villa Aourir', 'Appartement F4 Dakhla',
  ],
  'Facebook': [
    'Famille MRE cherche villa', 'Investisseur cherche R+3', 'Retraité français cherche appart',
    'Couple cherche terrain Tamraght', 'Entrepreneur cherche local',
  ],
  'LinkedIn': [
    'DG expatrié relocation', 'Cadre IT remote Agadir', 'Consultant cherche bureau partagé',
    'Manager hôtelier cherche villa', 'Architecte cherche terrain projet',
  ],
};

const randomPrices = ['850 000 DH', '1 200 000 DH', '1 800 000 DH', '2 500 000 DH', '3 200 000 DH', '4 500 000 DH', '6 000 000 DH'];

const Scraping: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [sources, setSources] = useState<ScrapingSource[]>(initialSources);
  const [scanning, setScanning] = useState(false);

  // Filters
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filterSource !== 'all' && l.source !== filterSource) return false;
      if (filterType !== 'all' && l.type !== filterType) return false;
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) && !l.source.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [leads, filterSource, filterType, filterStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const biens = leads.filter(l => l.type === 'Bien').length;
    const doublons = leads.filter(l => l.status === 'Doublon').length;
    const qualifies = leads.filter(l => l.status === 'Qualifié' || l.status === 'Assigné').length;
    return { total, biens, doublons, qualifies };
  }, [leads]);

  // Scan simulation
  const handleScan = () => {
    setScanning(true);
    const activeSources = sources.filter(s => s.active);
    if (activeSources.length === 0) {
      toast.error('Aucune source active. Activez au moins une source.');
      setScanning(false);
      return;
    }

    toast.info('Scan en cours...', { duration: 2000 });

    setTimeout(() => {
      const newLeads: Lead[] = [];
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const src = activeSources[Math.floor(Math.random() * activeSources.length)];
        const type: 'Bien' | 'Personne' = src.name === 'Facebook' || src.name === 'LinkedIn' ? 'Personne' : 'Bien';
        const titles = randomTitles[src.name] || [`Lead depuis ${src.name}`];
        newLeads.push({
          id: `l${Date.now()}-${i}`,
          source: src.name,
          type,
          title: titles[Math.floor(Math.random() * titles.length)],
          price: type === 'Bien' ? randomPrices[Math.floor(Math.random() * randomPrices.length)] : '-',
          phone: '+212 6 XX XX XX XX',
          status: 'Nouveau',
          date: new Date().toLocaleDateString('fr-FR'),
          url: src.url + '/new-' + Date.now(),
        });
      }
      setLeads(prev => [...newLeads, ...prev]);
      setScanning(false);
      toast.success(`${count} nouveau(x) lead(s) détecté(s) !`);
    }, 2500);
  };

  // Import lead as contact
  const handleImport = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Importé' as const } : l));
    toast.success(`"${lead.title}" importé comme contact`);
  };

  // Delete lead
  const handleDelete = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    toast.success('Lead supprimé');
  };

  // Change status
  const handleStatusChange = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Statut changé en "${status}"`);
  };

  // Add source
  const handleAddSource = () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      toast.error('Nom et URL requis');
      return;
    }
    const newSource: ScrapingSource = {
      id: `s${Date.now()}`,
      name: newSourceName.trim(),
      url: newSourceUrl.trim(),
      active: true,
    };
    setSources(prev => [...prev, newSource]);
    if (!sourceIcons[newSource.name]) {
      sourceIcons[newSource.name] = '🌐';
    }
    if (!randomTitles[newSource.name]) {
      randomTitles[newSource.name] = [`Lead depuis ${newSource.name}`];
    }
    setNewSourceName('');
    setNewSourceUrl('');
    setShowAddSource(false);
    toast.success(`Source "${newSource.name}" ajoutée`);
  };

  // Toggle source
  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    toast.success('Source supprimée');
  };

  const clearFilters = () => {
    setFilterSource('all');
    setFilterType('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterSource !== 'all' || filterType !== 'all' || filterStatus !== 'all' || searchQuery !== '';

  const uniqueSources = useMemo(() => [...new Set(leads.map(l => l.source))], [leads]);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Scraping & Acquisition
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Leads scrapés depuis {sources.filter(s => s.active).length} source(s) active(s)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleScan} disabled={scanning}>
              {scanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              {scanning ? 'Scan en cours…' : 'Lancer un scan'}
            </Button>
            <Button onClick={() => setShowAddSource(true)}>
              <Plus className="h-4 w-4 mr-2" /> Ajouter source
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Leads Scrapés" value={stats.total} icon={Users} variant="primary" subtitle="Total" />
          <StatCard title="Biens Détectés" value={stats.biens} icon={Building2} variant="accent" />
          <StatCard title="Doublons" value={stats.doublons} icon={Copy} variant="warning" subtitle="Détectés" />
          <StatCard title="Qualifiés / Assignés" value={stats.qualifies} icon={CheckCircle2} variant="default" />
        </div>

        {/* Active Sources */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Sources configurées</h3>
          <div className="flex flex-wrap gap-2">
            {sources.map(s => (
              <div key={s.id} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${s.active ? 'border-primary/30 bg-primary/5 text-foreground' : 'border-border bg-muted text-muted-foreground'}`}>
                <span>{sourceIcons[s.name] || '🌐'}</span>
                <span className="font-medium">{s.name}</span>
                <button onClick={() => toggleSource(s.id)} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${s.active ? 'bg-success/15 text-success' : 'bg-muted-foreground/15 text-muted-foreground'}`}>
                  {s.active ? 'ON' : 'OFF'}
                </button>
                <button onClick={() => removeSource(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-lg border border-border bg-card card-shadow overflow-hidden">
          <div className="border-b border-border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Leads Récents
              <span className="text-xs font-normal text-muted-foreground">({filteredLeads.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs"
                />
              </div>
              <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-3.5 w-3.5 mr-1" /> Filtrer
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="h-3 w-3 mr-1" /> Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Filter bar */}
          {showFilters && (
            <div className="border-b border-border px-5 py-3 flex flex-wrap gap-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Source</Label>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {uniqueSources.map(s => <SelectItem key={s} value={s}>{sourceIcons[s] || '🌐'} {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Bien">Bien</SelectItem>
                    <SelectItem value="Personne">Personne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Statut</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Nouveau">Nouveau</SelectItem>
                    <SelectItem value="Qualifié">Qualifié</SelectItem>
                    <SelectItem value="Assigné">Assigné</SelectItem>
                    <SelectItem value="Doublon">Doublon</SelectItem>
                    <SelectItem value="Importé">Importé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
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
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      Aucun lead trouvé avec ces filtres.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(l => (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-sm">{sourceIcons[l.source] || '🌐'} {l.source}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${l.type === 'Bien' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground'}`}>
                          {l.type === 'Bien' ? <Building2 className="h-3 w-3 inline mr-0.5" /> : <Users className="h-3 w-3 inline mr-0.5" />}
                          {l.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-card-foreground max-w-xs truncate">{l.title}</td>
                      <td className="px-5 py-3 text-sm text-primary font-semibold">{l.price}</td>
                      <td className="px-5 py-3">
                        <Select value={l.status} onValueChange={(v) => handleStatusChange(l.id, v as Lead['status'])}>
                          <SelectTrigger className="h-6 w-24 border-0 p-0 text-[10px] font-semibold bg-transparent shadow-none">
                            <span className={`rounded-md px-2 py-0.5 ${statusColors[l.status]}`}>{l.status}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nouveau">Nouveau</SelectItem>
                            <SelectItem value="Qualifié">Qualifié</SelectItem>
                            <SelectItem value="Assigné">Assigné</SelectItem>
                            <SelectItem value="Doublon">Doublon</SelectItem>
                            <SelectItem value="Importé">Importé</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{l.date}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleImport(l)}
                            disabled={l.status === 'Importé'}
                            className="rounded-md bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Importer comme contact"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </button>
                          {l.url && (
                            <button
                              onClick={() => window.open(l.url, '_blank')}
                              className="rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              title="Voir source"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="rounded-md bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Source Modal */}
      <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une source de scraping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom de la source</Label>
              <Input value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="ex: Sarouty.ma" />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)} placeholder="https://sarouty.ma" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSource(false)}>Annuler</Button>
            <Button onClick={handleAddSource}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Scraping;
