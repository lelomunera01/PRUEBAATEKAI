#!/bin/bash

# Script de prueba para el AI Agent Kanban
# Asegúrate de que n8n esté corriendo en http://localhost:5678

echo "Probando el AI Agent Kanban..."
echo "=================================="


test_ai_agent() {
    local endpoint=$1
    local message=$2
    local description=$3
    
    echo ""
    echo "$description"
    echo "Mensaje: $message"
    echo "Endpoint: $endpoint"
    
    response=$(curl -s -X POST "$endpoint" \
        -H "Content-Type: application/json" \
        -d "{\"mensaje\": \"$message\"}")
    
    if [ $? -eq 0 ]; then
        echo "Respuesta recibida:"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo "Error en la petición"
    fi
    echo "----------------------------------------"
}

# Verificar que n8n esté corriendo
echo "Verificando que n8n esté corriendo..."
if curl -s http://localhost:5678 > /dev/null; then
    echo "n8n está corriendo en http://localhost:5678"
else
    echo "n8n no está corriendo. Asegúrate de ejecutar:"
    echo "   docker-compose up -d"
    exit 1
fi

# Pruebas del AI Agent Cohere Activado (cumple TODOS los requisitos de la prueba técnica)
echo ""
echo "Probando AI Agent Kanban con Cohere Activado - TEKAI..."
test_ai_agent "http://localhost:5678/webhook/ai-agent-cohere-activado" \
    "¿Cuántas tareas están bloqueadas?" \
    "Requisito: ¿Qué tareas están bloqueadas?"

test_ai_agent "http://localhost:5678/webhook/ai-agent-cohere-activado" \
    "¿Quién tiene más tareas pendientes?" \
    "Requisito: ¿Quién tiene más tareas pendientes?"

test_ai_agent "http://localhost:5678/webhook/ai-agent-cohere-activado" \
    "Sugiere tareas para mejorar el proyecto" \
    "Requisito: Sugerir tareas automáticamente"

test_ai_agent "http://localhost:5678/webhook/ai-agent-cohere-activado" \
    "Hola, ¿cómo puedes ayudarme?" \
    "Consulta general del AI Agent"

echo ""
echo "Pruebas completadas!"
echo ""
echo "Para ver más detalles, revisa los logs de n8n:"
echo "   docker-compose logs -f n8n"
echo ""
echo "Accede a n8n en: http://localhost:5678"
echo "   Usuario: admin"
echo "   Contraseña: admin123"
