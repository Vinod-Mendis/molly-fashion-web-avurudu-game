/** @format */

// components/BackgroundMusic.js
import { useEffect, useState } from "react";

const BackgroundMusic = ({
  audioSrc = "../../public/audio/Eminem_-_Mockingbird.mp3",
}) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Create audio instance only on client-side
    if (typeof window !== "undefined") {
      const audioElement = new Audio(audioSrc);

      // Configure audio
      audioElement.loop = true;
      audioElement.volume = 0.5; // Set to 50% volume

      // Store in state
      setAudio(audioElement);

      // Play audio (handling autoplay restrictions)
      const playAudio = async () => {
        try {
          await audioElement.play();
          console.log("Background music started successfully");
        } catch (error) {
          console.warn("Autoplay prevented:", error);
          // Many browsers require user interaction before audio can play
          // We'll set up a one-time click handler to start playing

          const unlockAudio = () => {
            audioElement
              .play()
              .catch((e) => console.error("Still cannot play audio:", e));
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
          };

          document.addEventListener("click", unlockAudio);
          document.addEventListener("touchstart", unlockAudio);
        }
      };

      playAudio();

      // Clean up
      return () => {
        audioElement.pause();
        audioElement.src = "";
      };
    }
  }, [audioSrc]);

  return null; // No UI rendered
};

export default BackgroundMusic;
