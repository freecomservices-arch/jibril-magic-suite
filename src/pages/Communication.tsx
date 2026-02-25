import React from 'react';
import { MessageSquare, Send, Phone, Clock, Users, Building2, Plus, Search, Paperclip, Smile } from 'lucide-react';
import AvatarInitials from '@/components/AvatarInitials';
import StatCard from '@/components/StatCard';

const conversations = [
  { id: '1', name: 'Mohammed El Fassi', lastMessage: 'Bonjour, je souhaite visiter l\'appartement Founty', time: '10:30', unread: 2, phone: '+212 6 12 34 56 78' },
  { id: '2', name: 'Pierre Dupont', lastMessage: 'Merci pour les photos de la villa', time: '09:15', unread: 0, phone: '+33 6 12 34 56 78' },
  { id: '3', name: 'Samira Alaoui', lastMessage: 'Le loyer inclut-il les charges ?', time: 'Hier', unread: 1, phone: '+212 6 55 66 77 88' },
  { id: '4', name: 'Ahmed Ouazzani', lastMessage: 'Disponible pour une visite samedi ?', time: 'Hier', unread: 0, phone: '+212 6 33 44 55 66' },
];

const templates = [
  '👋 Bonjour {nom}, nous avons un bien qui pourrait vous intéresser...',
  '📋 Voici la fiche du bien : {lien}',
  '📅 Confirmez-vous le RDV pour la visite de {bien} ?',
  '💰 Suite à notre discussion, voici notre offre pour {bien}...',
];

const Communication: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-success" />
            Communication WhatsApp
          </h1>
          <p className="text-sm text-muted-foreground mt-1">WhatsApp Business API — 50 messages/heure max</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Nouveau message
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Messages Envoyés" value={342} icon={Send} variant="primary" subtitle="Ce mois" />
        <StatCard title="Conversations" value={28} icon={MessageSquare} variant="accent" subtitle="Actives" />
        <StatCard title="Taux de Réponse" value="78%" icon={Users} variant="default" />
        <StatCard title="Fiches Envoyées" value={56} icon={Building2} variant="warning" subtitle="Biens partagés" />
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversations List */}
        <div className="rounded-lg border border-border bg-card card-shadow">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Rechercher..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            </div>
          </div>
          <div className="divide-y divide-border">
            {conversations.map((c, i) => (
              <div key={c.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-background-secondary transition-colors ${i === 0 ? 'bg-primary/5' : ''}`}>
                <div className="relative">
                  <AvatarInitials name={c.name} />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-foreground">{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card card-shadow flex flex-col">
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AvatarInitials name="Mohammed El Fassi" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Mohammed El Fassi</p>
                <p className="text-[10px] text-success flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success inline-block" /> En ligne</p>
              </div>
            </div>
            <button className="rounded-md bg-success/10 p-2 text-success hover:bg-success/20 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 space-y-4 min-h-[300px] bg-background-secondary/50">
            <div className="flex justify-start">
              <div className="max-w-xs rounded-lg rounded-tl-none bg-card border border-border px-4 py-2.5 shadow-sm">
                <p className="text-sm text-card-foreground">Bonjour, je souhaite visiter l'appartement vue mer à Founty. Est-il encore disponible ?</p>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">10:25</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-xs rounded-lg rounded-tr-none bg-primary px-4 py-2.5 shadow-sm">
                <p className="text-sm text-primary-foreground">Bonjour Mohammed ! Oui, l'appartement est toujours disponible. Souhaitez-vous planifier une visite ?</p>
                <p className="text-[10px] text-primary-foreground/70 mt-1 text-right">10:28</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xs rounded-lg rounded-tl-none bg-card border border-border px-4 py-2.5 shadow-sm">
                <p className="text-sm text-card-foreground">Oui, ce serait possible demain vers 15h ?</p>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">10:30</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Paperclip className="h-5 w-5" /></button>
            <input type="text" placeholder="Tapez votre message..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Smile className="h-5 w-5" /></button>
            <button className="rounded-lg bg-success p-2 text-success-foreground hover:opacity-90 transition-opacity"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-primary" /> Templates de Messages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((t, i) => (
            <div key={i} className="rounded-lg border border-border bg-background-secondary p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
              <div className="rounded-md bg-primary/10 p-2 shrink-0"><Send className="h-3.5 w-3.5 text-primary" /></div>
              <p className="text-xs text-card-foreground">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communication;
