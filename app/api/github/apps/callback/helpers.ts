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

export async function createUserInstallationToken(
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
