import type { Metadata } from "next";
import { EngineeringGraphLoader } from "@/components/graph/engineering-graph-loader";
import { buildCuratedEngineeringGraph } from "@/lib/graph/curated-graph";

export const metadata: Metadata = {
  title: "Engineering Graph",
  description:
    "An interactive map of seven core engineering projects, their shared foundations and scoped evidence.",
  alternates: { canonical: "/graph" },
};

export default function GraphPage() {
  const graphData = buildCuratedEngineeringGraph();

  return (
    <main>
      <header className="page-hero container graph-page-hero">

        <h1>Seven systems. Shared foundations.</h1>
        <p>
          Explore my core engineering projects and the foundations they share. Select a system to reveal its key technologies, engineering decisions and scoped evidence.
        </p>
      </header>

      <section className="graph-interactive-section" aria-labelledby="interactive-graph-heading">
        <div className="container">
          <h2 id="interactive-graph-heading" className="sr-only">Explore the engineering graph</h2>
          <EngineeringGraphLoader data={graphData} />
        </div>
      </section>
    </main>
  );
}
