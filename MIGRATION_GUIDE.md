# Guia de Migração - Claris Landing Page

Este documento contém as instruções para completar a migração do projeto Claris para a estrutura React + Vite.

## ✅ Arquivos já Criados

- ✅ `package.json` - Dependências e scripts
- ✅ `vite.config.ts` - Configuração do Vite
- ✅ `tailwind.config.js` - Configuração do Tailwind
- ✅ `tsconfig.json` - Configuração do TypeScript
- ✅ `src/main.tsx` - Ponto de entrada
- ✅ `src/App.tsx` - Componente principal
- ✅ `src/styles/globals.css` - Estilos globais
- ✅ `src/components/ui/utils.ts` - Utilitários
- ✅ `src/components/ui/button.tsx` - Componente Button
- ✅ `src/components/ui/input.tsx` - Componente Input
- ✅ `src/components/ui/ImageWithFallback.tsx` - Componente de imagem
- ✅ `src/components/HeroSection.tsx` - Seção hero
- ✅ `src/components/VisualTour.tsx` - Tour virtual
- ✅ `src/components/WhyClaris.tsx` - Seção "Por que Claris"

## 📋 Próximos Passos

### 1. Copiar Componentes Restantes

Copie todos os componentes da pasta `components/` do projeto original para `src/components/`:

```bash
# Copie os seguintes arquivos para src/components/:
cp ../components/ExclusiveServices.tsx src/components/
cp ../components/ExcellenceSection.tsx src/components/
cp ../components/StrategicLocation.tsx src/components/
cp ../components/TargetAudience.tsx src/components/
cp ../components/FinalCTA.tsx src/components/
cp ../components/WhatsAppButton.tsx src/components/
cp ../components/AdminDashboard.tsx src/components/
cp ../components/FloorPlanCarousel.tsx src/components/
cp ../components/VideoModal.tsx src/components/
```

### 2. Copiar Componentes UI Restantes

Copie todos os componentes UI restantes da pasta `components/ui/`:

```bash
# Copie os seguintes arquivos para src/components/ui/:
cp ../components/ui/*.tsx src/components/ui/
```

### 3. Ajustar Imports

Em todos os componentes copiados, ajuste os imports:

**Antes:**
```typescript
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
```

**Depois:**
```typescript
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Button } from "./ui/button";
```

### 4. Testar o Projeto

```bash
# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Teste o build
npm run build
```

## 🔧 Possíveis Ajustes Necessários

### Supabase (se usado)
Se o projeto usar Supabase, você pode precisar:

1. Configurar variáveis de ambiente:
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Ajustar imports do Supabase nos componentes que o usam.

### Assets e Imagens
Se houver assets específicos (imagens, ícones), copie-os para `src/assets/` e ajuste os imports.

### Componentes com Dependências Específicas
Alguns componentes podem usar dependências específicas. Verifique se todas estão no `package.json`.

## 📱 Estrutura Final Esperada

```
claris-landing/
├── src/
│   ├── components/
│   │   ├── ui/                 # Todos os componentes UI
│   │   ├── HeroSection.tsx     ✅
│   │   ├── WhyClaris.tsx       ✅
│   │   ├── VisualTour.tsx      ✅
│   │   ├── ExclusiveServices.tsx
│   │   ├── ExcellenceSection.tsx
│   │   ├── StrategicLocation.tsx
│   │   ├── TargetAudience.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── AdminDashboard.tsx
│   ├── styles/
│   │   └── globals.css          ✅
│   ├── App.tsx                  ✅
│   └── main.tsx                 ✅
├── package.json                 ✅
├── vite.config.ts              ✅
├── tailwind.config.js          ✅
└── tsconfig.json               ✅
```

## 🚀 Deploy

Após completar a migração, o projeto estará pronto para deploy em:
- Vercel
- Netlify  
- GitHub Pages
- Outras plataformas

## ⚠️ Troubleshooting

### Erro de Import
Se houver erros de import, verifique:
1. Se o caminho está correto
2. Se o componente foi copiado
3. Se as dependências estão instaladas

### Erro de Tailwind
Se classes Tailwind não funcionarem:
1. Verifique se o `@import "tailwindcss"` está no `globals.css`
2. Confirme se o `tailwind.config.js` está configurado corretamente

### Erro de TypeScript
Para erros de TypeScript:
1. Verifique se todos os tipos estão corretos
2. Confirme se as dependências têm seus tipos instalados

## 📞 Suporte

Se encontrar problemas durante a migração, verifique:
1. Console do navegador para erros JavaScript
2. Terminal para erros de build
3. Network tab para problemas de assets

---

**Boa sorte com a migração! 🎉**