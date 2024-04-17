import React from 'react'

import { MessageBubble } from './message-bubble'
import Message from '../scripts/message.class'

export const MessageView: React.FC<{ messageList: Message[] }> = ({ messageList }) => {
    return (
        <div className='flex flex-col my-5'>
            {messageList.map((message) => (
                <MessageBubble content={message.content} isUserMessage={message.isUser} />
            ))}
        </div>
    )
}
