"use client";
import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function Stat({ value, suffix = "", label }: { value: number; suffix?: string; label: string; }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, { duration: 1.2, onUpdate: v => setN(Math.round(v)) });
    return () => controls.stop();
  }, [value]);
  return (
    <div className="text-center">
      <div className="text-3xl font-bold tabular-nums">{n}{suffix}</div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  );
}
