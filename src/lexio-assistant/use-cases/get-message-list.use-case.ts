import OpenAI from 'openai';


interface Options {
  threadId: string;
}

export const getMessageListUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { threadId } = options;
  const messageList = await openAi.beta.threads.messages.list(threadId);
  return messageList.data.map((message) => ({
    role: message.role,
    content: message.content.map((content) => (content as any).text.value),
  }));
};
