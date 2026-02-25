import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Edit } from 'lucide-react';
import { mockProperties, mockContacts } from '@/data/mockData';
import type { Transaction } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  propertyId: z.string().min(1, 'Sélectionnez un bien'),
  contactId: z.string().min(1, 'Sélectionnez un contact'),
  type: z.enum(['Vente', 'Location'], { required_error: 'Sélectionnez un type' }),
  stage: z.string().min(1, 'Sélectionnez une étape'),
  amount: z.coerce.number().positive('Le montant doit être positif').max(100000000, 'Montant trop élevé'),
  commission: z.coerce.number().min(0, 'Commission invalide').max(100000000, 'Commission trop élevée'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

const saleStages = ['Offre', 'Compromis', 'Notaire', 'Signé'];
const locationStages = ['Visite', 'Bail', 'État des lieux', 'Quittances'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction | null;
}

const TransactionFormModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const isEdit = !!initialData;
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'Vente', stage: 'Offre' },
  });

  useEffect(() => {
    if (open && initialData) {
      reset({
        propertyId: initialData.propertyId,
        contactId: initialData.contactId,
        type: initialData.type,
        stage: initialData.stage,
        amount: initialData.amount,
        commission: initialData.commission,
      });
    } else if (open && !initialData) {
      reset({ type: 'Vente', stage: 'Offre' });
    }
  }, [open, initialData, reset]);

  const txType = watch('type');
  const stages = txType === 'Vente' ? saleStages : locationStages;
  const watchedPropertyId = watch('propertyId');
  const watchedContactId = watch('contactId');
  const watchedStage = watch('stage');

  const onValid = (data: TransactionFormData) => {
    onSubmit(data);
    const prop = mockProperties.find(p => p.id === data.propertyId);
    toast({
      title: isEdit ? 'Transaction modifiée' : 'Transaction créée',
      description: `Transaction pour "${prop?.title || 'Bien'}" ${isEdit ? 'mise à jour' : 'ajoutée'}.`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {isEdit ? <Edit className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
            {isEdit ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations de la transaction.' : 'Créez un nouveau dossier de transaction.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Bien immobilier *</Label>
            <Select onValueChange={(v) => setValue('propertyId', v)} value={watchedPropertyId || ''}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un bien" /></SelectTrigger>
              <SelectContent>
                {mockProperties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title} — {p.quartier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="text-xs text-destructive">{errors.propertyId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Contact / Client *</Label>
            <Select onValueChange={(v) => setValue('contactId', v)} value={watchedContactId || ''}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un contact" /></SelectTrigger>
              <SelectContent>
                {mockContacts.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contactId && <p className="text-xs text-destructive">{errors.contactId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select
                onValueChange={(v) => {
                  setValue('type', v as any);
                  setValue('stage', v === 'Vente' ? 'Offre' : 'Visite');
                }}
                value={txType || 'Vente'}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vente">Vente</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Étape *</Label>
              <Select onValueChange={(v) => setValue('stage', v)} value={watchedStage || stages[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.stage && <p className="text-xs text-destructive">{errors.stage.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-amount">Montant (DH) *</Label>
              <Input id="t-amount" type="number" placeholder="1 850 000" {...register('amount')} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-commission">Commission (DH) *</Label>
              <Input id="t-commission" type="number" placeholder="55 500" {...register('commission')} />
              {errors.commission && <p className="text-xs text-destructive">{errors.commission.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
            <Button type="submit">{isEdit ? 'Enregistrer' : 'Créer la transaction'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormModal;
