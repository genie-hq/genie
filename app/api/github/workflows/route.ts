import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    username,
    repo,
    branch,
  }: { username: string; repo: string; branch: string } = body;

  console.log(username, repo, branch);
  const workflows = await getWorkflows({
    username,
    repository: repo,
    branch: branch,
  });
  return NextResponse.json({ workflows });
}

const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;
const octokit = new Octokit({
  auth: githubAccessToken,
});

export async function getWorkflows({
  username: owner,
  repository: repo,
  branch: branch,
}: {
  username: string;
  repository: string;
  branch: string;
}) {
  try {
    const { data: workflowRuns } =
      await octokit.rest.actions.listWorkflowRunsForRepo({
        owner: owner,
        repo: repo,
        branch: branch,
      });
    const latestWorkflowRunId = workflowRuns.workflow_runs[0].id;

    const { data: workflowRun } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: latestWorkflowRunId,
    });

    if (workflowRun.conclusion === 'failure') {
      const logs = await getWorkflowLogs(owner, repo, latestWorkflowRunId);
      return { conclusion: workflowRun.conclusion, logs };
    }

    return { conclusion: workflowRun.conclusion };
  } catch (error: any) {
    throw error;
  }
}

async function getWorkflowLogs(owner: string, repo: string, runId: number) {
  try {
    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });

    const logsResponse =
      await octokit.rest.actions.downloadJobLogsForWorkflowRun({
        owner,
        repo,
        job_id: jobs.jobs[0].id,
      });

    const logs = logsResponse.data ? logsResponse.data : null;

    return logs;
  } catch (error: any) {
    throw error;
  }
}
