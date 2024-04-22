import { FC } from 'react';
import { CreateTestFileDialog } from './create-test-file-dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

interface Props {
  file?: {
    id: string;
    version: string;
    code: string;
    file_path: string;
  };
  opened: boolean;
  setOpened: (opened: boolean) => void;
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (prompt: string) => void;
  disabled?: boolean;
}

export const InputBar: FC<Props> = ({
  file,
  opened,
  setOpened,
  input,
  handleInputChange,
  handleSubmit,
  disabled,
}) => {
  return (
    <div
      className={`${
        disabled
          ? 'h-0 overflow-hidden pointer-events-none cursor-default'
          : 'p-4 w-full'
      }`}
    >
      <form
        className="flex gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (disabled) return;

          if (file) {
            handleSubmit(input);
            return;
          }

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
          disabled={disabled}
        />

        {!!file?.id ? (
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!input || disabled}
          >
            <Send className="w-6 h-6" />
          </Button>
        ) : (
          <CreateTestFileDialog
            file={file}
            opened={opened}
            setOpened={setOpened}
            prompt={input}
          />
        )}
      </form>
    </div>
  );
};
