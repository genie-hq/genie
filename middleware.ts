import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/auth-helpers-nextjs';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { res, user: _ } = await handleSupabaseAuth({ req });
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - media (media files)
     * - favicon.ico (favicon file)
     * - favicon-16x16.png (favicon file)
     * - favicon-32x32.png (favicon file)
     * - apple-touch-icon.png (favicon file)
     * - android-chrome-192x192.png (favicon file)
     * - android-chrome-512x512.png (favicon file)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     * - site.webmanifest (SEO)
     * - monitoring (analytics)
     */

    '/((?!api|_next/static|_next/image|media|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|robots.txt|sitemap.xml|site.webmanifest|monitoring).*)',
  ],
};

const handleSupabaseAuth = async ({
  req,
}: {
  req: NextRequest;
}): Promise<{
  res: NextResponse;
  user: User | null;
}> => {
  // Create a NextResponse object to handle the response
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { res, user };
};
