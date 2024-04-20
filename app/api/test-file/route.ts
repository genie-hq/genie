import { NextRequest, NextResponse } from 'next/server';
import { generateTestFile, regenerateTestFile } from '../chat/route';
import { createBranch, upsertTestFile } from '../github/tests/files/helpers';
import { getWorkflows } from '../github/workflows/route';

export async function POST(req: NextRequest) {
  const {
    messages,
    repoOwner,
    repo,
    refBranch,
    targetBranch,
    path,
    language,
    library,
  } = await req.json();

  // Generate initial test file
  let testFile = await generateTestFile(messages);

  // Refine the initial test file
  let refinedTestFile = ''; // TODO: Implement refinement logic

  // Save initial test file to database
  // TODO: Implement saving logic (both testfile & version)

  const branch = await createBranch({
    username: repoOwner,
    repository: repo,
    baseBranch: refBranch,
    newBranch: targetBranch,
  });

  // Upsert initial test file
  await upsertTestFile({
    username: repoOwner,
    repository: repo,
    branch: targetBranch,
    filePath: path,
    fileContent: refinedTestFile,
    commitMessage: 'Genie Bot: Add a new test file.',
    latestCommitSha: branch.object.sha,
  });

  let failures = 0;
  let isSuccessful = false;
  let refinedLogs = '';

  while (failures < 3) {
    const workflow = await getWorkflows({
      username: repoOwner,
      repository: repo,
      branch: targetBranch,
    });

    if (workflow.conclusion === 'success') {
      isSuccessful = true;
      break;
    }

    const logs = workflow.logs;
    // TODO: Refine the logs
    refinedLogs = ''; // Implement log refinement logic

    // Regenerate test file with refined logs
    testFile = await regenerateTestFile(
      messages[0],
      refinedTestFile,
      refinedLogs
    );

    // Refine the regenerated test file
    refinedTestFile = ''; // Implement refinement logic

    // Save regenerated test file to database
    // TODO: Implement saving logic (update testfile & create a new version)

    // Upsert regenerated test file
    await upsertTestFile({
      username: repoOwner,
      repository: repo,
      branch: targetBranch,
      filePath: path,
      fileContent: refinedTestFile,
      commitMessage: 'Genie Bot: Add a new test file.',
      latestCommitSha: branch.object.sha,
    });

    failures++;
  }

  // TODO: return a list of versions as well?
  if (isSuccessful) {
    return NextResponse.json({
      isSuccessful: isSuccessful,
      testFile: refinedTestFile,
    });
  }

  return NextResponse.json({
    isSuccessful: isSuccessful,
    testFile: refinedTestFile,
    failures: refinedLogs,
  });
}
