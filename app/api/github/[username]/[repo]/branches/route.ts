import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

interface Params {
  params: {
    username: string;
    repo: string;
  };
}

export async function GET(_: Request, { params: { username, repo } }: Params) {
  const branches = await getBranches({ username, repository: repo });
  return NextResponse.json({ branches });
}

const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
const octokit = new Octokit({
  auth: githubAccessToken,
});

async function getBranches({
  username: owner,
  repository: repo,
}: {
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
