# Tarefas: SaaS, White Label e Agência

## Infraestrutura & Banco de Dados
- [x] **Correção Critical: SQL RPC** <!-- id: 0 -->
    - [x] Identificar erro de sintaxe no RPC
    - [x] Orientar atualização manual do RPC no Supabase
    - [x] Corrigir erro de permissão `must be owner of relation users` (Ajustar Preset)
    - [x] Validar Migração do Preset "Setup Agência" no App
- [ ] **Estrutura de Dados (Profiles)** <!-- id: 1 -->
    - [ ] Colunas Trial (`trial_start_date`, `subscription_status`)
    - [ ] Colunas White Label (`custom_domain`, `branding_logo`, `branding_colors`)
    - [ ] Atualizar Função `handle_new_user` logicamente

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
