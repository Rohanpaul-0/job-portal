"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Send, MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  return (
    <>
      {/* FAB */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 rounded-full p-3 border shadow-lg bg-white/90 dark:bg-zinc-900/80 backdrop-blur hover:scale-105 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[360px] max-w-[92vw] rounded-2xl border bg-white/90 dark:bg-zinc-900/85 backdrop-blur shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold">Ask about Rohan</div>

          <div ref={scrollRef} className="h-[360px] overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="opacity-70">
                Try: “What are your strongest skills?”, “Tell me about a cloud project”, or “Can I get your resume?”
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-zinc-800 border"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-3 border-t bg-white/70 dark:bg-zinc-900/70"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about projects, skills, publications..."
              className="flex-1 px-3 py-2 rounded-xl border bg-transparent outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-zinc-50 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
