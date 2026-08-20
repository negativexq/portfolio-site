import { profile } from "@/data/profile";
import { getPublishedArticles } from "@/lib/writing/articles";
import { renderWritingRss } from "@/lib/writing/rss";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderWritingRss(getPublishedArticles(), profile.links.website), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
