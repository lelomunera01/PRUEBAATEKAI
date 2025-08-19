import React, { useState } from "react";
import { tareasService } from "../services/tareasService";

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>("No probado");
  const [response, setResponse] = useState<string>("");

  const testConnection = async () => {
    try {
      setStatus("Probando...");
      const tareas = await tareasService.getTareas();
      setStatus("Conexión exitosa");
      setResponse(JSON.stringify(tareas, null, 2));
    } catch (error: any) {
      setStatus("Error de conexión");
      setResponse(error.message || "Error desconocido");
    }
  };

  const testCreateTarea = async () => {
    try {
      setStatus("Creando tarea de prueba...");
      const nuevaTarea = await tareasService.createTarea({
        titulo: "Tarea de Prueba",
        descripcion: "Esta es una tarea de prueba para verificar la API",
        estado: "CREADA",
        responsable: "Admin",
      });
      setStatus("Tarea creada exitosamente");
      setResponse(JSON.stringify(nuevaTarea, null, 2));
    } catch (error: any) {
      setStatus("Error al crear tarea");
      setResponse(error.message || "Error desconocido");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Prueba de Conexión con Backend
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>URL de la API:</strong>{" "}
            {import.meta.env.VITE_API_URL || "http://localhost:3001"}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Probar Conexión
          </button>

          <button
            onClick={testCreateTarea}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Crear Tarea de Prueba
          </button>
        </div>

        <div>
          <p className="font-semibold">Estado: {status}</p>
        </div>

        {response && (
          <div>
            <p className="font-semibold mb-2">Respuesta:</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection;
