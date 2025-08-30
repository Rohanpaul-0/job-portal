"use client";

import { publications } from "@/data/publications";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";

export default function PublicationsPage() {
  const items = [...publications].sort((a, b) => b.year - a.year);

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Selected Publications & Presentations</h1>

      <div className="space-y-4">
        {items.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <TiltCard className="rounded-2xl border bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-5">
              <article>
                <div className="text-xs opacity-60">{p.year}</div>
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-sm opacity-80 mt-1">{p.authors}</p>
                <p className="text-sm opacity-80">{p.venue}</p>
                {p.link && (
                  <a className="text-sm underline mt-2 inline-block" href={p.link} target="_blank">
                    View
                  </a>
                )}
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
