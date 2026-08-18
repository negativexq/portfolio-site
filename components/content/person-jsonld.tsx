import { engineeringAreas } from "@/data/engineering-areas";
import { profile } from "@/data/profile";
import { buildProfileGraph } from "@/lib/seo/person";
import { JsonLd } from "./json-ld";

/** Renders the site's ProfilePage + Person structured data as one
 * `@graph` script tag. Built entirely from data/profile.ts and
 * data/engineering-areas.ts -- see lib/seo/person.ts. Render this once,
 * on the page that represents site-wide identity (the homepage), not on
 * every page. */
export function PersonJsonLd() {
  return <JsonLd data={buildProfileGraph(profile, engineeringAreas)} />;
}
