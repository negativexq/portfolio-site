import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { ProjectIndex } from "@/components/recruiters/project-index";
import { JsonLd } from "@/components/content/json-ld";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { recruiterBrief } from "@/data/recruiter-brief";
import { buildWebPage } from "@/lib/seo/collection";

const STATEMENT =
  "I take AI from a promising prototype to a system people rely on, inside the environment where it actually has to run.";

const DESCRIPTION =
  "A one-page summary of Ömer Faruk Koç for hiring teams: what he can do, his skills, what each project is for, and recent experience.";

export const metadata: Metadata = {
  title: "For Recruiters",
  description: DESCRIPTION,
  alternates: { canonical: "/recruiters" },
};

// References are resolved at build time; a stale project id throws.
function resolveProjects() {
  return recruiterBrief.projects.map(({ id, purpose }) => {
    const project = projects.find((candidate) => candidate.id === id);
    if (!project) throw new Error(`recruiter brief: missing project ${id}`);
    return {
      title: project.title,
      category: project.category,
      href: `/projects/${project.slug}`,
      purpose,
      image: project.cardImage ? { src: project.cardImage.src, alt: project.cardImage.alt } : null,
    };
  });
}

export default function RecruitersPage() {
  const experience = experiences[0];
  const projectList = resolveProjects();
  const nameWords = profile.name.split(" ");
  const nameLines = [nameWords.slice(0, -1).join(" "), nameWords.at(-1) ?? ""];

  return (
    <main className="brief">
      <JsonLd data={buildWebPage(profile, { path: "/recruiters", name: `${profile.name} — For Recruiters`, description: DESCRIPTION })} />

      <header className="brief-hero container">
        <div className="brief-intro">
          <h1 className="brief-name" aria-label={profile.name}>
            {nameLines.map((line, index) => (
              <span className="brief-name-line" aria-hidden="true" key={line}>
                <span style={{ animationDelay: `${150 + index * 110}ms` }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="brief-title">{profile.title}</p>
          <p className="brief-lede">{profile.summary}</p>
        </div>
        <aside className="brief-card" aria-label="Contact and quick facts">
          <p className="brief-status"><span aria-hidden="true" />{profile.availability}</p>
          <dl>
            <div>
              <dt>Looking for</dt>
              <dd><ul className="brief-roles">{recruiterBrief.roles.map((role) => <li key={role}>{role}</li>)}</ul></dd>
            </div>
            <div><dt>Based in</dt><dd>{profile.location}, {profile.timezone}</dd></div>
            <div><dt>Last role</dt><dd>{experience.role}, {experience.company}</dd></div>
            <div><dt>Education</dt><dd>{profile.education.degree}, {profile.education.institution}</dd></div>
            <div><dt>Languages</dt><dd>{profile.languages.map((item) => `${item.language} (${item.proficiency.toLowerCase()})`).join(", ")}</dd></div>
          </dl>
          <div className="brief-card-actions">
            <a className="button button-primary" href={profile.links.email}>Email me</a>
            <a className="button button-secondary" href="/resume/omer-faruk-koc-resume.pdf" download>
              Résumé PDF <Download aria-hidden="true" size={15} />
            </a>
          </div>
        </aside>
      </header>

      <section className="brief-statement container" aria-label="In one sentence">
        <p>
          {STATEMENT.split(" ").map((word, index) => (
            <span key={index}>{word} </span>
          ))}
        </p>
      </section>

      <section className="brief-section container" aria-labelledby="brief-experience">
        <h2 id="brief-experience">Experience</h2>
        <div>
          <p className="brief-job">
            <strong>{experience.role}</strong>
            <span>{experience.company}, {experience.team}</span>
            <span>{experience.period}</span>
          </p>
          <ul className="brief-highlights">
            {recruiterBrief.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="brief-section container" aria-labelledby="brief-competencies">
        <h2 id="brief-competencies">What I do</h2>
        <ul className="brief-competencies">
          {recruiterBrief.competencies.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="brief-section container" aria-labelledby="brief-skills">
        <h2 id="brief-skills">Skills</h2>
        <dl className="brief-skills">
          {recruiterBrief.skills.map((group) => (
            <div key={group.area}>
              <dt>{group.area}</dt>
              <dd><ul className="tag-list">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="brief-section container" aria-labelledby="brief-projects">
        <h2 id="brief-projects">Projects and what they are for</h2>
        <ProjectIndex items={projectList} />
      </section>

      <section className="brief-cta container" aria-labelledby="brief-cta">
        <div>
          <h2 id="brief-cta">Hiring for one of these roles?</h2>
          <a className="brief-email" href={profile.links.email}>
            Send me an email
          </a>
          <div className="brief-cta-links">
            <a href={profile.links.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
            <a href={profile.links.github} rel="noreferrer" target="_blank">GitHub</a>
            <Link href="/projects">All projects</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
