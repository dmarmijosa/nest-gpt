import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}

export const createMessageUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { threadId, question } = options;
  return openAi.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });
};
