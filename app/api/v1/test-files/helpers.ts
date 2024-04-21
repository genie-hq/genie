// convert messages from the Vercel AI SDK Format to the format
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';

const HUMAN_PROMPT = '\n\nHuman:';
const AI_PROMPT = '\n\nAssistant:';

const DEFAULT_MODEL_NAME = 'gemini-1.0-pro-latest';
const API_KEY = process.env.GOOGLE_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

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

export async function createTestFile(data: {
  name: string;
  github_username: string;
  repository: string;
  branch: string;
  target_branch: string;
  test_library: string;
  test_framework: string;
  file_path: string;
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data: file, error } = await supabase
    .from('test_files')
    .insert(data)
    .select('id')
    .single();

  if (error) return NextResponse.json(error.message, { status: 500 });
  return NextResponse.json({ id: file.id }, { status: 200 });
}

export async function generateTestFile({
  messages,
  fileId,
  fileVersionId,
}: {
  messages: Message[];
  fileId: string;
  fileVersionId: string;
}) {
  // Map messages to concatenate each message's content with the system prompt
  const promtedMessages: Message[] = [
    ...messages,
    {
      id: 'assistant',
      role: 'assistant',
      content:
        'I will create test cases in TypeScript using Vitest based on your requirements and provide the full file without saying anything else.',
    },
    {
      id: 'user',
      role: 'user',
      content: 'Yes, please.',
    },
  ];

  const geminiStream = await genAI
    .getGenerativeModel({
      model: DEFAULT_MODEL_NAME,
      generationConfig,
      safetySettings,
    })
    .generateContentStream(buildGoogleGenAIPrompt(promtedMessages));

  const supabase = createRouteHandlerClient({
    cookies,
  });

  const stream = GoogleGenerativeAIStream(geminiStream, {
    onCompletion: async (completion) => {
      const { error } = await supabase
        .from('test_file_versions')
        .update({ code: completion })
        .eq('test_file_id', fileId)
        .eq('id', fileVersionId)
        .single();

      if (error) {
        console.error(error);
      }
    },
  });

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
    .getGenerativeModel({
      model: DEFAULT_MODEL_NAME,
      generationConfig,
      safetySettings,
    })
    .generateContentStream(
      buildGoogleGenAIPrompt([
        { id: 'system', role: 'system', content: systemPrompt },
      ])
    );

  const stream = GoogleGenerativeAIStream(geminiStream);

  return new StreamingTextResponse(stream);
}

const leadingMessages: Message[] = [
  {
    id: 'initial-message',
    role: 'assistant',
    content:
      'Please provide an initial message so I can generate a short and comprehensive title for this chat conversation. My next message will contain nothing but the title in a raw text format (No JSON, no HTML, no Markdown).',
  },
];

const trailingMessages: Message[] = [
  {
    id: 'final-message',
    role: 'assistant',
    content:
      'I have generated a title for this chat conversation. The title is as follows:',
  },
];

const normalize = (message: Message) => {
  const { content, role } = message;
  if (role === 'user') return `${HUMAN_PROMPT} ${content}`;
  if (role === 'assistant') return `${AI_PROMPT} ${content}`;
  return content;
};

const normalizeMessages = (messages: Message[]) =>
  [...leadingMessages, ...messages, ...trailingMessages]
    .map(normalize)
    .join('')
    .trim();
