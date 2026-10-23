import type { Metadata } from "next";
import { JsonLd } from "@/components/content/json-ld";
import { buildWebPage } from "@/lib/seo/collection";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { MachineReadableLink } from "@/components/content/machine-readable-link";
import { TagList } from "@/components/content/tag-list";
import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const RESUME_DESCRIPTION =
  "Resume of Ömer Faruk Koç, AI Platform & MLOps Engineer: ML platforms, agent systems, agentic RAG and Kubernetes incident analysis, with measured results.";

// Same projects, same order as "Selected Engineering Projects" in the PDF.
const SELECTED_PROJECT_IDS = [
  "ml-platform-infrastructure",
  "agentic-sre",
  "agentic-customer-service-platform",
  "knowledge-base-rag",
] as const;

export const metadata: Metadata = {
  title: "Resume",
  description: RESUME_DESCRIPTION,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const experience = experiences[0];
  const featuredImpacts = experience.impacts.filter((impact) => impact.proof).slice(0, 4);
  const selectedProjects = SELECTED_PROJECT_IDS.map((id) => {
    const project = projects.find((candidate) => candidate.id === id);
    if (!project) throw new Error(`resume: missing project ${id}`);
    return project;
  });

  return (
    <main>
      <JsonLd data={buildWebPage(profile, { path: "/resume", name: `${profile.name} — Resume`, description: RESUME_DESCRIPTION })} />
      <header className="page-hero container resume-hero">
        <h1>{profile.name}</h1>
        <p className="resume-hero-role">{profile.title}</p>
        <p className="resume-hero-summary">{profile.summary}</p>
        <div className="hero-actions">
          <a
            className="button button-primary"
            href="/resume/omer-faruk-koc-resume.pdf"
            download="omer-faruk-koc-resume.pdf"
          >
            Download Résumé <Download aria-hidden="true" size={14} />
          </a>
          <a className="button button-secondary" href={profile.links.email}>Email</a>
          <a className="button button-secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </div>
        <MachineReadableLink href="/resume.md" />
      </header>

      <div className="container resume-layout">
        <div className="resume-main">
          <section className="resume-section">
            <p className="detail-kicker">Experience</p>
            <div className="resume-role-heading">
              <div><h2>{experience.role}</h2><p>{experience.company}, {experience.team}</p></div>
              <span>{experience.period}</span>
            </div>
            <p>{experience.summary}</p>
            <ul className="resume-impact-list">
              {featuredImpacts.map((impact) => (
                <li key={impact.id}><strong>{impact.title}</strong><span>{impact.proof?.value}</span></li>
              ))}
            </ul>
            <Link className="section-link" href="/experience">Full experience <ArrowRight aria-hidden="true" size={14} /></Link>
          </section>

          <section className="resume-section">
            <p className="detail-kicker">Selected projects</p>
            <ol className="resume-project-list">
              {selectedProjects.map((project) => (
                <li key={project.id}>
                  <div className="resume-project-heading">
                    <h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                    <span>{project.category}</span>
                  </div>
                  <p>{project.summary}</p>
                  {project.cardProof ? (
                    <p className="resume-project-proof">
                      <strong>{project.cardProof.value}</strong> {project.cardProof.label}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
            <Link className="section-link" href="/projects">All projects <ArrowRight aria-hidden="true" size={14} /></Link>
          </section>

        </div>

        <aside className="resume-sidebar">
          <section>
            <p className="detail-kicker">Education</p>
            <h2>{profile.education.institution}</h2>
            <p>{profile.education.degree}</p>
          </section>
          <section>
            <p className="detail-kicker">Languages</p>
            <dl>
              {profile.languages.map((item) => (
                <div key={item.language}><dt>{item.language}</dt><dd>{item.proficiency}</dd></div>
              ))}
            </dl>
          </section>
          <section>
            <p className="detail-kicker">Contact</p>
            <a href={profile.links.email}>omerfkoc98@gmail.com</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profile.links.website}>omerfkoc.dev</a>
          </section>
        </aside>
      </div>

      <section className="container resume-areas" aria-labelledby="resume-areas-heading">
        <h2 className="resume-section-title" id="resume-areas-heading">Engineering areas</h2>
        <div className="resume-area-list">
          {engineeringAreas.map((area) => (
            <article key={area.id}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <TagList items={area.technologies} limit={4} label={`${area.title} representative technologies`} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
