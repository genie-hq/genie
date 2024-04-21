import { FC } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { CreateTestFileDialog } from './create-test-file-dialog';

interface Props {
  file?: {
    id: string;
    version: string;
    code: string;
    initial_prompt: string;
  };
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputBar: FC<Props> = ({ file, input, handleInputChange }) => {
  return (
    <div className="p-4 w-full">
      <div className="flex gap-2 w-full">
        <Textarea
          className="w-full flex-1 bg-foreground/5 border rounded-lg p-2 h-18 focus-visible:ring-transparent overflow-hidden text-md resize-none"
          value={input}
          onChange={handleInputChange}
          placeholder={
            file
              ? 'What should be improved?'
              : 'What do you want to test today?'
          }
        />

        <CreateTestFileDialog prompt={input} />
      </div>
    </div>
  );
};
