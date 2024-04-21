import { Suspense } from 'react';
import LoginForm from './form';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Login() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/files');

  return (
    <div className="h-full flex flex-col w-full px-2 md:px-8 items-center justify-center gap-2">
      <div className="max-w-sm">
        <h1 className="text-center text-6xl font-bold mb-1">Genie</h1>
        <p className="text-center text-7 text-gray-500 mb-4">
          Welcome to Genie, AI-powered Test Generation.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
