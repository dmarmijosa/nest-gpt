import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextDto,
  ImageGenerationDto, ImageVariationsDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {
  }

  @Post('orthograaphy-check')
  ortographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.ortographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDTO: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDTO);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDTO: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDTO);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  translate(@Body() translateDTO: TranslateDto) {
    return this.gptService.translate(translateDTO);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDTO: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDTO);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async getTextToAudio(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100 * 1024 * 5,
            message: 'File is bigger',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getImageGeneration(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.gptService.getGenerationImage(filename);
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variations')
  async imageVariations(@Body() imageVariationDto: ImageVariationsDto) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }
}
