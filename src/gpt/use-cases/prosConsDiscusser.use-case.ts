import OpenAI from 'openai';
import { async } from 'rxjs';
import { response } from 'express';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,\n' +
          'la respuesta debe de ser en formato markdown,\n' +
          'los pros y contras deben de estar en una lista,',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
  return response.choices[0].message;
};
