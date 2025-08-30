"use client";
import { useEffect } from "react";

export default function Spotlight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(600px circle at var(--mx) var(--my), rgba(99,102,241,0.12), transparent 40%)",
      }}
    />
  );
}
