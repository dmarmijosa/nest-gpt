import OpenAI from 'openai';
import * as process from 'node:process';

interface Options {
  threadId: string;
  assistant_id?: string;
}

export const createRunUseCase = async (openAi: OpenAI, options: Options) => {
  const { threadId, assistant_id = process.env.ASSIST_ID } = options;
  const run = await openAi.beta.threads.runs.create(threadId, {
    assistant_id: assistant_id,
  });
  console.log({ run });
  return run;
};
