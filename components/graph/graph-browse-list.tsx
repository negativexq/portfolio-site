import type { EngineeringGraphData, EngineeringGraphNode } from "@/lib/graph/types";
import { STATUS_LABELS } from "@/lib/graph/graph-styles";

type GraphBrowseListProps = {
  data: EngineeringGraphData;
  onSelect: (nodeId: string) => void;
};

function BrowseGroup({
  title,
  nodes,
  onSelect,
}: {
  title: string;
  nodes: readonly EngineeringGraphNode[];
  onSelect: (nodeId: string) => void;
}) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <button type="button" onClick={() => onSelect(node.id)}>
              <span>{node.label}</span>
              <small>{STATUS_LABELS[node.status]}</small>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GraphBrowseList({ data, onSelect }: GraphBrowseListProps) {
  return (
    <details className="graph-browse-list">
      <summary>Browse as an accessible list</summary>
      <div>
        <BrowseGroup title="Projects" nodes={data.nodes.filter((node) => node.type === "project")} onSelect={onSelect} />
        <BrowseGroup title="Experience" nodes={data.nodes.filter((node) => node.type === "experience")} onSelect={onSelect} />
        <BrowseGroup title="Domains" nodes={data.nodes.filter((node) => node.type === "domain")} onSelect={onSelect} />
        <BrowseGroup title="Learning" nodes={data.nodes.filter((node) => node.type === "learning")} onSelect={onSelect} />
        <BrowseGroup title="Roadmap" nodes={data.nodes.filter((node) => node.type === "roadmap")} onSelect={onSelect} />
      </div>
    </details>
  );
}
