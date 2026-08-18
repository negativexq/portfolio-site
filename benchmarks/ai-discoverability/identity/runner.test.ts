import { test } from "node:test";
import assert from "node:assert/strict";

import { profile } from "../../../data/profile.ts";
import { extractJsonLdGraphs, runChecks } from "./runner.ts";

const samplePerson = {
  "@type": "Person",
  name: profile.name,
  url: profile.links.website,
  jobTitle: profile.title,
  sameAs: [profile.links.github, profile.links.linkedin],
};

test("extractJsonLdGraphs parses an @graph script tag", () => {
  const html = `<html><body><script type="application/ld+json">${JSON.stringify({
    "@graph": [samplePerson, { "@type": "ProfilePage" }],
  })}</script></body></html>`;
  const entities = extractJsonLdGraphs(html);
  assert.equal(entities.length, 2);
  assert.ok(entities.some((entity) => entity["@type"] === "Person"));
});

test("extractJsonLdGraphs parses a single-entity script tag", () => {
  const html = `<script type="application/ld+json">${JSON.stringify(samplePerson)}</script>`;
  const entities = extractJsonLdGraphs(html);
  assert.equal(entities.length, 1);
});

test("extractJsonLdGraphs returns an empty array when there is no JSON-LD", () => {
  assert.deepEqual(extractJsonLdGraphs("<html><body>no scripts here</body></html>"), []);
});

test("all checks pass against a correctly-populated Person entity", () => {
  const query = { id: "name-only", query: "Ömer Faruk Koç", checks: ["entityFound", "websiteAssociation", "githubAssociation"] };
  const results = runChecks(query, samplePerson);
  assert.ok(results.every((result) => result.pass));
});

test("entityFound fails when no Person entity was found", () => {
  const query = { id: "name-only", query: "Ömer Faruk Koç", checks: ["entityFound"] };
  const results = runChecks(query, undefined);
  assert.equal(results[0].pass, false);
});

test("occupationMatch fails on an unrelated jobTitle", () => {
  const unrelated = { ...samplePerson, jobTitle: "Chef" };
  const query = { id: "name-mlops", query: "Ömer Faruk Koç MLOps", checks: ["occupationMatch"] };
  const results = runChecks(query, unrelated);
  assert.equal(results[0].pass, false);
});
