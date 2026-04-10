import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import AvatarInitials from '@/components/AvatarInitials';
import PageTransition from '@/components/PageTransition';
import MotionCard from '@/components/MotionCard';
import { StatCardSkeleton, ChartSkeleton } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DollarSign, Building2, Users, FileSignature, TrendingUp, Calendar,
  Phone, MessageSquare, ArrowUpRight, Clock, AlertTriangle, CheckCircle2,
  Eye, MapPin, Zap, Globe, Target
} from 'lucide-react';
import { formatMAD } from '@/data/mockData';
import type { Notification } from '@/data/mockData';
import { mockNotifications } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useProperties, useContacts, useTransactions } from '@/hooks/useQueries';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 51%)', 'hsl(0, 72%, 51%)'];

const fallbackLeadsStats = {
  total: 10164,
  avec_phone: 9484,
  avec_phone_pct: 93.3,
  recent_7j: 863,
  recent_30j: 2085,
  bonnes_affaires: 1777,
  by_source: [
    { source: 'avito', count: 10015 },
    { source: 'mubawab', count: 142 },
  ],
  by_ville: [
    { ville: 'Agadir', count: 8596, prix_m2_moyen: 15315, prix_moyen: 916088 },
    { ville: 'Tiznit', count: 400, prix_m2_moyen: 8200, prix_moyen: 450000 },
    { ville: 'Inezgane', count: 520, prix_m2_moyen: 10200, prix_moyen: 620000 },
    { ville: 'Taroudant', count: 350, prix_m2_moyen: 7500, prix_moyen: 380000 },
    { ville: 'Aït Melloul', count: 298, prix_m2_moyen: 9800, prix_moyen: 540000 },
  ],
  by_type: [
    { type_bien: 'appartement', count: 5200, prix_moyen: 750000 },
    { type_bien: 'villa', count: 1800, prix_moyen: 2100000 },
    { type_bien: 'terrain', count: 1500, prix_moyen: 500000 },
    { type_bien: 'local commercial', count: 900, prix_moyen: 1200000 },
    { type_bien: 'maison', count: 764, prix_moyen: 950000 },
  ],
  prix: { min: 50000, max: 25000000, moyen: 916088 },
  prix_m2: { min: 1000, max: 80000, moyen: 15315 },
  scores: { bonne_affaire_70plus: 1777, normal_50_70: 6200, cher_moins_50: 2187 },
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: leadsStats, isError: leadsStatsError } = useQuery({
    queryKey: ['leads-stats'],
    queryFn: () => api.leads.stats(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: fallbackLeadsStats,
  });
  const isLeadsDemo = leadsStatsError || !leadsStats || leadsStats === fallbackLeadsStats;

  const loading = propsLoading || contactsLoading || txLoading;

  const availableProps = properties.filter(p => p.status === 'Disponible').length;
  const totalCA = transactions.reduce((sum, t) => sum + t.amount, 0);

  const salesData = useMemo(() => {
    const months: Record<string, { ventes: number; locations: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!months[key]) months[key] = { ventes: 0, locations: 0 };
      if (t.type === 'Vente') months[key].ventes++;
      else months[key].locations++;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key]) => {
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
        return { month: label.charAt(0).toUpperCase() + label.slice(1), ...months[key] };
      });
  }, [transactions]);

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    contacts.forEach(c => { sources[c.type] = (sources[c.type] || 0) + 1; });
    const total = contacts.length || 1;
    return Object.entries(sources).map(([name, count]) => ({
      name, value: Math.round((count / total) * 100),
    }));
  }, [contacts]);

  const agentPerf = useMemo(() => {
    const agents: Record<string, { ventes: number; ca: number }> = {};
    transactions.forEach(t => {
      if (!agents[t.agentId]) agents[t.agentId] = { ventes: 0, ca: 0 };
      agents[t.agentId].ventes++;
      agents[t.agentId].ca += t.amount;
    });
    return Object.entries(agents).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.ca - a.ca).slice(0, 5);
  }, [transactions]);

  const newContactsThisWeek = contacts.filter(c => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const todayVisits = useMemo(() => {
    const times = ['09:00', '10:30', '11:30', '14:00'];
    const agents = ['Amin B.', 'Sarah I.', 'Fatima Z.', 'Khalil A.'];
    return contacts
      .filter(c => c.type === 'Acquéreur')
      .slice(0, 4)
      .map((c, i) => ({
        time: times[i] || '17:00',
        client: c.name,
        bien: properties[i]?.title || 'Bien immobilier',
        agent: agents[i % agents.length],
      }));
  }, [contacts, properties]);

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div><Skeleton className="h-7 w-56" /><Skeleton className="h-4 w-72 mt-2" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartSkeleton height={240} />
            <ChartSkeleton height={240} />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Voici un aperçu de votre activité immobilière aujourd'hui
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "CA Total", value: formatMAD(totalCA), icon: DollarSign, variant: "primary" as const, subtitle: `${transactions.length} transactions` },
            { title: "Biens Actifs", value: availableProps, icon: Building2, variant: "accent" as const, subtitle: `${properties.length} total` },
            { title: "Contacts", value: contacts.length, icon: Users, variant: "default" as const, subtitle: `${newContactsThisWeek} nouveaux cette semaine` },
            { title: "Transactions", value: transactions.length, icon: FileSignature, variant: "warning" as const, subtitle: "En cours" },
          ].map((card, i) => (
            <MotionCard key={card.title} index={i}>
              <StatCard {...card} />
            </MotionCard>
          ))}
        </div>

        {/* Leads Stats from Scraping */}
        {leadsStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionCard index={4}>
              <StatCard title="Leads Scrapés" value={leadsStats.total?.toLocaleString('fr-FR') || '0'} subtitle="Région Souss-Massa" icon={Globe} variant="primary" />
            </MotionCard>
            <MotionCard index={5}>
              <StatCard title="Récents (7j)" value={leadsStats.recent_7j || 0} subtitle={`${leadsStats.recent_30j || 0} sur 30 jours`} icon={Zap} variant="accent" />
            </MotionCard>
            <MotionCard index={6}>
              <StatCard title="Bonnes Affaires" value={leadsStats.bonnes_affaires || 0} subtitle="Score ≥ 70%" icon={Target} variant="warning" />
            </MotionCard>
            <MotionCard index={7}>
              <StatCard title="Avec Téléphone" value={`${leadsStats.avec_phone_pct || 0}%`} subtitle={`${leadsStats.avec_phone || 0} leads`} icon={Phone} variant="default" />
            </MotionCard>
          </div>
        )}

        {/* Leads by city chart */}
        {leadsStats?.by_ville && leadsStats.by_ville.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MotionCard index={8}>
              <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
                <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  Leads par Ville
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={leadsStats.by_ville.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="ville" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </MotionCard>

            <MotionCard index={9}>
              <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
                <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-primary" />
                  Répartition par Type
                </h3>
                {leadsStats.by_type && leadsStats.by_type.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={leadsStats.by_type} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count" nameKey="type_bien" paddingAngle={3}>
                          {leadsStats.by_type.map((_: any, i: number) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 space-y-1.5">
                      {leadsStats.by_type.map((t: any, i: number) => (
                        <div key={t.type_bien} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="text-card-foreground capitalize">{t.type_bien}</span>
                          </div>
                          <span className="font-medium text-card-foreground">{t.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">Aucune donnée</div>
                )}
              </div>
            </MotionCard>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionCard index={10} className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Évolution des Transactions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">6 derniers mois</p>
                </div>
              </div>
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="ventes" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} strokeWidth={2} name="Ventes" />
                    <Area type="monotone" dataKey="locations" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.15} strokeWidth={2} name="Locations" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">Aucune donnée de transaction</div>
              )}
            </div>
          </MotionCard>

          <MotionCard index={5}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-primary" />
                Répartition Contacts
              </h3>
              {sourceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {sourceData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1.5">
                    {sourceData.map((s, i) => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                          <span className="text-card-foreground">{s.name}</span>
                        </div>
                        <span className="font-medium text-card-foreground">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">Aucun contact</div>
              )}
            </div>
          </MotionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionCard index={6}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary" />
                Visites Aujourd'hui
              </h3>
              <div className="space-y-3">
                {todayVisits.length > 0 ? todayVisits.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-background-secondary p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">{v.time}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{v.agent}</span>
                      </div>
                      <p className="text-sm font-medium text-card-foreground truncate">{v.client}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {v.bien}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune visite prévue</p>
                )}
              </div>
            </div>
          </MotionCard>

          <MotionCard index={7}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-primary" />
                Top Agents
              </h3>
              <div className="space-y-3">
                {agentPerf.length > 0 ? agentPerf.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      i === 0 ? 'bg-primary/20 text-primary' : i === 1 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                    }`}>{i + 1}</span>
                    <AvatarInitials name={a.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.ventes} ventes</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">{formatMAD(a.ca)}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune donnée</p>
                )}
              </div>
            </div>
          </MotionCard>

          <MotionCard index={8}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Alertes & Relances
              </h3>
              <div className="space-y-3">
                {mockNotifications.slice(0, 4).map(n => (
                  <div key={n.id} className="flex items-start gap-3 rounded-lg bg-background-secondary p-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      n.type === 'warning' ? 'bg-warning/15 text-warning' :
                      n.type === 'success' ? 'bg-success/15 text-success' :
                      n.type === 'urgent' ? 'bg-destructive/15 text-destructive' :
                      'bg-info/15 text-info'
                    }`}>
                      {n.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;