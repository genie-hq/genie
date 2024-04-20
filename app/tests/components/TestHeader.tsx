import { CheckCircle, CheckCircle2, ChevronRight } from 'lucide-react';

function TestHeader({
  open,
  handleOpen,
  name,
}: {
  open: boolean;
  handleOpen: () => void;
  name: string;
}) {
  return (
    <div
      onClick={() => handleOpen()}
      className={`${
        open ? 'bg-foreground/5' : ''
      } w-full h-8 lg:h-9 lg:px-4 text-sm lg:text-base flex gap-1 md:gap-2 lg:gap-3 items-center hover:bg-foreground/5 rounded-md transition-all cursor-pointer`}
    >
      <ChevronRight
        className={`flex-shrink-0 w-4 h-4 ${
          open ? 'rotate-90' : ''
        } transition-transform`}
      />
      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mr-1" />
      <span className="flex items-center">{name}</span>
    </div>
  );
}

export default TestHeader;
