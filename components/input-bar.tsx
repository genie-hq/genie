import { FC } from 'react';
import { CreateTestFileDialog } from './create-test-file-dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

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
  bypass?: boolean;
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
  const router = useRouter();

  async function onSubmit(prompt: string) {
    const res = await fetch('/api/v1/test-files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: prompt,
        github_username: '',
        repository: '',
        branch: '',
        target_branch: '',
        test_library: 'Vitest',
        test_framework: 'TypeScript',
        file_path: '',
      }),
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/files/${id}/v/latest`);
      router.refresh();
      close();
    } else {
      toast({
        title: 'An error occurred',
        description: 'Please try again.',
      });
    }
  }

  return (
    <div
      className={`${disabled
        ? 'h-0 overflow-hidden pointer-events-none cursor-default'
        : 'p-4 w-full'
        }`}
    >
      <form
        className="flex gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (disabled) return;

          handleSubmit(input);
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

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!input || disabled}
          onClick={() => onSubmit(input)}
        >
          <Send className="w-6 h-6" />
        </Button>

        <CreateTestFileDialog
          file={file}
          opened={opened}
          setOpened={setOpened}
          prompt={input}
        />
      </form>
    </div>
  );
};
