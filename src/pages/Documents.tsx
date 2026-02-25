import React from 'react';
import { PenTool, FileText, Shield, Download, Plus, FilePlus, Eye, Send, Lock } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const templates = [
  { id: '1', name: 'Mandat de Vente', category: 'Mandats', icon: FileText, description: 'Mandat simple ou exclusif conforme au droit marocain' },
  { id: '2', name: 'Contrat de Bail', category: 'Location', icon: FileText, description: 'Bail résidentiel conforme à la Loi 67-12' },
  { id: '3', name: 'Compromis de Vente', category: 'Vente', icon: FileText, description: 'Compromis avec conditions suspensives' },
  { id: '4', name: 'Offre d\'Achat', category: 'Vente', icon: FilePlus, description: 'Offre d\'achat formelle avec délai de validité' },
  { id: '5', name: 'État des Lieux', category: 'Location', icon: Eye, description: 'État des lieux d\'entrée et de sortie numérique' },
  { id: '6', name: 'Quittance de Loyer', category: 'Location', icon: FileText, description: 'Quittance mensuelle auto-générée' },
];

const recentDocs = [
  { name: 'Mandat Exclusif — Villa Marina', date: '22/02/2026', status: 'Signé', signedBy: 'Admin Jibril' },
  { name: 'Bail — Apt Haut Founty', date: '10/02/2026', status: 'En attente', signedBy: '' },
  { name: 'Compromis — Apt Founty', date: '15/02/2026', status: 'Signé', signedBy: 'Mohammed El Fassi' },
];

const categoryColors: Record<string, string> = {
  'Mandats': 'bg-primary/10 text-primary',
  'Location': 'bg-accent/10 text-accent',
  'Vente': 'bg-success/10 text-success',
};

const Documents: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <PenTool className="h-6 w-6 text-primary" />
            Documents & Signature
          </h1>
          <p className="text-sm text-muted-foreground mt-1">ProSign — Contrats marocains & signature électronique</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Créer un document
        </button>
      </div>

      {/* Templates */}
      <div>
        <h2 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Modèles de Contrats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-4 card-shadow hover:elevated-shadow transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{t.name}</h3>
                  <span className={`inline-block mt-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${categoryColors[t.category]}`}>{t.category}</span>
                  <p className="mt-2 text-xs text-muted-foreground">{t.description}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 rounded-md bg-primary/10 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                  <FilePlus className="h-3 w-3" /> Utiliser
                </button>
                <button className="flex items-center justify-center gap-1 rounded-md bg-muted py-1.5 px-3 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-3 w-3" /> Aperçu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="rounded-lg border border-border bg-card card-shadow">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Coffre-fort Numérique
          </h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="h-3 w-3" /> Sécurisé</span>
        </div>
        <div className="divide-y divide-border">
          {recentDocs.map((d, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-background-secondary transition-colors">
              <div className="rounded-lg bg-primary/10 p-2"><FileText className="h-4 w-4 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.date}{d.signedBy && ` • Signé par ${d.signedBy}`}</p>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${d.status === 'Signé' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{d.status}</span>
              <button className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
