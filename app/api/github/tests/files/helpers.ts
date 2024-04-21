import { Octokit } from 'octokit';

export async function createBranch({
  octokit: octokit,
  username: owner,
  repository: repo,
  baseBranch,
  newBranch,
}: {
  octokit: any;
  username: string;
  repository: string;
  baseBranch: string;
  newBranch: string;
}) {
  try {
   
    // Try to get the reference to the new branch
    try {
      const { data: branch } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${newBranch}`,
      });

      console.log(`Branch '${newBranch}' already exists.`);
      return branch;
    } catch (error: any) {
      // Ignore the error as it means the branch doesn't exist
    }

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
    const { data: branch } = await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: latestCommitSha,
    });

    console.log(`Branch '${newBranch}' created successfully.`);
    return branch;
  } catch (error: any) {
    console.error(
      'Error creating branch:',
      error.response?.data?.message || error.message || error
    );
    throw error; // re-throw the error to be handled by the caller
  }
}

export async function upsertTestFile({
  username: owner,
  repository: repo,
  octokit: octokit,
  branch,
  filePath,
  fileContent,
  commitMessage,
  latestCommitSha,
}: {
  octokit: any;
  username: string;
  repository: string;
  branch: string;
  filePath: string;
  fileContent: string;
  commitMessage: string;
  latestCommitSha: string;
}) {
  try {
    // Remove leading slash from filePath if it exists
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

    // Create a blob with the file content
    const {
      data: { sha: blobSha },
    } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: fileContent,
      encoding: 'utf-8',
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

    return newCommitSha;
  } catch (error: any) {
    console.error(
      'Error pushing file to branch:',
      error.response?.data?.message || error.message || error
    );
    throw error; // re-throw the error to be handled by the caller
  }
}
