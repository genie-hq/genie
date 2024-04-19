"use client";
import React, { useState } from "react";
import TestComponent from "./components/TestComponent";
import { data } from "./data/data";

function page() {
  return (
    <div className="p-2 md:p-6 flex flex-col gap-2 bg-black w-full h-screen overflow-auto items-center">
      <h1 className="text-xl md:text-2xl flex items-center text-white md:m-2 lg:m-3">
        Test for branch X
      </h1>
      {data.map((_: any, i) => (
        <TestComponent testInfo={_} />
      ))}
    </div>
  );
}

export default page;
