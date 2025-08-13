#!/bin/bash

# Script para copiar todos os componentes para a nova estrutura

echo "Copiando componentes..."

# Copia todos os componentes principais
cp /components/*.tsx /claris-landing/src/components/ 2>/dev/null || true

# Copia componentes UI (exceto os já criados)
cp /components/ui/*.tsx /claris-landing/src/components/ui/ 2>/dev/null || true
cp /components/ui/*.ts /claris-landing/src/components/ui/ 2>/dev/null || true

echo "Componentes copiados!"

# Ajusta imports nos arquivos copiados
echo "Ajustando imports..."

# Substitui imports relativos dos componentes UI
find /claris-landing/src/components -name "*.tsx" -exec sed -i 's|from "\./ui/|from "\./ui/|g' {} \;
find /claris-landing/src/components -name "*.tsx" -exec sed -i 's|from "\./figma/ImageWithFallback|from "\./ui/ImageWithFallback|g' {} \;

echo "Imports ajustados!"
echo "Estrutura do projeto criada com sucesso!"