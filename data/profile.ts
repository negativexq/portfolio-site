import type { Profile } from "@/lib/content/types";

export const profile = {
  name: "Ömer Faruk Koç",
  title: "AI/ML Platform Engineer",
  positioning:
    "Building production ML platforms, RAG systems, data pipelines and event-driven applications.",
  summary:
    "3+ years building and operating production machine learning, data and Generative AI systems.",
  location: "Türkiye",
  links: {
    github: "https://github.com/negativexq",
    linkedin: "https://linkedin.com/in/omerfkoc",
    email: "mailto:omerfkoc98@gmail.com",
    website: "https://omerfkoc.dev",
  },
  education: {
    institution: "Gebze Technical University",
    degree: "B.Sc. Electronics Engineering",
    completed: "Jun 2026",
    note: "Completed the degree while working full time.",
  },
  languages: [
    { language: "Turkish", proficiency: "Native" },
    { language: "English", proficiency: "Professional Working Proficiency" },
  ],
} satisfies Profile;
