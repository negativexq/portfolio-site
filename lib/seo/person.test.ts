import { test } from "node:test";
import assert from "node:assert/strict";

import { engineeringAreas } from "../../data/engineering-areas.ts";
import { profile } from "../../data/profile.ts";
import { buildPersonEntity, buildProfileGraph, buildProfilePageEntity, personId } from "./person.ts";

test("the generated JSON-LD is valid JSON and round-trips", () => {
  const graph = buildProfileGraph(profile, engineeringAreas);
  const serialized = JSON.stringify(graph);
  const parsed = JSON.parse(serialized);
  assert.deepEqual(parsed, graph);
});

test("Person entity has the required identity fields with correct @type", () => {
  const person = buildPersonEntity(profile, engineeringAreas);
  assert.equal(person["@type"], "Person");
  assert.ok(person.name.length > 0, "name must be present");
  assert.ok(person.url.length > 0, "url must be present");
  assert.ok(Array.isArray(person.sameAs), "sameAs must be present");
  assert.ok(person["@id"].startsWith(profile.links.website), "@id must be scoped to the canonical site");
});

test("ProfilePage entity has the correct @type and points at the Person by @id", () => {
  const profilePage = buildProfilePageEntity(profile);
  assert.equal(profilePage["@type"], "ProfilePage");
  assert.equal(profilePage.mainEntity["@type"], "Person");
  assert.equal(profilePage.mainEntity["@id"], personId(profile));
});

test("sameAs only contains URLs that already exist in data/profile.ts -- nothing invented", () => {
  const person = buildPersonEntity(profile, engineeringAreas);
  for (const url of person.sameAs) {
    assert.ok(
      Object.values(profile.links).includes(url),
      `sameAs URL "${url}" does not come from data/profile.ts's links`,
    );
  }
});

test("name, url, jobTitle and description come from data/profile.ts, not a second copy", () => {
  const person = buildPersonEntity(profile, engineeringAreas);
  assert.equal(person.name, profile.name);
  assert.equal(person.url, profile.links.website);
  assert.equal(person.jobTitle, profile.title);
  assert.equal(person.description, profile.summary);
});

test("knowsAbout reuses the existing engineering-areas taxonomy, not a new one", () => {
  const person = buildPersonEntity(profile, engineeringAreas);
  assert.deepEqual(person.knowsAbout, engineeringAreas.map((area) => area.title));
});

test("changing the profile changes the generated entity (not hardcoded)", () => {
  const alteredProfile = { ...profile, name: "Test Person", title: "Test Title" };
  const person = buildPersonEntity(alteredProfile, engineeringAreas);
  assert.equal(person.name, "Test Person");
  assert.equal(person.jobTitle, "Test Title");
});

test("the profile graph contains exactly one Person and one ProfilePage -- no duplicate/conflicting entities", () => {
  const graph = buildProfileGraph(profile, engineeringAreas);
  const persons = graph["@graph"].filter((entity) => entity["@type"] === "Person");
  const profilePages = graph["@graph"].filter((entity) => entity["@type"] === "ProfilePage");
  assert.equal(persons.length, 1);
  assert.equal(profilePages.length, 1);
  assert.equal(persons[0]["@id"], profilePages[0].mainEntity["@id"]);
});

test("no malformed output for any field", () => {
  const graph = buildProfileGraph(profile, engineeringAreas);
  const serialized = JSON.stringify(graph);
  for (const forbidden of ["undefined", "\"null\"", "[object Object]"]) {
    assert.ok(!serialized.includes(forbidden), `output must not contain literal ${forbidden}`);
  }
});
