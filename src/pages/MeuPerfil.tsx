import { Camera, RefreshCw, Sun, Moon, Monitor, Lock } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function MeuPerfil() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('dark');

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="MEU"
        titleAccent="PERFIL"
        subtitle="V5.2 INDUSTRIAL • CREDENCIAIS MASTER"
        badge="ACESSO_NÍVEL_5"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card-industrial p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-background-secondary border border-border-industrial">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              ASSINATURA OPERACIONAL
            </p>

            <div className="w-full bg-background-secondary border border-border-industrial rounded-md p-4 text-center mb-4">
              <span className="text-foreground font-medium">CRISTIANO BERNARDES</span>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-semibold">
              <RefreshCw className="w-4 h-4 mr-2" />
              SINCRONIZAR PERFIL
            </Button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="space-y-6">
          {/* Interface Parameters */}
          <div className="card-industrial p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-sm uppercase tracking-wider font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                PARÂMETROS DE INTERFACE
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'LIGHT_MODE', icon: Sun },
                { id: 'dark', label: 'DARK_MODE', icon: Moon },
                { id: 'auto', label: 'AUTO_SYNC', icon: Monitor },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id as 'light' | 'dark' | 'auto')}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2",
                      themeMode === mode.id
                        ? "border-primary bg-primary/10"
                        : "border-border-industrial hover:border-muted-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      themeMode === mode.id ? "text-foreground" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-[10px] uppercase tracking-wider",
                      themeMode === mode.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security */}
          <div className="card-industrial p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-sm uppercase tracking-wider font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                SEGURANÇA DE ESTAÇÃO (MASTER KEY)
              </h3>
            </div>

            <div className="flex gap-3">
              <Input
                type="password"
                placeholder="NOVA_SENHA_PROTOCOL"
                className="flex-1 bg-background-secondary border-border-industrial text-muted-foreground placeholder:text-muted-foreground/50 uppercase text-xs tracking-wider"
              />
              <Button
                variant="outline"
                className="border-border-industrial text-muted-foreground hover:text-foreground hover:border-foreground uppercase tracking-wider text-xs font-semibold"
              >
                REDEFINIR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
