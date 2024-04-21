import { FC } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { CreateTestFileDialog } from './create-test-file-dialog';

interface Props {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputBar: FC<Props> = ({ input, handleInputChange }) => {
  return (
    <div className="p-4 w-full max-w-lg">
      <div className="flex gap-2 w-full">
        <Textarea
          className="w-full flex-1 bg-foreground/5 border rounded-lg p-2 h-18 focus-visible:ring-transparent overflow-hidden text-md resize-none"
          value={input}
          onChange={handleInputChange}
          placeholder="What do you want to test today?"
        />

        <CreateTestFileDialog prompt={input} />
      </div>
    </div>
  );
};
