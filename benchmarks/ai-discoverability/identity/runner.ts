// Deterministic identity-resolution check: node benchmarks/ai-discoverability/identity/runner.ts
// (wired to `npm run benchmark:identity`). Extends the AI discoverability
// suite -- same "fetch the real running site, don't invent data" rule.
// No search engine or external API is queried (none is available
// deterministically); instead this verifies the actual rendered JSON-LD
// on the homepage correctly asserts the associations a search engine or
// AI system would need to disambiguate this Person entity, for each of
// the four query scenarios in queries.json.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { profile } from "../../../data/profile.ts";

const here = dirname(fileURLToPath(import.meta.url));

type QueryCase = { id: string; query: string; checks: readonly string[] };
type CheckResult = { check: string; pass: boolean; detail: string };
type QueryResult = { id: string; query: string; results: CheckResult[] };

type JsonLdEntity = Record<string, unknown> & { "@type"?: string };

export function extractJsonLdGraphs(html: string): JsonLdEntity[] {
  const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const entities: JsonLdEntity[] = [];
  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(html)) !== null) {
    const parsed = JSON.parse(match[1]);
    if (Array.isArray(parsed["@graph"])) entities.push(...parsed["@graph"]);
    else entities.push(parsed);
  }
  return entities;
}

export function runChecks(query: QueryCase, person: JsonLdEntity | undefined): CheckResult[] {
  return query.checks.map((check): CheckResult => {
    switch (check) {
      case "entityFound":
        return {
          check,
          pass: Boolean(person && person.name === profile.name),
          detail: person ? `found Person "${person.name}"` : "no Person entity found",
        };
      case "websiteAssociation":
        return {
          check,
          pass: person?.url === profile.links.website,
          detail: `url: ${String(person?.url ?? "missing")}`,
        };
      case "githubAssociation": {
        const sameAs = Array.isArray(person?.sameAs) ? (person!.sameAs as unknown[]) : [];
        return {
          check,
          pass: sameAs.includes(profile.links.github),
          detail: `sameAs includes GitHub: ${sameAs.includes(profile.links.github)}`,
        };
      }
      case "linkedinAssociation": {
        const sameAs = Array.isArray(person?.sameAs) ? (person!.sameAs as unknown[]) : [];
        return {
          check,
          pass: sameAs.includes(profile.links.linkedin),
          detail: `sameAs includes LinkedIn: ${sameAs.includes(profile.links.linkedin)}`,
        };
      }
      case "occupationMatch": {
        const jobTitle = typeof person?.jobTitle === "string" ? person.jobTitle : "";
        const queryKeywords = query.query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
        const matched = queryKeywords.some((word) => jobTitle.toLowerCase().includes(word));
        return { check, pass: matched && jobTitle.length > 0, detail: `jobTitle: "${jobTitle}"` };
      }
      default:
        return { check, pass: false, detail: `unknown check "${check}"` };
    }
  });
}

async function main() {
  const baseUrl = (process.env.BENCHMARK_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const queries: QueryCase[] = JSON.parse(readFileSync(join(here, "queries.json"), "utf8"));

  console.log("Identity Resolution Benchmark");
  console.log("=".repeat(60));
  console.log(`Target: ${baseUrl}\n`);

  const response = await fetch(`${baseUrl}/`);
  const html = await response.text();
  const entities = extractJsonLdGraphs(html);
  const person = entities.find((entity) => entity["@type"] === "Person");
  const profilePage = entities.find((entity) => entity["@type"] === "ProfilePage");

  console.log(`Person entity found: ${Boolean(person)}`);
  console.log(`ProfilePage entity found: ${Boolean(profilePage)}\n`);

  const results: QueryResult[] = queries.map((query) => ({
    id: query.id,
    query: query.query,
    results: runChecks(query, person),
  }));

  let totalChecks = 0;
  let passedChecks = 0;
  for (const result of results) {
    console.log(`Query: "${result.query}"`);
    for (const check of result.results) {
      totalChecks += 1;
      if (check.pass) passedChecks += 1;
      console.log(`  ${check.pass ? "PASS" : "FAIL"}  ${check.check} -- ${check.detail}`);
    }
    console.log("");
  }

  console.log("=".repeat(60));
  console.log(`${passedChecks}/${totalChecks} checks passed`);

  const reportPath = join(here, "report.md");
  writeFileSync(
    reportPath,
    [
      "# Identity Resolution Benchmark Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      `Target: ${baseUrl}`,
      `Person entity found: ${Boolean(person)}`,
      `ProfilePage entity found: ${Boolean(profilePage)}`,
      `Result: ${passedChecks}/${totalChecks} checks passed`,
      "",
      ...results.flatMap((result) => [
        `## "${result.query}"`,
        "",
        ...result.results.map((check) => `- ${check.pass ? "PASS" : "FAIL"} \`${check.check}\` -- ${check.detail}`),
        "",
      ]),
    ].join("\n"),
  );
  console.log(`\nReport written to ${reportPath}`);

  if (passedChecks !== totalChecks) process.exitCode = 1;
}

// Only run when executed directly (`node runner.ts`), not when imported
// for its pure functions (see runner.test.ts).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
