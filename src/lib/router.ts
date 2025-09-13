import { profile } from "@/data/rohan";

type Routed = { handled: true; text: string } | { handled: false };

const li = (arr: string[]) => arr.map(s => `• ${s}`).join("\n");

export function routeQuickIntents(q: string): Routed {
  const text = q.toLowerCase();

  if (/who\s+is\s+rohan|about\s+rohan|bio/.test(text)) {
    return {
      handled: true,
      text:
        `**${profile.name}** is a ${profile.role} based in ${profile.location}. ` +
        `He holds an ${profile.education}. Focus: ${profile.summary} ` +
        `— see **Projects** (${profile.links.projects}), **Publications** (${profile.links.publications}), and **Resume** (${profile.links.resume}).`,
    };
  }

  if (/skills?|expertise|tech\s*stack/.test(text)) {
    return {
      handled: true,
      text:
        `**Core skills**\n` +
        `AI/ML: ${li(profile.skills.ai_ml)}\n` +
        `Cloud: ${li(profile.skills.cloud)}\n` +
        `Web/Backend: ${li(profile.skills.web_backend)}\n` +
        `Testing: ${li(profile.skills.testing)}\n` +
        `Databases: ${li(profile.skills.data)}\n` +
        `DevOps: ${li(profile.skills.devops)}\n` +
        `Languages: ${li(profile.skills.languages)}\n` +
        `Full list: ${profile.links.skills}`,
    };
  }

  if (/project(s)?/i.test(text)) {
    return {
      handled: true,
      text:
        `Rohan has **${profile.stats.projects}** projects spanning AI/ML, cloud, and full-stack. ` +
        `Browse them at ${profile.links.projects}. If you share a domain (e.g., “streaming analytics” or “Terraform on AWS”), I’ll highlight the most relevant one.`,
    };
  }

  if (/publication|paper|talk/i.test(text)) {
    return {
      handled: true,
      text:
        `Rohan has **${profile.stats.publications}** publications/talks, mainly in **${profile.publications_focus}**\n` +
        `See details: ${profile.links.publications}`,
    };
  }

  if (/resume|cv/.test(text)) {
    return {
      handled: true,
      text: `Here’s the resume: ${profile.links.resume}. For interviews, I can also provide a one-paragraph summary on request.`,
    };
  }

  if (/contact|email|reach/.test(text)) {
    return {
      handled: true,
      text: `Best way to reach Rohan: ${profile.links.contact}. Happy to draft an intro note if you’d like.`,
    };
  }

  return { handled: false };
}
