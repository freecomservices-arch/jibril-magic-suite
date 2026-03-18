import React, { useState, useMemo, useEffect } from 'react';
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

const Scraping: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // API Base URL
  const API_URL = 'https://api.jibrilimmo.cloud/api';

  // Get auth token
  const getToken = () => localStorage.getItem('token');

  // Fetch sources
  const fetchSources = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/sources/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      }
    } catch (error) {
      console.error('Erreur fetch sources:', error);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/leads/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Erreur fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSources(), fetchLeads()]);
    };
    loadData();
  }, []);

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

  // Scan - API CALL
  const handleScan = async () => {
    setScanning(true);
    
    const activeSources = sources.filter(s => s.active);
    if (activeSources.length === 0) {
      toast.error('Aucune source active. Activez au moins une source.');
      setScanning(false);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/scan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          max_listings: 30,
          scan_delay: 5,
          max_pages: 3,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(`${data.count} nouveau(x) lead(s) détecté(s) !`);
        await fetchLeads();
      } else {
        toast.error(data.error || 'Erreur lors du scan');
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setScanning(false);
    }
  };

  // Import lead as contact
  const handleImport = async (lead: Lead) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/leads/${lead.id}/import/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          lead_id: lead.id,
          import_as: 'contact',
        }),
      });
      
      if (response.ok) {
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Importé' } : l));
        toast.success(`"${lead.title}" importé comme contact`);
      } else {
        toast.error('Erreur lors de l\'import');
      }
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/leads/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      if (response.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
        toast.success('Lead supprimé');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur delete:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  // Change status
  const handleStatusChange = async (id: string, status: Lead['status']) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/leads/${id}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        toast.success(`Statut changé en "${status}"`);
      } else {
        toast.error('Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('Erreur status:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  // Add source
  const handleAddSource = async () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      toast.error('Nom et URL requis');
      return;
    }
    
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/sources/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          name: newSourceName.trim(),
          url: newSourceUrl.trim(),
        }),
      });
      
      if (response.ok) {
        const newSource = await response.json();
        setSources(prev => [...prev, {
          id: String(newSource.id),
          name: newSource.name,
          url: newSource.url,
          active: newSource.active,
        }]);
        if (!sourceIcons[newSource.name]) {
          sourceIcons[newSource.name] = '🌐';
        }
        setNewSourceName('');
        setNewSourceUrl('');
        setShowAddSource(false);
        toast.success(`Source "${newSource.name}" ajoutée`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur add source:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  // Toggle source
  const toggleSource = async (id: string) => {
    try {
      const token = getToken();
      const source = sources.find(s => s.id === id);
      if (!source) return;
      
      const response = await fetch(`${API_URL}/sources/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          active: !source.active,
        }),
      });
      
      if (response.ok) {
        setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
      }
    } catch (error) {
      console.error('Erreur toggle source:', error);
    }
  };

  const removeSource = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/sources/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      if (response.ok) {
        setSources(prev => prev.filter(s => s.id !== id));
        toast.success('Source supprimée');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur remove source:', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const clearFilters = () => {
    setFilterSource('all');
    setFilterType('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = filterSource !== 'all' || filterType !== 'all' || filterStatus !== 'all' || searchQuery !== '';

  const uniqueSources = useMemo(() => [...new Set(leads.map(l => l.source))], [leads]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

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
