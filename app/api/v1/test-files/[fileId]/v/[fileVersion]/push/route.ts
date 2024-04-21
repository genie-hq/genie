import { NextResponse } from 'next/server';
import {
  createBranch,
  upsertTestFile,
  getLatestCommitSHA,
  checkGenieYamlExistence,
} from './helpers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getInstallationTokens } from '../../../../../../github/get-installaion-tokens';
import { Octokit } from 'octokit';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    fileId: string;
  };
}

export async function POST(req: Request, { params: { fileId } }: Params) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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

  await createBranch({
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

  const { searchParams } = new URL(req.url);
  const fileVersionId = searchParams.get('fileVersionId');

  const { error } = await supabase
    .from('test_file_versions')
    .update({
      pushed: true,
    })
    .eq('test_file_id', fileId)
    .eq('id', fileVersionId);

  return NextResponse.json({ message: 'Test file created', data, status: 201 });
}
