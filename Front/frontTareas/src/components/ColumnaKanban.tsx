import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ColumnaKanban as ColumnaKanbanType,
  Tarea,
  EstadoTarea,
} from "../types";
import TareaCard from "./TareaCard";
import { Plus } from "lucide-react";

interface ColumnaKanbanProps {
  columna: ColumnaKanbanType;
  onEditTarea: (tarea: Tarea) => void;
  onDeleteTarea: (id: number) => void;
  onEstadoChange: (id: number, nuevoEstado: EstadoTarea) => void;
  onAddTarea: (estado: EstadoTarea) => void;
  index: number;
  updatingTareas?: number[]; // IDs de tareas que se están actualizando
}

const ColumnaKanban: React.FC<ColumnaKanbanProps> = ({
  columna,
  onEditTarea,
  onDeleteTarea,
  onEstadoChange,
  onAddTarea,
  index,
  updatingTareas = [],
}) => {
  const getColumnaColor = (estado: EstadoTarea) => {
    const colores = {
      CREADA: "border-blue-200 bg-blue-50",
      EN_PROGRESO: "border-yellow-200 bg-yellow-50",
      BLOQUEADA: "border-red-200 bg-red-50",
      FINALIZADA: "border-green-200 bg-green-50",
      CANCELADA: "border-gray-200 bg-gray-50",
    };
    return colores[estado];
  };

  const getColumnaHeaderColor = (estado: EstadoTarea) => {
    const colores = {
      CREADA: "bg-blue-500",
      EN_PROGRESO: "bg-yellow-500",
      BLOQUEADA: "bg-red-500",
      FINALIZADA: "bg-green-500",
      CANCELADA: "bg-gray-500",
    };
    return colores[estado];
  };

  return (
    <div
      className={`flex-shrink-0 w-80 border rounded-lg ${getColumnaColor(
        columna.id
      )}`}
    >
      <div className={`p-4 ${getColumnaHeaderColor(columna.id)} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">{columna.titulo}</h2>
          <span className="bg-white bg-opacity-20 text-white text-sm px-2 py-1 rounded-full">
            {columna.tareas.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={columna.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-4 min-h-[200px]"
          >
            <div className="space-y-3">
              {columna.tareas.map((tarea, tareaIndex) => (
                <Draggable
                  key={tarea.id}
                  draggableId={tarea.id?.toString() || ""}
                  index={tareaIndex}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "opacity-75" : ""}
                    >
                      <TareaCard
                        tarea={tarea}
                        onEdit={onEditTarea}
                        onDelete={onDeleteTarea}
                        onEstadoChange={onEstadoChange}
                        isUpdating={updatingTareas.includes(tarea.id!)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            <button
              onClick={() => onAddTarea(columna.id)}
              className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Agregar Tarea
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ColumnaKanban;
