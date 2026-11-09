import type { Project } from "@/lib/content/types";

const repo = "https://github.com/negativexq/smart-campaign-composer";
export const campaignSource = (path: string) => `${repo}/blob/main/${path}`;

export const smartCampaignProject: Project = {
  id: "smart-campaign-composer",
  slug: "smart-campaign-composer",
  order: 8,
  title: "Smart Campaign Composer",
  seoTitle: "Smart Campaign Composer: Validated AI Campaign Delivery",
  metaDescription: "Plan, write and track multilingual SMS and email campaigns in one workspace. AI audiences, a visual email builder, human approval and reliable delivery.",
  category: "AI Reliability / Execution Infrastructure",
  status: "current",
  flagship: true,
  summary: "Plan, write, approve and track multilingual SMS and email campaigns in one workspace, with AI-assisted audiences and a delivery engine built to recover from retries and restarts.",
  directAnswer: "Smart Campaign Composer is a Go and Vue application that turns a marketer’s brief into audience rules and multilingual SMS and email. The backend validates the model’s output, a person approves a specific revision, and workers send through a mock provider while reporting delivery progress live. No real messages are sent.",
  whyItExists: "Generating convincing campaign copy is only part of the work. The audience must match the brief, approval must cover the version that actually goes out, and thousands of deliveries must survive retries and worker crashes without being accepted twice. This project makes those boundaries visible in both the product and its verification suites.",
  cardImage: {
    src: "/projects/smart-campaign-composer/campaign-live.png",
    alt: "Smart Campaign Composer sending a campaign, with live per-channel progress and delivery results",
    width: 2880,
    height: 2062,
  },
  cardProof: {
    label: "Approval boundary",
    value: "REVIEWED REVISION",
    scope: "Validated output → human approval → durable send",
    qualifier: "Approval names the revision the person reviewed; a database trigger prevents edits to an approved version. Delivery uses a mock provider.",
  },
  heroMetrics: [
    { value: "2,000+ RPS", label: "Campaign list API", context: "Measured local read throughput · Nov 8, 2026", detail: "2,040 to 2,261 requests/s with message previews in the current measured version. This measures API reads, separately from message sending." },
    { value: "100 / SECOND", label: "Per-channel send limit", context: "Configured delivery policy · shared across workers", detail: "SMS and email each have their own 100 calls/s budget. Retries share that budget; adding workers preserves the channel limit." },
    { value: "243 / 247", label: "Expected model outcomes", context: "Recorded Claude benchmark · Nov 9, 2026", detail: "One run: 2 false blocks, 2 visible misses and 0 silently wrong outcomes. This is a repository-authored case set, not a production accuracy estimate." },
  ],
  technologies: ["Go", "Vue", "TypeScript", "PostgreSQL", "Redis", "Docker Compose", "Prometheus", "OpenTelemetry", "Anthropic API", "OpenAI API"],
  concepts: ["Human-in-the-Loop", "Idempotency", "Structured Output Validation", "Durable Workflows", "Rate Limiting", "Fault Injection", "Multilingual Evaluation"],
  proofPoints: [
    { label: "Read-path performance", value: "2,040 to 2,261 requests/s", scope: "Campaign list endpoint · local Docker · 2026-11-08", qualifier: "Three alternating runs, with message previews. An earlier version without previews measured 2,123 to 2,609 requests/s. These are API reads, not send throughput." },
    { label: "Model benchmark", value: "243/247 expected", scope: "Claude Haiku 5.5 · 2026-11-09 · one run", qualifier: "0 silently wrong outcomes, 2 false blocks and 2 visible misses. Deterministic grounding still has documented gaps; a clean model run does not close them." },
    { label: "Fault verification", value: "24 load scenarios", scope: "Recorded Compose verification · 2026-11-08", qualifier: "No duplicate acceptance recorded. Deliberate worker overconfiguration and clock jumps above 100 ms exceeded the provider rate limit and are reported explicitly." },
    { label: "External security probes", value: "19 passed", scope: "Recorded verification stack · 2026-11-08", qualifier: "Known open items remain, including unsigned identity cookies, missing browser security headers and no API request rate limit." },
  ],
  faqs: [
    { question: "What is Smart Campaign Composer?", answer: "A local Go and Vue campaign application that turns a brief into validated audience rules and multilingual SMS and email, requires human approval, and sends through a mock provider with live delivery reporting." },
    { question: "Does it send real SMS or email?", answer: "No. Delivery goes to a mock provider with a test inbox, simulated failures and delivery reports. The complete flow runs with mock AI and no model API key." },
    { question: "What prevents an unreviewed campaign from being sent?", answer: "Approval checks the specific review revision and unresolved audience blockers, freezes the version in PostgreSQL and stores the one-time recipient set. Workers claim deliveries only from dispatching campaigns." },
    { question: "How do API capacity and sending limits compare?", answer: "The current measured campaign list serves 2,040 to 2,261 requests per second locally; an earlier version without message previews reached 2,609. Sending has a separate configured ceiling of 100 provider calls per second per channel, shared by all workers and retries. The read benchmark does not measure maximum send capacity." },
  ],
  roadmap: [],
  relationships: [],
  githubUrl: repo,
};

export const campaignScreenshots = [
  { file: "brief.png", width: 2880, height: 2652, title: "Start with the brief", description: "Choose the channels and email template. A discount code and destination link become explicit campaign options.", alt: "Campaign brief with SMS and email selected, an email template and extracted discount code" },
  { file: "audience.png", width: 2880, height: 3000, title: "Check the audience", description: "Inspect the audience funnel, language counts and any condition the system cannot apply before proceeding.", alt: "Audience rules, counts and an unsupported age condition that blocks campaign approval" },
  { file: "sms-content.png", width: 2880, height: 2000, title: "Review each language", description: "Edit the generated copy and inspect the customer preview. Discount and short-link placeholders are resolved when sending.", alt: "Turkish and English message versions alongside a personalized SMS phone preview" },
  { file: "delivery-report.png", width: 2880, height: 3000, title: "Account for each delivery", description: "Separate provider acceptance from simulated delivery, with retry history, skipped recipients and per-channel results.", alt: "Delivery report showing accepted, delivered, bounced and skipped messages by channel" },
  { file: "template-builder.png", width: 2880, height: 2036, title: "Build the email once", description: "Arrange logo, image, heading, text, button and divider blocks with desktop and phone previews. Reuse the design across campaigns.", alt: "Three-panel email template builder with editable blocks and a live campaign preview" },
  { file: "email-content.png", width: 2880, height: 3258, title: "Keep the brand in every language", description: "Review the generated subject, headline, message and button inside the selected template, with the customer's name and discount code filled in.", alt: "Multilingual email editor and branded preview with a personalized discount code" },
  { file: "campaign-calendar.png", width: 2880, height: 2200, title: "Plan the next send", description: "Switch between day, week and month views of drafts, scheduled campaigns and completed runs, including recurring sends.", alt: "Campaign calendar showing drafts, scheduled campaigns and recurring runs in a month view" },
  { file: "analytics.png", width: 2880, height: 2720, title: "Compare campaign results", description: "See channel outcomes, provider calls over time and campaigns by failure rate across the workspace.", alt: "Workspace analytics comparing message outcomes and provider activity across campaigns" },
] as const;

export const campaignCapabilities = [
  { title: "Turn intent into an audience", description: "Describe a city, recent cart activity, purchases or a period without contact in ordinary language. Inspect the resulting rules and how each condition narrows the audience. Save segments for the next campaign; unsupported conditions remain visible for review.", benefit: "The marketer can check who will receive the campaign before writing or sending it." },
  { title: "Write for each recipient's language", description: "Generate SMS and email in Turkish, English, German, French and Spanish for the audience languages you choose. Edit fields directly or ask for a revision. The preview fills in customer names, discount codes and links; unselected languages fall back to English.", benefit: "One campaign keeps its audience, offer and language versions together." },
  { title: "Make the design reusable", description: "Start from eight email templates or create a layout in the block editor. Manage banners in the image library and set the logo, colors, font and footer in the brand kit. The model fills the copy while the chosen layout and assets stay under the marketer's control.", benefit: "Every new campaign starts from an existing design rather than a blank email." },
  { title: "Schedule and compare", description: "Send immediately, choose a future time or configure a repeating campaign. Inspect upcoming runs in the calendar. A/B campaigns keep each person's assigned version stable across retries and later runs, and report results by version.", benefit: "Planning, recurring delivery and variant comparison share the same workflow." },
  { title: "Track the message after sending", description: "Follow live progress and inspect individual delivery histories. Per-message SMS short links count opens and redirect to the campaign destination. Reports distinguish provider acceptance, simulated delivery, bounces and skipped recipients; analytics compares campaigns across the workspace.", benefit: "A send ends with an inspectable result for each recipient and channel." },
] as const;

export const campaignDecisions = [
  { title: "Validate before storing", description: "The model proposes structured rules and message fields. The backend checks the schema, facts, offer, links and personalized length limits, then allows at most three attempts with validation errors returned for repair. Streamed text is a preview; a repair clears it, and multilingual generation saves all validated versions together. SQL uses bound values and an empty rule matches nobody. Known semantic gaps remain documented." },
  { title: "Approve a specific revision", description: "A campaign row lock protects the review check. A stale revision is refused, approval keeps the one-time recipient set, and a database trigger makes the approved version immutable. Consent is checked again when sending; recurring runs recompute their audience." },
  { title: "Keep the queue in PostgreSQL", description: "The delivery record is also its durable queue entry, claimed with FOR UPDATE SKIP LOCKED. Queue state, delivery state and attempts commit together, avoiding a database-to-broker dual write. Unique run/recipient/channel keys prevent duplicate rows; a stable idempotency key survives retries. A one-minute lease recovers interrupted work, and claim tokens stop late workers overwriting newer results." },
  { title: "Treat missing answers as uncertain", description: "The mock provider journals accepted keys before replying and replays them after restart. If a call may have succeeded but retries cannot resolve it, the delivery ends as UNKNOWN rather than claiming it failed." },
  { title: "Coordinate every worker", description: "Redis grants permits per channel before delivery claims. A lost limiter window pauses sending for eight seconds. Backoff, credential locks, circuit breakers and stalled-campaign pauses keep provider failures inspectable and recoverable." },
] as const;

export const campaignContracts = [
  { title: "The latest generation owns the result", description: "A model run claims the campaign under a row lock and keeps a generation token. Every save checks that token. A claim abandoned for five minutes can be taken over; output from the older run is then discarded. Content revision checks also stop a stale page from silently overwriting another edit.", source: "docs/state-machines.md#writing-claim" },
  { title: "Approval keeps its own design", description: "Templates are JSON block documents rendered by Go's html/template, with an unsubscribe footer that the editor cannot remove. A campaign takes its own design copy; editing the library template cannot alter it. Approval records the design name and a hash of its appearance alongside the reviewed content.", source: "DECISIONS.md#templates-are-documents-of-blocks-drawn-by-our-own-renderer" },
  { title: "Each run has its own history", description: "A campaign version holds the approved words and rule; a run represents one send. One-time sends use the approved recipient set. Recurring runs evaluate the frozen rule again and apply the schedule's re-entry choice: new recipients only, a minimum gap, or everyone who matches. A finished run keeps final counts for later reporting.", source: "DECISIONS.md#scheduling-repeats-a-campaign-and-the-schedule-says-who-may-get-it-again" },
  { title: "Transitions leave an audit record", description: "Status changes, related rows and the audit event commit in one transaction. PostgreSQL supplies the clock for leases and stalled campaigns. The API and workers can restart independently; a reconnected browser reads the durable state and resumes progress updates rather than reconstructing a send from browser memory.", source: "docs/state-machines.md#the-rules-every-machine-follows" },
] as const;

export const campaignDeepDive = [
  ["Reviewer guide", "docs/reviewer-guide.md"],
  ["Architecture and data model", "docs/architecture.md"],
  ["State machines", "docs/state-machines.md"],
  ["Campaign sequence diagrams", "docs/flows.md"],
  ["Architecture decisions and trade-offs", "DECISIONS.md"],
  ["Errors and retries", "docs/errors-and-retries.md"],
  ["Current model benchmark", "tests/benchmark/results/2026-11-09-0220-anthropic-claude-haiku-5-5.md"],
  ["Load verification results", "tests/verify/results/2026-11-08-1707-load.md"],
  ["Performance profile and optimization history", "docs/performance.md#optimization-log"],
  ["Security and open items", "docs/security.md"],
  ["Known validation gaps", "tests/benchmark/known_gaps.txt"],
] as const;
