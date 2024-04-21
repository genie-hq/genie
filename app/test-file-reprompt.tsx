'use client';

import { HamburgerMenu } from '../components/hamburger-menu';
import { InputBar } from '../components/input-bar';
import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatMessage } from '../components/chat-message';
import { toast } from '@/components/ui/use-toast';

export default function TestFileReprompt({ files }: { files: any[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(false);
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
    <div className="h-full flex">
      {/* Side menu */}
      <HamburgerMenu files={files} />

      <div className="flex flex-col w-full justify-between">
        {/* Output View */}
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
            <InputBar input={input} handleInputChange={handleInputChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
