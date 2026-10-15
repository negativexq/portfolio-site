/** Reading order for the Agent architecture, using the canonical detail paths. */
export const agenticArchitectureBoundaries = [
  {
    id: "request",
    title: "Request",
    summary: "Customer or operator",
    description: "A chat or console request enters through the HTTP boundary.",
    groups: [{ pathId: "request-boundary", stageIds: ["caller", "api"], title: "Request entry" }],
  },
  {
    id: "identity",
    title: "Identity & scope",
    summary: "Resolved by the server",
    description: "Authentication establishes the principal. Customer scope comes from the server, never from model output.",
    groups: [{ pathId: "request-boundary", stageIds: ["auth", "context"], title: "Authenticated boundary" }],
  },
  {
    id: "proposal",
    title: "Agent proposal",
    summary: "Untrusted model output",
    description: "The runtime orchestrates a typed semantic proposal. Knowledge and memory can inform it, but cannot authorize an action.",
    groups: [
      { pathId: "decision-path", stageIds: ["graph", "understand"], title: "Model proposal" },
      { pathId: "knowledge-path", title: "Knowledge supports answers" },
      { pathId: "context-only", title: "Memory supplies context" },
    ],
  },
  {
    id: "authority",
    title: "Deterministic gates",
    summary: "Server-owned decisions",
    description: "The server compiles the proposal, resolves the authoritative target and validates live business state before policy decides what may proceed.",
    groups: [{ pathId: "decision-path", stageIds: ["validate", "target", "business-validation", "policy"], title: "Checks before permission" }],
  },
  {
    id: "execution",
    title: "Typed execution",
    summary: "Allow or confirmed actions",
    description: "Only a permitted action reaches the business tool. Required confirmation is bound to the exact pending action and revalidated before execution; idempotency and database invariants protect the effect.",
    groups: [{ pathId: "permitted-execution", title: "From permission to a durable effect" }],
  },
] as const;

/** Alternative routes, not sequential stages. Terminal routes never join execution. */
export const agenticPolicyRoutes = [
  { id: "allow", label: "Allow", condition: "Risk 0 / 1", destination: "execution", outcome: "Continue to the typed execution path.", link: "Inspect execution" },
  { id: "confirm", label: "Confirm", condition: "Risk 2", destination: "execution", outcome: "Wait for explicit approval; revalidate before execution.", link: "Inspect confirmation" },
  { id: "human", label: "Human", condition: "Risk 3", destination: null, outcome: "Use the dedicated escalation path. The requested action does not run automatically.", link: null },
  { id: "deny", label: "Deny", condition: "Blocked", destination: null, outcome: "Stop. The requested action does not execute.", link: null },
] as const;
