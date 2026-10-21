"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatArticleDate } from "@/lib/writing/format";
import type { WritingArticleSummary, WritingTopic } from "@/lib/writing/types";

type TopicGroup = {
  topic: WritingTopic;
  articles: readonly WritingArticleSummary[];
};

type WritingExplorerProps = {
  groups: readonly TopicGroup[];
};

function normalize(value: string) {
  return value.toLocaleLowerCase("en").normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

function searchableText(article: WritingArticleSummary) {
  return normalize([article.title, article.description, article.category ?? "", ...article.tags].join(" "));
}

/**
 * The writing index as one tool: free-text search over titles, descriptions,
 * topics and tags, a single topic filter, and tags that filter on click.
 *
 * With no query and no topic it renders the curated topic sections exactly as
 * the server does, so the page works without script and the default view
 * keeps its editorial grouping. Any filter switches to one flat list, newest
 * first, with a live result count. The state lives in the URL (?q=&topic=) so
 * a filtered view can be shared or restored with back/forward.
 */
export function WritingExplorer({ groups }: WritingExplorerProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  // URL writes wait until the URL has been read, or the first sync would
  // strip a shared ?q=&topic= before it is restored.
  const [restored, setRestored] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allArticles = useMemo(
    () =>
      [...groups.flatMap((group) => group.articles)].sort((a, b) =>
        b.datePublished.localeCompare(a.datePublished),
      ),
    [groups],
  );
  const index = useMemo(
    () => new Map(allArticles.map((article) => [article.slug, searchableText(article)])),
    [allArticles],
  );
  const topicTitle = groups.find((group) => group.topic.slug === topic)?.topic.title;

  // Restore a shared or back-navigated filter once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTopic = params.get("topic");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
    setQuery(params.get("q") ?? "");
    setTopic(groups.some((group) => group.topic.slug === initialTopic) ? initialTopic : null);
    setRestored(true);
  }, [groups]);

  useEffect(() => {
    if (!restored) return;
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (topic) params.set("topic", topic);
    else params.delete("topic");
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, "", next);
    }
  }, [query, topic, restored]);

  // "/" jumps to the search field from anywhere on the page, as on most docs sites.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const terms = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);
  const filtering = terms.length > 0 || topic !== null;
  const results = useMemo(
    () =>
      allArticles.filter((article) => {
        if (topic && article.category !== topicTitle) return false;
        const text = index.get(article.slug) ?? "";
        return terms.every((term) => text.includes(term));
      }),
    [allArticles, index, terms, topic, topicTitle],
  );

  const clear = useCallback(() => {
    setQuery("");
    setTopic(null);
    inputRef.current?.focus();
  }, []);

  const filterByTag = useCallback((tag: string) => {
    setQuery(tag);
    setTopic(null);
    inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, []);

  const statusText = filtering
    ? `${results.length} ${results.length === 1 ? "article" : "articles"}${topicTitle ? ` in ${topicTitle}` : ""}${terms.length ? ` matching “${query.trim()}”` : ""}`
    : `${allArticles.length} articles across ${groups.length} topics`;

  return (
    <>
      <div className="writing-toolbar">
        <div className="container writing-toolbar-inner">
          <div className="writing-search">
            <Search aria-hidden="true" size={16} />
            <label className="sr-only" htmlFor="writing-search-input">
              Search writing
            </label>
            <input
              ref={inputRef}
              id="writing-search-input"
              type="search"
              value={query}
              placeholder="Search titles, topics and tags"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && query) {
                  event.preventDefault();
                  setQuery("");
                }
              }}
            />
            {query ? (
              <button type="button" className="writing-search-clear" onClick={() => setQuery("")}>
                <X aria-hidden="true" size={15} />
                <span className="sr-only">Clear search</span>
              </button>
            ) : (
              <kbd aria-hidden="true">/</kbd>
            )}
          </div>

          <div className="writing-topic-filter" role="group" aria-label="Filter by topic">
            <button type="button" aria-pressed={topic === null} onClick={() => setTopic(null)}>
              All <span>{allArticles.length}</span>
            </button>
            {groups.map((group) => (
              <button
                type="button"
                key={group.topic.slug}
                aria-pressed={topic === group.topic.slug}
                onClick={() => setTopic(topic === group.topic.slug ? null : group.topic.slug)}
              >
                {group.topic.title} <span>{group.articles.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container writing-status-row">
        <p className="writing-status" role="status" aria-live="polite">
          {statusText}
        </p>
        {filtering ? (
          <button type="button" className="writing-reset" onClick={clear}>
            Clear filters
          </button>
        ) : null}
      </div>

      {!filtering ? (
        groups.map((group) => (
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
                  <WritingCard key={article.slug} article={article} onTag={filterByTag} />
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <section className="writing-index writing-results section-shell" aria-labelledby="writing-results-heading">
          <div className="container">
            <h2 className="sr-only" id="writing-results-heading">
              Search results
            </h2>
            {results.length ? (
              <div className="writing-list">
                {results.map((article) => (
                  <WritingCard key={article.slug} article={article} showTopic={!topic} onTag={filterByTag} activeTerms={terms} />
                ))}
              </div>
            ) : (
              <div className="writing-empty">
                <p>No article matches that yet.</p>
                <p>Try a broader word, another topic, or one of these:</p>
                <div className="writing-empty-suggestions">
                  {["RAG", "Kafka", "AI Agents", "Evaluation", "Reliability"].map((tag) => (
                    <button type="button" key={tag} onClick={() => filterByTag(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
                <button type="button" className="writing-reset" onClick={clear}>
                  Show all articles
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function WritingCard({
  article,
  showTopic = false,
  onTag,
  activeTerms = [],
}: {
  article: WritingArticleSummary;
  showTopic?: boolean;
  onTag: (tag: string) => void;
  activeTerms?: readonly string[];
}) {
  return (
    <article className="writing-card">
      <div className="writing-card-meta">
        <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished)}</time>
        <span>{article.readingTime} min read</span>
        {showTopic && article.category ? <span className="writing-card-topic">{article.category}</span> : null}
      </div>
      <div className="writing-card-body">
        <h3>
          <Link href={`/writing/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.description}</p>
        <ul className="tag-list writing-tag-list" aria-label={`${article.title} topics`}>
          {article.tags.map((tag) => {
            const active = activeTerms.length > 0 && activeTerms.every((term) => normalize(tag).includes(term));
            return (
              <li key={tag}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTag(tag)}
                  title={`Show articles tagged ${tag}`}
                >
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <Link className="writing-card-link" href={`/writing/${article.slug}`} aria-label={`Read ${article.title}`}>
        Read <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </article>
  );
}
