"use client";

import { skills } from "@/data/skills";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Boxes,
  Database,
  Cloud,
  TestTube2,
  GitBranch,
  type LucideIcon, // 👈 add the type
} from "lucide-react";

const iconFor: Record<string, LucideIcon> = {
  Programming: Code2,
  Frameworks: Boxes,
  Databases: Database,
  "Cloud & Infrastructure": Cloud,
  "Testing & QA": TestTube2,
  "DevOps & CI/CD": GitBranch,
};

export default function SkillsPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Skills</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((cat, i) => {
          const Icon = iconFor[cat.name] ?? Boxes;
          return (
            <Reveal key={cat.name} delay={i * 0.05}>
              <TiltCard className="rounded-2xl">
                <Card className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur border">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Icon className="h-5 w-5 opacity-80" />
                    <CardTitle>{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <Badge key={item} variant="outline" className="px-2 py-1 rounded-full">
                        {item}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
