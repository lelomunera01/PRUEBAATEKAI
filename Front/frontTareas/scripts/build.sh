#!/bin/bash

echo "🏗️ Construyendo proyecto Frontend Kanban..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js y npm están instalados"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Las dependencias ya están instaladas"
fi

# Limpiar build anterior
if [ -d "dist" ]; then
    echo "🧹 Limpiando build anterior..."
    rm -rf dist
fi

# Construir proyecto
echo "🔨 Construyendo proyecto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Proyecto construido exitosamente!"
    echo "📍 Los archivos están en la carpeta: dist/"
    echo "🌐 Puedes servir estos archivos con cualquier servidor web estático"
    echo ""
    echo "Para probar la build:"
    echo "  npm run preview"
    echo ""
    echo "Para construir Docker:"
    echo "  docker build -t kanban-frontend ."
else
    echo "❌ Error al construir el proyecto"
    exit 1
fi
