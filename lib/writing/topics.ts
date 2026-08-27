import { writingTopics } from "../../data/writing-topics.ts";
import { getPublishedArticles } from "./articles.ts";
import type { WritingArticleSummary, WritingTopic } from "./types.ts";

export type WritingTopicGroup = {
  topic: WritingTopic;
  articles: readonly WritingArticleSummary[];
};

/**
 * Published articles grouped into the curated topics, in the topic order
 * declared in data/writing-topics.ts. Articles keep the date ordering they
 * already have inside each group, and a topic with no published article is
 * dropped rather than rendered empty.
 */
export function getWritingTopicGroups(): readonly WritingTopicGroup[] {
  const published = getPublishedArticles();
  return writingTopics
    .map((topic) => ({
      topic,
      articles: published.filter((article) => article.category === topic.title),
    }))
    .filter((group) => group.articles.length > 0);
}

export function getWritingTopicGroup(slug: string): WritingTopicGroup | undefined {
  return getWritingTopicGroups().find((group) => group.topic.slug === slug);
}
