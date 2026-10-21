import type { Metadata } from "next";
import { JsonLd } from "@/components/content/json-ld";
import { profile } from "@/data/profile";
import { buildWebPage } from "@/lib/seo/collection";
import { EngineeringGraphLoader } from "@/components/graph/engineering-graph-loader";
import { buildCuratedEngineeringGraph } from "@/lib/graph/curated-graph";

const GRAPH_DESCRIPTION =
  "An interactive map of seven core engineering projects, their shared foundations and scoped evidence.";

export const metadata: Metadata = {
  title: "Engineering Graph",
  description: GRAPH_DESCRIPTION,
  alternates: { canonical: "/graph" },
};

export default function GraphPage() {
  const graphData = buildCuratedEngineeringGraph();

  return (
    <main>
      <JsonLd data={buildWebPage(profile, { path: "/graph", name: "Engineering Graph", description: GRAPH_DESCRIPTION })} />
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
