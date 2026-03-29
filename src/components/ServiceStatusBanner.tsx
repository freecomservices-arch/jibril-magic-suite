import { useState, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Monitor, Database, Brain, Wifi, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';

interface ServiceIndicator {
  key: string;
  icon: React.FC<any>;
  fallbackName: string;
}

const presets: Record<string, ServiceIndicator[]> = {
  scraping: [
    { key: 'scraper', icon: Monitor, fallbackName: 'Vision & Navigateur' },
    { key: 'database', icon: Database, fallbackName: 'Base de données' },
    { key: 'ia_config', icon: Brain, fallbackName: 'Configuration IA' },
  ],
  vision: [
    { key: 'internet', icon: Wifi, fallbackName: 'Connexion Internet' },
    { key: 'ia_config', icon: Brain, fallbackName: 'Intelligence Artificielle' },
    { key: 'database', icon: Database, fallbackName: 'Base de données' },
  ],
  communication: [
    { key: 'whatsapp', icon: MessageSquare, fallbackName: 'WhatsApp Business' },
    { key: 'internet', icon: Wifi, fallbackName: 'Connexion Internet' },
    { key: 'ia_config', icon: Brain, fallbackName: 'Intelligence Artificielle' },
  ],
};

const ledColor = (status?: string) => {
  if (status === 'operational') return 'bg-green-500 shadow-[0_0_6px_hsl(142,71%,45%)]';
  if (status === 'error') return 'bg-red-500 shadow-[0_0_6px_hsl(0,84%,60%)]';
  return 'bg-muted-foreground/40';
};

interface Props {
  variant: 'scraping' | 'vision' | 'communication';
  className?: string;
}

export default function ServiceStatusBanner({ variant, className = '' }: Props) {
  const [services, setServices] = useState<Record<string, { name: string; status: string; message?: string }>>({});

  const fetchHealth = useCallback(async () => {
    try {
      const data = await api.systemHealth();
      if (data?.services) setServices(data.services);
    } catch {
      setServices({});
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const indicators = presets[variant] || presets.scraping;

  return (
    <div className={`flex items-center gap-6 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm ${className}`}>
      {indicators.map(({ key, icon: Icon, fallbackName }) => {
        const svc = services[key];
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-default">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${ledColor(svc?.status)}`} />
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{svc?.name || fallbackName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{svc?.name || fallbackName}</p>
              <p className="text-xs text-muted-foreground">
                {svc?.message || (svc?.status === 'operational' ? 'Service opérationnel' : svc?.status === 'error' ? 'Service en erreur' : 'Statut inconnu')}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
