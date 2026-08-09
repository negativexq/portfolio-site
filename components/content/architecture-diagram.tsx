import type { CSSProperties } from "react";

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
  relationLabel?: string;
  variant: ArchitectureNodeVariant;
  items?: readonly string[];
};

export type ArchitectureStage = {
  id: string;
  nodes: readonly ArchitectureNode[];
  edge?: {
    label?: string;
    variant?: ArchitectureEdgeVariant;
    relation?: "linear" | "branch" | "merge";
  };
};

export type ArchitecturePath = {
  id: string;
  label: string;
  summary: string;
  variant: ArchitectureEdgeVariant;
  stages: readonly ArchitectureStage[];
  layout?: {
    type: "rows";
    rows: readonly number[];
  };
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

function getPathRows(path: ArchitecturePath) {
  if (!path.layout) return [path.stages];

  let stageIndex = 0;
  const rows = path.layout.rows.map((rowSize) => {
    const row = path.stages.slice(stageIndex, stageIndex + rowSize);
    stageIndex += rowSize;
    return row;
  });

  return stageIndex === path.stages.length ? rows : [path.stages];
}

function describeRelationships(path: ArchitecturePath) {
  return path.stages.slice(0, -1).flatMap((stage, index) => {
    const source = stage.nodes.map((node) => node.label).join(" and ");
    const targets = path.stages[index + 1].nodes;

    if (stage.edge?.relation === "branch" && targets.some((node) => node.relationLabel)) {
      return targets.map((node) => (
        `${source} ${node.relationLabel || stage.edge?.label || "connects to"} ${node.label}.`
      ));
    }

    const target = targets.map((node) => node.label).join(" and ");
    return `${source} ${stage.edge?.label || "then connects to"} ${target}.`;
  }).join(" ");
}

export function ArchitectureDiagram({ architecture }: ArchitectureDiagramProps) {
  const descriptionId = `architecture-${architecture.projectId}-description`;

  return (
    <figure className="architecture-visual" aria-describedby={descriptionId}>
      <figcaption className="sr-only" id={descriptionId}>
        {architecture.description}
      </figcaption>

      <div className="architecture-canvas">
        {architecture.paths.map((path, pathIndex) => {
          const rows = getPathRows(path);
          const flowColumns = Math.max(...rows.map((row) => row.length));
          let pathStageIndex = 0;

          return (
            <section
              className="architecture-path"
              data-path-variant={path.variant}
              data-layout={path.layout?.type ?? "linear"}
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

              <div
                className="architecture-flow-layout"
                data-flow-columns={flowColumns}
                style={{ "--architecture-flow-columns": flowColumns } as CSSProperties}
              >
                <p className="sr-only">{describeRelationships(path)}</p>
                {rows.map((row, rowIndex) => {
                  const rowStartIndex = pathStageIndex;
                  pathStageIndex += row.length;
                  const rowDirection = rowIndex % 2 === 0 ? "forward" : "reverse";
                  const nextRow = rows[rowIndex + 1];
                  const finalStage = row[row.length - 1];

                  return (
                    <div className="architecture-flow-row-group" key={`${path.id}-row-${rowIndex}`}>
                      <ol
                        className="architecture-path-flow"
                        data-row-direction={rowDirection}
                        data-row-stage-count={row.length}
                      >
                        {row.map((stage, rowStageIndex) => {
                          const stageIndex = rowStartIndex + rowStageIndex;
                          const incomingRelation = stageIndex > 0
                            ? path.stages[stageIndex - 1].edge?.relation ?? "linear"
                            : "linear";
                          const incomingVariant = stageIndex > 0
                            ? path.stages[stageIndex - 1].edge?.variant ?? path.variant
                            : path.variant;
                          const outgoingRelation = stage.edge?.relation ?? "linear";
                          const hasInlineConnector = rowStageIndex < row.length - 1;

                          return (
                            <li
                              className="architecture-stage"
                              data-edge-relation={outgoingRelation}
                              data-edge-variant={stage.edge?.variant ?? path.variant}
                              key={stage.id}
                            >
                              <div
                                className="architecture-stage-nodes"
                                data-incoming-relation={incomingRelation}
                                data-incoming-variant={incomingVariant}
                                data-outgoing-relation={outgoingRelation}
                                data-outgoing-variant={stage.edge?.variant ?? path.variant}
                              >
                                {stage.nodes.map((node) => (
                                  <div className="architecture-node" data-node-variant={node.variant} key={node.id}>
                                    {incomingRelation === "branch" ? (
                                      <span className="architecture-node-branch architecture-node-branch-in" aria-hidden="true">
                                        {node.relationLabel ? (
                                          <span className="architecture-node-branch-label">{node.relationLabel}</span>
                                        ) : null}
                                      </span>
                                    ) : null}
                                    {outgoingRelation === "merge" ? (
                                      <span className="architecture-node-branch architecture-node-branch-out" aria-hidden="true" />
                                    ) : null}
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

                              {hasInlineConnector ? (
                                <span className="architecture-connector" aria-hidden="true">
                                  {stage.edge?.label ? (
                                    <span className="architecture-connector-label">{stage.edge.label}</span>
                                  ) : null}
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ol>

                      {nextRow ? (
                        <span
                          className="architecture-row-connector"
                          data-edge-variant={finalStage.edge?.variant ?? path.variant}
                          data-side={rowDirection === "forward" ? "end" : "start"}
                          aria-hidden="true"
                        >
                          {finalStage.edge?.label ? (
                            <span className="architecture-connector-label">{finalStage.edge.label}</span>
                          ) : null}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
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
