import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../../data/projects.ts";
import { learningItems } from "../../data/learning.ts";
import { writingTopics } from "../../data/writing-topics.ts";
import type { ArticleFrontmatter, WritingArticle, WritingArticleSummary } from "./types.ts";

const CONTENT_DIRECTORY = join(process.cwd(), "content", "writing");
const REQUIRED_STRING_FIELDS = ["title", "description", "slug", "datePublished"] as const;
const ARRAY_FIELDS = new Set(["tags", "relatedProjects", "relatedLearning", "relatedWriting"]);
const BOOLEAN_FIELDS = new Set(["featured", "draft"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type MutableFrontmatter = Record<string, string | boolean | string[]>;

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseArticleSource(source: string, fileName = "article.md"): WritingArticle {
  if (!source.startsWith("---\n")) throw new Error(`${fileName}: missing frontmatter`);
  const end = source.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${fileName}: unterminated frontmatter`);

  const frontmatterLines = source.slice(4, end).split("\n");
  const values: MutableFrontmatter = {};
  let activeArray: string | undefined;

  for (const rawLine of frontmatterLines) {
    if (!rawLine.trim()) continue;
    const listMatch = rawLine.match(/^\s+-\s+(.+)$/);
    if (listMatch) {
      if (!activeArray || !ARRAY_FIELDS.has(activeArray)) {
        throw new Error(`${fileName}: list item without an array field`);
      }
      (values[activeArray] as string[]).push(unquote(listMatch[1]));
      continue;
    }

    const fieldMatch = rawLine.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!fieldMatch) throw new Error(`${fileName}: malformed frontmatter line: ${rawLine}`);
    const [, key, rawValue] = fieldMatch;
    activeArray = undefined;
    if (ARRAY_FIELDS.has(key)) {
      if (rawValue.trim()) throw new Error(`${fileName}: ${key} must use a YAML list`);
      values[key] = [];
      activeArray = key;
    } else if (BOOLEAN_FIELDS.has(key)) {
      if (!['true', 'false'].includes(rawValue.trim())) {
        throw new Error(`${fileName}: ${key} must be true or false`);
      }
      values[key] = rawValue.trim() === "true";
    } else {
      values[key] = unquote(rawValue);
    }
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof values[field] !== "string" || !values[field]) {
      throw new Error(`${fileName}: missing ${field}`);
    }
  }
  for (const field of ARRAY_FIELDS) {
    if (!Array.isArray(values[field])) throw new Error(`${fileName}: missing ${field}`);
  }
  for (const field of BOOLEAN_FIELDS) {
    if (typeof values[field] !== "boolean") throw new Error(`${fileName}: missing ${field}`);
  }

  const frontmatter = values as unknown as ArticleFrontmatter;
  if (!SLUG.test(frontmatter.slug)) throw new Error(`${fileName}: invalid slug`);
  if (!ISO_DATE.test(frontmatter.datePublished)) throw new Error(`${fileName}: invalid datePublished`);
  if (frontmatter.dateModified && !ISO_DATE.test(frontmatter.dateModified)) {
    throw new Error(`${fileName}: invalid dateModified`);
  }
  if (frontmatter.dateModified && frontmatter.dateModified < frontmatter.datePublished) {
    throw new Error(`${fileName}: dateModified precedes datePublished`);
  }
  if (frontmatter.tags.length === 0) throw new Error(`${fileName}: tags must not be empty`);

  const body = source.slice(end + 5).trim();
  if (!body) throw new Error(`${fileName}: article body is empty`);
  return { ...frontmatter, body, readingTime: calculateReadingTime(body) };
}

export function calculateReadingTime(markdown: string) {
  const prose = markdown
    .replace(/^:::diagram\s+[a-z0-9-]+$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[[^\]]+\]\([^\)]+\)/g, (match) => match.replace(/\]\([^\)]+\)/, ""))
    .replace(/[#>*_|-]/g, " ");
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

let cachedArticles: readonly WritingArticle[] | undefined;

export function getAllArticles(): readonly WritingArticle[] {
  if (cachedArticles) return cachedArticles;
  const validProjectIds = new Set(projects.map((project) => project.id));
  const validTopicTitles = new Set(writingTopics.map((topic) => topic.title));
  const validLearningIds = new Set(learningItems.map((item) => item.id));
  const files = readdirSync(CONTENT_DIRECTORY).filter((file) => file.endsWith(".md")).sort();
  const articles = files.map((file) => {
    const article = parseArticleSource(readFileSync(join(CONTENT_DIRECTORY, file), "utf8"), file);
    if (`${article.slug}.md` !== file) throw new Error(`${file}: filename must match slug`);
    for (const projectId of article.relatedProjects) {
      if (!validProjectIds.has(projectId)) throw new Error(`${file}: unknown related project ${projectId}`);
    }
    for (const learningId of article.relatedLearning) {
      if (!validLearningIds.has(learningId)) throw new Error(`${file}: unknown related learning item ${learningId}`);
    }
    if (!article.category) throw new Error(`${file}: missing category`);
    if (!validTopicTitles.has(article.category)) {
      throw new Error(`${file}: category "${article.category}" is not a writing topic`);
    }
    return article;
  });

  const slugs = new Set<string>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const article of articles) {
    if (slugs.has(article.slug)) throw new Error(`duplicate article slug: ${article.slug}`);
    if (titles.has(article.title)) throw new Error(`duplicate article title: ${article.title}`);
    if (descriptions.has(article.description)) throw new Error(`duplicate article description: ${article.description}`);
    slugs.add(article.slug);
    titles.add(article.title);
    descriptions.add(article.description);
  }
  for (const article of articles) {
    for (const relatedSlug of article.relatedWriting) {
      if (!slugs.has(relatedSlug)) throw new Error(`${article.slug}: unknown related article ${relatedSlug}`);
      if (relatedSlug === article.slug) throw new Error(`${article.slug}: article cannot relate to itself`);
    }
  }

  cachedArticles = articles;
  return cachedArticles;
}

export function getPublishedArticles(): readonly WritingArticleSummary[] {
  return getAllArticles()
    .filter((article) => !article.draft)
    .sort((left, right) => right.datePublished.localeCompare(left.datePublished))
    .map((article) => {
      const { body, ...summary } = article;
      void body;
      return summary;
    });
}

export function getPublishedArticleBySlug(slug: string): WritingArticle | undefined {
  return getAllArticles().find((article) => article.slug === slug && !article.draft);
}

export function getRelatedArticles(article: WritingArticle, limit = 3): readonly WritingArticleSummary[] {
  const published = getPublishedArticles().filter((candidate) => candidate.slug !== article.slug);
  const explicitOrder = new Map(article.relatedWriting.map((slug, index) => [slug, index]));
  return published
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
      const sharedProjects = candidate.relatedProjects.filter((id) => article.relatedProjects.includes(id)).length;
      const sharedLearning = candidate.relatedLearning.filter((id) => article.relatedLearning.includes(id)).length;
      const explicit = explicitOrder.has(candidate.slug);
      return {
        candidate,
        score: (explicit ? 100 : 0) + sharedProjects * 10 + sharedLearning * 5 + sharedTags,
        explicitIndex: explicitOrder.get(candidate.slug) ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) =>
      right.score - left.score
      || left.explicitIndex - right.explicitIndex
      || right.candidate.datePublished.localeCompare(left.candidate.datePublished)
      || left.candidate.title.localeCompare(right.candidate.title)
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
