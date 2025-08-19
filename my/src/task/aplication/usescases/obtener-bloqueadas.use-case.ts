import { Injectable, Inject } from '@nestjs/common';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';

@Injectable()
export class ObtenerBloqueadasUseCase {
  constructor(
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async execute(): Promise<Tarea[]> {
    const tareasBloqueadas = await this.tareaRepository.obtenerBloqueadas();
    return tareasBloqueadas;
  }
}
