# Padrões de Desenvolvimento Uniafy (Master Guide)

Este documento centraliza as regras e diretrizes que devem ser seguidas rigorosamente em todo o desenvolvimento do sistema Uniafy.

## 1. Interface de Usuário (UI/UX)

### 1.1. Navegação e Módulos
*   **[OBRIGATÓRIO] Ícones em Módulos:** Todo novo módulo ou item de menu DEVE ter um ícone correspondente da biblioteca `lucide-react`. 
    *   O ícone deve ser visualmente representativo da função.
    *   **Implementação:** Importe o ícone em `ContextSidebar.tsx` e adicione-o ao objeto `iconMap`.
    *   **Proibido:** Criar tens de menu "cegos" (sem ícone).
    *   *Exceção:* Apenas se o design system explicitamente solicitar um menu puramente textual (raro).

*   **Tipografia:**
    *   Fonte padrão: `Inter`.
    *   Títulos de Página: Uppercase, Bold/Black, sem tracking excessivo.
    *   Tamanhos: Seguir a escala padrão do Tailwind (`text-sm`, `text-lg`, etc.).

### 1.2. Cores e Tema
*   **Tema Industrial:** Manter a paleta escura (`#050505`, `#09090b`) com acentos em Laranja (`primary`) ou Branco (`foreground`).
*   **White Label:** Componentes devem ser preparados para receber variáveis CSS de cor (`var(--primary)`) para suportar personalização.

## 2. Banco de Dados (Supabase)

### 2.1. Segurança (RLS)
*   **Sempre Ativo:** NUNCA desabilitar RLS em tabelas de produção.
*   **RPCs:** Funções administrativas devem usar `SECURITY DEFINER` com cautela e validar permissões (ex: checar se é `admin` ou `owner`).

### 2.2. Migrações
*   **SQL Bank:** Use o módulo "Banco SQL" para rodar migrações.
*   **Idempotência:** Scripts devem sempre usar `IF NOT EXISTS` ou `OR REPLACE` para evitar erros ao rodar múltiplas vezes.
*   **Safe Mode:** Evite manipular objetos de sistema (`auth.users`) diretamente. Use triggers e funções em `public` para reagir a eventos.

## 3. Código (React/TypeScript)

*   **Imports:** Utilize aliases (`@/components`, `@/hooks`) em vez de caminhos relativos longos (`../../`).
*   **Componentes:** Sempre prefira componentes funcionais e Hooks.
*   **Placeholders:** Ao criar rotas futuras, use o padrão `PlaceholderPage` para dar feedback visual imediato ("Em Desenvolvimento").
