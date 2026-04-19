"use client";

import { useState, useEffect } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function ScrambleText({ text, className = "", delay = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText((prev) =>
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
        }

        iteration += 1 / 3;
      }, 30);
    };

    const timeout = setTimeout(startScramble, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}
