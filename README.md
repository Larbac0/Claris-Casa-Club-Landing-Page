# Claris Casa & Clube - Landing Page

Um projeto de landing page premium para o condomínio de luxo Claris Casa & Clube, localizado na Barra da Tijuca, Rio de Janeiro. O projeto foi desenvolvido com foco em performance, design sofisticado e uma experiência de usuário imersiva.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento rápido
- **Tailwind CSS v4** para estilização moderna e utilitária
- **Framer Motion** para animações fluidas e interativas
- **Radix UI** para componentes de UI acessíveis e robustos
- **Lucide React** para ícones
- **Supabase** para backend (armazenamento de leads e functions)

## ✨ Funcionalidades

- ✅ **Design Responsivo**: Experiência otimizada para desktops, tablets e celulares.
- ✅ **Animações Suaves**: Transições e efeitos visuais elegantes com Framer Motion.
- ✅ **Tour Virtual Interativo**: Galeria de imagens com lightbox e navegação intuitiva.
- ✅ **Componentes Interativos**: Chat Widget, formulários de contato e botão flutuante de WhatsApp.
- ✅ **Integração com Backend**: Captura de leads via Supabase Functions com fallback para o client.
- ✅ **Dashboard Administrativo**: Interface simples para visualização e exportação de leads, acessível via query param.
- ✅ **SEO Otimizado**: Estrutura semântica e meta tags para melhor ranqueamento.

## 📦 Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone <repository-url>
    cd Claris-Casa-Club-Landing-Page
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto. Veja a seção Integração com Supabase para mais detalhes.

4.  **Execute o projeto em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build`: Gera o build de produção otimizado na pasta `dist/`.
- `npm run preview`: Inicia um servidor local para visualizar o build de produção.
- `npm run lint`: Executa o linter (ESLint) para análise de código.

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes de UI base (Button, Input, etc.)
│   ├── AdminDashboard.tsx  # Painel de visualização de leads
│   ├── ChatWidget.tsx      # Widget de chat para captura de leads
│   ├── FinalCTA.tsx        # Formulário de contato principal
│   └── ...                 # Outras seções da landing page
├── lib/
│   ├── leadsApi.ts         # Lógica para criar e buscar leads (Functions/Client)
│   └── supabaseClient.ts   # Configuração do client Supabase
├── styles/
│   └── globals.css         # Estilos globais e configuração do Tailwind
└── main.tsx                # Ponto de entrada da aplicação React

supabase/
└── functions/
    ├── create-lead/        # Supabase Function para criar um lead
    └── fetch-leads/        # Supabase Function para buscar leads (protegida)
```

2) Supabase Functions (recomendado)

Arquivos de exemplo foram adicionados em `supabase/functions/`:
- `create-lead/index.ts` — recebe POST e insere lead usando SERVICE_ROLE.
- `fetch-leads/index.ts` — GET protegido por `x-admin-token`, retorna leads.

Deploy via Supabase CLI (opcional) — no PowerShell:

```powershell
supabase login
supabase functions deploy create-lead --project-ref xvnjaxbrlvvdufbcaysd
supabase functions deploy fetch-leads --project-ref xvnjaxbrlvvdufbcaysd
```

Após o deploy, defina as Environment Variables (Functions → Settings) para cada function:

- `SUPABASE_URL` = `https://xvnjaxbrlvvdufbcaysd.supabase.co`
- `SUPABASE_SERVICE_ROLE` = <SERVICE_ROLE_KEY>  # NÃO COMMITAR
- `ADMIN_TOKEN` = <random-secret-for-admin-requests>

Se preferir não usar CLI, você pode criar as functions diretamente no painel de Functions do Supabase e colar o código.

3) Variáveis de ambiente no frontend (local)

Crie/atualize `.env.local` na raiz do projeto com:

```bash
VITE_SUPABASE_URL=https://xvnjaxbrlvvdufbcaysd.supabase.co
VITE_SUPABASE_ANON_KEY=<anon/public key>
VITE_SUPABASE_CREATE_LEAD_FUNCTION_URL=https://xvnjaxbrlvvdufbcaysd.functions.supabase.co/create-lead
VITE_SUPABASE_FETCH_LEADS_FUNCTION_URL=https://xvnjaxbrlvvdufbcaysd.functions.supabase.co/fetch-leads
VITE_SUPABASE_ADMIN_TOKEN=<ADMIN_TOKEN set in function envs>
VITE_WHATSAPP_CONSULTOR_NUMBER=5521XXXXXXXX
```

Observação: não versionar `.env.local`.

4) Como o frontend foi integrado

- `src/lib/leadsApi.ts` — helper que tenta chamar a Function configurada (`VITE_SUPABASE_CREATE_LEAD_FUNCTION_URL`) e, em caso de falha, faz fallback para um insert direto com o client Supabase usando `VITE_SUPABASE_ANON_KEY`.
- `FinalCTA`, `ChatWidget` e `WhatsAppButton` já chamam `createLead(...)` (melhor esforço, não bloqueante).
- `AdminDashboard` chama `fetchLeadsAdmin()` que irá executar a function `fetch-leads` (recomendada).

5) Rodando localmente (dev)

No PowerShell, na raiz do projeto:

```powershell
npm install
npm run dev
```

6) Testes básicos (passo-a-passo)

- Submeter o formulário em `FinalCTA` → verificar no Supabase Console → Table `public.leads` se a linha foi inserida.
- Finalizar o chat (ChatWidget) → verificar lead.
- Clicar no botão WhatsApp → verificar lead com `whatsapp_consent = true`.
- Acessar Admin Dashboard localmente (adicionar `?admin=claris2024` na URL conforme presente no `App.tsx`) e confirmar que os leads aparecem.

7) Segurança e notas finais

- Nunca exponha a `SERVICE_ROLE` no frontend.
- `VITE_SUPABASE_ADMIN_TOKEN` no frontend é visível — para produção, mova o admin para um backend protegido ou use autenticação real para o painel.
- Se habilitar RLS, garanta que as policies permitam o fluxo desejado (inserção via function/service role e leitura apenas por admin function).

8) Troubleshooting rápido

- Erro 401 ao chamar `fetch-leads`: verifique `ADMIN_TOKEN` nas envs da function e o header `x-admin-token` enviado.
- Function retorna 500: verifique logs (Supabase Console → Functions → Logs) e se `SUPABASE_SERVICE_ROLE` está correto.
- Nenhuma linha aparece: verifique RLS/policies ou se a inserção foi feita pelo anon key (fallback) e se a tabela existe.

Se quiser, eu posso:
- Rodar o dev server e corrigir erros (posso executar localmente). 
- Ajudar a fazer o deploy das functions (se fornecer acesso ao Supabase CLI ou instruções). 

---
Arquivo(s) de interesse no projeto:
- `src/lib/leadsApi.ts` — helper central
- `src/lib/supabaseClient.ts` — supabase client com `VITE_` envs
- `supabase/functions/*` — exemplos de functions para deploy
# Claris Casa & Clube - Landing Page

Um projeto de landing page premium para o condomínio de luxo Claris Casa & Clube na Barra da Tijuca, Rio de Janeiro.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS v4** para estilização
- **Motion** (Framer Motion) para animações
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd claris-landing

# Instale as dependências
npm install

# Execute o projeto em desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes base (Button, Input, etc.)
│   ├── HeroSection.tsx     # Seção principal
│   ├── VisualTour.tsx      # Tour virtual interativo
│   ├── FinalCTA.tsx        # Chamada para ação final
│   └── ...                 # Outros componentes
├── styles/
│   └── globals.css         # Estilos globais e Tailwind
└── main.tsx               # Ponto de entrada da aplicação
```

## 🎨 Design System

### Cores Principais
- **Dourado Claris**: `#D4AF37`
- **Dourado Escuro**: `#B8941F`
- **Cinza Claris**: `#6c757d`
- **Cinza Claro**: `#f8f9fa`

### Tipografia
- **Serif**: Playfair Display (títulos)
- **Sans-serif**: Inter (textos)

```bash
# Build para produção
npm run build

# Os arquivos estarão em ./dist
```

## 📱 Funcionalidades

- ✅ Design responsivo
- ✅ Animações suaves com Motion
- ✅ Tour virtual interativo
- ✅ Galeria de imagens com lightbox
- ✅ Formulários de contato
- ✅ Integração com Supabase (opcional)
- ✅ Dashboard administrativo
- ✅ SEO otimizado

## 🔧 Personalização

### Cores

```css
:root {
  --claris-gold: #D4AF37;
  --claris-gold-dark: #B8941F;
  /* ... outras cores */
}
```

### Componentes
Todos os componentes estão organizados modularmente e podem ser facilmente customizados.

## 📞 Suporte

Para dúvidas sobre o projeto, entre em contato.

---

**Claris Casa & Clube** - Condomínio de Luxo na Barra da Tijuca