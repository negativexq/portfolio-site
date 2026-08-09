export type ArchitectureNodeVariant =
  | "client"
  | "service"
  | "queue"
  | "storage"
  | "control"
  | "observability"
  | "boundary"
  | "analyzer"
  | "output";

export type ArchitectureEdgeVariant =
  | "primary"
  | "async"
  | "failure"
  | "control"
  | "observability";

export type ArchitectureNode = {
  id: string;
  label: string;
  subtitle?: string;
  variant: ArchitectureNodeVariant;
  items?: readonly string[];
};

export type ArchitectureStage = {
  id: string;
  nodes: readonly ArchitectureNode[];
  edge?: {
    label?: string;
    variant?: ArchitectureEdgeVariant;
  };
};

export type ArchitecturePath = {
  id: string;
  label: string;
  summary: string;
  variant: ArchitectureEdgeVariant;
  stages: readonly ArchitectureStage[];
};

export type ArchitectureDefinition = {
  projectId: string;
  description: string;
  paths: readonly ArchitecturePath[];
  notes: readonly string[];
};

const variantLabels: Record<ArchitectureNodeVariant, string> = {
  client: "Client",
  service: "Service",
  queue: "Messaging",
  storage: "Persistence",
  control: "Control",
  observability: "Observability",
  boundary: "Boundary",
  analyzer: "Analyzer",
  output: "Output",
};

type ArchitectureDiagramProps = {
  architecture: ArchitectureDefinition;
};

export function ArchitectureDiagram({ architecture }: ArchitectureDiagramProps) {
  const descriptionId = `architecture-${architecture.projectId}-description`;

  return (
    <figure className="architecture-visual" aria-describedby={descriptionId}>
      <figcaption className="sr-only" id={descriptionId}>
        {architecture.description}
      </figcaption>

      <div className="architecture-canvas">
        {architecture.paths.map((path, pathIndex) => (
          <section
            className="architecture-path"
            data-path-variant={path.variant}
            key={path.id}
            aria-labelledby={`architecture-${architecture.projectId}-${path.id}`}
          >
            <header className="architecture-path-header">
              <span aria-hidden="true">{String(pathIndex + 1).padStart(2, "0")}</span>
              <div>
                <h3 id={`architecture-${architecture.projectId}-${path.id}`}>{path.label}</h3>
                <p>{path.summary}</p>
              </div>
            </header>

            <ol className="architecture-path-flow" data-stage-count={path.stages.length}>
              {path.stages.map((stage, stageIndex) => (
                <li
                  className="architecture-stage"
                  data-edge-variant={stage.edge?.variant ?? path.variant}
                  key={stage.id}
                >
                  <div className="architecture-stage-nodes">
                    {stage.nodes.map((node) => (
                      <div className="architecture-node" data-node-variant={node.variant} key={node.id}>
                        <span className="architecture-node-type">{variantLabels[node.variant]}</span>
                        <strong>{node.label}</strong>
                        {node.subtitle ? <small>{node.subtitle}</small> : null}
                        {node.items ? (
                          <ul>
                            {node.items.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {stageIndex < path.stages.length - 1 ? (
                    <span className="architecture-connector" aria-label={stage.edge?.label || "then"}>
                      {stage.edge?.label ? (
                        <span className="architecture-connector-label">{stage.edge.label}</span>
                      ) : null}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {architecture.notes.length > 0 ? (
        <div className="architecture-notes" aria-label="Architecture notes">
          <p>Architecture notes</p>
          <ul>
            {architecture.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      ) : null}
    </figure>
  );
}
