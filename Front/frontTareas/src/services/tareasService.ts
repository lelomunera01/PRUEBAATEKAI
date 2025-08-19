import api from "./api";
import { Tarea } from "../types";

export const tareasService = {
  // Obtener todas las tareas
  async getTareas(): Promise<Tarea[]> {
    try {
      const response = await api.get<Tarea[]>("/tareas");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva tarea
  async createTarea(
    tarea: Omit<Tarea, "id" | "fechaCreacion">
  ): Promise<Tarea> {
    try {
      const response = await api.post<Tarea>("/tareas", tarea);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Actualizar una tarea existente
  async updateTarea(id: number, tarea: Partial<Tarea>): Promise<Tarea> {
    try {
      const response = await api.patch<Tarea>(`/tareas/${id}`, tarea);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Eliminar una tarea
  async deleteTarea(id: number): Promise<void> {
    try {
      await api.delete(`/tareas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Cambiar el estado de una tarea
  async changeEstado(id: number, nuevoEstado: Tarea["estado"]): Promise<Tarea> {
    try {
      const response = await api.patch<Tarea>(
        `/tareas/${id}/estado/${nuevoEstado}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
