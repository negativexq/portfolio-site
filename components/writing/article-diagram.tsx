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
};

export function ArticleDiagram({ id }: { id: WritingDiagramId }) {
  const Diagram = DIAGRAMS[id];
  return <Diagram />;
}
