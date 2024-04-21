import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Extract installation ID and error details from query parameters
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  console.log('urlParams', urlParams);
  const installationId = urlParams.get('installation_id');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  // Retrieve the userId
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const userId = user.id;

  // Handle installation failure
  if (installationId == null) {
    if (error) {
      console.error(`Installation failed: ${error} - ${errorDescription}`);
      // Redirect to a more informative error page
      return NextResponse.redirect(
        `https://intelligenie.vercel.app/installation-failed?error=${error}&description=${errorDescription}`
      );
    } else {
      // Generic redirect if no specific error information is available
      return NextResponse.redirect(
        `https://intelligenie.vercel.app/installation-failed`
      );
    }
  }
  // Obtain installation access token using installation ID
  const accessToken = await getAccessToken(installationId);

  await updateUserInstallationToken(userId, installationId, accessToken);

  // Redirect to the installation page of your GitHub app
  return NextResponse.redirect(`https://intelligenie.vercel.app/new`);
}

async function getAccessToken(installationId: string) {
  // Ensure your installation ID is a number
  const idNumber = parseInt(installationId, 10);
  if (isNaN(idNumber)) {
    throw new Error('Installation ID must be a number.');
  }

  // Initialize Octokit with app authentication
  const auth = createAppAuth({
    appId: process.env.BOT_APP_ID || '', // Corrected to BOT_APP_ID
    privateKey: process.env.BOT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '', // Ensure newlines are properly formatted
    installationId: idNumber,
  });

  // Retrieve the installation access token
  const installationAccessToken = await auth({ type: 'installation' });
  return installationAccessToken.token;
}

// TODO: Store it in db
async function updateUserInstallationToken(
  userId: String,
  installationId: String,
  accessToken: String
) {
  // Implement logic to store installation ID & accessToken in Supabase users table
}
