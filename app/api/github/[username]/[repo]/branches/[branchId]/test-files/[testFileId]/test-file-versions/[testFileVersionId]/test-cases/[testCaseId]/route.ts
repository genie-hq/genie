import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import test from 'node:test';

interface Params {
  params: {
    username: string;
    repo: string;
    branchId: string;
    testFileId: string;
    testFileVersionId: string;
    testCaseId: string;
  };
}
export async function GET(
  _: Request,
  {
    params: {
      testFileId,
      branchId,
      username,
      repo,
      testFileVersionId,
      testCaseId,
    },
  }: Params
) {
  // Enforce authentication and authorization
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }
  // Get a testcase
  
  const { data, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('id', testCaseId);

  if (error) {
    console.error('Error getting test cases:', error);
    return NextResponse.error();
  }

  return NextResponse.json({ testFileVersions: data });
}
