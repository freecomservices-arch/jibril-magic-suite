import React from 'react';
import { Bot, Upload, Camera, Eye, Star, Tag, FileText, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const mockVisitReports = [
  {
    id: '1', property: 'Apt Vue Mer Founty', agent: 'Amin B.', date: '24/02/2026',
    aiScore: 88, tags: ['3 pièces', 'Vue mer', 'Bon état', 'Cuisine équipée', 'Terrasse'],
    defects: ['Peinture écaillée salon', 'Joint salle de bain'],
    rooms: 5, clientInterest: 'Très intéressé',
  },
  {
    id: '2', property: 'Villa Moderne Marina', agent: 'Sarah I.', date: '23/02/2026',
    aiScore: 95, tags: ['5 chambres', 'Piscine', 'Excellent état', 'Jardin', 'Garage double'],
    defects: [],
    rooms: 8, clientInterest: 'Offre en cours',
  },
];

const AIVision: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            IA & Vision
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Comptes rendus de visite automatiques par IA</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Upload className="h-4 w-4" /> Nouvelle visite
        </button>
      </div>

      {/* Upload Zone */}
      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <div className="mx-auto w-fit rounded-2xl bg-primary/10 p-4 mb-4">
          <Camera className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-heading text-base font-semibold text-foreground">Déposer des photos ou vidéos de visite</h3>
        <p className="text-sm text-muted-foreground mt-1">L'IA analysera automatiquement les pièces, l'état et les équipements</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Upload className="h-4 w-4" /> Charger des fichiers
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
            <Camera className="h-4 w-4" /> Prendre une photo
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Analyse IA</span>
          <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-accent" /> Tags auto</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-warning" /> Rapport PDF</span>
        </div>
      </div>

      {/* Recent Visit Reports */}
      <div>
        <h2 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" /> Comptes Rendus Récents
        </h2>
        <div className="space-y-4">
          {mockVisitReports.map(r => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-5 card-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{r.property}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.agent} • {r.date} • {r.rooms} pièces détectées</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    r.aiScore >= 90 ? 'bg-success/15 text-success' : r.aiScore >= 70 ? 'bg-primary/15 text-primary' : 'bg-warning/15 text-warning'
                  }`}>
                    <Sparkles className="h-3 w-3 inline mr-1" />Score IA : {r.aiScore}%
                  </span>
                  <span className="rounded-md bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-semibold">{r.clientInterest}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Tag className="h-3 w-3" /> {tag}
                  </span>
                ))}
              </div>

              {/* Defects */}
              {r.defects.length > 0 && (
                <div className="mt-3 rounded-md bg-warning/5 border border-warning/20 p-3">
                  <p className="text-xs font-medium text-warning mb-1">⚠️ Défauts détectés :</p>
                  {r.defects.map(d => (
                    <p key={d} className="text-xs text-muted-foreground">• {d}</p>
                  ))}
                </div>
              )}

              {r.defects.length === 0 && (
                <div className="mt-3 rounded-md bg-success/5 border border-success/20 p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <p className="text-xs text-success font-medium">Aucun défaut détecté — Bien en excellent état</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <button className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                  <FileText className="h-3 w-3" /> Voir le rapport complet
                </button>
                <button className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Tag className="h-3 w-3" /> Modifier les tags
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIVision;
