export type ExperienceTopicKind = "technology" | "concept";

export const experienceTopicKinds: Readonly<Record<string, ExperienceTopicKind>> = {
  Oracle: "technology",
  dbt: "technology",
  "ETL / ELT": "concept",
  "Parallel execution": "concept",
  Validation: "concept",
  Versioning: "concept",
  Promotion: "concept",
  Serving: "concept",
  Retraining: "concept",
  Monitoring: "concept",
  "Feature store": "concept",
  "Dimensional modeling": "concept",
  "Reusable features": "concept",
  "Batch pipelines": "concept",
  "Near-real-time": "concept",
  Training: "concept",
  Inference: "concept",
  Analytics: "concept",
  Azure: "technology",
  "On-prem GPU": "technology",
  "llama.cpp": "technology",
  Ollama: "technology",
  LangChain: "technology",
  WhisperX: "technology",
  "Timestamp alignment": "concept",
  "Speaker diarization": "concept",
  "LLM summarization": "concept",
  "Structured outputs": "concept",
  "Operational KPIs": "concept",
  "Great Expectations": "technology",
  Deepchecks: "technology",
  Airflow: "technology",
  "GitHub Actions": "technology",
};

export function experienceTopicKind(topic: string): ExperienceTopicKind {
  const kind = experienceTopicKinds[topic];
  if (!kind) throw new Error(`Experience topic is not classified for the graph: ${topic}`);
  return kind;
}
