import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createUserInstallationToken, getAccessToken } from './helpers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Extract installation ID and error details from query parameters
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const installationId = urlParams.get('installation_id');

  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  // Handle installation failure
  if (installationId == null) {
    return NextResponse.redirect(
      `https://intelligenie.vercel.app/installation-failed?error=${error}&description=${errorDescription}`
    );
  }

  // Retrieve the userId
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Should we redirect to login? and come back?
  if (!user) return new Response('Unauthorized', { status: 401 });

  const userId = user.id;

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
  return NextResponse.redirect(`https://intelligenie.vercel.app/new`);
}
