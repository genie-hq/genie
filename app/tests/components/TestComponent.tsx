import { useState } from "react";
import TestHeader from "./TestHeader";
import TestBody from "./TestBody";

function TestComponents({
  testInfo,
}: {
  testInfo: {
    name: string;
    content: {
      collapsed: boolean;
      lineContent: string[];
      startLine: number;
    }[];
  };
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    // alert(open);
    setOpen(!open);
  };
  return (
    <div className="w-full md:w-4/5 lg:w-3/5 flex flex-col">
      <TestHeader open={open} handleOpen={handleOpen} name={testInfo.name} />
      <TestBody open={open} content={testInfo.content} />
    </div>
  );
}

export default TestComponents;
