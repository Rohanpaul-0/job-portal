"use client";
import { motion } from "framer-motion";

const stack = [
  "React", "Next.js", "Node.js", "ASP.NET", "Spring Boot",
  "Python", "Go", "Java", "C#",
  "PostgreSQL", "MongoDB", "Redis", "SQL Server",
  "AWS", "Docker", "Kubernetes", "Terraform",
  "Kafka", "Selenium", "Jenkins", "GitHub Actions"
];

export default function MarqueeTech() {
  const row = [...stack, ...stack]; // repeat so it loops smoothly
  return (
    <div className="my-10 overflow-hidden">
      <motion.div
        className="flex gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ width: "200%" }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="border rounded-full px-3 py-1 text-sm bg-white/70 dark:bg-zinc-900/50 backdrop-blur"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
