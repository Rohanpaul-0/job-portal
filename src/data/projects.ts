export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year: number;
  impact?: string;
  link?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "terraform-aws-iac",
    title: "Scalable Cloud Infrastructure Automation with Terraform & AWS",
    summary:
      "Automated AWS provisioning (EC2, ECS, S3, RDS, IAM) with Terraform. CI/CD via GitHub Actions to enforce IaC best practices.",
    tags: ["Terraform","AWS","EC2","ECS","S3","RDS","IAM","GitHub Actions","Docker"],
    year: 2024,
    impact: "60% faster provisioning; eliminated drift with version control; improved reliability & security."
  },
  {
    slug: "hpc-k8s-slurm",
    title: "High-Performance Computing (HPC) Cluster Deployment",
    summary:
      "Kubernetes-based HPC cluster for parallel bioinformatics. SLURM for scheduling, Prometheus/Grafana for monitoring.",
    tags: ["Kubernetes","SLURM","Docker","Python","Prometheus","Grafana"],
    year: 2024,
    impact: "35% faster simulations; higher reliability under concurrency."
  },
  {
    slug: "streaming-analytics",
    title: "Streaming Analytics Platform for Real-Time Data",
    summary:
      "Distributed streaming with Go backend and Kafka ingestion; React dashboards; PostgreSQL storage; deployed on AWS ECS.",
    tags: ["Go","Kafka","React","PostgreSQL","AWS ECS"],
    year: 2024,
    impact: "10k+ events/sec at <120ms latency; real-time insights for decisions."
  },
  {
    slug: "automation-testing",
    title: "Automated Software Testing Framework",
    summary:
      "Hybrid framework with Selenium WebDriver + TestNG; CI/CD with Jenkins; UI & API (REST Assured) tests and reports.",
    tags: ["Selenium","TestNG","Jenkins","Java","REST Assured"],
    year: 2022,
    impact: "Cut manual QA 65%; −40% bug leakage; higher release confidence."
  },
  {
    slug: "saas-erp-dotnet",
    title: "SaaS ERP Application Development (.NET + SQL Server)",
    summary:
      "ERP modules: reporting dashboards, auth, transaction tracking. ASP.NET MVC backend, Bootstrap UI, optimized SQL Server.",
    tags: ["ASP.NET MVC","C#","SQL Server","Bootstrap","JavaScript"],
    year: 2022,
    impact: "−40% report time; improved consistency & adoption."
  },
  {
    slug: "log-anomaly-ml",
    title: "AI-Powered Log Anomaly Detection System",
    summary:
      "Unsupervised ML (Isolation Forest, DBSCAN) on large log volumes; ELK for ingest/visualize; PySpark pipeline.",
    tags: ["Python","Scikit-learn","PySpark","ELK","Jupyter"],
    year: 2024,
    impact: "≈92% anomaly detection; −15% false positives."
  },
  {
    slug: "distributed-query-optimizer",
    title: "Distributed Database Query Optimizer",
    summary:
      "Cache & partition-aware planning for distributed SQL; benchmarked vs PostgreSQL.",
    tags: ["PostgreSQL","Python","SQL","Redis","Docker"],
    year: 2024,
    impact: "≈30% faster queries in distributed setups."
  },
  {
    slug: "social-analytics-dashboard",
    title: "Full-Stack Social Media Analytics Dashboard",
    summary:
      "Aggregates posts, sentiment analysis, interactive dashboards. Flask APIs, React + Chart.js, MongoDB, AWS Lambda jobs.",
    tags: ["Flask","React","NLTK","MongoDB","AWS Lambda"],
    year: 2023,
    impact: "50+ users; analysis time from hours → minutes."
  },
  {
    slug: "llm-prompt-eval",
    title: "LLM Prompt Evaluation Framework",
    summary:
      "Automated scoring (BLEU, ROUGE, semantic similarity) to compare LLM outputs and guide prompt engineering.",
    tags: ["Python","PyTorch","Hugging Face","Jupyter"],
    year: 2025,
    impact: "↑12% evaluation consistency; faster iteration."
  },
  {
    slug: "microservices-ecommerce",
    title: "Microservices-Based E-Commerce Platform",
    summary:
      "Services for users, catalog, orders, payments; API gateway; Docker/Kubernetes; PostgreSQL.",
    tags: ["Spring Boot","FastAPI","Kubernetes","PostgreSQL","Docker"],
    year: 2023,
    impact: "5k+ concurrent users; zero downtime at peaks."
  }
];
