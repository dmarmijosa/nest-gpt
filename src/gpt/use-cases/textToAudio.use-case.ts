import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openAi: OpenAI, { prompt, voice }) => {
  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoices = voices[voice] ?? 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);
  fs.mkdirSync(folderPath, { recursive: true });

  deleteOldFiles(folderPath, 15);
  const mp3 = await openAi.audio.speech.create({
    model: 'tts-1-hd',
    voice: selectedVoices,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};

const deleteOldFiles = (folderPath, days) => {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000); // Fecha límite

  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.mtime < cutoffDate) {
      fs.unlinkSync(filePath); // Elimina el archivo
      console.log(`Archivo eliminado: ${filePath}`);
    }
  });
};
