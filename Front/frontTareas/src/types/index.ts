export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  responsable: string;
  fechaCreacion?: string;
}

export type EstadoTarea = 'CREADA' | 'EN_PROGRESO' | 'BLOQUEADA' | 'FINALIZADA' | 'CANCELADA';

export interface ColumnaKanban {
  id: EstadoTarea;
  titulo: string;
  tareas: Tarea[];
}

export interface Responsable {
  id: string;
  nombre: string;
  email?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
