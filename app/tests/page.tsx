"use client";
import React, { useState } from "react";
import TestComponent from "./components/TestComponent";
import { data } from "./data/data";

function page() {
  return (
    <div className="p-2 md:p-6 lg:p-12 flex flex-col gap-2 bg-black w-full h-screen overflow-auto items-center">
      {data.map((_: any, i) => (
        <TestComponent testInfo={_} />
      ))}
    </div>
  );
}

export default page;
