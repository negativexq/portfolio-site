import type { ReactNode } from "react";
import type { WritingDiagramId } from "@/lib/writing/diagrams";

type DiagramFrameProps = {
  id: WritingDiagramId;
  title: string;
  description: string;
  caption: string;
  height: number;
  children: ReactNode;
};

type NodeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  lines: readonly string[];
  tone?: "default" | "accent" | "muted" | "stop";
};

function DiagramFrame({ id, title, description, caption, height, children }: DiagramFrameProps) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return (
    <figure className="article-diagram">
      <div
        className="article-diagram-scroll"
        role="region"
        aria-label={`${title}. Scroll horizontally if the diagram is wider than the page.`}
        tabIndex={0}
      >
        <svg
          className="article-diagram-canvas"
          viewBox={`0 0 880 ${height}`}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{title}</title>
          <desc id={descriptionId}>{description}</desc>
          {children}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path className="diagram-arrow-head" d="M 0 0 L 8 4 L 0 8 z" />
      </marker>
    </defs>
  );
}

function Node({ x, y, width, height, lines, tone = "default" }: NodeProps) {
  const lineHeight = 17;
  const firstY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2 + 4;
  return (
    <g>
      <rect className={`diagram-node diagram-node--${tone}`} x={x} y={y} width={width} height={height} rx="8" />
      <text className="diagram-node-text" x={x + width / 2} y={firstY} textAnchor="middle">
        {lines.map((line, index) => (
          <tspan x={x + width / 2} dy={index === 0 ? 0 : lineHeight} key={line}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

function Arrow({
  d,
  marker,
  dashed = false,
}: {
  d: string;
  marker: string;
  dashed?: boolean;
}) {
  return <path className={`diagram-arrow${dashed ? " diagram-arrow--dashed" : ""}`} d={d} markerEnd={`url(#${marker})`} />;
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return <text className="diagram-label" x={x} y={y} textAnchor={anchor}>{children}</text>;
}

function KafkaIdempotencyDiagram() {
  const marker = "kafka-idempotency-arrow";
  return (
    <DiagramFrame
      id="kafka-idempotency-flow"
      title="Kafka processing and durable duplicate recovery"
      description="A Kafka record passes validation, a token-checked Redis lease, and one PostgreSQL transaction before Redis completion and a contiguous offset commit. If PostgreSQL commits but completion or offset handling fails, redelivery checks the durable processed-events ledger and skips the repeated business effect."
      caption="PostgreSQL is the durable idempotency boundary. Redis coordinates active work, while Kafka offsets advance only across contiguous terminal records."
      height={430}
    >
      <ArrowMarker id={marker} />
      <Label x={28} y={30} anchor="start">NORMAL PROCESSING</Label>
      <Node x={28} y={54} width={86} height={62} lines={["Kafka", "record"]} />
      <Node x={130} y={54} width={102} height={62} lines={["Consumer", "processor"]} />
      <Node x={248} y={54} width={102} height={62} lines={["Validate", "envelope"]} />
      <Node x={366} y={54} width={112} height={62} lines={["Redis lease", "event_id + token"]} tone="muted" />
      <rect className="diagram-boundary" x={494} y={38} width={146} height={94} rx="10" />
      <Label x={506} y={56} anchor="start">POSTGRESQL TX</Label>
      <Node x={506} y={68} width={122} height={48} lines={["event ledger", "+ effects"]} tone="accent" />
      <Node x={656} y={54} width={96} height={62} lines={["Redis", "complete"]} />
      <Node x={768} y={54} width={84} height={62} lines={["Offset", "tracker"]} />
      <Arrow d="M114 85 H123" marker={marker} />
      <Arrow d="M232 85 H241" marker={marker} />
      <Arrow d="M350 85 H359" marker={marker} />
      <Arrow d="M478 85 H487" marker={marker} />
      <Arrow d="M640 85 H649" marker={marker} />
      <Arrow d="M752 85 H761" marker={marker} />
      <Arrow d="M810 116 V150" marker={marker} />
      <Label x={810} y={169}>commit next contiguous Kafka offset</Label>

      <line className="diagram-divider" x1="28" y1="200" x2="852" y2="200" />
      <Label x={28} y={232} anchor="start">COMMIT-BEFORE-COMPLETION RECOVERY</Label>
      <Node x={28} y={256} width={144} height={68} lines={["PostgreSQL", "work committed"]} tone="accent" />
      <Node x={204} y={256} width={144} height={68} lines={["Redis completion", "or offset fails"]} tone="stop" />
      <Node x={380} y={256} width={126} height={68} lines={["Kafka", "redelivers"]} />
      <Node x={538} y={256} width={144} height={68} lines={["Ledger finds", "same event + hash"]} tone="accent" />
      <Node x={714} y={256} width={138} height={68} lines={["Skip effect", "repair + commit"]} tone="accent" />
      <Arrow d="M172 290 H197" marker={marker} />
      <Arrow d="M348 290 H373" marker={marker} dashed />
      <Arrow d="M506 290 H531" marker={marker} />
      <Arrow d="M682 290 H707" marker={marker} />
      <path className="diagram-failure-mark" d="M270 334 l10 10 m0 -10 l-10 10" />
      <Label x={278} y={368}>offset remains uncommitted</Label>
      <rect className="diagram-result" x={196} y={390} width={488} height={28} rx="6" />
      <text className="diagram-result-text" x={440} y={409} textAnchor="middle">Redelivery repeats processing, not the durable side effect.</text>
    </DiagramFrame>
  );
}

function TransactionalOutboxDiagram() {
  const marker = "transactional-outbox-arrow";
  return (
    <DiagramFrame
      id="transactional-outbox-flow"
      title="Transactional outbox atomic and external boundaries"
      description="A PostgreSQL transaction commits fraud business state and a pending outbox row together. A separate publisher claims the row, publishes the stored event to Kafka, and then marks the row published. A crash after Kafka delivery but before the status update causes the claim lease to expire and the same deterministic event to be published again."
      caption="Business state and publication intent share one PostgreSQL commit. Kafka delivery remains an external, at-least-once boundary."
      height={470}
    >
      <ArrowMarker id={marker} />
      <rect className="diagram-boundary diagram-boundary--accent" x={28} y={42} width={312} height={166} rx="10" />
      <Label x={44} y={64} anchor="start">SAFE ATOMIC BOUNDARY · POSTGRESQL</Label>
      <Node x={48} y={82} width={126} height={72} lines={["Fraud state", "evaluation + alert"]} tone="accent" />
      <Node x={194} y={82} width={126} height={72} lines={["Outbox row", "PENDING + bytes"]} tone="accent" />
      <line className="diagram-link" x1="174" y1="118" x2="194" y2="118" />
      <text className="diagram-result-text" x={184} y={184} textAnchor="middle">one commit, or neither row survives</text>

      <Node x={392} y={82} width={164} height={72} lines={["Outbox publisher", "claim: PUBLISHING", "+ token"]} tone="muted" />
      <Arrow d="M340 118 H385" marker={marker} />
      <Label x={366} y={105}>SKIP LOCKED</Label>

      <line className="diagram-external-boundary" x1="590" y1="28" x2="590" y2="222" />
      <Label x={602} y={48} anchor="start">EXTERNAL BOUNDARY</Label>
      <Node x={632} y={82} width={190} height={72} lines={["Kafka publish", "idempotent producer", "acks=all"]} />
      <Arrow d="M556 118 H625" marker={marker} />

      <Node x={392} y={286} width={164} height={68} lines={["Status update", "PUBLISHED"]} tone="accent" />
      <Arrow d="M727 154 V244 H563 V286" marker={marker} />
      <Label x={680} y={236}>confirmed delivery</Label>

      <path className="diagram-failure-mark" d="M578 236 l12 12 m0 -12 l-12 12" />
      <Node x={632} y={286} width={190} height={68} lines={["Crash window", "publish succeeded", "status not committed"]} tone="stop" />
      <Arrow d="M727 154 V279" marker={marker} dashed />
      <Node x={632} y={390} width={190} height={56} lines={["Claim TTL expires", "republish same event_id"]} tone="muted" />
      <Arrow d="M727 354 V383" marker={marker} dashed />
      <Arrow d="M632 418 H590 V118 H625" marker={marker} dashed />
      <Label x={392} y={414} anchor="start">Consumer idempotency still required</Label>
    </DiagramFrame>
  );
}

function AgentTrustBoundaryDiagram() {
  const marker = "agent-trust-arrow";
  return (
    <DiagramFrame
      id="agent-trust-boundary"
      title="Agent text and execution trust boundaries"
      description="User input, retrieved knowledge, and memory can influence the model proposal. Deterministic software then grounds explicit targets in the current message, compiles a typed tool request, evaluates policy against authenticated scope, and routes confirmation or human escalation before privileged tool execution."
      caption="Text can shape a proposal, but it cannot grant execution authority. Authenticated scope, grounding, policy, and revalidation remain server-owned."
      height={500}
    >
      <ArrowMarker id={marker} />
      <rect className="diagram-zone diagram-zone--untrusted" x={28} y={36} width={824} height={126} rx="10" />
      <Label x={44} y={58} anchor="start">UNTRUSTED CONTENT</Label>
      <Node x={54} y={78} width={156} height={58} lines={["Current user message", "target evidence only"]} />
      <Node x={242} y={78} width={156} height={58} lines={["RAG context", "answer evidence only"]} />
      <Node x={430} y={78} width={156} height={58} lines={["Memory", "context only"]} />
      <Node x={660} y={78} width={166} height={58} lines={["LLM", "structured proposal"]} tone="muted" />
      <Arrow d="M210 107 H653" marker={marker} />
      <Arrow d="M398 107 H653" marker={marker} />
      <Arrow d="M586 107 H653" marker={marker} />

      <rect className="diagram-zone" x={28} y={194} width={824} height={194} rx="10" />
      <Label x={44} y={216} anchor="start">SERVER-OWNED CONTROL PLANE</Label>
      <Node x={54} y={242} width={168} height={72} lines={["Semantic grounding", "current-message IDs", "+ target admissibility"]} tone="accent" />
      <Node x={254} y={242} width={150} height={72} lines={["Typed compiler", "+ tool validation"]} tone="accent" />
      <Node x={436} y={242} width={150} height={72} lines={["Policy", "authenticated scope"]} tone="accent" />
      <Node x={618} y={230} width={204} height={96} lines={["Confirmation path", "PendingAction + action_id", "TTL + ownership check", "business revalidation"]} tone="accent" />
      <Arrow d="M743 136 V182 H138 V235" marker={marker} />
      <Arrow d="M222 278 H247" marker={marker} />
      <Arrow d="M404 278 H429" marker={marker} />
      <Arrow d="M586 278 H611" marker={marker} />
      <Label x={510} y={340}>deny stops here · require_human takes the dedicated path</Label>

      <line className="diagram-external-boundary" x1="28" y1="414" x2="852" y2="414" />
      <Label x={44} y={438} anchor="start">PRIVILEGED EXECUTION BOUNDARY</Label>
      <Node x={330} y={442} width={220} height={42} lines={["Registered tool execution"]} tone="accent" />
      <Arrow d="M511 314 V435" marker={marker} />
      <Label x={520} y={392} anchor="start">allow</Label>
      <Arrow d="M720 326 V404 H558 V462" marker={marker} />
      <Label x={622} y={398}>confirmed + revalidated</Label>
    </DiagramFrame>
  );
}

function RagCitationDiagram() {
  const marker = "rag-citation-arrow";
  return (
    <DiagramFrame
      id="rag-citation-pipeline"
      title="RAG retrieval and citation integrity pipeline"
      description="A query enters dense and lexical retrieval, backend-specific fusion, optional reranking, duplicate-content removal, bounded context construction, and grounded answer generation. A separate offline evaluation checks that each citation belongs to retrieved evidence and retains a source. It does not test sentence-level entailment or citation completeness."
      caption="The implemented check covers citation membership and source identity. It does not score entailment, completeness, or retrieval recall."
      height={500}
    >
      <ArrowMarker id={marker} />
      <Node x={28} y={54} width={92} height={58} lines={["Query"]} />
      <Node x={158} y={28} width={132} height={50} lines={["Dense retrieval"]} />
      <Node x={158} y={92} width={132} height={50} lines={["Lexical retrieval", "BM25 locally"]} />
      <Node x={328} y={54} width={132} height={58} lines={["Backend-specific", "fusion"]} tone="muted" />
      <Node x={498} y={54} width={126} height={58} lines={["Optional", "reranking"]} />
      <Node x={662} y={42} width={190} height={82} lines={["Context construction", "deduplicate content", "max 4 chunks"]} tone="accent" />
      <Arrow d="M120 83 H148 V53 H151" marker={marker} />
      <Arrow d="M120 83 H148 V117 H151" marker={marker} />
      <Arrow d="M290 53 H310 V83 H321" marker={marker} />
      <Arrow d="M290 117 H310 V83 H321" marker={marker} />
      <Arrow d="M460 83 H491" marker={marker} />
      <Arrow d="M624 83 H655" marker={marker} />

      <Node x={154} y={188} width={208} height={72} lines={["Grounded answer", "+ citation objects", "from selected context"]} tone="accent" />
      <Node x={518} y={188} width={208} height={72} lines={["Response", "answer + citations"]} />
      <Arrow d="M757 124 V164 H258 V181" marker={marker} />
      <Arrow d="M362 224 H511" marker={marker} />

      <Node x={336} y={282} width={208} height={58} lines={["Offline citation_integrity", "membership + source"]} tone="muted" />
      <Arrow d="M258 260 V311 H329" marker={marker} dashed />

      <rect className="diagram-zone" x={28} y={362} width={394} height={120} rx="10" />
      <Label x={44} y={386} anchor="start">CURRENTLY VALIDATED</Label>
      <text className="diagram-list" x={54} y={418}>
        <tspan x="54">• cited chunk was retrieved</tspan>
        <tspan x="54" dy="26">• citation retains source identity</tspan>
        <tspan x="54" dy="26">• failure paths do not fabricate citations</tspan>
      </text>
      <rect className="diagram-zone diagram-zone--muted" x={458} y={362} width={394} height={120} rx="10" />
      <Label x={474} y={386} anchor="start">NOT CLAIMED BY THIS METRIC</Label>
      <text className="diagram-list" x={484} y={418}>
        <tspan x="484">• sentence-level entailment</tspan>
        <tspan x="484" dy="26">• complete citations for every factual claim</tspan>
        <tspan x="484" dy="26">• retrieval found the best source</tspan>
      </text>
    </DiagramFrame>
  );
}

function AgentPolicyDiagram() {
  const marker = "agent-policy-arrow";
  return (
    <DiagramFrame
      id="agent-policy-flow"
      title="Deterministic policy outcomes before agent tool execution"
      description="A typed tool proposal passes registry, schema, and customer-scope validation before policy returns allow, deny, require confirmation, or require human. Confirmation creates a scoped pending action with an action ID and TTL, then revalidates stored arguments and current business state before execution. Audit records the lifecycle but does not authorize it."
      caption="The model proposes an action. Deterministic policy chooses the path, and only validated paths can cross into tool execution."
      height={520}
    >
      <ArrowMarker id={marker} />
      <Node x={28} y={48} width={154} height={68} lines={["Typed proposal", "tool + arguments"]} />
      <Node x={220} y={48} width={174} height={68} lines={["Registry + schema", "+ customer scope"]} tone="accent" />
      <Node x={432} y={48} width={150} height={68} lines={["Policy engine", "server-owned risk"]} tone="accent" />
      <Arrow d="M182 82 H213" marker={marker} />
      <Arrow d="M394 82 H425" marker={marker} />

      <Node x={636} y={24} width={188} height={48} lines={["allow"]} tone="accent" />
      <Node x={636} y={88} width={188} height={48} lines={["deny → stop"]} tone="stop" />
      <Node x={636} y={152} width={188} height={48} lines={["require_confirmation"]} tone="muted" />
      <Node x={636} y={216} width={188} height={48} lines={["require_human"]} tone="muted" />
      <Arrow d="M582 82 H610 V48 H629" marker={marker} />
      <Arrow d="M582 82 H610 V112 H629" marker={marker} />
      <Arrow d="M582 82 H610 V176 H629" marker={marker} />
      <Arrow d="M582 82 H610 V240 H629" marker={marker} />

      <Node x={360} y={298} width={186} height={72} lines={["PendingAction", "action_id + arguments", "scope + 300s TTL"]} tone="accent" />
      <Node x={574} y={298} width={154} height={72} lines={["Confirmation", "ownership + status"]} />
      <Arrow d="M730 200 V284 H453 V291" marker={marker} />
      <Arrow d="M546 334 H567" marker={marker} />

      <Node x={360} y={414} width={186} height={64} lines={["Revalidation", "schema + current state"]} tone="accent" />
      <line className="diagram-external-boundary" x1="558" y1="394" x2="558" y2="502" />
      <Label x={568} y={408} anchor="start">PRIVILEGED BOUNDARY</Label>
      <Node x={584} y={414} width={144} height={64} lines={["Tool execution", "idempotent writes"]} tone="accent" />
      <Node x={748} y={414} width={104} height={64} lines={["Dedicated", "human path"]} tone="muted" />
      <Arrow d="M651 370 V398 H564 V446 H553" marker={marker} />
      <Arrow d="M546 446 H577" marker={marker} />
      <Arrow d="M824 48 H862 V446 H735" marker={marker} />
      <Arrow d="M824 240 H870 V446 H859" marker={marker} />

      <rect className="diagram-audit-rail" x={28} y={298} width={300} height={180} rx="10" />
      <Label x={46} y={334} anchor="start">AUDIT TRAIL · EVIDENCE, NOT AUTHORITY</Label>
      <text className="diagram-list" x={52} y={370}>
        <tspan x="52">policy decision</tspan>
        <tspan x="52" dy="27">confirmation result</tspan>
        <tspan x="52" dy="27">revalidation outcome</tspan>
        <tspan x="52" dy="27">execution attempt and result</tspan>
      </text>
    </DiagramFrame>
  );
}

function CommerceProcessingLifecycleDiagram() {
  const marker = "commerce-lifecycle-arrow";
  return (
    <DiagramFrame
      id="commerce-processing-lifecycle"
      title="Commerce event processing lifecycle"
      description="A Kafka record is polled and validated, then reserved with a token-checked Redis lease. One PostgreSQL transaction writes the processed-events ledger, applies the business change, builds and evaluates fraud context when applicable, and records any outbox publication intent. After commit, Redis is marked complete and the offset tracker may commit the next contiguous Kafka offset."
      caption="Redis coordinates active work. PostgreSQL owns durable correctness, and each source event has one database transaction before its Kafka offset becomes safe."
      height={600}
    >
      <ArrowMarker id={marker} />
      <Label x={28} y={30} anchor="start">SOURCE AND COORDINATION</Label>
      <Node x={28} y={52} width={112} height={58} lines={["Kafka", "record"]} />
      <Node x={166} y={52} width={112} height={58} lines={["Consumer", "poll"]} />
      <Node x={304} y={52} width={112} height={58} lines={["Validate", "envelope"]} />
      <Node x={442} y={44} width={180} height={74} lines={["Redis reserve", "event_id + token", "bounded lease"]} tone="muted" />
      <Node x={676} y={52} width={176} height={58} lines={["MessageProcessor", "bounded retry"]} />
      <Arrow d="M140 81 H159" marker={marker} />
      <Arrow d="M278 81 H297" marker={marker} />
      <Arrow d="M416 81 H435" marker={marker} />
      <Arrow d="M622 81 H669" marker={marker} />

      <rect className="diagram-boundary diagram-boundary--accent" x={28} y={160} width={824} height={268} rx="10" />
      <Label x={44} y={184} anchor="start">ONE POSTGRESQL TRANSACTION · COMMIT ALL OR ROLLBACK ALL</Label>
      <Node x={52} y={214} width={168} height={66} lines={["processed_events", "identity + digest", "durable replay guard"]} tone="accent" />
      <Node x={254} y={214} width={168} height={66} lines={["Business write", "dependency checks", "+ row locks"]} tone="accent" />
      <Node x={456} y={202} width={168} height={90} lines={["Fraud context", "bounded reads", "evaluation", "when eligible"]} />
      <Node x={658} y={202} width={170} height={90} lines={["Fraud persistence", "alert + outbox row", "when REVIEW/BLOCK"]} tone="accent" />
      <Arrow d="M220 247 H247" marker={marker} />
      <Arrow d="M422 247 H449" marker={marker} />
      <Arrow d="M624 247 H651" marker={marker} />
      <Node x={342} y={342} width={196} height={54} lines={["PostgreSQL COMMIT"]} tone="accent" />
      <Arrow d="M743 292 V320 H440 V335" marker={marker} />
      <Label x={440} y={414}>retry reruns this transaction; rollback leaves no durable effect</Label>
      <Arrow d="M764 110 V146 H132 V207" marker={marker} />

      <Label x={28} y={468} anchor="start">POST-COMMIT SAFETY</Label>
      <Node x={76} y={490} width={190} height={68} lines={["Redis complete", "token must still match"]} tone="muted" />
      <Node x={344} y={490} width={190} height={68} lines={["OffsetCommitTracker", "contiguous safe offsets"]} />
      <Node x={612} y={490} width={190} height={68} lines={["Kafka offset commit", "batched by size/time"]} tone="accent" />
      <Arrow d="M440 396 V458 H171 V483" marker={marker} />
      <Arrow d="M266 524 H337" marker={marker} />
      <Arrow d="M534 524 H605" marker={marker} />
      <rect className="diagram-result" x={196} y={574} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={590} textAnchor="middle">A replay may repeat control flow, but not the committed business effect.</text>
    </DiagramFrame>
  );
}

function ModelPromotionControlLoopDiagram() {
  const marker = "model-promotion-arrow";
  return (
    <DiagramFrame
      id="model-promotion-control-loop"
      title="Policy-driven model promotion control loop"
      description="Client traffic is split by a weighted router between a stable version and a canary. Predictions are tagged with a prediction_id, and ground-truth labels that arrive later are joined at read time. The policy engine evaluates two separate windows: reliability over the freshest traffic and quality over older matured traffic. Their verdict follows a strict FAIL over INCONCLUSIVE over PASS ordering, which decides whether the rollout advances, promotes, rolls back, or holds for more evidence. A state change commits the desired allocation in the database, and a reconcile tick repairs any drift between that desired state and the router's observed revision."
      caption="The database owns the desired allocation; the router only holds an observed revision. Evidence decides the rollout, and reconciliation — not a queue — closes the gap between intent and what is actually being served."
      height={670}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">TRAFFIC AND SERVING</Label>
      <Node x={28} y={52} width={104} height={58} lines={["Client", "traffic"]} />
      <Node x={156} y={44} width={150} height={74} lines={["Weighted router", "observed revision"]} tone="muted" />
      <Node x={330} y={36} width={132} height={48} lines={["Stable vN"]} />
      <Node x={330} y={92} width={132} height={48} lines={["Canary vN+1"]} tone="accent" />
      <Node
        x={496}
        y={44}
        width={356}
        height={74}
        lines={["prediction_id tagged metrics", "labels arrive later, joined at read time"]}
      />
      <Arrow d="M132 81 H149" marker={marker} />
      <Arrow d="M306 72 H316 V60 H323" marker={marker} />
      <Arrow d="M306 90 H316 V116 H323" marker={marker} />
      <Arrow d="M462 60 H479 V81 H489" marker={marker} />
      <Arrow d="M462 116 H479 V81 H489" marker={marker} />
      <Arrow d="M674 118 V153" marker={marker} />

      <rect className="diagram-boundary diagram-boundary--accent" x={28} y={160} width={824} height={250} rx="10" />
      <Label x={44} y={184} anchor="start">POLICY EVALUATION · TWO WINDOWS, ONE VERDICT</Label>
      <Node
        x={52}
        y={200}
        width={300}
        height={70}
        lines={["Reliability · freshest traffic", "min requests · p95 · error rate"]}
      />
      <Node
        x={52}
        y={286}
        width={300}
        height={70}
        lines={["Quality · matured traffic", "labels · coverage · positives · recall"]}
      />
      <Node
        x={470}
        y={236}
        width={250}
        height={84}
        lines={["Verdict ordering", "FAIL > INCONCLUSIVE > PASS"]}
        tone="accent"
      />
      <Arrow d="M352 235 H420 V278" marker={marker} />
      <Arrow d="M352 321 H420 V278" marker={marker} />
      <Arrow d="M420 278 H463" marker={marker} />
      <rect className="diagram-result" x={52} y={372} width={392} height={22} rx="6" />
      <text className="diagram-result-text" x={248} y={388} textAnchor="middle">
        INCONCLUSIVE cannot be outvoted by PASS.
      </text>

      <Label x={28} y={446} anchor="start">CONTROL ACTIONS · WORKER OR OPERATOR, SAME API</Label>
      <Arrow d="M595 320 V434" marker={marker} />
      <Node x={28} y={462} width={200} height={64} lines={["advance", "10 → 25 → 50 → 100%"]} />
      <Node x={248} y={462} width={136} height={64} lines={["promote"]} tone="accent" />
      <Node x={404} y={462} width={136} height={64} lines={["roll back"]} tone="stop" />
      <Node x={560} y={462} width={196} height={64} lines={["hold", "insufficient evidence"]} tone="muted" />
      <Arrow d="M128 440 V456" marker={marker} />
      <Arrow d="M316 440 V456" marker={marker} />
      <Arrow d="M472 440 V456" marker={marker} />
      <Arrow d="M658 440 V456" marker={marker} />

      <Node
        x={250}
        y={556}
        width={340}
        height={58}
        lines={["Desired allocation committed in database"]}
        tone="accent"
      />
      <Arrow d="M128 526 V540 H420 V550" marker={marker} />
      <Arrow d="M316 526 V540" marker={marker} />
      <Arrow d="M472 526 V540 H420" marker={marker} />
      <Arrow d="M658 526 V548" marker={marker} dashed />
      <Label x={658} y={572}>no state change</Label>

      <Arrow d="M250 585 H14 V146 H231 V121" marker={marker} />
      <Label x={14} y={644} anchor="start">
        reconcile tick compares desired allocation with the router&apos;s observed revision and repairs drift
      </Label>
    </DiagramFrame>
  );
}

function ConfirmationLifecycleDiagram() {
  const marker = "confirmation-lifecycle-arrow";
  return (
    <DiagramFrame
      id="confirmation-lifecycle"
      title="Pending action lifecycle from proposal to a single execution"
      description="A model proposal creates no business effect. The server compiles a pending action that owns the customer scope, typed arguments, policy result and TTL, then waits at a confirmation boundary. An incoming turn is classified rather than read as a boolean: an interruption suspends the workflow while leaving the pending action unchanged, a replacement supersedes it so it can never execute silently, and only an affirmation resumes it. Resume returns to the boundary instead of skipping it, revalidation re-checks actor, scope, conversation, arguments, policy, live state and expiry, and a stable action identity keeps the committed effect to one."
      caption="The confirmation binds to one server-owned action, not to the last message. A state transition does not grant authority by itself."
      height={680}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">PENDING ACTION LIFECYCLE</Label>
      <Node x={28} y={52} width={200} height={62} lines={["proposed", "model intent · no effect"]} />
      <Arrow d="M128 114 V144" marker={marker} />
      <Node
        x={28}
        y={150}
        width={260}
        height={76}
        lines={["confirmation_required", "server-owned action id, scope,", "typed args, policy, TTL"]}
        tone="accent"
      />
      <Arrow d="M288 188 H333" marker={marker} />
      <Label x={465} y={140}>&quot;Yes, but first...&quot; is not approval</Label>
      <Node
        x={340}
        y={150}
        width={250}
        height={76}
        lines={["Incoming turn classified", "not a boolean"]}
        tone="accent"
      />

      <Arrow d="M465 226 V270" marker={marker} />
      <Arrow d="M135 270 H738" marker={marker} />
      <Arrow d="M135 270 V294" marker={marker} />
      <Arrow d="M390 270 V294" marker={marker} />
      <Arrow d="M738 270 V294" marker={marker} />

      <Node
        x={28}
        y={300}
        width={214}
        height={76}
        lines={["superseded", "replacement", "never silently executable"]}
        tone="stop"
      />
      <Node
        x={274}
        y={300}
        width={232}
        height={76}
        lines={["suspended", "interruption / question", "pending action unchanged"]}
      />
      <Node
        x={624}
        y={300}
        width={228}
        height={76}
        lines={["resumed", "affirmation", "returns to the boundary"]}
      />
      <Label x={562} y={330}>explicit resume</Label>
      <Arrow d="M506 338 H619" marker={marker} />

      <Arrow d="M738 376 V404 H444 V424" marker={marker} />
      <Node
        x={274}
        y={430}
        width={340}
        height={86}
        lines={["revalidation", "actor · scope · conversation · args", "policy · live state · TTL"]}
        tone="accent"
      />

      <Arrow d="M444 516 V536 H142 V550" marker={marker} />
      <Arrow d="M444 516 V536 H550 V550" marker={marker} />
      <Node x={28} y={556} width={228} height={64} lines={["not admissible", "execution stops"]} tone="stop" />
      <Node
        x={380}
        y={556}
        width={340}
        height={64}
        lines={["executed once", "idempotency receipt, not a flag"]}
        tone="accent"
      />

      <rect className="diagram-result" x={196} y={640} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={656} textAnchor="middle">
        A state transition does not grant authority by itself.
      </text>
    </DiagramFrame>
  );
}

function UnknownWriteOutcomeDiagram() {
  const marker = "unknown-write-arrow";
  return (
    <DiagramFrame
      id="unknown-write-outcome"
      title="Recovering from an unknown write outcome"
      description="A confirmed action carries a stable action identity into execution. The caller observes one of three things: a normal response, an explicit failure that committed nothing, or a timeout that proves nothing about what the database did. That third case is an unknown outcome. Retrying it blindly under a new identity is indistinguishable from a fresh request, so recovery instead reconciles under the same action identity using the idempotency receipt and database constraints. Reconciliation alone is not permission: revalidation still re-checks actor, scope, target, policy, confirmation binding and current business state, and the result is one of three distinct states rather than a single retry path."
      caption="An exception describes what the caller observed. A receipt, a current-state check and a stable action identity describe what actually happened."
      height={700}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">AN EXCEPTION IS NOT A TRANSACTION RESULT</Label>
      <Node x={28} y={52} width={196} height={72} lines={["Confirmed action", "stable action_id"]} tone="accent" />
      <Node x={272} y={52} width={176} height={72} lines={["Execution attempt"]} />
      <Node
        x={496}
        y={52}
        width={176}
        height={72}
        lines={["PostgreSQL", "the commit may", "already have happened"]}
        tone="accent"
      />
      <Arrow d="M224 88 H267" marker={marker} />
      <Arrow d="M448 88 H491" marker={marker} />

      <Arrow d="M360 124 V154" marker={marker} />
      <Arrow d="M153 154 H722" marker={marker} />
      <Arrow d="M153 154 V174" marker={marker} />
      <Arrow d="M435 154 V174" marker={marker} />
      <Arrow d="M722 154 V174" marker={marker} />
      <Node x={28} y={180} width={250} height={72} lines={["normal response", "receipt recorded"]} />
      <Node
        x={310}
        y={180}
        width={250}
        height={72}
        lines={["explicit failure", "no effect committed", "safe to retry"]}
      />
      <Node
        x={592}
        y={180}
        width={260}
        height={72}
        lines={["timeout / connection lost", "UNKNOWN outcome"]}
        tone="muted"
      />

      <Label x={28} y={272} anchor="start">RECOVERING FROM AN UNKNOWN OUTCOME</Label>
      <Arrow d="M722 252 V288" marker={marker} />
      <Arrow d="M178 288 H722" marker={marker} />
      <Arrow d="M178 288 V306" marker={marker} dashed />
      <Arrow d="M616 288 V306" marker={marker} />
      <Node
        x={28}
        y={312}
        width={300}
        height={76}
        lines={["blind retry with a new identity", "indistinguishable from", "a new refund"]}
        tone="stop"
      />
      <Node
        x={380}
        y={312}
        width={472}
        height={76}
        lines={["reconcile under the same action identity", "idempotency receipt + database constraints"]}
        tone="accent"
      />
      <path className="diagram-failure-mark" d="M173 396 l10 10 m0 -10 l-10 10" />
      <Label x={178} y={422}>a second business effect</Label>

      <Arrow d="M616 388 V410 H500 V428" marker={marker} />
      <Node
        x={310}
        y={434}
        width={380}
        height={80}
        lines={["revalidation", "actor · scope · target · policy", "confirmation binding · live state"]}
        tone="accent"
      />

      <Arrow d="M500 514 V540" marker={marker} />
      <Arrow d="M158 540 H722" marker={marker} />
      <Arrow d="M158 540 V558" marker={marker} />
      <Arrow d="M440 540 V558" marker={marker} />
      <Arrow d="M722 540 V558" marker={marker} />
      <Node x={28} y={564} width={260} height={70} lines={["already applied", "return the existing receipt"]} tone="accent" />
      <Node x={310} y={564} width={260} height={70} lines={["safe to continue", "execute exactly once"]} tone="accent" />
      <Node x={592} y={564} width={260} height={70} lines={["cannot continue", "needs a fresh decision"]} tone="muted" />

      <rect className="diagram-result" x={196} y={658} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={674} textAnchor="middle">
        Collapsing these into one retry path hides the risk.
      </text>
    </DiagramFrame>
  );
}

function DecisionAuthorityExecutionDiagram() {
  const marker = "decision-authority-arrow";
  return (
    <DiagramFrame
      id="decision-authority-execution"
      title="Decision, authority and execution as separate operator facts"
      description="A consequential agent request produces three facts that must stay separate: what the control plane decided, whether authority existed at that point, and what reached business state. Shared request, workflow, pending action and trace identifiers correlate them. Three cases that produce a similar chat response are operationally different: a decision requiring confirmation with authority not granted and execution not attempted, an allowed and granted action blocked during revalidation, and an allowed and granted action that committed and returned a receipt. Each needs a different operator response. A bounded projection exposes the decision path without exposing raw prompts, hidden reasoning, secrets or raw tool arguments."
      caption="A single status hides which of these happened. Separating decision, authority and execution is what turns a transcript into an operational explanation."
      height={710}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">THREE FACTS, RECORDED SEPARATELY</Label>
      <rect className="diagram-audit-rail" x={28} y={52} width={176} height={214} rx="10" />
      <Label x={44} y={78} anchor="start">CORRELATION</Label>
      <text className="diagram-list" x={44} y={112}>
        <tspan x="44">request_id</tspan>
        <tspan x="44" dy="27">workflow_id</tspan>
        <tspan x="44" dy="27">pending_action_id</tspan>
        <tspan x="44" dy="27">trace context</tspan>
      </text>
      <line className="diagram-link" x1="204" y1="83" x2="231" y2="83" />
      <line className="diagram-link" x1="204" y1="159" x2="231" y2="159" />
      <line className="diagram-link" x1="204" y1="235" x2="231" y2="235" />

      <Node
        x={236}
        y={52}
        width={616}
        height={62}
        lines={["DECISION · what the control plane decided", "proposal, target and validation, policy outcome"]}
      />
      <Node
        x={236}
        y={128}
        width={616}
        height={62}
        lines={["AUTHORITY · whether permission existed", "confirmation bound to this exact pending action"]}
      />
      <Node
        x={236}
        y={204}
        width={616}
        height={62}
        lines={["EXECUTION · what reached business state", "attempt, explicit non-attempt, replay result"]}
      />

      <line className="diagram-divider" x1="28" y1="300" x2="852" y2="300" />
      <Label x={28} y={332} anchor="start">SAME CHAT RESPONSE, THREE DIFFERENT REALITIES</Label>
      <Label x={28} y={360} anchor="start">OPERATOR&apos;S NEXT STEP</Label>
      <Label x={324} y={360}>DECISION</Label>
      <Label x={532} y={360}>AUTHORITY</Label>
      <Label x={747} y={360}>EXECUTION</Label>

      <Node x={28} y={372} width={186} height={52} lines={["needs a customer", "confirmation"]} tone="muted" />
      <Node x={226} y={372} width={196} height={52} lines={["require_confirmation"]} />
      <Node x={434} y={372} width={196} height={52} lines={["not_granted"]} tone="stop" />
      <Node x={642} y={372} width={210} height={52} lines={["not_attempted"]} tone="stop" />

      <Node x={28} y={436} width={186} height={52} lines={["needs the stale-state", "explanation"]} tone="muted" />
      <Node x={226} y={436} width={196} height={52} lines={["allow"]} />
      <Node x={434} y={436} width={196} height={52} lines={["granted"]} tone="accent" />
      <Node x={642} y={436} width={210} height={52} lines={["blocked by revalidation"]} tone="stop" />

      <Node x={28} y={500} width={186} height={52} lines={["needs the receipt", "and projection"]} tone="muted" />
      <Node x={226} y={500} width={196} height={52} lines={["allow"]} />
      <Node x={434} y={500} width={196} height={52} lines={["granted"]} tone="accent" />
      <Node x={642} y={500} width={210} height={52} lines={["committed, receipt"]} tone="accent" />

      <line className="diagram-divider" x1="28" y1="584" x2="852" y2="584" />
      <Label x={28} y={612} anchor="start">BOUNDED PROJECTION, NOT A TRANSCRIPT ARCHIVE</Label>
      <Node
        x={28}
        y={624}
        width={400}
        height={72}
        lines={["projection shows", "proposal · policy · authority · execution", "citations · trace ids"]}
        tone="accent"
      />
      <Node
        x={452}
        y={624}
        width={400}
        height={72}
        lines={["never exposed", "raw prompts · chain-of-thought", "secrets · raw tool arguments"]}
        tone="stop"
      />
    </DiagramFrame>
  );
}

function AgentEvaluationTracksDiagram() {
  const marker = "agent-evaluation-arrow";
  return (
    <DiagramFrame
      id="agent-evaluation-tracks"
      title="Two evaluation tracks meeting one server-owned boundary"
      description="A deterministic provider supplies a known proposal so language is not the variable, while a real provider supplies variable interpretation across paraphrase, ambiguity and multilingual wording. Both runs pass through the same typed decision and execution boundary, so the deterministic track produces reproducible invariant validation and the real track produces bounded semantic and quality checks. Assertions match the layer, and the cross-layer invariant is that no provider output can bypass scope, policy, confirmation or idempotency. The resulting evidence slices carry different denominators and are reported separately."
      caption="Deterministic tests prove what the control plane must never violate. Real-model tests probe how language reaches it. The two answer different questions and keep different denominators."
      height={730}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">DETERMINISTIC PROVIDER</Label>
      <Label x={472} y={30} anchor="start">REAL PROVIDER</Label>
      <Node x={28} y={52} width={380} height={62} lines={["known proposal", "language is not the variable"]} />
      <Node
        x={472}
        y={52}
        width={380}
        height={62}
        lines={["variable interpretation", "paraphrase · ambiguity · multilingual"]}
        tone="muted"
      />
      <Arrow d="M218 114 V146" marker={marker} />
      <Arrow d="M662 114 V146" marker={marker} />

      <Node
        x={28}
        y={152}
        width={824}
        height={68}
        lines={["SAME TYPED DECISION AND EXECUTION BOUNDARY", "scope · policy · confirmation · revalidation · idempotency"]}
        tone="accent"
      />
      <Arrow d="M218 220 V252" marker={marker} />
      <Arrow d="M662 220 V252" marker={marker} />

      <Node
        x={28}
        y={258}
        width={380}
        height={68}
        lines={["invariant validation", "exact assertions · reproducible regressions"]}
        tone="accent"
      />
      <Node
        x={472}
        y={258}
        width={380}
        height={68}
        lines={["semantic and quality checks", "bounded assertions under a chosen model"]}
        tone="muted"
      />

      <line className="diagram-divider" x1="28" y1="350" x2="852" y2="350" />
      <Label x={28} y={378} anchor="start">ASSERTIONS MATCH THE LAYER</Label>
      <Node
        x={28}
        y={392}
        width={380}
        height={60}
        lines={["deterministic assertion", "mixed confirmation does not execute a refund"]}
      />
      <Node
        x={472}
        y={392}
        width={380}
        height={60}
        lines={["real-LLM quality assertion", "cites evidence, avoids an unsupported claim"]}
      />
      <Node
        x={28}
        y={466}
        width={824}
        height={56}
        lines={["cross-layer invariant: no provider output can bypass", "scope, policy, confirmation or idempotency"]}
        tone="accent"
      />

      <line className="diagram-divider" x1="28" y1="546" x2="852" y2="546" />
      <Label x={28} y={574} anchor="start">EVIDENCE SLICES, DIFFERENT DENOMINATORS</Label>
      <Node
        x={28}
        y={588}
        width={264}
        height={76}
        lines={["100 real-LLM samples", "82 passed · 18 bounded warnings", "0 safety invariant failures"]}
      />
      <Node
        x={308}
        y={588}
        width={264}
        height={76}
        lines={["540 / 540", "measured semantic-safety attempts"]}
        tone="accent"
      />
      <Node
        x={588}
        y={588}
        width={264}
        height={76}
        lines={["18/18 scenarios · 8/8 phases", "6/6 faults · 28/28 resilience"]}
        tone="accent"
      />

      <rect className="diagram-result" x={196} y={690} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={706} textAnchor="middle">
        82/18 is a quality breakdown, not a safety rate.
      </text>
    </DiagramFrame>
  );
}

function FeatureDefinitionLineageDiagram() {
  const marker = "feature-definition-arrow";
  return (
    <DiagramFrame
      id="feature-definition-lineage"
      title="One shared feature definition and what sharing then requires"
      description="When each pipeline rebuilds the same customer feature, the project ends up with several definitions of one thing, no owner, and no signal that they disagree. Defining the feature once as an owned, described and tested model lets training, batch inference and analytics consume the same artifact. Sharing then concentrates risk rather than removing it, so a change to the shared definition needs column lineage that separates directly affected consumers from the full transitive chain, and quality checks that run inside the pipeline instead of surfacing later as a wrong number downstream."
      caption="Copy-paste keeps the blast radius at one. A shared definition is safer only when you can see what a change touches and the checks fail where the work happens."
      height={690}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">WITHOUT A SHARED DEFINITION</Label>
      <Node x={28} y={52} width={260} height={76} lines={["training pipeline", "rebuilds active_customer"]} />
      <Node x={310} y={52} width={260} height={76} lines={["batch inference", "rebuilds active_customer"]} />
      <Node x={592} y={52} width={260} height={76} lines={["analytics model", "rebuilds active_customer"]} />
      <Arrow d="M158 128 V142" marker={marker} />
      <Arrow d="M440 128 V142" marker={marker} />
      <Arrow d="M722 128 V142" marker={marker} />
      <Arrow d="M158 142 H722" marker={marker} />
      <Arrow d="M440 142 V152" marker={marker} />
      <Node
        x={196}
        y={158}
        width={488}
        height={56}
        lines={["three definitions of one feature", "no owner, and no signal that they disagree"]}
        tone="stop"
      />

      <line className="diagram-divider" x1="28" y1="248" x2="852" y2="248" />

      <Label x={28} y={278} anchor="start">ONE DEFINITION, MANY CONSUMERS</Label>
      <Node x={28} y={300} width={200} height={76} lines={["raw sources", "staging models"]} />
      <Node
        x={280}
        y={292}
        width={280}
        height={92}
        lines={["active_customer", "one dbt model", "owner · description · tests"]}
        tone="accent"
      />
      <Arrow d="M228 338 H273" marker={marker} />
      <Node x={612} y={286} width={240} height={44} lines={["model training"]} />
      <Node x={612} y={342} width={240} height={44} lines={["batch inference"]} />
      <Node x={612} y={398} width={240} height={44} lines={["analytics and reporting"]} />
      <Arrow d="M560 338 H586 V308 H605" marker={marker} />
      <Arrow d="M560 338 H586 V364 H605" marker={marker} />
      <Arrow d="M560 338 H586 V420 H605" marker={marker} />

      <line className="diagram-divider" x1="28" y1="476" x2="852" y2="476" />

      <Label x={28} y={506} anchor="start">SHARING CONCENTRATES RISK, SO IT NEEDS TWO THINGS</Label>
      <Node
        x={28}
        y={528}
        width={400}
        height={92}
        lines={["what breaks if this changes?", "column lineage: upstream trace,", "downstream impact, direct vs transitive"]}
        tone="accent"
      />
      <Node
        x={452}
        y={528}
        width={400}
        height={92}
        lines={["fail where the work happens", "expectations run inside the pipeline,", "not as a wrong number downstream"]}
        tone="accent"
      />

      <rect className="diagram-result" x={196} y={650} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={666} textAnchor="middle">
        Lineage gives you blast radius, not a correct definition.
      </text>
    </DiagramFrame>
  );
}

function FeaturePipelineGatesDiagram() {
  const marker = "feature-pipeline-arrow";
  return (
    <DiagramFrame
      id="feature-pipeline-gates"
      title="Where the checks run around a shared feature definition"
      description="One orchestrated DAG builds sources and staging models, then the shared feature models in parallel, and a Great Expectations task gates the data before anything downstream consumes it. A failing expectation fails the run rather than surfacing later as a wrong number. Past that gate, training, batch inference and reporting consume the same feature models, and a Deepchecks validation step gates promotion to serving, so a model regression blocks delivery. On a change to a shared definition, continuous integration rebuilds and tests the affected models while lineage separates directly affected consumers from those that inherit the column transitively."
      caption="Both gates run inside the orchestration, so a regression fails a job at the point of computation instead of a number in a report days later."
      height={620}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">ONE AIRFLOW DAG · BUILD, THEN GATE</Label>
      <Node x={28} y={52} width={142} height={68} lines={["sources"]} />
      <Node x={194} y={52} width={166} height={68} lines={["staging models", "dbt"]} />
      <Node
        x={384}
        y={44}
        width={208}
        height={84}
        lines={["feature models", "dbt, built in parallel", "one definition each"]}
        tone="accent"
      />
      <Node
        x={616}
        y={44}
        width={236}
        height={84}
        lines={["data quality gate", "Great Expectations", "as a DAG task"]}
        tone="accent"
      />
      <Arrow d="M170 86 H189" marker={marker} />
      <Arrow d="M360 86 H379" marker={marker} />
      <Arrow d="M592 86 H611" marker={marker} />
      <Arrow d="M751 128 V146" marker={marker} />
      <Node x={650} y={152} width={202} height={48} lines={["run fails here"]} tone="stop" />

      <Arrow d="M630 128 V214 H146 V248" marker={marker} />
      <Label x={304} y={232} anchor="start">CONSUMERS AND MODEL DELIVERY</Label>
      <Node
        x={28}
        y={254}
        width={236}
        height={84}
        lines={["model training", "batch inference", "marts and reporting"]}
      />
      <Node
        x={304}
        y={254}
        width={236}
        height={84}
        lines={["model validation gate", "Deepchecks", "as a delivery step"]}
        tone="accent"
      />
      <Node
        x={580}
        y={254}
        width={272}
        height={84}
        lines={["promotion to serving", "only past both gates"]}
        tone="accent"
      />
      <Arrow d="M264 296 H299" marker={marker} />
      <Arrow d="M540 296 H575" marker={marker} />
      <Arrow d="M422 338 V356" marker={marker} />
      <Node x={304} y={362} width={236} height={48} lines={["delivery blocked"]} tone="stop" />

      <Label x={28} y={442} anchor="start">ON A CHANGE TO A SHARED DEFINITION</Label>
      <Node
        x={28}
        y={464}
        width={390}
        height={84}
        lines={["CI on the change", "dbt build and tests", "GitHub Actions"]}
      />
      <Node
        x={442}
        y={464}
        width={410}
        height={84}
        lines={["lineage impact review", "which consumers are directly affected,", "which inherit it transitively"]}
        tone="accent"
      />
      <Arrow d="M418 506 H437" marker={marker} />

      <rect className="diagram-result" x={196} y={580} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={596} textAnchor="middle">
        A gate inside the DAG fails a job, not a reader&apos;s trust.
      </text>
    </DiagramFrame>
  );
}

function DagRetrySemanticsDiagram() {
  const marker = "dag-retry-arrow";
  return (
    <DiagramFrame
      id="dag-retry-semantics"
      title="What a retry and a backfill do to work a task already committed"
      description="A retried task runs again from the top; the scheduler does not undo the writes the failed attempt already committed, so the second run lands on top of the first. Whether that is safe depends on the shape of the write: overwriting the window's partition or upserting on a business key produces one effect, while appending, incrementing or notifying has no identity to collide with and duplicates. Backfilling is the same property with a date attached — a task parameterised by its data interval can be rerun for any window, while a task that computes everything since the last run produces output that depends on when it ran rather than which window it was for."
      caption="The schedule says when a DAG runs. The write shape says what happens when it runs again."
      height={660}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">A RETRY IS A REPLAY, NOT AN UNDO</Label>
      <Node x={28} y={52} width={200} height={70} lines={["attempt 1", "writes, then fails"]} />
      <Node x={268} y={52} width={220} height={70} lines={["partial effect", "already durable"]} tone="stop" />
      <Node x={528} y={52} width={150} height={70} lines={["scheduler", "reschedules"]} tone="muted" />
      <Node x={712} y={52} width={140} height={70} lines={["attempt 2", "full task"]} />
      <Arrow d="M228 87 H263" marker={marker} />
      <Arrow d="M488 87 H523" marker={marker} />
      <Arrow d="M678 87 H707" marker={marker} />
      <Arrow d="M782 122 V150 H378 V128" marker={marker} />
      <Label x={580} y={168}>the second run lands on top of the first</Label>

      <line className="diagram-divider" x1="28" y1="210" x2="852" y2="210" />

      <Label x={28} y={240} anchor="start">IF THIS TASK RUNS TWICE, IS THE EFFECT ONCE?</Label>
      <Node
        x={28}
        y={262}
        width={260}
        height={86}
        lines={["overwrite the window", "partition swap or full replace", "one effect"]}
        tone="accent"
      />
      <Node
        x={310}
        y={262}
        width={260}
        height={86}
        lines={["upsert on a business key", "merge or on-conflict", "one effect"]}
        tone="accent"
      />
      <Node
        x={592}
        y={262}
        width={260}
        height={86}
        lines={["append, increment, notify", "no identity to collide with", "duplicated effect"]}
        tone="stop"
      />
      <path className="diagram-failure-mark" d="M717 366 l10 10 m0 -10 l-10 10" />
      <Label x={722} y={400}>the row count grows, and no test calls it wrong</Label>

      <line className="diagram-divider" x1="28" y1="430" x2="852" y2="430" />

      <Label x={28} y={460} anchor="start">BACKFILL IS THE SAME PROPERTY WITH A DATE ATTACHED</Label>
      <Node
        x={28}
        y={482}
        width={400}
        height={86}
        lines={["parameterised by the interval", "data_interval_start / _end", "any window can be rerun"]}
        tone="accent"
      />
      <Node
        x={452}
        y={482}
        width={400}
        height={86}
        lines={["computed from now()", "everything since the last run", "output depends on when it ran"]}
        tone="stop"
      />

      <rect className="diagram-result" x={196} y={610} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={626} textAnchor="middle">
        A green DAG says the tasks ran. It does not say they ran once.
      </text>
    </DiagramFrame>
  );
}

function RerankerTradeoffDiagram() {
  const marker = "reranker-tradeoff-arrow";
  return (
    <DiagramFrame
      id="reranker-tradeoff"
      title="What the reranker benchmark measured and what it costs"
      description="Dense and sparse retrieval are fused by reciprocal rank fusion, tenant ACL is enforced before anything expensive runs, and the cross-encoder reranks twenty candidates down to the five passed to generation. Against a 220-query paired multilingual benchmark, cross-lingual Recall@5 moved from 0.9563 without reranking to 1.0000 with it, and the shape behind that aggregate was 63 rescues and 0 drops — nothing that already worked stopped working. The cost is a total retrieval p95 of 2457.7 ms on the measured local CPU path, and that figure is a single-flight number because the synchronous cross-encoder call is isolated in a thread with its concurrency capped at one."
      caption="The aggregate says the change was positive. Rescues and drops say what it did, and the concurrency cap says what the latency figure actually describes."
      height={600}
    >
      <ArrowMarker id={marker} />

      <Label x={28} y={30} anchor="start">RETRIEVAL PATH · THE RERANKER SEES 20, PASSES 5</Label>
      <Node x={28} y={44} width={210} height={56} lines={["dense · Qwen3 @ 1024"]} />
      <Node x={28} y={108} width={210} height={56} lines={["sparse · Qdrant BM25"]} />
      <Node x={278} y={68} width={150} height={72} lines={["RRF fusion"]} />
      <Arrow d="M238 72 H258 V104 H273" marker={marker} />
      <Arrow d="M238 136 H258 V104 H273" marker={marker} />
      <Node x={468} y={68} width={170} height={72} lines={["tenant ACL", "before reranking"]} tone="accent" />
      <Arrow d="M428 104 H463" marker={marker} />
      <Node
        x={678}
        y={60}
        width={174}
        height={88}
        lines={["BGE reranker v2-m3", "20 candidates in", "5 out"]}
        tone="accent"
      />
      <Arrow d="M638 104 H673" marker={marker} />

      <line className="diagram-divider" x1="28" y1="200" x2="852" y2="200" />

      <Label x={28} y={230} anchor="start">220-QUERY PAIRED BENCHMARK · THE SHAPE, NOT THE AGGREGATE</Label>
      <Node
        x={28}
        y={252}
        width={240}
        height={76}
        lines={["without reranking", "cross-lingual Recall@5", "0.9563"]}
      />
      <Node
        x={306}
        y={252}
        width={240}
        height={76}
        lines={["with reranking", "Recall@5 1.0000", "MRR 0.9558"]}
        tone="accent"
      />
      <Arrow d="M268 290 H301" marker={marker} />
      <Node
        x={584}
        y={252}
        width={268}
        height={76}
        lines={["63 rescues · 0 drops", "nothing that already worked", "stopped working"]}
        tone="accent"
      />
      <Arrow d="M546 290 H579" marker={marker} />

      <line className="diagram-divider" x1="28" y1="364" x2="852" y2="364" />

      <Label x={28} y={394} anchor="start">THE COST IS LATENCY AND CONCURRENCY</Label>
      <Node
        x={28}
        y={416}
        width={400}
        height={86}
        lines={["total retrieval p95 2457.7 ms", "measured local CPU path", "a single-flight number"]}
        tone="stop"
      />
      <Node
        x={452}
        y={416}
        width={400}
        height={86}
        lines={["synchronous cross-encoder", "isolated with asyncio.to_thread()", "concurrency capped at 1"]}
        tone="stop"
      />

      <rect className="diagram-result" x={196} y={544} width={488} height={22} rx="6" />
      <text className="diagram-result-text" x={440} y={560} textAnchor="middle">
        Reported without the concurrency cap, that p95 means one request.
      </text>
    </DiagramFrame>
  );
}

const DIAGRAMS: Record<WritingDiagramId, () => ReactNode> = {
  "kafka-idempotency-flow": KafkaIdempotencyDiagram,
  "transactional-outbox-flow": TransactionalOutboxDiagram,
  "agent-trust-boundary": AgentTrustBoundaryDiagram,
  "rag-citation-pipeline": RagCitationDiagram,
  "agent-policy-flow": AgentPolicyDiagram,
  "commerce-processing-lifecycle": CommerceProcessingLifecycleDiagram,
  "model-promotion-control-loop": ModelPromotionControlLoopDiagram,
  "confirmation-lifecycle": ConfirmationLifecycleDiagram,
  "unknown-write-outcome": UnknownWriteOutcomeDiagram,
  "decision-authority-execution": DecisionAuthorityExecutionDiagram,
  "agent-evaluation-tracks": AgentEvaluationTracksDiagram,
  "feature-definition-lineage": FeatureDefinitionLineageDiagram,
  "feature-pipeline-gates": FeaturePipelineGatesDiagram,
  "dag-retry-semantics": DagRetrySemanticsDiagram,
  "reranker-tradeoff": RerankerTradeoffDiagram,
};

export function ArticleDiagram({ id }: { id: WritingDiagramId }) {
  const Diagram = DIAGRAMS[id];
  return <Diagram />;
}
