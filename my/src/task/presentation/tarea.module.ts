import { Module } from '@nestjs/common';
import { TareaController } from './controllers/tarea.controller';
import { TareaService } from '../aplication/services/tarea.service';
import { TareaRepository } from 'src/task/infrastructure/repositories/tarea.repository';
import { TareaMapper } from 'src/task/infrastructure/mappers/tarea.mapper';
import { PrismaModule } from '../../prisma/prisma.module';
import { CrearTareaUseCase } from '../aplication/usescases/crear-tarea.use-case';
import { CambiarEstadoUseCase } from '../aplication/usescases/cambiar-estado.use-case';
import { ObtenerTareaUseCase } from '../aplication/usescases/obtener-tarea.use-case';
import { ObtenerBloqueadasUseCase } from '../aplication/usescases/obtener-bloqueadas.use-case';
import { ObtenerEstadisticasUseCase } from '../aplication/usescases/obtener-estadisticas.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [TareaController],
  providers: [
    TareaService,
    TareaRepository,
    TareaMapper,
    CrearTareaUseCase,
    CambiarEstadoUseCase,
    ObtenerTareaUseCase,
    ObtenerBloqueadasUseCase,
    ObtenerEstadisticasUseCase,
    {
      provide: 'TareaRepositoryInterface',
      useClass: TareaRepository,
    },
  ],
  exports: [TareaService],
})
export class TareaModule {}
