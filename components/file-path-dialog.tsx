import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FileUpdateForm from './file-update-form';

export default function FilePathDialog({
  file,
  opened,
  setOpened,
}: {
  file?: {
    id: string;
    github_username: string;
    repository: string;
    target_branch: string;
    version: string;
    code: string;
    file_path: string;
  };
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        {file && (
          <button
            className="opacity-50 hover:opacity-100 text-start transition hover:underline"
            onClick={() => {
              setOpened(true);
            }}
          >
            {file.github_username}/{file.repository}/{file.target_branch}
            {file.file_path}
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Test File Setup</DialogTitle>
          <DialogDescription>
            Update the test file with the changes you want to make.
          </DialogDescription>
        </DialogHeader>

        {file && <FileUpdateForm file={file} close={() => setOpened(false)} />}
      </DialogContent>
    </Dialog>
  );
}
