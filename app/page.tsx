"use client";

import { HamburgerMenu } from "./ai_prompt/components/hamburger-menu";
import { InputBar } from "./ai_prompt/components/input-bar";
import Message from "./ai_prompt/scripts/message.class";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "./ai_prompt/components/dropdown-menu";
import { RefreshCcw } from "lucide-react";
import hmm_cat from "./ai_prompt/assets/HmmCat.jpg";
import Image from "next/image";

const sampleMessages = [
  { content: "Hello! How can I assist you today?", isUser: false },
  { content: "Hi there! I'm looking for some guidance.", isUser: true },
  {
    content: "Of course, I'm here to help. What do you need assistance with?",
    isUser: false,
  },
  { content: "I'm trying to write a test case for my website.", isUser: true },
  {
    content:
      "Testing is essential for ensuring your website functions correctly. What specific aspect of testing are you struggling with?",
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
  { content: "That would be great, thank you!", isUser: true },
];

const githubAccounts = [
  { value: "user1", label: "User 1" },
  { value: "user2", label: "User 2" },
  { value: "user3", label: "User 3" },
  { value: "user4", label: "User 4" },
  { value: "user5", label: "User 5" },
];

const githubRepos = [
  { value: "repo1", label: "Repo 1" },
  { value: "repo2", label: "Repo 2" },
  { value: "repo3", label: "Repo 3" },
  { value: "repo4", label: "Repo 4" },
  { value: "repo5", label: "Repo 5" },
];

const branches = [
  { value: "main", label: "Main" },
  { value: "dev", label: "Dev" },
  { value: "feature-branch", label: "Feature Branch" },
  { value: "bugfix-branch", label: "Bugfix Branch" },
  { value: "release", label: "Release" },
];

const programmingLanguages = [
  { value: "typesccript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
];

const testingLibraries = [
  { value: "jest", label: "Jest" },
  { value: "mocha", label: "Mocha" },
  { value: "rspec", label: "RSpec" },
  { value: "junit", label: "JUnit" },
  { value: "pytest", label: "pytest" },
];

const testCases = [
  { value: "test1", label: "Test 1" },
  { value: "test2", label: "Test 2" },
  { value: "test3", label: "Test 3" },
  { value: "test4", label: "Test 4" },
  { value: "test5", label: "Test 5" },
];

export default function Page() {
  const [messageList, setMessageList] = useState<Message[]>(sampleMessages);
  const [isNewPrompt, setIsNewPrompt] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className="h-dvh w-dvw flex flex-row bg-black">
      {/* Side menu */}
      <HamburgerMenu onSelect={(index) => setSelectedPrompt(index)} />

      <div className="flex flex-col w-dvw justify-between mt-3">
        {/* Header */}
        <div className="text-white mx-4 text-xl font-semibold mt-4">
          <div className="flex flex-row justify-between items-center">
            GenieX
            <Image
              src={hmm_cat}
              alt="cat"
              className="w-10 h-10 rounded-full hover:cursor-pointer"
            />
          </div>
          <hr className="mt-4 border-white/10" />
        </div>

        {/* Output View */}
        <div className=" overflow-auto" />

        {/* Config + Input */}
        <div className="flex flex-col items-center w-full gap-2">
          <div className={isNewPrompt ? "" : "justify-end w-11/12"}>
            {isNewPrompt ? (
              <div className="flex gap-2 items-center">
                <DropdownMenu
                  title="GitHub Accounts"
                  options={githubAccounts}
                />
                <DropdownMenu title="Git Repositories" options={githubRepos} />
                <DropdownMenu title="Branches" options={branches} />
                <DropdownMenu
                  title="Languages"
                  options={programmingLanguages}
                />
                <DropdownMenu
                  title="Testing Libraries"
                  options={testingLibraries}
                />
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <DropdownMenu title="Test case" options={testCases} />

                <Button onClick={handleReload}>
                  <span className={`${isSpinning ? "animate-spin" : ""} `}>
                    <RefreshCcw className="h-5 w-5" />
                  </span>
                </Button>
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
