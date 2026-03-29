// =============================================================================
// JIBRIL IMMO — TanStack Query hooks for all API resources
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Property, Contact, Transaction } from '@/data/mockData';
import type { Bail } from '@/components/modals/CreateBailModal';

// ─── Mappers ─────────────────────────────────────────────────────────────────

export const mapProperty = (p: any): Property => ({
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
});

export const mapContact = (c: any): Contact => ({
  id: String(c.id),
  name: c.name || '',
  type: c.type || 'Acquéreur',
  phone: c.phone || '',
  email: c.email || undefined,
  budget: c.budget || undefined,
  exigences: c.exigences || c.requirements || undefined,
  score: c.score ?? 50,
  agentId: String(c.agent_id || c.agentId || ''),
  lockedBy: c.locked_by || c.lockedBy || undefined,
  lockedUntil: c.locked_until || c.lockedUntil || undefined,
  createdAt: c.created_at || c.createdAt || new Date().toISOString(),
  lastContact: c.last_contact || c.lastContact || undefined,
  notes: c.notes || undefined,
});

export const mapTransaction = (t: any): Transaction => ({
  id: String(t.id),
  propertyId: String(t.property_id || t.propertyId || ''),
  contactId: String(t.contact_id || t.contactId || ''),
  type: t.type || 'Vente',
  stage: t.stage || 'Offre',
  amount: t.amount || 0,
  commission: t.commission || 0,
  agentId: String(t.agent_id || t.agentId || ''),
  createdAt: t.created_at || t.createdAt || new Date().toISOString(),
  documents: Array.isArray(t.documents) ? t.documents : [],
});

export const mapLease = (l: any): Bail => ({
  id: String(l.id),
  locataire: l.locataire || l.tenant_name || '',
  bien: l.bien || l.property_name || '',
  loyer: l.loyer || l.rent || 0,
  charges: l.charges || 0,
  depot: l.depot || l.deposit || 0,
  debut: l.debut || l.start_date || '',
  fin: l.fin || l.end_date || '',
  statut: l.statut || l.status || 'Actif',
  paiement: l.paiement || l.payment_status || 'À jour',
  telephone: l.telephone || l.phone || '',
  email: l.email || '',
});

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const queryKeys = {
  properties: ['properties'] as const,
  contacts: ['contacts'] as const,
  transactions: ['transactions'] as const,
  leases: ['leases'] as const,
  documents: ['documents'] as const,
  users: ['users'] as const,
  auditLogs: ['auditLogs'] as const,
};

// ─── Properties ──────────────────────────────────────────────────────────────

export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: async () => {
      const data = await api.properties.list();
      return (Array.isArray(data) ? data : []).map(mapProperty);
    },
  });
}

export function usePropertyMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.properties });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.properties.create(data),
    onSuccess: () => { invalidate(); toast.success('Bien créé'); },
    onError: () => toast.error('Impossible de créer le bien'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.properties.update(id, data),
    onSuccess: () => { invalidate(); toast.success('Bien modifié'); },
    onError: () => toast.error('Impossible de modifier le bien'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.properties.delete(id),
    onSuccess: () => { invalidate(); toast.success('Bien supprimé'); },
    onError: () => toast.error('Impossible de supprimer le bien'),
  });

  return { createProperty: createMutation, updateProperty: updateMutation, deleteProperty: deleteMutation };
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export function useContacts() {
  return useQuery({
    queryKey: queryKeys.contacts,
    queryFn: async () => {
      const data = await api.contacts.list();
      return (Array.isArray(data) ? data : []).map(mapContact);
    },
  });
}

export function useContactMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.contacts });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.contacts.create(data),
    onSuccess: () => { invalidate(); toast.success('Contact créé'); },
    onError: () => toast.error('Impossible de créer le contact'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.contacts.update(id, data),
    onSuccess: () => { invalidate(); toast.success('Contact modifié'); },
    onError: () => toast.error('Impossible de modifier le contact'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.contacts.delete(id),
    onSuccess: () => { invalidate(); toast.success('Contact supprimé'); },
    onError: () => toast.error('Impossible de supprimer le contact'),
  });

  return { createContact: createMutation, updateContact: updateMutation, deleteContact: deleteMutation };
}

// ─── Transactions ────────────────────────────────────────────────────────────

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () => {
      const data = await api.transactions.list();
      return (Array.isArray(data) ? data : []).map(mapTransaction);
    },
  });
}

export function useTransactionMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.transactions });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.transactions.create(data),
    onSuccess: () => { invalidate(); toast.success('Transaction créée'); },
    onError: () => toast.error('Impossible de créer la transaction'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.transactions.update(id, data),
    onSuccess: () => { invalidate(); },
    onError: () => toast.error('Impossible de modifier la transaction'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.transactions.delete(id),
    onSuccess: () => { invalidate(); toast.success('Transaction supprimée'); },
    onError: () => toast.error('Impossible de supprimer la transaction'),
  });

  return { createTransaction: createMutation, updateTransaction: updateMutation, deleteTransaction: deleteMutation };
}

// ─── Leases ──────────────────────────────────────────────────────────────────

const fallbackBaux: Bail[] = [
  { id: 'b1', locataire: 'Samira Alaoui', bien: 'Apt Haut Founty', loyer: 8500, charges: 500, depot: 17000, debut: '2026-01-01', fin: '2027-01-01', statut: 'Actif', paiement: 'À jour', telephone: '+212 6 55 66 77 88', email: 'samira@email.ma' },
  { id: 'b2', locataire: 'Omar Benjelloun', bien: 'Local Commercial Talborjt', loyer: 15000, charges: 1000, depot: 30000, debut: '2025-06-01', fin: '2026-06-01', statut: 'Actif', paiement: 'En retard', telephone: '+212 6 33 44 55 66', email: 'omar@email.ma' },
  { id: 'b3', locataire: 'Marie Lefèvre', bien: 'Apt Marina', loyer: 12000, charges: 800, depot: 24000, debut: '2025-09-01', fin: '2026-09-01', statut: 'Actif', paiement: 'À jour', telephone: '+33 6 12 34 56 78', email: 'marie@email.fr' },
];

export function useLeases() {
  return useQuery({
    queryKey: queryKeys.leases,
    queryFn: async () => {
      try {
        const data = await api.leases.list();
        const mapped = (Array.isArray(data) ? data : []).map(mapLease);
        return mapped.length > 0 ? mapped : fallbackBaux;
      } catch {
        return fallbackBaux;
      }
    },
  });
}

export function useLeaseMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.leases });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.leases.create(data),
    onSuccess: () => { invalidate(); toast.success('Bail créé'); },
    onError: () => toast.error('Impossible de créer le bail'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.leases.update(id, data),
    onSuccess: () => { invalidate(); },
    onError: () => toast.error('Impossible de modifier le bail'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.leases.delete(id),
    onSuccess: () => { invalidate(); toast.success('Bail supprimé'); },
    onError: () => toast.error('Impossible de supprimer le bail'),
  });

  return { createLease: createMutation, updateLease: updateMutation, deleteLease: deleteMutation };
}

// ─── Documents ───────────────────────────────────────────────────────────────

export interface Doc {
  id: string;
  name: string;
  date: string;
  status: string;
  signedBy: string;
}

const fallbackDocs: Doc[] = [
  { id: '1', name: 'Mandat Exclusif — Villa Marina', date: '22/02/2026', status: 'Signé', signedBy: 'Admin Jibril' },
  { id: '2', name: 'Bail — Apt Haut Founty', date: '10/02/2026', status: 'En attente', signedBy: '' },
  { id: '3', name: 'Compromis — Apt Founty', date: '15/02/2026', status: 'Signé', signedBy: 'Mohammed El Fassi' },
  { id: '4', name: 'Quittance Février — Studio Talborjt', date: '01/02/2026', status: 'Signé', signedBy: 'Samira Alaoui' },
];

export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: async () => {
      try {
        const data = await api.documents.list();
        const mapped: Doc[] = (Array.isArray(data) ? data : []).map((d: any) => ({
          id: String(d.id),
          name: d.name || d.title || '',
          date: d.date || (d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR') : ''),
          status: d.status || 'En attente',
          signedBy: d.signed_by || d.signedBy || '',
        }));
        return mapped.length > 0 ? mapped : fallbackDocs;
      } catch {
        return fallbackDocs;
      }
    },
  });
}

export function useDocumentMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.documents });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.documents.delete(id),
    onSuccess: () => { invalidate(); toast.success('Document supprimé'); },
    onError: () => toast.error('Impossible de supprimer le document'),
  });

  return { deleteDocument: deleteMutation };
}

// ─── Users (Admin) ───────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
}

export function useUsers(fallbackUsers: AdminUser[]) {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      try {
        const data = await api.users.list();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((u: any): AdminUser => ({
            id: String(u.id),
            name: u.name || u.full_name || '',
            username: u.username || '',
            email: u.email || '',
            phone: u.phone || '',
            role: u.role || 'agent',
          }));
        }
        return fallbackUsers;
      } catch {
        return fallbackUsers;
      }
    },
  });
}

export function useUserMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.users });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.users.create(data),
    onSuccess: () => { invalidate(); toast.success('Utilisateur créé'); },
    onError: () => toast.error('Impossible de créer l\'utilisateur'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.users.update(id, data),
    onSuccess: () => { invalidate(); toast.success('Utilisateur modifié'); },
    onError: () => toast.error('Impossible de modifier l\'utilisateur'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: () => { invalidate(); toast.success('Utilisateur supprimé'); },
    onError: () => toast.error('Impossible de supprimer l\'utilisateur'),
  });

  return { createUser: createMutation, updateUser: updateMutation, deleteUser: deleteMutation };
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export interface AuditLog {
  user: string;
  action: string;
  date: string;
  ip: string;
}

const fallbackLogs: AuditLog[] = [
  { user: 'Admin Jibril', action: 'Modification bien P1', date: '25/02/2026 10:30', ip: '192.168.1.10' },
  { user: 'Amin Belhaj', action: 'Ajout contact C8', date: '25/02/2026 09:45', ip: '192.168.1.12' },
  { user: 'Sarah Idrissi', action: 'Création transaction T3', date: '24/02/2026 16:20', ip: '192.168.1.15' },
  { user: 'Admin Jibril', action: 'Export statistiques PDF', date: '24/02/2026 14:00', ip: '192.168.1.10' },
];

export function useAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs,
    queryFn: async () => {
      try {
        const data = await api.auditLogs.list();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((l: any): AuditLog => ({
            user: l.user || l.user_name || '',
            action: l.action || '',
            date: l.date || (l.created_at ? new Date(l.created_at).toLocaleDateString('fr-FR') + ' ' + new Date(l.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''),
            ip: l.ip || l.ip_address || '',
          }));
        }
        return fallbackLogs;
      } catch {
        return fallbackLogs;
      }
    },
  });
}
