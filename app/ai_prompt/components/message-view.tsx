"use client"

import React from 'react'

import { MessageBubble } from './message-bubble'
import { useState } from 'react'

class Message {
    content: string = 'Hello em'
    isUser: boolean = true

    constructor(content: string, isUser: boolean) {
        content = content
        isUser = isUser
    }
}

const sample: Message[] = [
    { content: 'HD Machine learning pleaseeeee', isUser: true },
    { content: 'J ok e', isUser: false },
    { content: 'ngon', isUser: true }
]

export const MessageView = () => {
    const [messageList, setMessageList] = useState<Message[]>(sample)

    return (
        <div className='flex flex-col'>
            {messageList.map((message) => (
                <MessageBubble content={message.content} isUserMessage={message.isUser} />
            ))}
        </div>
    )
}
