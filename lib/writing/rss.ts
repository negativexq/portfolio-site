import type { WritingArticleSummary } from "./types.ts";

export const WRITING_DESCRIPTION =
  "Notes on production AI, distributed systems, ML infrastructure, reliability, and performance.";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderWritingRss(articles: readonly WritingArticleSummary[], siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  const items = articles.map((article) => {
    const url = `${base}/writing/${article.slug}`;
    return [
      "    <item>",
      `      <title>${escapeXml(article.title)}</title>`,
      `      <description>${escapeXml(article.description)}</description>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(`${article.datePublished}T00:00:00Z`).toUTCString()}</pubDate>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Ömer Faruk Koç: Writing</title>",
    `    <description>${escapeXml(WRITING_DESCRIPTION)}</description>`,
    `    <link>${escapeXml(`${base}/writing`)}</link>`,
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
