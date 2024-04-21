import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createUserInstallationToken, getAccessToken } from './helpers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Extract installation ID and error details from query parameters
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const installationId = urlParams.get('installation_id');

  // Handle installation failure
  if (installationId == null) {
    return NextResponse.redirect(`https://intelligenie.vercel.app/error`);
  }

  // Retrieve the userId
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

 
  if (!user) return new Response('Unauthorized', { status: 401 });

  const userId = user.id;

  console.log("installationId in callback: ", installationId);
  console.log("userId in callback: ", userId);

  // Obtain installation access token using installation ID
  const accessToken = await getAccessToken(installationId);
  console.log(`Access token: ${accessToken.token}`);

  await createUserInstallationToken(
    supabase,
    userId,
    installationId,
    accessToken.token,
    accessToken.expires_at
  );

  // Redirect to the installation page of your GitHub app
  return NextResponse.redirect(`https://intelligenie.vercel.app/files`);
}
