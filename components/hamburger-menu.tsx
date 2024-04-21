'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import ai_img from '../assets/ai.svg';
import { Pencil, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HamburgerMenuProps {
  disabled?: boolean;
  onSelect: (index: number) => void;
}

export const HamburgerMenu = ({ disabled,onSelect }: HamburgerMenuProps) => {
  const router = useRouter();

  const [messageList, setMessageList] = useState<string[]>([]);
  const [editTitleIndex, setEditTitleIndex] = useState<number>(-1);
  const [newTitle, setNewTitle] = useState<string>('');

  const createNewMessage = (title: string) => {
    setMessageList((prevMessages) => [...prevMessages, title]);
  };

  const onInputChange = (value: string) => {
    setNewTitle(value);
  };

  const handleEditTitle = (newTitle: string, index: number) => {
    setEditTitleIndex(-1);

    if (newTitle === '') {
      return;
    }

    setMessageList((prevList) =>
      prevList.map((message, idx) => (idx === index ? newTitle : message))
    );
    setNewTitle('');
  };

  return (
    <div className="border-r w-80 hidden md:flex flex-col justify-between p-4">
      <div>
        <Button
          className="w-full items-center flex justify-between"
          // onClick={() => createNewMessage('New File')}
          onClick={() => router.push('/new')}
          disabled={disabled}
        >
          Create new prompt
          <Plus className="w-4 h-4" />
        </Button>

        <div className="my-2 border-t pt-2 font-semibold">Recent prompts</div>

        <div className="overflow-auto h-96">
          {messageList.map((message, index) => (
            <Button
              key={index}
              className="w-full my-0.5 px-2 justify-start"
              variant="ghost"
              onClick={() => onSelect(index)}
            >
              <div className="truncate flex justify-between w-full items-center">
                {editTitleIndex === index ? (
                  <input
                    type="text"
                    placeholder={message}
                    value={newTitle}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditTitle(newTitle, index);
                      }
                    }}
                    onBlur={() => handleEditTitle(newTitle, index)}
                    autoFocus
                    className="bg-transparent focus:outline-none"
                  />
                ) : (
                  <span>{message}</span>
                )}

                <Pencil
                  className="w-4 h-4 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTitleIndex(index);
                  }}
                />
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
          <Image src={ai_img} alt="app logo" className="w-6 h-6 opacity-70" />
          Upgrade to GenieX
        </Button>

        {/* <Button className="w-full text-xs" variant="link">
          Need help?
        </Button> */}
      </div>
    </div>
  );
};
