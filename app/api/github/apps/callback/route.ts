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
  const installationId = urlParams.get('installation_id');

  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  // Retrieve the userId
  // const supabase = createRouteHandlerClient({ cookies });

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) return new Response('Unauthorized', { status: 401 });

  // const userId = user.id;

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
  console.log(`Access token: ${accessToken}`);
  // await updateUserInstallationToken(userId, installationId, accessToken);

  // Redirect to the installation page of your GitHub app
  return NextResponse.redirect(`https://intelligenie.vercel.app/new`);
}

async function getAccessToken(installationId: string) {
  const jwtToken = generateJWT();

  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data.token; 
}

function generateJWT() {
  // Replace these values with your GitHub App's details
  const appId = process.env.BOT_APP_ID || '';
  const privateKey = process.env.BOT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

  const jwt = require('jsonwebtoken');

  const payload = {
    iat: Math.floor(Date.now() / 1000), // Issued at time
    exp: Math.floor(Date.now() / 1000) + 60, // Expiration time (1 minute from now)
    iss: appId, // GitHub App ID
  };

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  return token;
}


// TODO: Store it in db
async function updateUserInstallationToken(
  userId: String,
  installationId: String,
  accessToken: String
) {
  // Implement logic to store installation ID & accessToken in Supabase users table
}
