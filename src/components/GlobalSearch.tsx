import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Building2, Users, FileText, Home, Search, MapPin, DollarSign, Phone, Star } from 'lucide-react';
import { mockProperties, mockContacts, mockTransactions, formatMAD } from '@/data/mockData';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher un bien, contact, transaction…" />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        {/* Properties */}
        <CommandGroup heading="Biens Immobiliers">
          {mockProperties.map(p => (
            <CommandItem key={p.id} onSelect={() => go('/biens')} className="flex items-center gap-3 cursor-pointer">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {p.quartier}, {p.city} · {p.status}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary shrink-0">{formatMAD(p.price)}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Contacts */}
        <CommandGroup heading="Contacts">
          {mockContacts.map(c => (
            <CommandItem key={c.id} onSelect={() => go('/contacts')} className="flex items-center gap-3 cursor-pointer">
              <Users className="h-4 w-4 text-accent-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {c.phone} · {c.type}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-warning shrink-0">
                <Star className="h-3 w-3" /> {c.score}%
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Transactions */}
        <CommandGroup heading="Transactions">
          {mockTransactions.map(t => {
            const prop = mockProperties.find(p => p.id === t.propertyId);
            const contact = mockContacts.find(c => c.id === t.contactId);
            return (
              <CommandItem key={t.id} onSelect={() => go('/transactions')} className="flex items-center gap-3 cursor-pointer">
                <FileText className="h-4 w-4 text-success shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{prop?.title || 'Bien'} — {contact?.name || 'Client'}</p>
                  <p className="text-xs text-muted-foreground">{t.type} · {t.stage}</p>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">{formatMAD(t.amount)}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation rapide */}
        <CommandGroup heading="Navigation">
          {[
            { label: 'Dashboard', path: '/dashboard', icon: '📊' },
            { label: 'Biens Immobiliers', path: '/biens', icon: '🏠' },
            { label: 'CRM Contacts', path: '/contacts', icon: '👥' },
            { label: 'Transactions', path: '/transactions', icon: '📄' },
            { label: 'Gestion Locative', path: '/gestion-locative', icon: '🏘️' },
            { label: 'Documents', path: '/documents', icon: '✍️' },
            { label: 'Communication', path: '/communication', icon: '💬' },
            { label: 'Statistiques', path: '/statistiques', icon: '📈' },
            { label: 'Paramètres', path: '/parametres', icon: '⚙️' },
          ].map(n => (
            <CommandItem key={n.path} onSelect={() => go(n.path)} className="cursor-pointer">
              <span className="mr-2">{n.icon}</span> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
