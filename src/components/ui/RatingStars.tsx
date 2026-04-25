"use client";

import { Star } from '@phosphor-icons/react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export function RatingStars({ rating, size = 12, className }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} weight="fill" />
      ))}
      {halfStar && (
        <div className="relative">
          <Star size={size} weight="regular" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <Star size={size} weight="fill" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} weight="regular" />
      ))}
    </div>
  );
}
