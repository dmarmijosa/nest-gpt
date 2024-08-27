import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Te serán proveídos textos con posibles errores ortográficos y gramaticales en el idioma castellano, ' +
          'Debes de responder en formato JSON solo el formato, tu tarea es corregirlos y retornar información soluciones, hazlo de manera cortez' +
          'también debes dar un porcentaje de acierto por el usuario' +
          'Si no hay errores, debes retornar un mensaje de felicitaciones' +
          'Ejemplo de salida:' +
          '{' +
          'userScore: number, ' +
          `errors: string[], //['error->solución',` +
          'message: string // Usa emojis y texto para felicitar al usuario' +
          '}',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 150,
    response_format: {
      type: 'json_object',
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};
