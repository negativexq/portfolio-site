import type { Metadata } from "next";
import { JsonLd } from "@/components/content/json-ld";
import { profile } from "@/data/profile";
import { buildCollectionPage } from "@/lib/seo/collection";
import { Rss } from "lucide-react";
import { WritingExplorer } from "@/components/writing/writing-explorer";
import { getWritingTopicGroups } from "@/lib/writing/topics";
import { WRITING_DESCRIPTION } from "@/lib/writing/rss";

export const metadata: Metadata = {
  title: "Writing",
  description: WRITING_DESCRIPTION,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: "/writing",
    title: "Writing",
    description: WRITING_DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: "Ömer Faruk Koç" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing",
    description: WRITING_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function WritingPage() {
  const groups = getWritingTopicGroups();

  return (
    <main>
      <JsonLd
        data={buildCollectionPage(profile, {
          path: "/writing",
          name: "Writing",
          description: WRITING_DESCRIPTION,
          items: groups.flatMap((group) => group.articles).map((article) => ({ name: article.title, url: `/writing/${article.slug}` })),
        })}
      />
      <header className="page-hero writing-hero container">
        <h1>Writing</h1>
        <p>{WRITING_DESCRIPTION}</p>
        <a className="writing-rss-link" href="/rss.xml">
          <Rss aria-hidden="true" size={13} /> RSS feed
        </a>
      </header>

      <WritingExplorer groups={groups} />
    </main>
  );
}
