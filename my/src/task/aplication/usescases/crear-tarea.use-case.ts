import { Injectable, Inject } from '@nestjs/common';
import type { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';
import { CreateTareaDto } from '../dto/create-tarea.dto';

@Injectable()
export class CrearTareaUseCase {
  constructor(
    @Inject('TareaRepositoryInterface')
    private readonly tareaRepository: TareaRepositoryInterface,
  ) {}

  async execute(dto: CreateTareaDto): Promise<Tarea> {
    this.validarDatosEntrada(dto);
    return this.tareaRepository.crear(dto);
  }

  private validarDatosEntrada(dto: CreateTareaDto): void {
    if (dto.titulo.trim().length < 2) {
      throw new Error('El título de la tarea debe tener al menos 3 caracteres');
    }
    if (dto.titulo.trim().length > 100) {
      throw new Error('El título de la tarea no puede exceder 100 caracteres');
    }
    if (dto.descripcion && dto.descripcion.length > 500) {
      throw new Error(
        'La descripción de la tarea no puede exceder 500 caracteres',
      );
    }
    if (!dto.responsable || dto.responsable.trim().length < 2) {
      throw new Error(
        'El responsable de la tarea debe tener al menos 2 caracteres',
      );
    }
    if (dto.estado && !['CREADA', 'EN_PROGRESO'].includes(dto.estado)) {
      throw new Error('El estado inicial solo puede ser CREADA o EN_PROGRESO');
    }
  }
}
