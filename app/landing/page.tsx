import React from 'react';
import Image from 'next/image';

function page() {
  return (
    <div className="flex gap-12 p-4 h-full items-center relative">
      <div className="flex flex-col w-full md:w-1/2 pl-4 md:pl-16 gap-4 md:gap-6 tracking-tight z-10 shrink-0">
        <h1 className="text-3xl md:text-5xl">
          Automated Test Case Generation with CI/CD
        </h1>
        <h2 className="text-md md:text-lg ">
          Enjoy a seamless experience with our automated test case generation.
        </h2>
        <div className="flex gap-4">
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden  font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Get started
            </span>
          </button>
          <button className="flex items-center">It's free</button>
        </div>
      </div>
      <div className="absolute opacity-30 md:opacity-100 md:relative bottom-0 right-0 w-full h-full p-12 flex items-center">
        <Image
          src="/decorative.png"
          // src="/decorative.png"
          className="object-contain"
          height={500}
          width={500}
          alt="Decorative"
        />
      </div>
    </div>
  );
}

export default page;
