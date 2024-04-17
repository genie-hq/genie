"use client"

import React from 'react'
import { HamburgerMenu } from './components/hamburger-menu'
import { InputBar } from './components/input-bar'
import { MessageView } from './components/message-view'
import Message from './scripts/message.class'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

const sampleMessages = [
  { content: "Hello! How can I assist you today?", isUser: false },
  { content: "Hi there! I'm looking for some guidance.", isUser: true },
  { content: "Of course, I'm here to help. What do you need assistance with?", isUser: false },
  { content: "I'm trying to write a test case for my website.", isUser: true },
  { content: "Testing is essential for ensuring your website functions correctly. What specific aspect of testing are you struggling with?", isUser: false },
  { content: "I'm unsure about how to write effective unit tests for my components.", isUser: true },
  { content: "Ah, unit testing is crucial for verifying individual components' behavior. Let me provide you with some guidance.", isUser: false },
  { content: "That would be great, thank you!", isUser: true },
];

export const Page = () => {
  const [messageList, setMessageList] = useState<Message[]>(sampleMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div className='h-dvh w-dvw flex flex-row bg-black'>
      <HamburgerMenu />

      <div className='flex flex-col w-dvw justify-between mt-3'>
        <div className=' overflow-auto'>
          <MessageView messageList={messageList} />
          <div ref={messagesEndRef} />
        </div>

        <div className='flex flex-col w-full items-center'>
          <InputBar addMessage={(message) => setMessageList([...messageList, message])} />
        </div>
      </div>
    </div>
  )
}
