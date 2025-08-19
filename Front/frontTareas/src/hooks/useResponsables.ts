import { useState, useEffect } from "react";
import { Responsable } from "../types";

// Lista predefinida de responsables (en un proyecto real vendría de la API)
const RESPONSABLES_PREDEFINIDOS: Responsable[] = [
  { id: "1", nombre: "Juan Henao", email: "juan.henao@empresa.com" },
  { id: "2", nombre: "María García", email: "maria.garcia@empresa.com" },
  { id: "3", nombre: "Carlos López", email: "carlos.lopez@empresa.com" },
  { id: "4", nombre: "Ana Martínez", email: "ana.martinez@empresa.com" },
  { id: "5", nombre: "Luis Rodríguez", email: "luis.rodriguez@empresa.com" },
];

export const useResponsables = () => {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarResponsables = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular carga desde API
        await new Promise((resolve) => setTimeout(resolve, 500));

        setResponsables(RESPONSABLES_PREDEFINIDOS);
      } catch (err) {
        setError("Error al cargar responsables");
        // Fallback a lista predefinida
        setResponsables(RESPONSABLES_PREDEFINIDOS);
      } finally {
        setLoading(false);
      }
    };

    cargarResponsables();
  }, []);

  const addResponsable = (responsable: Omit<Responsable, "id">) => {
    const nuevoResponsable: Responsable = {
      ...responsable,
      id: Date.now().toString(),
    };
    setResponsables((prev) => [...prev, nuevoResponsable]);
  };

  const getResponsableById = (id: string): Responsable | undefined => {
    return responsables.find((r) => r.id === id);
  };

  const getResponsableByNombre = (nombre: string): Responsable | undefined => {
    return responsables.find((r) => r.nombre === nombre);
  };

  const isResponsableValido = (nombre: string): boolean => {
    return responsables.some((r) => r.nombre === nombre);
  };

  return {
    responsables,
    loading,
    error,
    addResponsable,
    getResponsableById,
    getResponsableByNombre,
    isResponsableValido,
  };
};
