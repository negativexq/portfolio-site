import { test } from "node:test";
import assert from "node:assert/strict";

import {
  bytesOf,
  compressionRatio,
  estimateTokens,
  factPresenceRate,
  formatBytes,
  formatPercent,
  recallAtK,
} from "./metrics.ts";

test("estimateTokens is a deterministic chars/4 approximation", () => {
  assert.equal(estimateTokens(""), 0);
  assert.equal(estimateTokens("abcd"), 1);
  assert.equal(estimateTokens("a".repeat(100)), 25);
});

test("compressionRatio handles the zero-baseline edge case without NaN", () => {
  assert.equal(compressionRatio(0, 0), 0);
  assert.equal(compressionRatio(100, 50), 50);
  assert.equal(compressionRatio(100, 100), 0);
});

test("recallAtK counts only exact expectedDocId hits within the top k", () => {
  const results = [
    { retrievedDocIds: ["a", "b", "c"], expectedDocId: "a" },
    { retrievedDocIds: ["b", "a", "c"], expectedDocId: "a" },
    { retrievedDocIds: ["b", "c", "d"], expectedDocId: "a" },
  ];
  assert.equal(recallAtK(results, 1), 1 / 3);
  assert.equal(recallAtK(results, 2), 2 / 3);
  assert.equal(recallAtK(results, 3), 2 / 3);
  assert.equal(recallAtK([], 5), 0);
});

test("factPresenceRate requires every expected fact, case-insensitively", () => {
  const results = [
    { context: "Uses Kafka and PostgreSQL for delivery.", expectedFacts: ["Kafka", "PostgreSQL"] },
    { context: "Uses Kafka only.", expectedFacts: ["Kafka", "PostgreSQL"] },
  ];
  assert.equal(factPresenceRate(results), 0.5);
  assert.equal(factPresenceRate([]), 0);
});

test("formatBytes / formatPercent produce readable, non-empty output", () => {
  assert.equal(formatBytes(500), "500 B");
  assert.equal(formatBytes(2048), "2.0 KB");
  assert.equal(formatBytes(2 * 1024 * 1024), "2.00 MB");
  assert.equal(formatPercent(78.456), "78.5%");
});

test("bytesOf measures UTF-8 byte length, not JS string length", () => {
  assert.equal(bytesOf("abc"), 3);
  assert.ok(bytesOf("Ömer") > "Ömer".length, "multi-byte characters must count as more than one byte");
});
