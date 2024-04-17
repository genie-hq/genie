"use client"

import React from 'react'
import { useState } from 'react'

export const InpurBar = () => {
  const [messages, setMessages] = useState<string>('');

  return (
    <div className='bg-gray-600/30 rounded-full w-11/12 flex items-center mb-5'>
      <input
        className=' bg-gray-600/0 w-full h-12 ml-2 px-4 text-white focus:outline-none overflow-hidden text-md'
        value={messages}
        onChange={(e) => { setMessages(e.target.value) }}
        placeholder='Prompt your AI here...'
      />

      <button
        className={`${messages === '' ? 'bg-gray-600' : 'bg-white'} text-white rounded-full m-2 w-8 h-8 p-1 flex items-center justify-center`}
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
          className="stroke-black w-8 h-8"
        >
          <path d="M8 10L12 6L16 10" />
          <path d="M12 6V22" />
        </svg>
      </button>
    </div>
  )
}
