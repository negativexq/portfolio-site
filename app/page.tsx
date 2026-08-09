import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EngineeringAreaCard } from "@/components/content/engineering-area-card";
import { JsonLd } from "@/components/content/json-ld";
import { MetricGrid } from "@/components/content/metric-grid";
import { ProjectCard } from "@/components/content/project-card";
import { SectionHeading } from "@/components/content/section-heading";
import { StatusBadge } from "@/components/content/status-badge";
import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { learningItems } from "@/data/learning";
import { metrics } from "@/data/metrics";
import { profile } from "@/data/profile";
import { flagshipProjects } from "@/data/projects";

const currentDirectionIds = ["terraform", "langgraph", "graphrag"];

export default function Home() {
  const experience = experiences[0];
  const currentDirection = currentDirectionIds
    .map((id) => learningItems.find((item) => item.id === id))
    .filter((item) => item !== undefined);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.links.website}/#person`,
    name: profile.name,
    jobTitle: "MLOps & AI Platform Engineer",
    url: profile.links.website,
    sameAs: [profile.links.linkedin, profile.links.github],
  };

  return (
    <main>
      <JsonLd data={personJsonLd} />
      <section className="hero container" aria-labelledby="hero-title">
        <p className="hero-name">{profile.name}</p>
        <h1 id="hero-title">{profile.title}</h1>
        <p className="hero-copy">{profile.positioning}</p>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-actions" aria-label="Primary actions">
          <Link className="button button-primary" href="/projects">
            Explore projects <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <Link className="button button-secondary" href="/graph">
            Engineering graph
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
            description="Public engineering projects built around reliability, evaluation, observability and explicit trade-offs."
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

      <section className="section-shell section-tinted" aria-labelledby="direction-heading">
        <div className="container">
          <SectionHeading
            id="direction-heading"
            eyebrow="Current direction"
            title="Extending the platform boundary."
            description="Planned and learning items are intentionally distinct from current, evidence-backed work."
          />
          <div className="direction-grid" data-reveal>
            {currentDirection.map((item, index) => (
              <article key={item.id} data-hover-lift>
                <span className="direction-index">0{index + 1}</span>
                <div className="direction-heading-row">
                  <h3>{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p>{item.rationale}</p>
              </article>
            ))}
          </div>
          <Link className="section-link" href="/learning">
            Open learning roadmap <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="graph-cta section-shell" aria-labelledby="graph-cta-heading">
        <div className="container graph-cta-inner" data-reveal>
          <div>
            <p className="eyebrow">Engineering graph</p>
            <h2 id="graph-cta-heading">See how the work connects.</h2>
            <p>88 nodes and 102 relationships across five engineering domains—connecting experience, projects, technologies, concepts and current learning directions.</p>
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
