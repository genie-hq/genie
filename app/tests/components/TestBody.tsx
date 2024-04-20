import TestBlock from './TestBlock';

function TestBody({
  open,
  content,
}: {
  open: boolean;
  content: {
    collapsed: boolean;
    lineContent: string[];
    startLine: number;
  }[];
}) {
  return (
    <div
      className={`${
        open ? '' : 'hidden'
      } w-full h-fit p-1 m-1 mb-3 text-xs lg:text-sm flex flex-col items-center rounded-md`}
    >
      {content.map((block, index) => (
        <TestBlock block={block} key={index} />
      ))}
    </div>
  );
}

export default TestBody;
