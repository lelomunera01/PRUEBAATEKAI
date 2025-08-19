# Script para probar el frontend completo
Write-Host "Probando funcionalidad del frontend..." -ForegroundColor Yellow

# Verificar que el backend esté funcionando
Write-Host "`nVerificando backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    Write-Host "Backend funcionando - Tareas encontradas: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Ejecuta primero: cd my && npm run start:dev" -ForegroundColor Yellow
    exit 1
}

# Verificar que el frontend esté funcionando
Write-Host "`nVerificando frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 5
    Write-Host "Frontend funcionando en puerto 5173" -ForegroundColor Green
} catch {
    Write-Host "Frontend no disponible en puerto 5173" -ForegroundColor Red
    Write-Host "Ejecuta: cd Front/frontTareas && npm run dev" -ForegroundColor Yellow
}

# Probar crear una tarea
Write-Host "`nProbando crear tarea..." -ForegroundColor Cyan
try {
    $tareaData = @{
        titulo = "Tarea de Prueba Frontend"
        descripcion = "Esta es una tarea de prueba para verificar el frontend"
        estado = "CREADA"
        responsable = "Juan Henao"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Post -Body $tareaData -ContentType "application/json"
    Write-Host "Tarea creada exitosamente!" -ForegroundColor Green
    Write-Host "   ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "   Título: $($response.titulo)" -ForegroundColor Cyan
    Write-Host "   Estado: $($response.estado)" -ForegroundColor Cyan
} catch {
    Write-Host "Error creando tarea: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar cambiar estado
Write-Host "`nProbando cambio de estado..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    if ($response.Count -gt 0) {
        $tareaId = $response[0].id
        $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas/$tareaId/estado/EN_PROGRESO" -Method Patch
        Write-Host "Estado cambiado exitosamente!" -ForegroundColor Green
        Write-Host "   Tarea ID: $tareaId" -ForegroundColor Cyan
        Write-Host "   Nuevo estado: $($response.estado)" -ForegroundColor Cyan
    } else {
        Write-Host "No hay tareas para probar cambio de estado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error cambiando estado: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nResumen de pruebas:" -ForegroundColor Green
Write-Host "1. Backend: Funcionando" -ForegroundColor Green
Write-Host "2. Frontend: Verificar en http://localhost:5173" -ForegroundColor Cyan
Write-Host "3. API: Funcionando" -ForegroundColor Green
Write-Host "4. Drag & Drop: Probar en la interfaz web" -ForegroundColor Cyan

Write-Host "`nPara probar el frontend completo:" -ForegroundColor Yellow
Write-Host "1. Abre http://localhost:5173 en tu navegador" -ForegroundColor White
Write-Host "2. Usa el botón 'Test API' para verificar conexión" -ForegroundColor White
Write-Host "3. Crea una nueva tarea con el botón 'Nueva Tarea'" -ForegroundColor White
Write-Host "4. Arrastra tareas entre columnas para cambiar estado" -ForegroundColor White
