// =============================================================================
// JIBRIL IMMO PRO — PAGE SCRAPING (AVEC API RÉELLE)
// =============================================================================

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { api, startScan } from '@/lib/api';
import { Plus, RefreshCw, Globe, Trash2 } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  url: string;
  active: boolean;
  created_at: string;
}

export default function Scraping() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // ─────────────────────────────────────────────────────────────────────────
  // CHARGEMENT DES SOURCES AU DÉMARRAGE
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.sources.list();
      setSources(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Erreur chargement sources:', err);
      setError('Impossible de charger les sources');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les sources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AJOUTER UNE SOURCE
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddSource = async () => {
    if (!newSource.name.trim() || !newSource.url.trim()) {
      toast({
        title: 'Erreur',
        description: 'Nom et URL requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data = await api.sources.create(newSource);
      setSources([...sources, data]);
      toast({
        title: 'Source ajoutée',
        description: 'La source a été ajoutée avec succès',
      });
      setIsAdding(false);
      setNewSource({ name: '', url: '' });
      setError(null);
      loadSources();
    } catch (err) {
      console.error('Erreur ajout source:', err);
      const errorMessage = err instanceof Error ? err.message : 'Échec de l\'ajout';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SUPPRIMER UNE SOURCE
  // ─────────────────────────────────────────────────────────────────────────
  const handleDeleteSource = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source ?')) return;
    
    try {
      await api.sources.delete(id);
      setSources(sources.filter(s => s.id !== id));
      toast({
        title: 'Source supprimée',
        description: 'La source a été supprimée avec succès',
      });
      loadSources();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Échec de la suppression',
        variant: 'destructive',
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LANCER UN SCAN
  // ─────────────────────────────────────────────────────────────────────────
  const handleScan = async () => {
    setIsScanning(true);
    try {
      await startScan('avito', 50);
      toast({ title: 'Succès', description: 'Ordre de scan envoyé !' });
    } catch (e) {
      toast({ title: 'Erreur', variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Scraping & Acquisition
          </h1>
          <p className="text-muted-foreground mt-1">
            Leads scrapés depuis {sources.filter(s => s.active).length} source(s) active(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleScan} 
            disabled={isScanning || sources.length === 0}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scan en cours...' : 'Lancer un scan'}
          </Button>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une source de scraping</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom de la source</label>
                  <Input
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    placeholder="Ex: AVITO AGA PART"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    placeholder="https://www.avito.ma/..."
                  />
                </div>
                <Button onClick={handleAddSource} className="w-full">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          MESSAGE D'ERREUR
          ─────────────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          LISTE DES SOURCES
          ─────────────────────────────────────────────────────────────────── */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin opacity-50" />
            <p>Chargement des sources...</p>
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune source configurée</p>
            <p className="text-sm">Ajoutez une source pour commencer le scraping</p>
          </div>
        ) : (
          sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {source.url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    source.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {source.active ? 'Actif' : 'Inactif'}
                </span>
                <button
                  onClick={() => handleDeleteSource(source.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
