import { HamburgerMenu } from '@/components/hamburger-menu';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default async function FilesLayout({ children }: LayoutProps) {
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

  return (
    <div className="h-full flex">
      <HamburgerMenu files={data} />
      <div className="w-full">{children}</div>
    </div>
  );
}
