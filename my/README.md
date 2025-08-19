# Backend (NestJS + Prisma + SQLite)

## Arranque con Docker

```powershell
docker compose up -d --build backend
```

API: http://localhost:3001/api

## Desarrollo local

```bash
cd my
npm ci
npx prisma generate
npm run start:dev
```

## Endpoints

- GET /tareas
- GET /tareas/estadisticas
- GET /tareas/bloqueadas
- GET /tareas/estado/:estado
- GET /tareas/:id
- POST /tareas
- PATCH /tareas/:id
- PATCH /tareas/:id/estado/:estado
- DELETE /tareas/:id

## Agente IA (proxy)

- POST /ai-agent { mensaje: string }
- Reenvía a n8n (webhook `ai-agent-cohere-activado`). Si n8n no responde, responde local para: bloqueadas, estadísticas, ranking; y usa Cohere si hay `COHERE_API_KEY` para sugerencias.

## Prisma / Base de datos

- SQLite en `my/prisma/dev.db`
- Volumen montado en Docker: `./my/prisma:/usr/src/app/prisma`

## Swagger

- Disponible en `http://localhost:3001/api`
