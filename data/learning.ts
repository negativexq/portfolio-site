import type { LearningItem } from "@/lib/content/types";

export const learningItems = [
  {
    id: "terraform",
    title: "Terraform",
    status: "planned",
    area: "Infrastructure",
    rationale:
      "Extend Real-Time Commerce from a Docker Compose reference system toward reproducible infrastructure and cloud deployment.",
    connectedProjectIds: ["real-time-commerce-platform"],
    connectedAreaIds: ["ai-ml-platform", "distributed-systems"],
    themes: ["Infrastructure as Code", "Kubernetes deployment", "Cloud infrastructure"],
  },
  {
    id: "langgraph",
    title: "LangGraph",
    status: "learning",
    area: "Agent Systems",
    rationale:
      "Extend current MCP and context-engineering work toward stateful agent workflows.",
    connectedProjectIds: ["repo-context-forge"],
    connectedAreaIds: ["agent-infrastructure"],
    themes: ["State", "Checkpointing", "Tool reliability", "Evaluation", "Human-in-the-loop"],
  },
  {
    id: "agent-memory",
    title: "Agent Memory",
    status: "learning",
    area: "Agent Systems",
    rationale:
      "Explore durable context, recovery and memory boundaries for reliable multi-step agent systems.",
    connectedProjectIds: ["repo-context-forge"],
    connectedAreaIds: ["agent-infrastructure"],
    themes: ["Durable state", "Recovery", "Context boundaries"],
  },
  {
    id: "neo4j",
    title: "Neo4j",
    status: "learning",
    area: "Graph Systems",
    rationale:
      "Develop graph-native modeling and traversal skills for relationship-aware engineering systems.",
    connectedProjectIds: [],
    connectedAreaIds: ["data-engineering", "agent-infrastructure"],
    themes: ["Knowledge graphs", "Graph traversal", "Cypher"],
  },
  {
    id: "graphrag",
    title: "GraphRAG",
    status: "learning",
    area: "Graph Systems",
    rationale:
      "Explore relationship-aware retrieval patterns that connect knowledge graphs, retrieval and agent context.",
    connectedProjectIds: ["knowledge-base-rag", "repo-context-forge"],
    connectedAreaIds: ["generative-ai-rag", "agent-infrastructure"],
    themes: ["Graph retrieval", "Knowledge graphs", "Evaluation"],
  },
] satisfies readonly LearningItem[];
