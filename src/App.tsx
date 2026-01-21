import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DomainProvider } from "./contexts/DomainContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import Dashboard from "./pages/Dashboard";
import GestaoClientes from "./pages/GestaoClientes";
import UserProfilePage from "./pages/system/UserProfilePage"; // Updated import


import NotFound from "./pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Checkout from "@/pages/auth/Checkout";
import SetupPassword from "@/pages/auth/SetupPassword";
import SqlBank from "./pages/SqlBank";
import GHunter from "./pages/GHunter";
import CnpjSniper from "./pages/CnpjSniper";
import MasterSettings from "./pages/MasterSettings";
import { DashboardShell } from "./components/layout/DashboardShell";
import AuditLogs from "./pages/master/AuditLogs";
import ProductAnalytics from "./pages/master/ProductAnalytics";
import SaasMetrics from "./pages/master/SaasMetrics";
import SystemBranding from "./pages/master/SystemBranding";
import WhiteLabelFactory from "./pages/master/WhiteLabelFactory";
import PlanManager from "./pages/master/PlanManager";
import Vault from "./pages/master/Vault";
import AgencyUsers from "./pages/agency/AgencyUsers";
import AgencyWhiteLabel from "./pages/agency/AgencyWhiteLabel";
import AgencyClients from "./pages/agency/AgencyClients";
import AgencySquads from "./pages/agency/AgencySquads";
import AgencyFinance from "./pages/agency/AgencyFinance";
import AgencyContracts from "./pages/agency/AgencyContracts";
import AgencyChurn from "./pages/agency/AgencyChurn";
import PublicDashboardView from "@/pages/public/PublicDashboardView";
import AgencyOnboarding from "./pages/agency/AgencyOnboarding";
import AgencyIntegrations from "@/pages/agency/AgencyIntegrations";
import TrafficDashboard from "./pages/traffic/TrafficDashboard";
import GroupSentinel from "./pages/traffic/GroupSentinel";
import DynamicReports from "./pages/traffic/DynamicReports";
import AiAnalysis from "./pages/traffic/AiAnalysis";
import CampaignBuilder from "./pages/traffic/CampaignBuilder";
import OperationalSchedule from "./pages/traffic/OperationalSchedule";
import DataAnalysis from "./pages/traffic/DataAnalysis";
import Reminders from "./pages/traffic/Reminders";
import CreativeHub from "./pages/traffic/CreativeHub";
import TrackingManager from "./pages/traffic/TrackingManager";
import TrafficGuard from "./pages/traffic/TrafficGuard";
import MediaPlanner from "./pages/traffic/MediaPlanner";
import AudienceVault from "./pages/traffic/AudienceVault";
import LPSentinel from "./pages/traffic/LPSentinel";
import AdSpy from "./pages/traffic/AdSpy";
import BudgetPacing from "./pages/traffic/BudgetPacing";
import OfflineConversions from "./pages/traffic/OfflineConversions";
import NamingGovernor from "./pages/traffic/NamingGovernor";

import { TrafficProvider } from "./contexts/TrafficContext";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Public Dashboard Route (No Auth) */}
      <Route path="/shared/:token" element={<PublicDashboardView />} />

      {/* Main Layout Wrapping Private Routes */}
      <Route element={
        <PrivateRoute>
          <TrafficProvider>
            <DashboardShell />
          </TrafficProvider>
        </PrivateRoute>
      }>
        <Route path="/" element={<Navigate to="/growth/hunter" replace />} />

        {/* Mestre Routes */}
        <Route path="/mestre" element={<Navigate to="/mestre/agencias" replace />} />
        <Route path="/mestre/agencias" element={<GestaoClientes />} />
        <Route path="/mestre/sql" element={<SqlBank />} />
        <Route path="/mestre/config" element={<MasterSettings />} />
        <Route path="/mestre/audit" element={<AuditLogs />} />
        <Route path="/mestre/analytics" element={<ProductAnalytics />} />
        <Route path="/mestre/metrics" element={<SaasMetrics />} />
        <Route path="/mestre/planos" element={<PlanManager />} />
        <Route path="/mestre/cofre" element={<Vault />} />
        <Route path="/mestre/whitelabel" element={<WhiteLabelFactory />} />
        <Route path="/mestre/branding" element={<SystemBranding />} />

        {/* Growth Engine Routes */}
        <Route path="/growth" element={<Navigate to="/growth/hunter" replace />} />
        <Route path="/growth/hunter" element={<GHunter />} />
        <Route path="/growth/sniper" element={<Dashboard />} />
        <Route path="/growth/cnpj" element={<CnpjSniper />} />
        <Route path="/growth/crm" element={<Dashboard />} />

        {/* Agency OS Routes */}
        <Route path="/agency" element={<Navigate to="/agency/users" replace />} />
        <Route path="/agency/users" element={<AgencyUsers />} />
        <Route path="/agency/onboarding" element={<AgencyOnboarding />} />
        <Route path="/agency/whitelabel" element={<AgencyWhiteLabel />} />

        <Route path="/agency/clients" element={<AgencyClients />} />
        <Route path="/agency/onboarding" element={<AgencyOnboarding />} />
        <Route path="/agency/squads" element={<AgencySquads />} />
        <Route path="/agency/integrations" element={<AgencyIntegrations />} />
        <Route path="/agency/contracts" element={<AgencyContracts />} />
        <Route path="/agency/finance" element={<AgencyFinance />} />
        <Route path="/agency/churn-alert" element={<AgencyChurn />} />

        {/* Traffic Commander Routes */}
        <Route path="/traffic" element={<Navigate to="/traffic/dashboard" replace />} />
        <Route path="/traffic/dashboard" element={<TrafficDashboard />} />
        <Route path="/traffic/sentinela" element={<GroupSentinel />} />
        <Route path="/traffic/reports" element={<DynamicReports />} />
        <Route path="/traffic/ai-analysis" element={<AiAnalysis />} />
        <Route path="/traffic/campaigns" element={<CampaignBuilder />} />
        <Route path="/traffic/scheduler" element={<OperationalSchedule />} />
        <Route path="/traffic/data-analysis" element={<DataAnalysis />} />
        <Route path="/traffic/reminders" element={<Reminders />} />
        <Route path="/traffic/creatives" element={<CreativeHub />} />
        <Route path="/traffic/tracking" element={<TrackingManager />} />
        <Route path="/traffic/guard" element={<TrafficGuard />} />
        <Route path="/traffic/planner" element={<MediaPlanner />} />
        <Route path="/traffic/audiences" element={<AudienceVault />} />
        <Route path="/traffic/lp-sentinel" element={<LPSentinel />} />
        <Route path="/traffic/ad-spy" element={<AdSpy />} />
        <Route path="/traffic/pacing" element={<BudgetPacing />} />
        <Route path="/traffic/offline" element={<OfflineConversions />} />
        <Route path="/traffic/naming" element={<NamingGovernor />} />
        <Route path="/traffic/campaigns" element={<CampaignBuilder />} />

        {/* Client Success Routes */}
        <Route path="/success" element={<Navigate to="/success/portal" replace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success/portal" element={<Dashboard />} />
        <Route path="/success/aprovacao" element={<Dashboard />} />
        <Route path="/success/health" element={<Dashboard />} />

        {/* Sistema Routes */}
        <Route path="/sistema" element={<Navigate to="/sistema/perfil" replace />} />
        <Route path="/sistema/perfil" element={<UserProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrandingProvider>
      <DomainProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </DomainProvider>
    </BrandingProvider>
  </QueryClientProvider>
);

export default App;
