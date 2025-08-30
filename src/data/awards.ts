export type AwardItem = { text: string; kind?: "award" | "affiliation" | "presentation" };
export const awards: AwardItem[] = [
  { text: "Contributor to NASA Helio-STELLA Collaboration", kind: "affiliation" },
  { text: "Member, Association for Computing Machinery (ACM)", kind: "affiliation" },
  { text: "Presented at SITE 2024/2025, EdMedia 2025", kind: "presentation" },
  { text: "IGI Global Book Chapter Contributor", kind: "affiliation" },
  { text: "Supernova Award — Best Poster, SITE 2025", kind: "award" }
];
