import { FC, useState } from 'react';
import Message from '../scripts/message.class';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  addMessage: (message: Message) => void;
}

export const InputBar: FC<Props> = ({ addMessage }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message !== '') {
      const message_class = new Message(message, true);
      addMessage(message_class);
      setMessage('');
    }
  };

  return (
    <div className="p-4 pt-0 w-full">
      <div className="bg-foreground/5 border rounded-lg p-2 flex items-center">
        <div className="flex flex-col justify-between w-full">
          <textarea
            className=" bg-gray-600/0 w-full h-18 text-white focus:outline-none overflow-hidden text-md resize-none"
            value={message}
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Prompt your AI here..."
          />
        </div>

        <Button onClick={handleSubmit} variant="ghost" size="icon">
          <Send className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
