# Implementação do Ecossistema Agência e White Label

Este plano detalha a reestruturação do módulo "Agência", a implementação do fluxo de cadastro com período de testes (Trial) e a lógica de personalização White Label.

## 1. Reestruturação da Navegação (Frontend)

O objetivo é alinhar o menu lateral com a visão estratégica do usuário, consolidando as ferramentas de gestão no módulo "Agência".

### Nova Estrutura Proposta para `src/config/navigation.ts`

#### Módulo: Agência (Agency OS)
*   **Usuários & Time** (`/agency/users`)
    *   *Descrição:* Gestão de equipe, convites e permissões granulares.
    *   *Funcionalidade:* Listagem de usuários, modal de convite, definição de squads.
*   **Setup White Label** (`/agency/whitelabel`)
    *   *Descrição:* Configuração de domínio personalizado, logo e cores.
    *   *Regra de Negócio:* Cores e Logo só editáveis se um Domínio Personalizado estiver ativo.
*   **Carteira de Clientes** (`/agency/clients`)
    *   *Descrição:* CRM de clientes ativos com integração API/n8n.
    *   *Funcionalidade:* Lista de clientes, botão "API Key" para integrações, status da conta.
*   **Onboarding Mágico** (`/agency/onboarding`)
    *   *Descrição:* Esteira de entrada automática para novos clientes.
*   **Gestão de Squads** (`/agency/squads`)
    *   *Descrição:* Distribuição de clientes entre os times (squads).
*   **Contratos & Financeiro** (`/agency/finance`)
    *   *Descrição:* Gestão de contratos, vencimentos e bloqueios automáticos.
*   **Radar de Churn** (`/agency/churn-alert`)
    *   *Descrição:* Alertas preditivos de risco de cancelamento (Health Score consolidado).

## 2. Fluxo de Cadastro e Dados (Backend/Supabase)

Automatizar a criação de perfil e configurar as regras de negócio para o período de testes.

### Banco de Dados (`profiles`)
Expandir a tabela de perfis para suportar as configurações de agência e trial.

*   `id`: Referência ao Auth ID.
*   `role`: 'owner', 'agency', 'client'.
*   `trial_start_date`: Timestamp do cadastro.
*   `subscription_status`: 'trial', 'active', 'past_due', 'canceled'.
*   `custom_domain`: Domínio personalizado (ex: `app.minhaagencia.com`).
*   `branding_logo`: URL do logo da agência.
*   `branding_colors`: JSON com a paleta de cores primária/secundária.
*   `parent_agency_id`: ID da agência "mãe" (para clients e membros da equipe).

### Automação (Triggers)
1.  **Ao Cadastrar (Auth):** Trigger `on_auth_user_created` insere uma linha em `public.profiles`.
    *   Define `trial_start_date` = `NOW()`.
    *   Define `subscription_status` = 'trial'.
2.  **Verificação de Acesso:**
    *   Middleware/Policy que verifica: Se `NOW() > trial_start_date + 3 days` E `subscription_status == 'trial'`, bloqueia acesso ou redireciona para página de pagamento.

## 3. Lógica White Label (Frontend)

O sistema deve se adaptar visualmente com base no contexto do usuário ou domínio.

### Contexto de Aplicação (`ThemeContext` aprimorado)
*   Ao carregar a aplicação, verificar:
    1.  Estamos em um domínio personalizado? (ex: `app.agenciaX.com`)
    2.  O usuário logado tem configurações de *branding* salvas?
*   **Ação:** Injetar variáveis CSS (`--primary`, `--radius`, etc.) e trocar o Favicon/Logo dinamicamente.
*   **Preview Mode:** No painel Master, permitir "Ver como Usuário" (Ghost Mode), carregando temporariamente o tema desse usuário.

## 4. Integração Master

O painel "Master" (Super Admin) terá acesso de leitura total a esses novos campos.

*   Visualização da tabela `profiles` completa.
*   Funcionalidade "Ghost Mode": Gerar um token de acesso temporário ou usar `setSession` (se admin) para logar como o cliente e dar suporte.

## Etapas de Implementação

1.  **Banco de Dados:** Criar script SQL para atualizar tabela `profiles` e triggers.
2.  **Menu:** Atualizar `navigation.ts` com a nova estrutura.
3.  **Páginas (Scaffold):** Criar os componentes básicos para as novas rotas.
4.  **Desenvolvimento:** Implementar lógica de cada submódulo, começando pelo **White Label** e **Usuários**.
