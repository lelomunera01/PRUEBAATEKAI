import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TareaRepositoryInterface } from '../../domain/repositories/tarea.repository.interface';
import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaMapper } from '../mappers/tarea.mapper';
import { CreateTareaDto } from '../../aplication/dto/create-tarea.dto';

// Tipo para el estado de la tarea
type EstadoTarea =
  | 'CREADA'
  | 'EN_PROGRESO'
  | 'BLOQUEADA'
  | 'FINALIZADA'
  | 'CANCELADA';

@Injectable()
export class TareaRepository implements TareaRepositoryInterface {
  private tareaMapper = new TareaMapper();
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CreateTareaDto): Promise<Tarea> {
    const prismaData = this.tareaMapper.toPrismaCreateFromDto(dto);

    const prismaTarea = await this.prisma.tarea.create({
      data: prismaData,
    });
    return this.tareaMapper.fromPrismaToDomain(prismaTarea);
  }

  async obtenerPorId(id: number): Promise<Tarea | null> {
    const prismaTarea = await this.prisma.tarea.findUnique({
      where: { id },
    });

    if (!prismaTarea) {
      return null;
    }

    return this.tareaMapper.fromPrismaToDomain(prismaTarea);
  }

  async obtenerTodas(): Promise<Tarea[]> {
    const prismaTareas = await this.prisma.tarea.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });

    return this.tareaMapper.fromPrismaArrayToDomain(prismaTareas);
  }

  async obtenerPorEstado(estado: string): Promise<Tarea[]> {
    const prismaTareas = await this.prisma.tarea.findMany({
      where: { estado: estado as EstadoTarea },
      orderBy: { fechaCreacion: 'desc' },
    });

    return this.tareaMapper.fromPrismaArrayToDomain(prismaTareas);
  }

  async obtenerBloqueadas(): Promise<Tarea[]> {
    return this.obtenerPorEstado('BLOQUEADA');
  }

  async actualizar(id: number, tarea: Tarea): Promise<Tarea> {
    const prismaData = this.tareaMapper.toPrismaUpdate(tarea);

    const prismaTarea = await this.prisma.tarea.update({
      where: { id },
      data: prismaData,
    });

    return this.tareaMapper.fromPrismaToDomain(prismaTarea);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.tarea.delete({
      where: { id },
    });
  }

  async cambiarEstado(id: number, nuevoEstado: string): Promise<Tarea> {
    const prismaTarea = await this.prisma.tarea.update({
      where: { id },
      data: { estado: nuevoEstado as EstadoTarea },
    });

    return this.tareaMapper.fromPrismaToDomain(prismaTarea);
  }

  async obtenerEstadisticas(): Promise<{
    total: number;
    creadas: number;
    enProgreso: number;
    finalizadas: number;
    bloqueadas: number;
    canceladas: number;
  }> {
    const [total, creadas, enProgreso, finalizadas, bloqueadas, canceladas] =
      await Promise.all([
        this.prisma.tarea.count(),
        this.prisma.tarea.count({ where: { estado: 'CREADA' } }),
        this.prisma.tarea.count({ where: { estado: 'EN_PROGRESO' } }),
        this.prisma.tarea.count({ where: { estado: 'FINALIZADA' } }),
        this.prisma.tarea.count({ where: { estado: 'BLOQUEADA' } }),
        this.prisma.tarea.count({ where: { estado: 'CANCELADA' } }),
      ]);

    return {
      total,
      creadas,
      enProgreso,
      finalizadas,
      bloqueadas,
      canceladas,
    };
  }
}
