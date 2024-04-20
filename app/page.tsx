'use client';

import { HamburgerMenu } from './ai_prompt/components/hamburger-menu';
import { InputBar } from './ai_prompt/components/input-bar';
import Message from './ai_prompt/scripts/message.class';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from './ai_prompt/components/dropdown-menu';
import { RefreshCcw } from 'lucide-react';
import hmm_cat from './ai_prompt/assets/HmmCat.jpg';
import Image from 'next/image';

const sampleMessages = [
  { content: 'Hello! How can I assist you today?', isUser: false },
  { content: "Hi there! I'm looking for some guidance.", isUser: true },
  {
    content: "Of course, I'm here to help. What do you need assistance with?",
    isUser: false,
  },
  { content: "I'm trying to write a test case for my website.", isUser: true },
  {
    content:
      'Testing is essential for ensuring your website functions correctly. What specific aspect of testing are you struggling with?',
    isUser: false,
  },
  {
    content:
      "I'm unsure about how to write effective unit tests for my components.",
    isUser: true,
  },
  {
    content:
      "Ah, unit testing is crucial for verifying individual components' behavior. Let me provide you with some guidance.",
    isUser: false,
  },
  { content: 'That would be great, thank you!', isUser: true },
];

const githubAccounts = [{ value: 'genie-hq', label: 'genie-hq' }];

const githubRepos = [{ value: 'genie', label: 'genie' }];

const branches = [
  { value: 'main', label: 'Main' },
  { value: 'dev', label: 'Dev' },
  { value: 'feature-branch', label: 'Feature Branch' },
  { value: 'bugfix-branch', label: 'Bugfix Branch' },
  { value: 'release', label: 'Release' },
];

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
];

const testingLibraries = [
  { value: 'vitest', label: 'Vitest' },
  { value: 'jest', label: 'Jest', disabled: true },
];

const testVersions = [{ value: 'v0', label: 'Version 0' }];

export default function Page() {
  const [messageList, setMessageList] = useState<Message[]>(sampleMessages);
  const [isNewPrompt, setIsNewPrompt] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReload = () => {
    // Toggle the spinning state
    setIsSpinning((prevState) => !prevState);
    setTimeout(() => {
      setIsSpinning((prevState) => !prevState);
    }, 1000);
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
        <div className=" overflow-auto" />

        {/* Config + Input */}
        <div className="flex flex-col items-center w-full gap-2">
          <div className={isNewPrompt ? '' : 'justify-end w-full px-4'}>
            {!isNewPrompt ? (
              <div className="grid grid-cols-5 gap-2 items-center">
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
              <div className="flex items-center justify-end gap-2">
                <DropdownMenu title="Default version" options={testVersions} />
              </div>
            )}
          </div>

          <InputBar
            addMessage={(message) => setMessageList([...messageList, message])}
          />
        </div>
      </div>
    </div>
  );
}
