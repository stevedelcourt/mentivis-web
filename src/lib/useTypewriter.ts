"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const stateRef = useRef({ phase: "typing" as Phase, charIndex: 0, wordIndex: 0 });

  // Keep ref in sync with state for the rAF loop
  useEffect(() => {
    stateRef.current = { phase, charIndex, wordIndex };
  }, [phase, charIndex, wordIndex]);

  useEffect(() => {
    if (words.length === 0) return;

    const tick = (now: number) => {
      const s = stateRef.current;
      const cw = words[s.wordIndex];
      const elapsed = now - lastTickRef.current;

      if (s.phase === "typing") {
        if (elapsed >= typeSpeed) {
          lastTickRef.current = now;
          if (s.charIndex < cw.length) {
            setCharIndex(s.charIndex + 1);
          } else {
            setPhase("pausing");
          }
        }
      } else if (s.phase === "pausing") {
        if (elapsed >= pauseType) {
          lastTickRef.current = now;
          setPhase("deleting");
        }
      } else if (s.phase === "deleting") {
        if (elapsed >= deleteSpeed) {
          lastTickRef.current = now;
          if (s.charIndex > 0) {
            setCharIndex(s.charIndex - 1);
          } else if (loop) {
            setPhase("typing");
            setWordIndex((prev) => (prev + 1) % words.length);
            setCharIndex(0);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [words, typeSpeed, deleteSpeed, pauseType, pauseDelete, loop]);

  const displayedText = currentWord?.slice(0, charIndex) ?? "";

  return {
    displayedText,
    isTyping: phase === "typing",
    isDeleting: phase === "deleting",
    isPausing: phase === "pausing",
  };
}
