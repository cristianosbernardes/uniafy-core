import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState('operacional');

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-primary font-mono uppercase tracking-[0.3em] animate-pulse">
          Sincronizando Dados Uniafy...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader user={user} />

      <div className="flex-1 flex overflow-hidden">
        <ModuleSidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          userRole={user.role}
        />

        <ContextSidebar
          activeModule={activeModule}
          userRole={user.role}
        />

        <main className="flex-1 overflow-auto bg-[#080808]">
          {children}
        </main>
      </div>
    </div>
  );
}
