import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TestFileForm from './test-file-form';
import InputCard from './input-card';
import { Separator } from './ui/separator';

export function CreateTestFileDialog({
  file,
  opened,
  setOpened,
  prompt,
}: {
  file?: {
    id: string;
    name: string;
    version: string;
    code: string;
    file_path: string;
  };
  opened: boolean;
  setOpened: (opened: boolean) => void;
  prompt: string;
}) {
  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>File Name</DialogTitle>
          <DialogDescription>
            Create a test file that Genie will use to automatically run test
            cases on your CI/CD pipeline using GitHub Actions.
          </DialogDescription>
        </DialogHeader>
        {!!file?.id || (
          <>
            <InputCard title="Test File" childrenClassName="mb-0">
              <div className="text-sm border rounded p-2 md:p-4 bg-foreground/5">
                {prompt}
              </div>
            </InputCard>
            <Separator />
          </>
        )}

        {file?.id && (
          <TestFileForm
            file={file}
            prompt={prompt}
            close={() => setOpened(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
