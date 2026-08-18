// Resolves a SourcePointer (see types.ts) to the facts a grounded answer
// should contain, by reading the same data/*.ts files the site itself
// renders from. Nothing here is a hand-typed "expected answer" — if the
// canonical data changes, these facts change with it on the next run.
import { engineeringAreas } from "../../data/engineering-areas.ts";
import { experiences } from "../../data/experience.ts";
import { learningAreas } from "../../data/learning-areas.ts";
import { learningItems } from "../../data/learning.ts";
import { getProjectBySlug } from "../../data/projects.ts";
import type { ExpectedFacts, SourcePointer } from "./types.ts";

function required<T>(value: T | undefined, description: string): T {
  if (value === undefined) throw new Error(`expected-facts: could not resolve ${description}`);
  return value;
}

export function resolveExpectedFacts(source: SourcePointer): ExpectedFacts {
  switch (source.type) {
    case "experience-summary": {
      const experience = required(
        experiences.find((candidate) => candidate.id === source.id),
        `experience "${source.id}"`,
      );
      return {
        facts: [experience.company, experience.role, experience.period],
        expectedDocId: "experience",
      };
    }
    case "experience-impact": {
      const experience = required(
        experiences.find((candidate) => candidate.id === source.id),
        `experience "${source.id}"`,
      );
      const impact = required(
        experience.impacts.find((candidate) => candidate.id === source.impactId),
        `experience impact "${source.impactId}"`,
      );
      const facts = [impact.title, ...impact.topics];
      if (impact.proof) facts.push(impact.proof.value);
      return { facts, expectedDocId: "experience" };
    }
    case "project-technologies": {
      const project = required(getProjectBySlug(source.slug), `project "${source.slug}"`);
      return { facts: [project.title, ...project.technologies], expectedDocId: `project:${project.slug}` };
    }
    case "project-proof": {
      const project = required(getProjectBySlug(source.slug), `project "${source.slug}"`);
      const proof = project.proofPoints[0];
      const facts = [project.title];
      if (proof) facts.push(proof.label, proof.value);
      return { facts, expectedDocId: `project:${project.slug}` };
    }
    case "project-concepts": {
      const project = required(getProjectBySlug(source.slug), `project "${source.slug}"`);
      return { facts: [project.title, ...project.concepts], expectedDocId: `project:${project.slug}` };
    }
    case "engineering-area": {
      const area = required(
        engineeringAreas.find((candidate) => candidate.id === source.id),
        `engineering area "${source.id}"`,
      );
      return { facts: [area.title, ...area.technologies], expectedDocId: "skills" };
    }
    case "learning-area": {
      const area = required(
        learningAreas.find((candidate) => candidate.name === source.id),
        `learning area "${source.id}"`,
      );
      return { facts: [area.name, area.foundation, area.direction], expectedDocId: "learning" };
    }
    case "learning-item": {
      const item = required(
        learningItems.find((candidate) => candidate.id === source.itemId),
        `learning item "${source.itemId}"`,
      );
      return { facts: [item.title, ...item.topics], expectedDocId: "learning" };
    }
    default: {
      const exhaustive: never = source;
      throw new Error(`expected-facts: unhandled source type ${JSON.stringify(exhaustive)}`);
    }
  }
}
