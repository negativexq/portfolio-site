import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE_URL = "https://omerfkoc.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/graph`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learning`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resume`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: project.flagship ? 0.8 : 0.5,
  }));

  return [...staticRoutes, ...projectRoutes];
}
