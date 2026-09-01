import { useEffect, useState } from 'react';

function getElapsedMinutes(createdAt) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

function urgencyClasses(minutes) {
  if (minutes >= 15) return 'bg-urgent/15 text-urgent border-urgent/40';
  if (minutes >= 8) return 'bg-warn/15 text-warn border-warn/40';
  return 'bg-fresh/15 text-fresh border-fresh/40';
}

export default function ElapsedTimeBadge({ createdAt }) {
  const [minutes, setMinutes] = useState(() => getElapsedMinutes(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getElapsedMinutes(createdAt));
    }, 15000); // recompute every 15s - a full clock tick isn't necessary here
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-semibold tabular-nums ${urgencyClasses(minutes)}`}
      aria-label={`${minutes} minutes since order placed`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {minutes}m
    </span>
  );
}
