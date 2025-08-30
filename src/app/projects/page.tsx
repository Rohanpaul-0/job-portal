import { projects } from "@/data/projects";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";

export default function ProjectsPage() {
  const items = [...projects].sort((a, b) => b.year - a.year);

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <TiltCard className="rounded-2xl border p-5 shadow-sm bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
              <article>
                <div className="text-xs opacity-60">{p.year}</div>
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 opacity-80">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs opacity-70">
                  {p.tags.map((t) => (
                    <span key={t} className="border rounded-full px-2 py-1">{t}</span>
                  ))}
                </div>
                {p.impact && <p className="mt-3 text-sm">Impact: {p.impact}</p>}
                <div className="mt-3 text-sm">
                  {p.link && <a className="underline mr-3" href={p.link} target="_blank">Demo</a>}
                  {p.repo && <a className="underline" href={p.repo} target="_blank">Code</a>}
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
