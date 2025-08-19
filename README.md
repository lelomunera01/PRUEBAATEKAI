# Sistema de Gestión de Tareas Kanban con AI Agent

Este proyecto implementa un sistema completo de gestión de tareas estilo Kanban con un AI Agent integrado usando n8n y Cohere.

## Arquitectura

- **Backend**: NestJS con TypeScript, Prisma ORM, SQLite
- **Frontend**: (Pendiente de implementar)
- **Automatización**: n8n con Docker
- **AI Agent**: Integrado con Cohere AI
- **Base de Datos**: SQLite con migraciones Prisma

## Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- API Key de Cohere (gratuita en [cohere.ai](https://cohere.ai))

## Estructura del Proyecto

```
Proyecto Kanban/
├── my/                          # Backend NestJS
│   ├── src/
│   │   ├── task/               # Módulo de tareas
│   │   └── prisma/             # Configuración de base de datos
│   ├── prisma/                 # Esquema y migraciones
│   └── package.json
├── n8n-flows/                  # Flujos de n8n exportados
│   └── ai-agent-cohere-integrado.json  # AI Agent con Cohere (cumple TODOS los requisitos)
├── docker-compose.yml          # Configuración de Docker
└── README.md                   # Este archivo
```

## Configuración con Docker

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Cohere API Key para el AI Agent
COHERE_API_KEY=tu_api_key_de_cohere_aqui

# Backend Configuration
BACKEND_URL=http://backend:3000
BACKEND_API_BASE=/api

# n8n Configuration
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
```

### 2. Levantar los Servicios

```bash
# Crear la red de Docker
docker network create kanban-network

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 3. Acceder a los Servicios

- **Backend API**: http://localhost:3000
- **n8n**: http://localhost:5678
  - Usuario: `admin`
  - Contraseña: `admin123`

## Configuración del AI Agent en n8n

### 1. Importar Flujo con Cohere

1. Accede a n8n en http://localhost:5678
2. Ve a **Workflows** → **Import from file**
3. Importa el archivo `ai-agent-cohere-integrado.json` (flujo con Cohere)

### 2. Activar el Flujo

1. Una vez importado, haz clic en **Activate** para activar el workflow
2. El webhook estará disponible en: `http://localhost:5678/webhook/ai-agent-cohere-tekai`

### 3. Funcionalidades del AI Agent

El flujo simple cumple **EXACTAMENTE** con los requisitos de la prueba técnica:

**Sugerir tareas automáticamente** - Funcionalidad mínima requerida
**Responder: "¿Qué tareas están bloqueadas?"** - Consulta específica requerida
**Responder: "¿Quién tiene más tareas pendientes?"** - Consulta específica requerida

## 📡 Endpoint del AI Agent

### Chat con Cohere (Cumple TODOS los requisitos de la prueba)

```
POST http://localhost:5678/webhook/ai-agent-cohere-tekai
Content-Type: application/json

{
  "mensaje": "¿Cuántas tareas están bloqueadas?"
}
```

### Ejemplos de Uso

#### 1. **Ver Tareas Bloqueadas** (Requisito específico)

```json
{
  "mensaje": "¿Cuántas tareas están bloqueadas?"
}
```

#### 2. **Analizar Responsables** (Requisito específico)

```json
{
  "mensaje": "¿Quién tiene más tareas pendientes?"
}
```

#### 3. **Sugerencias** (Requisito específico)

```json
{
  "mensaje": "Sugiere tareas para mejorar el proyecto"
}
```

## Pruebas del AI Agent

### Pruebas del Flujo con Cohere

```bash
# 1. Ver tareas bloqueadas (Requisito específico)
curl -X POST http://localhost:5678/webhook/ai-agent-cohere-tekai \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Cuántas tareas están bloqueadas?"}'

# 2. Identificar responsable más ocupado (Requisito específico)
curl -X POST http://localhost:5678/webhook/ai-agent-cohere-tekai \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "¿Quién tiene más tareas pendientes?"}'

# 3. Sugerir tareas (Requisito específico)
curl -X POST http://localhost:5678/webhook/ai-agent-cohere-tekai \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Sugiere tareas para mejorar el proyecto"}'

# 4. Consulta general
curl -X POST http://localhost:5678/webhook/ai-agent-cohere-tekai \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Hola, ¿cómo puedes ayudarme?"}'
```

## 🔧 Desarrollo Local

### Backend

```bash
cd my

# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Ejecutar en modo desarrollo
npm run start:dev
```

### API Endpoints Disponibles

- `GET /api/tareas` - Obtener todas las tareas
- `POST /api/tareas` - Crear nueva tarea
- `GET /api/tareas/:id` - Obtener tarea por ID
- `PATCH /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea
- `GET /api/tareas/estadisticas` - Obtener estadísticas
- `GET /api/tareas/bloqueadas` - Obtener tareas bloqueadas
- `GET /api/tareas/estado/:estado` - Obtener tareas por estado
- `PATCH /api/tareas/:id/estado/:estado` - Cambiar estado de tarea
- `GET /api/tareas/responsable/:responsable` - Obtener tareas por responsable

## Funcionalidades del AI Agent

### Implementadas (Cumple TODOS los requisitos de la prueba técnica)

- **Sugerir tareas automáticamente** - Funcionalidad mínima requerida
- **Responder: "¿Qué tareas están bloqueadas?"** - Consulta específica requerida
- **Responder: "¿Quién tiene más tareas pendientes?"** - Consulta específica requerida
- **Integración con Cohere AI** - Como especifica la prueba técnica
- **n8n con Docker** - Automatización local requerida

### 🔮 Próximas Funcionalidades

- **Análisis de tendencias**
- **Predicción de fechas de entrega**
- **Optimización de carga de trabajo**
- **Notificaciones inteligentes**

## 🐛 Solución de Problemas

### n8n no puede conectarse al backend

```bash
# Verificar que la red Docker esté creada
docker network ls

# Recrear la red si es necesario
docker network rm kanban-network
docker network create kanban-network

# Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Error de autenticación en Cohere

1. Verificar que la API key esté correcta
2. Asegurar que la credencial esté configurada en n8n
3. Verificar que el flujo use la credencial correcta

### Webhook no responde

1. Verificar que el flujo esté activo en n8n
2. Comprobar que el webhook esté configurado correctamente
3. Revisar logs de n8n para errores

## Recursos Adicionales

- [Documentación de n8n](https://docs.n8n.io/)
- [API de Cohere](https://docs.cohere.ai/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como prueba técnica para pasantes TEKAI.

---

**¡El AI Agent está listo para ayudarte a gestionar tu proyecto Kanban! 🚀**
