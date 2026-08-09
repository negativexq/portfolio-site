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
  const groups = [
    { title: "Professional experience", nodes: data.nodes.filter((node) => node.type === "experience" || node.type === "capability") },
    { title: "Projects", nodes: data.nodes.filter((node) => node.type === "project") },
    { title: "Technologies", nodes: data.nodes.filter((node) => node.type === "technology") },
    { title: "Concepts & domains", nodes: data.nodes.filter((node) => node.type === "concept" || node.type === "domain") },
    { title: "Evidence", nodes: data.nodes.filter((node) => node.type === "evidence") },
    { title: "Learning & roadmap", nodes: data.nodes.filter((node) => node.type === "learning" || node.type === "roadmap") },
  ];

  return (
    <details className="graph-browse-list">
      <summary>Browse as an accessible list</summary>
      <div>
        {groups.map((group) => (
          <BrowseGroup key={group.title} title={group.title} nodes={group.nodes} onSelect={onSelect} />
        ))}
      </div>
    </details>
  );
}
