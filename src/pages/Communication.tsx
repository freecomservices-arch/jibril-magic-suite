import React, { useState, useRef, useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import { MessageSquare, Send, Phone, Video, Clock, Users, Building2, Plus, Search, Paperclip, Smile, Image, Mic, Check, CheckCheck, ArrowDown } from 'lucide-react';
import AvatarInitials from '@/components/AvatarInitials';
import StatCard from '@/components/StatCard';

const conversations = [
  { id: '1', name: 'Mohammed El Fassi', lastMessage: 'Bonjour, je souhaite visiter l\'appartement Founty', time: '10:30', unread: 2, phone: '+212 6 12 34 56 78', online: true },
  { id: '2', name: 'Pierre Dupont', lastMessage: 'Merci pour les photos de la villa', time: '09:15', unread: 0, phone: '+33 6 12 34 56 78', online: false },
  { id: '3', name: 'Samira Alaoui', lastMessage: 'Le loyer inclut-il les charges ?', time: 'Hier', unread: 1, phone: '+212 6 55 66 77 88', online: true },
  { id: '4', name: 'Ahmed Ouazzani', lastMessage: 'Disponible pour une visite samedi ?', time: 'Hier', unread: 0, phone: '+212 6 33 44 55 66', online: false },
  { id: '5', name: 'Fatima Zahra Benali', lastMessage: 'J\'ai reçu le compromis, merci', time: 'Lun', unread: 0, phone: '+212 6 77 88 99 00', online: false },
  { id: '6', name: 'Youssef Tazi', lastMessage: 'Quel est le prix final ?', time: 'Lun', unread: 3, phone: '+212 6 44 55 66 77', online: true },
];

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'document';
}

const allMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Bonjour, je souhaite visiter l\'appartement vue mer à Founty. Est-il encore disponible ?', time: '10:25', sent: false },
    { id: '2', text: 'Bonjour Mohammed ! 👋 Oui, l\'appartement est toujours disponible. Souhaitez-vous planifier une visite ?', time: '10:28', sent: true, status: 'read' },
    { id: '3', text: 'Oui, ce serait possible demain vers 15h ?', time: '10:30', sent: false },
    { id: '4', text: 'Parfait ! Je vous confirme le RDV demain à 15h à l\'appartement. Je vous enverrai l\'adresse exacte. 📍', time: '10:32', sent: true, status: 'read' },
    { id: '5', text: 'L\'adresse : Résidence Perle Bleue, 3ème étage, Apt 12, Founty, Agadir', time: '10:33', sent: true, status: 'delivered' },
    { id: '6', text: 'Merci beaucoup ! J\'y serai. Une dernière question : le prix est-il négociable ?', time: '10:35', sent: false },
    { id: '7', text: 'Le prix affiché est de 1 850 000 DH. Il y a une marge de négociation raisonnable. On pourra en discuter lors de la visite. 😊', time: '10:38', sent: true, status: 'sent' },
  ],
  '2': [
    { id: '1', text: 'Bonjour, j\'ai bien reçu les photos de la villa Marina. Très belle propriété !', time: '09:10', sent: false },
    { id: '2', text: 'Merci Pierre ! C\'est effectivement un bien d\'exception avec vue panoramique sur la mer. 🌊', time: '09:12', sent: true, status: 'read' },
    { id: '3', text: 'Merci pour les photos de la villa', time: '09:15', sent: false },
  ],
  '3': [
    { id: '1', text: 'Bonjour, le loyer de l\'appartement à Haut Founty inclut-il les charges ?', time: '14:20', sent: false },
    { id: '2', text: 'Bonjour Samira ! Le loyer est de 8 500 DH/mois charges comprises (eau, syndic). L\'électricité reste à votre charge.', time: '14:25', sent: true, status: 'read' },
    { id: '3', text: 'Le loyer inclut-il les charges ?', time: '14:30', sent: false },
  ],
};

const templates = [
  { emoji: '👋', text: 'Bonjour {nom}, nous avons un bien qui pourrait vous intéresser...' },
  { emoji: '📋', text: 'Voici la fiche du bien : {lien}' },
  { emoji: '📅', text: 'Confirmez-vous le RDV pour la visite de {bien} ?' },
  { emoji: '💰', text: 'Suite à notre discussion, voici notre offre pour {bien}...' },
  { emoji: '🏠', text: 'Nouveau bien disponible à {quartier} — {prix} DH. Intéressé(e) ?' },
  { emoji: '📄', text: 'Votre compromis de vente est prêt. Pouvez-vous le consulter ?' },
];

const Communication: React.FC = () => {
  const [activeConv, setActiveConv] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(allMessages);
  const [searchConv, setSearchConv] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = conversations.find(c => c.id === activeConv);
  const currentMessages = messages[activeConv] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg: Message = {
      id: `${Date.now()}`,
      text: messageInput,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      status: 'sent',
    };
    setMessages(prev => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] || []), newMsg],
    }));
    setMessageInput('');

    // Simulate typing + response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: `${Date.now() + 1}`,
        text: 'Merci pour votre message ! Je reviens vers vous rapidement. 🙏',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sent: false,
      };
      setMessages(prev => ({
        ...prev,
        [activeConv]: [...(prev[activeConv] || []), reply],
      }));
    }, 2000 + Math.random() * 2000);
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchConv.toLowerCase())
  );

  const StatusIcon = ({ status }: { status?: string }) => {
    if (status === 'read') return <CheckCheck className="h-3 w-3 text-info" />;
    if (status === 'delivered') return <CheckCheck className="h-3 w-3 text-muted-foreground/60" />;
    return <Check className="h-3 w-3 text-muted-foreground/60" />;
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-success" />
              Communication WhatsApp
            </h1>
            <p className="text-sm text-muted-foreground mt-1">WhatsApp Business API — Messages instantanés</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-xl border border-border overflow-hidden bg-card card-shadow" style={{ height: '520px' }}>
          {/* Conversations List */}
          <div className="lg:col-span-4 xl:col-span-3 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchConv}
                  onChange={e => setSearchConv(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/50">
              {filteredConversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-background-secondary transition-colors ${
                    activeConv === c.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <AvatarInitials name={c.name} />
                    {c.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-card-foreground truncate">{c.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-success px-1.5 text-[10px] font-bold text-success-foreground shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarInitials name={activeContact?.name || ''} />
                  {activeContact?.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{activeContact?.name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    {activeContact?.online ? (
                      <><span className="h-1.5 w-1.5 rounded-full bg-success inline-block" /> En ligne</>
                    ) : (
                      <><Clock className="h-3 w-3" /> Vu récemment</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="rounded-md bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Video className="h-4 w-4" />
                </button>
                <button className="rounded-md bg-success/10 p-2 text-success hover:bg-success/20 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-background-secondary/30">
              {/* Date separator */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-[10px] text-muted-foreground bg-muted/50 rounded-full px-3 py-1">Aujourd'hui</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {currentMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.sent
                      ? 'bg-primary rounded-br-md text-primary-foreground'
                      : 'bg-card border border-border rounded-bl-md text-card-foreground'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sent ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.sent && <StatusIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex items-center gap-2 bg-card">
              <button className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Image className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 rounded-full bg-background border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
              {messageInput.trim() ? (
                <button onClick={sendMessage} className="rounded-full bg-success p-2.5 text-success-foreground hover:opacity-90 transition-opacity">
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <button className="rounded-full bg-success/10 p-2.5 text-success hover:bg-success/20 transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="rounded-lg border border-border bg-card p-5 card-shadow">
          <h2 className="font-heading text-base font-semibold text-card-foreground flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-primary" /> Templates Rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((t, i) => (
              <button
                key={i}
                onClick={() => setMessageInput(t.text)}
                className="rounded-lg border border-border bg-background-secondary p-3 flex items-start gap-3 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
              >
                <span className="text-xl">{t.emoji}</span>
                <p className="text-xs text-card-foreground group-hover:text-foreground transition-colors">{t.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Communication;
