import { Injectable, Inject } from '@nestjs/common';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';

export interface EstadisticasTareas {
  total: number;
  creadas: number;
  enProgreso: number;
  finalizadas: number;
  bloqueadas: number;
  canceladas: number;
  porcentajeCompletado: number;
  porcentajeBloqueadas: number;
}

@Injectable()
export class ObtenerEstadisticasUseCase {
  constructor(
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async execute(): Promise<EstadisticasTareas> {
    const estadisticas = await this.tareaRepository.obtenerEstadisticas();

    // Calcular porcentajes
    const porcentajeCompletado =
      estadisticas.total > 0
        ? Math.round((estadisticas.finalizadas / estadisticas.total) * 100)
        : 0;

    const porcentajeBloqueadas =
      estadisticas.total > 0
        ? Math.round((estadisticas.bloqueadas / estadisticas.total) * 100)
        : 0;

    return {
      ...estadisticas,
      porcentajeCompletado,
      porcentajeBloqueadas,
    };
  }
}
