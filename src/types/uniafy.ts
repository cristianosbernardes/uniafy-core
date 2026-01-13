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
}

export interface NavItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  roles: UserRole[];
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
