import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GestaoClientes from "./pages/GestaoClientes";
import MeuPerfil from "./pages/MeuPerfil";
import NotFound from "./pages/NotFound";
import SqlBank from "./pages/SqlBank";
import GHunter from "./pages/GHunter";
import CnpjSniper from "./pages/CnpjSniper";
import { DashboardShell } from "./components/layout/DashboardShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Layout Wrapping Routes */}
          <Route element={<DashboardShell />}>
            <Route path="/" element={<Navigate to="/prospeccao/hunter" replace />} />

            {/* MASTER & ADMIN */}
            <Route path="/master/dashboard" element={<Dashboard />} />
            <Route path="/master/white-label" element={<Dashboard />} />
            <Route path="/master/squads" element={<Dashboard />} />
            <Route path="/master/sql" element={<SqlBank />} />

            {/* MÁQUINA DE PROSPECÇÃO */}
            <Route path="/prospeccao/hunter" element={<GHunter />} />
            <Route path="/prospeccao/sniper" element={<Dashboard />} />
            <Route path="/prospeccao/cnpj" element={<CnpjSniper />} />
            <Route path="/prospeccao/crm" element={<Dashboard />} />

            {/* GESTÃO DE CARTEIRA */}
            <Route path="/carteira/onboarding" element={<Dashboard />} />
            <Route path="/carteira/whatsapp" element={<Dashboard />} />
            <Route path="/carteira/churn" element={<Dashboard />} />

            {/* TRÁFEGO & OPERAÇÃO */}
            <Route path="/trafego/lancador" element={<Dashboard />} />
            <Route path="/trafego/saldos" element={<Dashboard />} />
            <Route path="/trafego/auditor" element={<Dashboard />} />

            {/* INTELIGÊNCIA & ESTRATÉGIA */}
            <Route path="/inteligencia/spy" element={<Dashboard />} />
            <Route path="/inteligencia/conteudo" element={<Dashboard />} />
            <Route path="/inteligencia/lab" element={<Dashboard />} />

            {/* RELATÓRIOS & DATA */}
            <Route path="/relatorios/agendador" element={<Dashboard />} />
            <Route path="/relatorios/live" element={<Dashboard />} />

            {/* Sistema Routes */}
            <Route path="/sistema/perfil" element={<MeuPerfil />} />
          </Route>

          {/* Catch-all outside shell if needed, but here we redirect */}
          <Route path="*" element={<Navigate to="/prospeccao/hunter" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
