// Uniafy v5.9.6 Type Definitions

export enum UserRole {
  OWNER = 'OWNER',
  AGENCY = 'AGENCY',
  CLIENT = 'CLIENT'
}

export type PipelineStatus = 'PAGAMENTO' | 'ONBOARDING' | 'SETUP' | 'ATIVO';
export type PaymentStatus = 'PAID' | 'PENDING';
export type ChurnRisk = 'LOW' | 'MEDIUM' | 'HIGH';
export type PaymentMethod = 'PIX' | 'BOLETO' | 'CC';
export type LeadStatus = 'new' | 'contact' | 'qualified' | 'negotiation';

export interface Customer {
  id: string;
  name: string;
  decisor: string;
  pipeline_status: PipelineStatus;
  payment_status: PaymentStatus;
  churn_risk: ChurnRisk;
  health_score: number;
  balance_google: number;
  balance_meta: number;
  payment_method: PaymentMethod;
}

export interface Lead {
  id: string;
  name: string;
  value: number;
  source: string;
  status: LeadStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenant_id?: string;
  subscription?: AgencySubscription | null;
}

export interface NavItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  roles: UserRole[];
  badge?: string;
}

export interface NavModule {
  id: string;
  label: string;
  icon: string;
  items: NavItem[];
  roles: UserRole[];
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  status?: 'sync' | 'pending' | 'error';
  icon?: string;
}

// --- MASTER SUITE TYPES ---

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trial';
export type BillingPeriod = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: BillingPeriod;
  features: string[];
  max_users: number;
  max_connections: number;
  is_active: boolean;
}

export interface AgencySubscription {
  id: string;
  tenant_id: string; // ID da Agência
  tenant_name: string; // Nome da Agência (Cache)
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  next_billing_date: string;
  amount: number;
  payment_method: PaymentMethod;
}

export interface MasterNotificationConfig {
  id: string;
  trigger_days_before: number; // Ex: 3
  message_title: string;
  message_body: string;
  is_active: boolean;
  channels: {
    popup: boolean;
    email: boolean;
    whatsapp: boolean;
  };
}

export interface FinancialTransaction {
  id: string;
  tenant_id: string;
  tenant_name: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  type: 'subscription' | 'addon';
}

// --- SAAS SUITE TYPES ---

export type AuditAction = 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'IMPERSONATE';

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: AuditAction;
  target: string; // Ex: "Agency Alpha", "Config Global"
  metadata: Record<string, any>; // JSON com detalhes
  ip_address: string;
  created_at: string;
}

export interface TelemetryEvent {
  id: string;
  user_id: string;
  module: string; // Ex: "growth/hunter"
  action: string; // Ex: "search_triggered"
  timestamp: string;
}

export interface SaasMetric {
  label: string;
  value: number;
  change: number;
  period: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface CustomDomain {
  id: string;
  domain: string;
  tenant_id: string; // Agência dona
  status: 'active' | 'pending_dns' | 'ssl_error' | 'verifying';
  dns_record_type: 'CNAME';
  dns_record_value: string;
  created_at: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
    favicon_url?: string;
  }
}

