# Frontend (React + Vite + TS + Tailwind)

## Arranque

```bash
cd Front/frontTareas
npm ci
npm run dev
```

App: http://localhost:5173

## Funcionalidades

- Tablero Kanban (CREADA, EN_PROGRESO, BLOQUEADA, FINALIZADA, CANCELADA)
- CRUD de tareas (crear, editar, eliminar)
- Drag & Drop para cambiar estado
- Selección de responsable
- Fecha de creación visible
- Mini‑chat "IA" (desplegable en esquina inferior derecha)
  - "que tareas estan bloqueadas" → cantidad y lista `[id] titulo · responsable · fecha`
  - "estadisticas del tablero"
  - "quien tiene mas tareas"
  - "sugiere tareas para mejorar el proyecto" (requiere Cohere)

## Config

- El chat envía a `POST http://localhost:3001/ai-agent` (backend proxy hacia n8n)
- La API base del front usa `http://localhost:3001`

## Despliegue con Docker

Requisitos: tener el backend disponible en `http://localhost:3001` (por ejemplo, levantado desde la raíz con `docker compose up -d --build backend`).

### Opción A — Imagen Docker directa (recomendada)

```powershell
cd Front/frontTareas

# Construir imagen
docker build -t kanban-frontend .

# Ejecutar contenedor (sirve en http://localhost:8080)
docker run -d --name kanban-frontend -p 8080:80 kanban-frontend
```

- Acceso: `http://localhost:8080`
- La app está servida por Nginx (ver `nginx.conf`).
- La app seguirá consumiendo la API en `http://localhost:3001`.

### Opción B — Desarrollo local (sin Docker)

```powershell
cd Front/frontTareas
npm ci
npm run dev
```

- Acceso: `http://localhost:5173`
- Asegúrate de que el backend esté corriendo en `http://localhost:3001`.

## Levantamiento de n8n (AI Agent)

Levántalo desde la raíz del proyecto, ya que el `docker-compose.yml` principal define el servicio `n8n` y enlaza con el backend.

```powershell
# (Opcional) API key de Cohere para sugerencias
$env:COHERE_API_KEY = "tu_api_key"

# Desde la raíz del repo
docker compose up -d --build n8n

# Acceso a la consola de n8n
# http://localhost:5678
```

### Importar y activar el workflow

1. Abre `http://localhost:5678` (usuario: `admin`, pass: `admin123`).
2. Menú Workflows → Import → Import from File.
3. Elige un flujo de `n8n-flows/` (por ejemplo: `ai-agent-bloqueadas-min.json`).
4. En el nodo Webhook, verifica:
   - Method: POST
   - Path: `ai-agent-cohere-activado`
   - Response mode: Using Respond to Webhook Node
5. Activa el workflow.

### Probar webhook (PowerShell)

```powershell
$h = @{ Authorization = 'Basic YWRtaW46YWRtaW4xMjM='; 'Content-Type'='application/json' }
Invoke-RestMethod -Uri 'http://localhost:5678/webhook/ai-agent-cohere-activado' -Method Post -Headers $h -Body (@{mensaje='que tareas estan bloqueadas'} | ConvertTo-Json) | ConvertTo-Json -Depth 6
```

Nota: el frontend envía al backend `POST /ai-agent`. El backend reenvía a n8n usando `N8N_WEBHOOK_URL` (ya configurado en el `docker-compose.yml` de la raíz).
