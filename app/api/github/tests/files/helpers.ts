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
    console.log('Fetching latest commit SHA of base branch...');
    const {
      data: {
        object: { sha: latestCommitSha },
      },
    } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    console.log('Latest commit SHA:', latestCommitSha);

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
    throw error;
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
      'Error while pushing file to branch:',
      error.response?.data?.message || error.message || error
    );
    throw error;
  }
}

export async function checkGenieYamlExistence({
  octokit,
  owner,
  repository: repo,
  branch,
}: {
  octokit: any;
  owner: string;
  repository: string;
  branch: string;
}) {
  const genieYamlPath = '.github/workflows/genie.yaml';

  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: genieYamlPath,
      ref: branch,
    });

    if (res.status === 200) return;
  } catch (error: any) {
    // If the error is not found, create the .github/workflows directory and the genie.yaml file
    if (error.status === 404) {
      await checkAndCreateDummyDirectory({
        octokit,
        owner,
        repo,
        branch,
        directoryPath: '.github',
        dummyMessage: 'Genie: Create dummy file in .github directory',
      });

      // Create or handle .github/workflows directory
      await checkAndCreateDummyDirectory({
        octokit,
        owner,
        repo,
        branch,
        directoryPath: '.github/workflows',
        dummyMessage: 'Genie: Create dummy file in .github/workflows directory',
      });

      await createGenieYaml({
        owner,
        repository: repo,
        octokit,
        branch,
      });

      return;
    }
    // If the error is other than 404, re-throw it
    throw error;
  }
}

async function checkAndCreateDummyDirectory({
  octokit,
  owner,
  repo,
  branch,
  directoryPath,
  dummyMessage,
}: {
  octokit: any;
  owner: string;
  repo: string;
  branch: string;
  directoryPath: string;
  dummyMessage: string;
}) {
  try {
    // Try to get the content of the directory
    let res;
    try {
      res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: directoryPath,
        ref: branch,
      });
    } catch (error) {
      // If directory doesn't exist, create a dummy file in it
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `${directoryPath}/dummy`,
        message: dummyMessage,
        // Encode the content as Base64
        content: Buffer.from(
          `This file is created to initialize the ${directoryPath} directory`
        ).toString('base64'),
        branch,
      });
    }
  } catch (error) {
    console.error(
      `Error creating or updating directory ${directoryPath}:`,
      error
    );
    throw error;
  }
}

export async function createGenieYaml({
  octokit,
  owner,
  repository,
  branch,
}: {
  octokit: any;
  owner: string;
  repository: string;
  branch: string;
}) {
  const genieYamlPath = '.github/workflows/genie.yaml'; // Corrected path
  const genieYamlContent =
    'name: Genie Test\n\non:\n  push:\n\njobs:\n  build:\n    name: "Genie\'s Automated Tests"\n    timeout-minutes: 15\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [20]\n\n    steps:\n      - name: Check out code\n        uses: actions/checkout@v4\n        with:\n          fetch-depth: 2\n\n      - uses: pnpm/action-setup@v3\n        with:\n          version: 9\n\n      - name: Use Node.js ${{ matrix.node-version }}\n        uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n          cache: "pnpm"\n\n      - name: Install dependencies\n        run: pnpm install\n\n      - name: Test\n        run: pnpm test';
  const genieYamlCommitMsg = 'Genie: Create a genie.yaml file';

  try {
    // Create the genie.yaml file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo: repository,
      path: genieYamlPath,
      message: genieYamlCommitMsg,
      content: Buffer.from(genieYamlContent).toString('base64'), // Encode content as Base64
      branch,
    });

    console.log('Genie.yaml file created successfully.');
  } catch (error) {
    console.error('Error while creating genie.yaml:', error);
    throw error;
  }
}

export async function getLatestCommitSHA({
  octokit,
  owner: owner,
  repository: repo,
  branch,
}: {
  octokit: any;
  owner: string;
  repository: string;
  branch: string;
}) {
  try {
    const response = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });
    const latestCommitSHA = response.data.commit.sha;
    return latestCommitSHA;
  } catch (error) {
    console.error('Error while getting the latest commit SHA:', error);
    throw error;
  }
}
