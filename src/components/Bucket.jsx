/** @format */

"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pot_ideal from "../../public/images/pot.webp";
import pot_broken from "../../public/images/broken pot.webp";
import pot_broken_fluid from "../../public/images/broken pot with fluid.webp";

// Import all color-specific pot images
import pot_broken_red from "../../public/images/colors/broken_pot_red.webp";
import pot_broken_blue from "../../public/images/colors/broken_pot_blue.webp";
import pot_broken_green from "../../public/images/colors/broken_pot_green.webp";
import pot_broken_yellow from "../../public/images/colors/broken_pot_yellow.webp";
import pot_broken_purple from "../../public/images/colors/broken_pot_purple.webp";
import pot_broken_pink from "../../public/images/colors/broken_pot_pink.webp";
import pot_broken_orange from "../../public/images/colors/broken_pot_orange.webp";
import pot_broken_teal from "../../public/images/colors/broken_pot_teal.webp";

// Import fluid images
import fluid_red from "../../public/images/fluid/fluid_red.webp";
import fluid_blue from "../../public/images/fluid/fluid_blue.webp";
import fluid_green from "../../public/images/fluid/fluid_green.webp";
import fluid_yellow from "../../public/images/fluid/fluid_yellow.webp";
import fluid_purple from "../../public/images/fluid/fluid_purple.webp";
import fluid_pink from "../../public/images/fluid/fluid_pink.webp";
import fluid_orange from "../../public/images/fluid/fluid_orange.webp";
import fluid_teal from "../../public/images/fluid/fluid_teal.webp";

// Updated Bucket component that works with preloaded images

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

  // Map of broken pot images by color
  const brokenPotImages = {
    red: pot_broken_red,
    blue: pot_broken_blue,
    green: pot_broken_green,
    yellow: pot_broken_yellow,
    purple: pot_broken_purple,
    pink: pot_broken_pink,
    orange: pot_broken_orange,
    teal: pot_broken_teal,
  };

  // Map of fluid images by color
  const fluidImages = {
    red: fluid_red,
    blue: fluid_blue,
    green: fluid_green,
    yellow: fluid_yellow,
    purple: fluid_purple,
    pink: fluid_pink,
    orange: fluid_orange,
    teal: fluid_teal,
  };

  // Determine which pot image to show based on bucket state
  const getPotImage = () => {
    if (bucket.isMatched) {
      // For matched buckets, show broken pot with color if available
      return pot_broken;
    } else if (bucket.isFlipped) {
      // For flipped but not matched, show pot with fluid
      return brokenPotImages[colorName] || pot_broken_fluid;
    }
    // Default state - intact pot
    return pot_ideal;
  };

  // Get fluid image for the animation
  const getFluidImage = () => {
    return fluidImages[colorName] || fluidImages.red; // Fallback to red if color not found
  };

  return (
    <div
      className="relative w-24 h-full cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}>
      {/* Use priority prop to tell Next.js to preload this specific image */}
      <Image
        src={getPotImage()}
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
            src={getFluidImage()}
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
