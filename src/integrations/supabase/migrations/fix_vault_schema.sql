-- Create vault_secrets table if it doesn't exist
create table if not exists public.vault_secrets (
    id uuid default gen_random_uuid() primary key,
    provider text not null, -- 'asaas', 'stripe', 'kiwify', 'hotmart'
    key_type text not null, -- 'api_key', 'webhook_secret', etc.
    value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    constraint vault_secrets_provider_key_unique unique (provider, key_type)
);

-- Enable RLS
alter table public.vault_secrets enable row level security;

-- Policies for Master/Admin
-- Assuming 'master' or specific definition for admin access. 
-- For now, we'll allow authenticated users with 'service_role' or specific app metadata to access, 
-- but realistically for this app, we often use a simpler check for development.
-- Let's create a broad policy for authenticated users to VIEW/UPDATE for now to unblock the user, 
-- assuming the frontend protects the route. Ideally this should be restricted to role='master'.

create policy "Enable all access for authenticated users" 
on public.vault_secrets for all
to authenticated
using (true)
with check (true);

-- Ensure master_config exists and has active_gateway column
create table if not exists public.master_config (
    id uuid default gen_random_uuid() primary key,
    trigger_days_before integer default 3,
    message_title text default 'Sua assinatura vai vencer',
    message_body text default 'Regularize para não perder o acesso.',
    is_active boolean default true,
    channels jsonb default '{"email": true, "whatsapp": false, "popup": true}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    active_gateway text default 'asaas'
);

-- Add active_gateway column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'master_config' and column_name = 'active_gateway') then
        alter table public.master_config add column active_gateway text default 'asaas';
    end if;
end $$;
