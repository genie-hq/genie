import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createTestFile } from '../../helpers';
import { cookies } from 'next/headers';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
export const preferredRegion = 'sin1';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const data = await req.json();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  return createTestFile(data);
}
