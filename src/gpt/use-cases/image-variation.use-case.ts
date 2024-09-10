import OpenAI from 'openai';
import { downloadImageAsPng } from '../../helpers';
import * as fs from 'node:fs';
import * as process from 'node:process';


interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openAi: OpenAI,
  { baseImage }: Options,
) => {
  const image = await downloadImageAsPng(baseImage, true);
  const response = await openAi.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(image),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });
  const localImage = await downloadImageAsPng(response.data[0].url, false);
  const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${localImage}`;
  return {
    url: publicUrl,
    localPath: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
