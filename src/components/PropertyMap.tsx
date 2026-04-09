import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '@/data/mockData';
import { formatMAD } from '@/data/mockData';
import { MapPin, Maximize, Bed, Bath } from 'lucide-react';

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusDot: Record<string, string> = {
  'Disponible': '#22c55e',
  'Réservé': '#f59e0b',
  'Vendu': '#3b82f6',
  'Loué': '#06b6d4',
  'Archivé': '#94a3b8',
};

const createPriceIcon = (price: string, status: string) => {
  const color = statusDot[status] || '#3b82f6';
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${color};
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      font-family: Inter, sans-serif;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
      text-align: center;
      transform: translate(-50%, -100%);
    ">${price}</div>
    <div style="
      width: 0; height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid ${color};
      margin: -2px auto 0;
      transform: translateX(0%);
    "></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty?: (id: string) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties, onSelectProperty }) => {
  const propertiesWithGps = properties.filter(p => p.gps);

  // Center on Agadir
  const center: [number, number] = propertiesWithGps.length > 0
    ? [
        propertiesWithGps.reduce((s, p) => s + p.gps!.lat, 0) / propertiesWithGps.length,
        propertiesWithGps.reduce((s, p) => s + p.gps!.lng, 0) / propertiesWithGps.length,
      ]
    : [30.4278, -9.5981];

  const formatPrice = (p: Property) => {
    if (p.price >= 1000000) return `${(p.price / 1000000).toFixed(1)}M`;
    if (p.price >= 1000) return `${Math.round(p.price / 1000)}K`;
    return `${p.price}`;
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden card-shadow" style={{ height: '500px' }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithGps.map(property => (
          <Marker
            key={property.id}
            position={[property.gps!.lat, property.gps!.lng]}
            icon={createPriceIcon(formatPrice(property) + ' DH', property.status)}
          >
            <Popup>
              <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600 }}>{property.title}</h3>
                <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#64748b' }}>
                  {property.quartier}, {property.city}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#3b82f6' }}>
                  {formatMAD(property.price)}
                  {property.transaction === 'Location' ? '/mois' : ''}
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#64748b', marginBottom: 6 }}>
                  <span>{property.surface} m²</span>
                  {property.bedrooms && <span>{property.bedrooms} ch.</span>}
                  {property.bathrooms && <span>{property.bathrooms} sdb</span>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: statusDot[property.status] + '20',
                    color: statusDot[property.status],
                  }}>{property.status}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: '#f1f5f9', color: '#64748b',
                  }}>{property.mandat}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
