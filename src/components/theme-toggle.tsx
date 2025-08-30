"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border px-3 py-2 text-sm shadow-sm hover:shadow"
      aria-label="Toggle theme"
    >
      <Sun className="hidden dark:block h-4 w-4" />
      <Moon className="block dark:hidden h-4 w-4" />
    </button>
  );
}
