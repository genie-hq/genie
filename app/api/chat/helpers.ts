// convert messages from the Vercel AI SDK Format to the format

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// that is expected by the Google GenAI SDK
export const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function generateTestFile(messages: Message[]) {
  const systemPrompt =
    'Create test cases in TypeScript using Vitest based on the requirements. Provide the full file.';

  // Map messages to concatenate each message's content with the system prompt
  const promtedMessages: Message[] = [
    ...messages,
    {
      id: 'assistant',
      role: 'assistant',
      content: systemPrompt,
    },
    {
      id: 'user',
      role: 'user',
      content: 'Yes, please.',
    },
  ];

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(buildGoogleGenAIPrompt(promtedMessages));

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}

export async function regenerateTestFile(
  prevUserPrompt: string,
  previousTestFile: string,
  failureErrors: string
) {
  const systemPrompt =
    `\n\nThese were the requirements for the test cases.\n\n${prevUserPrompt}\n\nThis was the previous test file.\n${previousTestFile}\n\nThese were the errors we encountered in the previous test file:${failureErrors}` +
    'Create 5 different test cases in TypeScript using vitest based on the requirements for test cases, the previous test file, and the errors we encountered in the previous version. Provide the full file.';

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(
      buildGoogleGenAIPrompt([
        { id: 'system', role: 'system', content: systemPrompt },
      ])
    );

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
