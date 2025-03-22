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
  const [errorImages, setErrorImages] = useState([]);

  // Calculate loading percentage
  const totalImages = images?.length || 0;
  const loadingPercentage =
    totalImages > 0 ? Math.round((loadedImages / totalImages) * 100) : 100;

  useEffect(() => {
    // Skip preloading if no images provided
    if (!images || images.length === 0) {
      setIsLoading(false);
      onLoadingComplete && onLoadingComplete();
      return;
    }

    // Debug info
    console.log(`Preloading ${images.length} images`);

    // Once all images are loaded, call the callback
    if (loadedImages === images.length) {
      console.log("All images loaded successfully");
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

  // Handle image error
  const handleImageError = (src) => {
    console.error(`Failed to load image: ${src}`);
    setErrorImages((prev) => [...prev, src]);
    handleImageLoad(); // Count errors as loaded to prevent getting stuck
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

          {errorImages.length > 0 && (
            <div className="text-red-300 mt-4 text-sm">
              Failed to load {errorImages.length} image(s)
            </div>
          )}
        </div>
      )}

      {/* Hidden container to load images */}
      <div className="hidden">
        {images &&
          images.map((src, index) => {
            // Skip null or undefined image paths
            if (!src) {
              console.warn(`Image ${index} has no source`);
              handleImageLoad(); // Count as loaded to prevent getting stuck
              return null;
            }

            return (
              <Image
                key={index}
                src={src}
                alt={`preload-${index}`}
                width={1}
                height={1}
                onLoad={handleImageLoad}
                onError={() => handleImageError(src)}
                priority={index < 5} // Prioritize first few images
              />
            );
          })}
      </div>

      {/* Render children only after loading is complete */}
      {!isLoading && children}
    </>
  );
}
