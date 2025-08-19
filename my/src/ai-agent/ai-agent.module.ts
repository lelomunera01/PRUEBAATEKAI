import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';

@Module({
	controllers: [AiAgentController],
})
export class AiAgentModule {}


