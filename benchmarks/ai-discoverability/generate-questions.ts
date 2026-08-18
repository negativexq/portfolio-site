// One-off generator for questions.json. Run manually with:
//   node benchmarks/ai-discoverability/generate-questions.ts
// It only writes IDs and pointers by reading the real data/*.ts files --
// the natural-language question text is authored here (it's a benchmark
// input/prompt, not site content), but every `source` pointer is only
// valid if it resolves against real canonical data, which expected-facts.ts
// verifies at benchmark run time by throwing on an unknown id.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { engineeringAreas } from "../../data/engineering-areas.ts";
import { experiences } from "../../data/experience.ts";
import { learningAreas } from "../../data/learning-areas.ts";
import { learningItems } from "../../data/learning.ts";
import { flagshipProjects, projects } from "../../data/projects.ts";
import type { Question } from "./types.ts";

const questions: Question[] = [];

// Experience -- companies, roles, responsibilities, technologies.
const experience = experiences[0];
questions.push({
  id: "experience-company-role",
  question: `What company and role does ${experience.company === "Fibabanka" ? "this engineer" : "this person"} hold, and for how long?`,
  source: { type: "experience-summary", id: experience.id },
});
for (const impact of experience.impacts) {
  questions.push({
    id: `experience-impact-${impact.id}`,
    question: `What did this person do regarding ${impact.title.toLowerCase()}, and what technologies were involved?`,
    source: { type: "experience-impact", id: experience.id, impactId: impact.id },
  });
}

// Projects -- architecture, technologies, engineering decisions, metrics.
for (const project of projects) {
  questions.push({
    id: `project-tech-${project.slug}`,
    question: `What technologies does the "${project.title}" project use?`,
    source: { type: "project-technologies", id: project.id, slug: project.slug },
  });
}
for (const project of flagshipProjects) {
  questions.push({
    id: `project-proof-${project.slug}`,
    question: `What measured evidence or metric backs the "${project.title}" project?`,
    source: { type: "project-proof", id: project.id, slug: project.slug },
  });
  questions.push({
    id: `project-concepts-${project.slug}`,
    question: `What engineering concepts does "${project.title}" demonstrate?`,
    source: { type: "project-concepts", id: project.id, slug: project.slug },
  });
}

// Skills -- AI, MLOps, backend, infrastructure categories.
for (const area of engineeringAreas) {
  questions.push({
    id: `skills-${area.id}`,
    question: `What technologies fall under this person's "${area.title}" skill area?`,
    source: { type: "engineering-area", id: area.id },
  });
}

// Learning -- current focus, future direction.
for (const area of learningAreas) {
  questions.push({
    id: `learning-area-${area.index}`,
    question: `What is the current foundation and next direction for "${area.name}"?`,
    source: { type: "learning-area", id: area.name },
  });
}
for (const item of learningItems.slice(0, 3)) {
  questions.push({
    id: `learning-item-${item.id}`,
    question: `What is this person exploring in "${item.title}"?`,
    source: { type: "learning-item", id: item.id, itemId: item.id },
  });
}

const outputPath = join(dirname(fileURLToPath(import.meta.url)), "questions.json");
writeFileSync(outputPath, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Wrote ${questions.length} questions to ${outputPath}`);
