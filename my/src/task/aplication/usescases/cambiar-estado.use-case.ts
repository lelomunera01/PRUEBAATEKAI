import { Injectable, Inject } from '@nestjs/common';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';

@Injectable()
export class CambiarEstadoUseCase {
  constructor(
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async execute(id: number, nuevoEstado: string): Promise<Tarea> {
    const estadosValidos = [
      'CREADA',
      'EN_PROGRESO',
      'FINALIZADA',
      'BLOQUEADA',
      'CANCELADA',
    ];

    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(
        `Estado '${nuevoEstado}' no es válido. Estados permitidos: ${estadosValidos.join(', ')}`,
      );
    }

    const tareaExistente = await this.tareaRepository.obtenerPorId(id);
    if (!tareaExistente) {
      throw new Error(`Tarea con ID ${id} no encontrada`);
    }
    this.validarTransicionEstado(tareaExistente.getEstado(), nuevoEstado);

    return await this.tareaRepository.cambiarEstado(id, nuevoEstado);
  }

  private validarTransicionEstado(
    estadoActual: string,
    nuevoEstado: string,
  ): void {
    const transicionesPermitidas: Record<string, string[]> = {
      CREADA: ['EN_PROGRESO', 'CANCELADA', 'BLOQUEADA'],
      EN_PROGRESO: ['FINALIZADA', 'BLOQUEADA', 'CANCELADA'],
      BLOQUEADA: ['EN_PROGRESO', 'CANCELADA'],
      FINALIZADA: ['BLOQUEADA'],
      CANCELADA: ['BLOQUEADA'],
    };

    const estadosPermitidos = transicionesPermitidas[estadoActual] || [];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar de estado '${estadoActual}' a '${nuevoEstado}'. ` +
          `Transiciones permitidas: ${estadosPermitidos.join(', ')}`,
      );
    }
  }
}
