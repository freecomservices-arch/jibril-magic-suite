import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { Bot, Upload, Camera, Eye, Star, Tag, FileText, Plus, Sparkles, CheckCircle2, Image, BarChart3 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import FileUpload from '@/components/FileUpload';
import StatCard from '@/components/StatCard';
import ServiceStatusBanner from '@/components/ServiceStatusBanner';

const mockVisitReports = [
  {
    id: '1', property: 'Apt Vue Mer Founty', agent: 'Amin B.', date: '24/02/2026',
    aiScore: 88, tags: ['3 pièces', 'Vue mer', 'Bon état', 'Cuisine équipée', 'Terrasse'],
    defects: ['Peinture écaillée salon', 'Joint salle de bain'],
    rooms: 5, clientInterest: 'Très intéressé',
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  },
  {
    id: '2', property: 'Villa Moderne Marina', agent: 'Sarah I.', date: '23/02/2026',
    aiScore: 95, tags: ['5 chambres', 'Piscine', 'Excellent état', 'Jardin', 'Garage double'],
    defects: [],
    rooms: 8, clientInterest: 'Offre en cours',
    photos: ['/placeholder.svg', '/placeholder.svg'],
  },
  {
    id: '3', property: 'Studio Talborjt', agent: 'Khalil A.', date: '22/02/2026',
    aiScore: 62, tags: ['1 pièce', 'Meublé', 'État moyen', 'Centre-ville'],
    defects: ['Humidité salle de bain', 'Carrelage fissuré cuisine', 'Volets abîmés'],
    rooms: 2, clientInterest: 'En réflexion',
    photos: ['/placeholder.svg'],
  },
];

const AIVision: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              IA & Vision
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Comptes rendus de visite automatiques par IA</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Upload className="h-4 w-4" /> Nouvelle visite
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Visites Analysées" value={47} icon={Eye} variant="primary" subtitle="Ce mois" />
          <StatCard title="Photos Traitées" value={312} icon={Image} variant="accent" subtitle="Total" />
          <StatCard title="Score Moyen" value="82%" icon={Sparkles} variant="default" />
          <StatCard title="Rapports Générés" value={38} icon={BarChart3} variant="warning" subtitle="PDF exportés" />
        </div>

        {/* Upload Zone */}
        {showUpload && (
          <div className="rounded-xl border border-border bg-card p-6 card-shadow animate-fade-in">
            <h2 className="font-heading text-base font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" /> Upload Photos & Vidéos de Visite
            </h2>
            <FileUpload
              accept="image/*,video/*"
              maxFiles={30}
              title="Glissez vos photos de visite ici"
              description="JPG, PNG, MP4 • Max 30 fichiers • L'IA analysera automatiquement les pièces"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Analyse IA auto</span>
                <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-accent" /> Tags automatiques</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-warning" /> Rapport PDF</span>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                <Sparkles className="h-4 w-4 inline mr-1" /> Lancer l'analyse IA
              </button>
            </div>
          </div>
        )}

        {!showUpload && (
          <div
            onClick={() => setShowUpload(true)}
            className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <div className="mx-auto w-fit rounded-2xl bg-primary/10 p-4 mb-4">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground">Déposer des photos ou vidéos de visite</h3>
            <p className="text-sm text-muted-foreground mt-1">Cliquez pour ouvrir la zone d'upload avec drag & drop</p>
          </div>
        )}

        {/* Recent Visit Reports */}
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Comptes Rendus Récents
          </h2>
          <div className="space-y-4">
            {mockVisitReports.map(r => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-5 card-shadow hover:elevated-shadow transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
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

                {/* Photo thumbnails */}
                <div className="mt-3 flex gap-2">
                  {r.photos.map((_, i) => (
                    <div key={i} className="h-16 w-16 rounded-lg bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
                      <Image className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  ))}
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                    <Plus className="h-4 w-4 text-muted-foreground" />
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
                {r.defects.length > 0 ? (
                  <div className="mt-3 rounded-md bg-warning/5 border border-warning/20 p-3">
                    <p className="text-xs font-medium text-warning mb-1">⚠️ Défauts détectés ({r.defects.length}) :</p>
                    {r.defects.map(d => (
                      <p key={d} className="text-xs text-muted-foreground">• {d}</p>
                    ))}
                  </div>
                ) : (
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
    </PageTransition>
  );
};

export default AIVision;
