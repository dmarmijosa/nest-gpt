import OpenAI from 'openai';
interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  const { prompt, lang } = options;
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
  return response.choices[0].message;
};
