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
