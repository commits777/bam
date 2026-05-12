"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
  separator?: string;
}

export default function Marquee({
  items,
  className,
  speed = "normal",
  separator = "·",
}: MarqueeProps) {
  const dur = speed === "slow" ? "40s" : speed === "fast" ? "18s" : "28s";
  const doubled = [...items, ...items];

  return (
    <div className={cn("overflow-hidden flex select-none", className)}>
      <div
        className="flex shrink-0 gap-0 animate-marquee"
        style={{ animationDuration: dur }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 whitespace-nowrap px-4"
          >
            <span>{item}</span>
            <span className="text-siren font-bold">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
