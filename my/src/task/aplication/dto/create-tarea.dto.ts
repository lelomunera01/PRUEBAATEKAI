import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ example: 'Crear frontend', description: 'Título de la tarea' })
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'Diseñar la interfaz Kanban',
    description: 'Descripción de la tarea',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    example: 'CREADA',
    enum: ['CREADA', 'EN_PROGRESO', 'BLOQUEADA', 'FINALIZADA', 'CANCELADA'],
    description: 'Estado de la tarea',
  })
  @IsString()
  @IsIn(['CREADA', 'EN_PROGRESO', 'BLOQUEADA', 'FINALIZADA', 'CANCELADA'])
  estado: string;

  @ApiProperty({
    example: 'Laura Velez',
    description: 'Responsable de la tarea',
  })
  @IsString()
  responsable: string;
}
