import { Module } from '@nestjs/common';
import { LexioAssistantService } from './lexio-assistant.service';
import { LexioAssistantController } from './lexio-assistant.controller';

@Module({
  controllers: [LexioAssistantController],
  providers: [LexioAssistantService],
})
export class LexioAssistantModule {}
