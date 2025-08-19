import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TareaService } from '../../aplication/services/tarea.service';
import { CreateTareaDto } from '../../aplication/dto/create-tarea.dto';
import { UpdateTareaDto } from '../../aplication/dto/update-tarea.dto';
import { TareaResponseDto } from '../../aplication/dto/tarea-response.dto';
import { TareaMapper } from '../../infrastructure/mappers/tarea.mapper';

@ApiTags('Tareas')
@Controller('tareas')
export class TareaController {
  private tareaMapper = new TareaMapper();

  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({
    status: 201,
    description: 'Tarea creada exitosamente',
    type: TareaResponseDto,
  })
  async crearTarea(
    @Body() createTareaDto: CreateTareaDto,
  ): Promise<TareaResponseDto> {
    const tarea = await this.tareaService.crearTarea(createTareaDto);
    return this.tareaMapper.toRespondeDto(tarea);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    type: [TareaResponseDto],
  })
  async obtenerTodasLasTareas(): Promise<TareaResponseDto[]> {
    const tareas = await this.tareaService.obtenerTodasLasTareas();
    return this.tareaMapper.fromDomainToDtosArray(tareas);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de las tareas' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  async obtenerEstadisticas() {
    return await this.tareaService.obtenerEstadisticas();
  }

  @Get('bloqueadas')
  @ApiOperation({ summary: 'Obtener tareas bloqueadas' })
  @ApiResponse({
    status: 200,
    description: 'Tareas bloqueadas obtenidas exitosamente',
    type: [TareaResponseDto],
  })
  async obtenerTareasBloqueadas(): Promise<TareaResponseDto[]> {
    const tareas = await this.tareaService.obtenerTareasBloqueadas();
    return this.tareaMapper.fromDomainToDtosArray(tareas);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener tareas por estado' })
  @ApiResponse({
    status: 200,
    description: 'Tareas por estado obtenidas exitosamente',
    type: [TareaResponseDto],
  })
  async obtenerTareasPorEstado(
    @Param('estado') estado: string,
  ): Promise<TareaResponseDto[]> {
    const tareas = await this.tareaService.obtenerTareasPorEstado(estado);
    return this.tareaMapper.fromDomainToDtosArray(tareas);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tarea obtenida exitosamente',
    type: TareaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async obtenerTarea(
    @Param('id') id: string,
  ): Promise<TareaResponseDto | null> {
    const tarea = await this.tareaService.obtenerTareaPorId(+id);
    return tarea ? this.tareaMapper.toRespondeDto(tarea) : null;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiResponse({
    status: 200,
    description: 'Tarea actualizada exitosamente',
    type: TareaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async actualizarTarea(
    @Param('id') id: string,
    @Body() updateTareaDto: UpdateTareaDto,
  ): Promise<TareaResponseDto | null> {
    const tarea = await this.tareaService.actualizarTarea(+id, updateTareaDto);
    return tarea ? this.tareaMapper.toRespondeDto(tarea) : null;
  }

  @Patch(':id/estado/:estado')
  @ApiOperation({ summary: 'Cambiar el estado de una tarea' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la tarea cambiado exitosamente',
    type: TareaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async cambiarEstadoTarea(
    @Param('id') id: string,
    @Param('estado') estado: string,
  ): Promise<TareaResponseDto | null> {
    const tarea = await this.tareaService.cambiarEstadoTarea(+id, estado);
    return tarea ? this.tareaMapper.toRespondeDto(tarea) : null;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({
    status: 204,
    description: 'Tarea eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarea no encontrada',
  })
  async eliminarTarea(@Param('id') id: string): Promise<void> {
    await this.tareaService.eliminarTarea(+id);
  }

  @Get('responsable/:responsable')
  @ApiOperation({ summary: 'Obtener tareas por responsable' })
  async obtenerTareasPorResponsable(
    @Param('responsable') responsable: string,
  ): Promise<TareaResponseDto[]> {
    const tareas =
      await this.tareaService.obtenerTareasPorResponsable(responsable);
    return this.tareaMapper.fromDomainToDtosArray(tareas);
  }
}
