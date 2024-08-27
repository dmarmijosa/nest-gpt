import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'node:fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openAi: OpenAI, { prompt, voice }) => {

  const voices = {
    nova: 'nova',
    alloy: 'alloy',
  };

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getDate()}.mp3`);
  fs.mkdirSync(folderPath, { recursive: true });

  const selectVoice = voices[voice] ?? 'nova';
  return {
    prompt: prompt,
    selectVoice: selectVoice,
  };
};
