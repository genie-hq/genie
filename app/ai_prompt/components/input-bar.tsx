"use client"

import React from 'react'
import { useState } from 'react'

export const InpurBar = () => {
  const [messages, setMessages] = useState<string>('');

  return (
    <div className='bg-black rounded-full mt-3 ml-3 w-80 flex items-center'>
      <input
        className='bg-black w-full h-8 ml-2 px-4 text-white focus:outline-none overflow-hidden text-sm'
        value={messages}
        onChange={(e) => { setMessages(e.target.value) }}
        placeholder='Prompt your AI here...'
      />

      <button
        className={`${messages === '' ? 'bg-gray-600' : 'bg-white'} text-white rounded-full m-2 w-6 h-6 flex items-center justify-center`}
        onClick={() => {
          setMessages('')
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-black w-6 h-6"
        >
          <path d="M8 10L12 6L16 10" />
          <path d="M12 6V22" />
        </svg>
      </button>
    </div>
  )
}
