"use client"

import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'
import ai_img from '../assets/ai.svg'
import plus_img from '../assets/plus.svg'

export const HamburgerMenu = () => {
    const [messageList, setMessageList] = useState<string[]>([]);
    const [editTitleIndex, setEditTitleIndex] = useState<number>(-1);
    const [newTitle, setNewTitle] = useState<string>('')

    const createNewMessage = (title: string) => {
        setMessageList(prevMessages => [...prevMessages, title]);
    };

    const onInputChange = (value: string) => {
        setNewTitle(value);
    };

    const handleEditTitle = (newTitle: string, index: number) => {
        setEditTitleIndex(-1)

        if (newTitle === '') {

            return
        }

        setMessageList(prevList =>
            prevList.map((message, idx) =>
                idx === index ? newTitle : message
            )
        );
        setNewTitle("")
    };

    return (
        <div
            className=' border-r border-gray-600/50 w-80 h-full flex flex-col justify-between px-5 text-white'
        >
            <div>
                <div className='flex justify-between font-semibold pt-6 items-center text-xl'>
                    <div className=' hover:cursor-pointer'>
                        Genie.ai
                    </div>

                    <div className='text-gray-600 text-sm font-medium'>
                        Version 1.0
                    </div>
                </div>

                <Button
                    className='bg-white w-full my-6 text-black hover:bg-slate-200 items-center flex justify-between'
                    onClick={() => createNewMessage("New Chat")}
                >
                    Create new chat

                    <Image
                        src={plus_img}
                        alt="Plus sign"
                        className="w-4 h-4"
                    />
                </Button>

                <div className='text-sm mb-2'>
                    Recent chats
                </div>

                <hr className="mb-2  border-white/30" />

                <div className='overflow-auto h-96'>
                    {messageList.map((message, index) => (
                        <Button
                            key={index}
                            className='w-full my-0.5 px-2 text-white bg-transparent hover:bg-white/20 justify-start'
                        >
                            <div className="truncate flex justify-between w-full items-center">
                                {editTitleIndex === index ? (
                                    <input
                                        type="text"
                                        placeholder={message}
                                        value={newTitle}
                                        onChange={(e) => onInputChange(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleEditTitle(newTitle, index);
                                            }
                                        }}
                                        onBlur={() => handleEditTitle(newTitle, index)}
                                        autoFocus
                                        className='bg-transparent focus:outline-none'
                                    />
                                ) : (
                                    <span>{message}</span>
                                )}

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className=' w-4 h-4 stroke-gray-500 hover:stroke-white'
                                    onClick={() => setEditTitleIndex(index)}
                                >
                                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                                </svg>

                            </div>
                        </Button>
                    ))}
                </div>

            </div>

            <div className='mb-6'>
                <Button
                    className='w-full hover:bg-slate-200/20 items-center flex gap-2 bg-transparent'>
                    <Image
                        src={ai_img}
                        alt="app logo"
                        className="w-7 h-7"
                    />

                    Upgrade to GenieX
                </Button>

                <Button
                    className='w-full hover:bg-black text-white text-xs'
                    variant="link"
                >
                    Need help?
                </Button>
            </div>
        </div>
    );
}
