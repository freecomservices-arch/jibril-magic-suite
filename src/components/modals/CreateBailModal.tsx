import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bailSchema = z.object({
  locataire: z.string().min(2, 'Nom requis'),
  bien: z.string().min(2, 'Bien requis'),
  loyer: z.coerce.number().positive('Le loyer doit être positif'),
  charges: z.coerce.number().min(0, 'Charges invalides').default(0),
  depot: z.coerce.number().min(0, 'Dépôt invalide').default(0),
  debut: z.string().min(1, 'Date de début requise'),
  fin: z.string().min(1, 'Date de fin requise'),
  statut: z.enum(['Actif', 'Expiré', 'Résilié']),
  paiement: z.enum(['À jour', 'En retard', 'Impayé']),
  telephone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
});

export type BailFormData = z.infer<typeof bailSchema>;

export interface Bail extends BailFormData {
  id: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Bail | null;
  onSubmit: (data: BailFormData) => void;
}

const CreateBailModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BailFormData>({
    resolver: zodResolver(bailSchema),
    defaultValues: {
      locataire: '', bien: '', loyer: 0, charges: 0, depot: 0,
      debut: '', fin: '', statut: 'Actif', paiement: 'À jour',
      telephone: '', email: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          locataire: '', bien: '', loyer: 0, charges: 0, depot: 0,
          debut: new Date().toISOString().split('T')[0],
          fin: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          statut: 'Actif', paiement: 'À jour', telephone: '', email: '',
        });
      }
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: BailFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Modifier le bail' : 'Nouveau bail'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Locataire *</Label>
              <Input {...register('locataire')} placeholder="Nom du locataire" />
              {errors.locataire && <p className="text-xs text-destructive mt-1">{errors.locataire.message}</p>}
            </div>
            <div className="col-span-2">
              <Label>Bien *</Label>
              <Input {...register('bien')} placeholder="ex: Apt Haut Founty" />
              {errors.bien && <p className="text-xs text-destructive mt-1">{errors.bien.message}</p>}
            </div>
            <div>
              <Label>Loyer mensuel (DH) *</Label>
              <Input type="number" {...register('loyer')} />
              {errors.loyer && <p className="text-xs text-destructive mt-1">{errors.loyer.message}</p>}
            </div>
            <div>
              <Label>Charges (DH)</Label>
              <Input type="number" {...register('charges')} />
            </div>
            <div>
              <Label>Dépôt de garantie (DH)</Label>
              <Input type="number" {...register('depot')} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input {...register('telephone')} placeholder="+212 6 XX XX XX XX" />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input type="email" {...register('email')} placeholder="email@exemple.ma" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Date début *</Label>
              <Input type="date" {...register('debut')} />
              {errors.debut && <p className="text-xs text-destructive mt-1">{errors.debut.message}</p>}
            </div>
            <div>
              <Label>Date fin *</Label>
              <Input type="date" {...register('fin')} />
              {errors.fin && <p className="text-xs text-destructive mt-1">{errors.fin.message}</p>}
            </div>
            <div>
              <Label>Statut</Label>
              <Controller name="statut" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Expiré">Expiré</SelectItem>
                    <SelectItem value="Résilié">Résilié</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div>
              <Label>Paiement</Label>
              <Controller name="paiement" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À jour">À jour</SelectItem>
                    <SelectItem value="En retard">En retard</SelectItem>
                    <SelectItem value="Impayé">Impayé</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{initialData ? 'Enregistrer' : 'Créer le bail'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBailModal;
