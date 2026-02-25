import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/contexts/AuthContext';

const userSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  username: z.string().min(2, 'Identifiant requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone requis'),
  role: z.enum(['admin', 'agent']),
  password: z.string().min(6, 'Minimum 6 caractères').optional().or(z.literal('')),
});

export type UserFormData = z.infer<typeof userSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: User | null;
  onSubmit: (data: UserFormData) => void;
}

const CreateUserModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', username: '', email: '', phone: '', role: 'agent', password: '' },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          username: initialData.username,
          email: initialData.email || '',
          phone: initialData.phone || '',
          role: initialData.role,
          password: '',
        });
      } else {
        reset({ name: '', username: '', email: '', phone: '', role: 'agent', password: '' });
      }
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label>Nom complet *</Label>
            <Input {...register('name')} placeholder="Prénom Nom" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Identifiant *</Label>
              <Input {...register('username')} placeholder="ex: amin" />
              {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label>Rôle</Label>
              <Controller name="role" control={control} render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" {...register('email')} placeholder="email@jibrilimmo.ma" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Téléphone *</Label>
            <Input {...register('phone')} placeholder="+212 6 XX XX XX XX" />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label>{initialData ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}</Label>
            <Input type="password" {...register('password')} placeholder="••••••" />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{initialData ? 'Enregistrer' : 'Créer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
