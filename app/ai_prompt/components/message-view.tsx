import { MessageBubble } from './message-bubble';
import { FC } from 'react';

export const MessageView: FC<{ messageList: any[] }> = ({
  messageList,
}) => {
  return (
    <div className="flex flex-col my-5">
      {messageList.map((m) => (
        <MessageBubble
          content={m.content}
          isUserMessage={m.role === 'user'}
        />
      ))}
    </div>
  );
};
