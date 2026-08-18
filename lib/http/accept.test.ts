// Run with: node --test lib/http/accept.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import { acceptsMarkdown } from "./accept.ts";

test("markdown only", () => {
  assert.equal(acceptsMarkdown("text/markdown"), true);
});

test("multiple values including markdown", () => {
  assert.equal(acceptsMarkdown("text/markdown, text/plain;q=0.9, */*;q=0.8"), true);
});

test("browser html accept header", () => {
  assert.equal(
    acceptsMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    false,
  );
});

test("wildcard only does not imply markdown", () => {
  assert.equal(acceptsMarkdown("*/*"), false);
});

test("missing accept header", () => {
  assert.equal(acceptsMarkdown(undefined), false);
  assert.equal(acceptsMarkdown(null), false);
  assert.equal(acceptsMarkdown(""), false);
});

test("similar but incorrect media type", () => {
  assert.equal(acceptsMarkdown("application/markdown"), false);
});

test("text/* wildcard subtype does not imply markdown", () => {
  assert.equal(acceptsMarkdown("text/*"), false);
});

test("q=0 explicitly excludes markdown", () => {
  assert.equal(acceptsMarkdown("text/markdown;q=0, */*"), false);
});

test("markdown present but not first, with mixed casing and spacing", () => {
  assert.equal(acceptsMarkdown("  TEXT/HTML ; q=0.8 , Text/Markdown "), true);
});

test("realistic full browser navigation header", () => {
  assert.equal(
    acceptsMarkdown(
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    ),
    false,
  );
});
