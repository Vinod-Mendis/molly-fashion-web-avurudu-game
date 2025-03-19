/** @format */

"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import title from "../../public/images/title.png";
import logo from "../../public/images/molly logo.png";
import sun from "../../public/images/sun.png";
import rope from "../../public/images/rope.png";
import mandala from "../../public/images/mandala.png";
import mandala_b from "../../public/images/mandala-b.png";
import title_2 from "../../public/images/title-2.png";
import mandala_rules from "../../public/images/mandala-rules.png";
import Bucket from "../components/Bucket";

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

  // Initialize a preview of the game
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
  }, []);

  // Initialize the game level
  useEffect(() => {
    if (gameStatus === "playing") {
      initializeLevel(level);
    }
  }, [level, gameStatus, initializeLevel]);

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
          setGameStatus("won");
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
        setGameStatus("lost");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bggr">
      <div className="w-full flex flex-col items-center">
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
              <div className="bg-white py-6 px-10 rounded-b-2xl absolute top-0 left-20 z-10">
                <Image
                  src={logo || "/placeholder.svg"}
                  width={200}
                  height={200}
                  alt="logo"
                  // className="absolute top-14"
                />
              </div>
              <Image
                src={sun || "/placeholder.svg"}
                width={300}
                height={300}
                alt="sun"
                className="absolute top-0 right-0 z-10"
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
                onClick={showRulesPopup}
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
          <>
            <div className="flex items-center justify-center w-full max-w-md mb-6">
              <div className="flex flex-col gap-4 items-center absolute top-40">
                <div className="text-xl font-semibold mr-2 uppercase text-white">
                  Level {level}:
                </div>
                <span
                  className={`${levelTag.color} text-white px-12 py-2 rounded-full text-xl uppercase font-medium`}>
                  {levelTag.text}
                </span>
              </div>
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
                <div className="flex items-center justify-center mt-2">
                  <div className="text-xl font-semibold mr-2">Lives:</div>
                  <div className="flex">
                    {Array.from({ length: chances }).map((_, i) => (
                      <div key={i} className="w-6 h-6 text-red-500 mr-1">
                        ❤️
                      </div>
                    ))}
                    {Array.from({ length: INITIAL_CHANCES - chances }).map(
                      (_, i) => (
                        <div
                          key={i + chances}
                          className="w-6 h-6 text-gray-300 mr-1">
                          🖤
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {gameStatus === "won" && (
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <div className="text-4xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                <p className="mb-4">You&apos;ve completed all levels!</p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Play Again
                </button>
              </div>
            )}

            {gameStatus === "lost" && (
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Game Over</h2>
                <p className="mb-4">You&apos;ve run out of chances.</p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
