import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from '../../helpers';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;
  if (!originalImage || !maskImage) {
    const response = await openAi.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt},la imagen debe ser lo mas realista posible y alta definición`,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    //TODO: guardar imagen en FS
    const filaname = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${filaname}`;
    return {
      url: url,
      localPath: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openAi.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
  });

  const localImagePath = await downloadImageAsPng(response.data[0].url);
  const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${localImagePath}`;
  return {
    url: publicUrl,
    localPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
