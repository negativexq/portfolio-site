import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EngineeringAreaCard } from "@/components/content/engineering-area-card";
import { HeroPipeline } from "@/components/content/hero-pipeline";
import { MetricGrid } from "@/components/content/metric-grid";
import { PersonJsonLd } from "@/components/content/person-jsonld";
import { ProjectCard } from "@/components/content/project-card";
import { SectionHeading } from "@/components/content/section-heading";
import { TagList } from "@/components/content/tag-list";
import { MotionController } from "@/components/motion/motion-controller";
import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { metrics } from "@/data/metrics";
import { profile } from "@/data/profile";
import { flagshipProjects } from "@/data/projects";
import { buildEngineeringGraph } from "@/lib/graph/build-graph";
import { getPublishedArticles } from "@/lib/writing/articles";
import { formatArticleDate } from "@/lib/writing/format";

const selectedWritingSlugs = [
  "hard-gates-frozen-hashes",
  "production-agent-guardrails",
  "63-rescues-0-drops",
] as const;

export default function Home() {
  const experience = experiences[0];
  const graphData = buildEngineeringGraph();
  const publishedArticles = getPublishedArticles();
  const selectedWriting = selectedWritingSlugs.flatMap((slug) => {
    const article = publishedArticles.find((candidate) => candidate.slug === slug);
    return article ? [article] : [];
  });

  return (
    <main>
      <MotionController />
      <PersonJsonLd />
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-main">
          <p className="hero-name">{profile.name}</p>
          <h1 id="hero-title">{profile.title}</h1>
          <p className="hero-copy">{profile.positioning}</p>
          <p className="hero-summary">{profile.summary}</p>
          <div className="hero-actions" aria-label="Primary actions">
            <Link className="button button-primary" href="/projects">
              Explore projects <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="button button-secondary" href="/platform">
              AI Platform Architecture
            </Link>
            <a
              className="text-link"
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
          <p className="hero-meta">
            {profile.location} · Open to remote opportunities · MLOps · AI Platform · GenAI
          </p>
        </div>
        <HeroPipeline />
      </section>

      <section className="section-shell metric-section" aria-labelledby="proof-heading">
        <div className="container">
          <SectionHeading id="proof-heading" eyebrow="Career highlights" title="At a glance." />
          <MetricGrid metrics={metrics} />
        </div>
      </section>

      <section className="section-shell" aria-labelledby="selected-work-heading">
        <div className="container">
          <SectionHeading
            id="selected-work-heading"
            eyebrow="Selected work"
            title="Systems, not demos."
            description="Public engineering projects built around control boundaries, reliability, evaluation, observability and explicit trade-offs."
            action={
              <Link className="section-link" href="/projects">
                All projects <ArrowRight aria-hidden="true" size={15} />
              </Link>
            }
          />
          <div className="project-grid">
            {flagshipProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-tinted" aria-labelledby="areas-heading">
        <div className="container">
          <SectionHeading
            id="areas-heading"
            eyebrow="Engineering areas"
            title="Platform work across five connected domains."
            description="Capabilities are grouped by engineering evidence—not percentages or keyword counts."
          />
          <div className="area-list">
            {engineeringAreas.map((area, index) => (
              <EngineeringAreaCard key={area.id} area={area} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell" aria-labelledby="experience-heading">
        <div className="container experience-preview">
          <SectionHeading id="experience-heading" eyebrow="Professional experience" title="Production systems at scale." />
          <div className="experience-preview-body">
            <div>
              <p className="role-company">{experience.company} · {experience.team}</p>
              <h3>{experience.role}</h3>
              <p>{experience.summary}</p>
            </div>
            <dl>
              <div><dt>Period</dt><dd>{experience.period}</dd></div>
              <div><dt>Location</dt><dd>{experience.location}</dd></div>
            </dl>
          </div>
          <p className="separation-note">
            Professional experience informs the engineering questions explored in public projects; the public repositories are independent work.
          </p>
          <Link className="section-link" href="/experience">
            Explore experience <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="section-shell section-tinted" aria-labelledby="writing-heading">
        <div className="container">
          <SectionHeading
            id="writing-heading"
            eyebrow="Engineering writing"
            title="Notes from building the systems."
            description="Short technical pieces on reliability, evaluation, retrieval, distributed systems and production AI."
          />
          <div className="writing-list" data-reveal>
            {selectedWriting.map((article) => (
              <article className="writing-card" key={article.slug}>
                <div className="writing-card-meta">
                  <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished)}</time>
                  <span>{article.category}</span>
                </div>
                <div className="writing-card-body">
                  <h3><Link href={`/writing/${article.slug}`}>{article.title}</Link></h3>
                  <p>{article.description}</p>
                  <TagList items={article.tags} limit={3} label={`${article.title} topics`} />
                </div>
                <Link className="writing-card-link" href={`/writing/${article.slug}`} aria-label={`Read ${article.title}`}>
                  Read <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </article>
            ))}
          </div>
          <Link className="section-link" href="/writing">
            Explore writing <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="graph-cta section-shell" aria-labelledby="graph-cta-heading">
        <div className="container graph-cta-inner" data-reveal>
          <div>
            <p className="eyebrow">Engineering graph</p>
            <h2 id="graph-cta-heading">See how the work connects.</h2>
            <p>{graphData.nodes.length} source-grounded nodes and {graphData.edges.length} validated relationships across experience, projects, technologies, concepts, evidence and current learning directions.</p>
          </div>
          <Link className="button button-primary" href="/graph">
            Explore Engineering Graph <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section className="contact-section section-shell" aria-labelledby="contact-heading">
        <div className="container contact-inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-heading">Have an interesting platform, data or AI infrastructure problem?</h2>
            <p className="contact-context">Open to remote opportunities · {profile.timezone}</p>
            <p className="contact-availability">{profile.availability}</p>
          </div>
          <div className="contact-links">
            <a className="button button-primary" href={profile.links.email}>Email</a>
            <a className="button button-secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="button button-secondary" href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
