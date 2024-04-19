import { Octokit } from 'octokit';

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
    } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });

    // Create a new branch at the latest commit of the base branch
    await octokit.rest.git.createRef({
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

export async function pushFileToBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  fileContent: string,
  commitMessage: string
) {
  try {
    // Create a blob with the file content
    const {
      data: { sha: blobSha },
    } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: fileContent,
      encoding: 'utf-8',
    });

    // Get the latest commit SHA of the branch
    const {
      data: {
        object: { sha: latestCommitSha },
      },
    } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    // Create a tree with the new file
    const {
      data: { sha: treeSha },
    } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: latestCommitSha,
      tree: [
        {
          path: filePath,
          mode: '100644',
          type: 'blob',
          sha: blobSha,
        },
      ],
    });

    // Create a new commit
    const {
      data: { sha: newCommitSha },
    } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: treeSha,
      parents: [latestCommitSha],
    });

    // Update the branch reference
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitSha,
    });

    console.log(
      `File '${filePath}' pushed to branch '${branch}' successfully.`
    );
  } catch (error: any) {
    console.error(
      'Error pushing file to branch:',
      error.response?.data?.message || error.message || error
    );
  }
}
