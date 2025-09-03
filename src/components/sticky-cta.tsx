"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Mail } from "lucide-react";

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 280);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-2xl border bg-white/80 dark:bg-zinc-900/70 backdrop-blur shadow-lg p-2 flex gap-2">
        <Button asChild size="sm" className="rounded-xl">
          <a href="/resume.pdf" download><Download className="h-4 w-4 mr-1" />Resume</a>
        </Button>
        <Button asChild size="sm" variant="outline" className="rounded-xl">
          <a href="https://cal.com/your-handle/intro-15" target="_blank" rel="noreferrer">
            <Calendar className="h-4 w-4 mr-1" />Call
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="rounded-xl">
          <a href="mailto:RohanPaul252@gmail.com"><Mail className="h-4 w-4 mr-1" />Email</a>
        </Button>
      </div>
    </div>
  );
}
