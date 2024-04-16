import React from 'react'

function TestBody({open, content}) {
  return (
    <div
      className={`${open ? "" : "hidden"} w-full h-fit p-1 pl-8 lg:pl-12 m-1 text-xs lg:text-sm flex items-center text-white rounded-md text-slate-200`}
    >
      <span className="flex items-center">{content}</span>
    </div>
  );
}

export default TestBody