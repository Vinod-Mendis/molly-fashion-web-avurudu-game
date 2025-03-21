/** @format */
"use client";

import React from "react";
import Image from "next/image";
import mandala from "../../public/images/mandala.png";

const LoadingScreen = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-[#2A5286] to-[#5A92D6]">
      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Animated mandala */}
        <Image
          src={mandala || "/placeholder.svg"}
          width={150}
          height={150}
          alt="mandala"
          className="animate-spin opacity-40 absolute"
          style={{ animationDuration: "10s" }}
        />

        <div className="text-white text-2xl font-bold mb-4 mt-40 z-10">
          Loading Game...
        </div>

        {/* Progress bar */}
        <div className="w-64 h-5 bg-white/20 rounded-full overflow-hidden border-2 border-white">
          <div
            className="h-full bg-[#B39B00] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-white mt-2">{Math.round(progress)}%</div>

        {/* Loading indicator animation */}
        <div className="flex mt-4">
          <div
            className="animate-bounce mx-1 h-2 w-2 bg-white rounded-full"
            style={{ animationDelay: "0ms" }}></div>
          <div
            className="animate-bounce mx-1 h-2 w-2 bg-white rounded-full"
            style={{ animationDelay: "150ms" }}></div>
          <div
            className="animate-bounce mx-1 h-2 w-2 bg-white rounded-full"
            style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
