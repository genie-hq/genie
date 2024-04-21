'use client';

import { InputBar } from '../components/input-bar';
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatMessage } from '../components/chat-message';
import { Button } from '@/components/ui/button';

export default function TestFileReprompt({
  file,
}: {
  file?: {
    id: string;
    name: string;
    version: string;
    code: string;
    initial_prompt: string;
  };
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(true);
  const [pendingPrompt, setPendingPrompt] = useState('');

  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
                collapsed
                  ? 'h-0 opacity-0'
                  : 'p-2 md:p-4 h-fit border-b opacity-100'
              } overflow-auto border-t transition-all`}
            >
              <ChatMessage
                message={{
                  id: 'initial_prompt',
                  role: 'user',
                  content: file.initial_prompt,
                }}
              />
            </div>
          </div>
        )}

        <div className="p-4 overflow-auto">
          {messages.map((message, index) => (
            <ChatMessage message={message} key={index} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Config + Input */}
        <div className="flex flex-col items-end w-full gap-2 relative">
          <div className="justify-end w-full px-4 absolute -top-12">
            {/* {!isNewPrompt ? (
              <div className="grid grid-cols-5 gap-2 items-end">
                <DropdownMenu
                  title="GitHub Account"
                  options={githubAccounts}
                  className="w-full"
                />
                <DropdownMenu
                  title="Git Repositories"
                  options={githubRepos}
                  className="w-full"
                />
                <DropdownMenu
                  title="Branches"
                  options={branches}
                  className="w-full"
                />
                <DropdownMenu
                  title="Languages"
                  options={programmingLanguages}
                  className="w-full"
                />
                <DropdownMenu
                  title="Testing Libraries"
                  options={testingLibraries}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-end justify-end gap-2">
                <DropdownMenu title="Default version" options={testVersions} />
              </div>
            )} */}
          </div>

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
