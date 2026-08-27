import type { WritingTopic } from "@/lib/writing/types";

/**
 * Curated topic layer for the writing index.
 *
 * Article frontmatter carries `category`, which must match exactly one `title`
 * below — `getAllArticles()` enforces that, so an unknown or missing category
 * fails the build rather than silently dropping an article off the index.
 *
 * One topic per article on purpose. Tags stay free-form and an article often
 * touches several subjects, but a grouped index that lists the same piece
 * under four headings is noise, not navigation.
 *
 * Order is display order on /writing.
 */
export const writingTopics = [
  {
    slug: "agent-reliability",
    title: "Agent Reliability",
    description:
      "Keeping execution authority outside the model: typed proposals, deterministic policy, durable confirmation, revalidation, idempotency and audit.",
  },
  {
    slug: "ai-platform",
    title: "AI Platform",
    description:
      "Model lifecycle as a control-plane problem — progressive delivery, delayed quality feedback, policy-driven promotion and reconciliation.",
  },
  {
    slug: "retrieval",
    title: "Retrieval & RAG",
    description:
      "Retrieval as evidence rather than authority: hybrid search, citation integrity, provenance and grounded generation.",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    description:
      "Shared definitions, lineage and quality gates in the pipelines that feed training, inference and reporting.",
  },
  {
    slug: "distributed-systems",
    title: "Distributed Systems",
    description:
      "Explicit delivery guarantees, idempotent effects, transactional boundaries and measured service limits.",
  },
] satisfies readonly WritingTopic[];

export function getWritingTopicBySlug(slug: string) {
  return writingTopics.find((topic) => topic.slug === slug);
}

export function getWritingTopicByTitle(title: string) {
  return writingTopics.find((topic) => topic.title === title);
}
