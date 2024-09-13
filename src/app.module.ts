import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { LexioAssistantModule } from './lexio-assistant/lexio-assistant.module';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
@Module({
  imports: [ConfigModule.forRoot(), GptModule, LexioAssistantModule],
})
export class AppModule {}
