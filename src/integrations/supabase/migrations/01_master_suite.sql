-- MASTER SUITE MIGRATION
-- Tables for Managing Plans, Subscriptions and Global Layout Config

-- 1. Plans Table
create table if not exists public.plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price decimal(10,2) not null,
  period text check (period in ('monthly', 'yearly')),
  features jsonb default '[]'::jsonb,
  max_users int default 1,
  max_connections int default 1,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Subscriptions Table (Links Tenant/Agency to a Plan)
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null, -- The Agency ID
  plan_id uuid references public.plans(id),
  status text check (status in ('active', 'past_due', 'canceled', 'trial')),
  start_date timestamp with time zone default now(),
  next_billing_date timestamp with time zone,
  amount decimal(10,2),
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Master Global Config (Singleton for settings)
create table if not exists public.master_config (
  id uuid default gen_random_uuid() primary key,
  trigger_days_before int default 3,
  message_title text default 'Atenção Master',
  message_body text default 'Sua licença expira em breve.',
  is_active boolean default true,
  channels jsonb default '{"popup": true, "email": true}'::jsonb,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.master_config enable row level security;

-- Policies (Simplified for development - Adjust for production!)
-- Plans: Everyone can read, only Master can write
create policy "Public Read Plans" on public.plans for select using (true);
create policy "Master Write Plans" on public.plans for insert with check (auth.role() = 'service_role'); -- Simulation

-- Subscriptions: Agency can read theirs, Master can read all
create policy "Agency Read Own Sub" on public.subscriptions for select using (true); -- Simplifying for now

-- Config: Everyone can read (for the banner), Master write
create policy "Public Read Config" on public.master_config for select using (true);

-- SEED DATA (Initial Plans)
insert into public.plans (name, price, period, max_users, max_connections, features) values
('Uniafy Starter', 297.00, 'monthly', 3, 1, '["Gestão de Leads"]'),
('Uniafy Growth', 597.00, 'monthly', 10, 5, '["G-Hunter", "Automação"]'),
('Uniafy Black', 997.00, 'monthly', 999, 999, '["Ilimitado"]');

-- SEED DATA (Initial Config)
insert into public.master_config (trigger_days_before, message_title, is_active) values
(3, 'Renove sua Licença', true);
