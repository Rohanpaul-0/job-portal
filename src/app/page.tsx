"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Linkedin } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Stat } from "@/components/stats";
import MarqueeTech from "@/components/marquee-tech";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-16 max-w-6xl mx-auto">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div>
            <span className="text-sm uppercase tracking-widest opacity-70">
              Personal Job Portal
            </span>

            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
                Rohan Paul Potnuru
              </span>
              . <br />I build AI-driven, cloud-ready apps.
            </h1>

            {/* Degree — full words, eye-catching */}
            <div className="mt-4 rounded-xl border bg-white/70 dark:bg-zinc-900/50 backdrop-blur px-4 py-3">
              <p className="font-semibold">
                Master of Science in Computer Science — University of North Texas
              </p>
              <p className="text-sm opacity-70">Denton, Texas</p>
            </div>

            {/* Recruiter-focused tagline */}
            <p className="mt-5 text-lg opacity-80">
              <span className="font-semibold">Software Engineer</span> specializing in AI/ML, Cloud, and
              Full-Stack Development · Building scalable, production-ready apps.
            </p>

            {/* Hire Me – primary actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              {/* Primary: Download Resume */}
              <Button
                asChild
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white shadow hover:opacity-90"
              >
                <a href="/resume.pdf" download aria-label="Download Resume">
                  <Download className="h-4 w-4 mr-2" /> Download Resume
                </a>
              </Button>

              {/* Schedule a call (replace with your Calendly link) */}
              <Button asChild variant="outline" className="rounded-2xl">
                <a
                  href="https://calendar.app.google/5mBLP8x6Uo1p1voP9"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Schedule a Call"
                >
                  <Calendar className="h-4 w-4 mr-2" /> Schedule a Call
                </a>
              </Button>

              {/* LinkedIn (replace with your profile URL) */}
              <Button asChild variant="outline" className="rounded-2xl">
                <a
                  href="https://www.linkedin.com/in/rohan-paul-p-81142a166/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LinkedIn"
                >
                  <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                </a>
              </Button>

              {/* Internal site CTAs */}
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/projects">Projects</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/publications">Publications</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/skills">Skills</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>

            {/* animated stats */}
            <div className="mt-10 grid grid-cols-3 max-w-md">
              <Stat value={15} label="Projects" />
              <Stat value={6} label="Publications/Talks" />
              <Stat value={3} suffix="+" label="Years Building" />
            </div>

            {/* Professional Summary */}
            <div className="mt-10 rounded-2xl border bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-6">
              <h3 className="text-lg font-semibold">Professional Summary</h3>
              <p className="mt-2 opacity-80 leading-relaxed">
                Innovative and detail-oriented Software Developer with a strong foundation in full-stack development,
                cloud integration, and database design. Proficient in developing web and mobile applications using modern
                frameworks (React, Node.js, ASP.NET, Spring Boot) and integrating backend services with SQL/NoSQL databases.
                Skilled at building and deploying scalable applications with CI/CD pipelines and containerized environments
                (Docker, Kubernetes, AWS). Passionate about delivering clean, maintainable code and intuitive user experiences
                while aligning development with business goals. Demonstrated success in academic research, real-world projects,
                and internships developing production-ready systems.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl p-6 border shadow-sm bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
            <h2 className="text-xl font-semibold">Quick Profile</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border p-4">
                <div className="text-2xl font-bold">AI/ML</div>
                <div className="opacity-70 mt-1">LLM eval · Prompt Eng</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-2xl font-bold">Web/Backend</div>
                <div className="opacity-70 mt-1">Python · Django · APIs</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-2xl font-bold">Cloud</div>
                <div className="opacity-70 mt-1">AWS · IaC · CI/CD</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-2xl font-bold">Testing</div>
                <div className="opacity-70 mt-1">Selenium · TestNG</div>
              </div>
            </div>
          </div>
        </Reveal>
        <MarqueeTech />
      </section>
    </main>
  );
}
