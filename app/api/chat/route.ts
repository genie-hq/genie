import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
export const buildGoogleGenAIPrompt = (
  messages: Message[]
) => ({
  contents: messages
    .filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = "Create 5 test cases in TypeScript using vitest based on the following requirements. Provide the full file.";
  
  // Map messages to concatenate each message's content with the system prompt
  const messagesWithPrompt = messages.map((message: any) => ({
    role: message.role,
    content: `${systemPrompt}\n${message.content}`
  }));

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(
      buildGoogleGenAIPrompt(messagesWithPrompt)
    );

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}

export async function regenerateTestFile(
  prevUserPrompt: string,
  previousTestFile: string,
  failureErrors: string
) {
  const systemPrompt = "Create 5 different test cases in TypeScript using vitest based on the requirements for test cases, the previous test file, and the errors we encountered in the previous version. Provide the full file.";
  const finalMsg = `${systemPrompt}\n//These were the requirements for the test cases.\n${prevUserPrompt}\n//This was the previous test file.\n${previousTestFile}\nThese were the errors we encountered in the previous test file:${failureErrors}`;
  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(
      buildGoogleGenAIPrompt([
        { role: "assistant", content: finalMsg }
      ])
    );

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}
