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

test("published articles exclude drafts and remain date sorted", () => {
  const all = getAllArticles();
  const published = getPublishedArticles();
  assert.equal(all.length, 6);
  assert.equal(published.length, 5);
  assert.ok(published.every((article) => article.draft === false));
  assert.ok(published.every((article, index) => index === 0 || published[index - 1].datePublished >= article.datePublished));
  assert.equal(getPublishedArticleBySlug("redis-cache-stampede"), undefined);
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
