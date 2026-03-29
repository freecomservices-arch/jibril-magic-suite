import React, { useState, useMemo, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import {
  Building2, MapPin, Bed, Bath, Maximize, Search, Plus, Filter,
  Eye, Edit, Share2, FileText, MessageSquare, ChevronDown, Home, Grid3X3, List, Image, Camera, LayoutList, Phone, Map, Trash2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatMAD, CITIES, QUARTIERS, PROPERTY_TYPES } from '@/data/mockData';
import type { Property } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';
import PhotoLightbox from '@/components/PhotoLightbox';
import PropertyMap from '@/components/PropertyMap';
import PropertyFormModal from '@/components/modals/CreatePropertyModal';
import { PropertyCardSkeleton, StatCardSkeleton } from '@/components/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

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

const demoPhotos = [
  { src: '/placeholder.svg', alt: 'Salon' },
  { src: '/placeholder.svg', alt: 'Chambre principale' },
  { src: '/placeholder.svg', alt: 'Cuisine' },
  { src: '/placeholder.svg', alt: 'Salle de bain' },
  { src: '/placeholder.svg', alt: 'Terrasse vue mer' },
];

const PropertyCard: React.FC<{ property: Property; onOpenGallery: () => void; onEdit: () => void; onDelete: () => void }> = ({ property, onOpenGallery, onEdit, onDelete }) => {
  const TypeIcon = typeIcons[property.type] || Building2;
  return (
    <div className="group rounded-lg border border-border bg-card card-shadow hover:elevated-shadow transition-all duration-300 overflow-hidden animate-fade-in">
      <div
        className="relative h-44 bg-gradient-to-br from-primary/10 via-accent/5 to-muted overflow-hidden cursor-pointer"
        onClick={onOpenGallery}
      >
        {property.photos && property.photos.length > 0 ? (
          <img src={property.photos[0]} alt={property.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeIcon className="h-16 w-16 text-primary/20" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusColors[property.status] || ''}`}>{property.status}</span>
          {property.mandat && <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${mandatColors[property.mandat] || ''}`}>{property.mandat}</span>}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-md bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-card-foreground">{property.transaction}</span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-foreground/60 backdrop-blur px-2 py-1 text-[10px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-3 w-3" /> {property.photos?.length || 0} photos
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-card/80 to-transparent h-16" />
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-1">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {property.quartier ? `${property.quartier}, ` : ''}{property.city}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          {property.surface && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {property.surface} m²</span>}
          {property.bedrooms && <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {property.bedrooms}</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.bathrooms}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-heading text-lg font-bold text-primary">
            {formatMAD(property.price)}
            {property.transaction === 'Location' && <span className="text-xs font-normal text-muted-foreground">/mois</span>}
          </p>
        </div>
        <div className="mt-3 flex gap-1.5 pt-3 border-t border-border">
          <button onClick={onOpenGallery} className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
            <Eye className="h-3 w-3" /> Voir
          </button>
          <button onClick={onEdit} className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Edit className="h-3 w-3" /> Modifier
          </button>
          <button className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
            <MessageSquare className="h-3 w-3" /> WhatsApp
          </button>
          <button className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="h-3 w-3" /> PDF
          </button>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors">
            <Trash2 className="h-3 w-3" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyListRow: React.FC<{ property: Property; onOpenGallery: () => void; onEdit: () => void; onDelete: () => void }> = ({ property, onOpenGallery, onEdit, onDelete }) => {
  const TypeIcon = typeIcons[property.type] || Building2;
  return (
    <div className="group flex flex-col sm:flex-row rounded-lg border border-border bg-card card-shadow hover:elevated-shadow transition-all overflow-hidden animate-fade-in">
      <div className="relative w-full sm:w-48 h-36 sm:h-auto bg-gradient-to-br from-primary/10 via-accent/5 to-muted shrink-0 cursor-pointer" onClick={onOpenGallery}>
        {property.photos && property.photos.length > 0 ? (
          <img src={property.photos[0]} alt={property.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><TypeIcon className="h-12 w-12 text-primary/20" /></div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${statusColors[property.status] || ''}`}>{property.status}</span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-foreground/60 backdrop-blur px-1.5 py-0.5 text-[9px] font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-3 w-3" /> {property.photos?.length || 0}
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading text-sm font-semibold text-card-foreground line-clamp-1">{property.title}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {property.quartier ? `${property.quartier}, ` : ''}{property.city}</p>
            </div>
            <p className="font-heading text-base font-bold text-primary whitespace-nowrap">
              {formatMAD(property.price)}
              {property.transaction === 'Location' && <span className="text-[10px] font-normal text-muted-foreground">/mois</span>}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {property.surface && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {property.surface} m²</span>}
            {property.bedrooms && <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {property.bedrooms} ch.</span>}
            {property.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.bathrooms} sdb</span>}
            {property.rooms && <span className="flex items-center gap-1">🚪 {property.rooms} pièces</span>}
          </div>
          <div className="mt-2 flex gap-1.5">
            {property.mandat && <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${mandatColors[property.mandat] || ''}`}>{property.mandat}</span>}
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{property.transaction}</span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{property.type}</span>
          </div>
        </div>
        {property.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-1">{property.description}</p>}
      </div>
      <div className="flex sm:flex-col items-center justify-end gap-1.5 p-3 sm:border-l border-t sm:border-t-0 border-border shrink-0">
        <button onClick={onOpenGallery} className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
          <Eye className="h-3 w-3" /> Voir
        </button>
        <button onClick={onEdit} className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Edit className="h-3 w-3" /> Modifier
        </button>
        <button className="flex items-center gap-1 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success hover:bg-success/20 transition-colors">
          <MessageSquare className="h-3 w-3" /> WhatsApp
        </button>
        <button className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Phone className="h-3 w-3" /> Appeler
        </button>
        <button onClick={onDelete} className="flex items-center gap-1 rounded-md bg-destructive/10 px-2.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/20 transition-colors">
          <Trash2 className="h-3 w-3" /> Supprimer
        </button>
      </div>
    </div>
  );
};

const PROPERTIES_PER_PAGE = 12;

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detail' | 'map'>('grid');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await api.properties.list();
        const mapped: Property[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: String(p.id),
          title: p.title || '',
          type: p.type || 'Appartement',
          transaction: p.transaction || 'Vente',
          price: p.price || 0,
          surface: p.surface || 0,
          rooms: p.rooms,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          city: p.city || '',
          quartier: p.quartier || p.neighborhood || '',
          address: p.address || '',
          description: p.description || '',
          status: p.status || 'Disponible',
          mandat: p.mandat || 'Simple',
          agentId: String(p.agent_id || p.agentId || ''),
          photos: Array.isArray(p.photos) ? p.photos : [],
          createdAt: p.created_at || p.createdAt || new Date().toISOString(),
          gps: p.gps || p.coordinates,
        }));
        setProperties(mapped);
      } catch (err) {
        console.error('Erreur chargement biens:', err);
        toast.error('Impossible de charger les biens');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const confirmDelete = async () => {
    if (deletingProperty) {
      try {
        await api.properties.delete(deletingProperty.id);
        setProperties(prev => prev.filter(p => p.id !== deletingProperty.id));
        toast.success(`"${deletingProperty.title}" supprimé`);
      } catch (err) {
        console.error('Erreur suppression bien:', err);
        toast.error('Impossible de supprimer le bien');
      } finally {
        setDeletingProperty(null);
      }
    }
  };

  const filtered = properties.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !(p.quartier || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter && p.city !== cityFilter) return false;
    if (typeFilter && p.type !== typeFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PROPERTIES_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * PROPERTIES_PER_PAGE;
    return filtered.slice(start, start + PROPERTIES_PER_PAGE);
  }, [filtered, currentPage]);

  React.useEffect(() => { setCurrentPage(1); }, [search, cityFilter, typeFilter, statusFilter]);

  const openGallery = () => { setLightboxIndex(0); setLightboxOpen(true); };
  const openCreate = () => { setEditingProperty(null); setModalOpen(true); };
  const openEdit = (p: Property) => { setEditingProperty(p); setModalOpen(true); };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="flex justify-between"><div><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-32 mt-2" /></div><Skeleton className="h-10 w-36 rounded-lg" /></div>
          <div className="flex gap-3"><Skeleton className="h-10 flex-1 max-w-md rounded-lg" /><Skeleton className="h-10 w-28 rounded-lg" /><Skeleton className="h-10 w-28 rounded-lg" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Biens Immobiliers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{properties.length} biens • {filtered.length} affichés</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Ajouter un bien
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un bien..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
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
          <button onClick={() => setViewMode('grid')} className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Grille"><Grid3X3 className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('list')} className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Cartes"><List className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('detail')} className={`rounded-md p-1.5 ${viewMode === 'detail' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Liste détaillée"><LayoutList className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('map')} className={`rounded-md p-1.5 ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} title="Carte"><Map className="h-4 w-4" /></button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <PropertyMap properties={filtered} />
      ) : filtered.length > 0 ? (
        <>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
            {paginatedProperties.map((p) => (
              viewMode === 'detail'
                ? <PropertyListRow key={p.id} property={p} onOpenGallery={openGallery} onEdit={() => openEdit(p)} onDelete={() => setDeletingProperty(p)} />
                : <PropertyCard key={p.id} property={p} onOpenGallery={openGallery} onEdit={() => openEdit(p)} onDelete={() => setDeletingProperty(p)} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 card-shadow">
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * PROPERTIES_PER_PAGE + 1}–{Math.min(currentPage * PROPERTIES_PER_PAGE, filtered.length)} sur {filtered.length}
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
      ) : (
        <EmptyState variant="property" icon={Building2} title="Aucun bien trouvé" description="Aucun bien ne correspond à vos critères de recherche." actionLabel="Ajouter un bien" onAction={openCreate} />
      )}
    </div>

    <PhotoLightbox photos={demoPhotos} initialIndex={lightboxIndex} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />

    <PropertyFormModal
      open={modalOpen}
      onClose={() => { setModalOpen(false); setEditingProperty(null); }}
      initialData={editingProperty}
      onSubmit={async (data) => {
        try {
          if (editingProperty) {
            const updated = await api.properties.update(editingProperty.id, data);
            setProperties(prev => prev.map(p => p.id === editingProperty.id ? {
              ...p, ...data,
              ...(updated?.id ? { id: String(updated.id) } : {}),
              rooms: typeof data.rooms === 'number' ? data.rooms : p.rooms,
              bedrooms: typeof data.bedrooms === 'number' ? data.bedrooms : p.bedrooms,
              bathrooms: typeof data.bathrooms === 'number' ? data.bathrooms : p.bathrooms,
            } : p));
          } else {
            const created = await api.properties.create(data);
            const newProperty: Property = {
              id: String(created?.id || `p${Date.now()}`),
              title: data.title,
              type: data.type,
              transaction: data.transaction,
              price: data.price,
              surface: data.surface,
              rooms: typeof data.rooms === 'number' ? data.rooms : undefined,
              bedrooms: typeof data.bedrooms === 'number' ? data.bedrooms : undefined,
              bathrooms: typeof data.bathrooms === 'number' ? data.bathrooms : undefined,
              city: data.city,
              quartier: data.quartier,
              address: data.address,
              description: data.description,
              status: data.status,
              mandat: data.mandat,
              agentId: '2',
              photos: [],
              createdAt: new Date().toISOString().split('T')[0],
            };
            setProperties(prev => [newProperty, ...prev]);
          }
        } catch (err) {
          console.error('Erreur sauvegarde bien:', err);
          toast.error('Impossible de sauvegarder le bien');
        }
      }}
    />
    <AlertDialog open={!!deletingProperty} onOpenChange={(open) => !open && setDeletingProperty(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce bien ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer « {deletingProperty?.title} » ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </PageTransition>
  );
};

export default Properties;
