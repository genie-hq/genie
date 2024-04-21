import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateTestFile } from '../helpers';
import { cookies } from 'next/headers';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
export const preferredRegion = 'sin1';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  return generateTestFile(messages);
}
