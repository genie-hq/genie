"use client"

import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'
import ai_img from '../assets/ai.svg'
import plus_img from '../assets/plus.svg'
import square_pen from '../assets/pen.svg'

export const HamburgerMenu = () => {
    const [messageList, setMessageList] = useState<string[]>([]);

    const createNewMessage = (title: string) => {
        setMessageList(prevMessages => [...prevMessages, title]);
    };

    return (
        <div className='bg-black w-64 h-full flex flex-col justify-between px-3 text-white'>
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
                    onClick={() => createNewMessage("Hello")}>
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

                {messageList.map((message, index) => (
                    <Button
                        key={index}
                        className='w-full my-0.5 px-2 text-white bg-transparent hover:bg-white/20 justify-start'>
                        <div className="truncate flex justify-between w-full items-center">
                            {message}
                        </div>
                    </Button>
                ))}
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
                    variant="link">
                    Need help?
                </Button>
            </div>
        </div>
    );
}
