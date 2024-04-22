import React from 'react';
import Image from 'next/image';
import coding_img from './code_test_view.png';
import Link from 'next/link';

function page() {
  return (
    <div className="w-full h-full flex flex-col pt-20 items-center">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="flex flex-col w-full md:w-1/2 md:pl-16 gap-4 md:gap-8">
          <h1 className="text-lg md:text-2xl font-semibold">
            <span className="overflow-hidden bg-gradient-to-r bg-clip-text font-bold text-transparent dark:from-pink-300 dark:via-amber-200 dark:to-blue-300 from-pink-600 via-purple-500 to-sky-500">
              Intelligenie.ai
            </span>
          </h1>

          <h1 className="text-3xl md:text-4xl font-bold max-w-96">
            Automated Test Case Generation with CI/CD
          </h1>

          <div className="flex flex-col max-w-md gap-2 text-lg">
            <div>"Skip test file creation. Genie automates it.</div>
            Focus on bigger tasks."
            <div className="font-bold text-sm mr-6"></div>
          </div>

          <div className="flex gap-4">
            <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden  font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
              <Link
                href="/login"
                className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
              >
                Get started
              </Link>
            </button>
            <button className="flex items-center">It's free</button>
          </div>
        </div>

        <Image
          src={coding_img}
          // src="/decorative.png"
          className="object-contain"
          height={450}
          width={450}
          alt="Decorative"
        />
      </div>
    </div>
  );
}

export default page;
