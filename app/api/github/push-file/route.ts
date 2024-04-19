import { Octokit } from 'octokit';
import { pushFileToBranch } from './push-file';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request & {
    access_token: string;
    github_repo_user_name: string;
    github_repo_name: string;
    base_branch: string;
    new_branch: string;
    file_path: string;
    file_content: string;
    commit_message: string;
  }
) {
  const githubAccessToken = request.access_token;
  const githubRepoUserName = request.github_repo_user_name;
  const githubRepoName = request.github_repo_name;
  const newBranch = request.new_branch;
  const filePath = request.file_path;
  const fileContent = request.file_content;
  const commitMessage = request.commit_message;

  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  await pushFileToBranch(
    octokit,
    githubRepoUserName,
    githubRepoName,
    newBranch,
    filePath,
    fileContent,
    commitMessage
  );

  return NextResponse.json({
    status: 200,
    message: 'Successfully pushed a new file.',
  });
}
