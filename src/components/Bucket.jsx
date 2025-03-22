/** @format */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  pot_ideal,
  pot_broken,
  pot_broken_fluid,
  pot_fluid_red,
  pot_fluid_blue,
  pot_fluid_green,
  pot_fluid_yellow,
  pot_fluid_purple,
  pot_fluid_pink,
  pot_fluid_orange,
  pot_fluid_teal,
  fluid_red,
  fluid_blue,
  fluid_green,
  fluid_yellow,
  fluid_purple,
  fluid_pink,
  fluid_orange,
  fluid_teal,
} from "../utils/image-paths";

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

  // Get the appropriate image based on bucket state and color
  const getPotImage = () => {
    if (bucket.isMatched) {
      // For matched buckets, show broken pot
      return pot_broken;
    } else if (bucket.isFlipped) {
      // For flipped buckets, show pot with color
      switch (colorName) {
        case "red":
          return pot_fluid_red;
        case "blue":
          return pot_fluid_blue;
        case "green":
          return pot_fluid_green;
        case "yellow":
          return pot_fluid_yellow;
        case "purple":
          return pot_fluid_purple;
        case "pink":
          return pot_fluid_pink;
        case "orange":
          return pot_fluid_orange;
        case "teal":
          return pot_fluid_teal;
        default:
          return pot_broken_fluid; // Fallback
      }
    }

    // Default state - intact pot
    return pot_ideal;
  };

  // Get fluid image based on color
  const getFluidImage = () => {
    switch (colorName) {
      case "red":
        return fluid_red;
      case "blue":
        return fluid_blue;
      case "green":
        return fluid_green;
      case "yellow":
        return fluid_yellow;
      case "purple":
        return fluid_purple;
      case "pink":
        return fluid_pink;
      case "orange":
        return fluid_orange;
      case "teal":
        return fluid_teal;
      default:
        return fluid_red; // Fallback
    }
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

  const potImage = getPotImage();
  const fluidImage = getFluidImage();

  return (
    <div
      className="relative w-24 h-full cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}>
      <Image
        src={potImage}
        width={400}
        height={400}
        alt="pot"
        className="w-full h-auto"
      />

      {/* Color flash overlay that appears when matched */}
      {showColorFlash && (
        <div className="animate-fade-out absolute -bottom-12 z-10 w-full">
          <Image
            src={fluidImage}
            width={400}
            height={400}
            alt="fluid"
            className="w-full h-auto"
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
