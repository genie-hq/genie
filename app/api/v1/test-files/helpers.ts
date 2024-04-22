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

export async function generateTestFileVersion({
  prompt,
  test_file_id,
}: {
  prompt: string;
  test_file_id: string;
}) {
  const supabase = createRouteHandlerClient({
    cookies,
  });

  const { data, error } = await supabase
    .from('test_file_versions')
    .insert({
      test_file_id,
      prompt,
    })
    .eq('test_file_id', test_file_id);

  if (error) {
    console.error(error);
    return NextResponse.json(error.message, { status: 500 });
  }

  return NextResponse.json({ message: 'OK' }, { status: 200 });
}

export async function regenerateTestFile({
  fileId,
  fileVersionId,
  prevPrompt,
  prevFile,
  newPrompt,
}: {
  fileId: string;
  fileVersionId: string | null;
  prevPrompt: string;
  prevFile: string;
  newPrompt: string;
}) {
  const systemPrompt = `Please re-generate your test cases that take into account my suggestion for improvement: "${newPrompt}". Provide the full test file and DO NOT provide explaination or anything else. Thank you.`;

  const geminiStream = await genAI
    .getGenerativeModel({
      model: DEFAULT_MODEL_NAME,
      generationConfig,
      safetySettings,
    })
    .generateContentStream(
      buildGoogleGenAIPrompt([
        {
          id: 'user',
          role: 'user',
          content: prevPrompt,
        },
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
        { id: 'assistant', role: 'assistant', content: prevFile },
        { id: 'user', role: 'user', content: systemPrompt },
      ] as Message[])
    );

  const supabase = createRouteHandlerClient({
    cookies,
  });

  const stream = GoogleGenerativeAIStream(geminiStream, {
    onCompletion: async (completion) => {
      const { error } = await supabase
        .from('test_file_versions')
        .upsert({
          id: fileVersionId,
          test_file_id: fileId,
          code: completion,
          prompt: newPrompt,
        })
        .eq('id', fileVersionId)
        .select('id')
        .single();

      if (error) {
        console.error(error);
      }
    },
  });

  return new StreamingTextResponse(stream);
}
