import { useState, useEffect } from "react";

export default function TypewriterText({ text, speed = 40, className = "" }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-0.75 h-[0.9em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  );
}