// Pure builders for list and index pages' structured data (JSON-LD). Like
// person.ts, nothing here imports React or Next.js, so it stays testable
// under plain `node`.
import type { Profile } from "../content/types.ts";
import { personId } from "./person.ts";

export type CollectionItem = {
  name: string;
  /** Site-relative path ("/writing/...") or an absolute URL. */
  url?: string;
};

type CollectionPageInput = {
  path: string;
  name: string;
  description: string;
  items: readonly CollectionItem[];
};

function absolute(profile: Profile, url: string) {
  return url.startsWith("http") ? url : `${profile.links.website}${url}`;
}

/** A CollectionPage whose mainEntity is the ordered list the page shows,
 * authored by and about the site's single Person entity. */
export function buildCollectionPage(profile: Profile, { path, name, description, items }: CollectionPageInput) {
  const url = absolute(profile, path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    author: { "@id": personId(profile) },
    about: { "@id": personId(profile) },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.url ? { url: absolute(profile, item.url) } : {}),
      })),
    },
  };
}

/** A plain WebPage about the site's Person, for pages that are not lists. */
export function buildWebPage(profile: Profile, { path, name, description }: Omit<CollectionPageInput, "items">) {
  const url = absolute(profile, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    author: { "@id": personId(profile) },
    about: { "@id": personId(profile) },
  };
}
