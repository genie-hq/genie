import React from 'react'
import { useState } from 'react'
import Message from '../scripts/message.class'
import Image from 'next/image'
import image_plus from '../assets/image-plus.svg'
import { ImagePlusIcon } from 'lucide-react'

interface Props {
  addMessage: (message: Message) => void;
}

export const InputBar: React.FC<Props> = ({ addMessage }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message.trim() !== '') {
      const message_class = new Message(message, true)
      addMessage(message_class);
      setMessage('');
    }
  };

  return (
    <div className='bg-gray-600/30 rounded-lg w-11/12 flex items-center mb-5 mt-2'>
      <div className='flex flex-col justify-between ml-1 mt-4 mb-4 px-4 w-full'>
        <textarea
          className=' bg-gray-600/0 w-full h-18 text-white focus:outline-none overflow-hidden text-md resize-none'
          value={message}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit()
            }
          }}
          placeholder='Prompt your AI here...'
        />

        <ImagePlusIcon
        className=' text-white/80 hover:cursor-pointer hover:text-white w-6 h-6' />
      </div>


      <button
        className={`${message === '' ? 'bg-gray-600' : 'bg-white'} text-white rounded-full m-2 w-8 h-8 p-1 mr-4 flex items-center justify-center`}
        onClick={handleSubmit}
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
