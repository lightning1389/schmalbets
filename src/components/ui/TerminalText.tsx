'use client';

import { useEffect, useState } from 'react';

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  delay?: number;
}

export function TerminalText({
  text,
  speed = 40,
  className = '',
  showCursor = true,
  delay = 0,
}: TerminalTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, started]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && <span className="cursor-blink" />}
    </span>
  );
}
