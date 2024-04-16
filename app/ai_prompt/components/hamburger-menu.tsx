"use client"

import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const HamburgerMenu = () => {
    const [messageList, setMessageList] = useState<string[]>([]);

    const createNewMessage = (title: string) => {
        setMessageList(prevMessages => [...prevMessages, title]);
    };

    return (
        <div className='bg-black w-64 h-full flex flex-col justify-between px-3 text-white'>
            <div>
                <div className='flex justify-between font-semibold pt-4 items-center text-lg'>
                    <div>
                        Genie.ai
                    </div>

                    <div className='text-gray-600 text-sm'>
                        Version 1.0
                    </div>
                </div>

                <Button
                    className='bg-white w-full my-6 text-black hover:bg-slate-200'
                    onClick={() => createNewMessage("Hello")}>
                    Create new chat
                </Button>

                <div className='text-sm mb-2'>
                    Recent chats
                </div>

                {messageList.map((message, index) => (
                    <Button
                        key={index}
                        className='w-full my-0.5 px-2 text-white bg-transparent hover:bg-white/20 justify-start'>
                        <div className="truncate">
                            {message}
                        </div>
                    </Button>
                ))}
            </div>

            <div className=' mb-6'>
                <Button
                    className='w-full hover:bg-slate-200/20'>
                    Upgrade to GenieX
                </Button>

                <Button
                    className='w-full hover:bg-black hover:text-white hover:underline text-sm'
                    variant="ghost">
                    Need help?
                </Button>
            </div>
        </div>
    );
}
