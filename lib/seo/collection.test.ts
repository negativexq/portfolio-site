import { test } from "node:test";
import assert from "node:assert/strict";

import { profile } from "../../data/profile.ts";
import { buildCollectionPage, buildWebPage } from "./collection.ts";
import { personId } from "./person.ts";

test("CollectionPage lists items in order with absolute URLs", () => {
  const page = buildCollectionPage(profile, {
    path: "/writing",
    name: "Writing",
    description: "Engineering notes.",
    items: [
      { name: "First", url: "/writing/first" },
      { name: "Unlinked" },
    ],
  });
  assert.equal(page["@type"], "CollectionPage");
  assert.equal(page.url, `${profile.links.website}/writing`);
  assert.equal(page.mainEntity.numberOfItems, 2);
  assert.deepEqual(page.mainEntity.itemListElement[0], {
    "@type": "ListItem",
    position: 1,
    name: "First",
    url: `${profile.links.website}/writing/first`,
  });
  assert.equal("url" in page.mainEntity.itemListElement[1], false);
});

test("WebPage points at the site's single Person entity", () => {
  const page = buildWebPage(profile, { path: "/graph", name: "Graph", description: "Map." });
  assert.equal(page["@type"], "WebPage");
  assert.deepEqual(page.author, { "@id": personId(profile) });
  assert.deepEqual(JSON.parse(JSON.stringify(page)), page);
});
