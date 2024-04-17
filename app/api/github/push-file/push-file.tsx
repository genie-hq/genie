import { Octokit } from '@octokit/rest';

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
    } = await octokit.git.createBlob({
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
    } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    // Create a tree with the new file
    const {
      data: { sha: treeSha },
    } = await octokit.git.createTree({
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
    } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: treeSha,
      parents: [latestCommitSha],
    });

    // Update the branch reference
    await octokit.git.updateRef({
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
