import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Building2, Users, FileText, Search, MapPin, DollarSign, Phone, Star, Mic, MicOff, Globe, Clock, X } from 'lucide-react';
import { mockProperties, mockContacts, mockTransactions, formatMAD } from '@/data/mockData';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VoiceLang = 'fr-FR' | 'ar-MA';
type VoiceState = 'idle' | 'listening' | 'confirmed';

const HISTORY_KEY = 'jibril-voice-history';
const MAX_HISTORY = 5;

const getVoiceHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
};

const addToHistory = (text: string) => {
  if (!text.trim()) return;
  const history = getVoiceHistory().filter(h => h !== text);
  history.unshift(text);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
};

// Animated sound wave bars
const SoundWaves: React.FC = () => (
  <div className="flex items-center gap-[3px] h-5">
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-[3px] rounded-full bg-primary"
        style={{
          animation: `soundwave 0.6s ease-in-out ${i * 0.15}s infinite alternate`,
        }}
      />
    ))}
  </div>
);

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('fr-FR');
  const [voiceHistory, setVoiceHistory] = useState<string[]>(getVoiceHistory());
  const [searchValue, setSearchValue] = useState('');
  const recognitionRef = useRef<any>(null);
  const confirmedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Ctrl+Shift+M shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'M' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        onOpenChange(true);
        setTimeout(() => startVoice(), 300);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [voiceLang]);

  const startVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setVoiceState('listening');
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setSearchValue(transcript);
    };
    recognition.onend = () => {
      setVoiceState('confirmed');
      if (searchValue.trim()) {
        addToHistory(searchValue.trim());
        setVoiceHistory(getVoiceHistory());
      }
      if (confirmedTimerRef.current) clearTimeout(confirmedTimerRef.current);
      confirmedTimerRef.current = setTimeout(() => setVoiceState('idle'), 2000);
    };
    recognition.onerror = () => setVoiceState('idle');

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceLang, searchValue]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (confirmedTimerRef.current) clearTimeout(confirmedTimerRef.current);
    };
  }, []);

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearchValue('');
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setVoiceHistory([]);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-2 border-b border-border px-3">
        <CommandInput
          placeholder={voiceLang === 'ar-MA' ? 'ابحث عن عقار، جهة اتصال...' : 'Rechercher un bien, contact, transaction…'}
          value={searchValue}
          onValueChange={setSearchValue}
          className="flex-1"
        />
        {/* Voice controls */}
        <div className="flex items-center gap-1.5 py-2 shrink-0">
          {/* Language toggle */}
          <button
            onClick={() => setVoiceLang(prev => prev === 'fr-FR' ? 'ar-MA' : 'fr-FR')}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Changer la langue vocale"
          >
            <Globe className="h-3 w-3" />
            {voiceLang === 'fr-FR' ? 'FR' : 'عر'}
          </button>

          {/* Mic button */}
          <button
            onClick={voiceState === 'listening' ? stopVoice : startVoice}
            className={`relative rounded-lg p-2 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
              voiceState === 'listening'
                ? 'bg-destructive/15 text-destructive animate-pulse'
                : voiceState === 'confirmed'
                ? 'bg-success/15 text-success'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title={`Recherche vocale (⌘⇧M) — ${voiceLang === 'fr-FR' ? 'Français' : 'Arabe'}`}
          >
            {voiceState === 'listening' ? (
              <SoundWaves />
            ) : voiceState === 'confirmed' ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        {/* Voice history */}
        {voiceHistory.length > 0 && !searchValue && (
          <>
            <CommandGroup heading={
              <span className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Recherches vocales récentes</span>
                <button onClick={clearHistory} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            }>
              {voiceHistory.map((h, i) => (
                <CommandItem key={i} onSelect={() => setSearchValue(h)} className="cursor-pointer text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                  {h}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

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
