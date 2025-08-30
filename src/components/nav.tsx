"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 dark:bg-black/50 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Rohan</Link>
        <div className="flex items-center gap-5 text-sm">
  <Link href="/projects" className="opacity-80 hover:opacity-100">Projects</Link>
  <Link href="/publications" className="opacity-80 hover:opacity-100">Publications</Link>
  <Link href="/awards" className="opacity-80 hover:opacity-100">Awards</Link>
  <Link href="/skills" className="opacity-80 hover:opacity-100">Skills</Link>
  <Link href="/resume" className="opacity-80 hover:opacity-100">Resume</Link>
  <Link href="/contact" className="opacity-80 hover:opacity-100">Contact</Link>
  <ThemeToggle />
</div>


      </nav>
    </header>
  );
}
