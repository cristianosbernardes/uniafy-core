# Tarefas: SaaS, White Label e Agência

## Infraestrutura & Banco de Dados
- [x] **Correção Critical: SQL RPC** <!-- id: 0 -->
    - [x] Identificar erro de sintaxe no RPC
    - [x] Orientar atualização manual do RPC no Supabase
    - [x] Corrigir erro de permissão `must be owner of relation users` (Ajustar Preset)
    - [x] Validar Migração do Preset "Setup Agência" no App
- [x] **Estrutura de Dados (Profiles)** <!-- id: 1 -->
    - [x] Colunas Trial (`trial_start_date`, `subscription_status`)
    - [x] Colunas White Label (`custom_domain`, `branding_logo`, `branding_colors`)
    - [x] Atualizar Função `handle_new_user` logicamente

## Frontend: Navegação e Layout
- [x] **Menu Lateral (Navigation)** <!-- id: 2 -->
    - [x] Implementar nova estrutura "Agência" (Usuários, WL, Clientes, Squads)
    - [ ] Remover itens obsoletos ou reorganizar conforme solicitação

## Módulo: Gestão de Agência
- [x] **Setup White Label** <!-- id: 3 -->
    - [x] Interface de Branding e Domínio
    - [x] Integração com Supabase (Profiles)
- [x] **Listagem de Usuários** <!-- id: 4 -->
    - [x] CRUD de Equipe
- [x] **Carteira de Clientes** <!-- id: 5 -->
    - [x] Listagem e Status
    - [x] Onboarding Manual/Link

## Módulo: Assinaturas & Gateway (Card Upfront)
- [x] **Expansão Multi-Gateway (Vault)** <!-- id: 6 -->
    - [x] Adicionar Kiwify e Hotmart no Vault
    - [x] Implementar Seletor de "Gateway Ativo" (Master Config)
    - [x] Migration no Banco SQL para `active_gateway`
- [ ] **Fluxo de Checkout** <!-- id: 7 -->
    - [ ] Formulário com Validação de CPF
    - [ ] Integração Dinâmica (baseada no Gateway Ativo)
    - [ ] Bloqueio de CPF Duplicado
- [ ] **Segurança e Team Access** <!-- id: 8 -->
    - [ ] Edge Function para Convites Reais
    - [ ] Validação Unique CPF no Banco
