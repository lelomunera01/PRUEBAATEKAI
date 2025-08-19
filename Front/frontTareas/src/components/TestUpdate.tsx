import React, { useState } from "react";
import { tareasService } from "../services/tareasService";
import { Tarea } from "../types";

const TestUpdate: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const tareasData = await tareasService.getTareas();
      setTareas(tareasData);
      setMessage(`Cargadas ${tareasData.length} tareas`);
    } catch (error) {
      setMessage(`Error cargando tareas: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const probarActualizacion = async (tarea: Tarea) => {
    try {
      setLoading(true);
      setMessage(`Probando actualización de tarea ID: ${tarea.id}`);

      const datosActualizados = {
        titulo: `${tarea.titulo} - ACTUALIZADO`,
        descripcion: `${tarea.descripcion} - ACTUALIZADO`,
        estado: tarea.estado,
        responsable: tarea.responsable,
      };

      const tareaActualizada = await tareasService.updateTarea(
        tarea.id!,
        datosActualizados
      );

      setMessage(`Tarea actualizada exitosamente: ${tareaActualizada.titulo}`);

      // Recargar tareas para ver el cambio
      setTimeout(cargarTareas, 1000);
    } catch (error: any) {
      setMessage(`Error actualizando tarea: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const probarCambioEstado = async (tarea: Tarea) => {
    try {
      setLoading(true);
      setMessage(`Probando cambio de estado de tarea ID: ${tarea.id}`);

      const nuevoEstado = tarea.estado === "CREADA" ? "EN_PROGRESO" : "CREADA";

      const tareaActualizada = await tareasService.changeEstado(
        tarea.id!,
        nuevoEstado
      );

      setMessage(
        `Estado cambiado exitosamente: ${tarea.estado} → ${nuevoEstado}`
      );

      // Recargar tareas para ver el cambio
      setTimeout(cargarTareas, 1000);
    } catch (error: any) {
      setMessage(`Error cambiando estado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Prueba de Actualización de Tareas
      </h2>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={cargarTareas}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar Tareas"}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : message.includes("❌")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message}
          </div>
        )}

        {tareas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Tareas Disponibles:</h3>
            <div className="space-y-3">
              {tareas.map((tarea) => (
                <div
                  key={tarea.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">ID: {tarea.id}</h4>
                      <p className="text-sm text-gray-600">
                        Título: {tarea.titulo}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estado: {tarea.estado}
                      </p>
                      <p className="text-sm text-gray-600">
                        Responsable: {tarea.responsable}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => probarActualizacion(tarea)}
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => probarCambioEstado(tarea)}
                        disabled={loading}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                      >
                        Cambiar Estado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tareas.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            No hay tareas disponibles. Haz clic en "Cargar Tareas" para
            comenzar.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUpdate;
