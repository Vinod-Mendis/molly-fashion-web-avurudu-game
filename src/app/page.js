/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import Bucket from "../components/Bucket";
import LoadingScreen from "../components/LoadingScreen ";
import useAssetLoader from "../hooks/useAssetLoader ";
import Image from "next/image";
import title from "../../public/images/title.png";
import logo from "../../public/images/molly logo.png";
import sun from "../../public/images/sun.png";
import rope from "../../public/images/rope.png";
import mandala from "../../public/images/mandala.png";
import mandala_b from "../../public/images/mandala-b.png";
import title_2 from "../../public/images/title-2.png";
import mandala_rules from "../../public/images/mandala-rules.png";
import kokis from "../../public/images/kokis.png";

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
  const [audio, setAudio] = useState(null);

  // Game assets to preload
  const [assetPaths, setAssetPaths] = useState([]);
  const { loadedAssets, progress, isLoading, fullyLoaded } =
    useAssetLoader(assetPaths);

  // Set up assets to preload on component mount
  useEffect(() => {
    if (isMounted) {
      // Define all the specific files we need to load
      const images = [
        "/images/title.png",
        "/images/molly logo.png",
        "/images/sun.png",
        "/images/rope.png",
        "/images/mandala.png",
        "/images/mandala-b.png",
        "/images/title-2.png",
        "/images/mandala-rules.png",
        "/images/kokis.png",
        "/images/pot.png",
        "/images/broken pot.png",
        "/images/broken pot with fluid.png",
      ];

      const fluid = [
        "/images/fluid/fluid_blue.png",
        "/images/fluid/fluid_green.png",
        "/images/fluid/fluid_orange.png",
        "/images/fluid/fluid_pink.png",
        "/images/fluid/fluid_purple.png",
        "/images/fluid/fluid_red.png",
        "/images/fluid/fluid_teal.png",
        "/images/fluid/fluid_yellow.png",
      ];

      const color = [
        "/images/colors/broken_pot_blue.png",
        "/images/colors/broken_pot_green.png",
        "/images/colors/broken_pot_orange.png",
        "/images/colors/broken_pot_pink.png",
        "/images/colors/broken_pot_purple.png",
        "/images/colors/broken_pot_red.png",
        "/images/colors/broken_pot_teal.png",
        "/images/colors/broken_pot_yellow.png",
      ];

      const audioFiles = ["/audio/sound2.wav"];

      // Combine all asset paths
      setAssetPaths([...images, ...fluid, ...color, ...audioFiles]);

      console.log(
        `Setting up ${
          images.length + fluid.length + color.length + audioFiles.length
        } assets to load`
      );
    }
  }, [isMounted]);

  // Set isMounted after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Initialize audio in useEffect to ensure it happens after assets are loaded
    if (fullyLoaded && isMounted) {
      const audioElement = new Audio("/audio/sound2.wav");
      // Add volume control (0.0 to 1.0, where 1.0 is full volume)
      const volume = 0.1; // 10% volume
      audioElement.volume = volume;
      setAudio(audioElement);
    }

    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [fullyLoaded, isMounted]);

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

  // Initialize the game preview once assets are loaded
  useEffect(() => {
    if (fullyLoaded && isMounted) {
      initializePreview();
    }
  }, [fullyLoaded, isMounted]);

  // Initialize the game level
  useEffect(() => {
    if (gameStatus === "playing" && fullyLoaded) {
      initializeLevel(level);
    }
  }, [level, gameStatus, fullyLoaded]);

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

  const playAudio = () => {
    if (audio) {
      // Reset the audio position if it was already played
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("Audio playback error:", err));
    }
  };

  // Show loading screen if loading assets
  if (!fullyLoaded) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
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

        {/* Rest of the component remains the same as in your original code */}
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
                  <div className="text-xl font-semibold uppercase">Lives:</div>
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
    </div>
  );
}
