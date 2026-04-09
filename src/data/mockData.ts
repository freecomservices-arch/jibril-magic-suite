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

const UNSPLASH_PHOTOS = {
  appartement: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  ],
  terrain: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
  ],
  riad: [
    'https://images.unsplash.com/photo-1548018560-c7196e0f2d42?w=800',
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800',
  ],
  bureau: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  ],
};

function photosFor(type: Property['type']): string[] {
  const key = type === 'Local Commercial' ? 'commercial' : type.toLowerCase() as keyof typeof UNSPLASH_PHOTOS;
  const pool = UNSPLASH_PHOTOS[key] || UNSPLASH_PHOTOS.appartement;
  return pool.slice(0, 2 + Math.floor(Math.random() * 2));
}

// ─── PROPERTIES (55) ───────────────────────────────────────────────
export const mockProperties: Property[] = [
  // Founty
  { id: 'p1', title: 'Appartement Vue Mer Founty', type: 'Appartement', transaction: 'Vente', price: 1850000, surface: 120, rooms: 4, bedrooms: 3, bathrooms: 2, city: 'Agadir', quartier: 'Founty', address: 'Résidence Les Palmiers, Founty', description: 'Magnifique appartement avec vue panoramique sur l\'océan. Finitions haut de gamme, cuisine équipée, 2 terrasses.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-01-15', gps: { lat: 30.4278, lng: -9.6137 } },
  { id: 'p2', title: 'Studio Meublé Founty Beach', type: 'Appartement', transaction: 'Location', price: 5500, surface: 45, rooms: 2, bedrooms: 1, bathrooms: 1, city: 'Agadir', quartier: 'Founty', address: 'Rés. Ocean View, Founty', description: 'Studio moderne meublé à 200m de la plage. Idéal pour saisonnier.', status: 'Disponible', mandat: 'Simple', agentId: '3', photos: photosFor('Appartement'), createdAt: '2026-01-18', gps: { lat: 30.4265, lng: -9.6150 } },
  { id: 'p3', title: 'Duplex Standing Founty', type: 'Appartement', transaction: 'Vente', price: 2950000, surface: 180, rooms: 5, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Founty', address: 'Rés. Le Parc, Founty', description: 'Duplex haut standing avec terrasse panoramique, garage et cave.', status: 'Réservé', mandat: 'Exclusif', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-01-22', gps: { lat: 30.4290, lng: -9.6120 } },
  // Marina
  { id: 'p4', title: 'Villa Moderne Marina', type: 'Villa', transaction: 'Vente', price: 4200000, surface: 350, rooms: 7, bedrooms: 5, bathrooms: 3, city: 'Agadir', quartier: 'Marina', address: 'Marina d\'Agadir, Lot 45', description: 'Villa contemporaine dans le quartier prisé de la Marina. Piscine privée, jardin paysager, garage double.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-01-20', gps: { lat: 30.4195, lng: -9.6058 } },
  { id: 'p5', title: 'Penthouse Marina View', type: 'Appartement', transaction: 'Vente', price: 6500000, surface: 220, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Agadir', quartier: 'Marina', address: 'Tour Marina Premium', description: 'Penthouse exceptionnel au dernier étage avec vue 360°. Jacuzzi privatif sur le toit.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-01-25', gps: { lat: 30.4200, lng: -9.6045 } },
  { id: 'p6', title: 'Local Commercial Marina', type: 'Local Commercial', transaction: 'Location', price: 25000, surface: 120, city: 'Agadir', quartier: 'Marina', address: 'Galerie Commerciale Marina', description: 'Emplacement premium en front de mer. Idéal restauration ou boutique luxe.', status: 'Disponible', mandat: 'Exclusif', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-02-01', gps: { lat: 30.4188, lng: -9.6062 } },
  { id: 'p7', title: 'Bureau Marina Business', type: 'Bureau', transaction: 'Location', price: 12000, surface: 80, city: 'Agadir', quartier: 'Marina', address: 'Marina Business Center, 3e étage', description: 'Bureau équipé dans centre d\'affaires. Salle de réunion partagée, parking.', status: 'Loué', mandat: 'Simple', agentId: '5', photos: photosFor('Bureau'), createdAt: '2026-02-03', gps: { lat: 30.4192, lng: -9.6050 } },
  // Talborjt
  { id: 'p8', title: 'Local Commercial Talborjt', type: 'Local Commercial', transaction: 'Location', price: 15000, surface: 85, city: 'Agadir', quartier: 'Talborjt', address: 'Av. Hassan II, Talborjt', description: 'Local commercial idéalement situé sur l\'avenue principale. Grande vitrine, excellent flux piéton.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-02-01', gps: { lat: 30.4315, lng: -9.5983 } },
  { id: 'p9', title: 'Appartement F3 Talborjt Centre', type: 'Appartement', transaction: 'Vente', price: 780000, surface: 72, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Talborjt', address: 'Rue du Marché, Talborjt', description: 'Appartement bien situé au centre, proximité tous commerces et transports.', status: 'Disponible', mandat: 'Simple', agentId: '3', photos: photosFor('Appartement'), createdAt: '2026-02-05', gps: { lat: 30.4320, lng: -9.5975 } },
  { id: 'p10', title: 'Immeuble Commercial Talborjt', type: 'Local Commercial', transaction: 'Vente', price: 8500000, surface: 400, city: 'Agadir', quartier: 'Talborjt', address: 'Bd Mohammed V, Talborjt', description: 'Immeuble de rapport, 4 locaux commerciaux + 8 appartements. Rendement 7%.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Local Commercial'), createdAt: '2026-02-06', gps: { lat: 30.4310, lng: -9.5990 } },
  // Haut Founty
  { id: 'p11', title: 'Appartement Haut Founty', type: 'Appartement', transaction: 'Location', price: 8500, surface: 90, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Haut Founty', address: 'Résidence Al Baraka, Haut Founty', description: 'Appartement meublé et équipé, parfait pour expatriés. Proche des commodités.', status: 'Loué', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-10', gps: { lat: 30.4350, lng: -9.6200 } },
  { id: 'p12', title: 'Villa Jardin Haut Founty', type: 'Villa', transaction: 'Vente', price: 3800000, surface: 280, rooms: 6, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Haut Founty', address: 'Lotissement Al Amal, Haut Founty', description: 'Villa avec grand jardin arboré, piscine et terrasse BBQ. Quartier calme et résidentiel.', status: 'Disponible', mandat: 'Semi-exclusif', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-02-08', gps: { lat: 30.4360, lng: -9.6215 } },
  { id: 'p13', title: 'F4 Neuf Haut Founty', type: 'Appartement', transaction: 'Vente', price: 1250000, surface: 105, rooms: 4, bedrooms: 3, bathrooms: 2, city: 'Agadir', quartier: 'Haut Founty', address: 'Rés. Les Oliviers', description: 'Appartement neuf jamais habité. Finitions modernes, parking sous-sol.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Appartement'), createdAt: '2026-02-12', gps: { lat: 30.4345, lng: -9.6190 } },
  // Charaf
  { id: 'p14', title: 'Riad Traditionnel Charaf', type: 'Riad', transaction: 'Vente', price: 2800000, surface: 200, rooms: 6, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Charaf', address: 'Quartier Charaf, Agadir', description: 'Riad rénové avec patio central, fontaine, zellige authentique. Potentiel maison d\'hôtes.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Riad'), createdAt: '2026-02-12', gps: { lat: 30.4180, lng: -9.5870 } },
  { id: 'p15', title: 'Maison Charaf à Rénover', type: 'Villa', transaction: 'Vente', price: 950000, surface: 150, rooms: 5, bedrooms: 3, bathrooms: 1, city: 'Agadir', quartier: 'Charaf', address: 'Derb Charaf', description: 'Maison traditionnelle à rénover. Bon potentiel, quartier en plein essor.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Villa'), createdAt: '2026-02-14', gps: { lat: 30.4175, lng: -9.5880 } },
  // Anza
  { id: 'p16', title: 'Appartement F2 Anza Plage', type: 'Appartement', transaction: 'Location', price: 4500, surface: 55, rooms: 2, bedrooms: 1, bathrooms: 1, city: 'Agadir', quartier: 'Anza', address: 'Rés. Anza Beach', description: 'Petit appartement lumineux proche plage d\'Anza. Idéal célibataire ou couple.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-15', gps: { lat: 30.4450, lng: -9.6350 } },
  { id: 'p17', title: 'Terrain Constructible Anza', type: 'Terrain', transaction: 'Vente', price: 1800000, surface: 500, city: 'Agadir', quartier: 'Anza', address: 'Zone Anza Nord', description: 'Terrain plat constructible, zonage R+3. Vue dégagée sur mer.', status: 'Disponible', mandat: 'Semi-exclusif', agentId: '2', photos: photosFor('Terrain'), createdAt: '2026-02-16', gps: { lat: 30.4465, lng: -9.6340 } },
  { id: 'p18', title: 'Villa Pieds dans l\'Eau Anza', type: 'Villa', transaction: 'Vente', price: 12000000, surface: 500, rooms: 8, bedrooms: 6, bathrooms: 4, city: 'Agadir', quartier: 'Anza', address: 'Corniche Anza', description: 'Villa d\'exception en front de mer. Architecture contemporaine, piscine à débordement.', status: 'Réservé', mandat: 'Exclusif', agentId: '2', photos: photosFor('Villa'), createdAt: '2026-02-17', gps: { lat: 30.4440, lng: -9.6365 } },
  // Dakhla
  { id: 'p19', title: 'Appartement Économique Dakhla', type: 'Appartement', transaction: 'Vente', price: 520000, surface: 60, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Dakhla', address: 'Cité Dakhla', description: 'Appartement économique dans quartier résidentiel. Proche école et mosquée.', status: 'Vendu', mandat: 'Simple', agentId: '4', photos: photosFor('Appartement'), createdAt: '2026-01-10', gps: { lat: 30.4100, lng: -9.5750 } },
  { id: 'p20', title: 'F3 Rénové Dakhla', type: 'Appartement', transaction: 'Vente', price: 690000, surface: 75, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Dakhla', address: 'Rue Dakhla Principale', description: 'Appartement entièrement rénové, cuisine moderne, salle de bain neuve.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-18', gps: { lat: 30.4110, lng: -9.5760 } },
  // Hay Mohammadi
  { id: 'p21', title: 'Local Hay Mohammadi', type: 'Local Commercial', transaction: 'Vente', price: 1200000, surface: 60, city: 'Agadir', quartier: 'Hay Mohammadi', address: 'Av. Principale Hay Mohammadi', description: 'Local commercial avec mezzanine. Quartier très commerçant.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-02-19', gps: { lat: 30.4050, lng: -9.5680 } },
  { id: 'p22', title: 'Appartement F4 Hay Mohammadi', type: 'Appartement', transaction: 'Location', price: 4000, surface: 80, rooms: 4, bedrooms: 3, bathrooms: 1, city: 'Agadir', quartier: 'Hay Mohammadi', address: 'Bloc C, Hay Mohammadi', description: 'Appartement familial, 3 chambres, salon marocain. Quartier animé.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-20', gps: { lat: 30.4060, lng: -9.5690 } },
  // Sonaba
  { id: 'p23', title: 'Bureau Open Space Sonaba', type: 'Bureau', transaction: 'Location', price: 18000, surface: 150, city: 'Agadir', quartier: 'Sonaba', address: 'Immeuble Sonaba Business', description: 'Plateau bureau open space climatisé. Fibre optique, parking 10 places.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Bureau'), createdAt: '2026-02-20', gps: { lat: 30.4220, lng: -9.5920 } },
  { id: 'p24', title: 'Appartement Sonaba Résidentiel', type: 'Appartement', transaction: 'Vente', price: 980000, surface: 85, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Sonaba', address: 'Rés. Sonaba Garden', description: 'Appartement dans résidence fermée avec piscine et sécurité 24h.', status: 'Disponible', mandat: 'Simple', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-02-21', gps: { lat: 30.4230, lng: -9.5930 } },
  // Tilila
  { id: 'p25', title: 'Villa Tilila Neuve', type: 'Villa', transaction: 'Vente', price: 5500000, surface: 400, rooms: 8, bedrooms: 5, bathrooms: 4, city: 'Agadir', quartier: 'Tilila', address: 'Lotissement Tilila Premium', description: 'Villa neuve dans lotissement fermé. Piscine, jardin, triple garage.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Villa'), createdAt: '2026-02-22', gps: { lat: 30.3950, lng: -9.5650 } },
  { id: 'p26', title: 'Terrain Tilila 800m²', type: 'Terrain', transaction: 'Vente', price: 2400000, surface: 800, city: 'Agadir', quartier: 'Tilila', address: 'Zone Tilila Extension', description: 'Grand terrain dans zone d\'extension. Zonage villa, quartier en développement.', status: 'Disponible', mandat: 'Semi-exclusif', agentId: '3', photos: photosFor('Terrain'), createdAt: '2026-02-22', gps: { lat: 30.3960, lng: -9.5640 } },
  // Taghazout
  { id: 'p27', title: 'Terrain Constructible Taghazout', type: 'Terrain', transaction: 'Vente', price: 3500000, surface: 1200, city: 'Taghazout', quartier: 'Taghazout', address: 'Zone touristique Taghazout Bay', description: 'Terrain avec vue sur mer, idéal pour projet touristique ou résidentiel de standing.', status: 'Réservé', mandat: 'Semi-exclusif', agentId: '2', photos: photosFor('Terrain'), createdAt: '2026-02-05', gps: { lat: 30.5445, lng: -9.7085 } },
  { id: 'p28', title: 'Villa Surf Taghazout', type: 'Villa', transaction: 'Location', price: 35000, surface: 180, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Taghazout', quartier: 'Taghazout', address: 'Taghazout Village', description: 'Villa de charme avec vue mer, ambiance surf. Location saisonnière ou annuelle.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-02-10', gps: { lat: 30.5450, lng: -9.7080 } },
  { id: 'p29', title: 'Riad Boutique Taghazout', type: 'Riad', transaction: 'Vente', price: 4800000, surface: 250, rooms: 8, bedrooms: 6, bathrooms: 5, city: 'Taghazout', quartier: 'Taghazout', address: 'Médina Taghazout', description: 'Riad boutique exploité en maison d\'hôtes. 6 suites, taux d\'occupation 80%. Affaire clé en main.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Riad'), createdAt: '2026-02-15', gps: { lat: 30.5440, lng: -9.7090 } },
  // Tamraght
  { id: 'p30', title: 'Maison Tamraght Ocean', type: 'Villa', transaction: 'Vente', price: 1600000, surface: 160, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Tamraght', quartier: 'Tamraght', address: 'Village Tamraght', description: 'Maison traditionnelle rénovée avec vue mer. Terrasse sur le toit.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Villa'), createdAt: '2026-02-18', gps: { lat: 30.5250, lng: -9.6950 } },
  // Inezgane
  { id: 'p31', title: 'Appartement F3 Inezgane Centre', type: 'Appartement', transaction: 'Vente', price: 580000, surface: 68, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Inezgane', quartier: 'Inezgane', address: 'Centre Inezgane', description: 'Appartement bien situé, proche souk et gare routière. Bon investissement locatif.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-19', gps: { lat: 30.3550, lng: -9.5350 } },
  { id: 'p32', title: 'Local Commercial Inezgane Souk', type: 'Local Commercial', transaction: 'Location', price: 8000, surface: 40, city: 'Inezgane', quartier: 'Inezgane', address: 'Près du Souk, Inezgane', description: 'Local commercial dans zone à fort passage. Idéal commerce de détail.', status: 'Loué', mandat: 'Simple', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-02-20', gps: { lat: 30.3560, lng: -9.5360 } },
  // Aït Melloul
  { id: 'p33', title: 'Villa Aït Melloul', type: 'Villa', transaction: 'Vente', price: 1400000, surface: 200, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Aït Melloul', quartier: 'Aït Melloul', address: 'Lotissement Al Irfane', description: 'Villa avec jardin dans quartier calme. Proche autoroute et zone industrielle.', status: 'Disponible', mandat: 'Simple', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-02-21', gps: { lat: 30.3350, lng: -9.5050 } },
  { id: 'p34', title: 'Terrain Industriel Aït Melloul', type: 'Terrain', transaction: 'Vente', price: 5000000, surface: 2000, city: 'Aït Melloul', quartier: 'Aït Melloul', address: 'Zone Industrielle Aït Melloul', description: 'Terrain dans zone industrielle avec accès direct route nationale.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Terrain'), createdAt: '2026-02-22', gps: { lat: 30.3340, lng: -9.5020 } },
  // More variety
  { id: 'p35', title: 'Appartement Luxe Founty Bay', type: 'Appartement', transaction: 'Vente', price: 3200000, surface: 160, rooms: 4, bedrooms: 3, bathrooms: 2, city: 'Agadir', quartier: 'Founty', address: 'Founty Bay Résidences', description: 'Appartement de luxe avec accès direct plage privée. Domotique complète.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-02-23', gps: { lat: 30.4270, lng: -9.6145 } },
  { id: 'p36', title: 'Villa R+1 Marina', type: 'Villa', transaction: 'Vente', price: 7800000, surface: 450, rooms: 9, bedrooms: 6, bathrooms: 4, city: 'Agadir', quartier: 'Marina', address: 'Quartier des Villas, Marina', description: 'Grande villa d\'architecte. Matériaux nobles, domotique, home cinéma.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Villa'), createdAt: '2026-02-23', gps: { lat: 30.4198, lng: -9.6040 } },
  { id: 'p37', title: 'Bureau Premium Talborjt', type: 'Bureau', transaction: 'Location', price: 9000, surface: 60, city: 'Agadir', quartier: 'Talborjt', address: 'Immeuble Atlas, Talborjt', description: 'Bureau au 5e étage, vue ville. Ascenseur, gardiennage, climatisation centrale.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Bureau'), createdAt: '2026-02-23', gps: { lat: 30.4318, lng: -9.5978 } },
  { id: 'p38', title: 'F2 Meublé Haut Founty', type: 'Appartement', transaction: 'Location', price: 6000, surface: 55, rooms: 2, bedrooms: 1, bathrooms: 1, city: 'Agadir', quartier: 'Haut Founty', address: 'Rés. Yasmine, Haut Founty', description: 'Studio F2 entièrement meublé avec goût. Wifi, machine à laver, climatisation.', status: 'Disponible', mandat: 'Simple', agentId: '3', photos: photosFor('Appartement'), createdAt: '2026-02-23', gps: { lat: 30.4355, lng: -9.6205 } },
  { id: 'p39', title: 'Villa Piscine Charaf', type: 'Villa', transaction: 'Vente', price: 3500000, surface: 300, rooms: 7, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Charaf', address: 'Résidence Charaf Hills', description: 'Villa avec piscine et vue sur la ville. Salle de sport, hammam privatif.', status: 'Réservé', mandat: 'Semi-exclusif', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-02-24', gps: { lat: 30.4185, lng: -9.5865 } },
  { id: 'p40', title: 'Appartement Anza Surf', type: 'Appartement', transaction: 'Location', price: 7000, surface: 70, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Anza', address: 'Rés. Surf House, Anza', description: 'Appartement décoré style surf. Proche spot de surf Anza. Location courte ou longue durée.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-24', gps: { lat: 30.4455, lng: -9.6355 } },
  { id: 'p41', title: 'Riad Dakhla Rénové', type: 'Riad', transaction: 'Vente', price: 1900000, surface: 170, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Agadir', quartier: 'Dakhla', address: 'Ancien quartier Dakhla', description: 'Riad entièrement rénové avec matériaux traditionnels. Charme et authenticité.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Riad'), createdAt: '2026-02-24', gps: { lat: 30.4105, lng: -9.5745 } },
  { id: 'p42', title: 'Local R+1 Hay Mohammadi', type: 'Local Commercial', transaction: 'Vente', price: 2200000, surface: 120, city: 'Agadir', quartier: 'Hay Mohammadi', address: 'Carrefour Hay Mohammadi', description: 'Local commercial sur 2 niveaux. Excellent emplacement, forte visibilité.', status: 'Disponible', mandat: 'Simple', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-02-24', gps: { lat: 30.4055, lng: -9.5685 } },
  { id: 'p43', title: 'Appartement Vue Mer Sonaba', type: 'Appartement', transaction: 'Vente', price: 1100000, surface: 95, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Sonaba', address: 'Rés. Sonaba Heights', description: 'Appartement avec belle vue mer au 6e étage. Ascenseur, parking.', status: 'Disponible', mandat: 'Simple', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-02-24', gps: { lat: 30.4225, lng: -9.5925 } },
  { id: 'p44', title: 'Villa Tilila Golf', type: 'Villa', transaction: 'Vente', price: 9500000, surface: 550, rooms: 10, bedrooms: 6, bathrooms: 5, city: 'Agadir', quartier: 'Tilila', address: 'Golf Tilila Resort', description: 'Villa prestige face au golf. Piscine chauffée, personnel de maison.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Villa'), createdAt: '2026-02-25', gps: { lat: 30.3945, lng: -9.5645 } },
  { id: 'p45', title: 'Duplex Taghazout Bay', type: 'Appartement', transaction: 'Vente', price: 2200000, surface: 130, rooms: 4, bedrooms: 3, bathrooms: 2, city: 'Taghazout', quartier: 'Taghazout', address: 'Taghazout Bay Resort', description: 'Duplex dans resort 5 étoiles. Accès piscine, spa, restaurant.', status: 'Disponible', mandat: 'Exclusif', agentId: '3', photos: photosFor('Appartement'), createdAt: '2026-02-25', gps: { lat: 30.5448, lng: -9.7082 } },
  { id: 'p46', title: 'Studio Tamraght Surf', type: 'Appartement', transaction: 'Location', price: 3500, surface: 35, rooms: 1, bedrooms: 1, bathrooms: 1, city: 'Tamraght', quartier: 'Tamraght', address: 'Plage Tamraght', description: 'Petit studio face à la mer. Parfait pour surfeurs et digital nomads.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-25', gps: { lat: 30.5255, lng: -9.6945 } },
  { id: 'p47', title: 'Terrain Vue Mer Founty', type: 'Terrain', transaction: 'Vente', price: 8000000, surface: 1500, city: 'Agadir', quartier: 'Founty', address: 'Colline Founty', description: 'Terrain exceptionnel sur les hauteurs de Founty. Vue mer imprenable. Zonage R+4.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Terrain'), createdAt: '2026-02-25', gps: { lat: 30.4300, lng: -9.6130 } },
  { id: 'p48', title: 'Appartement F5 Marina Luxe', type: 'Appartement', transaction: 'Vente', price: 4500000, surface: 200, rooms: 5, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Marina', address: 'Résidence Marina Palace', description: 'Grand appartement familial de luxe. Double séjour, cuisine américaine, 3 terrasses.', status: 'Vendu', mandat: 'Exclusif', agentId: '2', photos: photosFor('Appartement'), createdAt: '2026-01-05', gps: { lat: 30.4202, lng: -9.6052 } },
  { id: 'p49', title: 'Local Talborjt Angle', type: 'Local Commercial', transaction: 'Location', price: 20000, surface: 100, city: 'Agadir', quartier: 'Talborjt', address: 'Angle Av. Hassan II / Rue du Souss', description: 'Local d\'angle avec double vitrine. Emplacement stratégique numéro 1.', status: 'Loué', mandat: 'Exclusif', agentId: '4', photos: photosFor('Local Commercial'), createdAt: '2026-01-08', gps: { lat: 30.4312, lng: -9.5985 } },
  { id: 'p50', title: 'Appartement Inezgane Neuf', type: 'Appartement', transaction: 'Vente', price: 650000, surface: 72, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Inezgane', quartier: 'Inezgane', address: 'Nouveau Quartier Inezgane', description: 'Appartement neuf dans programme immobilier récent. Ascenseur, parking.', status: 'Disponible', mandat: 'Simple', agentId: '5', photos: photosFor('Appartement'), createdAt: '2026-02-26', gps: { lat: 30.3555, lng: -9.5345 } },
  { id: 'p51', title: 'Villa Aït Melloul Jardin', type: 'Villa', transaction: 'Location', price: 12000, surface: 180, rooms: 5, bedrooms: 3, bathrooms: 2, city: 'Aït Melloul', quartier: 'Aït Melloul', address: 'Quartier Résidentiel', description: 'Villa meublée avec jardin, idéale pour famille. Quartier calme.', status: 'Disponible', mandat: 'Simple', agentId: '3', photos: photosFor('Villa'), createdAt: '2026-02-26', gps: { lat: 30.3355, lng: -9.5045 } },
  { id: 'p52', title: 'Bureau Founty Business Park', type: 'Bureau', transaction: 'Location', price: 15000, surface: 100, city: 'Agadir', quartier: 'Founty', address: 'Founty Business Park', description: 'Bureau standing dans parc d\'affaires. Fibre, climatisation, accueil.', status: 'Disponible', mandat: 'Exclusif', agentId: '2', photos: photosFor('Bureau'), createdAt: '2026-02-26', gps: { lat: 30.4280, lng: -9.6135 } },
  { id: 'p53', title: 'Appartement Archivé Centre', type: 'Appartement', transaction: 'Vente', price: 750000, surface: 70, rooms: 3, bedrooms: 2, bathrooms: 1, city: 'Agadir', quartier: 'Talborjt', address: 'Centre Ville', description: 'Bien retiré du marché. Ancien mandat expiré.', status: 'Archivé', mandat: 'Simple', agentId: '4', photos: [], createdAt: '2025-12-01', gps: { lat: 30.4310, lng: -9.5980 } },
  { id: 'p54', title: 'Villa Vendue Haut Founty', type: 'Villa', transaction: 'Vente', price: 2900000, surface: 250, rooms: 6, bedrooms: 4, bathrooms: 3, city: 'Agadir', quartier: 'Haut Founty', address: 'Lotissement Prestige', description: 'Villa vendue en 15 jours. Mandat exclusif. Record agence.', status: 'Vendu', mandat: 'Exclusif', agentId: '2', photos: photosFor('Villa'), createdAt: '2025-12-15', gps: { lat: 30.4358, lng: -9.6210 } },
  { id: 'p55', title: 'Terrain Tamraght Colline', type: 'Terrain', transaction: 'Vente', price: 2000000, surface: 700, city: 'Tamraght', quartier: 'Tamraght', address: 'Colline Tamraght', description: 'Terrain avec vue panoramique océan et montagne. Accès route goudronnée.', status: 'Disponible', mandat: 'Semi-exclusif', agentId: '3', photos: photosFor('Terrain'), createdAt: '2026-02-26', gps: { lat: 30.5260, lng: -9.6940 } },
];

// ─── CONTACTS (105) ────────────────────────────────────────────────
const contactNames = [
  { name: 'Mohammed El Fassi', type: 'Acquéreur' as const, phone: '+212 6 12 34 56 78', email: 'elfassi@gmail.com', budget: 2000000, exigences: 'Appartement vue mer, 3 chambres minimum', score: 85 },
  { name: 'Aicha Benkirane', type: 'Vendeur' as const, phone: '+212 6 98 76 54 32', email: 'aicha.b@yahoo.fr', score: 70 },
  { name: 'Pierre Dupont', type: 'Acquéreur' as const, phone: '+33 6 12 34 56 78', email: 'pierre.d@gmail.com', budget: 5000000, exigences: 'Villa avec piscine, quartier résidentiel', score: 92, notes: 'MRE - Retraité français, cherche résidence principale' },
  { name: 'Hassan Tazi', type: 'Propriétaire' as const, phone: '+212 6 44 55 66 77', score: 60 },
  { name: 'Samira Alaoui', type: 'Locataire' as const, phone: '+212 6 55 66 77 88', email: 'samira.a@outlook.com', budget: 10000, exigences: 'Appartement meublé, centre-ville', score: 75 },
  { name: 'Jean-Michel Laurent', type: 'Acquéreur' as const, phone: '+33 6 78 90 12 34', email: 'jm.laurent@gmail.com', budget: 3000000, exigences: 'Terrain constructible ou riad à rénover', score: 65, notes: 'Expatrié, projet maison d\'hôtes' },
  { name: 'Khadija Benmoussa', type: 'Vendeur' as const, phone: '+212 6 11 22 33 44', score: 50 },
  { name: 'Ahmed Ouazzani', type: 'Acquéreur' as const, phone: '+212 6 33 44 55 66', budget: 1500000, score: 80 },
  { name: 'Fatima Zahra Idrissi', type: 'Acquéreur' as const, phone: '+212 6 22 33 44 55', email: 'fz.idrissi@gmail.com', budget: 1200000, exigences: 'F3 ou F4, quartier calme, parking', score: 78, notes: 'Enseignante, premier achat' },
  { name: 'Youssef Amrani', type: 'Propriétaire' as const, phone: '+212 6 77 88 99 00', email: 'y.amrani@hotmail.com', score: 65, notes: 'Possède 3 appartements à Founty' },
  { name: 'Sophie Martin', type: 'Acquéreur' as const, phone: '+33 6 45 67 89 01', email: 'sophie.martin@orange.fr', budget: 2500000, exigences: 'Villa ou riad, piscine obligatoire', score: 88, notes: 'MRE - Budget flexible, visite prévue en mars' },
  { name: 'Rachid El Amri', type: 'Vendeur' as const, phone: '+212 6 66 77 88 99', score: 45, notes: 'Héritier, souhaite vendre rapidement' },
  { name: 'Nadia Belhaj', type: 'Locataire' as const, phone: '+212 6 11 00 99 88', email: 'nadia.b@gmail.com', budget: 8000, exigences: 'F2 meublé, proche université', score: 70 },
  { name: 'Omar Benjelloun', type: 'Acquéreur' as const, phone: '+212 6 55 44 33 22', email: 'omar.benj@yahoo.com', budget: 800000, exigences: 'Appartement économique, Inezgane ou Aït Melloul', score: 55 },
  { name: 'Marie-Claire Dubois', type: 'Acquéreur' as const, phone: '+33 7 12 34 56 78', email: 'mc.dubois@gmail.com', budget: 4000000, exigences: 'Penthouse ou villa marina, vue mer exigée', score: 95, notes: 'Cliente VIP, recommandée par Pierre Dupont' },
  { name: 'Abdellah Saidi', type: 'Propriétaire' as const, phone: '+212 6 99 88 77 66', score: 58, notes: 'Terrain à Tilila, attend offre sérieuse' },
  { name: 'Leila Chraibi', type: 'Vendeur' as const, phone: '+212 6 44 33 22 11', email: 'leila.c@outlook.com', score: 72, notes: 'Vend villa Charaf pour déménagement Casablanca' },
  { name: 'Jacques Moreau', type: 'Acquéreur' as const, phone: '+33 6 99 88 77 66', email: 'j.moreau@free.fr', budget: 1800000, exigences: 'Appartement F3 Founty, calme', score: 68 },
  { name: 'Zineb El Ouardi', type: 'Locataire' as const, phone: '+212 6 22 11 00 99', email: 'zineb.o@gmail.com', budget: 5000, exigences: 'Studio Talborjt, budget serré', score: 40 },
  { name: 'Mustapha Lahlou', type: 'Acquéreur' as const, phone: '+212 6 88 77 66 55', budget: 3500000, exigences: 'Villa Tilila ou Haut Founty', score: 82, notes: 'Médecin, prêt bancaire approuvé' },
  { name: 'Isabelle Lefèvre', type: 'Acquéreur' as const, phone: '+33 6 34 56 78 90', email: 'isa.lefevre@wanadoo.fr', budget: 900000, exigences: 'Petit bien pour investissement locatif', score: 60 },
  { name: 'Brahim Ait Baha', type: 'Propriétaire' as const, phone: '+212 6 00 11 22 33', score: 55, notes: '2 locaux commerciaux Hay Mohammadi' },
  { name: 'Karima Ziani', type: 'Vendeur' as const, phone: '+212 6 33 22 11 00', email: 'k.ziani@gmail.com', score: 68 },
  { name: 'Thomas Bernard', type: 'Acquéreur' as const, phone: '+33 7 56 78 90 12', email: 'thomas.b@gmail.com', budget: 6000000, exigences: 'Villa prestige ou terrain constructible Taghazout', score: 90, notes: 'Investisseur immobilier professionnel' },
  { name: 'Houda Filali', type: 'Locataire' as const, phone: '+212 6 77 66 55 44', budget: 12000, exigences: 'Villa meublée avec jardin, famille 5 personnes', score: 73 },
  { name: 'Driss Mansouri', type: 'Acquéreur' as const, phone: '+212 6 11 22 33 44', budget: 700000, exigences: 'F3 Dakhla ou Hay Mohammadi', score: 48 },
  { name: 'Catherine Petit', type: 'Acquéreur' as const, phone: '+33 6 67 89 01 23', email: 'cath.petit@gmail.com', budget: 1500000, exigences: 'Riad à rénover ou maison traditionnelle', score: 74, notes: 'Artiste, projet atelier-résidence' },
  { name: 'Abdelkader Tahiri', type: 'Propriétaire' as const, phone: '+212 6 44 55 66 77', score: 62, notes: 'Immeuble Talborjt, cherche acquéreur sérieux' },
  { name: 'Salma Bennani', type: 'Vendeur' as const, phone: '+212 6 88 99 00 11', email: 'salma.b@yahoo.fr', score: 76 },
  { name: 'Philippe Garnier', type: 'Acquéreur' as const, phone: '+33 6 01 23 45 67', email: 'ph.garnier@gmail.com', budget: 2200000, exigences: 'Appartement luxe Marina ou Founty', score: 83 },
  { name: 'Naima El Kadi', type: 'Locataire' as const, phone: '+212 6 55 44 33 22', email: 'naima.k@outlook.com', budget: 6500, exigences: 'F2 ou F3, Haut Founty ou Sonaba', score: 65 },
  { name: 'Khalid Berrada', type: 'Acquéreur' as const, phone: '+212 6 22 33 44 55', budget: 4500000, exigences: 'Villa piscine Founty ou Marina', score: 87, notes: 'Entrepreneur, paiement cash possible' },
  { name: 'Brigitte Rousseau', type: 'Acquéreur' as const, phone: '+33 7 89 01 23 45', email: 'b.rousseau@sfr.fr', budget: 1000000, exigences: 'Appartement pour location saisonnière Taghazout', score: 71 },
  { name: 'Mehdi Cherkaoui', type: 'Propriétaire' as const, phone: '+212 6 66 55 44 33', score: 57, notes: 'Villa Anza, urgent' },
  { name: 'Asmae Benali', type: 'Vendeur' as const, phone: '+212 6 99 00 11 22', email: 'asmae.b@gmail.com', score: 64 },
  { name: 'Laurent Mercier', type: 'Acquéreur' as const, phone: '+33 6 23 45 67 89', email: 'l.mercier@gmail.com', budget: 8000000, exigences: 'Propriété d\'exception, vue mer obligatoire', score: 96, notes: 'PDG société, budget illimité, ne vient qu\'en été' },
  { name: 'Hanane Oufkir', type: 'Locataire' as const, phone: '+212 6 33 44 55 66', budget: 4000, exigences: 'Studio ou F2 économique', score: 35 },
  { name: 'Aziz Kettani', type: 'Acquéreur' as const, phone: '+212 6 77 88 99 00', email: 'a.kettani@hotmail.com', budget: 1600000, exigences: 'Appartement F4, résidence avec piscine', score: 77 },
  { name: 'Sandrine Legrand', type: 'Acquéreur' as const, phone: '+33 6 45 67 89 01', email: 's.legrand@orange.fr', budget: 750000, exigences: 'Studio ou F2 investissement', score: 52 },
  { name: 'Abderrahman Fassi-Fihri', type: 'Propriétaire' as const, phone: '+212 6 00 99 88 77', score: 69, notes: 'Terrain 2000m² Tilila, titre foncier en cours' },
  { name: 'Meriem Hajji', type: 'Vendeur' as const, phone: '+212 6 11 00 99 88', email: 'meriem.h@gmail.com', score: 73 },
  { name: 'François Dumas', type: 'Acquéreur' as const, phone: '+33 7 67 89 01 23', email: 'f.dumas@laposte.net', budget: 3200000, exigences: 'Riad boutique ou villa charme Taghazout', score: 85, notes: 'Projet hôtelier, partenaire financier confirmé' },
  { name: 'Imane Slimani', type: 'Locataire' as const, phone: '+212 6 44 33 22 11', email: 'imane.s@yahoo.com', budget: 7500, exigences: 'F3 meublé, Founty ou Haut Founty', score: 66 },
  { name: 'Othmane Alami', type: 'Acquéreur' as const, phone: '+212 6 88 77 66 55', budget: 950000, exigences: 'Local commercial bien situé', score: 61, notes: 'Commerçant, cherche investissement' },
  { name: 'Hélène Bonnet', type: 'Acquéreur' as const, phone: '+33 6 89 01 23 45', email: 'h.bonnet@gmail.com', budget: 2800000, exigences: 'Villa contemporaine, architecture moderne', score: 79 },
  { name: 'Samir El Idrissi', type: 'Propriétaire' as const, phone: '+212 6 55 66 77 88', score: 54, notes: 'Appartement Sonaba, locataire problématique' },
  { name: 'Latifa Benchekroun', type: 'Vendeur' as const, phone: '+212 6 22 11 00 99', email: 'latifa.b@outlook.com', score: 67 },
  { name: 'Marc Fontaine', type: 'Acquéreur' as const, phone: '+33 6 12 34 56 78', email: 'm.fontaine@gmail.com', budget: 1300000, exigences: 'Appartement F3 pour retraite, calme et sécurisé', score: 72 },
  { name: 'Wafae Ennaji', type: 'Locataire' as const, phone: '+212 6 99 88 77 66', budget: 9000, exigences: 'Appartement standing, expatriée', score: 80, notes: 'Cadre multinationale, contrat 2 ans' },
  { name: 'Yassine Bennani', type: 'Acquéreur' as const, phone: '+212 6 33 22 11 00', budget: 550000, exigences: 'Premier achat, F2 ou F3 économique', score: 42 },
  // Additional generated contacts
  { name: 'Amina Touzani', type: 'Vendeur' as const, phone: '+212 6 10 20 30 40', score: 58 },
  { name: 'Patrick Renaud', type: 'Acquéreur' as const, phone: '+33 6 50 60 70 80', email: 'p.renaud@gmail.com', budget: 1700000, score: 74 },
  { name: 'Soukaina Moutawakil', type: 'Locataire' as const, phone: '+212 6 20 30 40 50', budget: 5500, score: 56 },
  { name: 'Karim Hajjaji', type: 'Propriétaire' as const, phone: '+212 6 30 40 50 60', score: 63 },
  { name: 'Christine Leclerc', type: 'Acquéreur' as const, phone: '+33 7 40 50 60 70', email: 'c.leclerc@free.fr', budget: 2100000, score: 81 },
  { name: 'Rachida Ouazzani', type: 'Vendeur' as const, phone: '+212 6 40 50 60 70', score: 47 },
  { name: 'Noureddine El Baz', type: 'Acquéreur' as const, phone: '+212 6 50 60 70 80', budget: 3800000, score: 89, notes: 'Promoteur immobilier, achats groupés' },
  { name: 'Valérie Dupuis', type: 'Acquéreur' as const, phone: '+33 6 60 70 80 90', email: 'v.dupuis@gmail.com', budget: 1100000, score: 63 },
  { name: 'Hamid Laghzali', type: 'Propriétaire' as const, phone: '+212 6 60 70 80 90', score: 51 },
  { name: 'Siham Talbi', type: 'Locataire' as const, phone: '+212 6 70 80 90 00', email: 's.talbi@hotmail.com', budget: 6000, score: 59 },
  { name: 'Alain Duval', type: 'Acquéreur' as const, phone: '+33 6 80 90 00 11', email: 'a.duval@wanadoo.fr', budget: 4200000, score: 86 },
  { name: 'Malika Bouzid', type: 'Vendeur' as const, phone: '+212 6 80 90 00 11', score: 44 },
  { name: 'Redouane Kabbaj', type: 'Acquéreur' as const, phone: '+212 6 90 00 11 22', budget: 620000, score: 38 },
  { name: 'Monique Girard', type: 'Acquéreur' as const, phone: '+33 7 00 11 22 33', email: 'm.girard@orange.fr', budget: 1400000, score: 69 },
  { name: 'Anas Sefrioui', type: 'Propriétaire' as const, phone: '+212 6 00 11 22 33', score: 75, notes: 'Groupe immobilier, 12 biens en portefeuille' },
  { name: 'Ghizlane Raji', type: 'Locataire' as const, phone: '+212 6 10 21 32 43', budget: 4500, score: 33 },
  { name: 'Bernard Leroy', type: 'Acquéreur' as const, phone: '+33 6 21 32 43 54', email: 'b.leroy@gmail.com', budget: 7500000, score: 93, notes: 'Investisseur, portefeuille international' },
  { name: 'Souad Chraibi', type: 'Vendeur' as const, phone: '+212 6 32 43 54 65', email: 'souad.c@yahoo.fr', score: 71 },
  { name: 'Tarik Boussaid', type: 'Acquéreur' as const, phone: '+212 6 43 54 65 76', budget: 2600000, score: 84 },
  { name: 'Nathalie Simon', type: 'Acquéreur' as const, phone: '+33 6 54 65 76 87', email: 'n.simon@gmail.com', budget: 1950000, score: 76 },
  { name: 'Moulay Ahmed Idrissi', type: 'Propriétaire' as const, phone: '+212 6 65 76 87 98', score: 66 },
  { name: 'Bouchra El Mansouri', type: 'Locataire' as const, phone: '+212 6 76 87 98 09', email: 'bouchra.m@outlook.com', budget: 11000, score: 72 },
  { name: 'Gérard Blanc', type: 'Acquéreur' as const, phone: '+33 7 87 98 09 10', email: 'g.blanc@sfr.fr', budget: 3600000, score: 88 },
  { name: 'Hayat Benjelloun', type: 'Vendeur' as const, phone: '+212 6 87 98 09 10', score: 53 },
  { name: 'Amine Zouiten', type: 'Acquéreur' as const, phone: '+212 6 98 09 10 21', budget: 850000, score: 57 },
  { name: 'Sylvie Morel', type: 'Acquéreur' as const, phone: '+33 6 09 10 21 32', email: 's.morel@laposte.net', budget: 1050000, score: 64 },
  { name: 'Jamal El Haddad', type: 'Propriétaire' as const, phone: '+212 6 09 10 21 32', score: 49 },
  { name: 'Loubna Amine', type: 'Locataire' as const, phone: '+212 6 10 21 32 43', budget: 3800, score: 31 },
  { name: 'Didier Faure', type: 'Acquéreur' as const, phone: '+33 7 21 32 43 54', email: 'd.faure@gmail.com', budget: 5500000, score: 91 },
  { name: 'Nawal Cherkaoui', type: 'Vendeur' as const, phone: '+212 6 21 32 43 55', score: 62 },
  { name: 'Saad Tazi', type: 'Acquéreur' as const, phone: '+212 6 32 43 54 66', budget: 1350000, score: 73 },
  { name: 'Martine Caron', type: 'Acquéreur' as const, phone: '+33 6 43 54 65 77', email: 'm.caron@free.fr', budget: 980000, score: 58 },
  { name: 'Abdelilah Mokhtari', type: 'Propriétaire' as const, phone: '+212 6 54 65 76 88', score: 46, notes: 'Terrain Anza, litige voisinage résolu' },
  { name: 'Ikram Sbihi', type: 'Locataire' as const, phone: '+212 6 65 76 87 99', budget: 15000, score: 82, notes: 'Directrice société, cherche villa standing' },
  { name: 'Éric Perrin', type: 'Acquéreur' as const, phone: '+33 6 76 87 98 00', email: 'e.perrin@orange.fr', budget: 2400000, score: 80 },
  { name: 'Fatima Boutaleb', type: 'Vendeur' as const, phone: '+212 6 76 87 98 01', score: 59 },
  { name: 'Issam Lahrichi', type: 'Acquéreur' as const, phone: '+212 6 87 98 09 12', budget: 1150000, score: 67 },
  { name: 'Danielle Lambert', type: 'Acquéreur' as const, phone: '+33 7 98 09 10 23', email: 'd.lambert@gmail.com', budget: 6500000, score: 94, notes: 'Avocate, achète pour enfants étudiant au Maroc' },
  { name: 'Taha Ouahbi', type: 'Propriétaire' as const, phone: '+212 6 98 09 10 23', score: 50 },
  { name: 'Safae Meknassi', type: 'Locataire' as const, phone: '+212 6 09 10 21 34', email: 'safae.m@gmail.com', budget: 8500, score: 68 },
  { name: 'Michel Fournier', type: 'Acquéreur' as const, phone: '+33 6 10 21 32 45', email: 'mfournier@yahoo.fr', budget: 1800000, score: 75 },
  { name: 'Samia El Alami', type: 'Vendeur' as const, phone: '+212 6 10 21 32 45', score: 61 },
  { name: 'Zakaria Bennis', type: 'Acquéreur' as const, phone: '+212 6 21 32 43 56', budget: 2800000, score: 83, notes: 'Chirurgien, paiement comptant' },
  { name: 'Claire Moreau', type: 'Acquéreur' as const, phone: '+33 7 32 43 54 67', email: 'c.moreau@gmail.com', budget: 1250000, score: 70 },
  { name: 'Mahjoub El Omari', type: 'Propriétaire' as const, phone: '+212 6 43 54 65 78', score: 56 },
  { name: 'Hajar Bensouda', type: 'Locataire' as const, phone: '+212 6 54 65 76 89', budget: 5200, score: 45 },
  { name: 'Patrice Aubert', type: 'Acquéreur' as const, phone: '+33 6 65 76 87 90', email: 'p.aubert@sfr.fr', budget: 3400000, score: 87 },
  { name: 'Laila Kadiri', type: 'Vendeur' as const, phone: '+212 6 65 76 87 90', score: 66 },
  { name: 'Hamza Fathi', type: 'Acquéreur' as const, phone: '+212 6 76 87 98 01', budget: 480000, score: 29 },
  { name: 'Joséphine Roux', type: 'Acquéreur' as const, phone: '+33 7 87 98 09 12', email: 'j.roux@orange.fr', budget: 2050000, score: 78 },
  { name: 'Abdelhak Laroui', type: 'Propriétaire' as const, phone: '+212 6 87 98 09 12', score: 43, notes: 'Riad Charaf héritage familial' },
  { name: 'Rim Chaoui', type: 'Locataire' as const, phone: '+212 6 98 09 10 24', email: 'rim.c@hotmail.com', budget: 7000, score: 64 },
  { name: 'Thierry Gaillard', type: 'Acquéreur' as const, phone: '+33 6 09 10 21 35', email: 't.gaillard@laposte.net', budget: 4800000, score: 92, notes: 'Retraité diplomate, connaît bien le Maroc' },
];

const agents = ['2', '3', '4', '5'];
const dates2026 = [
  '2026-01-05', '2026-01-08', '2026-01-10', '2026-01-12', '2026-01-15', '2026-01-18', '2026-01-20', '2026-01-22',
  '2026-01-25', '2026-01-28', '2026-02-01', '2026-02-03', '2026-02-05', '2026-02-07', '2026-02-08', '2026-02-10',
  '2026-02-12', '2026-02-14', '2026-02-15', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21',
  '2026-02-22', '2026-02-23', '2026-02-24', '2026-02-25', '2026-02-26',
];
const lastContactDates = [
  '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20',
  '2026-02-21', '2026-02-22', '2026-02-23', '2026-02-24', '2026-02-25', '2026-02-26',
];

export const mockContacts: Contact[] = contactNames.map((c, i) => ({
  id: `c${i + 1}`,
  name: c.name,
  type: c.type,
  phone: c.phone,
  email: c.email,
  budget: c.budget,
  exigences: c.exigences,
  score: c.score,
  agentId: agents[i % agents.length],
  createdAt: dates2026[i % dates2026.length],
  lastContact: i % 3 === 0 ? lastContactDates[i % lastContactDates.length] : undefined,
  notes: c.notes,
  ...(i === 7 ? { lockedBy: '4', lockedUntil: '2026-02-26' } : {}),
}));

// ─── TRANSACTIONS (22) ────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  { id: 't1', propertyId: 'p1', contactId: 'c1', type: 'Vente', stage: 'Compromis', amount: 1850000, commission: 55500, agentId: '2', createdAt: '2026-02-15', documents: ['Compromis de vente', 'Attestation de propriété'] },
  { id: 't2', propertyId: 'p11', contactId: 'c5', type: 'Location', stage: 'Bail', amount: 8500, commission: 8500, agentId: '5', createdAt: '2026-02-10', documents: ['Contrat de bail'] },
  { id: 't3', propertyId: 'p4', contactId: 'c3', type: 'Vente', stage: 'Offre', amount: 4000000, commission: 120000, agentId: '3', createdAt: '2026-02-22', documents: ['Offre d\'achat'] },
  { id: 't4', propertyId: 'p5', contactId: 'c15', type: 'Vente', stage: 'Visite', amount: 6500000, commission: 195000, agentId: '2', createdAt: '2026-02-24', documents: ['Fiche de visite'] },
  { id: 't5', propertyId: 'p14', contactId: 'c6', type: 'Vente', stage: 'Offre', amount: 2600000, commission: 78000, agentId: '3', createdAt: '2026-02-23', documents: ['Offre d\'achat'] },
  { id: 't6', propertyId: 'p12', contactId: 'c20', type: 'Vente', stage: 'Compromis', amount: 3800000, commission: 114000, agentId: '3', createdAt: '2026-02-20', documents: ['Compromis de vente', 'Diagnostic technique'] },
  { id: 't7', propertyId: 'p25', contactId: 'c32', type: 'Vente', stage: 'Notaire', amount: 5500000, commission: 165000, agentId: '2', createdAt: '2026-02-18', documents: ['Compromis de vente', 'Attestation bancaire', 'Certificat notarié'] },
  { id: 't8', propertyId: 'p48', contactId: 'c30', type: 'Vente', stage: 'Signé', amount: 4500000, commission: 135000, agentId: '2', createdAt: '2026-01-15', documents: ['Acte de vente', 'Certificat de propriété', 'Quittance commission'] },
  { id: 't9', propertyId: 'p19', contactId: 'c14', type: 'Vente', stage: 'Signé', amount: 520000, commission: 15600, agentId: '4', createdAt: '2026-01-20', documents: ['Acte de vente', 'Certificat de propriété'] },
  { id: 't10', propertyId: 'p54', contactId: 'c8', type: 'Vente', stage: 'Signé', amount: 2900000, commission: 87000, agentId: '2', createdAt: '2025-12-20', documents: ['Acte de vente', 'Certificat de propriété', 'Quittance'] },
  { id: 't11', propertyId: 'p6', contactId: 'c44', type: 'Location', stage: 'Visite', amount: 25000, commission: 25000, agentId: '4', createdAt: '2026-02-25', documents: ['Fiche de visite'] },
  { id: 't12', propertyId: 'p16', contactId: 'c13', type: 'Location', stage: 'Bail', amount: 4500, commission: 4500, agentId: '5', createdAt: '2026-02-22', documents: ['Contrat de bail', 'État des lieux'] },
  { id: 't13', propertyId: 'p38', contactId: 'c43', type: 'Location', stage: 'État des lieux', amount: 6000, commission: 6000, agentId: '3', createdAt: '2026-02-24', documents: ['Contrat de bail', 'État des lieux entrant'] },
  { id: 't14', propertyId: 'p22', contactId: 'c25', type: 'Location', stage: 'Quittances', amount: 4000, commission: 4000, agentId: '5', createdAt: '2026-02-01', documents: ['Contrat de bail', 'Quittance Février'] },
  { id: 't15', propertyId: 'p7', contactId: 'c49', type: 'Location', stage: 'Quittances', amount: 12000, commission: 12000, agentId: '5', createdAt: '2026-01-10', documents: ['Contrat de bail', 'Quittance Janvier', 'Quittance Février'] },
  { id: 't16', propertyId: 'p36', contactId: 'c36', type: 'Vente', stage: 'Visite', amount: 7800000, commission: 234000, agentId: '2', createdAt: '2026-02-26', documents: ['Fiche de visite'] },
  { id: 't17', propertyId: 'p44', contactId: 'c24', type: 'Vente', stage: 'Offre', amount: 9200000, commission: 276000, agentId: '2', createdAt: '2026-02-25', documents: ['Offre d\'achat'] },
  { id: 't18', propertyId: 'p29', contactId: 'c42', type: 'Vente', stage: 'Compromis', amount: 4800000, commission: 144000, agentId: '2', createdAt: '2026-02-21', documents: ['Compromis de vente'] },
  { id: 't19', propertyId: 'p18', contactId: 'c11', type: 'Vente', stage: 'Notaire', amount: 11500000, commission: 345000, agentId: '2', createdAt: '2026-02-16', documents: ['Compromis de vente', 'Attestation bancaire', 'Dossier notaire'] },
  { id: 't20', propertyId: 'p28', contactId: 'c84', type: 'Location', stage: 'Bail', amount: 35000, commission: 35000, agentId: '3', createdAt: '2026-02-24', documents: ['Contrat de bail'] },
  { id: 't21', propertyId: 'p40', contactId: 'c91', type: 'Location', stage: 'Visite', amount: 7000, commission: 7000, agentId: '5', createdAt: '2026-02-26', documents: ['Fiche de visite'] },
  { id: 't22', propertyId: 'p51', contactId: 'c72', type: 'Location', stage: 'État des lieux', amount: 12000, commission: 12000, agentId: '3', createdAt: '2026-02-25', documents: ['Contrat de bail', 'État des lieux entrant', 'Inventaire mobilier'] },
];

// ─── NOTIFICATIONS (15) ───────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Nouvelle offre', message: 'Pierre Dupont a fait une offre sur Villa Moderne Marina', type: 'success', read: false, createdAt: '2026-02-26T10:30:00' },
  { id: 'n2', title: 'Mandat expire bientôt', message: 'Le mandat pour Terrain Constructible Taghazout expire dans 5 jours', type: 'warning', read: false, createdAt: '2026-02-26T09:00:00' },
  { id: 'n3', title: 'Relance requise', message: 'Mohammed El Fassi n\'a pas été contacté depuis 5 jours', type: 'info', read: false, createdAt: '2026-02-25T14:00:00' },
  { id: 'n4', title: 'Nouveau lead WhatsApp', message: 'Nouveau contact via WhatsApp : intéressé par appartements Founty', type: 'info', read: true, createdAt: '2026-02-25T11:00:00' },
  { id: 'n5', title: 'Visite confirmée', message: 'Visite de l\'appartement Haut Founty confirmée pour demain 15h', type: 'success', read: true, createdAt: '2026-02-24T16:00:00' },
  { id: 'n6', title: 'URGENT — Compromis à signer', message: 'Le compromis pour Villa Jardin Haut Founty doit être signé avant le 28/02', type: 'urgent', read: false, createdAt: '2026-02-26T08:00:00' },
  { id: 'n7', title: 'Transaction signée !', message: 'Appartement F5 Marina Luxe vendu à 4 500 000 DH. Commission : 135 000 DH', type: 'success', read: false, createdAt: '2026-02-26T07:30:00' },
  { id: 'n8', title: 'Nouveau bien ajouté', message: 'Villa Tilila Golf (9 500 000 DH) a été ajoutée au catalogue', type: 'info', read: false, createdAt: '2026-02-25T17:00:00' },
  { id: 'n9', title: 'Contact VIP en attente', message: 'Laurent Mercier (budget illimité) attend un rappel depuis 3 jours', type: 'urgent', read: false, createdAt: '2026-02-26T09:30:00' },
  { id: 'n10', title: 'Loyer impayé', message: 'Le loyer de Février pour Bureau Marina Business n\'a pas été encaissé', type: 'warning', read: false, createdAt: '2026-02-26T08:30:00' },
  { id: 'n11', title: 'Rapport IA disponible', message: 'Le rapport de visite IA pour Villa Surf Taghazout est prêt', type: 'info', read: true, createdAt: '2026-02-24T15:00:00' },
  { id: 'n12', title: 'Document signé', message: 'État des lieux signé électroniquement pour F2 Meublé Haut Founty', type: 'success', read: true, createdAt: '2026-02-24T12:00:00' },
  { id: 'n13', title: 'Alerte prix marché', message: 'Les prix à Founty ont augmenté de 8% ce trimestre selon vos données', type: 'warning', read: false, createdAt: '2026-02-25T10:00:00' },
  { id: 'n14', title: 'Nouveau scraping', message: '12 nouveaux biens détectés sur Avito et Mubawab', type: 'info', read: true, createdAt: '2026-02-23T18:00:00' },
  { id: 'n15', title: 'URGENT — Client sur place', message: 'Danielle Lambert est à Agadir et souhaite visiter 3 biens aujourd\'hui', type: 'urgent', read: false, createdAt: '2026-02-26T11:00:00' },
];

export const formatMAD = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(amount) + ' DH';
};
