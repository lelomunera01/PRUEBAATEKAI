import { Injectable, Inject } from '@nestjs/common';
import { CrearTareaUseCase } from '../usescases/crear-tarea.use-case';
import { CambiarEstadoUseCase } from '../usescases/cambiar-estado.use-case';
import { ObtenerTareaUseCase } from '../usescases/obtener-tarea.use-case';
import { ObtenerBloqueadasUseCase } from '../usescases/obtener-bloqueadas.use-case';
import { ObtenerEstadisticasUseCase } from '../usescases/obtener-estadisticas.use-case';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';
import { CreateTareaDto } from '../dto/create-tarea.dto';
import { UpdateTareaDto } from '../dto/update-tarea.dto';
import { EstadisticasTareas } from '../usescases/obtener-estadisticas.use-case';

@Injectable()
export class TareaService {
  constructor(
    private readonly crearTareaUseCase: CrearTareaUseCase,
    private readonly cambiarEstadoUseCase: CambiarEstadoUseCase,
    private readonly obtenerTareaUseCase: ObtenerTareaUseCase,
    private readonly obtenerBloqueadasUseCase: ObtenerBloqueadasUseCase,
    private readonly obtenerEstadisticasUseCase: ObtenerEstadisticasUseCase,
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async crearTarea(dto: CreateTareaDto): Promise<Tarea> {
    return await this.crearTareaUseCase.execute(dto);
  }

  async cambiarEstadoTarea(id: number, nuevoEstado: string): Promise<Tarea> {
    return await this.cambiarEstadoUseCase.execute(id, nuevoEstado);
  }

  async obtenerTareaPorId(id: number): Promise<Tarea> {
    return await this.obtenerTareaUseCase.execute(id);
  }

  async obtenerTareasBloqueadas(): Promise<Tarea[]> {
    return await this.obtenerBloqueadasUseCase.execute();
  }

  async obtenerEstadisticas(): Promise<EstadisticasTareas> {
    return await this.obtenerEstadisticasUseCase.execute();
  }

  async obtenerTodasLasTareas(): Promise<Tarea[]> {
    return await this.tareaRepository.obtenerTodas();
  }

  async obtenerTareasPorEstado(estado: string): Promise<Tarea[]> {
    return await this.tareaRepository.obtenerPorEstado(estado);
  }

  async actualizarTarea(id: number, updateDto: UpdateTareaDto): Promise<Tarea> {
    const tareaExistente = await this.obtenerTareaPorId(id);

    if (updateDto.titulo !== undefined) {
      tareaExistente.setTitulo(updateDto.titulo);
    }
    if (updateDto.descripcion !== undefined) {
      tareaExistente.setDescripcion(updateDto.descripcion);
    }
    if (updateDto.estado !== undefined) {
      tareaExistente.setEstado(updateDto.estado);
    }
    if (updateDto.responsable !== undefined) {
      tareaExistente.setResponsable(updateDto.responsable);
    }

    return await this.tareaRepository.actualizar(id, tareaExistente);
  }

  async eliminarTarea(id: number): Promise<void> {
    await this.obtenerTareaPorId(id);
    await this.tareaRepository.eliminar(id);
  }

  async obtenerTareasPorResponsable(responsable: string): Promise<Tarea[]> {
    const todasLasTareas = await this.obtenerTodasLasTareas();
    return todasLasTareas.filter((tarea) =>
      tarea.getResponsable().toLowerCase().includes(responsable.toLowerCase()),
    );
  }

  async obtenerTareasUrgentes(): Promise<Tarea[]> {
    const tareasEnProgreso = await this.obtenerTareasPorEstado('EN_PROGRESO');
    return tareasEnProgreso;
  }
}
