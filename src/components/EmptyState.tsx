import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IllustrationVariant = 'search' | 'contacts' | 'property' | 'documents' | 'transactions' | 'chat' | 'analytics' | 'upload' | 'default';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: IllustrationVariant;
}

const illustrations: Record<IllustrationVariant, React.FC<{ className?: string }>> = {
  search: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="120" height="90" rx="12" fill="hsl(var(--muted))" opacity="0.5" />
      <rect x="55" y="38" width="70" height="8" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
      <rect x="55" y="54" width="90" height="6" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="55" y="66" width="60" height="6" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="55" y="78" width="75" height="6" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <circle cx="145" cy="115" r="28" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" opacity="0.6" />
      <line x1="165" y1="135" x2="180" y2="150" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <circle cx="145" cy="115" r="8" fill="hsl(var(--primary))" opacity="0.15" />
    </svg>
  ),
  contacts: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="50" r="28" fill="hsl(var(--primary))" opacity="0.15" />
      <circle cx="100" cy="50" r="18" fill="hsl(var(--primary))" opacity="0.25" />
      <path d="M65 110C65 90 80 78 100 78C120 78 135 90 135 110" stroke="hsl(var(--primary))" strokeWidth="3" fill="hsl(var(--primary))" opacity="0.1" strokeLinecap="round" />
      <circle cx="55" cy="65" r="15" fill="hsl(var(--accent))" opacity="0.12" />
      <circle cx="55" cy="65" r="10" fill="hsl(var(--accent))" opacity="0.2" />
      <circle cx="145" cy="65" r="15" fill="hsl(var(--accent))" opacity="0.12" />
      <circle cx="145" cy="65" r="10" fill="hsl(var(--accent))" opacity="0.2" />
      <path d="M35 115C35 100 43 92 55 92" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
      <path d="M165 115C165 100 157 92 145 92" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
      <line x1="88" y1="130" x2="112" y2="130" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      <circle cx="100" cy="44" r="5" fill="hsl(var(--background))" opacity="0.6" />
    </svg>
  ),
  property: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="55" width="100" height="70" rx="6" fill="hsl(var(--muted))" opacity="0.4" />
      <path d="M40 60L100 20L160 60" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M40 60L100 25L160 60" fill="hsl(var(--primary))" opacity="0.08" />
      <rect x="70" y="85" width="25" height="40" rx="3" fill="hsl(var(--primary))" opacity="0.2" />
      <rect x="105" y="75" width="30" height="22" rx="3" fill="hsl(var(--info))" opacity="0.2" />
      <rect x="112" y="82" width="16" height="8" rx="1" fill="hsl(var(--info))" opacity="0.15" />
      <circle cx="88" cy="100" r="3" fill="hsl(var(--primary))" opacity="0.4" />
      <rect x="60" y="128" width="80" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.1" />
    </svg>
  ),
  documents: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="15" width="80" height="105" rx="6" fill="hsl(var(--muted))" opacity="0.4" />
      <rect x="65" y="15" width="80" height="105" rx="6" fill="hsl(var(--muted))" opacity="0.5" />
      <rect x="75" y="15" width="80" height="105" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <rect x="90" y="35" width="50" height="5" rx="2.5" fill="hsl(var(--primary))" opacity="0.3" />
      <rect x="90" y="48" width="40" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="90" y="58" width="45" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="90" y="68" width="35" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <rect x="90" y="85" width="50" height="14" rx="4" fill="hsl(var(--primary))" opacity="0.15" />
      <path d="M105 90L110 95L120 87" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="145" cy="130" r="18" fill="hsl(var(--success))" opacity="0.15" />
      <path d="M138 130L143 135L153 125" stroke="hsl(var(--success))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  transactions: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="30" width="40" height="100" rx="6" fill="hsl(var(--info))" opacity="0.1" stroke="hsl(var(--info))" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="62" y="30" width="40" height="100" rx="6" fill="hsl(var(--warning))" opacity="0.1" stroke="hsl(var(--warning))" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="110" y="30" width="40" height="100" rx="6" fill="hsl(var(--primary))" opacity="0.1" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="157" y="30" width="40" height="100" rx="6" fill="hsl(var(--success))" opacity="0.1" stroke="hsl(var(--success))" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="22" y="42" width="26" height="18" rx="4" fill="hsl(var(--info))" opacity="0.25" />
      <rect x="22" y="65" width="26" height="18" rx="4" fill="hsl(var(--info))" opacity="0.15" />
      <rect x="69" y="42" width="26" height="18" rx="4" fill="hsl(var(--warning))" opacity="0.25" />
      <rect x="117" y="42" width="26" height="18" rx="4" fill="hsl(var(--primary))" opacity="0.25" />
      <path d="M50 51H60" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" markerEnd="" />
      <path d="M97 51H108" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <path d="M145 51H155" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <circle cx="55" cy="51" r="3" fill="hsl(var(--muted-foreground))" opacity="0.2" />
      <circle cx="103" cy="51" r="3" fill="hsl(var(--muted-foreground))" opacity="0.2" />
      <circle cx="150" cy="51" r="3" fill="hsl(var(--muted-foreground))" opacity="0.2" />
    </svg>
  ),
  chat: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="100" height="40" rx="12" fill="hsl(var(--muted))" opacity="0.4" />
      <rect x="55" y="33" width="55" height="5" rx="2.5" fill="hsl(var(--muted-foreground))" opacity="0.2" />
      <rect x="55" y="42" width="35" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.12" />
      <path d="M45 60L52 55V60" fill="hsl(var(--muted))" opacity="0.4" />
      <rect x="70" y="70" width="95" height="40" rx="12" fill="hsl(var(--primary))" opacity="0.15" />
      <rect x="85" y="83" width="55" height="5" rx="2.5" fill="hsl(var(--primary))" opacity="0.3" />
      <rect x="85" y="92" width="40" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.15" />
      <path d="M160 110L153 105V110" fill="hsl(var(--primary))" opacity="0.15" />
      <circle cx="38" cy="128" r="4" fill="hsl(var(--muted-foreground))" opacity="0.15" />
      <circle cx="50" cy="128" r="4" fill="hsl(var(--muted-foreground))" opacity="0.2" />
      <circle cx="62" cy="128" r="4" fill="hsl(var(--muted-foreground))" opacity="0.25" />
    </svg>
  ),
  analytics: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="115" width="25" height="30" rx="4" fill="hsl(var(--primary))" opacity="0.2" />
      <rect x="58" y="85" width="25" height="60" rx="4" fill="hsl(var(--primary))" opacity="0.3" />
      <rect x="91" y="60" width="25" height="85" rx="4" fill="hsl(var(--primary))" opacity="0.4" />
      <rect x="124" y="75" width="25" height="70" rx="4" fill="hsl(var(--accent))" opacity="0.3" />
      <rect x="157" y="95" width="25" height="50" rx="4" fill="hsl(var(--accent))" opacity="0.2" />
      <path d="M37 110L70 82L103 55L137 70L170 90" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="37" cy="110" r="4" fill="hsl(var(--primary))" opacity="0.6" />
      <circle cx="70" cy="82" r="4" fill="hsl(var(--primary))" opacity="0.6" />
      <circle cx="103" cy="55" r="4" fill="hsl(var(--primary))" opacity="0.6" />
      <circle cx="137" cy="70" r="4" fill="hsl(var(--accent))" opacity="0.6" />
      <circle cx="170" cy="90" r="4" fill="hsl(var(--accent))" opacity="0.6" />
      <path d="M20 25L20 145L185 145" stroke="hsl(var(--border))" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  upload: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="40" width="100" height="80" rx="12" fill="hsl(var(--muted))" opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6 4" />
      <path d="M100 60V105" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M85 75L100 60L115 75" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <circle cx="75" cy="130" r="3" fill="hsl(var(--success))" opacity="0.5" />
      <circle cx="90" cy="130" r="3" fill="hsl(var(--warning))" opacity="0.5" />
      <circle cx="105" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
    </svg>
  ),
  default: ({ className }) => (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="70" r="40" fill="hsl(var(--primary))" opacity="0.08" />
      <circle cx="100" cy="70" r="25" fill="hsl(var(--primary))" opacity="0.12" />
      <circle cx="100" cy="70" r="10" fill="hsl(var(--primary))" opacity="0.2" />
      <rect x="60" y="120" width="80" height="6" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.1" />
      <rect x="75" y="132" width="50" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.08" />
    </svg>
  ),
};

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction, variant = 'default' }) => {
  const Illustration = illustrations[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <Illustration className="h-36 w-52 mb-2" />
      {Icon && (
        <div className="rounded-2xl bg-primary/10 p-3 mb-3 -mt-4">
          <Icon className="h-6 w-6 text-primary/60" />
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
