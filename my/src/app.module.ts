import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TareaModule } from './task/presentation/tarea.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';

@Module({
  imports: [PrismaModule, TareaModule, AiAgentModule],
})
export class AppModule {}
