"use client";

import dynamic from "next/dynamic";
import type { EngineeringGraphData } from "@/lib/graph/types";

const EngineeringGraph = dynamic(() => import("./engineering-graph"), {
  ssr: false,
  loading: () => (
    <div className="graph-loading" role="status">
      <span />
      <p>Preparing the engineering graph…</p>
    </div>
  ),
});

export function EngineeringGraphLoader({ data }: { data: EngineeringGraphData }) {
  return <EngineeringGraph data={data} />;
}
