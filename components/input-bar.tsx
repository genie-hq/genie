import { FC } from 'react';
import { CreateTestFileDialog } from './create-test-file-dialog';
import { Input } from './ui/input';

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
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const InputBar: FC<Props> = ({
  file,
  opened,
  setOpened,
  input,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <div className="p-4 w-full">
      <form
        className="flex gap-2 w-full"
        onSubmit={(e) => {
          if (file) {
            handleSubmit(e);
            return;
          }

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

        {!!file || (
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
