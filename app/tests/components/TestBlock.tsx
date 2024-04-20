import { useState } from 'react';
import CollapsedLine from './CollapsedLine';

function TestBlock({
  block,
}: {
  block: {
    collapsed: boolean;
    lineContent: string[];
    startLine: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      {block.collapsed ? (
        block.lineContent.map((line, index) => (
          <CollapsedLine
            line={line}
            open={open}
            index={index}
            handleOpen={handleOpen}
            startLine={block.startLine}
          />
        ))
      ) : (
        <div className="w-full flex gap-1 lg:gap-1.5 hover:bg-foreground/5">
          <a className="opacity-70 underline hover:text-blue-500 cursor-pointer flex justify-end w-6 md:w-8 lg:w-10 shrink-0">
            {block.startLine}
          </a>
          <span
            className={`${
              block.collapsed ? 'cursor-pointer' : ''
            } flex items-center w-full `}
          >
            {block.lineContent}
          </span>
        </div>
      )}
    </>
  );
}

export default TestBlock;
