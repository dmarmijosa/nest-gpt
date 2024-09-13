import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as cron from 'node-cron';
import {
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  translateUseCase,
  textToAudioUseCase,
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationsDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  // solo va  a llamar casos de usos
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor() {
    cron.schedule('0 0 */15 * *', () => {
      console.log('Ejecutando eliminación de archivos temporales 15 días');
      this.deleteOldFiles('./generated/audios/');
      this.deleteOldFiles('./generated/images/');
      this.deleteOldFiles('./generated/uploads/');
    });
  }

  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, translateDto);
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePatch = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );
    const wasFound = fs.existsSync(filePatch);
    if (!wasFound) throw new NotFoundException(`File ${filePatch} not found`);
    return filePatch;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  getGenerationImage(filename: string) {
    const filePatch = path.resolve('./', './generated/images/', filename);
    const exist = fs.existsSync(filePatch);
    if (!exist) throw new NotFoundException(`File not found`);
    return filePatch;
  }

  async generateImageVariation({ baseImage }: ImageVariationsDto) {
    return imageVariationUseCase(this.openai, { baseImage });
  }

  private deleteOldFiles(directory: string) {
    const oneDayInMillis = 15 * 24 * 60 * 60 * 1000; // 1 minuto para pruebas
    const now = Date.now();

    if (!fs.existsSync(directory)) {
      console.error(`El directorio ${directory} no existe`);
      return;
    }

    console.log(`Leyendo archivos en ${directory}`);

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error(`Error leyendo directorio ${directory}:`, err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(directory, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error obteniendo stats del archivo ${file}:`, err);
            return;
          }

          const ageInMillis = now - stats.mtime.getTime();
          console.log(`Archivo: ${file}, Edad: ${ageInMillis}ms`);

          if (ageInMillis > oneDayInMillis) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error eliminando archivo ${file}:`, err);
              } else {
                console.log(`Archivo ${file} eliminado con éxito.`);
              }
            });
          } else {
            console.log(`El archivo ${file} es reciente, no será eliminado.`);
          }
        });
      });
    });
  }

}
