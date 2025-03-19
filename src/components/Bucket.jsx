/** @format */

"use client";
import Image from "next/image";
import pot_ideal from "../../public/images/pot.png";

export default function Bucket({ bucket, onClick }) {
  // Extract color name from the Tailwind class (e.g., "bg-red-500" -> "red")
  const getColorName = (colorClass) => {
    if (!colorClass) return "";
    const colorMatch = colorClass.match(/bg-(\w+)-\d+/);
    return colorMatch ? colorMatch[1] : "";
  };

  const colorName = getColorName(bucket.color);

  // Determine which pot image to show based on bucket state
  const getPotImage = () => {
    // If we have color-specific pot images
    try {
      if (bucket.isMatched) {
        // For matched buckets, show broken pot with color
        return require(`../../public/images/pot_broken_${colorName}.png`);
      } else if (bucket.isFlipped) {
        // For flipped but not matched, show pot with fluid of color
        return require(`../../public/images/colors/broken_pot_${colorName}.png`);
      }
    } catch (error) {
      // Fallback to generic images if color-specific ones aren't available
      if (bucket.isMatched) {
        return require("../../public/images/broken pot.png");
      } else if (bucket.isFlipped) {
        return require("../../public/images/broken pot with fluid.png");
      }
    }

    // Default state - intact pot
    return pot_ideal;
  };

  return (
    <div
      className="relative w-24 h-32 cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}>
      <Image
        src={getPotImage() || "/placeholder.svg"}
        width={400}
        height={400}
        alt="pot"
        className="w-full h-auto"
      />
    </div>
  );
}
