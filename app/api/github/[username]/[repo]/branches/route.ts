import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Octokit } from 'octokit';
import { getInstallationTokens } from '../../../get-installaion-tokens';

interface Params {
  params: {
    username: string;
    repo: string;
  };
}

export async function GET(_: Request, { params: { username, repo } }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  const githubAccessToken = await getInstallationTokens({supabase});
  
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const branches = await getBranches({ octokit, username, repository: repo });
  return NextResponse.json({ branches });
}

async function getBranches({
  octokit: octokit,
  username: owner,
  repository: repo,
}: {
  octokit: any;
  username: string;
  repository: string;
}) {
  try {
    const { data: branches } = await octokit.rest.repos.listBranches({
      owner,
      repo,
    });

    return branches;
  } catch (error: any) {
    console.error(
      'Error getting branches:',
      error.response?.data?.message || error.message || error
    );
    throw error; // re-throw the error to be handled by the caller
  }
}
