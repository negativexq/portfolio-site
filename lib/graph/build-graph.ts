import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { learningItems } from "@/data/learning";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import {
  canonicalTechnologyLabel,
  conceptNodeId,
  graphSlug,
  technologyNodeId,
} from "./canonical";
import { experienceTopicKind } from "./source-model";
import type {
  EngineeringGraphData,
  EngineeringGraphEdge,
  EngineeringGraphNode,
  GraphEdgeType,
  GraphNodeType,
  GraphStatus,
} from "./types";
import { assertGraphIntegrity } from "./validate-graph";

const projectAnchors: Record<string, { x: number; y: number }> = {
  "real-time-commerce-platform": { x: -5.2, y: -3.5 },
  "knowledge-base-rag": { x: 4.5, y: -3.4 },
  "production-rag-platform": { x: 7.3, y: -5.1 },
  "modelops-control-plane": { x: 0.2, y: -6.7 },
  "agentic-customer-service-platform": { x: 5.6, y: 4.4 },
  "repo-context-forge": { x: 5.3, y: 1.4 },
  "dbt-feature-lineage": { x: -5.3, y: 1.4 },
  "terraform-docker-infrastructure-lab": { x: -2.8, y: -4.5 },
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
  "technology:langgraph": { x: 7.8, y: 5.2 },
  "learning:agent-memory": { x: 9.4, y: 5.6 },
  "learning:context-engineering-rag": { x: 7.2, y: -3.8 },
  "learning:graphrag": { x: 8.6, y: -2.3 },
  "learning:llm-rag-evaluation": { x: 6.8, y: -5.4 },
  "learning:terraform": { x: -1.8, y: -8.5 },
  "learning:ai-platform-kubernetes": { x: 0.3, y: -9.2 },
  "learning:ai-platform-observability": { x: 2.6, y: -8.3 },
  "learning:distributed-systems-reliability": { x: -8.5, y: -5.6 },
  "learning:concurrency-performance-engineering": { x: -9.5, y: -1.6 },
  "learning:systems-api-engineering": { x: -7.8, y: 0.8 },
};

const prominentTechnologies = new Set([
  "Kafka",
  "FastAPI",
  "Docker",
  "Docker Compose",
  "Qdrant",
  "Ollama",
  "LangGraph",
  "MCP",
  "dbt Core",
  "Feature Store",
  "Terraform",
]);

const canvasLabels: Readonly<Record<string, string>> = {
  "experience:fibabanka": "Fibabanka",
  "domain:agent-infrastructure": "Agent Systems",
  "project:real-time-commerce-platform": "Real-Time Commerce",
  "evidence:project:real-time-commerce-platform:750-1-050-evt-s-40": "750 → 1,050 evt/s",
  "project:production-rag-platform": "Production RAG",
  "project:agentic-customer-service-platform": "Agentic Customer Service",
  "evidence:project:agentic-customer-service-platform:540-540-0-unsafe-executions": "540/540 · 0 Unsafe",
  "evidence:project:agentic-customer-service-platform:d2d-release-gate-pass": "D2D Gate PASS",
  "evidence:project:agentic-customer-service-platform:15-3-0-0-0": "15 → 0",
  "evidence:project:agentic-customer-service-platform:110-110-40-40-28-28": "110 · 40 · 28",
  "evidence:project:agentic-customer-service-platform:94-05-vs-82-14": "V3 vs Direct",
  "evidence:project:agentic-customer-service-platform:1-of-4-candidates-qualified": "1 of 4 Qualified",
  "evidence:experience:data-platform:120-30-min": "120 → 30 min",
  "evidence:experience:ml-platform:10-production-ml-models": "10+ ML Models",
  "evidence:experience:data-scale:9m-customers": "~9M Customers",
  "evidence:experience:call-center-intelligence:9-000-recordings-day": "~9,000 / Day",
  "evidence:experience:feature-platform:one-definition-per-feature": "Shared Features",
  "evidence:experience:quality-monitoring:checks-in-the-pipeline-not-the-report": "Pipeline Gates",
};

function canvasLabel(id: string, label: string) {
  return canvasLabels[id] ?? label;
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function statusPriority(status: GraphStatus) {
  return status === "verified" ? 4 : status === "current" ? 3 : status === "learning" ? 2 : 1;
}

function relaxNodeCollisions(nodes: readonly EngineeringGraphNode[]) {
  const positioned = nodes.map((node) => ({ ...node }));
  const fixed = new Set(positioned
    .filter((node) => explicitPositions[node.id] || ["person", "experience", "project", "domain", "capability"].includes(node.type))
    .map((node) => node.id));

  for (let iteration = 0; iteration < 14; iteration += 1) {
    for (let leftIndex = 0; leftIndex < positioned.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < positioned.length; rightIndex += 1) {
        const left = positioned[leftIndex];
        const right = positioned[rightIndex];
        let deltaX = right.x - left.x;
        let deltaY = right.y - left.y;
        let distance = Math.hypot(deltaX, deltaY);
        const minimum = 0.42 + Math.min(0.38, (left.importance + right.importance) * 0.025);
        if (distance >= minimum || (fixed.has(left.id) && fixed.has(right.id))) continue;

        if (distance < 0.001) {
          const angle = ((hash(`${left.id}:${right.id}`) % 360) * Math.PI) / 180;
          deltaX = Math.cos(angle) * 0.01;
          deltaY = Math.sin(angle) * 0.01;
          distance = 0.01;
        }

        const correction = (minimum - distance) / distance;
        const shiftX = deltaX * correction * 0.5;
        const shiftY = deltaY * correction * 0.5;
        if (!fixed.has(left.id)) {
          left.x -= shiftX;
          left.y -= shiftY;
        }
        if (!fixed.has(right.id)) {
          right.x += shiftX;
          right.y += shiftY;
        }
      }
    }
  }

  return positioned;
}

export function buildEngineeringGraph(): EngineeringGraphData {
  const nodeMap = new Map<string, EngineeringGraphNode>();
  const edgeMap = new Map<string, EngineeringGraphEdge>();

  const addNode = (node: Omit<EngineeringGraphNode, "x" | "y" | "canvasLabel"> & { x?: number; y?: number }) => {
    const existing = nodeMap.get(node.id);
    if (existing) {
      if (statusPriority(node.status) > statusPriority(existing.status)) existing.status = node.status;
      existing.importance = Math.max(existing.importance, node.importance);
      return existing;
    }

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
    inverseLabel: string,
    status?: EngineeringGraphEdge["status"],
  ) => {
    if (!nodeMap.has(source) || !nodeMap.has(target)) {
      throw new Error(`Graph edge references a missing node: ${source} -> ${target}`);
    }
    const id = `${type}:${source}:${target}`;
    if (edgeMap.has(id)) return;
    edgeMap.set(id, { id, source, target, type, label, inverseLabel, status });
  };

  const addTechnology = (technology: string, status: GraphStatus = "current") => {
    const label = canonicalTechnologyLabel(technology);
    return addNode({
      id: technologyNodeId(label),
      label,
      type: "technology",
      status,
      description: "Technology explicitly documented in a public project stack or professional impact record.",
      importance: prominentTechnologies.has(label) ? 6 : 4,
      metadata: {},
    });
  };

  const addConcept = (concept: string, status: GraphStatus = "current") => addNode({
    id: conceptNodeId(concept),
    label: concept,
    type: "concept",
    status,
    description: "Engineering concept explicitly documented by a public project or professional impact record.",
    importance: concept === "Hybrid Retrieval" || concept === "Feature Store" ? 6 : 3,
    metadata: {},
  });

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
    href: "/experience",
    metadata: {
      company: experience.company,
      role: experience.role,
      period: experience.period,
    },
  });
  addEdge(personId, experienceId, "worked-at", "worked at", "professional experience of");

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
      addEdge(experienceId, id, "supports", "demonstrates domain", "supported by professional evidence");
    }
  }

  for (const project of projects) {
    addNode({
      id: `project:${project.id}`,
      label: project.title,
      type: "project",
      status: "current",
      description: project.summary,
      importance: project.flagship ? 9 : 7,
      projectSlug: project.slug,
      href: `/projects/${project.slug}`,
      metadata: {
        category: project.category,
        githubUrl: project.githubUrl,
        flagship: project.flagship,
        keyTechnologies: project.technologies.map(canonicalTechnologyLabel),
        keyConcepts: project.concepts,
        proofPoints: project.proofPoints,
        roadmap: project.roadmap.map((item) => item.title),
      },
      ...projectAnchors[project.id],
    });
  }

  for (const project of projects) {
    const projectId = `project:${project.id}`;
    addEdge(personId, projectId, "built", "built as public work", "built by");

    for (const area of engineeringAreas.filter((candidate) => candidate.evidenceProjectIds.includes(project.id))) {
      addEdge(projectId, `domain:${area.id}`, "supports", "demonstrates domain", "demonstrated by");
    }

    for (const technology of project.technologies) {
      const technologyNode = addTechnology(technology);
      addEdge(projectId, technologyNode.id, "uses", "uses", "used by");
    }

    for (const concept of project.concepts) {
      const conceptNode = addConcept(concept);
      addEdge(projectId, conceptNode.id, "implements", "implements", "implemented by");
    }

    for (const proof of project.proofPoints) {
      const evidenceId = `evidence:project:${project.id}:${graphSlug(proof.value)}`;
      addNode({
        id: evidenceId,
        label: proof.value,
        type: "evidence",
        status: "verified",
        description: proof.label,
        importance: project.flagship ? 5 : 4,
        projectSlug: project.slug,
        href: `/projects/${project.slug}#evidence`,
        metadata: { qualifier: proof.qualifier, scope: proof.scope },
      });
      addEdge(evidenceId, projectId, "evidence-for", "evidence for", "supported by evidence");
    }

    let roadmapSource = projectId;
    for (const item of project.roadmap) {
      const learningSource = learningItems.find((candidate) => candidate.title === item.title);
      const roadmapId = learningSource
        ? `learning:${learningSource.id}`
        : `roadmap:${project.id}:${graphSlug(item.title)}`;
      addNode({
        id: roadmapId,
        label: item.title,
        type: learningSource ? "learning" : "roadmap",
        status: "planned",
        description: learningSource?.rationale ?? `Planned next phase for ${project.title}; not part of the current implementation.`,
        importance: item.title === "Terraform" ? 7 : 6,
        projectSlug: project.slug,
        href: "/learning",
        metadata: {
          rationale: learningSource?.rationale,
          connectedProject: project.title,
          direction: learningSource?.rationale,
        },
      });
      addEdge(
        roadmapSource,
        roadmapId,
        "planned-for",
        roadmapSource === projectId ? "planned direction" : "progresses toward",
        roadmapSource === projectId ? "planned for" : "follows",
        "planned",
      );
      roadmapSource = roadmapId;
    }
  }

  for (const project of projects) {
    for (const relationship of project.relationships) {
      const type = relationship.type === "evolved-into" ? "evolved-into" : "related-to";
      addEdge(
        `project:${project.id}`,
        `project:${relationship.targetProjectId}`,
        type,
        relationship.label.toLocaleLowerCase("en-US"),
        type === "evolved-into" ? "evolved from" : relationship.label.toLocaleLowerCase("en-US"),
      );
    }
  }

  experience.impacts.forEach((impact, impactIndex) => {
    const capabilityId = `capability:${experience.id}:${impact.id}`;
    const angle = (impactIndex / experience.impacts.length) * Math.PI * 2 + Math.PI / 8;
    addNode({
      id: capabilityId,
      label: impact.title,
      type: "capability",
      status: "verified",
      description: impact.summary,
      importance: 6,
      href: `/experience#${impact.id}`,
      metadata: { company: experience.company, impactId: impact.id },
      x: Math.cos(angle) * 2.6,
      y: 7.5 + Math.sin(angle) * 2.1,
    });
    addEdge(experienceId, capabilityId, "part-of", "professional capability", "built at");

    for (const topic of impact.topics) {
      if (experienceTopicKind(topic) === "technology") {
        const technologyNode = addTechnology(topic, "verified");
        addEdge(capabilityId, technologyNode.id, "uses", "uses", "used in professional capability");
      } else {
        const conceptNode = addConcept(topic, "verified");
        addEdge(capabilityId, conceptNode.id, "implements", "demonstrates", "demonstrated by");
      }
    }

    if (impact.proof) {
      const evidenceId = `evidence:experience:${impact.id}:${graphSlug(impact.proof.value)}`;
      addNode({
        id: evidenceId,
        label: impact.proof.value,
        type: "evidence",
        status: "verified",
        description: `${impact.title}: ${impact.proof.label}`,
        importance: 5,
        href: `/experience#${impact.id}`,
        metadata: {
          qualifier: impact.proof.qualifier,
          scope: impact.proof.scope,
          impactId: impact.id,
          company: experience.company,
        },
      });
      addEdge(evidenceId, capabilityId, "evidence-for", "evidence for", "supported by evidence");
    }
  });

  for (const evidenceImpact of experience.impacts.filter((impact) => impact.proof)) {
    const evidenceId = `evidence:experience:${evidenceImpact.id}:${graphSlug(evidenceImpact.proof!.value)}`;
    for (const supportedImpact of experience.impacts) {
      if (supportedImpact.id === evidenceImpact.id) continue;
      if (!supportedImpact.summary.toLocaleLowerCase("en-US").includes(evidenceImpact.proof!.value.toLocaleLowerCase("en-US"))) continue;
      addEdge(
        evidenceId,
        `capability:${experience.id}:${supportedImpact.id}`,
        "evidence-for",
        "evidence for",
        "supported by evidence",
      );
    }
  }

  const dockerComposeId = technologyNodeId("Docker Compose");
  const dockerId = technologyNodeId("Docker");
  if (nodeMap.has(dockerComposeId) && nodeMap.has(dockerId)) {
    addEdge(dockerComposeId, dockerId, "built-on", "orchestrates Docker containers", "orchestrated with Docker Compose");
  }

  const fastMcpId = technologyNodeId("FastMCP");
  const mcpId = technologyNodeId("MCP");
  if (nodeMap.has(fastMcpId) && nodeMap.has(mcpId)) {
    addEdge(fastMcpId, mcpId, "built-on", "implements MCP", "implemented by FastMCP");
  }

  for (const item of learningItems) {
    const itemId = `learning:${item.id}`;
    const connectedProjects = projects.filter((project) => item.connectedProjectIds.includes(project.id));
    addNode({
      id: itemId,
      label: item.title,
      type: "learning",
      status: item.status,
      description: item.rationale,
      importance: item.id === "context-engineering-rag"
        || item.id === "ai-platform-observability"
        || item.id === "terraform"
        || item.id === "ai-platform-kubernetes"
        ? 7
        : 6,
      href: "/learning",
      metadata: {
        rationale: item.rationale,
        foundation: connectedProjects.length
          ? connectedProjects.map((project) => project.title).join(" · ")
          : "Current lineage, retrieval and graph-oriented engineering concepts",
        direction: item.rationale,
        evidenceTarget: item.evidenceTarget,
        connectedProject: connectedProjects.map((project) => project.title).join(" · ") || undefined,
      },
    });

    for (const projectId of item.connectedProjectIds) {
      const sourceId = `project:${projectId}`;
      const plannedEdgeId = `planned-for:${sourceId}:${itemId}`;
      if (!edgeMap.has(plannedEdgeId)) {
        addEdge(
          sourceId,
          itemId,
          "learning-direction",
          item.status === "planned" ? "planned direction" : "learning direction",
          "extends from",
          item.status,
        );
      }
    }

    for (const areaId of item.connectedAreaIds) {
      addEdge(
        `domain:${areaId}`,
        itemId,
        "learning-direction",
        item.status === "planned" ? "planned direction" : "learning direction",
        "extends from",
        item.status,
      );
    }
  }

  for (const item of learningItems) {
    for (const connectedLearningId of item.connectedLearningIds) {
      const target = learningItems.find((candidate) => candidate.id === connectedLearningId);
      if (!target) throw new Error(`Learning direction references a missing item: ${item.id} -> ${connectedLearningId}`);
      addEdge(
        `learning:${item.id}`,
        `learning:${target.id}`,
        "learning-direction",
        "extends toward",
        "builds on",
        target.status,
      );
    }
  }

  const edges = Array.from(edgeMap.values());
  for (const node of nodeMap.values()) {
    if (node.type !== "technology" && node.type !== "concept") continue;
    const sourceLabels = edges
      .filter((edge) => edge.target === node.id && (edge.type === "uses" || edge.type === "implements"))
      .map((edge) => nodeMap.get(edge.source))
      .filter((source): source is EngineeringGraphNode => Boolean(source))
      .map((source) => source.label);
    if (sourceLabels.length > 0) {
      node.description = `${node.label} is explicitly documented in ${sourceLabels.join(", ")}.`;
    }
  }

  const anchorTypes = new Set<GraphNodeType>(["person", "experience", "project", "domain", "capability"]);
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
    const radius = node.type === "evidence" ? 1.35 : node.type === "technology" ? 2.2 : 2.75;

    return {
      ...node,
      x: base.x + Math.cos(angle) * radius,
      y: base.y + Math.sin(angle) * radius,
    };
  });

  const data = { nodes: relaxNodeCollisions(positionedNodes), edges } satisfies EngineeringGraphData;
  assertGraphIntegrity(data);
  return data;
}
