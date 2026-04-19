"use client";

import { useState, useEffect } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  onComplete?: () => void;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function ScrambleText({ text, className = "", delay = 0, onComplete }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isMounted) return;

    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }

        iteration += 1 / 3;
      }, 30);
    };

    startScramble();

    return () => {
      clearInterval(interval);
    };
  }, [text, isMounted, onComplete]);

  return <span className={className}>{displayText}</span>;
}
