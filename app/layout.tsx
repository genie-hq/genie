import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Navbar from './navbar';
import NavbarPadding from './navbar-padding';
import { Providers } from '@/components/providers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:6868';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Genie | AI-powered testing',
  description: 'Test your product with AI-generated test cases, effortlessly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <VercelAnalytics />
        <Providers
          attribute="class"
          defaultTheme="dark"
          themes={['system', 'light', 'dark']}
          enableColorScheme={false}
          enableSystem
        >
          <Navbar />
          <NavbarPadding>{children}</NavbarPadding>
        </Providers>
      </body>
    </html>
  );
}
