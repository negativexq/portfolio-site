import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getPublishedArticles } from "@/lib/writing/articles";
import { getWritingTopicGroups } from "@/lib/writing/topics";

const BASE_URL = "https://omerfkoc.dev";

// These dates track the latest content-affecting commit for each route.
// Update the relevant entry whenever published page content changes.
const routeLastModified = {
  home: "2026-09-03",
  projects: "2026-09-03",
  platform: "2026-09-03",
  experience: "2026-09-03",
  graph: "2026-09-03",
  learning: "2026-08-13",
  writing: "2026-08-20",
  resume: "2026-09-03",
  projectCaseStudies: "2026-09-03",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: routeLastModified.home, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: routeLastModified.projects, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/platform`, lastModified: routeLastModified.platform, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/experience`, lastModified: routeLastModified.experience, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/graph`, lastModified: routeLastModified.graph, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/learning`, lastModified: routeLastModified.learning, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/writing`, lastModified: routeLastModified.writing, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resume`, lastModified: routeLastModified.resume, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: routeLastModified.projectCaseStudies,
    changeFrequency: "monthly",
    priority: project.flagship ? 0.8 : 0.5,
  }));

  const writingRoutes: MetadataRoute.Sitemap = getPublishedArticles().map((article) => ({
    url: `${BASE_URL}/writing/${article.slug}`,
    lastModified: article.dateModified ?? article.datePublished,
    changeFrequency: "monthly",
    priority: article.featured ? 0.8 : 0.7,
  }));

  const writingTopicRoutes: MetadataRoute.Sitemap = getWritingTopicGroups().map((group) => ({
    url: `${BASE_URL}/writing/topic/${group.topic.slug}`,
    lastModified: group.articles[0].dateModified ?? group.articles[0].datePublished,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes, ...writingTopicRoutes];
}
