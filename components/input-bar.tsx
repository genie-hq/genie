import { FC, useState } from 'react';
import { CreateTestFileDialog } from './create-test-file-dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';

interface Props {
  file?: {
    id: string;
    version: string;
    code: string;
  };
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputBar: FC<Props> = ({ file, input, handleInputChange }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="p-4 w-full">
      <form
        className="flex gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          setOpened(true);
        }}
      >
        <Input
          id="input-bar"
          className="w-full flex-1 bg-foreground/5 border rounded-lg p-2 h-18 focus-visible:ring-transparent overflow-hidden text-md resize-none"
          value={input}
          onChange={handleInputChange}
          placeholder={
            file
              ? 'What should be improved?'
              : 'What do you want to test today?'
          }
        />

        {file ? (
          <Button type="submit" variant="ghost" size="icon" disabled={!input}>
            <RefreshCcw className="w-6 h-6" />
          </Button>
        ) : (
          <CreateTestFileDialog
            open={opened}
            onOpenChange={setOpened}
            prompt={input}
          />
        )}
      </form>
    </div>
  );
};
