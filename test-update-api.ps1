# Script para probar la API de actualización directamente
Write-Host "Probando API de Actualización..." -ForegroundColor Yellow

# Verificar que el backend esté funcionando
Write-Host "`nVerificando backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    Write-Host "Backend funcionando - Tareas encontradas: $($response.Count)" -ForegroundColor Green
    
    if ($response.Count -eq 0) {
        Write-Host "No hay tareas para probar. Creando una tarea de prueba..." -ForegroundColor Yellow
        
        # Crear una tarea de prueba
        $tareaData = @{
            titulo = "Tarea de Prueba para Actualizar"
            descripcion = "Esta tarea será actualizada para probar la API"
            estado = "CREADA"
            responsable = "Admin"
        } | ConvertTo-Json

        $nuevaTarea = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Post -Body $tareaData -ContentType "application/json"
        Write-Host "Tarea de prueba creada con ID: $($nuevaTarea.id)" -ForegroundColor Green
        
        # Recargar la lista
        $response = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    }
    
} catch {
    Write-Host "Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Ejecuta primero: cd my && npm run start:dev" -ForegroundColor Yellow
    exit 1
}

# Probar actualización de tarea
Write-Host "`nProbando actualización de tarea..." -ForegroundColor Cyan
try {
    $tarea = $response[0]
    $tareaId = $tarea.id
    
    Write-Host "   Tarea seleccionada:" -ForegroundColor White
    Write-Host "   ID: $tareaId" -ForegroundColor Cyan
    Write-Host "   Título actual: $($tarea.titulo)" -ForegroundColor Cyan
    Write-Host "   Estado actual: $($tarea.estado)" -ForegroundColor Cyan
    
    # Datos de actualización
    $datosActualizados = @{
        titulo = "$($tarea.titulo) - ACTUALIZADO $(Get-Date -Format 'HH:mm:ss')"
        descripcion = "$($tarea.descripcion) - ACTUALIZADO $(Get-Date -Format 'HH:mm:ss')"
        estado = $tarea.estado
        responsable = $tarea.responsable
    } | ConvertTo-Json
    
    Write-Host "`n   Enviando datos de actualización:" -ForegroundColor White
    Write-Host "   $datosActualizados" -ForegroundColor Gray
    
    # Hacer la petición PATCH
    $tareaActualizada = Invoke-RestMethod -Uri "http://localhost:3001/tareas/$tareaId" -Method Patch -Body $datosActualizados -ContentType "application/json"
    
    Write-Host "`nTarea actualizada exitosamente!" -ForegroundColor Green
    Write-Host "   Nuevo título: $($tareaActualizada.titulo)" -ForegroundColor Cyan
    Write-Host "   Nueva descripción: $($tareaActualizada.descripcion)" -ForegroundColor Cyan
    Write-Host "   Estado: $($tareaActualizada.estado)" -ForegroundColor Cyan
    Write-Host "   Responsable: $($tareaActualizada.responsable)" -ForegroundColor Cyan
    
} catch {
    Write-Host "`nError actualizando tarea: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        Write-Host "   Status Description: $statusDescription" -ForegroundColor Red
    }
    
    # Mostrar más detalles del error
    Write-Host "`nDetalles del error:" -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:3001/tareas/$tareaId" -ForegroundColor Gray
    Write-Host "   Método: PATCH" -ForegroundColor Gray
    Write-Host "   Datos enviados: $datosActualizados" -ForegroundColor Gray
}

# Probar cambio de estado
Write-Host "`nProbando cambio de estado..." -ForegroundColor Cyan
try {
    $tarea = $response[0]
    $tareaId = $tarea.id
    $estadoActual = $tarea.estado
    $nuevoEstado = if ($estadoActual -eq "CREADA") { "EN_PROGRESO" } else { "CREADA" }
    
    Write-Host "   Cambiando estado de tarea ID: $tareaId" -ForegroundColor White
    Write-Host "   Estado actual: $estadoActual" -ForegroundColor Cyan
    Write-Host "   Nuevo estado: $nuevoEstado" -ForegroundColor Cyan
    
    # Hacer la petición PATCH para cambiar estado
    $tareaConEstadoCambiado = Invoke-RestMethod -Uri "http://localhost:3001/tareas/$tareaId/estado/$nuevoEstado" -Method Patch
    
    Write-Host "`nEstado cambiado exitosamente!" -ForegroundColor Green
    Write-Host "   Estado anterior: $estadoActual" -ForegroundColor Cyan
    Write-Host "   Nuevo estado: $($tareaConEstadoCambiado.estado)" -ForegroundColor Cyan
    
} catch {
    Write-Host "`nError cambiando estado: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        Write-Host "   Status Description: $statusDescription" -ForegroundColor Red
    }
}

# Verificar estado final
Write-Host "`nVerificando estado final..." -ForegroundColor Cyan
try {
    $tareasFinales = Invoke-RestMethod -Uri "http://localhost:3001/tareas" -Method Get
    Write-Host "Estado final verificado - Total tareas: $($tareasFinales.Count)" -ForegroundColor Green
    
    foreach ($tarea in $tareasFinales) {
        Write-Host "   ID: $($tarea.id) | Título: $($tarea.titulo) | Estado: $($tarea.estado)" -ForegroundColor White
    }
    
} catch {
    Write-Host "Error verificando estado final: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nResumen de pruebas:" -ForegroundColor Green
Write-Host "1. Backend funcionando" -ForegroundColor Green
Write-Host "2. Tareas cargadas: $($response.Count)" -ForegroundColor Green
Write-Host "3. Prueba de actualización completada" -ForegroundColor Cyan
Write-Host "4. Prueba de cambio de estado completada" -ForegroundColor Cyan

Write-Host "`nSi las pruebas de API funcionan pero el frontend no:" -ForegroundColor Yellow
Write-Host "1. Verifica la consola del navegador (F12)" -ForegroundColor White
Write-Host "2. Usa el botón 'Test Update' en la interfaz" -ForegroundColor White
Write-Host "3. Revisa los logs del backend" -ForegroundColor White
