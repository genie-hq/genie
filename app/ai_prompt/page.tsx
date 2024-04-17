"use client"

import React from 'react'
import { MessageBubble } from './components/message-bubble'
import { HamburgerMenu } from './components/hamburger-menu'
import { InpurBar } from './components/input-bar'
import { MessageView } from './components/message-view'

export const Page = () => {
  return (
    <div className='h-dvh w-dvw flex flex-row bg-black'>
      <HamburgerMenu />

      <div className='flex flex-col w-dvw justify-between mt-3'>
        <MessageView />

        <div className='flex flex-col w-full items-center'>
          <InpurBar />
        </div>
      </div>
    </div>
  )
}
