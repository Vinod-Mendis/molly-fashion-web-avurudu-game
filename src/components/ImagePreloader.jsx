/** @format */

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImagePreloader({
  images,
  onLoadingComplete,
  children,
}) {
  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate loading percentage
  const loadingPercentage = Math.round((loadedImages / images.length) * 100);

  useEffect(() => {
    // Skip preloading if no images provided
    if (!images || images.length === 0) {
      setIsLoading(false);
      onLoadingComplete && onLoadingComplete();
      return;
    }

    // Once all images are loaded, call the callback
    if (loadedImages === images.length) {
      setTimeout(() => {
        setIsLoading(false);
        onLoadingComplete && onLoadingComplete();
      }, 500); // Add a small delay for smoother transition
    }
  }, [loadedImages, images, onLoadingComplete]);

  // Handle successful image load
  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  return (
    <>
      {/* Loading screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#2A5286] flex flex-col items-center justify-center z-50">
          <div className="text-white text-2xl mb-4">Loading Game Assets</div>

          {/* Progress bar */}
          <div className="w-64 bg-gray-200 rounded-full h-4 mb-8">
            <div
              className="bg-[#B39B00] h-4 rounded-full transition-all duration-300"
              style={{ width: `${loadingPercentage}%` }}></div>
          </div>

          <div className="text-white">{loadingPercentage}%</div>
        </div>
      )}

      {/* Hidden container to load images */}
      <div className="hidden">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt="preload"
            width={1}
            height={1}
            onLoad={handleImageLoad}
            onError={handleImageLoad} // Count errors as loaded to prevent getting stuck
          />
        ))}
      </div>

      {/* Render children only after loading is complete */}
      {!isLoading && children}
    </>
  );
}
