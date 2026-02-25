import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Max 100 caractères'),
  type: z.enum(['Acquéreur', 'Vendeur', 'Locataire', 'Propriétaire'], { required_error: 'Sélectionnez un type' }),
  phone: z.string().trim().min(8, 'Numéro de téléphone invalide').max(20, 'Numéro trop long')
    .regex(/^[+\d\s()-]+$/, 'Format de téléphone invalide'),
  email: z.string().trim().email('Email invalide').max(255).optional().or(z.literal('')),
  budget: z.coerce.number().positive('Le budget doit être positif').max(100000000).optional().or(z.literal('')),
  exigences: z.string().trim().max(500, 'Max 500 caractères').optional().or(z.literal('')),
  notes: z.string().trim().max(1000, 'Max 1000 caractères').optional().or(z.literal('')),
  score: z.coerce.number().int().min(0, 'Min 0').max(100, 'Max 100').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
}

const CreateContactModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { score: 50 },
  });

  const onValid = (data: ContactFormData) => {
    onSubmit(data);
    toast({ title: 'Contact créé', description: `"${data.name}" a été ajouté avec succès.` });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" /> Nouveau contact
          </DialogTitle>
          <DialogDescription>Ajoutez un nouveau contact à votre CRM.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Nom complet *</Label>
            <Input id="c-name" placeholder="Ex: Mohammed El Fassi" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Type + Score */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select onValueChange={(v) => setValue('type', v as any)} defaultValue="">
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {['Acquéreur', 'Vendeur', 'Locataire', 'Propriétaire'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-score">Score (0-100)</Label>
              <Input id="c-score" type="number" placeholder="50" {...register('score')} />
              {errors.score && <p className="text-xs text-destructive">{errors.score.message}</p>}
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Téléphone *</Label>
              <Input id="c-phone" placeholder="+212 6 12 34 56 78" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" placeholder="email@exemple.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label htmlFor="c-budget">Budget (DH)</Label>
            <Input id="c-budget" type="number" placeholder="2 000 000" {...register('budget')} />
            {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
          </div>

          {/* Exigences */}
          <div className="space-y-1.5">
            <Label htmlFor="c-exigences">Exigences / Critères</Label>
            <Textarea id="c-exigences" placeholder="Appartement vue mer, 3 chambres minimum..." rows={2} {...register('exigences')} />
            {errors.exigences && <p className="text-xs text-destructive">{errors.exigences.message}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="c-notes">Notes</Label>
            <Textarea id="c-notes" placeholder="Notes internes..." rows={2} {...register('notes')} />
            {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
            <Button type="submit">Créer le contact</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactModal;
