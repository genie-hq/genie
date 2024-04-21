'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface HamburgerMenuProps {
  files: {
    id: string;
    name: string;
  }[];
  disabled?: boolean;
}

export const HamburgerMenu = ({ files, disabled }: HamburgerMenuProps) => {
  const router = useRouter();

  const supabase = createClientComponentClient();

  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const editFile = (id: string) => {
    setCurrentFileId(id);
    setNewTitle(files.find((file) => file.id === id)?.name || '');
  };

  const deleteFile = async (id: string) => {
    const { error } = await supabase.from('test_files').delete().eq('id', id);

    if (error) {
      alert('Error deleting file');
      return;
    }

    router.push('/files');
    router.refresh();
  };

  const onInputChange = (value: string) => {
    setNewTitle(value);
  };

  const applyFileEdit = async (newTitle: string) => {
    if (!newTitle) {
      alert('File name cannot be empty');
      return;
    }

    const file = files.find((file) => file.id === currentFileId);

    if (!file) {
      alert('File not found');
      return;
    }

    if (file.name === newTitle) {
      setCurrentFileId(null);
      return;
    }

    const { error } = await supabase
      .from('test_files')
      .update({ name: newTitle })
      .eq('id', currentFileId);

    if (error) {
      alert('Error updating file');
      return;
    }

    setCurrentFileId(null);
    router.refresh();
  };

  return (
    <div className="border-r w-80 hidden md:flex flex-col justify-between p-4">
      <div>
        <Button
          className="w-full items-center flex justify-between"
          // onClick={() => createNewMessage('New File')}
          onClick={() => router.push('/files')}
          disabled={disabled}
        >
          Create test file
          <Plus className="w-4 h-4" />
        </Button>

        {(files?.length || 0) > 0 && (
          <div className="my-2 border-t pt-2 font-semibold">Recent Files</div>
        )}

        <div className="overflow-auto h-96">
          {files.map((file) => (
            <Button
              key={file.id}
              className="w-full my-0.5 px-2 justify-start group"
              variant="ghost"
              onClick={() => router.push(`/files/${file.id}/v/latest`)}
            >
              <div className="truncate flex justify-between w-full items-center">
                {currentFileId === file.id ? (
                  <input
                    type="text"
                    placeholder={file.name}
                    value={newTitle}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyFileEdit(newTitle);
                    }}
                    onBlur={() => applyFileEdit(newTitle)}
                    autoFocus
                    className="bg-transparent focus:outline-none"
                  />
                ) : (
                  <span>{file.name}</span>
                )}

                <div className="flex items-center gap-1">
                  <Pencil
                    className="w-4 h-4 opacity-0 group-hover:opacity-50 group-hover:hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      editFile(file.id);
                    }}
                  />
                  <Trash
                    className="w-4 h-4 opacity-0 group-hover:opacity-50 group-hover:hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                  />
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Button
          className="w-full items-center flex gap-2"
          variant="ghost"
          disabled
        >
          Upgrade to GenieX
        </Button>

        {/* <Button className="w-full text-xs" variant="link">
          Need help?
        </Button> */}
      </div>
    </div>
  );
};
