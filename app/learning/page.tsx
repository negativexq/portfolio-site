import type { Metadata } from "next";
import { LearningCard } from "@/components/content/learning-card";
import { MachineReadableLink } from "@/components/content/machine-readable-link";
import { MotionController } from "@/components/motion/motion-controller";
import { learningAreas as areas } from "@/data/learning-areas";
import { learningItems } from "@/data/learning";
import { getProjectById } from "@/data/projects";
import { getPublishedArticles } from "@/lib/writing/articles";

export const metadata: Metadata = {
  title: "Learning",
  description: "An evidence-oriented engineering growth roadmap across agent systems, retrieval, evaluation and AI platform infrastructure.",
  alternates: { canonical: "/learning" },
};

export default function LearningPage() {
  const writing = getPublishedArticles();
  return (
    <main>
      <MotionController />
      <header className="page-hero container">
        <p className="eyebrow">Learning / building next</p>
        <h1>Extending the engineering boundary.</h1>
        <p>Active exploration and planned work expand existing AI Platform and MLOps foundations without being presented as demonstrated capability before the evidence exists.</p>
        <MachineReadableLink href="/learning.md" />
      </header>

      <div className="learning-sections">
        {areas.map((area) => {
          const items = learningItems.filter((item) => item.area === area.name);
          return (
            <section className="section-shell learning-area-section" key={area.name}>
              <div className="container learning-area-layout">
                <header>
                  <span className="learning-area-index">{area.index}</span>
                  <h2>{area.name}</h2>
                  <p>{area.description}</p>
                  <div className="learning-progression" aria-label={`${area.name} progression`}>
                    <div><span>Current foundation</span><strong>{area.foundation}</strong></div>
                    <div><span>Next direction</span><strong>{area.direction}</strong></div>
                    <div><span>Connected evidence</span><strong>{items.some((item) => item.connectedProjectIds.length > 0) ? "Public project relationships" : "Conceptual exploration"}</strong></div>
                  </div>
                </header>
                <div className="learning-card-list">
                  {items.map((item) => {
                    const projectLinks = item.connectedProjectIds
                      .map((id) => getProjectById(id))
                      .filter((project) => project !== undefined)
                      .map((project) => ({ slug: project.slug, title: project.title }));
                    const writingLinks = writing
                      .filter((article) => article.relatedLearning.includes(item.id))
                      .map((article) => ({ slug: article.slug, title: article.title }));
                    return <LearningCard key={item.id} item={item} projectLinks={projectLinks} writingLinks={writingLinks} />;
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
