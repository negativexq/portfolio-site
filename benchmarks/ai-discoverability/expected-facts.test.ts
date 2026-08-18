import { test } from "node:test";
import assert from "node:assert/strict";

import { experiences } from "../../data/experience.ts";
import { flagshipProjects } from "../../data/projects.ts";
import { resolveExpectedFacts } from "./expected-facts.ts";

test("project-technologies resolves to the real, current technologies list", () => {
  const project = flagshipProjects[0];
  const result = resolveExpectedFacts({ type: "project-technologies", id: project.id, slug: project.slug });
  assert.ok(result.facts.includes(project.title));
  for (const technology of project.technologies) {
    assert.ok(result.facts.includes(technology), `expected "${technology}" in resolved facts`);
  }
  assert.equal(result.expectedDocId, `project:${project.slug}`);
});

test("experience-impact resolves to that impact's own topics, not another impact's", () => {
  const experience = experiences[0];
  const [firstImpact, secondImpact] = experience.impacts;
  const first = resolveExpectedFacts({ type: "experience-impact", id: experience.id, impactId: firstImpact.id });
  const second = resolveExpectedFacts({ type: "experience-impact", id: experience.id, impactId: secondImpact.id });
  assert.ok(first.facts.includes(firstImpact.title));
  assert.ok(!first.facts.includes(secondImpact.title));
  assert.ok(second.facts.includes(secondImpact.title));
});

test("an unknown id throws instead of silently returning empty/fabricated facts", () => {
  assert.throws(() => resolveExpectedFacts({ type: "project-technologies", id: "nope", slug: "nope" }));
  assert.throws(() =>
    resolveExpectedFacts({ type: "experience-impact", id: "nope", impactId: "nope" }),
  );
});

test("no malformed output for any resolvable source", () => {
  const project = flagshipProjects[0];
  const result = resolveExpectedFacts({ type: "project-proof", id: project.id, slug: project.slug });
  for (const fact of result.facts) {
    assert.notEqual(fact, undefined);
    assert.notEqual(fact, "undefined");
    assert.notEqual(fact, "null");
  }
});
