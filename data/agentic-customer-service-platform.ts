export const agenticProjectUrl = "https://omerfkoc.dev/projects/agentic-customer-service-platform";

export const agenticMeta = {
  title: "Agentic Customer Service Platform",
  description:
    "Production-oriented Agentic AI Control Plane for customer-service workflows: LLM semantic proposals, deterministic execution controls, grounded RAG, confirmation and revalidation.",
  image: "/projects/agentic-customer-service-platform/refund-happy-path.png",
  imageAlt: "Agentic Ops operator console showing a refund request held at a confirmation boundary.",
  keywords: [
    "agentic customer service",
    "AI control plane",
    "deterministic execution",
    "semantic proposals",
    "grounded RAG",
    "confirmation revalidation",
  ],
} as const;

export const agenticCapabilities = [
  {
    title: "Customer operations",
    items: [
      "Order and ticket lookup",
      "Refund and cancellation workflows",
      "Support-ticket creation where supported",
      "Human escalation for high-risk work",
    ],
  },
  {
    title: "Knowledge",
    items: [
      "Grounded FAQ and policy answers",
      "Hybrid dense + BM25 retrieval",
      "Evidence provenance and citation validation",
      "Bounded abstention when evidence is insufficient",
    ],
  },
  {
    title: "Stateful workflows",
    items: [
      "Explicit confirmation boundaries",
      "Suspend, resume and workflow replacement",
      "Browser/backend restart recovery where supported",
      "Revalidation and idempotent business effects",
    ],
  },
] as const;

export const agenticWorkflow = [
  {
    label: "Pending refund",
    detail: "The customer asks for a refund and the system creates a confirmation-bound pending action.",
  },
  {
    label: "Confirmation boundary",
    detail: "The action is eligible, but no sensitive mutation can run without explicit approval.",
  },
  {
    label: "Mixed confirmation + question",
    detail: "“Yes, but first, what is your refund policy?” is an interruption, not approval.",
  },
  {
    label: "Workflow suspended",
    detail: "The refund remains pending while the knowledge question takes the conversational turn.",
  },
  {
    label: "Grounded RAG answer",
    detail: "Hybrid retrieval and grounding validation produce a bounded policy answer.",
  },
  {
    label: "Still not executed",
    detail: "The answer does not grant authority; the refund is still waiting for an explicit resume.",
  },
  {
    label: "Resume → confirm → revalidate",
    detail: "The customer explicitly resumes, confirms the same pending action, and live state is checked again.",
  },
  {
    label: "Idempotent execution",
    detail: "Only the typed business path can commit the effect, with replay protection around the write.",
  },
] as const;

export const agenticControlPlaneRows = [
  {
    side: "Model / probabilistic",
    items: [
      "Natural-language understanding",
      "Semantic intent proposal",
      "Ambiguous-language interpretation",
      "Response generation",
      "Using retrieved evidence for answers",
    ],
  },
  {
    side: "Deterministic / server-owned",
    items: [
      "Authentication and customer scope",
      "Security boundary",
      "DecisionCompiler and authoritative target resolution",
      "Typed arguments, business validation and policy",
      "Confirmation binding and workflow state",
      "Revalidation, idempotency and database invariants",
      "Execution authority",
    ],
  },
] as const;

export const agenticEngineeringDecisions = [
  {
    title: "Durable workflows that survive interruption and recovery",
    description:
      "Consequential actions bind confirmation to a specific persisted action. Mixed messages suspend rather than confirm; workflows can resume or be superseded; supported browser/backend recovery restores state; revalidation and replay-safe idempotency protect the final write.",
  },
  {
    title: "Customer-scoped memory, never authority",
    description:
      "Bounded preferences and support context may persist with consent, TTL and scope controls. DLP/redaction or rejection applies where implemented. Authority, approval and security-override claims are rejected: memory enriches context but cannot authorize work.",
  },
  {
    title: "Grounded RAG with bounded abstention",
    description:
      "Hybrid retrieval selects evidence, then provenance, citation/excerpt identity and grounding checks constrain the answer. Unsupported or insufficient evidence produces bounded uncertainty. Retrieved evidence informs answers; it never grants execution authority.",
  },
] as const;

export const agenticScreenshots = [
  {
    src: "/projects/agentic-customer-service-platform/refund-happy-path-current.png",
    alt: "Agentic Ops showcase showing a refund request with grounded evidence, a confirmation boundary, and execution still awaiting approval.",
    caption:
      "Controlled refund: the evidence supports the proposal, but the confirmation boundary still holds execution until explicit approval.",
    source: "docs/demo/refund-happy-path.png",
    sourceUrl:
      "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/refund-happy-path.png",
  },
  {
    src: "/projects/agentic-customer-service-platform/security-boundary.png",
    alt: "Agentic Ops security-boundary view showing an instruction-override attempt denied, authority not granted, and execution not attempted.",
    caption:
      "Security boundary: the override attempt is denied before execution; the model cannot turn an approval claim into permission.",
    source: "docs/demo/security-boundary.png",
    sourceUrl:
      "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/security-boundary.png",
  },
  {
    src: "/projects/agentic-customer-service-platform/rag-grounding.png",
    alt: "Agentic Ops RAG grounding view showing retrieved policy evidence, citations, a passed grounding validation, and no unsupported claims.",
    caption:
      "Grounded answer: retrieved evidence supports the response while the execution authority remains separate.",
    source: "docs/demo/rag-grounded-faq-conversation.png",
    sourceUrl:
      "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/rag-grounded-faq-conversation.png",
  },
] as const;

export const agenticWalkthroughSlides = [
  {
    src: "/projects/agentic-customer-service-platform/linkedin-carousel-01-conversation.png",
    alt: "Customer-service conversation showing a refund request, an order number clarification, a confirmation boundary, and a policy question that interrupts approval.",
    caption:
      "Conversation path: “Yes, but first…” stays a policy question, so the refund remains pending instead of being silently confirmed.",
  },
  {
    src: "/projects/agentic-customer-service-platform/linkedin-carousel-02-workflow.png",
    alt: "Agent timeline showing refund-policy intent detection, RAG retrieval, a confirmation boundary, workflow pause, grounding validation, and persisted evidence.",
    caption:
      "Workflow evidence: the runtime records the pause, retrieval, grounding validation, and evidence persistence as separate lifecycle events.",
  },
  {
    src: "/projects/agentic-customer-service-platform/linkedin-carousel-03-rag-decision.png",
    alt: "Operator view showing retrieved refund and cancellation policy evidence beside a no-action decision with interrupted confirmation.",
    caption:
      "Decision boundary: retrieved policy evidence informs the answer while the deterministic decision remains no action and execution is not applicable.",
  },
] as const;

export const agenticEvidence = [
  {
    area: "D2c semantic / safety validation",
    result: "540/540 measured semantic-safety attempts",
    detail: "0 unsafe executable survivors; 0 unsafe executions.",
  },
  {
    area: "D2d operational release gate",
    result: "18/18 scenarios · 8/8 phases · 6/6 fault classes",
    detail: "Operational correctness under the exercised reference deployment.",
  },
  {
    area: "Deterministic resilience",
    result: "28/28",
    detail: "Separate resilience snapshot; not merged into the semantic or real-LLM result.",
  },
  {
    area: "Real-LLM QA",
    result: "100 samples · 82 passed · 18 bounded warning-partials",
    detail: "Quality-outcome breakdown, not a safety rate; no safety invariant failed.",
  },
] as const;

export const agenticDeepDiveLinks = [
  {
    label: "Architecture",
    href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/architecture.md",
  },
  {
    label: "Release evidence",
    href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/release-evidence.md",
  },
  {
    label: "Real-LLM QA",
    href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/security/real-llm-production-qa-report.md",
  },
  {
    label: "Prioritized hardening backlog",
    href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/engineering-hardening-roadmap.md",
  },
] as const;

export const agenticRelatedWriting = [
  {
    href: "/writing/a-confirmation-is-not-a-boolean",
    title: "A Confirmation Is Not a Boolean: Designing Stateful Agent Workflows",
    description:
      "Why interruption, suspension, resume, revalidation, and durable state matter when a customer-impacting agent action is still pending.",
  },
  {
    href: "/writing/the-write-may-have-succeeded",
    title: "The Write May Have Succeeded: Handling Unknown Outcomes in AI Agents",
    description:
      "Why a timeout does not prove a business write failed, and how action identity and idempotency prevent duplicate effects.",
  },
  {
    href: "/writing/memory-is-context-not-authority",
    title: "Memory Is Context, Not Authority",
    description:
      "How scoped, consent-aware memory can enrich support context without becoming permission or approval.",
  },
  {
    href: "/writing/testing-ai-agents-without-pretending-they-are-deterministic",
    title: "Testing AI Agents Without Pretending They Are Deterministic",
    description:
      "Why deterministic control-plane tests and real-LLM QA should remain separate evidence slices.",
  },
  {
    href: "/writing/decision-authority-execution-observability",
    title: "Decision, Authority, Execution: Observability for AI Agents",
    description:
      "What operators need to inspect beyond the model's response: workflow, policy, authority, execution, evidence, and replay.",
  },
  {
    href: "/writing/rag-can-provide-evidence",
    title: "RAG Can Provide Evidence. It Cannot Grant Authority.",
    description:
      "How retrieval, provenance, grounding checks, and bounded abstention stay separate from execution permission.",
  },
] as const;

export const agenticRelatedWritingFoundations = [
  {
    href: "/writing/production-agent-guardrails",
    title: "Designing Guardrails for Production AI Agents",
    description:
      "Typed proposals, deterministic policy, durable confirmation, revalidation, idempotency, and audit around tool-using agents.",
  },
  {
    href: "/writing/agent-prompt-injection-guardrails",
    title: "How I Keep Prompt Injection Away from Agent Tools",
    description:
      "Why user text, retrieved documents, memory, and model output stay outside the execution authority boundary.",
  },
  {
    href: "/writing/rag-citation-integrity",
    title: "Building Citation Integrity into a Production RAG Pipeline",
    description:
      "How source identity, bounded context, citation validation, and evaluation keep RAG evidence traceable.",
  },
] as const;

export const agenticStackGroups = [
  ["Agent orchestration", "LangGraph"],
  ["API", "FastAPI + Pydantic"],
  ["Persistence", "PostgreSQL + SQLAlchemy + Alembic"],
  ["Retrieval", "Qdrant + hybrid dense/BM25 retrieval"],
  ["Observability", "OpenTelemetry + Jaeger"],
  ["Frontend", "React + TypeScript + Vite"],
  ["Verification", "Pytest + Ruff + Mypy + Vitest + Playwright"],
  ["Runtime", "Docker Compose"],
] as const;
