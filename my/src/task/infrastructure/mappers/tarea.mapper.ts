import { Tarea } from '../../domain/entities/tarea.entity';
import { CreateTareaDto } from '../../aplication/dto/create-tarea.dto';
import { TareaResponseDto } from '../../aplication/dto/tarea-response.dto';

export class TareaMapper {
  toRespondeDto(tarea: Tarea): TareaResponseDto {
    return {
      id: tarea.getId(),
      titulo: tarea.getTitulo(),
      descripcion: tarea.getDescripcion(),
      estado: tarea.getEstado(),
      responsable: tarea.getResponsable(),
      fechaCreacion: tarea.getFechaCreacion(),
    };
  }

  fromPrismaToDomain(prismaModel: any): Tarea {
    return new Tarea(
      prismaModel.id,
      prismaModel.titulo,
      prismaModel.descripcion || '',
      prismaModel.estado,
      prismaModel.responsable,
      prismaModel.fechaCreacion,
    );
  }

  toPrismaCreate(tarea: Tarea): any {
    return {
      id: tarea.getId(),
      titulo: tarea.getTitulo(),
      descripcion: tarea.getDescripcion(),
      estado: tarea.getEstado(),
      responsable: tarea.getResponsable(),
      fechaCreacion: tarea.getFechaCreacion(),
    };
  }

  toPrismaCreateFromDto(tareaData: CreateTareaDto): any {
    return {
      titulo: tareaData.titulo,
      descripcion: tareaData.descripcion,
      estado: tareaData.estado,
      responsable: tareaData.responsable,
    };
  }

  toPrismaUpdate(tarea: Tarea): any {
    return {
      titulo: tarea.getTitulo(),
      descripcion: tarea.getDescripcion(),
      estado: tarea.getEstado(),
      responsable: tarea.getResponsable(),
    };
  }

  fromPrismaArrayToDomain(prismaModels: any[]): Tarea[] {
    return prismaModels.map((model) => this.fromPrismaToDomain(model));
  }

  fromDomainToDtosArray(tareas: Tarea[]): TareaResponseDto[] {
    return tareas.map((model) => this.toRespondeDto(model));
  }
}
