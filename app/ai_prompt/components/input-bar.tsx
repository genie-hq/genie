import { FC, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void; // Accepts a FormEvent
}

export const InputBar: FC<Props> = ({
  input,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <div className="p-4 w-full border-t">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2 w-full">
          <Textarea
            className="w-full flex-1 bg-foreground/5 border rounded-lg p-2 h-18 focus:outline-none overflow-hidden text-md resize-none"
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
  );
};
