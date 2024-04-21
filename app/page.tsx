import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TestFileReprompt from './test-file-reprompt';

export default async function Page() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data, error } = await supabase.from('test_files').select('*');

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  return <TestFileReprompt files={data} />;
}
