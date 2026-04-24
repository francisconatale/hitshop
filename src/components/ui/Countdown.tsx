"use client";

import { useState, useEffect } from "react";

import { Text } from "@/components/ui/Text";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 font-mono">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black">{format(timeLeft.hours)}</span>
        <Text path="productTexts.countdown.hrs" className="text-[8px] uppercase opacity-40" />
      </div>
      <span className="text-3xl font-black animate-pulse">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black">{format(timeLeft.minutes)}</span>
        <Text path="productTexts.countdown.min" className="text-[8px] uppercase opacity-40" />
      </div>
      <span className="text-3xl font-black animate-pulse">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black text-primary-fixed">{format(timeLeft.seconds)}</span>
        <Text path="productTexts.countdown.sec" className="text-[8px] uppercase opacity-40" />
      </div>
    </div>
  );
}
