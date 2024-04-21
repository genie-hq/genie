import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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

export async function PATCH(req: Request, { params: { fileId } }: Params) {
  const { path } = await req.json();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  const { error } = await supabase
    .from('test_files')
    .update({
      file_path: path,
    })
    .eq('id', fileId)
    .single();

  if (error) return new Response('An error occurred', { status: 500 });
  return new Response('OK', { status: 200 });
}
