/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import Bucket from "../components/Bucket";
import Image from "next/image";
import title from "../../public/images/title.webp";
import logo from "../../public/images/molly logo.webp";
import sun from "../../public/images/sun.webp";
import rope from "../../public/images/rope.webp";
import mandala from "../../public/images/mandala.webp";
import mandala_b from "../../public/images/mandala-b.webp";
import title_2 from "../../public/images/title-2.webp";
import mandala_rules from "../../public/images/mandala-rules.webp";
import kokis from "../../public/images/kokis.webp";

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

// Image Preloader Component
const ImagePreloader = ({ images }) => {
  return (
    <div style={{ display: "none" }}>
      {images.map((src, index) => (
        <img key={index} src={src.src} alt={`preload-${index}`} />
      ))}
    </div>
  );
};

// Game configuration constant
const INITIAL_CHANCES = 5;

export default function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [chances, setChances] = useState(INITIAL_CHANCES);
  const [buckets, setBuckets] = useState([]);
  const [selectedBuckets, setSelectedBuckets] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStatus, setGameStatus] = useState("preview"); // preview, rules, playing, won, lost
  const [isChecking, setIsChecking] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // All images that need preloading
  const imageList = [
    title,
    logo,
    sun,
    rope,
    mandala,
    mandala_b,
    title_2,
    mandala_rules,
    kokis,
    // Add all pot images
    pot_ideal,
    pot_broken,
    pot_broken_fluid,
    // Color-specific broken pots
    pot_broken_red,
    pot_broken_blue,
    pot_broken_green,
    pot_broken_yellow,
    pot_broken_purple,
    pot_broken_pink,
    pot_broken_orange,
    pot_broken_teal,
    // Fluid images
    fluid_red,
    fluid_blue,
    fluid_green,
    fluid_yellow,
    fluid_purple,
    fluid_pink,
    fluid_orange,
    fluid_teal,
  ];

  // Preload images when component mounts
  // Preload images when component mounts
useEffect(() => {
  const preloadImages = async () => {
    const promises = imageList.map((image) => {
      return new Promise((resolve, reject) => {
        // Use the global window.Image constructor instead of just Image
        const img = new window.Image();
        img.src = image.src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    try {
      await Promise.all(promises);
      setImagesLoaded(true);
      console.log("All images preloaded successfully");
    } catch (error) {
      console.error("Failed to preload images:", error);
      // Still set as loaded even if some images fail, so the game can proceed
      setImagesLoaded(true);
    }
  };

  preloadImages();
}, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Colors for the buckets
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  // Initialize the game preview
  const initializePreview = () => {
    const pairsCount = 2; // 4 buckets for preview

    // Create pairs of colors
    let bucketColors = [];
    for (let i = 0; i < pairsCount; i++) {
      bucketColors.push(colors[i], colors[i]);
    }

    // Shuffle the colors
    bucketColors = bucketColors.sort(() => Math.random() - 0.5);

    // Create bucket objects
    const newBuckets = bucketColors.map((color, index) => ({
      id: index,
      color: color,
      isFlipped: false,
      isMatched: false,
    }));

    setBuckets(newBuckets);
  };

  // Initialize a level with the appropriate number of buckets
  const initializeLevel = (currentLevel) => {
    let pairsCount = 0;

    // Determine number of pairs based on level
    if (currentLevel === 1) pairsCount = 2; // 4 buckets
    else if (currentLevel === 2) pairsCount = 3; // 6 buckets
    else pairsCount = 4; // 8 buckets (level 3)

    // Create pairs of colors
    let bucketColors = [];
    for (let i = 0; i < pairsCount; i++) {
      bucketColors.push(colors[i], colors[i]);
    }

    // Shuffle the colors
    bucketColors = bucketColors.sort(() => Math.random() - 0.5);

    // Create bucket objects
    const newBuckets = bucketColors.map((color, index) => ({
      id: index,
      color: color,
      isFlipped: false,
      isMatched: false,
    }));

    setBuckets(newBuckets);
    setSelectedBuckets([]);
    setMatchedPairs(0);
  };

  // Initialize the game preview
  useEffect(() => {
    initializePreview();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize the game level
  useEffect(() => {
    if (gameStatus === "playing") {
      initializeLevel(level);
    }
  }, [level, gameStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle bucket click
  const handleBucketClick = (bucket) => {
    // Prevent clicking if already checking a pair or bucket is already flipped
    if (
      isChecking ||
      bucket.isFlipped ||
      bucket.isMatched ||
      gameStatus !== "playing"
    )
      return;

    // If already selected 2 buckets, return
    if (selectedBuckets.length === 2) return;

    // Flip the bucket
    const updatedBuckets = buckets.map((b) =>
      b.id === bucket.id ? { ...b, isFlipped: true } : b
    );
    setBuckets(updatedBuckets);

    // Add to selected buckets
    const updatedSelected = [...selectedBuckets, bucket];
    setSelectedBuckets(updatedSelected);

    // If we've selected 2 buckets, check for a match
    if (updatedSelected.length === 2) {
      setIsChecking(true);
      setTimeout(() => {
        checkForMatch(updatedSelected);
        setIsChecking(false);
      }, 1000);
    }
  };

  // Check if selected buckets match
  const checkForMatch = (selected) => {
    if (selected[0].color === selected[1].color) {
      // Match found
      const updatedBuckets = buckets.map((b) =>
        b.id === selected[0].id || b.id === selected[1].id
          ? { ...b, isMatched: true }
          : b
      );
      setBuckets(updatedBuckets);
      setMatchedPairs(matchedPairs + 1);

      // Check if level is complete
      if (matchedPairs + 1 === buckets.length / 2) {
        if (level === 3) {
          // Game won
          setTimeout(() => {
            setGameStatus("won");
          }, 2000);
        } else {
          // Advance to next level
          setTimeout(() => {
            setLevel(level + 1);
          }, 1000);
        }
      }
    } else {
      // No match
      const updatedBuckets = buckets.map((b) =>
        (b.id === selected[0].id || b.id === selected[1].id) && !b.isMatched
          ? { ...b, isFlipped: false }
          : b
      );
      setBuckets(updatedBuckets);

      // Lose a chance
      const newChances = chances - 1;
      setChances(newChances);

      // Check if game over
      if (newChances === 0) {
        setTimeout(() => {
          setGameStatus("lost");
        }, 1000);
      }
    }

    // Clear selected buckets
    setSelectedBuckets([]);
  };

  // Show rules popup
  const showRulesPopup = () => {
    setShowRules(true);
  };

  // Start the game
  const startGame = () => {
    setLevel(1);
    setChances(INITIAL_CHANCES);
    setShowRules(false);
    setGameStatus("playing");
  };

  // Reset the game
  const resetGame = () => {
    setLevel(1);
    setChances(INITIAL_CHANCES);
    setGameStatus("preview");
    setShowRules(false);
    initializePreview();
  };

  // Get level tag details
  const getLevelTag = () => {
    switch (level) {
      case 1:
        return {
          text: "Easy",
          color: "bg-gradient-to-r from-green-400 to-green-600",
        };
      case 2:
        return {
          text: "Medium",
          color: "bg-gradient-to-r from-orange-400 to-orange-600",
        };
      case 3:
        return {
          text: "Hard",
          color: "bg-gradient-to-r from-red-400 to-red-600",
        };
      default:
        return {
          text: "Easy",
          color: "bg-gradient-to-r from-green-400 to-green-600",
        };
    }
  };

  const levelTag = getLevelTag();

  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Initialize audio in useEffect to ensure it happens after component mount
    const audioElement = new Audio("/audio/sound2.wav");

    // Add volume control (0.0 to 1.0, where 1.0 is full volume)
    const volume = 0.1; // 50% volume, adjust as needed
    audioElement.volume = volume;

    setAudio(audioElement);

    // Optional: Clean up on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const playAudio = () => {
    if (audio) {
      // Reset the audio position if it was already played
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("Audio playback error:", err));
    }
  };

  // playAudio();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <ImagePreloader images={imageList} />
      {/* Only render game content when images are loaded or after timeout */}
      {imagesLoaded ? (
        <div className="w-full flex flex-col items-center">
          {/* Clouds >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <div id="clouds">
            <div className="cloud x1"></div>
            <div className="cloud x2"></div>
            <div className="cloud x3"></div>
            <div className="cloud x4"></div>
            <div className="cloud x5"></div>
            <div className="cloud x6"></div>
            <div className="cloud x7"></div>
          </div>
          {/* Clouds >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {/* birds >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          <div className="overflow-hidden absolute inset-0">
            <div className="bird-container bird-container-one">
              <div className="bird bird-one"></div>
            </div>
            <div className="bird-container bird-container-two">
              <div className="bird bird-two"></div>
            </div>
            <div className="bird-container bird-container-three">
              <div className="bird bird-three"></div>
            </div>
            <div className="bird-container bird-container-four">
              <div className="bird bird-four"></div>
            </div>
          </div>
          {/* birds >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          <Image
            src={mandala || "/placeholder.svg"}
            width={200}
            height={200}
            alt="mandala"
            className="absolute bottom-0 right-0 z-10 opacity-20"
          />
          <Image
            src={mandala || "/placeholder.svg"}
            width={200}
            height={200}
            alt="mandala"
            className="absolute bottom-0 left-0 z-10 opacity-20 rotate-90"
          />
          <Image
            src={mandala_b || "/placeholder.svg"}
            width={400}
            height={400}
            alt="mandala-b"
            className="absolute bottom-0 z-10 opacity-5"
          />

          <Image
            src={rope || "/placeholder.svg"}
            width={"auto"}
            height={"auto"}
            alt="rope"
            className="absolute top-85 z-10"
          />

          <div className="bg-gradient-to-b from-[#2A5286] to-[#2A5286/0] w-full flex justify-center items-center absolute top-0 py-10">
            {gameStatus !== "playing" && (
              <>
                <div className="bg-white py-6 px-10 rounded-b-2xl absolute top-0 sm:left-20 z-10">
                  <Image
                    src={logo || "/placeholder.svg"}
                    width={200}
                    height={200}
                    alt="logo"
                    className=""
                  />
                </div>
                <Image
                  src={sun || "/placeholder.svg"}
                  width={100}
                  height={100}
                  alt="sun"
                  className="absolute top-0 right-0 z-10 sm:w-[280px]"
                />
                <Image
                  src={title || "/placeholder.svg"}
                  width={560}
                  height={560}
                  alt="title"
                  // className="absolute top-14"
                />
              </>
            )}
          </div>

          {gameStatus === "preview" && (
            <div className="relative w-full h-screen flex justify-center items-center">
              <div className="grid grid-cols-2 sm:flex gap-14 opacity-80 absolute top-85 z-10">
                {buckets.map((bucket) => (
                  <Bucket key={bucket.id} bucket={bucket} onClick={() => {}} />
                ))}
              </div>

              <div className="absolute z-10 bottom-20 w-full flex items-center justify-center">
                <button
                  onClick={() => {
                    showRulesPopup();
                    playAudio();
                  }}
                  className="px-8 py-4 bg-[#B39B00] border-2 border-white shadow-2xl shadow-black/70 cursor-pointer text-white rounded-lg hover:bg-[#816F00] transition-colors text-xl font-bold">
                  Play
                </button>
              </div>
            </div>
          )}

          {/* Rules Popup */}
          {showRules && (
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl max-w-lg w-full text-center flex flex-col gap-5 justify-center items-center">
                <div className="relative overflow-hidden rounded-3xl py-8 shadow-2xl max-w-lg w-full text-center flex flex-col gap-5 justify-center items-center z-10">
                  <div className="w-full flex justify-center items-center relative z-0 px-8">
                    {/* Logo Image (Lowest z-index, behind everything) */}
                    <Image
                      src={logo || "/placeholder.svg"}
                      width={500}
                      height={500}
                      alt="logo"
                      className="absolute opacity-10 -z-10"
                    />
                    {/* Title Image (Higher z-index) */}
                    <Image
                      src={title_2 || "/placeholder.svg"}
                      width={300}
                      height={300}
                      alt="title-2"
                      className="relative z-10"
                    />
                  </div>

                  <div className="overflow-hidden bg-gradient-to-r from-[#B39B00] via-[#897700] to-[#B39B00] w-full flex justify-center items-center py-2 relative">
                    <h2 className="text-xl text-white uppercase font-bold relative z-10">
                      Rules
                    </h2>
                    <Image
                      src={mandala_rules || "/placeholder.svg"}
                      width={300}
                      height={300}
                      alt="logo"
                      className="absolute z-0 opacity-30"
                    />
                  </div>

                  <ul className="text-left space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">1.</span>
                      <span>Click on buckets to find matching color pairs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2.</span>
                      <span>
                        You have {INITIAL_CHANCES} lives to complete each level
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>Complete all 3 levels to win the game</span>
                    </li>
                  </ul>

                  <button
                    onClick={startGame}
                    className="px-8 py-2 bg-[#B39B00] border-2 border-white shadow-xl shadow-black/20 cursor-pointer text-white rounded-lg hover:bg-[#816F00] transition-colors text-xl font-bold mt-6">
                    Start Game
                  </button>
                </div>

                <div className="absolute bottom-0 w-full h-44 bg-gradient-to-t from-[#B38C00]/50 to-[#B38C00/0]"></div>
              </div>
            </div>
          )}

          {gameStatus !== "preview" && !showRules && (
            <div className="bg-yellow-400">
              <div className="flex items-center justify-center w-full max-w-md mb-6">
                {gameStatus !== "won" && gameStatus !== "lost" && (
                  <div className="flex flex-col gap-4 items-center absolute top-40">
                    <div className="text-xl font-semibold mr-2 uppercase text-white">
                      Level {level}:
                    </div>
                    <span
                      className={`${levelTag.color} text-white px-12 py-2 rounded-full text-xl uppercase font-medium`}>
                      {levelTag.text}
                    </span>
                  </div>
                )}
              </div>

              {gameStatus === "playing" && (
                <div className="flex flex-col items-center">
                  <div
                    className={`grid grid-cols-4 sm:flex  gap-10 absolute top-85 z-10`}>
                    {buckets.map((bucket) => (
                      <Bucket
                        key={bucket.id}
                        bucket={bucket}
                        onClick={() => handleBucketClick(bucket)}
                      />
                    ))}
                  </div>

                  {/* Lives just under the buckets */}
                  <div className="flex flex-col gap-4 items-center justify-center absolute bottom-0 bg-gradient-to-t from-green-800/65 w-full h-56">
                    <div className="text-xl font-semibold uppercase">
                      Lives:
                    </div>
                    <div className="flex gap-4">
                      {Array.from({ length: chances }).map((_, i) => (
                        <div key={i}>
                          <Image
                            src={kokis}
                            width={50}
                            height={50}
                            alt="mandala"
                            className=""
                          />
                        </div>
                      ))}
                      {Array.from({ length: INITIAL_CHANCES - chances }).map(
                        (_, i) => (
                          <div
                            key={i + chances}
                            className="text-gray-300 opacity-30">
                            <Image
                              src={kokis}
                              width={50}
                              height={50}
                              alt="mandala"
                              className=""
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {gameStatus === "won" && (
                <div className="flex items-center justify-center bg-black/50 w-full h-screen absolute inset-0 z-10">
                  <div className="py-10 w-fit text-center bg-white rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="w-full bg-gradient-to-t from-[#B39B00]/40 absolute h-20 bottom-0 left-0" />
                    <div className="overflow-hidden bg-gradient-to-r from-[#B39B00] via-[#897700] to-[#B39B00] w-full flex justify-center items-center py-2 relative">
                      <h2 className="text-xl text-white uppercase font-bold relative z-10">
                        Congratulations!
                      </h2>
                      <Image
                        src={mandala_rules || "/placeholder.svg"}
                        width={300}
                        height={300}
                        alt="logo"
                        className="absolute z-0 opacity-30"
                      />
                    </div>
                    <p className="mb-4 text-xl px-10 mt-5">
                      You&apos;ve completed all levels!
                    </p>
                    {/* <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Try Again
              </button> */}
                  </div>
                </div>
              )}

              {gameStatus === "lost" && (
                <div className="flex items-center justify-center bg-black/50 w-full h-screen absolute inset-0 z-10">
                  <div className="py-10 w-fit text-center bg-white rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="w-full bg-gradient-to-t from-[#B39B00]/40 absolute h-20 bottom-0 left-0" />
                    <div className="overflow-hidden bg-gradient-to-r from-[#B39B00] via-[#897700] to-[#B39B00] w-full flex justify-center items-center py-2 relative">
                      <h2 className="text-xl text-white uppercase font-bold relative z-10">
                        GAME OVER
                      </h2>
                      <Image
                        src={mandala_rules || "/placeholder.svg"}
                        width={300}
                        height={300}
                        alt="logo"
                        className="absolute z-0 opacity-30"
                      />
                    </div>
                    <p className="mb-4 text-xl px-10 mt-5">
                      You&apos;ve run out of chances.
                    </p>
                    {/* <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Try Again
                </button> */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Show loading indicator while images are loading
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-[#B39B00] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl">Loading game...</p>
          </div>
        </div>
      )}
    </div>
  );
}
