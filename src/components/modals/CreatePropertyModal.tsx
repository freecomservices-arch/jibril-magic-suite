import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Edit } from 'lucide-react';
import { CITIES, QUARTIERS, PROPERTY_TYPES } from '@/data/mockData';
import type { Property } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const propertySchema = z.object({
  title: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères').max(100, 'Max 100 caractères'),
  type: z.enum(['Appartement', 'Villa', 'Terrain', 'Local Commercial', 'Riad', 'Bureau'], { required_error: 'Sélectionnez un type' }),
  transaction: z.enum(['Vente', 'Location'], { required_error: 'Sélectionnez un type de transaction' }),
  price: z.coerce.number().positive('Le prix doit être positif').max(100000000, 'Prix trop élevé'),
  surface: z.coerce.number().positive('La surface doit être positive').max(100000, 'Surface trop grande'),
  rooms: z.coerce.number().int().min(0).max(50).optional().or(z.literal('')),
  bedrooms: z.coerce.number().int().min(0).max(30).optional().or(z.literal('')),
  bathrooms: z.coerce.number().int().min(0).max(20).optional().or(z.literal('')),
  city: z.string().min(1, 'Sélectionnez une ville'),
  quartier: z.string().min(1, 'Sélectionnez un quartier'),
  address: z.string().trim().min(3, 'Adresse requise').max(200, 'Max 200 caractères'),
  description: z.string().trim().min(10, 'Description min 10 caractères').max(1000, 'Max 1000 caractères'),
  status: z.enum(['Disponible', 'Réservé', 'Vendu', 'Loué', 'Archivé']),
  mandat: z.enum(['Simple', 'Exclusif', 'Semi-exclusif']),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Property | null;
}

const PropertyFormModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const isEdit = !!initialData;
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'Disponible',
      mandat: 'Simple',
      transaction: 'Vente',
    },
  });

  useEffect(() => {
    if (open && initialData) {
      reset({
        title: initialData.title,
        type: initialData.type,
        transaction: initialData.transaction,
        price: initialData.price,
        surface: initialData.surface,
        rooms: initialData.rooms ?? '',
        bedrooms: initialData.bedrooms ?? '',
        bathrooms: initialData.bathrooms ?? '',
        city: initialData.city,
        quartier: initialData.quartier,
        address: initialData.address,
        description: initialData.description,
        status: initialData.status,
        mandat: initialData.mandat,
      });
    } else if (open && !initialData) {
      reset({ status: 'Disponible', mandat: 'Simple', transaction: 'Vente' });
    }
  }, [open, initialData, reset]);

  const onValid = (data: PropertyFormData) => {
    onSubmit(data);
    toast({
      title: isEdit ? 'Bien modifié' : 'Bien créé',
      description: `"${data.title}" a été ${isEdit ? 'mis à jour' : 'ajouté'} avec succès.`,
    });
    reset();
    onClose();
  };

  const watchedType = watch('type');
  const watchedTransaction = watch('transaction');
  const watchedCity = watch('city');
  const watchedQuartier = watch('quartier');
  const watchedStatus = watch('status');
  const watchedMandat = watch('mandat');

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {isEdit ? <Edit className="h-5 w-5 text-primary" /> : <Building2 className="h-5 w-5 text-primary" />}
            {isEdit ? 'Modifier le bien' : 'Nouveau bien immobilier'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations du bien.' : 'Remplissez les informations du bien. Les champs marqués * sont obligatoires.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" placeholder="Ex: Appartement Vue Mer Founty" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type de bien *</Label>
              <Select onValueChange={(v) => setValue('type', v as any)} value={watchedType || ''}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Transaction *</Label>
              <Select onValueChange={(v) => setValue('transaction', v as any)} value={watchedTransaction || 'Vente'}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vente">Vente</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                </SelectContent>
              </Select>
              {errors.transaction && <p className="text-xs text-destructive">{errors.transaction.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Prix (DH) *</Label>
              <Input id="price" type="number" placeholder="1 500 000" {...register('price')} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="surface">Surface (m²) *</Label>
              <Input id="surface" type="number" placeholder="120" {...register('surface')} />
              {errors.surface && <p className="text-xs text-destructive">{errors.surface.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rooms">Pièces</Label>
              <Input id="rooms" type="number" placeholder="4" {...register('rooms')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Chambres</Label>
              <Input id="bedrooms" type="number" placeholder="3" {...register('bedrooms')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">SdB</Label>
              <Input id="bathrooms" type="number" placeholder="2" {...register('bathrooms')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ville *</Label>
              <Select onValueChange={(v) => setValue('city', v)} value={watchedCity || ''}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Quartier *</Label>
              <Select onValueChange={(v) => setValue('quartier', v)} value={watchedQuartier || ''}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {QUARTIERS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.quartier && <p className="text-xs text-destructive">{errors.quartier.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Adresse *</Label>
            <Input id="address" placeholder="Résidence Les Palmiers, Founty" {...register('address')} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" placeholder="Décrivez le bien en détail..." rows={3} {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select onValueChange={(v) => setValue('status', v as any)} value={watchedStatus || 'Disponible'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Disponible', 'Réservé', 'Vendu', 'Loué', 'Archivé'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mandat</Label>
              <Select onValueChange={(v) => setValue('mandat', v as any)} value={watchedMandat || 'Simple'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Simple', 'Exclusif', 'Semi-exclusif'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
            <Button type="submit">{isEdit ? 'Enregistrer' : 'Créer le bien'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormModal;
