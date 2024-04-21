import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { regenerateTestFile } from '../../../../helpers';
import { cookies } from 'next/headers';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
export const preferredRegion = 'sin1';
export const dynamic = 'force-dynamic';

interface Params {
  params: {
    fileId: string;
    fileVersion: string;
  };
}

export async function POST(req: Request, { params: { fileId } }: Params) {
  const { messages } = await req.json();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data, error } = await supabase
    .from('test_file_versions')
    .select('id, code, prompt')
    .eq('id', fileId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }

  const prompt = messages[messages.length - 1].content;

  return regenerateTestFile({
    fileId,
    prevPrompt: data.prompt,
    prevFile: data.code,
    newPrompt: prompt,
  });
}
