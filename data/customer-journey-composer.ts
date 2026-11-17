import type { Project } from "@/lib/content/types";

const repo = "https://github.com/negativexq/customer-journey-composer";
export const journeySource = (path: string) => `${repo}/blob/main/${path}`;

export const customerJourneyProject: Project = {
  id: "customer-journey-composer",
  slug: "customer-journey-composer",
  order: 6,
  title: "Customer Journey Composer",
  seoTitle: "Customer Journey Composer: AI-Proposed Journeys on a Durable Runtime",
  metaDescription: "Turn a plain-language brief into a customer journey on a visual canvas. AI proposes, a person approves, and a Go runtime on PostgreSQL runs each published version.",
  category: "AI Reliability / Execution Infrastructure",
  status: "current",
  flagship: true,
  summary: "Turn a plain-language brief into a customer journey with waits, branches, email, SMS and push. AI proposes the journey, a person approves and publishes it, and a Go runtime on PostgreSQL runs it step by step for each customer.",
  directAnswer: "Customer Journey Composer is a Go and Vue application that turns a brief into a customer journey on a visual canvas: an entry event, waits, conditions, branches, email, SMS and push steps, and a goal that ends the journey. Claude or OpenAI proposes the journey, a person reviews and applies it, and a Go runtime on PostgreSQL executes the published version for each customer. A Test Lab runs days of a journey in seconds on a virtual clock. Messages go to a local inbox and mock providers.",
  whyItExists: "A journey can run for days per customer, so a mistake keeps sending long after it was made. The useful part of AI is drafting the journey; the hard part is everything after: proving it does what the business asked, freezing the version that goes live, and running thousands of waits and sends without losing or repeating one when a worker restarts.",
  cardImage: {
    src: "/projects/customer-journey-composer/journey-builder.png",
    alt: "The Abandoned Cart Recovery journey on the canvas, with a purchase wait and its matched and timeout paths",
    width: 2560,
    height: 1600,
  },
  cardProof: {
    label: "Live generation",
    value: "47 / 47",
    scope: "Ten generated journeys, Test Lab cases",
    qualifier: "OpenAI gpt-6-luna on November 15, 2026, with three automatic repairs. The journeys stayed Draft and messages used the simulator.",
  },
  heroMetrics: [
    { value: "47 / 47", label: "Test Lab cases passed", context: "Ten generated journeys, Nov 15, 2026", detail: "Live run with OpenAI gpt-6-luna: 95,151 tokens and three automatic repairs. Live Claude quality has not been measured." },
    { value: "88 s", label: "10,000 customers sent", context: "Down from 177 s, local benchmark", detail: "All 10,000 mock sends accepted 87.5 to 89.5 s after a shared timer deadline, from 176.7 s before the queue SQL changes." },
    { value: "9.3 s", label: "Timer p95 lateness", context: "Down from 15.75 s", detail: "Timer step completion minus its due time, at p95, in the same 10,000-customer workload." },
  ],
  technologies: ["Go", "Vue", "TypeScript", "PostgreSQL", "Vue Flow", "Docker Compose", "Prometheus", "OpenTelemetry", "Grafana", "Anthropic API", "OpenAI API", "Playwright"],
  concepts: ["Human-in-the-Loop", "Durable Workflows", "Transactional Outbox", "Idempotency", "Structured Output Validation", "Virtual-Clock Testing"],
  proofPoints: [
    { label: "Live generation", value: "47/47 Test Lab cases", scope: "Ten journeys · OpenAI gpt-6-luna · 2026-11-15", qualifier: "Engagement waits and discount codes, 95,151 tokens, three automatic repairs. Earlier runs, failures included, stay in the validation history." },
    { label: "Queue drain", value: "87.5 to 89.5 s for 10,000 sends", scope: "Local benchmark · PostgreSQL limited to 2 CPU and 2 GiB · 2026-11-10", qualifier: "Down from 176.7 s after reordering the queue SQL, with no new index, cache, pool increase or Redis." },
    { label: "Timer lateness", value: "p95 9.25 to 9.41 s", scope: "Same workload, from 15.75 s", qualifier: "Ingestion p95 and p99 did not improve: the faster producer hits the per-workspace limiter and retries, and the report keeps that visible." },
    { label: "Recovery", value: "Resumes once after a worker stop", scope: "make test-recovery, run in CI", qualifier: "The test stops the worker during a wait and checks the execution resumes from its last committed step exactly once." },
  ],
  faqs: [
    { question: "What is Customer Journey Composer?", answer: "A Go and Vue application that turns a plain-language brief into a customer journey on a visual canvas, requires human approval and publishing, and runs each published version on a durable PostgreSQL runtime." },
    { question: "Can the AI publish or send anything?", answer: "No. The model returns a proposal. A person applies it as a draft, an Admin publishes it, and the runtime then runs that fixed version without a model." },
    { question: "Does it send real messages?", answer: "No. Email goes to a local Mailpit inbox and SMS and push go to mock providers, so nothing leaves the machine." },
    { question: "How is a journey tested before it goes live?", answer: "The Test Lab runs the real journey logic in a sandbox on a virtual clock, with injected events and provider failures, and checks expected outcomes. A journey whose required scenarios fail cannot be published." },
  ],
  roadmap: [],
  relationships: [],
  githubUrl: repo,
};

export const journeyScreenshots = [
  { file: "brief.png", width: 2560, height: 1600, title: "Describe the journey", description: "Write what should happen in everyday language, with the workspace's events and customer fields listed beside the brief.", alt: "Brief page with the abandoned-cart brief, the workspace events and fields it can use, and example journeys" },
  { file: "contract.png", width: 2560, height: 1600, title: "Say what must be true", description: "Before the model is called, confirm what the journey must do in each situation. Every proposal is checked against it.", alt: "Behavior contract for the situation No purchase during recovery, for EUR carts of at least 50 with email, SMS and push consent" },
  { file: "review-diagram.png", width: 2560, height: 1600, title: "Review the proposal", description: "The proposal is drawn as a diagram with each path. Ask for a change in your own words, or approve it as an editable draft.", alt: "Review page with the proposed steps from the cart trigger through the wait, email and purchase check" },
  { file: "journey-builder.png", width: 2560, height: 1600, title: "Edit it on the canvas", description: "Triggers, waits, conditions, branches, A/B splits, email, SMS, push, webhooks and exits are all editable, with autosave and undo.", alt: "Builder with the purchase wait selected, its push follow-up on the timeout path and the wait's settings in the side panel" },
  { file: "test-lab.png", width: 2560, height: 1600, title: "Run days in seconds", description: "Saved scenarios run on a virtual clock in an isolated sandbox, with the path taken and every assertion.", alt: "Test Lab running the Email, push and SMS, no purchase scenario on a virtual clock, passed, with its assertions and timeline" },
  { file: "test-inbox-push.png", width: 2560, height: 1600, title: "See what the customer gets", description: "The test inbox shows each message a scenario produced, personalized, with its trace, consent decision and attempts.", alt: "Test inbox with a push notification for Alex Morgan on a phone banner preview" },
  { file: "publish-review.png", width: 2560, height: 2160, title: "Publish a fixed version", description: "Publishing shows what changed and the checks it passed. Customers already in the journey keep the version they entered.", alt: "Publish review with three changed steps, the passed readiness checks and the version rules" },
  { file: "node-breakdown.png", width: 2560, height: 1600, title: "Follow it live", description: "The live monitor counts entries, goals and waits on the journey map and opens any step to its people and messages.", alt: "Step breakdown of the cart email on the journey map, with reached, accepted, opened and blocked counts" },
  { file: "customer-path.png", width: 2560, height: 1600, title: "Trace one customer", description: "One customer's execution with its version, exit reason and every step it passed.", alt: "Customer path showing one execution with its version, exit reason and each step" },
  { file: "journey-analytics.png", width: 2560, height: 1600, title: "Measure the outcome", description: "Filter by version and entry period. Provider acceptance is reported apart from conversion, never as delivery.", alt: "Journey analytics with entries, goals, waits and their trend over time" },
] as const;

export const journeyCapabilities = [
  { title: "Draft a journey from a brief", description: "Describe the journey in plain language or start from an example. Claude or OpenAI proposes the steps, and the review shows what it adds, removes and changes, with each setting before and after.", benefit: "A marketer starts from a working draft instead of an empty canvas." },
  { title: "Edit every step on the canvas", description: "Entry events and scheduled audiences, waits for a time or an event, conditions, multi-way branches, A/B splits, email, SMS, push, webhooks, profile updates and exits. Changes save automatically and can be undone.", benefit: "The AI draft is a starting point the marketer fully controls." },
  { title: "Test before going live", description: "The Test Lab runs saved scenarios on a virtual clock with injected events and provider failures. The test inbox shows every message as the customer would receive it, with its consent decision and attempts.", benefit: "Days of a journey can be checked in seconds, and a failing scenario blocks publishing." },
  { title: "Follow customers through it", description: "The live monitor counts entries, goals and waits on the journey map, opens any step to its people and messages, and traces a single customer's path with each transition.", benefit: "A running journey stays readable step by step." },
  { title: "Measure honestly", description: "Analytics filter by published version and entry period and attribute each outcome to the day the customer entered. Provider acceptance is reported apart from conversion.", benefit: "Results say what actually happened, not what was sent." },
] as const;

export const journeyDecisions = [
  { title: "Check the proposal against the brief", description: "A versioned JSON schema shapes the model's answer. The backend checks the graph, the message syntax and the behavior contract the person confirmed, and compares every link, code and number in the messages with the brief. Invalid output goes back once with the reasons and is never offered to apply." },
  { title: "Approve, then publish separately", description: "Warnings need an acknowledgement, and an edit made while a proposal is open blocks applying it. Applying creates a draft; publishing is a separate Admin action with its own review and needs a passing sandbox run of the exact workflow." },
  { title: "Keep execution in PostgreSQL", description: "Jobs are claimed with row locks and leases, fencing tokens stop a worker that lost its lease, and waits are rows, so executions survive restarts. There is no Redis: every worker reads the same state." },
  { title: "Send each action once", description: "Events are deduplicated, every logical action has a unique identity, and a transactional outbox carries sends, so a retry never sends twice from this side. An outcome the provider leaves unclear stays UNKNOWN instead of being reported as delivered." },
  { title: "Decide at send time", description: "Consent, frequency caps, the customer's lifecycle state and the journey's global exit are checked when a message is about to go, not when the journey was written. A blocked message is recorded with its reason and the journey goes on." },
] as const;

export const journeyContracts = [
  { title: "A published version never changes", description: "Customers already in a journey stay on the version they entered while a new draft is edited and published. Publishing changes only who enters next.", source: "docs/ARCHITECTURE.md" },
  { title: "Waits survive restarts", description: "A wait can last a fixed time, end at a time of day or a date on the customer, or wait for an event or a message open or click with a timeout. Each is a row in PostgreSQL, so a restarted worker picks it up.", source: "docs/ARCHITECTURE.md" },
  { title: "A goal ends the journey", description: "A global exit, such as a purchase, ends the journey as converted, and can be scoped to the object that started it, such as the same cart.", source: "docs/ENTRY-CORRELATION.md" },
  { title: "Provider trouble is shared state", description: "Backoff with jitter, a pause on 429, a credential lock on 401, a circuit breaker per workspace and channel, and a rate window, all held in PostgreSQL rows so every worker sees them at once.", source: "docs/DELIVERY-RESILIENCE.md" },
] as const;

export const journeyDeepDive = [
  ["Architecture", "docs/ARCHITECTURE.md"],
  ["AI composer contracts and human approval", "docs/AI.md"],
  ["Behavior contract", "docs/BEHAVIOR-CONTRACT-V2.md"],
  ["Behavior checks and the Test Lab", "docs/BEHAVIOR-CHECKS.md"],
  ["Delivery resilience", "docs/DELIVERY-RESILIENCE.md"],
  ["Measured performance", "docs/PERFORMANCE.md"],
  ["Live validation history", "docs/reports/README.md"],
  ["Security and operations policy", "docs/SECURITY.md"],
  ["Implementation tracker", "docs/IMPLEMENTATION.md"],
] as const;
