import assert from "node:assert/strict";
import test from "node:test";
import { getPublishedArticles } from "./articles.ts";
import { renderWritingRss } from "./rss.ts";

test("RSS contains published canonical URLs and excludes drafts", () => {
  const xml = renderWritingRss(getPublishedArticles(), "https://omerfkoc.dev");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /https:\/\/omerfkoc\.dev\/writing\/kafka-at-least-once-idempotency/);
  assert.doesNotMatch(xml, /redis-cache-stampede/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 6);
});

test("RSS escapes XML text", () => {
  const [article] = getPublishedArticles();
  const xml = renderWritingRss([{ ...article, title: "Kafka & PostgreSQL <notes>" }], "https://omerfkoc.dev");
  assert.match(xml, /Kafka &amp; PostgreSQL &lt;notes&gt;/);
});
