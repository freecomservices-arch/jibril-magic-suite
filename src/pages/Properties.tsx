import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import {
  Building2, MapPin, Bed, Bath, Maximize, Search, Plus, Filter,
  Eye, Edit, Share2, FileText, MessageSquare, ChevronDown, Home, Grid3X3, List, Image, Camera
} from 'lucide-react';
import { mockProperties, formatMAD, CITIES, QUARTIERS, PROPERTY_TYPES } from '@/data/mockData';
import type { Property } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';
import PhotoLightbox from '@/components/PhotoLightbox';

const statusColors: Record<string, string> = {
  'Disponible': 'bg-success/15 text-success border-success/20',
  'Réservé': 'bg-warning/15 text-warning border-warning/20',
  'Vendu': 'bg-primary/15 text-primary border-primary/20',
  'Loué': 'bg-info/15 text-info border-info/20',
  'Archivé': 'bg-muted text-muted-foreground border-border',
};

const mandatColors: Record<string, string> = {
  'Exclusif': 'bg-primary/10 text-primary',
  'Semi-exclusif': 'bg-accent/10 text-accent',
  'Simple': 'bg-muted text-muted-foreground',
};

const typeIcons: Record<string, React.FC<any>> = {
  'Appartement': Building2,
  'Villa': Home,
  'Terrain': Grid3X3,
  'Local Commercial': Building2,
  'Riad': Home,
  'Bureau': Building2,
};

// Mock photos for demo lightbox
const demoPhotos = [
  { src: '/placeholder.svg', alt: 'Salon' },
  { src: '/placeholder.svg', alt: 'Chambre principale' },
  { src: '/placeholder.svg', alt: 'Cuisine' },
  { src: '/placeholder.svg', alt: 'Salle de bain' },
  { src: '/placeholder.svg', alt: 'Terrasse vue mer' },
];

const PropertyCard: React.FC<{ property: Property; onOpenGallery: () => void }> = ({ property, onOpenGallery }) => {
  const TypeIcon = typeIcons[property.type] || Building2;
  return (
    <div className="group rounded-lg border border-border bg-card card-shadow hover:elevated-shadow transition-all duration-300 overflow-hidden animate-fade-in">
      {/* Image — click to open lightbox */}
      <div
        className="relative h-44 bg-gradient-to-br from-primary/10 via-accent/5 to-muted overflow-hidden cursor-pointer"
        onClick={onOpenGallery}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="h-16 w-16 text-primary/20" />
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusColors[property.status]}`}>
            {property.status}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${mandatColors[property.mandat]}`}>
            {property.mandat}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-md bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-card-foreground">
            {property.transaction}
          </span>
        </div>
        {/* Photo count overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-foreground/60 backdrop-blur px-2 py-1 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-3 w-3" /> {property.photos.length || 5} photos
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-card/80 to-transparent h-16" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-1">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {property.quartier}, {property.city}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {property.surface} m²</span>
          {property.bedrooms && <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {property.bedrooms}</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.bathrooms}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-heading text-lg font-bold text-primary">
            {formatMAD(property.price)}
            {property.transaction === 'Location' && <span className="text-xs font-normal text-muted-foreground">/mois</span>}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-1.5 pt-3 border-t border-border">
          <button onClick={onOpenGallery} className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
            <Eye className="h-3 w-3" /> Voir
          </button>
          <button className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Edit className="h-3 w-3" /> Modifier
          </button>
          <button className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
            <MessageSquare className="h-3 w-3" /> WhatsApp
          </button>
          <button className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="h-3 w-3" /> PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const Properties: React.FC = () => {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = mockProperties.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.quartier.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter && p.city !== cityFilter) return false;
    if (typeFilter && p.type !== typeFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const openGallery = (propertyIndex: number) => {
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  return (
    <PageTransition>
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Biens Immobiliers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{mockProperties.length} biens • {filtered.length} affichés</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Ajouter un bien
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un bien..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
          <option value="">Toutes villes</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
          <option value="">Tous types</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none">
          <option value="">Tous statuts</option>
          {['Disponible', 'Réservé', 'Vendu', 'Loué', 'Archivé'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button onClick={() => setViewMode('grid')} className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} onOpenGallery={() => openGallery(i)} />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="property"
          icon={Building2}
          title="Aucun bien trouvé"
          description="Aucun bien ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou ajoutez un nouveau bien."
          actionLabel="Ajouter un bien"
          onAction={() => {}}
        />
      )}
    </div>

    {/* Photo Lightbox */}
    <PhotoLightbox
      photos={demoPhotos}
      initialIndex={lightboxIndex}
      open={lightboxOpen}
      onClose={() => setLightboxOpen(false)}
    />
    </PageTransition>
  );
};

export default Properties;
