import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

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

export async function getAccessToken(installationId: string) {
  const jwtToken = generateJWT();

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return data;
}

function generateJWT() {
  const appId = process.env.BOT_APP_ID || '';
  const privateKey = process.env.BOT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

  const jwt = require('jsonwebtoken');

  const payload = {
    iat: Math.floor(Date.now() / 1000), // Issued at time
    exp: Math.floor(Date.now() / 1000) + 60, // Expiration time (1 minute from now)
    iss: appId,
  };

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  return token;
}

async function createUserInstallationToken(
  supabase: any,
  userId: string,
  installationId: string,
  accessToken: string,
  expiresAt: string
) {
  try {
    const { data, error } = await supabase
      .from('user_installation_info')
      .insert({
        user_id: userId,
        installation_id: installationId,
        access_token: accessToken,
        expires_at: expiresAt,
      });

    if (error) {
      throw new Error(
        `Failed to update user installation info: ${error.message}`
      );
    }

    console.log('User installation info updated successfully.');
    return;
  } catch (error) {
    console.error('Error updating user installation info:', error);
    throw error;
  }
}
