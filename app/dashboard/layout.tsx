import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full p-4 md:px-8 lg:px-16 xl:px-32">
      <div className="flex gap-2 items-center mb-4">
        <Link href="/dashboard">
          <Button className="rounded-full">Dashboard</Button>
        </Link>
        <Button className="rounded-full" disabled>
          Test Files
        </Button>
        <Button className="rounded-full" disabled>
          Test Cases
        </Button>
        <Link href="/dashboard/github">
          <Button className="rounded-full">GitHub</Button>
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
