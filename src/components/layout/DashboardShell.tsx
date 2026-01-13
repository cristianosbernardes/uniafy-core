import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { NAV_MODULES } from '@/config/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardShellProps {
  children?: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Extrai o primeiro segmento da URL como o módulo ativo (ex: /growth/hunter -> growth)
  const activeModule = location.pathname.split('/')[1] || 'growth';

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
      {/* 
        This wrapper applies the width variable to all children.
        When ModuleSidebar expands, this variable updates, pushing ContextSidebar and Main content.
      */}
      <div
        className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] relative"
        style={{ '--module-sidebar-width': isSidebarExpanded ? '280px' : '64px' } as any}
      >
        <ModuleSidebar
          activeModule={activeModule}
          onModuleChange={(moduleId) => {
            const module = NAV_MODULES.find(m => m.id === moduleId);
            if (module && module.items.length > 0) {
              navigate(module.items[0].path);
            }
          }}
          userRole={user.role}
          isExpanded={isSidebarExpanded}
          onExpand={setIsSidebarExpanded}
        />

        <ContextSidebar
          activeModule={activeModule}
          userRole={user.role}
        />

        <main
          className="flex-1 overflow-auto bg-background transition-all duration-300"
          style={{
            marginLeft: 'calc(var(--module-sidebar-width, 64px) + var(--context-sidebar-width, 256px))'
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
