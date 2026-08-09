import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { learningItems } from "@/data/learning";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import type {
  EngineeringGraphData,
  EngineeringGraphEdge,
  EngineeringGraphNode,
  GraphEdgeType,
  GraphNodeType,
} from "./types";

type ConceptSelection =
  | string
  | {
      label: string;
      sources: readonly string[];
      description: string;
    };

type ProjectGraphSelection = {
  technologies: readonly string[];
  concepts: readonly ConceptSelection[];
};

const projectSelections: Record<string, ProjectGraphSelection> = {
  "real-time-commerce-platform": {
    technologies: ["Kafka", "Redis", "PostgreSQL", "Prometheus", "Grafana", "Docker Compose"],
    concepts: [
      "Event-Driven Architecture",
      "At-Least-Once Delivery",
      "Idempotent Consumer",
      "Transactional Outbox",
      {
        label: "Retry & DLQ",
        sources: ["Bounded Retry", "Dead Letter Queue"],
        description: "Bounded failure handling through explicit retry limits and dead-letter routing.",
      },
      "Observability",
      "Performance Engineering",
    ],
  },
  "knowledge-base-rag": {
    technologies: ["Qdrant", "Ollama", "OpenTelemetry", "Jaeger", "DeepEval", "Streamlit"],
    concepts: [
      "Incremental Sync",
      "Hybrid Retrieval",
      "RRF Fusion",
      "Cross-Encoder Reranking",
      "Citation Integrity",
      "Index Reconciliation",
      "Evaluation",
      "Distributed Tracing",
    ],
  },
  "production-rag-platform": {
    technologies: ["Qdrant", "Ollama", "OpenTelemetry"],
    concepts: ["Hybrid Retrieval", "Cross-Encoder Reranking", "Citations", "Evaluation", "Observability"],
  },
  "modelops-control-plane": {
    technologies: ["FastAPI", "Locust"],
    concepts: [
      "Canary Deployment",
      "Weighted Routing",
      "Policy Engine",
      {
        label: "Automated Promotion / Rollback",
        sources: ["Automated Promotion", "Automated Rollback"],
        description: "Policy-driven progression or reversal of a model release.",
      },
      "Fault Injection",
      "Benchmarking",
    ],
  },
  "repo-context-forge": {
    technologies: ["MCP", "FastMCP", "Python AST", "Docker"],
    concepts: [
      "Repository Intelligence",
      "Source-Grounded Context",
      "Symbol Analysis",
      "Dependency Analysis",
      {
        label: "Git Intelligence",
        sources: ["Read-Only Git Intelligence"],
        description: "Read-only, source-grounded repository history and change context.",
      },
      "Context Packs",
      "Tool Security Boundaries",
    ],
  },
  "dbt-feature-lineage": {
    technologies: ["dbt Core", "sqlglot", "NetworkX", "Streamlit", "Docker"],
    concepts: ["Model DAG", "Column-Level Lineage", "Downstream Impact", "Static SQL Analysis"],
  },
};

const projectAnchors: Record<string, { x: number; y: number }> = {
  "real-time-commerce-platform": { x: -5.2, y: -3.5 },
  "knowledge-base-rag": { x: 4.5, y: -3.4 },
  "production-rag-platform": { x: 7.3, y: -5.1 },
  "modelops-control-plane": { x: 0.2, y: -6.7 },
  "repo-context-forge": { x: 5.3, y: 1.4 },
  "dbt-feature-lineage": { x: -5.3, y: 1.4 },
};

const domainAnchors: Record<string, { x: number; y: number }> = {
  "ai-ml-platform": { x: -1.8, y: 5.2 },
  "generative-ai-rag": { x: 6.2, y: -2.1 },
  "distributed-systems": { x: -6.6, y: -2.1 },
  "data-engineering": { x: -7, y: 2.7 },
  "agent-infrastructure": { x: 7, y: 2.7 },
};

const explicitPositions: Record<string, { x: number; y: number }> = {
  "person:omer-faruk-koc": { x: 0, y: 0 },
  "experience:fibabanka": { x: 0, y: 7.5 },
  "technology:kafka": { x: -7.4, y: -4.4 },
  "technology:qdrant": { x: 6.1, y: -3.5 },
  "technology:mcp": { x: 7, y: 1.3 },
  "technology:dbt-core": { x: -6.8, y: 1.3 },
  "concept:hybrid-retrieval": { x: 5.1, y: -5.2 },
  "concept:context-engineering": { x: 7.4, y: 3.4 },
  "learning:langgraph": { x: 8.5, y: 4.7 },
  "learning:agent-memory": { x: 10, y: 6.1 },
  "learning:neo4j": { x: -8, y: 4.4 },
  "learning:graphrag": { x: -6.3, y: 6 },
  "roadmap:real-time-commerce-platform:terraform": { x: -7.2, y: -6.3 },
  "roadmap:real-time-commerce-platform:kubernetes": { x: -8.6, y: -7.5 },
  "roadmap:real-time-commerce-platform:cloud-infrastructure": { x: -7.2, y: -8.7 },
};

const secondaryAnchors = new Set([
  "Kafka",
  "Qdrant",
  "MCP",
  "dbt Core",
  "Hybrid Retrieval",
  "Context Engineering",
  "ML lifecycle",
]);

const strategicProjectMetrics = new Set([
  "real-time-commerce-platform",
  "knowledge-base-rag",
  "modelops-control-plane",
]);

function slug(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

const canvasLabels: Readonly<Record<string, string>> = {
  "experience:fibabanka": "Fibabanka",
  "domain:agent-infrastructure": "Agent Infrastructure",
  "project:real-time-commerce-platform": "Real-Time Commerce",
  "project:production-rag-platform": "Production RAG",
};

function canvasLabel(id: string, label: string) {
  return canvasLabels[id] ?? label;
}

function conceptLabel(selection: ConceptSelection) {
  return typeof selection === "string" ? selection : selection.label;
}

function conceptSources(selection: ConceptSelection) {
  return typeof selection === "string" ? [selection] : selection.sources;
}

export function buildEngineeringGraph(): EngineeringGraphData {
  const nodeMap = new Map<string, EngineeringGraphNode>();
  const edges: EngineeringGraphEdge[] = [];

  const addNode = (node: Omit<EngineeringGraphNode, "x" | "y" | "canvasLabel"> & { x?: number; y?: number }) => {
    if (nodeMap.has(node.id)) return nodeMap.get(node.id)!;
    const fixed = explicitPositions[node.id];
    const next: EngineeringGraphNode = {
      ...node,
      canvasLabel: canvasLabel(node.id, node.label),
      x: fixed?.x ?? node.x ?? 0,
      y: fixed?.y ?? node.y ?? 0,
    };
    nodeMap.set(node.id, next);
    return next;
  };

  const addEdge = (
    source: string,
    target: string,
    type: GraphEdgeType,
    label: string,
    status?: EngineeringGraphEdge["status"],
  ) => {
    if (!nodeMap.has(source) || !nodeMap.has(target)) return;
    edges.push({
      id: `${type}:${source}:${target}:${edges.length}`,
      source,
      target,
      type,
      label,
      status,
    });
  };

  const personId = "person:omer-faruk-koc";
  addNode({
    id: personId,
    label: profile.name,
    type: "person",
    status: "verified",
    description: `${profile.title}. ${profile.summary}`,
    importance: 10,
    metadata: {},
  });

  const experience = experiences[0];
  const experienceId = `experience:${experience.id}`;
  addNode({
    id: experienceId,
    label: `${experience.company} — ${experience.team}`,
    type: "experience",
    status: "verified",
    description: experience.summary,
    importance: 9,
    metadata: {
      company: experience.company,
      role: experience.role,
      period: experience.period,
    },
  });
  addEdge(personId, experienceId, "worked-at", "Worked at");

  for (const area of engineeringAreas) {
    const id = `domain:${area.id}`;
    addNode({
      id,
      label: area.title,
      type: "domain",
      status: "verified",
      description: area.description,
      importance: 7,
      metadata: {},
      ...domainAnchors[area.id],
    });
    if (area.evidenceExperienceIds.includes(experience.id)) {
      addEdge(experienceId, id, "applied-at", "Applied professionally");
    }
  }

  for (const project of projects) {
    const projectId = `project:${project.id}`;
    const selection = projectSelections[project.id];
    const keyTechnologies = selection.technologies.filter((technology) => project.technologies.includes(technology));
    const keyConcepts = selection.concepts
      .filter((concept) => conceptSources(concept).every((source) => project.concepts.includes(source)))
      .map(conceptLabel);

    addNode({
      id: projectId,
      label: project.title,
      type: "project",
      status: "current",
      description: project.summary,
      importance: project.flagship ? 9 : 7,
      projectSlug: project.slug,
      metadata: {
        category: project.category,
        githubUrl: project.githubUrl,
        flagship: project.flagship,
        keyTechnologies,
        keyConcepts,
        proofPoints: project.proofPoints,
        roadmap: project.roadmap.map((item) => item.title),
      },
      ...projectAnchors[project.id],
    });
    addEdge(personId, projectId, "built", "Built as public work");

    for (const area of engineeringAreas.filter((candidate) => candidate.evidenceProjectIds.includes(project.id))) {
      addEdge(projectId, `domain:${area.id}`, "supports", "Demonstrates domain");
    }

    for (const technology of keyTechnologies) {
      const technologyId = `technology:${slug(technology)}`;
      addNode({
        id: technologyId,
        label: technology,
        type: "technology",
        status: "current",
        description: "Strategic implementation technology represented in the public project graph.",
        importance: secondaryAnchors.has(technology) ? 6 : 4,
        metadata: {},
      });
      addEdge(projectId, technologyId, "uses", "Uses");
    }

    for (const concept of selection.concepts) {
      const sources = conceptSources(concept);
      if (!sources.every((source) => project.concepts.includes(source))) continue;
      const label = conceptLabel(concept);
      const conceptId = `concept:${slug(label)}`;
      addNode({
        id: conceptId,
        label,
        type: "concept",
        status: "current",
        description: typeof concept === "string"
          ? "High-signal engineering concept demonstrated by one or more public projects."
          : concept.description,
        importance: secondaryAnchors.has(label) ? 6 : 3,
        metadata: {},
      });
      addEdge(projectId, conceptId, "implements", "Implements");
    }

    if (strategicProjectMetrics.has(project.id)) {
      for (const proof of project.proofPoints) {
        const metricId = `metric:${project.id}:${slug(proof.value)}`;
        addNode({
          id: metricId,
          label: proof.value,
          type: "metric",
          status: "verified",
          description: proof.label,
          importance: 6,
          projectSlug: project.slug,
          metadata: { qualifier: proof.qualifier, scope: proof.scope },
        });
        addEdge(projectId, metricId, "measured-by", "Measured by");
      }
    }

    let roadmapSource = projectId;
    for (const item of project.roadmap) {
      const roadmapId = `roadmap:${project.id}:${slug(item.title)}`;
      const learningSource = learningItems.find((candidate) => candidate.title === item.title);
      addNode({
        id: roadmapId,
        label: item.title,
        type: "roadmap",
        status: "planned",
        description: learningSource?.rationale ?? `Planned next phase for ${project.title}; not part of the current implementation.`,
        importance: item.title === "Terraform" ? 7 : 6,
        projectSlug: project.slug,
        metadata: {
          rationale: learningSource?.rationale,
          connectedProject: project.title,
        },
      });
      addEdge(roadmapSource, roadmapId, "planned-for", roadmapSource === projectId ? "Planned for" : "Planned progression", "planned");
      roadmapSource = roadmapId;
    }
  }

  for (const project of projects) {
    for (const relationship of project.relationships) {
      addEdge(
        `project:${project.id}`,
        `project:${relationship.targetProjectId}`,
        relationship.type === "evolved-into" ? "evolved-into" : "related-to",
        relationship.label,
      );
    }
  }

  const experienceMetricSelections = [
    { impactId: "data-platform", label: "120 → 30 min" },
    { impactId: "ml-platform", label: "10+ ML Models" },
    { impactId: "data-scale", label: "~9M Records / Day" },
  ] as const;

  for (const selection of experienceMetricSelections) {
    const impact = experience.impacts.find((candidate) => candidate.id === selection.impactId);
    if (!impact) continue;
    const metricId = `metric:experience:${slug(selection.label)}`;
    addNode({
      id: metricId,
      label: selection.label,
      type: "metric",
      status: "verified",
      description: impact.summary,
      importance: 6,
      metadata: { qualifier: impact.proof },
    });
    addEdge(experienceId, metricId, "measured-by", "Verified by");
  }

  const experienceSignals: readonly { label: string; type: GraphNodeType; description: string }[] = [
    { label: "Kubernetes", type: "technology", description: "Professional ML lifecycle and platform experience; not the current Commerce project stack." },
    { label: "Airflow", type: "technology", description: "Professional data orchestration and delivery workflows." },
    { label: "dbt", type: "technology", description: "Professional modular data transformation work." },
    { label: "ML lifecycle", type: "concept", description: "Validation, versioning, promotion, serving, retraining and monitoring." },
    { label: "Feature Store", type: "concept", description: "Centralized reusable features supporting production ML models." },
    { label: "On-Prem GPU", type: "concept", description: "Private open-source model serving on on-premises GPU infrastructure." },
    { label: "Data Quality", type: "concept", description: "Production data quality and model validation workflows." },
  ];

  for (const signal of experienceSignals) {
    const signalId = `${signal.type}:${slug(signal.label)}`;
    addNode({
      id: signalId,
      label: signal.label,
      type: signal.type,
      status: "verified",
      description: signal.description,
      importance: secondaryAnchors.has(signal.label) ? 6 : 4,
      metadata: {},
    });
    addEdge(experienceId, signalId, "applied-at", "Applied professionally");
  }

  addNode({
    id: "concept:context-engineering",
    label: "Context Engineering",
    type: "concept",
    status: "current",
    description: "Source-grounded, bounded context construction for reliable coding-agent workflows.",
    importance: 6,
    metadata: {},
  });
  addEdge("technology:mcp", "concept:context-engineering", "supports", "Supports");

  for (const item of learningItems.filter((candidate) => candidate.status === "learning")) {
    const connectedProject = projects.find((project) => item.connectedProjectIds.includes(project.id));
    addNode({
      id: `learning:${item.id}`,
      label: item.title,
      type: "learning",
      status: "learning",
      description: item.rationale,
      importance: item.id === "langgraph" || item.id === "neo4j" ? 7 : 6,
      metadata: {
        rationale: item.rationale,
        foundation: connectedProject ? `${connectedProject.title} and its current engineering foundation` : "Current lineage, retrieval and graph-oriented engineering concepts",
        direction: item.rationale,
        connectedProject: connectedProject?.title,
      },
    });
  }

  addEdge("concept:context-engineering", "learning:langgraph", "learning", "Learning direction", "learning");
  addEdge("learning:langgraph", "learning:agent-memory", "learning", "Extends toward", "learning");
  addEdge("concept:model-dag", "learning:neo4j", "learning", "Learning direction", "learning");
  addEdge("learning:neo4j", "learning:graphrag", "learning", "Extends toward", "learning");

  const anchorTypes = new Set<GraphNodeType>(["person", "experience", "project", "domain"]);
  const positionedNodes = Array.from(nodeMap.values()).map((node) => {
    if (explicitPositions[node.id] || anchorTypes.has(node.type)) return node;

    const neighbors = edges
      .filter((edge) => edge.source === node.id || edge.target === node.id)
      .map((edge) => nodeMap.get(edge.source === node.id ? edge.target : edge.source))
      .filter((neighbor): neighbor is EngineeringGraphNode => Boolean(neighbor))
      .filter((neighbor) => anchorTypes.has(neighbor.type));

    const base = neighbors.length
      ? {
          x: neighbors.reduce((sum, neighbor) => sum + neighbor.x, 0) / neighbors.length,
          y: neighbors.reduce((sum, neighbor) => sum + neighbor.y, 0) / neighbors.length,
        }
      : { x: 0, y: 0 };
    const angle = ((hash(node.id) % 360) * Math.PI) / 180;
    const radius = node.type === "metric" ? 1.45 : node.type === "technology" ? 1.9 : 2.45;

    return {
      ...node,
      x: base.x + Math.cos(angle) * radius,
      y: base.y + Math.sin(angle) * radius,
    };
  });

  return { nodes: positionedNodes, edges };
}
