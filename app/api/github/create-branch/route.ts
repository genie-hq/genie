import { Octokit } from '@octokit/rest';
import { createBranch } from './create-branch';
import { pushFileToBranch } from '../push-file/push-file';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';


export async function GET(request: Request & { access_token: string; 
                                              github_repo_user_name: string;
                                              github_repo_name: string;
                                              base_branch: string;
                                              new_branch: string;
                                            }) {
  const requestUrl = new URL(request.url);

  const githubAccessToken = request.access_token;
  const githubRepoUserName = request.github_repo_user_name;
  const githubRepoName = request.github_repo_name;
  const baseBranch = request.base_branch;
  const newBranch = request.new_branch;


  const octokit = new Octokit({
    auth: githubAccessToken, 
  });

  createBranch(octokit, githubRepoUserName, githubRepoName, baseBranch, newBranch);

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}
