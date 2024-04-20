import { ChevronRight } from 'lucide-react';

function CollapsedLine({
  line,
  open,
  index,
  handleOpen,
  startLine,
}: {
  line: string;
  open: boolean;
  index: number;
  handleOpen: () => void;
  startLine: number;
}) {
  const isHead = index === 0;
  return (
    <div
      className={`${
        isHead || open ? '' : ' hidden '
      } w-full flex items-center gap-1 hover:bg-foreground/5`}
      onClick={() => isHead && handleOpen()}
    >
      <a className="opacity-70 underline hover:text-blue-500 cursor-pointer flex justify-end w-6 md:w-8 lg:w-10 shrink-0 self-start">
        {startLine + index}
      </a>
      {isHead && (
        <ChevronRight
          className={`flex-shrink-0 w-4 h-4 ${
            open ? 'rotate-90' : ''
          } transition-transform`}
        />
      )}
      <span
        className={`${
          isHead ? 'cursor-pointer ' : 'pl-5'
        } flex items-center w-full `}
      >
        {line}
      </span>
    </div>
  );
}

export default CollapsedLine;
