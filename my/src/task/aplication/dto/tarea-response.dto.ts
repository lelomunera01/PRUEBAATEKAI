import { ApiProperty } from '@nestjs/swagger';

export class TareaResponseDto {
  @ApiProperty({ example: 1, description: 'ID único de la tarea' })
  id: number;

  @ApiProperty({ example: 'Crear frontend', description: 'Título de la tarea' })
  titulo: string;

  @ApiProperty({
    example: 'Diseñar la interfaz Kanban',
    description: 'Descripción de la tarea',
    required: false,
  })
  descripcion?: string;

  @ApiProperty({
    example: 'En progreso',
    description: 'Estado actual de la tarea',
  })
  estado: string;

  @ApiProperty({
    example: 'Juan Henao',
    description: 'Responsable de la tarea',
  })
  responsable: string;

  @ApiProperty({
    example: '2025-08-14T10:00:00Z',
    description: 'Fecha de creación de la tarea',
  })
  fechaCreacion: Date;
}
