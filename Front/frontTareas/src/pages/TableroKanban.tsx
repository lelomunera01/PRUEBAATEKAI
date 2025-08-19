import React, { useState, useMemo } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Tarea,
  EstadoTarea,
  ColumnaKanban as ColumnaKanbanType,
} from "../types";
import { useTareas } from "../context/TareasContext";
import ColumnaKanban from "../components/ColumnaKanban";
import ModalTarea from "../components/ModalTarea";
import TestConnection from "../components/TestConnection";
import TestUpdate from "../components/TestUpdate";
import Notification, { NotificationType } from "../components/Notification";
import ChatIA from "../components/ChatIA";

const TableroKanban: React.FC = () => {
  const {
    state,
    createTarea,
    updateTarea,
    deleteTarea,
    changeEstado,
    fetchTareas,
  } = useTareas();
  const [modalOpen, setModalOpen] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [modoModal, setModoModal] = useState<"crear" | "editar">("crear");
  const [showTestConnection, setShowTestConnection] = useState(false);
  const [showTestUpdate, setShowTestUpdate] = useState(false);
  const [updatingTareas, setUpdatingTareas] = useState<number[]>([]);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    isVisible: boolean;
  }>({
    type: "info",
    message: "",
    isVisible: false,
  });

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Definir las columnas del tablero
  const columnas: ColumnaKanbanType[] = useMemo(
    () => [
      { id: "CREADA", titulo: "Creada", tareas: [] },
      { id: "EN_PROGRESO", titulo: "En progreso", tareas: [] },
      { id: "BLOQUEADA", titulo: "Bloqueada", tareas: [] },
      { id: "FINALIZADA", titulo: "Finalizada", tareas: [] },
      { id: "CANCELADA", titulo: "Cancelada", tareas: [] },
    ],
    []
  );

  // Organizar tareas por columnas
  const columnasConTareas = useMemo(() => {
    return columnas.map((columna) => ({
      ...columna,
      tareas: state.tareas.filter((tarea) => tarea.estado === columna.id),
    }));
  }, [columnas, state.tareas]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const tarea = state.tareas.find((t) => t.id === parseInt(draggableId));
    if (!tarea) {
      return;
    }
    // Obtener el nuevo estado (columna de destino)
    const nuevoEstado = destination.droppableId as EstadoTarea;
    const estadoAnterior = tarea.estado;

    // Si el estado cambió, actualizar la tarea
    if (tarea.estado !== nuevoEstado) {
      try {
        // Agregar la tarea a la lista de actualización
        setUpdatingTareas((prev) => [...prev, tarea.id!]);
        await changeEstado(tarea.id!, nuevoEstado);

        // Recargar las tareas para asegurar sincronización
        setTimeout(() => {
          fetchTareas();
        }, 100);
      } catch (error) {
        // Recargar las tareas para mantener la sincronización
        fetchTareas();
      } finally {
        // Remover la tarea de la lista de actualización
        setUpdatingTareas((prev) => prev.filter((id) => id !== tarea.id!));
      }
    }
  };

  const handleCrearTarea = () => {
    setModoModal("crear");
    setTareaEditando(null);
    setModalOpen(true);
  };

  const handleEditarTarea = (tarea: Tarea) => {
    setModoModal("editar");
    setTareaEditando(tarea);
    setModalOpen(true);
  };

  const handleGuardarTarea = async (
    tareaData: Omit<Tarea, "id" | "fechaCreacion">
  ) => {
    try {
      if (modoModal === "crear") {
        await createTarea(tareaData);
        showNotification("success", "Tarea creada exitosamente");
      } else if (tareaEditando) {
        await updateTarea(tareaEditando.id!, tareaData);
        showNotification("success", "Tarea actualizada exitosamente");
      }
      setModalOpen(false);
    } catch (error) {
      showNotification("error", "Error al guardar la tarea");
    }
  };

  const handleEliminarTarea = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta tarea?")) {
      try {
        await deleteTarea(id);
        showNotification("success", "Tarea eliminada exitosamente");
      } catch (error) {
        showNotification("error", "Error al eliminar la tarea");
      }
    }
  };

  const handleCambiarEstado = async (id: number, nuevoEstado: EstadoTarea) => {
    try {
      await changeEstado(id, nuevoEstado);
      showNotification("success", "Estado cambiado exitosamente");
    } catch (error) {
      showNotification("error", "Error al cambiar el estado");
    }
  };

  const handleAgregarTarea = (estado: EstadoTarea) => {
    setModoModal("crear");
    setTareaEditando(null);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    fetchTareas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Tablero Kanban
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTestUpdate(!showTestUpdate)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Probar Actualización"
              >
                Test Update
              </button>
              <button
                onClick={() => setShowTestConnection(!showTestConnection)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Probar conexión"
              >
                Test API
              </button>
              <button
                onClick={handleRefresh}
                disabled={state.loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Actualizar"
              >
                <RefreshCw
                  size={20}
                  className={state.loading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={handleCrearTarea}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de prueba de actualización */}
      {showTestUpdate && <TestUpdate />}

      {/* Componente de prueba de conexión */}
      {showTestConnection && <TestConnection />}

      {/* Mensaje de error */}
      {state.error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <span className="text-red-700">{state.error}</span>
          </div>
        </div>
      )}

      {/* Tablero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {columnasConTareas.map((columna, index) => (
                <ColumnaKanban
                  key={columna.id}
                  columna={columna}
                  onEditTarea={handleEditarTarea}
                  onDeleteTarea={handleEliminarTarea}
                  onEstadoChange={handleCambiarEstado}
                  onAddTarea={handleAgregarTarea}
                  index={index}
                  updatingTareas={updatingTareas}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Componente de notificación */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Modal para crear/editar tareas */}
      <ModalTarea
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleGuardarTarea}
        tarea={tareaEditando}
        modo={modoModal}
      />
      <ChatIA />
    </div>
  );
};

export default TableroKanban;
