import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Keep this brief and focused on your portfolio.
const systemPrompt = `
You are Rohan's portfolio assistant. 
Answer concisely and professionally for recruiters.
If a question is about Rohan's background, use the knowledge below.

KNOWLEDGE
- Title: Software Engineer specializing in AI/ML, Cloud & Full-Stack.
- Degree: M.S. in Computer Science, University of North Texas (Denton, TX).
- Summary: Builds AI-driven, cloud-ready apps. Strong in Python/Java/JS/TS, React,
  FastAPI/Flask, ASP.NET, SQL, AWS, Docker, Kubernetes, Terraform, Selenium/TestNG.
- Highlights: 15+ projects; 6 publications/talks; 3+ years building.
- Quick skills: LLM eval & prompt eng, IaC/CI-CD (AWS/GitHub Actions), APIs, testing.
- Resume: available at /resume.pdf
If you don't know, say so and suggest visiting /projects or /publications.
`;

export const runtime = "edge";           // fast cold starts on Vercel Edge
export const maxDuration = 30;           // seconds

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),        // fast & inexpensive
    system: systemPrompt,
    messages,                            // [{role:'user'|'assistant'|'system', content:string}, ...]
  });

  return result.toAIStreamResponse();     // streams tokens to the client
}
