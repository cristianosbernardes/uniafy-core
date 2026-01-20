import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isContextOpen, setIsContextOpen] = useState(true);

  // Extrai o primeiro segmento da URL como o módulo ativo
  const activeModule = location.pathname.split('/')[1] || 'growth';

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-primary font-mono uppercase tracking-[0.3em] animate-pulse">
          Sincronizando...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-layout-base)] flex flex-col pt-[4px] pr-[6px] pb-[6px] pl-[6px] gap-[4px]">

      {/* 
        ROW 1: HEADER (Now Isolated Component)
        - Handles Search vs Trial Display logic internally
      */}
      <DashboardHeader user={user} isContextOpen={isContextOpen} />

      {/* 
        ROW 2: BODY AREA (Split into 2 Floating Blocks)
        - 4px Gap between Menu and Content (gap-[4px])
        - 4px Gap from Header (handled by parent gap-[4px])
      */}
      <div className="flex-1 flex overflow-hidden gap-[6px]">

        {/* BLOCK A: MODULE SIDEBAR (Independent Card) */}
        <div className="w-[64px] h-full rounded-[var(--radius)] bg-[var(--bg-layout-menu)] flex flex-col shrink-0 z-30 overflow-hidden shadow-xl">
          <ModuleSidebar
            activeModule={activeModule}
            onModuleChange={(moduleId) => navigate(`/${moduleId}`)}
            userRole={user.role}
            isContextOpen={isContextOpen}
            onToggleContext={() => setIsContextOpen(!isContextOpen)}
          />
        </div>

        {/* BLOCK B: CONTENT AREA (Submenu + Workspace) */}
        <div className="flex-1 flex overflow-hidden rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--bg-layout-workspace)] relative shadow-2xl">

          {/* COLUMN 2: CONTEXT SIDEBAR (Submenu) */}
          <div
            className={cn(
              "h-full bg-[var(--bg-layout-submenu)] border-r border-[var(--border-subtle)] overflow-hidden transition-all duration-300 ease-in-out shrink-0 z-20",
              isContextOpen ? "w-[256px]" : "w-0 opacity-0 border-none"
            )}
          >
            <ContextSidebar
              activeModule={activeModule}
              userRole={user.role}
              isOpen={isContextOpen}
              onToggle={() => setIsContextOpen(!isContextOpen)}
            />
          </div>

          {/* COLUMN 3: WORKSPACE CONTENT */}
          <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-[var(--bg-layout-workspace)]">

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="p-6 md:p-8 min-h-full">
                <Outlet />
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
}

