interface MarqueeProps {
  text: string;
  className?: string;
  reverse?: boolean;
}

export default function Marquee({ text, className = "", reverse = false }: MarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex select-none ${className}`}>
      <div className={`flex shrink-0 min-w-full justify-around gap-12 items-center ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex-shrink-0">
            {text}
          </span>
        ))}
      </div>
      <div className={`flex shrink-0 min-w-full justify-around gap-12 items-center ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`} aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex-shrink-0">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
