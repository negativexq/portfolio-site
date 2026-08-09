import type { Metadata } from "next";
import { ProjectCard } from "@/components/content/project-card";
import { SectionHeading } from "@/components/content/section-heading";
import { flagshipProjects, supportingProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected AI/ML platform, RAG, data and distributed systems engineering projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main>
      <header className="page-hero container">
        <p className="eyebrow">Public engineering work</p>
        <h1>Projects</h1>
        <p>Evidence-led systems work across AI/ML platforms, retrieval, data infrastructure, distributed systems and agent tooling—with reliability, evaluation, observability and trade-offs made explicit.</p>
      </header>

      <section className="section-shell page-section" aria-labelledby="featured-projects">
        <div className="container">
          <SectionHeading
            id="featured-projects"
            eyebrow="Featured work"
            title="Flagship systems"
            description="Five current projects selected for depth, engineering evidence and relevance to platform work."
          />
          <div className="project-grid">
            {flagshipProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-tinted" aria-labelledby="supporting-projects">
        <div className="container">
          <SectionHeading
            id="supporting-projects"
            eyebrow="Supporting / evolution"
            title="Earlier foundations"
            description="Projects that show architectural iteration and how focused systems evolved into broader platforms."
          />
          <div className="supporting-grid">
            {supportingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
