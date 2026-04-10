// =============================================================================
// JIBRIL IMMO PRO — PAGE SCRAPING (PRODUCTION)
// =============================================================================

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PageTransition from '@/components/PageTransition';
import PhotoLightbox from '@/components/PhotoLightbox';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Globe, RefreshCw, Search, Play, Clock, CheckCircle2,
  AlertCircle, Phone, MapPin, Tag, ExternalLink, Trash2,
  Terminal, ChevronDown, ChevronUp, Eye, Plus,
  Database, Zap, Timer, Activity, Monitor, Brain,
  AlertTriangle, Settings, Download, Shield, Key,
  Grid3X3, List, LayoutList, Camera, Bed, Bath, Maximize,
  Building2, Home, MessageSquare, Edit, ChevronLeft, ChevronRight, Image, X,
} from 'lucide-react';

// ─── System Health Banner ────────────────────────────────────────────────────
interface ServiceStatus {
  name: string;
  status: string;
  message?: string;
}

function SystemHealthBanner() {
  const [services, setServices] = useState<Record<string, ServiceStatus>>({});

  const fetchHealth = useCallback(async () => {
    try {
      const data = await api.systemHealth();
      if (data?.services) setServices(data.services);
    } catch {
      setServices({});
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const indicators = [
    { key: 'scraper', icon: Monitor, fallbackName: 'Vision & Navigateur' },
    { key: 'database', icon: Database, fallbackName: 'Base de données' },
    { key: 'ia_config', icon: Brain, fallbackName: 'Configuration IA' },
  ];

  const ledColor = (status?: string) => {
    if (status === 'operational') return 'bg-green-500 shadow-[0_0_6px_hsl(142,71%,45%)]';
    if (status === 'error') return 'bg-red-500 shadow-[0_0_6px_hsl(0,84%,60%)]';
    return 'bg-muted-foreground/40';
  };

  return (
    <div className="flex items-center gap-6 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm flex-1">
      {indicators.map(({ key, icon: Icon, fallbackName }) => {
        const svc = services[key];
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-default">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${ledColor(svc?.status)}`} />
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{svc?.name || fallbackName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{svc?.name || fallbackName}</p>
              <p className="text-xs text-muted-foreground">
                {svc?.message || (svc?.status === 'operational' ? 'Service opérationnel' : svc?.status === 'error' ? 'Service en erreur' : 'Statut inconnu')}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

// ─── System Logs Panel ──────────────────────────────────────────────────────
interface SystemLog {
  timestamp: string;
  level: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
}

function SystemLogsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.systemLogs();
      setLogs(Array.isArray(data) ? data : data?.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchLogs();
  }, [open, fetchLogs]);

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.level === filter);

  const formatTimestamp = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('fr-FR'); } catch { return ts; }
  };

  const levelColor = (level: string) => {
    if (level === 'ERROR') return 'text-destructive';
    if (level === 'WARNING') return 'text-warning';
    return 'text-primary';
  };

  const downloadLogs = () => {
    const content = filtered.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jibril-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Console Système
          </SheetTitle>
        </SheetHeader>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          {(['ALL', 'ERROR', 'WARNING', 'INFO'] as const).map(level => (
            <Button
              key={level}
              size="sm"
              variant={filter === level ? 'default' : 'outline'}
              className="h-7 text-xs px-2.5"
              onClick={() => setFilter(level)}
            >
              {level === 'ALL' ? 'Tous' : level}
            </Button>
          ))}
          <div className="flex-1" />
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={downloadLogs}>
            <Download className="h-3 w-3" /> Exporter
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Terminal */}
        <div className="flex-1 overflow-y-auto bg-[hsl(var(--card))] p-4 font-mono text-xs space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground italic text-center py-8">
              {loading ? 'Chargement...' : 'Aucun log disponible'}
            </p>
          ) : (
            filtered.map((log, i) => (
              <div key={i} className="flex gap-2 py-0.5 hover:bg-muted/30 px-1 rounded">
                <span className="text-muted-foreground shrink-0">[{formatTimestamp(log.timestamp)}]</span>
                <span className={`shrink-0 font-bold ${levelColor(log.level)}`}>[{log.level}]</span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── IA Settings Modal ──────────────────────────────────────────────────────
interface IAAgent {
  name: string;
  api_key: string;
  model: string;
  active: boolean;
}

interface SystemSettings {
  agents: IAAgent[];
  vision_timeout: number;
  economy_mode: boolean;
}

interface ApiStatusEntry {
  name: string;
  provider: string;
  configured: boolean;
  connected: boolean;
  has_credit: boolean;
  balance: string;
  models: string[];
}

function ApiStatusSection() {
  const [apis, setApis] = useState<ApiStatusEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await api.settings.apiStatus();
      setApis(data?.apis || []);
    } catch {
      setApis([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const statusBadge = (entry: ApiStatusEntry) => {
    if (!entry.configured) return <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">Non configuré</Badge>;
    if (entry.connected) return <Badge className="bg-green-500/15 text-green-600 border-green-500/20 text-[10px]">Connecté</Badge>;
    return <Badge variant="destructive" className="text-[10px]">Déconnecté</Badge>;
  };

  const creditBadge = (entry: ApiStatusEntry) => {
    if (entry.has_credit) return <Badge className="bg-green-500/15 text-green-600 border-green-500/20 text-[10px]">{entry.balance}</Badge>;
    return <Badge variant="destructive" className="text-[10px]">{entry.balance || '$0.00'} — Épuisé</Badge>;
  };

  if (loading) return <div className="py-6 text-center text-sm text-muted-foreground">Chargement des API…</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> État des API
        </h3>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => fetchStatus(true)} disabled={refreshing}>
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} /> Rafraîchir
        </Button>
      </div>
      {apis.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">Aucune API détectée</div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">API</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Statut</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Crédit</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Modèles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apis.map((entry, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-foreground">{entry.name}</td>
                  <td className="px-3 py-2.5">{statusBadge(entry)}</td>
                  <td className="px-3 py-2.5">{creditBadge(entry)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {entry.models.map((m, j) => (
                        <span key={j} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{m}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function IASettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [settings, setSettings] = useState<SystemSettings>({
    agents: [],
    vision_timeout: 30,
    economy_mode: false,
  });
  const [activeTab, setActiveTab] = useState<'api-status' | 'agents' | 'system'>('api-status');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setLoading(true);
      api.settings.get()
        .then(data => {
          setSettings({
            agents: data?.agents || [],
            vision_timeout: data?.vision_timeout ?? 30,
            economy_mode: data?.economy_mode ?? false,
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.settings.save(settings as unknown as Record<string, unknown>);
      toast({ title: 'Paramètres sauvegardés' });
      onOpenChange(false);
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : 'Échec de la sauvegarde', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addAgent = () => {
    setSettings(prev => ({
      ...prev,
      agents: [...prev.agents, { name: '', api_key: '', model: '', active: true }],
    }));
  };

  const updateAgent = (index: number, field: keyof IAAgent, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      agents: prev.agents.map((a, i) => i === index ? { ...a, [field]: value } : a),
    }));
  };

  const removeAgent = (index: number) => {
    setSettings(prev => ({
      ...prev,
      agents: prev.agents.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuration du Système
          </DialogTitle>
          <DialogDescription>Gérez les agents IA et les paramètres système</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab('api-status')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'api-status'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="h-3.5 w-3.5 inline mr-1.5" />
            État des API
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'agents'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="h-3.5 w-3.5 inline mr-1.5" />
            Agents IA
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'system'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Shield className="h-3.5 w-3.5 inline mr-1.5" />
            Paramètres Système
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">Chargement...</div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {/* Tab: État des API */}
            {activeTab === 'api-status' && <ApiStatusSection />}
            {/* Tab: Agents IA */}
            {activeTab === 'agents' && (
              <div className="space-y-3">
                {settings.agents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun agent IA configuré</p>
                  </div>
                )}
                {settings.agents.map((agent, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Agent #{i + 1}</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={agent.active}
                          onCheckedChange={(v) => updateAgent(i, 'active', v)}
                        />
                        <button
                          onClick={() => removeAgent(i)}
                          className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nom</label>
                        <Input
                          value={agent.name}
                          onChange={e => updateAgent(i, 'name', e.target.value)}
                          placeholder="Ex: DeepSeek"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Modèle</label>
                        <Input
                          value={agent.model}
                          onChange={e => updateAgent(i, 'model', e.target.value)}
                          placeholder="Ex: deepseek-chat"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Key className="h-3 w-3" /> Clé API
                      </label>
                      <Input
                        type="password"
                        value={agent.api_key}
                        onChange={e => updateAgent(i, 'api_key', e.target.value)}
                        placeholder="sk-..."
                        className="mt-1 h-8 text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={addAgent}>
                  <Plus className="h-3.5 w-3.5" /> Ajouter un Agent
                </Button>
              </div>
            )}

            {/* Tab: System */}
            {activeTab === 'system' && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground">Timeout Vision (sec)</label>
                  <Input
                    type="number"
                    value={settings.vision_timeout}
                    onChange={e => setSettings(prev => ({ ...prev, vision_timeout: parseInt(e.target.value) || 30 }))}
                    className="mt-1 max-w-[200px]"
                    min={5}
                    max={300}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Temps max d'attente pour l'analyse d'image par IA</p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Mode Économie</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Réduit les appels IA pour économiser les crédits</p>
                  </div>
                  <Switch
                    checked={settings.economy_mode}
                    onCheckedChange={v => setSettings(prev => ({ ...prev, economy_mode: v }))}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border pt-3 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  photos?: string[];
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  description?: string;
  quartier?: string;
  date_publication?: string;
  score_bonne_affaire?: number | null;
  ai_score?: number | null;
  ai_description?: string;
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

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
}

function mapLeadFromApi(l: any): Lead {
  return {
    id: String(l.id),
    title: l.titre || l.title || '',
    price: l.prix || l.price || 0,
    city: l.ville || l.city || l.localisation || '',
    source: l.source || '',
    type: l.type_bien || l.type || '',
    phone: l.phone || l.telephone || '',
    url: l.url || '',
    status: l.status || 'new',
    created_at: l.date_scraping || l.created_at || new Date().toISOString(),
    photos: l.photos || l.images || [],
    surface: l.surface || l.superficie || 0,
    bedrooms: l.chambres || l.bedrooms || 0,
    bathrooms: l.salles_de_bain || l.bathrooms || 0,
    rooms: l.pieces || l.rooms || 0,
    description: l.description || '',
    quartier: l.quartier || '',
    date_publication: l.date_publication || null,
    score_bonne_affaire: l.score_bonne_affaire ?? null,
    ai_score: l.ai_score ?? null,
    ai_description: l.ai_description || '',
  };
}

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
  const [totalLeads, setTotalLeads] = useState(0);
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
  const [logsOpen, setLogsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detail'>('grid');
  const [sourceFilter, setSourceFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [bonneAffaireFilter, setBonneAffaireFilter] = useState(false);
  const [sortBy, setSortBy] = useState('date_publication');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const LEADS_PER_PAGE = 12;

  const consoleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const LOCAL_SOURCES_KEY = 'jibril_local_sources';

  const saveLocalSources = (s: Source[]) => {
    try { localStorage.setItem(LOCAL_SOURCES_KEY, JSON.stringify(s)); } catch {}
  };
  const loadLocalSources = (): Source[] => {
    try { return JSON.parse(localStorage.getItem(LOCAL_SOURCES_KEY) || '[]'); } catch { return []; }
  };

  // ─── Load data ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sourcesData, leadsResponse] = await Promise.all([
        api.sources.list().catch(() => null),
        api.leads.list({ limit: LEADS_PER_PAGE, offset: 0, sort: sortBy, order: sortOrder }).catch(() => ({ data: [], total: 0 })),
      ]);
      if (sourcesData) {
        const apiSources = Array.isArray(sourcesData) ? sourcesData : sourcesData?.results || [];
        setSources(apiSources);
        saveLocalSources(apiSources);
      } else {
        setSources(loadLocalSources());
      }
      const raw = leadsResponse?.data || (Array.isArray(leadsResponse) ? leadsResponse : []);
      setLeads(raw.map(mapLeadFromApi));
      setTotalLeads(leadsResponse?.total || raw.length);
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
    const localSource: Source = {
      id: `local-${Date.now()}`,
      name,
      url,
      active: true,
      created_at: new Date().toISOString(),
    };
    try {
      const created = await api.sources.create({ name, url, active: true });
      setSources(prev => {
        const updated = [...prev, { ...localSource, ...created }];
        saveLocalSources(updated);
        return updated;
      });
      toast({ title: 'Source ajoutée', description: `"${name}" a été ajoutée` });
    } catch {
      setSources(prev => {
        const updated = [...prev, localSource];
        saveLocalSources(updated);
        return updated;
      });
      toast({ title: 'Source ajoutée (local)', description: `"${name}" ajoutée localement` });
    }
    setNewSource({ name: '', url: '' });
    setAddSourceOpen(false);
  };

  // ─── Delete custom source ──────────────────────────────────────────────
  const handleDeleteSource = async (id: string) => {
    try {
      await api.sources.delete(id);
    } catch { /* fallback local */ }
    setSources(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveLocalSources(updated);
      return updated;
    });
    toast({ title: 'Source supprimée' });
  };

  // ─── Toggle source active/inactive ─────────────────────────────────────
  const handleToggleSourceActive = async (source: Source) => {
    try {
      await api.sources.update(source.id, { active: !source.active });
    } catch { /* fallback local */ }
    setSources(prev => {
      const updated = prev.map(s => s.id === source.id ? { ...s, active: !s.active } : s);
      saveLocalSources(updated);
      return updated;
    });
    toast({ title: source.active ? 'Source désactivée' : 'Source activée' });
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
        const count = result?.details?.new_leads || result?.leads_count || result?.count || 0;
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
      const leadsResponse = await api.leads.list({ limit: LEADS_PER_PAGE, offset: 0, sort: sortBy, order: sortOrder });
      const raw = leadsResponse?.data || (Array.isArray(leadsResponse) ? leadsResponse : []);
      setLeads(raw.map(mapLeadFromApi));
      setTotalLeads(leadsResponse?.total || raw.length);
      setCurrentPage(1);
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

  // ─── Fetch leads with server-side filters/pagination ─────────────────
  const fetchLeadsPage = useCallback(async (page: number) => {
    try {
      const params: Record<string, any> = {
        limit: LEADS_PER_PAGE,
        offset: (page - 1) * LEADS_PER_PAGE,
        sort: sortBy,
        order: sortOrder,
      };
      if (searchQuery) params.search = searchQuery;
      if (sourceFilter) params.source = sourceFilter;
      if (cityFilter) params.ville = cityFilter;
      if (typeFilter) params.type_bien = typeFilter;
      if (bonneAffaireFilter) params.bonne_affaire = true;

      const response = await api.leads.list(params);
      const raw = response?.data || (Array.isArray(response) ? response : []);
      setLeads(raw.map(mapLeadFromApi));
      setTotalLeads(response?.total || raw.length);
    } catch { /* keep existing leads */ }
  }, [searchQuery, sourceFilter, cityFilter, typeFilter, bonneAffaireFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (!loading) {
      setCurrentPage(1);
      fetchLeadsPage(1);
    }
  }, [searchQuery, sourceFilter, cityFilter, typeFilter, bonneAffaireFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (!loading && currentPage > 1) {
      fetchLeadsPage(currentPage);
    }
  }, [currentPage]);

  const totalPages = Math.ceil(totalLeads / LEADS_PER_PAGE);

  const uniqueCities = useMemo(() => [...new Set(leads.map(l => l.city).filter(Boolean))], [leads]);
  const uniqueTypes = useMemo(() => [...new Set(leads.map(l => l.type).filter(Boolean))], [leads]);
  const uniqueSources = useMemo(() => [...new Set(leads.map(l => l.source).filter(Boolean))], [leads]);

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
        {/* ─── System Health Banner + Actions ────────────────────────── */}
        <div className="flex items-center gap-2">
          <SystemHealthBanner />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setLogsOpen(true)}
            title="Console Système"
          >
            <AlertTriangle className="h-4 w-4 text-warning" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSettingsOpen(true)}
            title="Configuration IA"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Panels */}
        <SystemLogsPanel open={logsOpen} onOpenChange={setLogsOpen} />
        <IASettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />

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
          <StatCard title="Total Leads" value={totalLeads.toLocaleString('fr-FR')} subtitle="Région Souss-Massa" icon={Database} variant="primary" />
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
                    <DialogDescription>Renseignez le nom et l'URL de la source</DialogDescription>
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
                  <Search className="h-3.5 w-3.5" /> Résultats ({totalLeads})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Historique
                </TabsTrigger>
              </TabsList>

              {/* ─── Tab: Results ──────────────────────────────────────── */}
              <TabsContent value="results" className="space-y-4">
                {/* Filters + View Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 min-w-[200px] max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher un lead..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                  </div>
                  <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
                    <option value="">Toutes sources</option>
                    {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
                    <option value="">Toutes villes</option>
                    {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
                    <option value="">Tous types</option>
                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
                    <option value="date_publication">Plus récents</option>
                    <option value="score_bonne_affaire">Meilleures affaires</option>
                    <option value="prix">Prix croissant</option>
                    <option value="ai_score">Score IA</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={bonneAffaireFilter} onCheckedChange={(v) => setBonneAffaireFilter(!!v)} />
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">🏷️ Bonnes affaires</span>
                  </label>
                  <div className="flex rounded-lg border border-border bg-card p-0.5">
                    <button onClick={() => setViewMode('grid')} className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Grille"><Grid3X3 className="h-4 w-4" /></button>
                    <button onClick={() => setViewMode('list')} className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Cartes"><List className="h-4 w-4" /></button>
                    <button onClick={() => setViewMode('detail')} className={`rounded-md p-1.5 ${viewMode === 'detail' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Liste détaillée"><LayoutList className="h-4 w-4" /></button>
                  </div>
                </div>

                {totalLeads === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">Aucun lead trouvé</p>
                    <p className="text-sm mt-1">Lancez un scan pour récupérer des leads</p>
                  </div>
                ) : (
                  <>
                    {/* Grid View */}
                    {viewMode === 'grid' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {leads.map(lead => (
                          <div key={lead.id} className="group rounded-lg border border-border bg-card card-shadow hover:elevated-shadow transition-all duration-300 overflow-hidden animate-fade-in">
                            <div className="relative h-44 bg-gradient-to-br from-primary/10 via-accent/5 to-muted overflow-hidden cursor-pointer" onClick={() => setSelectedLead(lead)}>
                              {lead.photos && lead.photos.length > 0 ? (
                                <img src={lead.photos[0]} alt={lead.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center"><Building2 className="h-16 w-16 text-primary/20" /></div>
                              )}
                              <div className="absolute top-3 left-3 flex gap-1.5">
                                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${sourceColors[lead.source.toLowerCase()] || 'bg-muted text-muted-foreground'}`}>
                                  {sourceIcons[lead.source.toLowerCase()] || '🌐'} {lead.source}
                                </span>
                                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusColors[lead.status] || 'bg-muted text-muted-foreground'}`}>
                                  {lead.status === 'new' ? 'Nouveau' : lead.status}
                                </span>
                              </div>
                              {lead.photos && lead.photos.length > 0 && (
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-foreground/60 backdrop-blur px-2 py-1 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="h-3 w-3" /> {lead.photos.length} photos
                                </div>
                              )}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-card/80 to-transparent h-16" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-1">{lead.title || 'Sans titre'}</h3>
                              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {lead.quartier ? `${lead.quartier}, ` : ''}{lead.city || '—'}
                              </p>
                              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                                {lead.surface ? <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {lead.surface} m²</span> : null}
                                {lead.bedrooms ? <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {lead.bedrooms}</span> : null}
                                {lead.rooms ? <span className="flex items-center gap-1">🚪 {lead.rooms} p.</span> : null}
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <p className="font-heading text-lg font-bold text-primary">{formatPrice(lead.price)}</p>
                              </div>
                              <div className="mt-3 flex gap-1.5 pt-3 border-t border-border">
                                <button onClick={() => setSelectedLead(lead)} className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                                  <Eye className="h-3 w-3" /> Détails
                                </button>
                                {lead.url && (
                                  <a href={lead.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1.5 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors">
                                    <ExternalLink className="h-3 w-3" /> Annonce
                                  </a>
                                )}
                                {lead.phone && (
                                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
                                    <Phone className="h-3 w-3" /> Appeler
                                  </a>
                                )}
                                <button onClick={() => handleDeleteLead(lead.id)} className="flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* List View (cards horizontaux) */}
                    {viewMode === 'list' && (
                      <div className="space-y-3">
                        {leads.map(lead => (
                          <div key={lead.id} className="group flex flex-col sm:flex-row rounded-lg border border-border bg-card card-shadow hover:elevated-shadow transition-all overflow-hidden animate-fade-in">
                            <div className="relative w-full sm:w-48 h-36 sm:h-auto bg-gradient-to-br from-primary/10 via-accent/5 to-muted shrink-0 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                              {lead.photos && lead.photos.length > 0 ? (
                                <img src={lead.photos[0]} alt={lead.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center"><Building2 className="h-12 w-12 text-primary/20" /></div>
                              )}
                              <div className="absolute top-2 left-2 flex gap-1">
                                <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${sourceColors[lead.source.toLowerCase()] || 'bg-muted text-muted-foreground'}`}>
                                  {sourceIcons[lead.source.toLowerCase()] || '🌐'} {lead.source}
                                </span>
                              </div>
                              {lead.photos && lead.photos.length > 0 && (
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-foreground/60 backdrop-blur px-1.5 py-0.5 text-[9px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="h-3 w-3" /> {lead.photos.length}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-1">{lead.title || 'Sans titre'}</h3>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {lead.quartier ? `${lead.quartier}, ` : ''}{lead.city || '—'}</p>
                                  </div>
                                  <p className="font-heading text-base font-bold text-primary whitespace-nowrap">{formatPrice(lead.price)}</p>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                  {lead.surface ? <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {lead.surface} m²</span> : null}
                                  {lead.bedrooms ? <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {lead.bedrooms} ch.</span> : null}
                                  {lead.bathrooms ? <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {lead.bathrooms} sdb</span> : null}
                                  {lead.type && <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {lead.type}</span>}
                                </div>
                                {lead.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-1">{lead.description}</p>}
                              </div>
                            </div>
                            <div className="flex sm:flex-col items-center justify-end gap-1.5 p-3 sm:border-l border-t sm:border-t-0 border-border shrink-0">
                              <button onClick={() => setSelectedLead(lead)} className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                                <Eye className="h-3 w-3" /> Détails
                              </button>
                              {lead.url && (
                                <a href={lead.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1.5 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors">
                                  <ExternalLink className="h-3 w-3" /> Annonce
                                </a>
                              )}
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
                                  <Phone className="h-3 w-3" /> Appeler
                                </a>
                              )}
                              <button onClick={() => handleDeleteLead(lead.id)} className="flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Detail View (table enrichie) */}
                    {viewMode === 'detail' && (
                      <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border bg-muted/50">
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Photo</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Source</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Titre</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Prix</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Localisation</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Surface</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Téléphone</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                  <td className="px-3 py-2">
                                    <div className="h-10 w-14 rounded bg-muted/30 overflow-hidden">
                                      {lead.photos && lead.photos.length > 0 ? (
                                        <img src={lead.photos[0]} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center"><Image className="h-4 w-4 text-muted-foreground/30" /></div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${sourceColors[lead.source.toLowerCase()] || 'bg-muted text-muted-foreground'}`}>
                                      {sourceIcons[lead.source.toLowerCase()] || '🌐'} {lead.source}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2"><p className="text-sm font-medium text-foreground line-clamp-1 max-w-[200px]">{lead.title || '—'}</p></td>
                                  <td className="px-3 py-2"><span className="font-heading text-sm font-bold text-primary">{formatPrice(lead.price)}</span></td>
                                  <td className="px-3 py-2"><span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> {lead.city || '—'}</span></td>
                                  <td className="px-3 py-2"><span className="text-sm text-muted-foreground">{lead.type || '—'}</span></td>
                                  <td className="px-3 py-2"><span className="text-sm text-muted-foreground">{lead.surface ? `${lead.surface} m²` : '—'}</span></td>
                                  <td className="px-3 py-2">
                                    {lead.phone ? (
                                      <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-sm text-primary hover:underline">
                                        <Phone className="h-3 w-3" /> {lead.phone}
                                      </a>
                                    ) : <span className="text-sm text-muted-foreground">—</span>}
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                      {lead.url && (
                                        <a href={lead.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                                          <ExternalLink className="h-3 w-3" /> Voir
                                        </a>
                                      )}
                                      <button onClick={() => handleDeleteLead(lead.id)} className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors">
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 card-shadow">
                        <p className="text-sm text-muted-foreground">
                          {(currentPage - 1) * LEADS_PER_PAGE + 1}–{Math.min(currentPage * LEADS_PER_PAGE, totalLeads)} sur {totalLeads}
                        </p>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce<(number | string)[]>((acc, p, i, arr) => {
                              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((p, i) =>
                              typeof p === 'string' ? (
                                <span key={`e${i}`} className="px-1 text-xs text-muted-foreground">…</span>
                              ) : (
                                <button key={p} onClick={() => setCurrentPage(p)} className={`min-w-[32px] rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${p === currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                                  {p}
                                </button>
                              )
                            )}
                          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-md p-2 text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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

      {/* ─── Lead Detail Modal ─────────────────────────────────────── */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedLead.title || 'Sans titre'}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${sourceColors[selectedLead.source.toLowerCase()] || 'bg-muted text-muted-foreground'}`}>
                    {sourceIcons[selectedLead.source.toLowerCase()] || '🌐'} {selectedLead.source}
                  </span>
                  <span className="text-xs">Scrapé le {new Date(selectedLead.created_at).toLocaleDateString('fr-FR')}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Photos gallery */}
              {selectedLead.photos && selectedLead.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedLead.photos.map((photo, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted/30">
                      <img src={photo} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Prix</p>
                    <p className="font-heading text-xl font-bold text-primary">{formatPrice(selectedLead.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Localisation</p>
                    <p className="text-sm text-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedLead.quartier ? `${selectedLead.quartier}, ` : ''}{selectedLead.city || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Type de bien</p>
                    <p className="text-sm text-foreground">{selectedLead.type || '—'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedLead.surface ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Surface</p>
                      <p className="text-sm text-foreground">{selectedLead.surface} m²</p>
                    </div>
                  ) : null}
                  {selectedLead.bedrooms ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Chambres</p>
                      <p className="text-sm text-foreground">{selectedLead.bedrooms}</p>
                    </div>
                  ) : null}
                  {selectedLead.phone ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                      <a href={`tel:${selectedLead.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedLead.phone}</a>
                    </div>
                  ) : null}
                </div>
              </div>

              {selectedLead.description && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground whitespace-pre-line">{selectedLead.description}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                {selectedLead.url && (
                  <a href={selectedLead.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    <ExternalLink className="h-4 w-4" /> Voir l'annonce originale
                  </a>
                )}
                {selectedLead.phone && (
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-success-foreground hover:opacity-90 transition-opacity">
                    <MessageSquare className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                <button onClick={() => { handleDeleteLead(selectedLead.id); setSelectedLead(null); }} className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
