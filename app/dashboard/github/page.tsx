import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import GithubForm from './form';
import { createAdminClient } from '@/utils/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import NotWhitelisted from './not-whitelisted';

export default async function GithubPage() {
  const sbAdmin = createAdminClient();
  if (!sbAdmin) notFound();

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?nextUrl=/dashboard/github');

  const { error } = await sbAdmin
    .from('whitelisted_emails')
    .select('email')
    .eq('email', user?.email)
    .single();

  if (error) return <NotWhitelisted />;
  return <GithubForm />;
}
