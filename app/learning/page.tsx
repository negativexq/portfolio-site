import type { Metadata } from "next";
import { LearningCard } from "@/components/content/learning-card";
import { learningItems } from "@/data/learning";
import { getProjectById } from "@/data/projects";
import type { LearningArea } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Learning",
  description: "An evidence-oriented engineering growth roadmap across agent systems, retrieval, evaluation and AI platform infrastructure.",
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
    name: "Agent Systems",
    index: "01",
    description: "Orchestration, deterministic policy and durable confirmation are implemented and evaluated; memory governs what persists across steps and future interactions.",
    foundation: "Stateful LangGraph orchestration, deterministic policy and persistent memory",
    direction: "Measured memory relevance, retention and compaction at scale",
  },
  {
    name: "Retrieval & Evaluation",
    index: "02",
    description: "Retrieval finds evidence; context engineering selects and budgets it; GraphRAG adds relationships; evaluation measures whether each change helps.",
    foundation: "Hybrid retrieval, reranking and citation integrity",
    direction: "Context construction, GraphRAG and repeatable evaluation",
  },
  {
    name: "Platform Infrastructure",
    index: "03",
    description: "Infrastructure provisioning, workload orchestration and observability extend containerized AI systems along distinct operational boundaries.",
    foundation: "Containerized services and observable release workflows",
    direction: "Remote state, cloud infrastructure and workload orchestration",
  },
];

export default function LearningPage() {
  return (
    <main>
      <header className="page-hero container">
        <p className="eyebrow">Learning / building next</p>
        <h1>Extending the engineering boundary.</h1>
        <p>Active exploration and planned work expand existing AI Platform and MLOps foundations without being presented as demonstrated capability before the evidence exists.</p>
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
