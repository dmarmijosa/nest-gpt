import OpenAI from 'openai';

export const createThreadUseCase = async (openAi: OpenAI) => {
  const { id } = await openAi.beta.threads.create();
  return { id };
};
