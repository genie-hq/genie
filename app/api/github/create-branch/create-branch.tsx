import { Octokit } from '@octokit/rest';

export async function createBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  baseBranch: string,
  newBranch: string
) {
  try {
    // Get the latest commit SHA of the base branch
    const {
      data: {
        object: { sha: latestCommitSha },
      },
    } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });

    // Create a new branch at the latest commit of the base branch
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: latestCommitSha,
    });

    console.log(`Branch '${newBranch}' created successfully.`);
  } catch (error: any) {
    console.error(
      'Error creating branch:',
      error.response?.data?.message || error.message || error
    );
  }
}
