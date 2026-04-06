// =============================================================================
// JIBRIL IMMO PRO — MODULE MATCHING (Leads ↔ Contacts CRM)
// =============================================================================

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useContacts } from '@/hooks/useQueries';
import { api } from '@/lib/api';
import { mapContact } from '@/hooks/useQueries';
import { formatMAD } from '@/data/mockData';
import type { Contact } from '@/data/mockData';
import {
  Search, Zap, Users, Building2, MapPin, Banknote, Phone,
  Mail, ArrowRight, Star, Filter, RefreshCw, ChevronDown,
  ChevronUp, Eye, ExternalLink, Target, TrendingUp,
  Percent, Home, CheckCircle2, XCircle, Clock,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
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
}

interface MatchResult {
  lead: Lead;
  contact: Contact;
  score: number; // 0-100
  reasons: string[];
}

// ─── Matching Engine ─────────────────────────────────────────────────────────

function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_\s]+/g, ' ')
    .trim();
}

function normalizeType(type: string): string {
  const t = type.toLowerCase().trim();
  const map: Record<string, string> = {
    appartement: 'appartement',
    appart: 'appartement',
    apt: 'appartement',
    villa: 'villa',
    maison: 'villa',
    terrain: 'terrain',
    local: 'local commercial',
    'local commercial': 'local commercial',
    commerce: 'local commercial',
    riad: 'riad',
    bureau: 'bureau',
  };
  return map[t] || t;
}

function computeMatch(lead: Lead, contact: Contact): MatchResult | null {
  let score = 0;
  const reasons: string[] = [];

  // Only match buyers/tenants with leads
  if (contact.type !== 'Acquéreur' && contact.type !== 'Locataire') return null;

  // 1. Budget compatibility (40 points max)
  if (contact.budget && lead.price > 0) {
    const budgetMargin = 0.25; // ±25%
    const lower = contact.budget * (1 - budgetMargin);
    const upper = contact.budget * (1 + budgetMargin);
    if (lead.price >= lower && lead.price <= upper) {
      // Closer to budget = higher score
      const diff = Math.abs(lead.price - contact.budget) / contact.budget;
      const budgetScore = Math.round(40 * (1 - diff / budgetMargin));
      score += budgetScore;
      reasons.push(`Budget compatible (${formatMAD(lead.price)} vs ${formatMAD(contact.budget)})`);
    } else if (lead.price < lower) {
      // Under budget is OK, less points
      score += 15;
      reasons.push(`Sous budget (${formatMAD(lead.price)})`);
    } else {
      return null; // Over budget by more than 25% = no match
    }
  } else if (!contact.budget) {
    score += 10; // No budget specified = partial score
    reasons.push('Budget non spécifié');
  }

  // 2. City/Location (30 points max)
  if (lead.city) {
    const leadCity = normalizeCity(lead.city);
    const exigences = (contact.exigences || '').toLowerCase();
    const contactNotes = (contact.notes || '').toLowerCase();

    // Check if contact's requirements mention the city
    if (exigences.includes(leadCity) || contactNotes.includes(leadCity)) {
      score += 30;
      reasons.push(`Localisation : ${lead.city}`);
    } else {
      // Partial match if same general area
      score += 5;
    }
  }

  // 3. Property type (20 points max)
  if (lead.type) {
    const leadType = normalizeType(lead.type);
    const exigences = (contact.exigences || '').toLowerCase();
    const contactNotes = (contact.notes || '').toLowerCase();
    const combined = exigences + ' ' + contactNotes;

    if (combined.includes(leadType) || combined.includes(lead.type.toLowerCase())) {
      score += 20;
      reasons.push(`Type : ${lead.type}`);
    }
  }

  // 4. Recency bonus (10 points max)
  const leadAge = (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (leadAge <= 1) {
    score += 10;
    reasons.push('Lead récent (< 24h)');
  } else if (leadAge <= 7) {
    score += 5;
    reasons.push('Lead récent (< 7 jours)');
  }

  // Minimum threshold
  if (score < 20) return null;

  return { lead, contact, score: Math.min(score, 100), reasons };
}

function runMatching(leads: Lead[], contacts: Contact[]): MatchResult[] {
  const results: MatchResult[] = [];

  for (const lead of leads) {
    for (const contact of contacts) {
      const match = computeMatch(lead, contact);
      if (match) results.push(match);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─── Score Badge ─────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75 ? 'bg-success/15 text-success border-success/30' :
    score >= 50 ? 'bg-warning/15 text-warning border-warning/30' :
    'bg-muted text-muted-foreground border-border';

  return (
    <Badge variant="outline" className={`${color} font-semibold text-xs gap-1`}>
      <Percent className="h-3 w-3" />
      {score}%
    </Badge>
  );
}

// ─── Match Card ──────────────────────────────────────────────────────────────
function MatchCard({
  match,
  onViewDetails,
}: {
  match: MatchResult;
  onViewDetails: (m: MatchResult) => void;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-border/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header: Score + Lead title */}
          <div className="flex items-center gap-2 flex-wrap">
            <ScoreBadge score={match.score} />
            <span className="font-medium text-sm text-foreground truncate">
              {match.lead.title}
            </span>
          </div>

          {/* Two columns: Lead ↔ Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Lead side */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium uppercase tracking-wider">
                <Building2 className="h-3 w-3" /> Lead scrapé
              </div>
              <p className="text-foreground font-medium">{match.lead.title}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Banknote className="h-3 w-3" />
                {formatMAD(match.lead.price)}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {match.lead.city}{match.lead.quartier ? ` — ${match.lead.quartier}` : ''}
              </div>
              {match.lead.type && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Home className="h-3 w-3" />
                  {match.lead.type}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-start">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium uppercase tracking-wider text-xs">
                  <Users className="h-3 w-3" /> Contact CRM
                </div>
                <p className="text-foreground font-medium text-xs">{match.contact.name}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Badge variant="outline" className="text-[10px]">{match.contact.type}</Badge>
                </div>
                {match.contact.budget && (
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Banknote className="h-3 w-3" />
                    Budget: {formatMAD(match.contact.budget)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Phone className="h-3 w-3" />
                  {match.contact.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Contact info */}
          <div className="md:hidden space-y-1 text-xs border-t border-border/50 pt-2">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium uppercase tracking-wider">
              <Users className="h-3 w-3" /> Contact CRM
            </div>
            <p className="text-foreground font-medium">{match.contact.name}</p>
            {match.contact.budget && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Banknote className="h-3 w-3" />
                Budget: {formatMAD(match.contact.budget)}
              </div>
            )}
          </div>

          {/* Reasons */}
          <div className="flex flex-wrap gap-1">
            {match.reasons.map((r, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                {r}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onViewDetails(match)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Détails</TooltipContent>
          </Tooltip>
          {match.lead.phone && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                  <a href={`tel:${match.lead.phone}`}><Phone className="h-3.5 w-3.5" /></a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Appeler</TooltipContent>
            </Tooltip>
          )}
          {match.lead.url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                  <a href={match.lead.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voir l'annonce</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function MatchDetailModal({
  match,
  open,
  onClose,
}: {
  match: MatchResult | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Détail du matching
            <ScoreBadge score={match.score} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lead */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Lead scrapé
            </h4>
            <p className="font-medium text-sm">{match.lead.title}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Banknote className="h-3 w-3" /> {formatMAD(match.lead.price)}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.lead.city}</span>
              {match.lead.type && <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {match.lead.type}</span>}
              {match.lead.surface && <span>{match.lead.surface} m²</span>}
              {match.lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {match.lead.phone}</span>}
            </div>
            {match.lead.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">{match.lead.description}</p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-full p-2">
              <ArrowRight className="h-4 w-4 text-primary rotate-90" />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Contact CRM
            </h4>
            <p className="font-medium text-sm">{match.contact.name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] w-fit">{match.contact.type}</Badge>
              {match.contact.budget && (
                <span className="flex items-center gap-1"><Banknote className="h-3 w-3" /> {formatMAD(match.contact.budget)}</span>
              )}
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {match.contact.phone}</span>
              {match.contact.email && (
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {match.contact.email}</span>
              )}
            </div>
            {match.contact.exigences && (
              <p className="text-xs text-muted-foreground"><strong>Exigences :</strong> {match.contact.exigences}</p>
            )}
          </div>

          {/* Reasons */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Critères de correspondance
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {match.reasons.map((r, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-success" />
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {match.lead.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${match.lead.phone}`}><Phone className="h-3.5 w-3.5 mr-1.5" /> Appeler</a>
              </Button>
            )}
            {match.lead.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={match.lead.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Voir l'annonce
                </a>
              </Button>
            )}
            {match.contact.email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${match.contact.email}`}><Mail className="h-3.5 w-3.5 mr-1.5" /> Email</a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function Matching() {
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailModal, setDetailModal] = useState<MatchResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      const data = await api.leads.list();
      const mapped: Lead[] = (Array.isArray(data) ? data : []).map((l: any) => ({
        id: String(l.id),
        title: l.title || l.titre || '',
        price: l.price || l.prix || 0,
        city: l.city || l.ville || '',
        source: l.source || '',
        type: l.type || '',
        phone: l.phone || l.telephone || '',
        url: l.url || l.link || '',
        status: l.status || l.statut || 'new',
        created_at: l.created_at || new Date().toISOString(),
        photos: l.photos || [],
        surface: l.surface,
        bedrooms: l.bedrooms || l.chambres,
        bathrooms: l.bathrooms || l.sdb,
        rooms: l.rooms || l.pieces,
        description: l.description,
        quartier: l.quartier || l.neighborhood,
      }));
      setLeads(mapped);
    } catch {
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Run matching
  const matches = useMemo(() => runMatching(leads, contacts), [leads, contacts]);

  // Available cities & types for filters
  const cities = useMemo(() => {
    const set = new Set(matches.map((m) => m.lead.city).filter(Boolean));
    return Array.from(set).sort();
  }, [matches]);

  const types = useMemo(() => {
    const set = new Set(matches.map((m) => m.lead.type).filter(Boolean));
    return Array.from(set).sort();
  }, [matches]);

  // Filtered results
  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !m.lead.title.toLowerCase().includes(q) &&
          !m.contact.name.toLowerCase().includes(q) &&
          !m.lead.city.toLowerCase().includes(q)
        )
          return false;
      }
      if (minScore !== 'all') {
        const threshold = parseInt(minScore);
        if (m.score < threshold) return false;
      }
      if (cityFilter !== 'all' && m.lead.city !== cityFilter) return false;
      if (typeFilter !== 'all' && m.lead.type !== typeFilter) return false;
      return true;
    });
  }, [matches, search, minScore, cityFilter, typeFilter]);

  // Stats
  const stats = useMemo(() => {
    const excellent = matches.filter((m) => m.score >= 75).length;
    const good = matches.filter((m) => m.score >= 50 && m.score < 75).length;
    const uniqueContacts = new Set(matches.map((m) => m.contact.id)).size;
    const uniqueLeads = new Set(matches.map((m) => m.lead.id)).size;
    return { total: matches.length, excellent, good, uniqueContacts, uniqueLeads };
  }, [matches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  };

  const isLoading = contactsLoading || leadsLoading;

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Matching Leads ↔ CRM
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Rapprochement automatique des annonces scrapées avec vos contacts
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            title="Total matchs"
            value={stats.total}
            icon={<Target className="h-5 w-5" />}
            color="primary"
          />
          <StatCard
            title="Excellents (≥75%)"
            value={stats.excellent}
            icon={<Star className="h-5 w-5" />}
            color="success"
          />
          <StatCard
            title="Bons (≥50%)"
            value={stats.good}
            icon={<TrendingUp className="h-5 w-5" />}
            color="warning"
          />
          <StatCard
            title="Leads analysés"
            value={stats.uniqueLeads}
            icon={<Building2 className="h-5 w-5" />}
            color="info"
          />
          <StatCard
            title="Contacts matchés"
            value={stats.uniqueContacts}
            icon={<Users className="h-5 w-5" />}
            color="secondary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par annonce, contact ou ville…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={minScore} onValueChange={setMinScore}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Score min." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous scores</SelectItem>
              <SelectItem value="75">≥ 75%</SelectItem>
              <SelectItem value="50">≥ 50%</SelectItem>
              <SelectItem value="25">≥ 25%</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes villes</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Target className="h-12 w-12 opacity-40" />
              <p className="font-medium">Aucun matching trouvé</p>
              <p className="text-sm max-w-md">
                {leads.length === 0
                  ? "Aucun lead scrapé disponible. Lancez un scan depuis le module Scraping pour alimenter le matching."
                  : contacts.length === 0
                  ? "Aucun contact CRM disponible. Ajoutez des contacts avec un budget et des exigences."
                  : "Ajustez vos filtres ou enrichissez les exigences de vos contacts CRM (ville, type de bien) pour obtenir des résultats."}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
            {filtered.map((m, i) => (
              <MatchCard
                key={`${m.lead.id}-${m.contact.id}-${i}`}
                match={m}
                onViewDetails={setDetailModal}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <MatchDetailModal
          match={detailModal}
          open={!!detailModal}
          onClose={() => setDetailModal(null)}
        />
      </div>
    </PageTransition>
  );
}
