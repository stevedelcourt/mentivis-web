"use client";
import { useState, useEffect, useCallback } from "react";

type Phase = "typing" | "pausing" | "deleting";

type UseTypewriterOptions = {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseType?: number;
  pauseDelete?: number;
  loop?: boolean;
};

type UseTypewriterReturn = {
  displayedText: string;
  isTyping: boolean;
  isDeleting: boolean;
  isPausing: boolean;
};

export function useTypewriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 60,
  pauseType = 2200,
  pauseDelete = 400,
  loop = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [phase, setPhase] = useState<Phase>("typing");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const currentWord = words[wordIndex];

  const nextWord = useCallback(() => {
    setCharIndex(0);
    setWordIndex((prev) => (prev + 1) % words.length);
    setPhase("typing");
  }, [words.length]);

  useEffect(() => {
    if (words.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, typeSpeed);
      } else {
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => {
        setPhase("deleting");
      }, pauseType);
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, deleteSpeed);
      } else {
        if (loop) {
          timeout = setTimeout(() => {
            nextWord();
          }, pauseDelete);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [
    phase,
    charIndex,
    currentWord,
    typeSpeed,
    deleteSpeed,
    pauseType,
    pauseDelete,
    loop,
    nextWord,
  ]);

  const displayedText = currentWord?.slice(0, charIndex) ?? "";

  return {
    displayedText,
    isTyping: phase === "typing",
    isDeleting: phase === "deleting",
    isPausing: phase === "pausing",
  };
}
