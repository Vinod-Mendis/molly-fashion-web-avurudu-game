/** @format */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Bucket({ bucket, onClick }) {
  const [showColorFlash, setShowColorFlash] = useState(false);

  // Watch for when bucket becomes matched
  useEffect(() => {
    if (bucket.isMatched) {
      setShowColorFlash(true);
      const timer = setTimeout(() => {
        setShowColorFlash(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [bucket.isMatched]);

  // Extract color name from the Tailwind class (e.g., "bg-red-500" -> "red")
  const getColorName = (colorClass) => {
    if (!colorClass) return "";
    const colorMatch = colorClass.match(/bg-(\w+)-\d+/);
    return colorMatch ? colorMatch[1] : "";
  };

  const colorName = getColorName(bucket.color);

  // Instead of using require(), use paths that match the preloaded images
  const getPotImagePath = () => {
    if (bucket.isMatched) {
      return `/images/colors/broken_pot_${colorName}.png`;
    } else if (bucket.isFlipped) {
      return `/images/colors/broken_pot_${colorName}.png`;
    }

    // Default state - intact pot
    return "/images/pot.png";
  };

  // Extract the color value from the Tailwind class for the flash effect
  const getColorValue = (colorClass) => {
    if (!colorClass) return "rgba(255, 255, 255, 0.5)"; // Default

    // Map common Tailwind colors to actual color values
    const colorMap = {
      red: "rgba(239, 68, 68, 0.7)", // red-500 with opacity
      blue: "rgba(59, 130, 246, 0.7)", // blue-500 with opacity
      green: "rgba(34, 197, 94, 0.7)", // green-500 with opacity
      yellow: "rgba(234, 179, 8, 0.7)", // yellow-500 with opacity
      purple: "rgba(168, 85, 247, 0.7)", // purple-500 with opacity
      pink: "rgba(236, 72, 153, 0.7)", // pink-500 with opacity
      orange: "rgba(249, 115, 22, 0.7)", // orange-500 with opacity
      teal: "rgba(20, 184, 166, 0.7)", // teal-500 with opacity
    };

    return colorMap[colorName] || "rgba(255, 255, 255, 0.7)";
  };

  return (
    <div
      className="relative w-24 h-full cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}>
      <Image
        src={getPotImagePath()}
        width={400}
        height={400}
        alt="pot"
        className="w-full h-auto"
        priority={true}
      />

      {/* Color flash overlay that appears when matched */}
      {showColorFlash && (
        <div className="animate-fade-out absolute -bottom-12 z-10 w-full">
          <Image
            src={`/images/fluid/fluid_${colorName}.png`}
            width={400}
            height={400}
            alt="fluid"
            className="w-full h-auto"
            priority={true}
          />
        </div>
      )}

      {/* Add a style block for the fadeOut animation */}
      <style jsx>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-fade-out {
          animation: fadeOut 1s ease-out forwards;
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
