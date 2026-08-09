import type { Metadata } from "next";
import { LearningCard } from "@/components/content/learning-card";
import { learningItems } from "@/data/learning";
import { getProjectById } from "@/data/projects";
import type { LearningArea } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Learning",
  description: "Planned and active learning directions across infrastructure, agent systems and graph systems.",
  alternates: { canonical: "/learning" },
};

const areas: readonly {
  name: LearningArea;
  index: string;
  description: string;
  foundation: string;
  direction: string;
}[] = [
  {
    name: "Infrastructure",
    index: "01",
    description: "Reproducible infrastructure, Kubernetes deployment architecture and cloud platform evolution.",
    foundation: "Docker Compose reference systems",
    direction: "Terraform and reproducible cloud infrastructure",
  },
  {
    name: "Agent Systems",
    index: "02",
    description: "Stateful workflows, durable memory, tool reliability, recovery and evaluation.",
    foundation: "MCP and source-grounded context engineering",
    direction: "LangGraph workflows and durable agent memory",
  },
  {
    name: "Graph Systems",
    index: "03",
    description: "Graph-native modeling and relationship-aware retrieval for knowledge and agent systems.",
    foundation: "Lineage, dependency graphs and hybrid retrieval",
    direction: "Neo4j modeling and GraphRAG exploration",
  },
];

export default function LearningPage() {
  return (
    <main>
      <header className="page-hero container">
        <p className="eyebrow">Learning / building next</p>
        <h1>Engineering direction, clearly labeled.</h1>
        <p>Active learning and planned work are visible here without being presented as verified production experience.</p>
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
                    return <LearningCard key={item.id} item={item} projectLinks={projectLinks} />;
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
