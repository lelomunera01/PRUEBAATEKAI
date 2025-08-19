import React, { useState } from "react";
import { Tarea, EstadoTarea } from "../types";
import {
  Edit,
  Trash2,
  Calendar,
  User,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { logger } from "../utils/logger";

interface TareaCardProps {
  tarea: Tarea;
  onEdit: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  onEstadoChange: (id: number, nuevoEstado: EstadoTarea) => void;
  isUpdating?: boolean;
}

const TareaCard: React.FC<TareaCardProps> = ({
  tarea,
  onEdit,
  onDelete,
  onEstadoChange,
  isUpdating = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleEstadoChange = (nuevoEstado: EstadoTarea) => {
    onEstadoChange(tarea.id!, nuevoEstado);
    setShowMenu(false);
  };

  const getEstadoColor = (estado: EstadoTarea) => {
    const colores = {
      CREADA: "bg-blue-100 text-blue-800",
      EN_PROGRESO: "bg-yellow-100 text-yellow-800",
      BLOQUEADA: "bg-red-100 text-red-800",
      FINALIZADA: "bg-green-100 text-green-800",
      CANCELADA: "bg-gray-100 text-gray-800",
    };
    return colores[estado];
  };

  const getEstadoDisplayName = (estado: EstadoTarea) => {
    const nombres = {
      CREADA: "Creada",
      EN_PROGRESO: "En progreso",
      BLOQUEADA: "Bloqueada",
      FINALIZADA: "Finalizada",
      CANCELADA: "Cancelada",
    };
    return nombres[estado];
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "dd MMM yyyy", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow relative ${
        isUpdating ? "opacity-75" : ""
      }`}
    >
      {/* Indicador de carga */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <Loader2 size={20} className="animate-spin text-blue-600" />
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
          {tarea.titulo}
        </h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isUpdating}
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => onEdit(tarea)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  <Edit size={14} className="mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(tarea.id!)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  disabled={isUpdating}
                >
                  <Trash2 size={14} className="mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {tarea.descripcion}
      </p>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <User size={12} className="mr-1" />
          {tarea.responsable}
        </div>

        {tarea.fechaCreacion && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            {formatFecha(tarea.fechaCreacion)}
          </div>
        )}
      </div>

      <div className="mt-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
            tarea.estado
          )}`}
        >
          {getEstadoDisplayName(tarea.estado)}
        </span>
      </div>

      {/* Menú de cambio de estado */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Cambiar Estado
            </div>
            {(
              [
                "CREADA",
                "EN_PROGRESO",
                "BLOQUEADA",
                "FINALIZADA",
                "CANCELADA",
              ] as EstadoTarea[]
            ).map((estado) => (
              <button
                key={estado}
                onClick={() => handleEstadoChange(estado)}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                  estado === tarea.estado
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
              >
                {getEstadoDisplayName(estado)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TareaCard;
