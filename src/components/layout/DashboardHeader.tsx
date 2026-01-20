import { useState, useEffect } from 'react';
import { CommandBar } from './CommandBar';
import { User, MasterNotificationConfig } from '@/types/uniafy';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { masterService } from '@/services/masterService';
import { supabase } from '@/integrations/supabase/client';
import { useBranding } from '@/contexts/BrandingContext';

interface DashboardHeaderProps {
  user: User | null;
  isContextOpen: boolean;
}

export function DashboardHeader({ user, isContextOpen }: DashboardHeaderProps) {
  const { branding } = useBranding();
  const [config, setConfig] = useState<MasterNotificationConfig | null>(null);

  useEffect(() => {
    // 1. Carrega inicial
    masterService.getGlobalConfig().then(data => {
      if (data) setConfig(data);
    });

    // 2. Inscreve para mudanças em tempo real na tabela master_config
    const channel = supabase
      .channel('master_config_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'master_config'
        },
        (payload) => {
          // Atualiza o estado imediatamente ao receber notificação do banco
          if (payload.new) {
            setConfig(payload.new as MasterNotificationConfig);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Logic to determine if we should show trial countdown instead of search
  // REGRAS:
  // 1. Usuário é Trial
  // 2. Configuração Global de Automação está LIGADA (is_active)
  // 3. Canal "Popup/TopBar" está LIGADO (channels.popup)
  const showTrialAlert =
    user?.subscription?.status === 'trial' &&
    config?.is_active === true &&
    config?.channels?.popup === true;

  const trialEndsAt = user?.subscription?.next_billing_date;

  return (
    <header className="h-[48px] w-full flex items-center justify-between px-2 shrink-0 rounded-xl bg-[var(--bg-layout-base)] border border-transparent relative z-50">

      {/* LEFT: LOGO */}
      <div className="flex items-center gap-3 px-1">
        {branding?.logo_url ? (
          <img
            src={branding.logo_url}
            alt="Logo"
            className="h-8 w-auto object-contain transition-opacity duration-300"
          />
        ) : (
          <div className="flex items-center gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-extrabold shadow-lg shadow-orange-900/20">
              U
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              UNIAFY
            </span>
          </div>
        )}
      </div>

      {/* CENTER: DYNAMIC CONTENT (Search OR Trial Timer) */}
      <div className="flex-1 flex justify-center px-4">
        {showTrialAlert && trialEndsAt ? (
          // TRIAL MODE: Digital Display Style
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Container "Display Digital" */}
            <div className="relative group overflow-hidden rounded-full bg-black/40 border border-white/5 shadow-inner px-6 py-1.5 flex items-center gap-4 select-none">
              {/* Glow Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* Label discreta - Ajustada */}
              <span className="text-xs text-white/50 font-semibold mr-2 hidden xl:inline-block pt-[1px]">
                Tempo restante
              </span>

              {/* O Componente Timer */}
              <div className="relative z-10">
                <CountdownTimer targetDate={trialEndsAt} />
              </div>
            </div>

            {/* Call to Action Button - REDUZIDO */}
            <button className="h-7 px-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-900/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <span>Renovar</span>
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            </button>
          </div>
        ) : (
          // NORMAL MODE: Search Bar
          <div className="w-full max-w-xl">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10 hover:bg-zinc-800 transition-all group">
              <span className="text-xs font-medium">Pesquisar ou executar comando...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: COMMAND BAR ACTIONS (User, Notifications) */}
      <div className="flex items-center justify-end">
        <CommandBar isContextOpen={isContextOpen} />
      </div>
    </header>
  );
}
