import OpenAI from 'openai';
import * as fs from 'node:fs';
interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openAI: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  console.log({ prompt, audioFile });

  return openAI.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt,
    language: 'es',
    response_format: 'verbose_json',
    // response_format: 'vtt',
  });
};
