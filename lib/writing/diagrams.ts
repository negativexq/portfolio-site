export const WRITING_DIAGRAM_IDS = [
  "kafka-idempotency-flow",
  "transactional-outbox-flow",
  "agent-trust-boundary",
  "rag-citation-pipeline",
  "agent-policy-flow",
  "commerce-processing-lifecycle",
  "model-promotion-control-loop",
  "confirmation-lifecycle",
  "unknown-write-outcome",
  "decision-authority-execution",
  "agent-evaluation-tracks",
] as const;

export type WritingDiagramId = (typeof WRITING_DIAGRAM_IDS)[number];

export function isWritingDiagramId(value: string): value is WritingDiagramId {
  return (WRITING_DIAGRAM_IDS as readonly string[]).includes(value);
}
