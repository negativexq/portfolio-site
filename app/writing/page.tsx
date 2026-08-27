import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { TagList } from "@/components/content/tag-list";
import { getWritingTopicGroups } from "@/lib/writing/topics";
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
  const groups = getWritingTopicGroups();

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

      <nav className="writing-topic-nav container" aria-label="Writing topics">
        {groups.map((group) => (
          <a key={group.topic.slug} href={`#${group.topic.slug}`}>
            {group.topic.title} <span>{group.articles.length}</span>
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section
          className="writing-index section-shell"
          id={group.topic.slug}
          key={group.topic.slug}
          aria-labelledby={`${group.topic.slug}-heading`}
        >
          <div className="container">
            <div className="writing-topic-heading">
              <div>
                <h2 id={`${group.topic.slug}-heading`}>{group.topic.title}</h2>
                <p>{group.topic.description}</p>
              </div>
              <Link className="section-link" href={`/writing/topic/${group.topic.slug}`}>
                Only {group.topic.title} <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
            <div className="writing-list">
              {group.articles.map((article) => (
                <article className="writing-card" key={article.slug}>
                  <div className="writing-card-meta">
                    <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished)}</time>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <div className="writing-card-body">
                    <h3><Link href={`/writing/${article.slug}`}>{article.title}</Link></h3>
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
      ))}
    </main>
  );
}
