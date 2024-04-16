import React from 'react'

function TestHeader({open, handleOpen, name}) {
  return (
    <div
      onClick={() => handleOpen()}
      className={`${
        open ? "bg-slate-800" : ""
      } w-full h-8 lg:h-9 lg:px-4 text-sm lg:text-base flex gap-1 md:gap-2 lg:gap-3 items-center hover:bg-slate-800 text-white rounded-md transition-all text-slate-200 cursor-pointer`}
    >
      <svg
        className={`flex-shrink-0 ${
          open ? "rotate-90" : ""
        } transition-transform`}
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="false"
      >
        <path
          className="fill-slate-200"
          fill-rule="evenodd"
          d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
        ></path>
      </svg>
      <svg
        className=" flex-shrink-0 mr-1"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          className="fill-slate-200"
          d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"
        ></path>
      </svg>
      <span className="flex items-center">{name}</span>
    </div>
  );
}

export default TestHeader