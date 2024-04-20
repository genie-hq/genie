import { FC, FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void; // Accepts a FormEvent
}

export const InputBar: FC<Props> = ({ input, handleInputChange, handleSubmit }) => {
  return (
    <div className="p-4 pt-0 w-full">
      <div className="bg-foreground/5 border rounded-lg p-2 flex items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-between w-full">
            <textarea
              className="bg-gray-600/0 w-full h-18 text-white focus:outline-none overflow-hidden text-md resize-none"
              value={input}
              onChange={handleInputChange}
              placeholder="Prompt your AI here..."
            />

            <Button type="submit" variant="ghost" size="icon">
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
