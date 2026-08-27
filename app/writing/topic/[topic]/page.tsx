import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { TagList } from "@/components/content/tag-list";
import { formatArticleDate } from "@/lib/writing/format";
import { getWritingTopicGroup, getWritingTopicGroups } from "@/lib/writing/topics";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWritingTopicGroups().map((group) => ({ topic: group.topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const group = getWritingTopicGroup(topic);
  if (!group) return {};

  return {
    title: `${group.topic.title} — Writing`,
    description: group.topic.description,
    alternates: { canonical: `/writing/topic/${group.topic.slug}` },
  };
}

export default async function WritingTopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const group = getWritingTopicGroup(topic);

  if (!group) notFound();

  return (
    <main>
      <header className="page-hero writing-hero container">
        <Link className="back-link" href="/writing">
          <ArrowLeft aria-hidden="true" size={14} /> All writing
        </Link>
        <p className="eyebrow">Writing topic</p>
        <h1>{group.topic.title}</h1>
        <p>{group.topic.description}</p>
      </header>

      <section className="writing-index section-shell" aria-labelledby="topic-writing-heading">
        <div className="container">
          <h2 className="sr-only" id="topic-writing-heading">{group.topic.title} writing</h2>
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
    </main>
  );
}
