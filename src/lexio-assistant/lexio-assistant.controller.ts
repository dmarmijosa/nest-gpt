import { Body, Controller, Post } from '@nestjs/common';
import { LexioAssistantService } from './lexio-assistant.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('lexio')
export class LexioAssistantController {
  constructor(private readonly lexioAssistantService: LexioAssistantService) {
  }

  @Post('create-thred')
  async createThread() {
    return this.lexioAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto,
  ) {
    return this.lexioAssistantService.userQuestions(questionDto);
  }
}
