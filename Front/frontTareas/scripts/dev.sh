#!/bin/bash

echo "🚀 Iniciando entorno de desarrollo para el Frontend Kanban..."

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

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "🔧 Creando archivo .env..."
    cp env.example .env
    echo "✅ Archivo .env creado. Ajusta la URL de la API según sea necesario."
else
    echo "✅ El archivo .env ya existe"
fi

# Iniciar servidor de desarrollo
echo "🌐 Iniciando servidor de desarrollo..."
echo "📍 El frontend estará disponible en: http://localhost:5173"
echo "🔗 Asegúrate de que el backend esté ejecutándose en: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev
