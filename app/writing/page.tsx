import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { TagList } from "@/components/content/tag-list";
import { getPublishedArticles } from "@/lib/writing/articles";
import { formatArticleDate } from "@/lib/writing/format";
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
  const articles = getPublishedArticles();

  return (
    <main>
      <header className="page-hero writing-hero container">
        <p className="eyebrow">Engineering notes</p>
        <h1>Writing</h1>
        <p>{WRITING_DESCRIPTION}</p>
        <a className="writing-rss-link" href="/rss.xml">
          <Rss aria-hidden="true" size={13} /> RSS feed
        </a>
      </header>

      <section className="writing-index section-shell" aria-labelledby="published-writing-heading">
        <div className="container">
          <h2 className="sr-only" id="published-writing-heading">Published writing</h2>
          <div className="writing-list">
            {articles.map((article) => (
              <article className="writing-card" key={article.slug}>
                <div className="writing-card-meta">
                  {article.category ? <span>{article.category}</span> : null}
                  <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished)}</time>
                  <span>{article.readingTime} min read</span>
                </div>
                <div className="writing-card-body">
                  <h2><Link href={`/writing/${article.slug}`}>{article.title}</Link></h2>
                  <p>{article.description}</p>
                  <TagList items={article.tags} label={`${article.title} topics`} />
                </div>
                <Link className="writing-card-link" href={`/writing/${article.slug}`} aria-label={`Read ${article.title}`}>
                  Read <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
