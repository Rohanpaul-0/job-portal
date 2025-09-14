// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = "user" | "assistant" | "system";
type UiMsg = { role: Role; content: string };

// ---- Minimal in-memory cache (5 min TTL) ----
type CacheEntry = { text: string; expires: number };
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE = 100;
const memCache = new Map<string, CacheEntry>();

function cacheKey(q: string) {
  return q.toLowerCase().trim();
}
function getCached(q: string) {
  const k = cacheKey(q);
  const e = memCache.get(k);
  if (e && e.expires > Date.now()) return e.text;
  if (e) memCache.delete(k);
  return null;
}
function setCached(q: string, text: string) {
  const k = cacheKey(q);
  memCache.set(k, { text, expires: Date.now() + CACHE_TTL_MS });
  if (memCache.size > MAX_CACHE) {
    const first = memCache.keys().next().value as string | undefined;
    if (first) memCache.delete(first);
  }
}

// ---- simple safety + cost control ----
const BAD_WORDS = [
  "kill", "suicide", "self harm", "bomb", "terror", "racial slur", "sexually explicit",
  "porn", "nsfw", "hate", "harass",
];
function isUnsafe(s: string) {
  const t = s.toLowerCase();
  return BAD_WORDS.some((w) => t.includes(w));
}
function isComplex(s: string) {
  const t = s.toLowerCase();
  return (
    s.length > 280 ||
    /explain|compare|step[-\s]?by[-\s]?step|architect|design|trade[-\s]?offs|why|how do|code example/.test(t)
  );
}

// ---- System instructions (concise + ≤120 words) ----
const systemPrompt = `
You are the AI assistant on rohanpaul.org for Rohan Paul Potnuru.

Rules:
- Be concise, recruiter-friendly, and ≤ 120 words unless asked for detail.
- Prefer short bullets over long paragraphs.
- Link with site paths when helpful: /projects, /publications, /skills, /resume, /contact.
- Do not repeat the same “about me” intro each turn.
- If unsure, say so briefly and point to a relevant page.

Facts to rely on:
- Name: Rohan Paul Potnuru (Humble, Texas)
- Degree: M.S. in Computer Science — University of North Texas
- Focus: AI/ML (LLMs, eval, prompt engineering), Cloud (AWS/Terraform/CI-CD), Full-Stack & APIs, Testing (Selenium/TestNG)
- Stats: 15 projects, 6 publications/talks, 3+ years building
`.trim();

// Small types so we don’t use `any`
type TextPart = { text?: string };
type PartContent = { parts?: TextPart[] };
type Candidate = { content?: PartContent };
type StreamChunk = { candidates?: Candidate[] };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "Missing GEMINI_API_KEY" }), { status: 500 });
    }

    // Parse/marshal request body without `any`
    const raw: unknown = await req.json().catch(() => ({}));
    const incoming = (raw as { messages?: unknown }).messages;
    const messages: UiMsg[] = Array.isArray(incoming)
      ? (incoming as UiMsg[])
      : [];

    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    if (isUnsafe(lastUser)) {
      return new Response("I can’t help with that here.", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // cache: exact question
    if (lastUser) {
      const cached = getCached(lastUser);
      if (cached) {
        return new Response(cached, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
    }

    const modelName = isComplex(lastUser) ? "gemini-1.5-pro" : "gemini-1.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 500,
      },
    });

    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContentStream({ contents });
    const encoder = new TextEncoder();
    let acc = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // The SDK exposes an `any`-typed iterator; narrow it here and
            // disable the lint rule for this single use.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for await (const chunk of result.stream as AsyncIterable<any>) {
              const c = chunk as StreamChunk;
              const piece =
                c?.candidates?.[0]?.content?.parts
                  ?.map((p: TextPart) => p.text ?? "")
                  .join("") ?? "";

              if (!piece) continue;
              acc += piece;
              controller.enqueue(encoder.encode(piece));
            }
            if (lastUser && acc.trim()) setCached(lastUser, acc);
          } catch (_err) {
            controller.enqueue(encoder.encode("Sorry—something went wrong."));
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (_err) {
    // note: `_err` avoids the "defined but never used" lint warning.
    return new Response(JSON.stringify({ reply: "Sorry—something went wrong. Please try again." }), {
      status: 200,
    });
  }
}
