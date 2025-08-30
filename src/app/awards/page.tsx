"use client";

import { awards } from "@/data/awards";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { Award, Users, Presentation, BadgeCheck } from "lucide-react";

const iconFor = {
  award: Award,
  affiliation: Users,
  presentation: Presentation,
};

export default function AwardsPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Awards & Affiliations</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {awards.map((a, i) => {
          const Icon = iconFor[a.kind ?? "affiliation"] || BadgeCheck;
          return (
            <Reveal key={a.text} delay={i * 0.05}>
              <TiltCard className="rounded-2xl border bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-4">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 opacity-80 mt-1" />
                  <p>{a.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
