# Script para probar el backend
Write-Host "🔍 Probando conexión con el backend..." -ForegroundColor Yellow

# Probar si el backend está respondiendo
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    Write-Host "✅ Backend funcionando correctamente!" -ForegroundColor Green
    Write-Host "Respuesta: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error conectando con el backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que el backend esté ejecutándose en el puerto 3001" -ForegroundColor Yellow
}

# Probar crear una tarea
Write-Host "`n🧪 Probando crear una tarea..." -ForegroundColor Yellow
try {
    $tareaData = @{
        titulo = "Tarea de Prueba PowerShell"
        descripcion = "Esta es una tarea de prueba desde PowerShell"
        estado = "CREADA"
        responsable = "Admin"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Post -Body $tareaData -ContentType "application/json"
    Write-Host "✅ Tarea creada exitosamente!" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando tarea: $($_.Exception.Message)" -ForegroundColor Red
}
