import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TeleprompterProps {
  messages: string[];
  speed?: number;
  className?: string;
}

export function Teleprompter({
  messages,
  speed = 2000,
  className,
}: TeleprompterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, speed);

    return () => clearInterval(interval);
  }, [messages.length, speed]);

  return (
    <div className={cn("relative h-8 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 flex items-center transition-all duration-300 ease-in-out",
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full",
        )}
      >
        <div className="whitespace-nowrap text-lg font-mono text-muted-foreground">
          {messages[currentIndex]}
        </div>
      </div>
    </div>
  );
}

interface ScrollingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function ScrollingText({
  text,
  speed = 50,
  className,
}: ScrollingTextProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="whitespace-nowrap"
        style={{
          animation: `scroll-left ${(text.length / speed) * 2}s linear infinite`,
        }}
      >
        {text}
      </div>
    </div>
  );
}
