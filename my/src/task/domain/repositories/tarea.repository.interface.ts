import { Tarea } from '../entities/tarea.entity';
import { CreateTareaDto } from '../../aplication/dto/create-tarea.dto';

export interface TareaRepositoryInterface {
  crear(dto: CreateTareaDto): Promise<Tarea>;
  obtenerPorId(id: number): Promise<Tarea | null>;
  obtenerTodas(): Promise<Tarea[]>;
  obtenerPorEstado(estado: string): Promise<Tarea[]>;
  obtenerBloqueadas(): Promise<Tarea[]>;
  actualizar(id: number, tarea: Tarea): Promise<Tarea>;
  eliminar(id: number): Promise<void>;
  cambiarEstado(id: number, nuevoEstado: string): Promise<Tarea>;
  obtenerEstadisticas(): Promise<{
    total: number;
    creadas: number;
    enProgreso: number;
    finalizadas: number;
    bloqueadas: number;
    canceladas: number;
  }>;
}
