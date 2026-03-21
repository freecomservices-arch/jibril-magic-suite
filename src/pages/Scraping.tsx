// =============================================================================
// JIBRIL IMMO PRO — PAGE SCRAPING (AVEC API RÉELLE)
// =============================================================================

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Plus, RefreshCw, Globe } from 'lucide-react';

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
  const { toast } = useToast();

  // ─────────────────────────────────────────────────────────────────────────
  // CHARGEMENT DES SOURCES AU DÉMARRAGE
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const data = await api.sources.list();
      setSources(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les sources',
        variant: 'destructive',
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AJOUTER UNE SOURCE
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddSource = async () => {
    try {
      const data = await api.sources.create(newSource);
      setSources([...sources, data]);
      toast({
        title: 'Source ajoutée',
        description: 'La source a été ajoutée avec succès',
      });
      setIsAdding(false);
      setNewSource({ name: '', url: '' });
      loadSources();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Échec de l\'ajout',
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
      await api.scraping.scanAll();
      toast({
        title: 'Scan lancé',
        description: 'Le scraping est en cours en arrière-plan',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Échec du scan',
        variant: 'destructive',
      });
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
            Leads scrapés depuis {sources.length} source(s) active(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleScan} disabled={isScanning || sources.length === 0}>
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
          LISTE DES SOURCES
          ─────────────────────────────────────────────────────────────────── */}
      <div className="grid gap-4">
        {sources.length === 0 ? (
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
