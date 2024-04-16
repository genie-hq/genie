import React from "react";
import TestBlock from "./TestBlock";

function TestBody({ open, content }) {
  return (
    <div
      className={`${
        open ? "" : "hidden"
      } w-full h-fit p-1 m-1 mb-3 text-xs lg:text-sm flex flex-col items-center text-white rounded-md text-slate-200`}
    >
      {content.map((block, index) => (
        <TestBlock block={block} key={index} />
      ))}
    </div>
  );
}

export default TestBody;
