export const agenticProjectUrl = "https://omerfkoc.dev/projects/agentic-customer-service-platform";

export const agenticMeta = {
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
      "Support-ticket creation",
      "Human escalation for high-risk work",
    ],
  },
  {
    title: "Knowledge",
    items: [
      "Grounded FAQ and policy answers",
      "Hybrid dense + BM25 retrieval",
      "Evidence provenance and citation validation",
      "Says so when the evidence is not enough",
    ],
  },
  {
    title: "Stateful workflows",
    items: [
      "Explicit confirmation before sensitive actions",
      "Suspend, resume and workflow replacement",
      "Recovery after a browser or backend restart",
      "Revalidation and idempotent business effects",
    ],
  },
] as const;

export const agenticWorkflow = [
  {
    label: "Pending refund",
    detail: "The customer asks for a refund and the system records it as a pending action.",
  },
  {
    label: "Waiting for approval",
    detail: "The refund is allowed, but it does not run until the customer approves it.",
  },
  {
    label: "A yes with a question",
    detail: "“Yes, but first, what is your refund policy?” is treated as a question, not as approval.",
  },
  {
    label: "Workflow suspended",
    detail: "The refund stays pending while the agent answers the question.",
  },
  {
    label: "Answer from the policy",
    detail: "The agent answers from the refund policy, with citations to the source.",
  },
  {
    label: "Still pending",
    detail: "Answering the question does not count as approval, so the refund keeps waiting.",
  },
  {
    label: "Confirm and recheck",
    detail: "The customer confirms the same refund, and the order is checked again before anything runs.",
  },
  {
    label: "Runs exactly once",
    detail: "The refund is written through the typed business path, and a retry cannot apply it twice.",
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
    title: "Workflows that survive interruptions",
    description:
      "Each confirmation is tied to one saved action. A message that mixes a yes with a question pauses the workflow instead of approving it. Workflows can resume or be replaced, state survives a browser or backend restart, and the final write is rechecked and protected against replays.",
  },
  {
    title: "Memory that remembers but cannot authorize",
    description:
      "Preferences and support context are kept with consent, an expiry time and per-customer scope, and sensitive data is redacted or rejected. Memory adds context to the conversation; a remembered claim of approval or admin rights is rejected.",
  },
  {
    title: "Answers grounded in the policy documents",
    description:
      "Hybrid dense and BM25 retrieval picks the evidence, and the answer is checked against its sources and citations. When the evidence is not enough, the agent says so instead of guessing. Evidence shapes the answer; it never grants permission to act.",
  },
] as const;

export const agenticScreenshots = [
  {
    src: "/projects/agentic-customer-service-platform/refund-happy-path-current.png",
    alt: "Agentic Ops showcase showing a refund request with grounded evidence, a confirmation boundary, and execution still awaiting approval.",
    caption:
      "A refund held at the confirmation step until the customer approves it.",
    source: "docs/demo/refund-happy-path.png",
    sourceUrl:
      "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/refund-happy-path.png",
  },
  {
    src: "/projects/agentic-customer-service-platform/security-boundary.png",
    alt: "Agentic Ops security-boundary view showing an instruction-override attempt denied, authority not granted, and execution not attempted.",
    caption:
      "An attempt to override the rules is denied before anything runs.",
    source: "docs/demo/security-boundary.png",
    sourceUrl:
      "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/security-boundary.png",
  },
  {
    src: "/projects/agentic-customer-service-platform/rag-grounding.png",
    alt: "Agentic Ops RAG grounding view showing retrieved policy evidence, citations, a passed grounding validation, and no unsupported claims.",
    caption:
      "A policy answer backed by the retrieved documents.",
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
      "“Yes, but first…” stays a question, so the refund stays pending.",
  },
  {
    src: "/projects/agentic-customer-service-platform/linkedin-carousel-02-workflow.png",
    alt: "Agent timeline showing refund-policy intent detection, RAG retrieval, a confirmation boundary, workflow pause, grounding validation, and persisted evidence.",
    caption:
      "The timeline records the pause, the retrieval and the grounding check as separate events.",
  },
  {
    src: "/projects/agentic-customer-service-platform/linkedin-carousel-03-rag-decision.png",
    alt: "Operator view showing retrieved refund and cancellation policy evidence beside a no-action decision with interrupted confirmation.",
    caption:
      "The policy evidence informs the answer, and no action is taken.",
  },
] as const;

export const agenticEvidence = [
  {
    area: "Semantic safety",
    result: "540/540 measured semantic-safety attempts",
    detail: "No unsafe proposal got through, and nothing unsafe ran.",
  },
  {
    area: "Operational release gate",
    result: "18/18 scenarios, 8/8 phases, 6/6 fault classes",
    detail: "The deployed system behaves correctly across its release scenarios and injected faults.",
  },
  {
    area: "Deterministic resilience",
    result: "28/28",
    detail: "Deterministic resilience checks, reported on their own.",
  },
  {
    area: "Real-LLM QA",
    result: "100 samples, 82 passed, 18 partial passes with warnings",
    detail: "Answer quality with real models; no safety check failed.",
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
