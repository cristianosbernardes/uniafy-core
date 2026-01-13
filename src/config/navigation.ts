import { NavModule, UserRole } from '@/types/uniafy';

export const NAV_MODULES: NavModule[] = [
  {
    id: 'master',
    label: 'MASTER & ADMIN',
    icon: 'Crown',
    roles: [UserRole.OWNER],
    items: [
      {
        id: 'gestao-agencias',
        title: 'Gestão de Agências',
        description: 'Controle central de instâncias e clusters',
        icon: 'Building2',
        path: '/mestre/agencias',
        roles: [UserRole.OWNER],
      },
      {
        id: 'banco-sql',
        title: 'Banco SQL',
        description: 'Execução direta de comandos no banco de dados',
        icon: 'Database',
        path: '/mestre/sql',
        roles: [UserRole.OWNER],
      },
      {
        id: 'config-globais',
        title: 'Configurações Globais',
        description: 'Parâmetros mestre do ecossistema Uniafy',
        icon: 'Settings2',
        path: '/mestre/configuracoes',
        roles: [UserRole.OWNER],
      }
    ],
  },
  {
    id: 'growth',
    label: 'GROWTH ENGINE',
    icon: 'Radar',
    roles: [UserRole.OWNER, UserRole.AGENCY],
    items: [
      {
        id: 'g-hunter',
        title: 'G-Hunter Scraper',
        description: 'Captação ativa de leads via Google Maps',
        icon: 'Search',
        path: '/growth/hunter',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      },
      {
        id: 'cnpj-sniper',
        title: 'CNPJ Sniper',
        description: 'Extração industrial de dados da Receita Federal',
        icon: 'FileText',
        path: '/growth/cnpj',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      },
      {
        id: 'crm-prospect',
        title: 'Máquina de Vendas',
        description: 'CRM Kanban de prospecção estratégica',
        icon: 'Target',
        path: '/growth/crm',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      }
    ],
  },
  {
    id: 'agency-os',
    label: 'AGENCY OS',
    icon: 'Building',
    roles: [UserRole.OWNER, UserRole.AGENCY],
    items: [
      {
        id: 'onboarding-magico',
        title: 'Onboarding Mágico',
        description: 'Setup automático de novos clientes',
        icon: 'Zap',
        path: '/agency-os/onboarding',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      },
      {
        id: 'gestao-squads',
        title: 'Gestão de Squads',
        description: 'Distribuição de clientes e tarefas por equipe',
        icon: 'Users',
        path: '/agency-os/squads',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      },
      {
        id: 'financeiro-fee',
        title: 'Contratos & Fee',
        description: 'Controle de faturamento e alertas de atraso',
        icon: 'CreditCard',
        path: '/agency-os/financeiro',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      }
    ],
  },
  {
    id: 'traffic',
    label: 'TRAFFIC COMMANDER',
    icon: 'Settings',
    roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
    items: [
      {
        id: 'funil-analytics',
        title: 'Funil Analytics',
        description: 'Meta + Google Ads em uma única tela',
        icon: 'BarChart3',
        path: '/traffic/analytics',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      },
      {
        id: 'auditor-campanhas',
        title: 'Auditor sentinela',
        description: 'Verificação automática de pixels e orçamentos',
        icon: 'Activity',
        path: '/traffic/auditor',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      },
      {
        id: 'otimizador-ia',
        title: 'Otimização One-Click',
        description: 'Ações em escala via IA e automação',
        icon: 'Brain',
        path: '/traffic/otimizador',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      }
    ],
  },
  {
    id: 'success',
    label: 'CLIENT SUCCESS',
    icon: 'LayoutDashboard',
    roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
    items: [
      {
        id: 'portal-cliente',
        title: 'Portal White Label',
        description: 'Experiência exclusiva para o cliente final',
        icon: 'Globe',
        path: '/success/portal',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      },
      {
        id: 'aprovacao-criativos',
        title: 'Central de Aprovação',
        description: 'Workflow de aprovação de anúncios',
        icon: 'CheckCircle2',
        path: '/success/aprovacao',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      },
      {
        id: 'health-score',
        title: 'Health Score',
        description: 'Métrica de satisfação e risco de churn',
        icon: 'HeartPulse',
        path: '/success/health',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      }
    ],
  },
  {
    id: 'sistema',
    label: 'SISTEMA',
    icon: 'Laptop',
    roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
    items: [
      {
        id: 'meu-perfil',
        title: 'Meu Perfil',
        description: 'Dados de acesso e segurança',
        icon: 'User',
        path: '/sistema/perfil',
        roles: [UserRole.OWNER, UserRole.AGENCY, UserRole.CLIENT],
      },
      {
        id: 'conexoes-nuvem',
        title: 'Conexões & APIs',
        description: 'Hub de integrações e webhooks (n8n)',
        icon: 'Share2',
        path: '/sistema/conexoes',
        roles: [UserRole.OWNER, UserRole.AGENCY],
      }
    ],
  },
];
