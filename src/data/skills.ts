export type SkillCategory = { name: string; items: string[] };
export const skills: SkillCategory[] = [
  { name: "Programming", items: ["Python", "Java", "Go", "C#", "JavaScript/TypeScript", "SQL"] },
  { name: "Frameworks", items: ["React", "Flask/FastAPI", "ASP.NET MVC", "Bootstrap", "Spring Boot (basics)"] },
  { name: "Databases", items: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB", "Redis"] },
  { name: "Cloud & Infrastructure", items: ["AWS (EC2, ECS, Lambda, S3, RDS)", "Kubernetes", "Docker", "Terraform"] },
  { name: "Testing & QA", items: ["Selenium WebDriver", "TestNG", "Postman", "PyTest", "JMeter"] },
  { name: "DevOps & CI/CD", items: ["GitHub Actions", "Jenkins", "Git", "Prometheus", "Grafana"] },
];
