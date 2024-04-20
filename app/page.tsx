'use client';

import { HamburgerMenu } from './ai_prompt/components/hamburger-menu';
import { InputBar } from './ai_prompt/components/input-bar';
import Message from './ai_prompt/scripts/message.class';
import { useEffect, useState, useRef } from 'react';
import { DropdownMenu } from './ai_prompt/components/dropdown-menu';
import { useChat } from 'ai/react';
import {
  branches,
  githubAccounts,
  githubRepos,
  programmingLanguages,
  sampleMessages,
  testVersions,
  testingLibraries,
} from '@/data/root-page-data';
import { ChatMessage } from './ai_prompt/components/chat-message';

export default function Page() {
  const [messageList, setMessageList] = useState<Message[]>(sampleMessages);
  const [isNewPrompt, setIsNewPrompt] = useState<boolean>(true);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    console.log(selectedPrompt);
  }, [selectedPrompt]);

  return (
    <div className="h-full flex">
      {/* Side menu */}
      <HamburgerMenu onSelect={(index) => setSelectedPrompt(index)} />

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
          <div
            className={`${
              isNewPrompt ? '' : 'justify-end w-full'
            } px-4 absolute -top-12`}
          >
            {!isNewPrompt ? (
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
            )}
          </div>

          <InputBar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
