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

test("published articles exclude drafts and remain date sorted", () => {
  const all = getAllArticles();
  const published = getPublishedArticles();
  assert.equal(all.length, 15);
  assert.equal(published.length, 14);
  assert.ok(published.every((article) => article.draft === false));
  assert.ok(published.every((article, index) => index === 0 || published[index - 1].datePublished >= article.datePublished));
  assert.equal(getPublishedArticleBySlug("redis-cache-stampede"), undefined);
});

test("article category is preserved when present", () => {
  const article = getPublishedArticleBySlug("building-reliable-kafka-event-processing-platform");
  assert.equal(article?.category, "Engineering");
});

test("every published article has one recognized primary diagram", () => {
  for (const article of getPublishedArticles()) {
    const source = getPublishedArticleBySlug(article.slug);
    assert.ok(source);
    const diagrams = [...source.body.matchAll(/^:::diagram\s+([a-z0-9-]+)$/gm)];
    assert.equal(diagrams.length, 1, article.slug);
    assert.equal(isWritingDiagramId(diagrams[0][1]), true, article.slug);
  }
});

test("related writing is deterministic and never returns the current article", () => {
  const article = getPublishedArticleBySlug("kafka-at-least-once-idempotency");
  assert.ok(article);
  const related = getRelatedArticles(article);
  assert.equal(related[0].slug, "transactional-outbox-kafka");
  assert.ok(related.every((candidate) => candidate.slug !== article.slug && !candidate.draft));
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
