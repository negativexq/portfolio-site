import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveExpectedFacts } from "./expected-facts.ts";
import type { Question } from "./types.ts";

const here = dirname(fileURLToPath(import.meta.url));
const questions: Question[] = JSON.parse(readFileSync(join(here, "questions.json"), "utf8"));

test("questions.json loads as a non-empty array", () => {
  assert.ok(Array.isArray(questions));
  assert.ok(questions.length > 0);
});

test("at least 30 questions, per the benchmark requirement", () => {
  assert.ok(questions.length >= 30, `expected >= 30 questions, got ${questions.length}`);
});

test("every question has a unique id and non-empty question text", () => {
  const ids = questions.map((question) => question.id);
  assert.equal(new Set(ids).size, ids.length, "question ids must be unique");
  for (const question of questions) {
    assert.ok(question.question.trim().length > 0, `question ${question.id} has empty text`);
  }
});

test("every question's source pointer resolves against real canonical data", () => {
  for (const question of questions) {
    assert.doesNotThrow(
      () => resolveExpectedFacts(question.source),
      `question ${question.id} has a source pointer that does not resolve`,
    );
  }
});

test("question set covers all four required content areas", () => {
  const coverage = {
    experience: questions.some((q) => q.source.type.startsWith("experience")),
    projects: questions.some((q) => q.source.type.startsWith("project")),
    skills: questions.some((q) => q.source.type === "engineering-area"),
    learning: questions.some((q) => q.source.type.startsWith("learning")),
  };
  for (const [area, covered] of Object.entries(coverage)) {
    assert.ok(covered, `no question covers "${area}"`);
  }
});
