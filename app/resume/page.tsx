import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { TagList } from "@/components/content/tag-list";
import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume overview for Ömer Faruk Koç, MLOps & AI Platform Engineer.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const experience = experiences[0];

  return (
    <main>
      <header className="page-hero container resume-hero">
        <p className="eyebrow">Resume overview</p>
        <h1>{profile.name}</h1>
        <p>{profile.title} — {profile.summary}</p>
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
      </header>

      <div className="container resume-layout">
        <div className="resume-main">
          <section className="resume-section">
            <p className="detail-kicker">Experience</p>
            <div className="resume-role-heading">
              <div><h2>{experience.role}</h2><p>{experience.company} · {experience.team}</p></div>
              <span>{experience.period}</span>
            </div>
            <p>{experience.summary}</p>
            <ul className="resume-impact-list">
              {experience.impacts.slice(0, 4).map((impact) => (
                <li key={impact.id}><strong>{impact.title}</strong><span>{impact.proof?.value ?? impact.summary}</span></li>
              ))}
            </ul>
            <Link className="section-link" href="/experience">Full experience <ArrowRight aria-hidden="true" size={14} /></Link>
          </section>

          <section className="resume-section">
            <p className="detail-kicker">Core domains</p>
            <h2 className="resume-section-title">Engineering areas</h2>
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
    </main>
  );
}
