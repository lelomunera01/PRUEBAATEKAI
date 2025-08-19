import React, { useState, useEffect } from "react";
import { Tarea, EstadoTarea } from "../types";
import { X, Save, User, FileText, Tag } from "lucide-react";
import { useResponsables } from "../hooks/useResponsables";

interface ModalTareaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarea: Omit<Tarea, "id" | "fechaCreacion">) => void;
  tarea?: Tarea | null;
  modo: "crear" | "editar";
}

const ModalTarea: React.FC<ModalTareaProps> = ({
  isOpen,
  onClose,
  onSave,
  tarea,
  modo,
}) => {
  const { responsables, loading: responsablesLoading } = useResponsables();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "CREADA" as EstadoTarea,
    responsable: "",
  });

  useEffect(() => {
    if (tarea && modo === "editar") {
      setFormData({
        titulo: tarea.titulo || "",
        descripcion: tarea.descripcion || "",
        estado: tarea.estado || "CREADA",
        responsable: tarea.responsable || "",
      });
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        estado: "CREADA",
        responsable: "",
      });
    }
  }, [tarea, modo, responsables]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.titulo.trim() && formData.responsable.trim()) {
      onSave(formData);
      onClose();
    } else {
      alert("Por favor completa todos los campos requeridos");
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {modo === "crear" ? "Nueva Tarea" : "Editar Tarea"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Debug info */}
        {modo === "editar" && tarea && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-200">
            <p className="text-xs text-blue-600">
              Editando tarea ID: {tarea.id}
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el título de la tarea"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese la descripción de la tarea"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => handleInputChange("estado", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CREADA">Creada</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="BLOQUEADA">Bloqueada</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.responsable}
              onChange={(e) => handleInputChange("responsable", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={responsablesLoading}
            >
              <option value="">
                {responsablesLoading
                  ? "Cargando responsables..."
                  : "Seleccione un responsable"}
              </option>
              {responsables.map((responsable) => (
                <option key={responsable.id} value={responsable.nombre}>
                  {responsable.nombre}
                </option>
              ))}
            </select>
            {responsablesLoading && (
              <p className="text-xs text-gray-500 mt-1">
                Cargando lista de responsables...
              </p>
            )}
          </div>
        </form>

        {/* Botones de acción */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Save size={16} className="mr-2" />
            {modo === "crear" ? "Crear" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTarea;
