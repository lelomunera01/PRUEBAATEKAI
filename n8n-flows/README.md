# n8n (Workflows)

## Arranque con Docker

```powershell
docker compose up -d --build n8n
```

App: http://localhost:5678

## Variables importantes

- BACKEND_URL=http://host.docker.internal:3001
- N8N_BASIC_AUTH_USER / N8N_BASIC_AUTH_PASSWORD (si activas basic auth)
- (Opcional) COHERE_API_KEY

## Importar y activar el flujo

1. Workflows → Import → Import from File → selecciona el JSON que quieras usar.
2. Abre el nodo Webhook y verifica:
   - Method: POST
   - Path: `ai-agent-cohere-activado`
   - Response mode: Using Respond to Webhook Node
3. Responder Webhook:
   - Respond with: JSON
   - Body: `{{$json}}`
4. Activa el workflow (toggle arriba a la derecha).

## Probar

Producción (con Basic Auth):

```powershell
$h = @{ Authorization = 'Basic YWRtaW46YWRtaW4xMjM='; 'Content-Type'='application/json' }
Invoke-RestMethod -Uri 'http://localhost:5678/webhook/ai-agent-cohere-activado' -Method Post -Headers $h -Body (@{mensaje='que tareas estan bloqueadas'} | ConvertTo-Json) | ConvertTo-Json -Depth 6
```

## Notas

- Evita tener dos workflows activos con el mismo path.
- Si usas Cohere, asegúrate de que `COHERE_API_KEY` esté presente en el contenedor y que el nodo HTTP use el header `Authorization: Bearer {{$env.COHERE_API_KEY}}`.
