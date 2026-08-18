// Pure builders for the site's Person/ProfilePage structured data (JSON-LD).
// Every field is derived from data/profile.ts and data/engineering-areas.ts
// -- the site's existing canonical sources -- so there is nothing here to
// keep in sync by hand. No React, no Next.js import, so this is directly
// unit-testable and runnable under plain `node` (see person.test.ts).
import type { EngineeringArea, Profile } from "../content/types.ts";

export type PersonEntity = {
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: readonly string[];
  knowsAbout: readonly string[];
};

export type ProfilePageEntity = {
  "@context": "https://schema.org";
  "@type": "ProfilePage";
  "@id": string;
  mainEntity: { "@type": "Person"; "@id": string };
};

/** The one canonical @id for this person, reused everywhere the site
 * references them (this file, app/experience/page.tsx's Occupation block,
 * app/projects/[slug]/page.tsx's SoftwareSourceCode author) so JSON-LD
 * consumers merge facts about a single entity instead of seeing several
 * unconnected ones. */
export function personId(profile: Profile): string {
  return `${profile.links.website}/#person`;
}

/** sameAs only ever includes links that already exist in
 * data/profile.ts -- nothing here is guessed or invented. */
export function buildPersonEntity(profile: Profile, engineeringAreas: readonly EngineeringArea[]): PersonEntity {
  const sameAs = [profile.links.github, profile.links.linkedin].filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
  // Engineering areas are the site's existing skill taxonomy (see
  // data/engineering-areas.ts, already rendered on /resume and /learning);
  // knowsAbout reuses their titles rather than introducing a second,
  // differently-shaped skills list.
  const knowsAbout = engineeringAreas.map((area) => area.title);

  return {
    "@type": "Person",
    "@id": personId(profile),
    name: profile.name,
    url: profile.links.website,
    jobTitle: profile.title,
    description: profile.summary,
    sameAs,
    knowsAbout,
  };
}

export function buildProfilePageEntity(profile: Profile): ProfilePageEntity {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profile.links.website}/#profile`,
    mainEntity: { "@type": "Person", "@id": personId(profile) },
  };
}

/** Combines both entities into one `@graph` so the page renders a single
 * <script type="application/ld+json"> instead of two separate blocks that
 * would otherwise both need `@context`. */
export function buildProfileGraph(profile: Profile, engineeringAreas: readonly EngineeringArea[]) {
  const profilePage = buildProfilePageEntity(profile);
  const person = buildPersonEntity(profile, engineeringAreas);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": profilePage["@type"], "@id": profilePage["@id"], mainEntity: profilePage.mainEntity },
      person,
    ],
  };
}
