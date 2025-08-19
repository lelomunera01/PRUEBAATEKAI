import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';

@Injectable()
export class ObtenerTareaUseCase {
  constructor(
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async execute(id: number): Promise<Tarea> {
    const tarea = await this.tareaRepository.obtenerPorId(id);

    if (!tarea) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return tarea;
  }
}
