import type { Metadata } from "next";
import { EngineeringGraphLoader } from "@/components/graph/engineering-graph-loader";
import { buildEngineeringGraph } from "@/lib/graph/build-graph";

export const metadata: Metadata = {
  title: "Engineering Graph",
  description:
    "An interactive map of the systems, technologies, engineering concepts and learning directions behind Ömer Faruk Koç's work.",
  alternates: { canonical: "/graph" },
};

export default function GraphPage() {
  const graphData = buildEngineeringGraph();

  return (
    <main>
      <header className="page-hero container graph-page-hero">
        <p className="eyebrow">Engineering graph</p>
        <h1>Systems connected by evidence.</h1>
        <p>
          An interactive map of the systems, technologies, engineering concepts and learning directions behind my work. Explore how professional experience, public projects and current learning paths connect.
        </p>
      </header>

      <section className="graph-interactive-section" aria-labelledby="interactive-graph-heading">
        <div className="container">
          <header className="graph-section-heading">
            <div>
              <p className="eyebrow">Interactive map</p>
              <h2 id="interactive-graph-heading">Explore the engineering system.</h2>
            </div>
            <div>
              <p>Search, filter or select a node to inspect sourced relationships. Learning and roadmap directions remain explicitly labeled.</p>
              <p className="graph-model-stats">{graphData.nodes.length} curated nodes · {graphData.edges.length} sourced relationships</p>
            </div>
          </header>
          <EngineeringGraphLoader data={graphData} />
        </div>
      </section>
    </main>
  );
}
