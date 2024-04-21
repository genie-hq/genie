import { generateTestFile } from './helpers';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return generateTestFile(messages);
}
