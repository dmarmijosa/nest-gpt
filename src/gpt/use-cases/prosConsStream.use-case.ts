import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;
  return openai.chat.completions.create({
    stream: true,
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,\n' +
          'la respuesta debe de ser en formato markdown, solo debes responder directamente sin un mensaje adicional, los titulos deben ser un poco mas grandes\n' +
          'los pros y contras deben de estar en una lista,',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
};
