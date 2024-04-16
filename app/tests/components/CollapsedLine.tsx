import React from "react";

function CollapsedLine({ line, open, index, handleOpen, startLine }) {
  const isHead = index === 0;
  return (
    <div
      className={`${
        isHead || open ? "" : " hidden "
      } w-full flex items-center gap-1 hover:bg-gray-800`}
      onClick={() => isHead && handleOpen()}
    >
      <a className="text-slate-300 underline hover:text-blue-500 cursor-pointer flex justify-end w-6 md:w-8 lg:w-10 shrink-0 self-start">
        {startLine + index}
      </a>
      {isHead && (
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
      )}
      <span
        className={`${
          isHead ? "cursor-pointer " : "pl-5"
        } flex items-center w-full `}
      >
        {line}
      </span>
    </div>
  );
}

export default CollapsedLine;
