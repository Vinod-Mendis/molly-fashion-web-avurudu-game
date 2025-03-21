/** @format */
"use client";

import { useState, useEffect } from "react";

const useAssetLoader = (initialAssetPaths) => {
  const [loadedAssets, setLoadedAssets] = useState({});
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [existingAssetPaths, setExistingAssetPaths] = useState([]);

  // Start loading assets directly without existence check
  useEffect(() => {
    if (!initialAssetPaths || initialAssetPaths.length === 0) {
      setIsLoading(false);
      setProgress(100);
      setFullyLoaded(true);
      console.log("No assets to load. Setting progress to 100%");
      return;
    }

    console.log(`Starting to load ${initialAssetPaths.length} assets...`);
    setExistingAssetPaths(initialAssetPaths);
  }, [initialAssetPaths]);

  // Load all files and handle errors gracefully
  useEffect(() => {
    // Skip if no assets to load
    if (!existingAssetPaths || existingAssetPaths.length === 0) {
      if (initialAssetPaths.length === 0) {
        // Only set these if we didn't already set them
        setIsLoading(false);
        setProgress(100);
        setFullyLoaded(true);
      }
      return;
    }

    console.log(
      `Starting to load ${existingAssetPaths.length} verified assets...`
    );

    const totalAssets = existingAssetPaths.length;
    let loadedCount = 0;
    const newLoadedAssets = {};
    const loadingPromises = [];

    // Update progress
    const updateProgress = (path) => {
      loadedCount++;
      // Cap progress at 95% until everything is completely loaded
      // This gives visual feedback that loading is still in progress
      const rawProgress = (loadedCount / totalAssets) * 100;
      const cappedProgress = Math.min(rawProgress, 95);
      console.log(
        `Loaded: ${path} (${loadedCount}/${totalAssets}, ${rawProgress.toFixed(
          2
        )}% - displayed: ${cappedProgress.toFixed(2)}%)`
      );
      setProgress(cappedProgress);
    };

    // Load all assets
    existingAssetPaths.forEach((path) => {
      const fileExtension = path.split(".").pop().toLowerCase();

      if (
        ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(fileExtension)
      ) {
        // Load images
        console.log(`Loading image: ${path}`);
        const loadPromise = new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = () => {
            newLoadedAssets[path] = img;
            updateProgress(path);
            resolve(path);
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            updateProgress(path);
            reject(new Error(`Failed to load: ${path}`));
          };

          // Set a longer timeout for large images
          const timeoutId = setTimeout(() => {
            console.warn(`Image load timed out: ${path}`);
            updateProgress(path);
            resolve(path); // Resolve anyway to avoid blocking the game
          }, 10000); // 10 second timeout

          img.onload = () => {
            clearTimeout(timeoutId);
            newLoadedAssets[path] = img;
            updateProgress(path);
            resolve(path);
          };

          img.src = path;

          // If the image is already cached, it might not trigger onload
          if (img.complete) {
            clearTimeout(timeoutId);
            newLoadedAssets[path] = img;
            updateProgress(path);
            resolve(path);
          }
        });

        loadingPromises.push(loadPromise);
      } else if (["mp3", "wav", "ogg"].includes(fileExtension)) {
        // Load audio
        console.log(`Loading audio: ${path}`);
        const loadPromise = new Promise((resolve, reject) => {
          const audio = new Audio();

          audio.oncanplaythrough = () => {
            newLoadedAssets[path] = audio;
            updateProgress(path);
            audio.oncanplaythrough = null;
            resolve(path);
          };

          audio.onerror = () => {
            console.error(`Failed to load audio: ${path}`);
            updateProgress(path);
            reject(new Error(`Failed to load: ${path}`));
          };

          // Set timeout for audio as well
          const timeoutId = setTimeout(() => {
            console.warn(`Audio load timed out: ${path}`);
            updateProgress(path);
            resolve(path); // Resolve anyway to avoid blocking the game
          }, 10000); // 10 second timeout

          audio.oncanplaythrough = () => {
            clearTimeout(timeoutId);
            newLoadedAssets[path] = audio;
            updateProgress(path);
            audio.oncanplaythrough = null;
            resolve(path);
          };

          audio.src = path;
          audio.load();
        });

        loadingPromises.push(loadPromise);
      } else {
        // For other file types, just mark as loaded
        console.warn(`Unsupported file type for preloading: ${path}`);
        updateProgress(path);
        loadingPromises.push(Promise.resolve(path));
      }
    });

    // Wait for all assets to load before hiding the loading screen
    Promise.allSettled(loadingPromises).then((results) => {
      console.log("All assets loading attempts completed");

      // Count successful loads
      const successful = results.filter((r) => r.status === "fulfilled").length;
      console.log(`Successfully loaded ${successful}/${totalAssets} assets`);

      // Set assets
      setLoadedAssets(newLoadedAssets);

      // Add a delay to ensure all assets are fully rendered before hiding the loading screen
      setTimeout(() => {
        setIsLoading(false);
        setFullyLoaded(true);
        console.log("Loading screen can now be hidden");
      }, 1000); // 1 second delay
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up asset loader");
      // Cancel any pending loads
      Object.values(newLoadedAssets).forEach((asset) => {
        if (asset instanceof HTMLAudioElement) {
          asset.oncanplaythrough = null;
          asset.onerror = null;
        } else if (asset instanceof HTMLImageElement) {
          asset.onload = null;
          asset.onerror = null;
        }
      });
    };
  }, [existingAssetPaths, initialAssetPaths.length]);

  return { loadedAssets, progress, isLoading, fullyLoaded };
};

export default useAssetLoader;
