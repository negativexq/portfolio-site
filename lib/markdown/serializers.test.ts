// Lightweight tests for the Markdown serialization layer, using only
// Node's built-in test runner and assert module (no new dependency —
// Node 22+ runs TypeScript directly). Run with:
//   node --test lib/markdown/serializers.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import { engineeringAreas } from "../../data/engineering-areas.ts";
import { experiences } from "../../data/experience.ts";
import { goReliabilityLabs } from "../../data/go-reliability-labs.ts";
import { learningAreas } from "../../data/learning-areas.ts";
import { learningItems } from "../../data/learning.ts";
import { profile } from "../../data/profile.ts";
import { flagshipProjects, getProjectById, projects } from "../../data/projects.ts";
import type { Project } from "../content/types.ts";
import { renderExperienceSection } from "./experience.ts";
import { escapeMarkdown, renderBulletList, renderTechList } from "./helpers.ts";
import { renderLearningSection } from "./learning.ts";
import { renderLlmsTxt } from "./llms.ts";
import { renderProjectEntry, renderProjectsSection, renderSupportingLabGroup } from "./projects.ts";
import { renderResumeMarkdown } from "./resume.ts";
import { renderSkillsSection } from "./skills.ts";

const FIXTURE_PROJECT: Project = {
  id: "fixture-project",
  slug: "fixture-project",
  order: 999,
  title: "Fixture Project Alpha",
  category: "Agent Systems / AI Platform",
  status: "current",
  flagship: false,
  summary: "A fixture project used only by serializer tests.",
  directAnswer: "Fixture Project Alpha is a test fixture.",
  whyItExists: "Exists to prove the serializer renders from input, not from hardcoded text.",
  technologies: ["FixtureLang"],
  concepts: ["Fixture Concept"],
  proofPoints: [{ label: "Fixture metric", value: "42", scope: "Fixture scope" }],
  roadmap: [],
  relationships: [],
  githubUrl: "https://github.com/example/fixture-project",
};

test("projects.md contains a known canonical project title", () => {
  const markdown = renderProjectsSection(projects);
  assert.ok(projects.length > 0, "expected data/projects.ts to have at least one project");
  assert.ok(
    markdown.includes(`## ${projects[0].title}`),
    `expected rendered output to contain "## ${projects[0].title}"`,
  );
});

test("renderProjectEntry reflects the given object, not a hardcoded catalogue", () => {
  const markdownA = renderProjectEntry(FIXTURE_PROJECT);
  assert.ok(markdownA.includes("Fixture Project Alpha"));
  assert.ok(markdownA.includes("FixtureLang"));
  assert.ok(markdownA.includes("https://github.com/example/fixture-project"));

  const renamed: Project = { ...FIXTURE_PROJECT, title: "Fixture Project Beta", technologies: ["OtherLang"] };
  const markdownB = renderProjectEntry(renamed);
  assert.ok(markdownB.includes("Fixture Project Beta"));
  assert.ok(markdownB.includes("OtherLang"));
  assert.ok(!markdownB.includes("Fixture Project Alpha"), "changing the input must change the output");
  assert.ok(!markdownB.includes("FixtureLang"), "the old technology must not linger after the input changed");
});

test("no malformed output for missing optional fields", () => {
  const minimal: Project = {
    ...FIXTURE_PROJECT,
    id: "fixture-minimal",
    slug: "fixture-minimal",
    title: "Fixture Minimal",
    technologies: [],
    concepts: [],
    proofPoints: [],
    heroMetrics: undefined,
    highlights: undefined,
    evolvedFrom: undefined,
  };
  const markdown = renderProjectEntry(minimal);
  for (const forbidden of ["undefined", "null", "[object Object]"]) {
    assert.ok(!markdown.includes(forbidden), `output must not contain literal "${forbidden}"`);
  }
});

test("no malformed output across the full generated corpus", () => {
  const corpus = [
    renderProjectsSection(projects),
    renderSupportingLabGroup(goReliabilityLabs),
    renderExperienceSection(experiences),
    renderSkillsSection(engineeringAreas),
    renderLearningSection(learningAreas, learningItems, getProjectById, profile.links.website),
    renderResumeMarkdown({
      profile,
      experiences,
      flagshipProjects,
      engineeringAreas,
      learningAreas,
      learningItems,
      getProjectById,
    }),
    renderLlmsTxt(profile),
  ].join("\n\n");

  for (const forbidden of ["undefined", "null", "[object Object]"]) {
    assert.ok(!corpus.includes(forbidden), `generated corpus must not contain literal "${forbidden}"`);
  }
});

test("helpers guard against undefined/null/empty input", () => {
  assert.equal(renderBulletList([]), "");
  assert.equal(renderBulletList([undefined, null, "", "  ", "real"]), "- real");
  assert.equal(renderTechList("Technologies", []), undefined);
  assert.equal(escapeMarkdown("prediction_id [x] *y* `z`"), "prediction\\_id \\[x\\] \\*y\\* \\`z\\`");
});

test("project and related-project links render as absolute, well-formed URLs", () => {
  const markdown = renderProjectEntry(FIXTURE_PROJECT);
  assert.ok(markdown.includes("**Repository:** https://github.com/example/fixture-project"));

  const itemWithConnection = learningItems.find((item) => item.connectedProjectIds.length > 0);
  assert.ok(itemWithConnection, "expected at least one learning item connected to a project for this test");
  const learningMarkdown = renderLearningSection(
    learningAreas,
    learningItems,
    getProjectById,
    profile.links.website,
  );
  const connectedProject = getProjectById(itemWithConnection!.connectedProjectIds[0]);
  assert.ok(connectedProject);
  assert.ok(
    learningMarkdown.includes(`(${profile.links.website}/projects/${connectedProject!.slug})`),
    "expected a well-formed absolute link to the related project",
  );
});

test("llms.txt references every machine-readable endpoint", () => {
  const markdown = renderLlmsTxt(profile);
  for (const path of ["/resume.md", "/projects.md", "/experience.md", "/skills.md", "/learning.md"]) {
    assert.ok(markdown.includes(`${profile.links.website}${path}`), `expected llms.txt to reference ${path}`);
  }
});
