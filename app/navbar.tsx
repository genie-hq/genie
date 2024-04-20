import Link from 'next/link';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LogoTitle from './logo-title';
import { Suspense } from 'react';
import NavbarSeparator from './navbar-separator';
import LoginButton from './login-button';

export default async function Navbar() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user: sbUser },
  } = await supabase.auth.getUser();

  return (
    <div id="navbar" className="fixed inset-x-0 top-0 z-50">
      <div className="bg-background p-4 font-semibold">
        <div className="relative flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex flex-none items-center gap-2">
              <LogoTitle />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <div className="bg-foreground/5 h-10 w-32 animate-pulse rounded-lg" />
              }
            >
              {sbUser ? (
                <UserNav />
              ) : (
                <>
                  <LoginButton />
                  <ThemeToggle />
                </>
              )}
            </Suspense>
          </div>
        </div>
      </div>
      <NavbarSeparator />
    </div>
  );
}
