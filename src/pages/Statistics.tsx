import React from 'react';
import PageTransition from '@/components/PageTransition';
import { BarChart3, TrendingUp, Users, DollarSign, Download, FileText, Phone } from 'lucide-react';
import StatCard from '@/components/StatCard';
import AvatarInitials from '@/components/AvatarInitials';
import { formatMAD } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStatistics } from '@/hooks/useQueries';
import { StatCardSkeleton, ChartSkeleton } from '@/components/Skeletons';

const Statistics: React.FC = () => {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading || !stats) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <ChartSkeleton height={280} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" /> Statistiques & Reporting
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Performance de l'agence — {stats.periode}</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> Exporter PDF
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="CA Total" value={formatMAD(stats.caTotal)} icon={DollarSign} variant="primary" trend={{ value: 18, positive: true }} />
          <StatCard title="Transactions" value={stats.transactions} icon={FileText} variant="accent" trend={{ value: 12, positive: true }} />
          <StatCard title="Appels" value={stats.appels} icon={Phone} variant="default" />
          <StatCard title="Taux Transfo" value={stats.tauxTransfo} icon={TrendingUp} variant="warning" />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 card-shadow">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" /> Performance par Agent
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.agents}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="ventes" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Ventes" />
              <Bar dataKey="visites" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} name="Visites" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card card-shadow overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-card-foreground">Classement Agents</h2>
          </div>
          <div className="divide-y divide-border">
            {stats.agents.map((a, i) => (
              <div key={a.name} className="flex items-center gap-4 px-5 py-3 hover:bg-background-secondary transition-colors">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
                <AvatarInitials name={a.name} />
                <div className="flex-1"><p className="text-sm font-medium text-card-foreground">{a.name}</p></div>
                <div className="text-right text-xs"><p className="font-semibold text-primary">{formatMAD(a.ca)}</p><p className="text-muted-foreground">{a.ventes} ventes • {a.appels} appels</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Statistics;
