'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

const LS_KEY = 'rohan-chat-history';

// === centralize naming so it's easy to change later ===
const ASSISTANT_NAME = "Paul’s AI";
const ASSISTANT_TAGLINE =
  "Ask about projects, skills, publications, resume, and how to contact Rohan.";

// simple uid helper (works in all browsers)
function uid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).slice(2);
}

// very light markdown -> HTML (bold, bullets, links)
function renderMessage(content: string) {
  // helper to linkify one line
  const linkify = (line: string) => {
    // Match absolute URLs or site paths we care about
    // Capture an optional single trailing punctuation/bracket as group 2
    return line.replace(
      /(https?:\/\/[^\s)\]\}]+|\/(?:projects|publications|resume|contact|skills)[^\s)\]\}]*)([)\]\}.,!?;:]?)/gi,
      (_m, url: string, trail: string = '') => {
        // only open new tab for absolute URLs
        const isAbs = /^https?:\/\//i.test(url);
        const attrs = isAbs
          ? 'target="_blank" rel="noopener"'
          : '';
        return `<a href="${url}" class="underline" ${attrs}>${url}</a>${trail}`;
      }
    );
  };

  return content
    .split('\n')
    .filter(Boolean)
    .map((raw, i) => {
      // **bold**
      let line = raw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // bullet prefix
      line = line.replace(/^(\s*[-•]\s+)/, '<span class="mr-1">•</span>');
      // linkify last so we don’t break HTML we just inserted
      line = linkify(line);
      return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
    });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(true); // default open; set false if you prefer
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // suggestions help recruiters ask the right things
  const suggestions = useMemo(
    () => [
      'Give me a 2-sentence summary of Rohan.',
      'What are his strongest skills?',
      'Recommend 2 projects relevant to AWS + Terraform.',
      'Where can I see publications?',
      'How do I contact him?',
    ],
    [],
  );

  // restore chat locally so it persists across nav
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        // seed a friendly greeting the first time
        setMessages([
          {
            id: uid(),
            role: 'assistant',
            content: `Hi! I’m **${ASSISTANT_NAME}**. ${ASSISTANT_TAGLINE}`,
          },
        ]);
      }
    } catch {
      // if LS fails, still show greeting
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content: `Hi! I’m **${ASSISTANT_NAME}**. ${ASSISTANT_TAGLINE}`,
        },
      ]);
    }
  }, []);

  // save chat to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // autoscroll when new messages arrive / panel opens
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, open]);

  // --- STREAMING VERSION ---
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const user: ChatMessage = { id: uid(), role: 'user', content: text };
    const draft: ChatMessage = { id: uid(), role: 'assistant', content: '…' };
    const next = [...messages, user, draft];
    setMessages(next);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.id !== draft.id) // don't send our local draft
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const ct = res.headers.get('content-type') || '';

      // If the server streams plain text, read it incrementally
      if (res.body && ct.startsWith('text/plain')) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          acc += chunk;

          setMessages((curr) => {
            const copy = [...curr];
            const i = copy.findIndex((m) => m.id === draft.id);
            if (i >= 0) copy[i] = { ...draft, content: acc };
            return copy;
          });
        }
      } else {
        // Fallback to JSON (non-streaming)
        const data = (await res.json()) as { reply?: string; message?: string };
        const answer = (data.reply ?? data.message ?? '').trim() || 'Sorry—no response right now.';
        setMessages((curr) => {
          const copy = [...curr];
          const i = copy.findIndex((m) => m.id === draft.id);
          if (i >= 0) copy[i] = { ...draft, content: answer };
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((curr) => {
        const copy = [...curr];
        const i = copy.findIndex((m) => m.role === 'assistant' && m.content === '…');
        if (i >= 0) copy[i] = { ...copy[i], content: 'Sorry—something went wrong. Please try again.' };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  function clearChat() {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        content: `Chat cleared. I’m **${ASSISTANT_NAME}**. ${ASSISTANT_TAGLINE}`,
      },
    ]);
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify([
          {
            id: uid(),
            role: 'assistant',
            content: `Chat cleared. I’m **${ASSISTANT_NAME}**. ${ASSISTANT_TAGLINE}`,
          },
        ]),
      );
    } catch {}
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        aria-label={open ? `Hide ${ASSISTANT_NAME}` : `Open ${ASSISTANT_NAME}`}
        onClick={() => setOpen((v) => !v)}
        className="
          fixed bottom-32 right-6 md:bottom-36 md:right-8
          rounded-full p-3 border shadow-lg
          bg-white/90 dark:bg-zinc-900/85 backdrop-blur
          hover:scale-105 transition
        "
        style={{ zIndex: 2147483647 }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          <span className="hidden sm:inline text-sm font-medium">
            {open ? 'Hide' : ASSISTANT_NAME}
          </span>
        </div>
      </button>

      {open && (
        <div
          className="
            fixed bottom:[11.5rem] right-6 md:bottom-[12.5rem] md:right-8
            w-[380px] max-w-[92vw]
            rounded-2xl border bg-white/90 dark:bg-zinc-900/85
            backdrop-blur shadow-xl overflow-hidden
          "
          style={{ zIndex: 2147483647 }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">{ASSISTANT_NAME}</div>
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Clear conversation"
                onClick={clearChat}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Close"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-[380px] overflow-y-auto p-3 space-y-3 text-sm"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {messages.length === 0 && (
              <div className="opacity-80">
                <div className="mb-2">{ASSISTANT_TAGLINE}</div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-zinc-800/90 border dark:border-zinc-700'
                  }`}
                >
                  {m.role === 'assistant' ? renderMessage(m.content) : m.content}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="mt-2 opacity-80">
                <div className="mb-2">Try a quick question:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-[12px] rounded-full border px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 max-w-[85%] bg-white dark:bg-zinc-800/90 border dark:border-zinc-700">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:120ms]">●</span>
                    <span className="animate-bounce [animation-delay:240ms]">●</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t bg-white/70 dark:bg-zinc-900/70">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ASSISTANT_TAGLINE}
              className="flex-1 px-3 py-2 rounded-xl border bg-transparent outline-none"
              aria-label={`${ASSISTANT_NAME} message`}
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ''}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-zinc-50 disabled:opacity-50"
              title="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
