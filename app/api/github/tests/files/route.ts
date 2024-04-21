import { NextResponse } from 'next/server';
import {
  createBranch,
  upsertTestFile,
  getLatestCommitSHA,
  checkGenieYamlExistence,
} from './helpers';
import { createAdminClient } from '@/utils/supabase/admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getInstallationTokens } from '../../get-installaion-tokens';
import { Octokit } from 'octokit';

export const dynamic = 'force-dynamic';

export async function GET(_: Request) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}

export async function POST(req: Request) {
  const sbAdmin = createAdminClient();

  if (!sbAdmin) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const { error } = await sbAdmin
    .from('whitelisted_emails')
    .select('email')
    .eq('email', user?.email)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  const {
    username,
    repository,
    reference_branch,
    target_branch,
    path,
    content,
    commit_message,
  } = await req.json();

  const githubAccessToken = await getInstallationTokens({ supabase });
  console.log('githubAccessToken: ', githubAccessToken);
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const branch = await createBranch({
    octokit,
    username,
    repository,
    baseBranch: reference_branch,
    newBranch: target_branch,
  });

  await checkGenieYamlExistence({
    octokit,
    owner: username,
    repository,
    branch: target_branch,
  });

  const latestCommitSHA = await getLatestCommitSHA({
    octokit,
    owner: username,
    repository,
    branch: target_branch,
  });

  const data = await upsertTestFile({
    octokit,
    username,
    repository,
    branch: target_branch,
    filePath: path,
    fileContent: content,
    commitMessage: commit_message,
    latestCommitSha: latestCommitSHA,
  });

  return NextResponse.json({ message: 'Test file created', data, status: 201 });
}
