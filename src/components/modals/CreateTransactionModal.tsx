import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { mockProperties, mockContacts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  propertyId: z.string().min(1, 'Sélectionnez un bien'),
  contactId: z.string().min(1, 'Sélectionnez un contact'),
  type: z.enum(['Vente', 'Location'], { required_error: 'Sélectionnez un type' }),
  stage: z.string().min(1, 'Sélectionnez une étape'),
  amount: z.coerce.number().positive('Le montant doit être positif').max(100000000, 'Montant trop élevé'),
  commission: z.coerce.number().min(0, 'Commission invalide').max(100000000, 'Commission trop élevée'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const saleStages = ['Offre', 'Compromis', 'Notaire', 'Signé'];
const locationStages = ['Visite', 'Bail', 'État des lieux', 'Quittances'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
}

const CreateTransactionModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'Vente', stage: 'Offre' },
  });

  const txType = watch('type');
  const stages = txType === 'Vente' ? saleStages : locationStages;

  const onValid = (data: TransactionFormData) => {
    onSubmit(data);
    const prop = mockProperties.find(p => p.id === data.propertyId);
    toast({ title: 'Transaction créée', description: `Transaction pour "${prop?.title || 'Bien'}" ajoutée.` });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" /> Nouvelle transaction
          </DialogTitle>
          <DialogDescription>Créez un nouveau dossier de transaction.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4 mt-2">
          {/* Property */}
          <div className="space-y-1.5">
            <Label>Bien immobilier *</Label>
            <Select onValueChange={(v) => setValue('propertyId', v)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="Sélectionner un bien" /></SelectTrigger>
              <SelectContent>
                {mockProperties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title} — {p.quartier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && <p className="text-xs text-destructive">{errors.propertyId.message}</p>}
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <Label>Contact / Client *</Label>
            <Select onValueChange={(v) => setValue('contactId', v)} defaultValue="">
              <SelectTrigger><SelectValue placeholder="Sélectionner un contact" /></SelectTrigger>
              <SelectContent>
                {mockContacts.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contactId && <p className="text-xs text-destructive">{errors.contactId.message}</p>}
          </div>

          {/* Type + Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select
                onValueChange={(v) => {
                  setValue('type', v as any);
                  setValue('stage', v === 'Vente' ? 'Offre' : 'Visite');
                }}
                defaultValue="Vente"
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
              <Select onValueChange={(v) => setValue('stage', v)} defaultValue={stages[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.stage && <p className="text-xs text-destructive">{errors.stage.message}</p>}
            </div>
          </div>

          {/* Amount + Commission */}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
            <Button type="submit">Créer la transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
