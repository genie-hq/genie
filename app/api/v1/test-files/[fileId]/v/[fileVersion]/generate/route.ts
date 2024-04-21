import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateTestFile } from '../../../../helpers';
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
  const { searchParams } = new URL(req.url);
  const fileVersionId = searchParams.get('fileVersionId');

  if (!fileVersionId)
    return new Response('fileVersionId is required', { status: 400 });

  const { messages } = await req.json();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  return generateTestFile({ messages, fileId, fileVersionId });
}
