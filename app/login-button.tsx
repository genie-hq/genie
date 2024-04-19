'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LoginButton() {
  const pathname = usePathname();
  const hidden = pathname === '/login';

  return (
    <Link
      href={`/login${
        pathname !== '/' ? `?nextUrl=${encodeURIComponent(pathname)}` : ''
      }`}
      className={hidden ? 'hidden' : ''}
    >
      <Button disabled={hidden}>Login</Button>
    </Link>
  );
}
