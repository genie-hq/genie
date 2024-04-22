'use client';

import { InputBar } from '../components/input-bar';
import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatMessage } from '../components/chat-message';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Check, CloudUpload, FileCheck, LoaderIcon, X } from 'lucide-react';

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
    version_id: string;
    github_username: string;
    repository: string;
    branch: string;
    target_branch: string;
    file_path: string;
    pushed: boolean;
  };
}) {
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(true);
  const { messages, input, isLoading, handleInputChange, reload } = useChat({
    api: file?.id
      ? file.versions === 1
        ? `/api/v1/test-files/${file.id}/v/${file.version}/generate?fileVersionId=${file.version_id}`
        : `/api/v1/test-files/${file.id}/v/${file.version}/improve`
      : undefined,
    initialMessages: file?.code
      ? [
          {
            id: 'prompt',
            role: 'user',
            content: file?.prompt || '',
          },
          {
            id: 'assistant',
            role: 'assistant',
            content: file.code,
          },
        ]
      : [
          {
            id: 'prompt',
            role: 'user',
            content: file?.prompt || '',
          },
        ],
  });

  useEffect(() => {
    router.refresh();
  }, [router, file?.id, isLoading]);

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

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [passing, setPassing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStatus(true);

      try {
        const res = await fetch(
          `/api/github/${file?.github_username}/${file?.repository}/branches/${file?.branch}/workflows`
        );

        const data = await res.json();
        setPassing(data.workflows.conclusion === 'success');
      } catch (error) {
        console.error(error);
        setPassing(false);
      }

      setLoadingStatus(false);
    };

    if (file?.id) fetchData();
  }, [file?.id]);

  const [pushing, setPushing] = useState(false);
  const [pushError, setPushError] = useState('');

  const pushFile = async () => {
    if (!file) return;
    setPushing(true);
    const res = await fetch(
      `/api/v1/test-files/${file.id}/v/${file.versions}/push?fileVersionId=${file.version_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: file?.github_username,
          repository: file?.repository,
          reference_branch: file?.branch,
          target_branch: file?.target_branch,
          path: file?.file_path,
          content: file?.code,
          commit_message:
            file?.versions === 0
              ? 'chore(tests): add initial test file'
              : `chore(tests): update test file (v${file?.versions - 1})`,
        }),
      }
    );
    router.refresh();

    if (!res.ok) {
      const data = await res.json();
      setPushError(data.error);
      setPushing(false);
      return;
    }

    router.refresh();
  };

  const [opened, setOpened] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  return (
    <div className="h-full w-full flex">
      <div className="flex flex-col w-full justify-between">
        {/* Output View */}
        {file?.id && file?.version && (
          <div>
            <div className="flex items-center justify-between p-4">
              <div>
                <button
                  className="opacity-50 hover:opacity-100 text-start transition hover:underline"
                  onClick={() => {
                    setOpened(true);
                    setShowSetup(true);
                  }}
                >
                  {file.github_username}/{file.repository}/{file.target_branch}
                  {file.file_path}
                </button>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">{file.name}</div>
                  <div className="text-sm bg-foreground text-background font-semibold rounded px-1">
                    {file.version === 'latest' ? 'Latest' : `v${file.version}`}
                  </div>

                  <div className="flex gap-1 items-center">
                    <div>
                      {file.pushed ? (
                        <div className="text-sm text-foreground">
                          <FileCheck className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="text-sm opacity-50">
                          <CloudUpload className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      {loadingStatus ? (
                        <div className="text-sm text-foreground">
                          <LoaderIcon className="w-4 h-4 animate-spin" />
                        </div>
                      ) : passing ? (
                        <div className="text-sm text-green-600 dark:text-green-300">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 dark:text-red-300">
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
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
            <>
              {messages.slice(1).map((message, index) => (
                <ChatMessage message={message} key={index} />
              ))}

              {file.code && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Button onClick={pushFile} disabled={file.pushed || pushing}>
                    {file.pushed
                      ? 'File successfully pushed to GitHub.'
                      : pushing
                      ? 'Pushing...'
                      : 'Push to GitHub'}
                  </Button>
                  {pushError && (
                    <div className="text-red-500 text-sm">{pushError}</div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-2xl opacity-50 font-semibold flex items-center justify-center h-full">
              Get started by creating a new test file.
            </div>
          )}
        </div>

        {/* Config + Input */}
        <div className="flex flex-col items-end w-full gap-2 relative">
          {file?.versions && (
            <div className="justify-end w-full px-8 absolute -top-12 pointer-events-none">
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
                  className="pointer-events-auto"
                />
              </div>
            </div>
          )}

          <div className="w-full flex items-center border-t justify-center">
            <InputBar
              file={file}
              opened={opened}
              showSetup={showSetup}
              setOpened={setOpened}
              setShowSetup={setShowSetup}
              input={input}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
