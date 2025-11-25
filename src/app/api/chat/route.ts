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
  if (e) memCache.delete(e as unknown as string);
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

// ---- Safety (regex with word boundaries) + cost control ----
const UNSAFE_PATTERNS: RegExp[] = [
  /\bkill(s|ed|ing)?\b/i,
  /\bsuicide\b/i,
  /\bself[-\s]?harm\b/i,
  /\bbomb(s)?\b/i,
  /\bterror(ism|ist|istic)?\b/i,
  /\bracial\s+slur(s)?\b/i,
  /\bsexual(ly)?\s+explicit\b/i,
  /\bporn(ography|ographic)?\b/i,
  /\bnsfw\b/i,
  /\bhate(s|ful)?\b/i,
  /\bharass(ment|ing)?\b/i,
];

function isUnsafe(s: string) {
  return UNSAFE_PATTERNS.some((re) => re.test(s));
}

function isComplex(s: string) {
  const t = s.toLowerCase();
  return (
    s.length > 280 ||
    /explain|compare|step[-\s]?by[-\s]?step|architect|design|trade[-\s]?offs|why|how do|code example/.test(
      t
    )
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
    console.log('GEMINI_API_KEY check:', apiKey ? `Loaded (length: ${apiKey.length})` : 'MISSING!');
    
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY env var');
      return new Response(JSON.stringify({ reply: "Missing GEMINI_API_KEY" }), { status: 500 });
    }
    
    // Parse/marshal request body without `any`
    const raw: unknown = await req.json().catch(() => ({}));
    const incoming = (raw as { messages?: unknown }).messages;
    const messages: UiMsg[] = Array.isArray(incoming) ? (incoming as UiMsg[]) : [];
    console.log('Request received with messages:', JSON.stringify(messages, null, 2));

    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    if (isUnsafe(lastUser)) {
      console.log('Unsafe content detected:', lastUser);
      return new Response("I can’t help with that here.", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // cache: exact question
    if (lastUser) {
      const cached = getCached(lastUser);
      if (cached) {
        console.log('Cache hit for:', lastUser);
        return new Response(cached, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      }
    }

    // Updated to supported models as of late 2025 (gemini-1.5 series deprecated)
    const modelName = isComplex(lastUser) ? "gemini-2.5-pro" : "gemini-2.5-flash";
    console.log('Using model:', modelName);
    
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

    console.log('Initiating Gemini stream generation');
    const result = await model.generateContentStream({ contents });
    const encoder = new TextEncoder();
    let acc = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
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
            if (lastUser && acc.trim()) {
              setCached(lastUser, acc);
              console.log('Stream complete, cached response for:', lastUser);
            }
          } catch (err) {
            console.error('Stream error details:', err);  // Keep logging for now
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
  } catch (err) {
    console.error('Outer API error details:', err);  // Keep logging for now
    return new Response(
      JSON.stringify({ reply: "Sorry—something went wrong. Please try again." }),
      { status: 200 }
    );
    // Debug version (uncomment if needed):
    // const errorMsg = `OUTER ERROR DEBUG: ${err instanceof Error ? err.message : 'Unknown outer error'}\n`;
    // return new Response(errorMsg, { status: 500 });
  }
}