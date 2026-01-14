import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ModuleSidebar } from './ModuleSidebar';
import { ContextSidebar } from './ContextSidebar';
import { CommandBar } from './CommandBar';
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
        ROW 1: FLOAT HEADER 
        - Independent from body
        - Contains: Logo | Search | Actions
      */}
      <header className="h-[48px] w-full flex items-center justify-between px-2 shrink-0 rounded-xl bg-[var(--bg-layout-base)] border border-transparent">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black font-extrabold shadow-lg shadow-orange-900/20">
            U
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            UNIAFY
          </span>
        </div>

        {/* CENTER: SEARCH (Pill) */}
        <div className="flex-1 max-w-xl px-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10 hover:bg-zinc-800 transition-all group">
            <span className="text-xs font-medium">Pesquisar ou executar comando...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* RIGHT: COMMAND BAR ACTIONS (User, Notifications) */}
        <div className="flex items-center justify-end">
          <CommandBar isContextOpen={isContextOpen} />
        </div>
      </header>

      {/* 
        ROW 2: BODY AREA (Split into 2 Floating Blocks)
        - 4px Gap between Menu and Content (gap-[4px])
        - 4px Gap from Header (handled by parent gap-[4px])
      */}
      <div className="flex-1 flex overflow-hidden gap-[6px]">

        {/* BLOCK A: MODULE SIDEBAR (Independent Card) */}
        <div className="w-[64px] h-full rounded-[9px] bg-[var(--bg-layout-menu)] flex flex-col shrink-0 z-30 overflow-hidden shadow-xl">
          <ModuleSidebar
            activeModule={activeModule}
            onModuleChange={(moduleId) => navigate(`/${moduleId}`)}
            userRole={user.role}
            isContextOpen={isContextOpen}
            onToggleContext={() => setIsContextOpen(!isContextOpen)}
          />
        </div>

        {/* BLOCK B: CONTENT AREA (Submenu + Workspace) */}
        <div className="flex-1 flex overflow-hidden rounded-[9px] border border-[var(--border-subtle)] bg-[var(--bg-layout-workspace)] relative shadow-2xl">

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

            {/* 
              SUBSCRIPTION BANNER (ClickUp Style Notification Area) 
              Height: 56px | Purpose: Warn regarding subscription expiry 
            */}
            <div className="h-[56px] w-full bg-orange-500/10 border-b border-orange-500/20 flex items-center justify-between px-6 shrink-0 relative z-20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-orange-200">
                  <span className="font-bold text-orange-500 mr-1">ATENÇÃO:</span>
                  Sua assinatura expira em 3 dias. Renove agora para evitar interrupções.
                </span>
              </div>
              <button className="text-xs font-bold bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition-colors shadow-sm shadow-orange-900/20">
                Renovar Agora
              </button>
            </div>

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
