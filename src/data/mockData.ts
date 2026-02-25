export interface Property {
  id: string;
  title: string;
  titleAr?: string;
  type: 'Appartement' | 'Villa' | 'Terrain' | 'Local Commercial' | 'Riad' | 'Bureau';
  transaction: 'Vente' | 'Location';
  price: number;
  surface: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  city: string;
  quartier: string;
  address: string;
  description: string;
  status: 'Disponible' | 'Réservé' | 'Vendu' | 'Loué' | 'Archivé';
  mandat: 'Simple' | 'Exclusif' | 'Semi-exclusif';
  agentId: string;
  photos: string[];
  createdAt: string;
  gps?: { lat: number; lng: number };
}

export interface Contact {
  id: string;
  name: string;
  type: 'Acquéreur' | 'Vendeur' | 'Locataire' | 'Propriétaire';
  phone: string;
  email?: string;
  budget?: number;
  exigences?: string;
  score: number;
  agentId: string;
  lockedBy?: string;
  lockedUntil?: string;
  createdAt: string;
  lastContact?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  contactId: string;
  type: 'Vente' | 'Location';
  stage: 'Offre' | 'Compromis' | 'Notaire' | 'Signé' | 'Visite' | 'Bail' | 'État des lieux' | 'Quittances';
  amount: number;
  commission: number;
  agentId: string;
  createdAt: string;
  documents: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  read: boolean;
  createdAt: string;
}

export const CITIES = ['Agadir', 'Inezgane', 'Aït Melloul', 'Taghazout', 'Tamraght'];
export const QUARTIERS = ['Founty', 'Marina', 'Talborjt', 'Haut Founty', 'Anza', 'Charaf', 'Hay Mohammadi', 'Sonaba', 'Dakhla', 'Tilila'];
export const PROPERTY_TYPES = ['Appartement', 'Villa', 'Terrain', 'Local Commercial', 'Riad', 'Bureau'] as const;

export const mockProperties: Property[] = [
  {
    id: 'p1', title: 'Appartement Vue Mer Founty', type: 'Appartement', transaction: 'Vente',
    price: 1850000, surface: 120, rooms: 4, bedrooms: 3, bathrooms: 2,
    city: 'Agadir', quartier: 'Founty', address: 'Résidence Les Palmiers, Founty',
    description: 'Magnifique appartement avec vue panoramique sur l\'océan. Finitions haut de gamme, cuisine équipée, 2 terrasses.',
    status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: [], createdAt: '2026-01-15',
    gps: { lat: 30.4278, lng: -9.6137 },
  },
  {
    id: 'p2', title: 'Villa Moderne Marina', type: 'Villa', transaction: 'Vente',
    price: 4200000, surface: 350, rooms: 7, bedrooms: 5, bathrooms: 3,
    city: 'Agadir', quartier: 'Marina', address: 'Marina d\'Agadir, Lot 45',
    description: 'Villa contemporaine dans le quartier prisé de la Marina. Piscine privée, jardin paysager, garage double.',
    status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: [], createdAt: '2026-01-20',
    gps: { lat: 30.4195, lng: -9.6058 },
  },
  {
    id: 'p3', title: 'Local Commercial Talborjt', type: 'Local Commercial', transaction: 'Location',
    price: 15000, surface: 85, city: 'Agadir', quartier: 'Talborjt', address: 'Av. Hassan II, Talborjt',
    description: 'Local commercial idéalement situé sur l\'avenue principale. Grande vitrine, excellent flux piéton.',
    status: 'Disponible', mandat: 'Simple', agentId: '4', photos: [], createdAt: '2026-02-01',
    gps: { lat: 30.4315, lng: -9.5983 },
  },
  {
    id: 'p4', title: 'Terrain Constructible Taghazout', type: 'Terrain', transaction: 'Vente',
    price: 3500000, surface: 1200, city: 'Taghazout', quartier: 'Taghazout', address: 'Zone touristique Taghazout Bay',
    description: 'Terrain avec vue sur mer, idéal pour projet touristique ou résidentiel de standing.',
    status: 'Réservé', mandat: 'Semi-exclusif', agentId: '2', photos: [], createdAt: '2026-02-05',
    gps: { lat: 30.5445, lng: -9.7085 },
  },
  {
    id: 'p5', title: 'Appartement Haut Founty', type: 'Appartement', transaction: 'Location',
    price: 8500, surface: 90, rooms: 3, bedrooms: 2, bathrooms: 1,
    city: 'Agadir', quartier: 'Haut Founty', address: 'Résidence Al Baraka, Haut Founty',
    description: 'Appartement meublé et équipé, parfait pour expatriés. Proche des commodités.',
    status: 'Loué', mandat: 'Simple', agentId: '5', photos: [], createdAt: '2026-02-10',
    gps: { lat: 30.4350, lng: -9.6200 },
  },
  {
    id: 'p6', title: 'Riad Traditionnel Charaf', type: 'Riad', transaction: 'Vente',
    price: 2800000, surface: 200, rooms: 6, bedrooms: 4, bathrooms: 3,
    city: 'Agadir', quartier: 'Charaf', address: 'Quartier Charaf, Agadir',
    description: 'Riad rénové avec patio central, fontaine, zellige authentique. Potentiel maison d\'hôtes.',
    status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: [], createdAt: '2026-02-12',
    gps: { lat: 30.4180, lng: -9.5870 },
  },
];

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'Mohammed El Fassi', type: 'Acquéreur', phone: '+212 6 12 34 56 78', email: 'elfassi@gmail.com', budget: 2000000, exigences: 'Appartement vue mer, 3 chambres minimum', score: 85, agentId: '2', createdAt: '2026-01-10', lastContact: '2026-02-20' },
  { id: 'c2', name: 'Aicha Benkirane', type: 'Vendeur', phone: '+212 6 98 76 54 32', email: 'aicha.b@yahoo.fr', score: 70, agentId: '3', createdAt: '2026-01-15', lastContact: '2026-02-18' },
  { id: 'c3', name: 'Pierre Dupont', type: 'Acquéreur', phone: '+33 6 12 34 56 78', email: 'pierre.d@gmail.com', budget: 5000000, exigences: 'Villa avec piscine, quartier résidentiel', score: 92, agentId: '2', createdAt: '2026-01-20', lastContact: '2026-02-22', notes: 'MRE - Retraité français, cherche résidence principale' },
  { id: 'c4', name: 'Hassan Tazi', type: 'Propriétaire', phone: '+212 6 44 55 66 77', score: 60, agentId: '4', createdAt: '2026-02-01', lastContact: '2026-02-15' },
  { id: 'c5', name: 'Samira Alaoui', type: 'Locataire', phone: '+212 6 55 66 77 88', email: 'samira.a@outlook.com', budget: 10000, exigences: 'Appartement meublé, centre-ville', score: 75, agentId: '5', createdAt: '2026-02-05', lastContact: '2026-02-21' },
  { id: 'c6', name: 'Jean-Michel Laurent', type: 'Acquéreur', phone: '+33 6 78 90 12 34', email: 'jm.laurent@gmail.com', budget: 3000000, exigences: 'Terrain constructible ou riad à rénover', score: 65, agentId: '3', createdAt: '2026-02-08', notes: 'Expatrié, projet maison d\'hôtes' },
  { id: 'c7', name: 'Khadija Benmoussa', type: 'Vendeur', phone: '+212 6 11 22 33 44', score: 50, agentId: '2', createdAt: '2026-02-12' },
  { id: 'c8', name: 'Ahmed Ouazzani', type: 'Acquéreur', phone: '+212 6 33 44 55 66', budget: 1500000, score: 80, agentId: '4', createdAt: '2026-02-15', lastContact: '2026-02-24', lockedBy: '4', lockedUntil: '2026-02-26' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', propertyId: 'p1', contactId: 'c1', type: 'Vente', stage: 'Compromis', amount: 1850000, commission: 55500, agentId: '2', createdAt: '2026-02-15', documents: ['Compromis de vente', 'Attestation de propriété'] },
  { id: 't2', propertyId: 'p5', contactId: 'c5', type: 'Location', stage: 'Bail', amount: 8500, commission: 8500, agentId: '5', createdAt: '2026-02-10', documents: ['Contrat de bail'] },
  { id: 't3', propertyId: 'p2', contactId: 'c3', type: 'Vente', stage: 'Offre', amount: 4000000, commission: 120000, agentId: '3', createdAt: '2026-02-22', documents: ['Offre d\'achat'] },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Nouvelle offre', message: 'Pierre Dupont a fait une offre sur Villa Moderne Marina', type: 'success', read: false, createdAt: '2026-02-25T10:30:00' },
  { id: 'n2', title: 'Mandat expire bientôt', message: 'Le mandat pour Terrain Constructible Taghazout expire dans 5 jours', type: 'warning', read: false, createdAt: '2026-02-25T09:00:00' },
  { id: 'n3', title: 'Relance requise', message: 'Mohammed El Fassi n\'a pas été contacté depuis 5 jours', type: 'info', read: false, createdAt: '2026-02-24T14:00:00' },
  { id: 'n4', title: 'Nouveau lead WhatsApp', message: 'Nouveau contact via WhatsApp : intéressé par appartements Founty', type: 'info', read: true, createdAt: '2026-02-24T11:00:00' },
  { id: 'n5', title: 'Visite confirmée', message: 'Visite de l\'appartement Haut Founty confirmée pour demain 15h', type: 'success', read: true, createdAt: '2026-02-23T16:00:00' },
];

export const formatMAD = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(amount) + ' DH';
};
