import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/content/json-ld";
import { TagList } from "@/components/content/tag-list";
import { ArticleMarkdown } from "@/components/writing/article-markdown";
import { profile } from "@/data/profile";
import { getProjectById } from "@/data/projects";
import { personId } from "@/lib/seo/person";
import { getPublishedArticleBySlug, getPublishedArticles, getRelatedArticles } from "@/lib/writing/articles";
import { formatArticleDate } from "@/lib/writing/format";

type WritingPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) return {};
  const canonical = `/writing/${article.slug}`;
  const title = article.seoTitle ?? article.title;
  return {
    title,
    description: article.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description: article.description,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified ?? article.datePublished,
      tags: [...article.tags],
      authors: [profile.name],
      images: [{ url: "/opengraph-image", alt: `${article.title} by ${profile.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function WritingArticlePage({ params }: WritingPageProps) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${profile.links.website}/writing/${article.slug}`;
  const relatedProjects = article.relatedProjects
    .map((id) => getProjectById(id))
    .filter((project) => project !== undefined);
  const relatedWriting = getRelatedArticles(article);
  const modified = article.dateModified && article.dateModified !== article.datePublished;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Person",
      "@id": personId(profile),
      name: profile.name,
    },
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    keywords: article.tags,
  };

  return (
    <main>
      <JsonLd data={articleJsonLd} />
      <article>
        <header className="article-header container">
          <Link className="back-link" href="/writing">
            <ArrowLeft aria-hidden="true" size={14} /> Writing
          </Link>
          <h1>{article.title}</h1>
          <p className="article-standfirst">{article.description}</p>
          <div className="article-meta">
            <span>Published <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished)}</time></span>
            <span>{article.readingTime} min read</span>
            {modified ? <span>Updated <time dateTime={article.dateModified}>{formatArticleDate(article.dateModified!)}</time></span> : null}
          </div>
          <TagList items={article.tags} label={`${article.title} topics`} />
        </header>

        <div className="article-layout container">
          <div className="article-content">
            <ArticleMarkdown markdown={article.body} />

            {relatedProjects.length > 0 ? (
              <section className="article-related-section" aria-labelledby="related-project-heading">
                <p className="detail-kicker">Project evidence</p>
                <h2 id="related-project-heading">Related project</h2>
                <div className="related-projects">
                  {relatedProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <span>{project.category}</span>
                      <strong>{project.title}</strong>
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedWriting.length > 0 ? (
              <section className="article-related-section" aria-labelledby="related-writing-heading">
                <p className="detail-kicker">More on this topic</p>
                <h2 id="related-writing-heading">Related writing</h2>
                <div className="related-writing-list">
                  {relatedWriting.map((related) => (
                    <Link key={related.slug} href={`/writing/${related.slug}`}>
                      <span>{related.readingTime} min read</span>
                      <strong>{related.title}</strong>
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
