import { experiences } from "@/data/experience";
import { learningItems } from "@/data/learning";
import { projects } from "@/data/projects";
import {
  canonicalTechnologyLabel,
  conceptNodeId,
  graphSlug,
  technologyNodeId,
} from "./canonical";
import { experienceTopicKind, experienceTopicKinds } from "./source-model";
import type { EngineeringGraphData, EngineeringGraphEdge } from "./types";

export type GraphIntegrityReport = {
  totalNodes: number;
  totalRelationships: number;
  orphanNodes: readonly string[];
  duplicateCanonicalNodes: readonly string[];
  duplicateRelationships: readonly string[];
  invalidRelationshipTargets: readonly string[];
  invalidProjectIds: readonly string[];
  missingProjectStackRelationships: readonly string[];
  missingProjectConceptRelationships: readonly string[];
  missingProjectEvidenceRelationships: readonly string[];
  missingExperienceRelationships: readonly string[];
  missingLearningRelationships: readonly string[];
  learningProductionViolations: readonly string[];
  unsupportedProfessionalProjectLinks: readonly string[];
  projectStackRelationshipsValidated: number;
  projectConceptRelationshipsValidated: number;
  experienceRelationshipsValidated: number;
  learningRelationshipsValidated: number;
  evidenceRelationshipsValidated: number;
};

function edgeKey(edge: Pick<EngineeringGraphEdge, "source" | "target" | "type">) {
  return `${edge.type}:${edge.source}:${edge.target}`;
}

export function validateGraphIntegrity(data: EngineeringGraphData): GraphIntegrityReport {
  const nodeIds = new Set(data.nodes.map((node) => node.id));
  const edgeKeys = data.edges.map(edgeKey);
  const edgeKeySet = new Set(edgeKeys);
  const validProjectIds = new Set(projects.map((project) => `project:${project.id}`));

  const duplicateRelationships = edgeKeys.filter((key, index) => edgeKeys.indexOf(key) !== index);
  const invalidRelationshipTargets = data.edges
    .filter((edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target))
    .map(edgeKey);
  const invalidProjectIds = data.edges
    .flatMap((edge) => [edge.source, edge.target])
    .filter((id) => id.startsWith("project:") && !validProjectIds.has(id));

  const degree = new Map(data.nodes.map((node) => [node.id, 0]));
  for (const edge of data.edges) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  }
  const orphanNodes = data.nodes.filter((node) => degree.get(node.id) === 0).map((node) => node.id);

  const canonicalTechnologyNodes = new Map<string, string[]>();
  for (const node of data.nodes.filter((candidate) => candidate.type === "technology")) {
    const key = graphSlug(canonicalTechnologyLabel(node.label));
    canonicalTechnologyNodes.set(key, [...(canonicalTechnologyNodes.get(key) ?? []), node.id]);
  }
  const duplicateCanonicalNodes = Array.from(canonicalTechnologyNodes.entries())
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => `${key}: ${ids.join(", ")}`);

  const missingProjectStackRelationships: string[] = [];
  const missingProjectConceptRelationships: string[] = [];
  const missingProjectEvidenceRelationships: string[] = [];
  let projectStackRelationshipsValidated = 0;
  let projectConceptRelationshipsValidated = 0;
  let evidenceRelationshipsValidated = 0;

  for (const project of projects) {
    const projectId = `project:${project.id}`;
    for (const technology of project.technologies) {
      const key = `uses:${projectId}:${technologyNodeId(technology)}`;
      if (edgeKeySet.has(key)) projectStackRelationshipsValidated += 1;
      else missingProjectStackRelationships.push(`${project.id} -> ${canonicalTechnologyLabel(technology)}`);
    }
    for (const concept of project.concepts) {
      const key = `implements:${projectId}:${conceptNodeId(concept)}`;
      if (edgeKeySet.has(key)) projectConceptRelationshipsValidated += 1;
      else missingProjectConceptRelationships.push(`${project.id} -> ${concept}`);
    }
    for (const proof of project.proofPoints) {
      const evidenceId = `evidence:project:${project.id}:${graphSlug(proof.value)}`;
      const key = `evidence-for:${evidenceId}:${projectId}`;
      if (edgeKeySet.has(key)) evidenceRelationshipsValidated += 1;
      else missingProjectEvidenceRelationships.push(`${proof.value} -> ${project.id}`);
    }
    for (const relationship of project.relationships) {
      const type = relationship.type === "evolved-into" ? "evolved-into" : "related-to";
      const key = `${type}:${projectId}:project:${relationship.targetProjectId}`;
      if (!edgeKeySet.has(key)) missingProjectEvidenceRelationships.push(`missing project relationship ${key}`);
    }
  }

  const missingExperienceRelationships: string[] = [];
  let experienceRelationshipsValidated = 0;
  for (const experience of experiences) {
    const experienceId = `experience:${experience.id}`;
    for (const impact of experience.impacts) {
      const capabilityId = `capability:${experience.id}:${impact.id}`;
      const capabilityKey = `part-of:${experienceId}:${capabilityId}`;
      if (edgeKeySet.has(capabilityKey)) experienceRelationshipsValidated += 1;
      else missingExperienceRelationships.push(`${experience.id} -> ${impact.title}`);

      for (const topic of impact.topics) {
        if (!experienceTopicKinds[topic]) {
          missingExperienceRelationships.push(`unclassified experience topic: ${topic}`);
          continue;
        }
        const kind = experienceTopicKind(topic);
        const targetId = kind === "technology" ? technologyNodeId(topic) : conceptNodeId(topic);
        const type = kind === "technology" ? "uses" : "implements";
        const key = `${type}:${capabilityId}:${targetId}`;
        if (edgeKeySet.has(key)) experienceRelationshipsValidated += 1;
        else missingExperienceRelationships.push(`${impact.title} -> ${topic}`);
      }

      if (impact.proof) {
        const evidenceId = `evidence:experience:${impact.id}:${graphSlug(impact.proof)}`;
        const key = `evidence-for:${evidenceId}:${capabilityId}`;
        if (edgeKeySet.has(key)) {
          experienceRelationshipsValidated += 1;
          evidenceRelationshipsValidated += 1;
        } else missingExperienceRelationships.push(`${impact.proof} -> ${impact.title}`);
      }
    }

    for (const evidenceImpact of experience.impacts.filter((impact) => impact.proof)) {
      const evidenceId = `evidence:experience:${evidenceImpact.id}:${graphSlug(evidenceImpact.proof!)}`;
      for (const supportedImpact of experience.impacts) {
        if (supportedImpact.id === evidenceImpact.id) continue;
        if (!supportedImpact.summary.toLocaleLowerCase("en-US").includes(evidenceImpact.proof!.toLocaleLowerCase("en-US"))) continue;
        const key = `evidence-for:${evidenceId}:capability:${experience.id}:${supportedImpact.id}`;
        if (edgeKeySet.has(key)) {
          experienceRelationshipsValidated += 1;
          evidenceRelationshipsValidated += 1;
        } else missingExperienceRelationships.push(`${evidenceImpact.proof} -> ${supportedImpact.title}`);
      }
    }
  }

  const missingLearningRelationships: string[] = [];
  let learningRelationshipsValidated = 0;
  for (const item of learningItems) {
    const learningId = `learning:${item.id}`;
    if (!nodeIds.has(learningId)) missingLearningRelationships.push(`missing node ${learningId}`);
    for (const projectId of item.connectedProjectIds) {
      const source = `project:${projectId}`;
      const hasRelationship = edgeKeySet.has(`learning-direction:${source}:${learningId}`)
        || edgeKeySet.has(`planned-for:${source}:${learningId}`);
      if (hasRelationship) learningRelationshipsValidated += 1;
      else missingLearningRelationships.push(`${projectId} -> ${item.title}`);
    }
    for (const areaId of item.connectedAreaIds) {
      const key = `learning-direction:domain:${areaId}:${learningId}`;
      if (edgeKeySet.has(key)) learningRelationshipsValidated += 1;
      else missingLearningRelationships.push(`${areaId} -> ${item.title}`);
    }
    for (const connectedLearningId of item.connectedLearningIds) {
      const key = `learning-direction:${learningId}:learning:${connectedLearningId}`;
      if (edgeKeySet.has(key)) learningRelationshipsValidated += 1;
      else missingLearningRelationships.push(`${item.title} -> ${connectedLearningId}`);
    }
  }

  const learningNodeIds = new Set(data.nodes
    .filter((node) => node.type === "learning" || node.type === "roadmap")
    .map((node) => node.id));
  const productionEdgeTypes = new Set(["uses", "implements", "part-of", "built"]);
  const learningProductionViolations = data.edges
    .filter((edge) => (learningNodeIds.has(edge.source) || learningNodeIds.has(edge.target)) && productionEdgeTypes.has(edge.type))
    .map(edgeKey);

  const professionalTypes = new Set(["experience", "capability"]);
  const nodeTypeById = new Map(data.nodes.map((node) => [node.id, node.type]));
  const unsupportedProfessionalProjectLinks = data.edges
    .filter((edge) => {
      const sourceType = nodeTypeById.get(edge.source);
      const targetType = nodeTypeById.get(edge.target);
      return (sourceType === "project" && professionalTypes.has(targetType ?? ""))
        || (targetType === "project" && professionalTypes.has(sourceType ?? ""));
    })
    .map(edgeKey);

  return {
    totalNodes: data.nodes.length,
    totalRelationships: data.edges.length,
    orphanNodes,
    duplicateCanonicalNodes,
    duplicateRelationships,
    invalidRelationshipTargets,
    invalidProjectIds: [...new Set(invalidProjectIds)],
    missingProjectStackRelationships,
    missingProjectConceptRelationships,
    missingProjectEvidenceRelationships,
    missingExperienceRelationships,
    missingLearningRelationships,
    learningProductionViolations,
    unsupportedProfessionalProjectLinks,
    projectStackRelationshipsValidated,
    projectConceptRelationshipsValidated,
    experienceRelationshipsValidated,
    learningRelationshipsValidated,
    evidenceRelationshipsValidated,
  };
}

export function assertGraphIntegrity(data: EngineeringGraphData) {
  const report = validateGraphIntegrity(data);
  const errors = [
    ...report.orphanNodes.map((item) => `orphan node: ${item}`),
    ...report.duplicateCanonicalNodes.map((item) => `duplicate canonical node: ${item}`),
    ...report.duplicateRelationships.map((item) => `duplicate relationship: ${item}`),
    ...report.invalidRelationshipTargets.map((item) => `invalid relationship target: ${item}`),
    ...report.invalidProjectIds.map((item) => `invalid project id: ${item}`),
    ...report.missingProjectStackRelationships.map((item) => `missing project stack relationship: ${item}`),
    ...report.missingProjectConceptRelationships.map((item) => `missing project concept relationship: ${item}`),
    ...report.missingProjectEvidenceRelationships.map((item) => `missing project evidence relationship: ${item}`),
    ...report.missingExperienceRelationships.map((item) => `missing experience relationship: ${item}`),
    ...report.missingLearningRelationships.map((item) => `missing learning relationship: ${item}`),
    ...report.learningProductionViolations.map((item) => `learning represented as production: ${item}`),
    ...report.unsupportedProfessionalProjectLinks.map((item) => `unsupported professional/project cross-link: ${item}`),
  ];

  if (errors.length > 0) throw new Error(`Engineering graph integrity failed:\n${errors.join("\n")}`);
  return report;
}
