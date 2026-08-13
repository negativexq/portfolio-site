import type { Metadata } from "next";
import { JsonLd } from "@/components/content/json-ld";
import { ProjectCard } from "@/components/content/project-card";
import { SectionHeading } from "@/components/content/section-heading";
import { MotionController } from "@/components/motion/motion-controller";
import { flagshipProjects, projects, supportingProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected AI platform, agent systems, RAG, data and distributed systems engineering projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://omerfkoc.dev/projects#project-list",
    name: "Public engineering projects",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://omerfkoc.dev/projects/${project.slug}`,
      name: project.title,
    })),
  };

  return (
    <main>
      <MotionController />
      <JsonLd data={itemListJsonLd} />
      <header className="page-hero container">
        <p className="eyebrow">Public engineering work</p>
        <h1>Projects</h1>
        <p>Evidence-led systems work across AI platforms, agent systems, retrieval, data infrastructure and distributed systems—with reliability, evaluation, observability and trade-offs made explicit.</p>
      </header>

      <section className="section-shell page-section" aria-labelledby="featured-projects">
        <div className="container">
          <SectionHeading
            id="featured-projects"
            eyebrow="Featured work"
            title="Flagship systems"
            description="Four current projects selected for depth, engineering evidence and relevance to AI platform work."
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
            title="Supporting work"
            description="Focused tools and earlier foundations that show architectural iteration and how narrower systems evolved into broader platforms."
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
