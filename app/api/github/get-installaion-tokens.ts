import { getAccessToken } from './apps/callback/route';

export async function getInstallationTokens({
  supabase: supabase,
}: {
  supabase: any;
}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new Response('Unauthorized', { status: 401 });

    const userId = user.id;

    const { data, error } = await supabase
      .from('user_installation_info')
      .select('id', 'access_token, expires_at', 'installation_id')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(
        `Failed to fetch user installation info: ${error.message}`
      );
    }

    if (!data) {
      return new Response('Installation info not found', { status: 404 });
    }

    var accessToken = data.access_token;
    const expiresAt = new Date(data.expires_at);
    const currentTime = new Date();

    if (expiresAt < currentTime) {
      const regeneratedAccessToken = await getAccessToken(data.installation_id);
      const updatedAccessToken = regeneratedAccessToken.token;
      const updatedExpiresAt = regeneratedAccessToken.exp.expires_at;

      await updateUserInstallationToken(
        supabase,
        data.id,
        updatedAccessToken,
        updatedExpiresAt
      );

      accessToken = updatedAccessToken;
    }

    return accessToken;
  } catch (error: any) {
    console.error(
      'Error getting the installation token:',
      error.response?.data?.message || error.message || error
    );
    throw error;
  }
}


async function updateUserInstallationToken(
  supabase: any,
  id: string,
  accessToken: string,
  expiresAt: string
) {
  try {
    const { data, error } = await supabase
      .from('user_installation_info')
      .update({
        access_token: accessToken,
        expires_at: expiresAt,
      })
      .eq('id', id)
      .single();

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
