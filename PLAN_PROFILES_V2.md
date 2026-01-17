# Configuração de Profiles V2: Trial & Agência White Label

## Objetivo
Atualizar a tabela `profiles` no Supabase para suportar o modelo de negócios SaaS (Trial gratuito de 7 dias) e funcionalidades de Agência White Label (domínio personalizado, branding).

## Mudanças Necessárias

### 1. Banco de Dados (Tabela `profiles`)
Adição de colunas estratégicas:
- **Gestão de Assinatura**: `trial_start_date` (controle do período grátis), `subscription_status` (status atual).
- **White Label**: `custom_domain` (domínio da agência), `branding_logo` (URL), `branding_colors` (paleta).

### 2. Lógica de Criação de Usuário (`handle_new_user`)
A function que roda no trigger `on_auth_user_created` precisa ser atualizada para:
- Inicializar `trial_start_date` com a data atual.
- Definir `subscription_status` como `'trialing'`.
- Garantir que o usuário já nasça com permissões básicas.

### 3. Script de Migração
Criarei um arquivo `setup_profiles_v2.sql` na raiz do projeto contendo:
- `ALTER TABLE profiles ...`
- `CREATE OR REPLACE FUNCTION ...`
