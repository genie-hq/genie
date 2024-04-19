import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export async function getCurrentSupabaseUser() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUser() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, display_name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.log(error);
    notFound();
  }

  return { ...data, email: user.email };
}
