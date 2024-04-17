"use client"

import React from 'react'
import { MessageBubble } from './components/message-bubble'
import { HamburgerMenu } from './components/hamburger-menu'
import { InputBar } from './components/input-bar'
import { MessageView } from './components/message-view'
import Message from './scripts/message.class'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'

const sampleMessages = [
  { content: "Hello, how can I help you?", isUser: false },
  { content: "Hi! I'm looking for some information.", isUser: true },
  { content: "Sure, what do you need to know?", isUser: false },
  { content: "I need help with understanding React hooks.", isUser: true },
  { content: "Ah, React hooks are used for state management and side effects.", isUser: false },
  { content: "Could you explain how to use them?", isUser: true },
  { content: "Of course! Let me give you a brief overview.", isUser: false },
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
