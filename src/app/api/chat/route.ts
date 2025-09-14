import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";          // Node = easy env vars + streaming
export const dynamic = "force-dynamic";   // don't cache

type UiMsg = { role: "user" | "assistant" | "system"; content: string };

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
  // simple eviction
  if (memCache.size > MAX_CACHE) {
    const first = memCache.keys().next().value;
    memCache.delete(first);
  }
}

// ---- Guardrails: quick unsafe/profanity check (adjust to taste) ----
const BAD_WORDS = [
  "kill", "suicide", "self harm", "bomb", "terror", "racial slur", "sexually explicit",
  "porn", "nsfw", "hate", "harass",
];
function isUnsafe(s: string) {
  const t = s.toLowerCase();
  return BAD_WORDS.some(w => t.includes(w));
}

// ---- Cost control: pick model based on complexity ----
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
- Be concise, recruiter-friendly, and **≤ 120 words** unless asked for detail.
- Prefer short bullets over long paragraphs.
- Link with **site paths** when helpful: /projects, /publications, /skills, /resume, /contact.
- Do not repeat the same “about me” intro each turn.
- If unsure, say so briefly and point to a relevant page.

Facts to rely on:
- Name: Rohan Paul Potnuru (Humble, Texas)
- Degree: M.S. in Computer Science — University of North Texas
- Focus: AI/ML (LLMs, eval, prompt engineering), Cloud (AWS/Terraform/CI-CD), Full-Stack & APIs, Testing (Selenium/TestNG)
- Stats: 15 projects, 6 publications/talks, 3+ years building
`.trim();

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "Missing GEMINI_API_KEY" }), { status: 500 });
    }

    const body = await req.json();
    const msgs: UiMsg[] = Array.isArray(body?.messages) ? body.messages : [];
    const lastUser = [...msgs].reverse().find(m => m.role === "user")?.content ?? "";

    // simple moderation
    if (isUnsafe(lastUser)) {
      return new Response("I can’t help with that here.", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // cache check (exact question)
    if (lastUser) {
      const cached = getCached(lastUser);
      if (cached) {
        return new Response(cached, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
    }

    // choose model by complexity
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

    // Transform UI messages to Gemini chat contents
    const contents = msgs
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Stream response
    const result = await model.generateContentStream({ contents });
    const encoder = new TextEncoder();
    let acc = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const piece =
                chunk.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("") ?? "";
              if (!piece) continue;
              acc += piece;
              controller.enqueue(encoder.encode(piece));
            }
            // cache the full text (if we actually got anything)
            if (lastUser && acc.trim()) setCached(lastUser, acc);
          } catch (e) {
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
    console.error("[chat] error:", err);
    return new Response(JSON.stringify({ reply: "Sorry—something went wrong. Please try again." }), {
      status: 200,
    });
  }
}
