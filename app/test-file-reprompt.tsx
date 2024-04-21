'use client';

import { InputBar } from '../components/input-bar';
import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatMessage } from '../components/chat-message';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function TestFileReprompt({
  file,
}: {
  file?: {
    id: string;
    name: string;
    version: string;
    versions: number;
    code: string;
    prompt: string;
  };
}) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(true);
  const [pendingPrompt, setPendingPrompt] = useState('');

  const { messages, input, isLoading, handleInputChange, reload } = useChat({
    api: file?.id
      ? `/api/v1/test-files/$${file.id}/v/${file.version}/generate`
      : undefined,
    initialMessages: [
      {
        id: 'prompt',
        role: 'user',
        content: file?.prompt || '',
      },
    ],
  });

  useEffect(() => {
    if (!file || isLoading) return;
    if (messages[messages.length - 1]?.role !== 'user') return;

    // Reload the chat if the user sends a message
    // but the AI did not respond yet after 1 second
    const timeout = setTimeout(() => {
      reload();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [file, isLoading, messages, reload]);

  return (
    <div className="h-full w-full flex">
      <div className="flex flex-col w-full justify-between">
        {/* Output View */}
        {file?.id && file?.version && (
          <div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">{file.name}</div>
                <div className="text-sm bg-foreground text-background font-semibold rounded px-1">
                  {file.version === 'latest'
                    ? 'Latest'
                    : `Version ${file.version}`}
                </div>
              </div>
              <Button
                onClick={() => setCollapsed(!collapsed)}
                variant="secondary"
              >
                {collapsed ? 'Expand' : 'Collapse'}
              </Button>
            </div>
            <div
              className={`${
                collapsed ? 'opacity-100' : 'opacity-0'
              } border-b transition`}
            />
            <div
              className={`${
                collapsed
                  ? 'h-0 opacity-0'
                  : 'p-2 md:p-4 pb-0 md:pb-0 h-fit border-b opacity-100'
              } overflow-auto border-t transition-all`}
            >
              <ChatMessage
                message={{
                  id: 'prompt',
                  role: 'user',
                  content: file.prompt,
                }}
              />
            </div>
          </div>
        )}

        <div className="p-4 pb-0 overflow-auto h-full">
          {file ? (
            messages
              .slice(1)
              .map((message, index) => (
                <ChatMessage message={message} key={index} />
              ))
          ) : (
            <div className="text-center text-2xl opacity-50 font-semibold flex items-center justify-center h-full">
              Get started by creating a new test file.
            </div>
          )}
        </div>

        {/* Config + Input */}
        <div className="flex flex-col items-end w-full gap-2 relative">
          {file?.versions && (
            <div className="justify-end w-full px-8 absolute -top-12">
              <div className="flex items-end justify-end gap-2 opacity-20 hover:opacity-100 transition">
                <DropdownMenu
                  title="Default version"
                  value={file?.version || 'latest'}
                  setValue={(value) =>
                    router.push(`/files/${file?.id}/v/${value}`)
                  }
                  options={[
                    { label: 'Latest', value: 'latest' },
                    ...Array.from({ length: file?.versions || 0 }, (_, i) => ({
                      label: `Version ${i}`,
                      value: `${i}`,
                    })),
                  ]}
                />
              </div>
            </div>
          )}

          <div className="w-full flex items-center border-t justify-center">
            <InputBar
              file={file}
              input={input}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
