import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/StatCard';
import AvatarInitials from '@/components/AvatarInitials';
import PageTransition from '@/components/PageTransition';
import MotionCard from '@/components/MotionCard';
import {
  DollarSign, Building2, Users, FileSignature, TrendingUp, Calendar,
  Phone, MessageSquare, ArrowUpRight, Clock, AlertTriangle, CheckCircle2,
  Eye, MapPin
} from 'lucide-react';
import { mockProperties, mockContacts, mockTransactions, mockNotifications, formatMAD } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const salesData = [
  { month: 'Sep', ventes: 3, locations: 5 },
  { month: 'Oct', ventes: 5, locations: 4 },
  { month: 'Nov', ventes: 4, locations: 6 },
  { month: 'Déc', ventes: 7, locations: 3 },
  { month: 'Jan', ventes: 6, locations: 8 },
  { month: 'Fév', ventes: 8, locations: 5 },
];

const agentPerf = [
  { name: 'Amin B.', ventes: 12, ca: 2400000 },
  { name: 'Sarah I.', ventes: 9, ca: 1800000 },
  { name: 'Khalil A.', ventes: 7, ca: 1500000 },
  { name: 'Fatima Z.', ventes: 5, ca: 900000 },
  { name: 'Youssef T.', ventes: 4, ca: 750000 },
];

const sourceData = [
  { name: 'WhatsApp', value: 35 },
  { name: 'Avito', value: 25 },
  { name: 'Facebook', value: 20 },
  { name: 'Direct', value: 15 },
  { name: 'Site web', value: 5 },
];

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 51%)', 'hsl(0, 72%, 51%)'];

const todayVisits = [
  { time: '09:00', client: 'Mohammed El Fassi', bien: 'Apt Vue Mer Founty', agent: 'Amin B.' },
  { time: '11:30', client: 'Pierre Dupont', bien: 'Villa Moderne Marina', agent: 'Sarah I.' },
  { time: '14:00', client: 'Samira Alaoui', bien: 'Apt Haut Founty', agent: 'Fatima Z.' },
  { time: '16:30', client: 'Ahmed Ouazzani', bien: 'Riad Charaf', agent: 'Khalil A.' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const availableProps = mockProperties.filter(p => p.status === 'Disponible').length;
  const totalCA = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Voici un aperçu de votre activité immobilière aujourd'hui
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "CA Mensuel", value: formatMAD(totalCA), icon: DollarSign, variant: "primary" as const, trend: { value: 12, positive: true }, subtitle: "Février 2026" },
            { title: "Biens Actifs", value: availableProps, icon: Building2, variant: "accent" as const, trend: { value: 8, positive: true }, subtitle: `${mockProperties.length} total` },
            { title: "Contacts", value: mockContacts.length, icon: Users, variant: "default" as const, trend: { value: 15, positive: true }, subtitle: "3 nouveaux cette semaine" },
            { title: "Mandats Signés", value: mockTransactions.length, icon: FileSignature, variant: "warning" as const, trend: { value: 5, positive: true }, subtitle: "Ce mois" },
          ].map((card, i) => (
            <MotionCard key={card.title} index={i}>
              <StatCard {...card} />
            </MotionCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionCard index={4} className="lg:col-span-2">
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
            </div>
          </MotionCard>

          <MotionCard index={5}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-primary" />
                Sources des Leads
              </h3>
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
            </div>
          </MotionCard>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MotionCard index={6}>
            <div className="rounded-lg border border-border bg-card p-5 card-shadow h-full">
              <h3 className="font-heading text-sm font-semibold text-card-foreground flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary" />
                Visites Aujourd'hui
              </h3>
              <div className="space-y-3">
                {todayVisits.map((v, i) => (
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
                ))}
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
                {agentPerf.map((a, i) => (
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
                ))}
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
