import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReadingTime,
  getAllArticles,
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
  parseArticleSource,
} from "./articles.ts";
import { isWritingDiagramId } from "./diagrams.ts";
import { getWritingTopicGroup, getWritingTopicGroups } from "./topics.ts";

test("published articles exclude drafts and remain date sorted", () => {
  const all = getAllArticles();
  const published = getPublishedArticles();
  assert.equal(all.length, 30);
  assert.equal(published.length, 29);
  assert.ok(published.every((article) => article.draft === false));
  assert.ok(published.every((article, index) => index === 0 || published[index - 1].datePublished >= article.datePublished));
  assert.equal(getPublishedArticleBySlug("redis-cache-stampede"), undefined);
});

test("article category is preserved and is a declared topic", () => {
  const article = getPublishedArticleBySlug("building-reliable-kafka-event-processing-platform");
  assert.equal(article?.category, "Distributed Systems");
  const titles = new Set(getWritingTopicGroups().map((group) => group.topic.title));
  assert.ok(getPublishedArticles().every((entry) => titles.has(entry.category ?? "")));
});

test("every published article carries at least one recognized diagram", () => {
  for (const article of getPublishedArticles()) {
    const source = getPublishedArticleBySlug(article.slug);
    assert.ok(source);
    const diagrams = [...source.body.matchAll(/^:::diagram\s+([a-z0-9-]+)$/gm)];
    assert.ok(diagrams.length >= 1, article.slug);
    for (const [, id] of diagrams) {
      assert.equal(isWritingDiagramId(id), true, `${article.slug}: ${id}`);
    }
  }
});

test("related writing is deterministic and never returns the current article", () => {
  const article = getPublishedArticleBySlug("kafka-at-least-once-idempotency");
  assert.ok(article);
  const related = getRelatedArticles(article);
  assert.equal(related[0].slug, "transactional-outbox-kafka");
  assert.ok(related.every((candidate) => candidate.slug !== article.slug && !candidate.draft));
});

test("agent-friendly codebase articles link reciprocally through normal content routes", () => {
  const argument = getPublishedArticleBySlug("stop-asking-coding-agents-to-guess-whats-wrong");
  const implementation = getPublishedArticleBySlug("building-an-observability-driven-optimization-loop-for-coding-agents");
  assert.ok(argument);
  assert.ok(implementation);
  assert.equal(getRelatedArticles(argument)[0].slug, implementation.slug);
  assert.equal(getRelatedArticles(implementation)[0].slug, argument.slug);
  for (const article of [argument, implementation]) {
    assert.ok(article.relatedProjects.includes("ml-platform-infrastructure"));
    assert.equal(article.datePublished, "2026-10-13");
    assert.ok(article.seoTitle);
  }
});

test("frontmatter validation rejects malformed publication data", () => {
  assert.throws(
    () => parseArticleSource("---\ntitle: Missing fields\n---\nBody", "invalid.md"),
    /missing description/,
  );
});

test("reading time ignores fenced code and has a one-minute floor", () => {
  assert.equal(calculateReadingTime("A short note.\n\n```text\n" + "word ".repeat(500) + "\n```"), 1);
});

test("every published article belongs to exactly one declared writing topic", () => {
  const published = getPublishedArticles();
  const groups = getWritingTopicGroups();
  const grouped = groups.flatMap((group) => group.articles.map((article) => article.slug));

  assert.equal(grouped.length, published.length);
  assert.equal(new Set(grouped).size, grouped.length, "an article appears under more than one topic");
  for (const article of published) {
    assert.ok(grouped.includes(article.slug), `${article.slug} is not grouped under any topic`);
  }
  assert.ok(groups.every((group) => group.articles.length > 0));
});

test("topic slugs are unique and resolvable", () => {
  const groups = getWritingTopicGroups();
  const slugs = groups.map((group) => group.topic.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.equal(getWritingTopicGroup(slug)?.topic.slug, slug);
  }
  assert.equal(getWritingTopicGroup("no-such-topic"), undefined);
});
