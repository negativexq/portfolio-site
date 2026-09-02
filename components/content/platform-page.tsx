"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { useEffect, useRef, useState, type Ref } from "react";
import { MotionController } from "@/components/motion/motion-controller";
import {
  platformArchitectureLayers,
  platformNodes,
  platformStatusDefinitions,
  type PlatformNode,
  type PlatformStatus,
} from "@/data/platform";

const proofNodes = platformNodes.filter((node) =>
  ["knowledge", "agent-runtime", "modelops"].includes(node.id),
);

function statusClass(status: PlatformStatus) {
  return `platform-status platform-status-${status.toLowerCase()}`;
}

function PlatformStatusLabel({ status }: { status: PlatformStatus }) {
  return <span className={statusClass(status)}>{status}</span>;
}

function ExternalLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label} <ArrowUpRight aria-hidden="true" size={13} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ProofCard({ node }: { node: PlatformNode }) {
  return (
    <article className="platform-proof-card" data-reveal data-hover-lift>
      <header className="platform-proof-card-header">
        <div>
          <p className="platform-card-stage">{node.stage} · {node.role}</p>
          <h3>{node.title}</h3>
        </div>
        <PlatformStatusLabel status={node.status} />
      </header>

      <p className="platform-proof-purpose">{node.purpose}</p>

      <div className="platform-proof-decision">
        <p className="platform-proof-label">Engineering decision</p>
        <p>{node.decision}</p>
      </div>

      <div className="platform-proof-evidence">
        <p className="platform-proof-label">Current evidence</p>
        <ul>
          {node.evidence.map((item) => (
            <li key={item}><Check aria-hidden="true" size={14} /> <span>{item}</span></li>
          ))}
        </ul>
      </div>

      <div className="platform-proof-stack">
        <p className="platform-proof-label">Stack / boundaries</p>
        <ul>
          {node.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <nav className="platform-proof-links" aria-label={`${node.title} links`}>
        {node.links.map((link) => <ExternalLink key={link.href} {...link} />)}
        <Link href={`/projects/${node.id === "agent-runtime" ? "agentic-customer-service-platform" : node.id}`}>
          Case study <ArrowRight aria-hidden="true" size={13} />
        </Link>
      </nav>
    </article>
  );
}

function ArchitectureNode({
  node,
  selected,
  onSelect,
}: {
  node: PlatformNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      className={`platform-architecture-node${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      aria-controls="platform-node-detail"
      onClick={() => onSelect(node.id)}
    >
      <span className="platform-node-status">
        {node.showStatus === false ? <span className="platform-resource-label">RUNTIME RESOURCE GROUPING</span> : <PlatformStatusLabel status={node.status} />}
      </span>
      <strong>{node.title}</strong>
      <span>{node.architectureDescription ?? node.role}</span>
    </button>
  );
}

function ModelPoolNode({
  node,
  selected,
  onSelect,
}: {
  node: PlatformNode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const modelClasses = [
    ["General LLMs", "CURRENT", "current"],
    ["Specialist SLMs", "NEXT", "next"],
    ["VLM / Other Models", "FUTURE", "future"],
  ] as const;

  return (
    <button
      className={`platform-model-pool-node${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      aria-controls="platform-node-detail"
      onClick={() => onSelect(node.id)}
    >
      <span className="platform-node-status"><span className="platform-resource-label">RUNTIME RESOURCE GROUPING</span></span>
      <strong>{node.title}</strong>
      <span className="platform-model-pool-copy">Models available to runtime selection</span>
      <span className="platform-model-pool-rows">
        {modelClasses.map(([label, status, statusClassName]) => (
          <span key={label}><b>{label}</b><em className={`platform-model-state platform-model-state-${statusClassName}`}>{status}</em></span>
        ))}
      </span>
    </button>
  );
}

function scrollDetailIntoViewIfNeeded(panel: HTMLElement | null) {
  if (!panel) return;

  const rect = panel.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const panelIsBelowComfortableThreshold = rect.top > viewportHeight * 0.78;
  const panelIsFullyAboveViewport = rect.bottom <= 0;

  if (!panelIsBelowComfortableThreshold && !panelIsFullyAboveViewport) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  panel.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

function PlatformDetailPanel({
  node,
  onClose,
  panelRef,
}: {
  node: PlatformNode | null;
  onClose: () => void;
  panelRef: Ref<HTMLElement>;
}) {
  if (!node) return null;

  return (
    <aside ref={panelRef} className="platform-detail-panel" id="platform-node-detail" aria-live="polite">
      <button className="platform-detail-close" type="button" onClick={onClose} aria-label="Close node details">
        <X aria-hidden="true" size={17} />
      </button>
      <div className="platform-detail-body">
      <div className="platform-detail-heading">
        {node.showStatus === false ? <span className="platform-resource-label">RUNTIME RESOURCE GROUPING</span> : <PlatformStatusLabel status={node.status} />}
        <span>{node.role}</span>
      </div>
      <h3>{node.title}</h3>
      <p className="platform-detail-purpose">{node.purpose}</p>

      {node.details.currentFoundation ? (
        <div className="platform-detail-group">
          <p className="platform-proof-label">Current foundation</p>
          <p>{node.details.currentFoundation}</p>
        </div>
      ) : null}

      {node.details.objective ? (
        <div className="platform-detail-group">
          <p className="platform-proof-label">Core objective</p>
          <p>{node.details.objective}</p>
        </div>
      ) : null}

      <div className="platform-detail-group">
        <p className="platform-proof-label">{node.status === "PROVEN" ? "What it does" : "Current goal"}</p>
        <p>{node.details.currentGoal ?? node.details.why}</p>
      </div>

      <div className="platform-detail-group">
        <p className="platform-proof-label">{node.status === "PROVEN" ? "Key engineering decision" : "Current milestone"}</p>
        <blockquote>{node.decision}</blockquote>
        {node.details.milestone ? <p>{node.details.milestone}</p> : null}
      </div>

      {node.details.flow ? (
        <div className="platform-detail-flow">
          <p className="platform-proof-label">Control flow</p>
          <ol>
            {node.details.flow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {node.details.targetEvolution ? (
        <div className="platform-detail-group platform-detail-evolution">
          <p className="platform-proof-label">Target evolution</p>
          <ul>{node.details.targetEvolution.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}

      {node.details.routingDistinction ? (
        <div className="platform-detail-group platform-detail-distinction">
          <p className="platform-proof-label">Two routing questions</p>
          <div><strong>Capability routing</strong><span>{node.details.routingDistinction.capability}</span></div>
          <div><strong>Model routing</strong><span>{node.details.routingDistinction.model}</span></div>
        </div>
      ) : null}

      {node.evidence.length > 0 ? (
        <div className="platform-detail-group platform-detail-evidence">
          <p className="platform-proof-label">Current evidence</p>
          <ul>
            {node.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}

      {node.status !== "PROVEN" && node.details.nextGate ? (
        <div className="platform-detail-group platform-detail-next-gate">
          <p className="platform-proof-label">Next gate</p>
          <p>{node.details.nextGate}</p>
        </div>
      ) : null}

      <div className="platform-detail-group">
        <p className="platform-proof-label">Stack / scope</p>
        <ul className="platform-detail-tags">
          {node.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      {node.links.length > 0 ? (
        <nav className="platform-detail-links" aria-label={`${node.title} detail links`}>
          {node.links.map((link) => <ExternalLink key={link.href} {...link} />)}
        </nav>
      ) : null}
      </div>
    </aside>
  );
}

export function PlatformPage() {
  const defaultNodeId = "knowledge";
  const [selectedId, setSelectedId] = useState<string | null>(defaultNodeId);
  const detailPanelRef = useRef<HTMLElement | null>(null);
  const selectedNode = platformNodes.find((node) => node.id === selectedId) ?? null;

  const selectNode = (id: string) => {
    setSelectedId(id);
    window.requestAnimationFrame(() => scrollDetailIntoViewIfNeeded(detailPanelRef.current));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="platform-page">
      <MotionController />

      <section className="platform-hero container" aria-labelledby="platform-title">
        <div className="platform-hero-copy">
          <p className="platform-kicker">AI platform architecture / current boundary</p>
          <h1 id="platform-title">Building toward a Governed Enterprise AI Platform</h1>
          <p className="platform-claim-boundary">
            I built these systems independently and tested each one against its own evidence. This page shows the larger architecture I’m evolving them toward.
          </p>
          <p className="platform-hero-description">From trusted organizational knowledge, to structured-data reasoning, to controlled business action.</p>
          <div className="platform-hero-actions">
            <a className="button button-primary" href="#implemented-systems">Read the evidence <ArrowDown aria-hidden="true" size={15} /></a>
            <Link className="button button-secondary" href="/projects">All projects <ArrowRight aria-hidden="true" size={15} /></Link>
          </div>
        </div>
        <div className="platform-hero-index" aria-label="Page sequence">
          <div><span>01</span><strong>Evidence</strong><small>implemented systems first</small></div>
          <div><span>02</span><strong>Architecture</strong><small>relationships earned by evidence</small></div>
          <div><span>03</span><strong>Integration</strong><small>future work stays labeled</small></div>
        </div>
      </section>

      <section className="section-shell platform-architecture-section" aria-labelledby="architecture-heading">
        <div className="container">
          <header className="platform-section-heading" data-reveal>
            <div>
              <p className="eyebrow">WHERE THE SYSTEMS ARE GOING</p>
              <h2 id="architecture-heading">How the systems are evolving together.</h2>
              <p>The proven nodes are existing, independently tested systems. Building and evolving nodes show active work or the direction of integration.</p>
            </div>
          </header>

          <div className="platform-architecture-workspace">
            <div className="platform-graph-board">
              <svg className="platform-graph-connectors" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
                {/* Capability edges are target integrations: the existing
                    repositories do not currently share this router. The
                    cost-aware router → model pool path is the current runtime
                    foundation; lifecycle → pool is promotion direction. */}
                <path className="is-dashed" d="M162 196 V236 H500 V290" />
                <path className="is-dashed" d="M500 196 V290" />
                <path className="is-dashed" d="M838 196 V236 H500 V290" />
                <path className="is-solid" d="M500 400 V465" />
                <path className="is-dashed" d="M500 575 V650" />
              </svg>

              <div className="platform-graph-grid">
                {platformNodes.filter((node) => ["knowledge", "decision-sql", "agent-runtime"].includes(node.id)).map((node) => (
                  <div className="platform-graph-lane" key={node.id}>
                    <span className="platform-lane-label">{node.stage}</span>
                    <p>{node.stage === "KNOW" ? "What does the organization know?" : node.stage === "ACT" ? "What should the system do?" : "What does the structured data tell us?"}</p>
                    <ArchitectureNode node={node} selected={selectedId === node.id} onSelect={selectNode} />
                  </div>
                ))}
                <div className="platform-graph-runtime">
                  <span className="platform-lane-label">SHARED MODEL RUNTIME</span>
                  <ArchitectureNode node={platformNodes.find((node) => node.id === "adaptive-router")!} selected={selectedId === "adaptive-router"} onSelect={selectNode} />
                </div>
                <div className="platform-graph-model-pool">
                  <ModelPoolNode node={platformNodes.find((node) => node.id === "model-pool")!} selected={selectedId === "model-pool"} onSelect={selectNode} />
                </div>
                <div className="platform-graph-lifecycle">
                  <div className="platform-graph-lifecycle-heading">
                    <span className="platform-lane-label">MODEL LIFECYCLE</span>
                    <span className="platform-lifecycle-relation-label">promotion / rollback</span>
                  </div>
                  <div className="platform-graph-lifecycle-nodes">
                    <ArchitectureNode node={platformNodes.find((node) => node.id === "modelops")!} selected={selectedId === "modelops"} onSelect={selectNode} />
                    <ArchitectureNode node={platformNodes.find((node) => node.id === "fineforge")!} selected={selectedId === "fineforge"} onSelect={selectNode} />
                  </div>
                </div>
              </div>

              <div className="platform-graph-legend">
                <span><i className="platform-line-sample is-solid" /> existing relationship / implementation</span>
                <span><i className="platform-line-sample is-dashed" /> target integration</span>
              </div>
            </div>
            <PlatformDetailPanel node={selectedNode} onClose={() => setSelectedId(null)} panelRef={detailPanelRef} />
          </div>

          <details className="platform-full-architecture">
            <summary>
              <span>Expand full architecture</span>
              <span className="platform-full-hint">the target system, with what is built marked</span>
            </summary>
            <div className="platform-full-body">
              <p className="platform-full-intro">
                The graph above shows what exists and how it connects today. This is the architecture
                those systems are being built toward. Every box carries its own status, because
                without that the target reads as though it were already finished.
              </p>
              {platformArchitectureLayers.map((layer) => (
                <section className="platform-full-layer" key={layer.id}>
                  <header>
                    <h3>{layer.band}</h3>
                    {layer.note ? <p>{layer.note}</p> : null}
                  </header>
                  <div className="platform-full-columns">
                    {layer.columns.map((column) => (
                      <article className="platform-full-column" key={column.label}>
                        <div className="platform-full-column-head">
                          <h4>{column.label}</h4>
                          {column.status ? (
                            <span className={`platform-status platform-status-${column.status.toLowerCase()}`}>
                              {column.status}
                            </span>
                          ) : null}
                        </div>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="section-shell platform-proof-section" id="implemented-systems" aria-labelledby="implemented-heading">
        <div className="container">
          <header className="platform-section-heading" data-reveal>
            <div>
              <p className="eyebrow">Proof before vision</p>
              <h2 id="implemented-heading">Implemented systems.</h2>
              <p>Three independent subsystems, each with a different failure surface and an explicit evidence trail.</p>
            </div>
            <p className="platform-section-aside">Status is a claim boundary, not a project-management label.</p>
          </header>

          <div className="platform-status-key" aria-label="Platform status definitions">
            {platformStatusDefinitions.map(([status, definition]) => (
              <div key={status}><PlatformStatusLabel status={status} /><span>{definition}</span></div>
            ))}
          </div>

          <div className="platform-proof-grid">
            {proofNodes.map((node) => <ProofCard key={node.id} node={node} />)}
          </div>
        </div>
      </section>

      <section className="section-shell platform-lifecycle-section" aria-labelledby="lifecycle-heading">
        <div className="container">
          <header className="platform-section-heading" data-reveal>
            <div>
              <p className="eyebrow">Model lifecycle / model optimization</p>
              <h2 id="lifecycle-heading">Specialization has to earn its place.</h2>
              <p>FineForge is intentionally shown as NEXT here. The question is not whether a model can be fine-tuned; it is whether specialization actually beats the base model.</p>
            </div>
          </header>
          <div className="platform-lifecycle-flow" aria-label="Target model lifecycle">
            {[
              "Base Model",
              "FineForge / QLoRA",
              "Offline Evaluation",
              "Candidate",
              "ModelOps",
              "Canary",
              "Registry",
              "Adaptive Model Router",
            ].map((step, index, steps) => (
              <div className="platform-lifecycle-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {index < steps.length - 1 ? <ArrowRight aria-hidden="true" size={15} /> : null}
              </div>
            ))}
          </div>
          <div className="platform-lifecycle-note">
            <div><PlatformStatusLabel status="NEXT" /><h3>FineForge / QLoRA</h3></div>
            <p>Potential evaluation: task quality, SQL execution accuracy where relevant, retrieval/generation quality, latency, throughput, VRAM, cost, and generalization.</p>
          </div>
        </div>
      </section>

      <section className="section-shell section-tinted platform-principles-section" aria-labelledby="principles-heading">
        <div className="container">
          <header className="platform-section-heading" data-reveal>
            <div>
              <p className="eyebrow">Shared engineering principles</p>
              <h2 id="principles-heading">Engineering principles.</h2>
              <p>The platform direction is coherent because the boundaries repeat, even when the subsystems do different work.</p>
            </div>
          </header>

          <div className="platform-principles">
            <article>
              <span className="platform-principle-index">01</span>
              <h3>Models provide intelligence. Deterministic systems provide authority.</h3>
              <div className="platform-authority-list">
                <div><strong>RAG</strong><span>answer proposal → evidence validation → release / abstain</span></div>
                <div><strong>DecisionSQL</strong><span>SQL proposal → AST + ACL + cost policy → execute / deny</span></div>
                <div><strong>Agent</strong><span>action proposal → authorization + policy + confirmation → execute / deny</span></div>
                <div><strong>Adaptive Model Router</strong><span>chooses computation, never grants authority</span></div>
              </div>
            </article>
            <article>
              <span className="platform-principle-index">02</span>
              <h3>Evidence decides what gets promoted.</h3>
              <p>Evaluation gates are defined before looking at the result where applicable. A candidate can improve some metrics and still be rejected. Rejected experiments remain evidence instead of being rewritten as success.</p>
              <a className="platform-inline-link" href="https://github.com/negativexq/knowledge-base-rag/blob/main/docs/reranking.md" target="_blank" rel="noreferrer">Read the frozen reranker decision <ArrowUpRight aria-hidden="true" size={13} /><span className="sr-only"> (opens in a new tab)</span></a>
            </article>
            <article>
              <span className="platform-principle-index">03</span>
              <h3>Failures stay attributable.</h3>
              <p className="platform-failure-chain">retrieval miss <b>≠</b> reranker loss <b>≠</b> generation error <b>≠</b> validator error <b>≠</b> policy failure <b>≠</b> execution failure</p>
              <p>Aggregate “AI accuracy” is not enough to decide which subsystem needs to change.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell platform-roadmap-section" aria-labelledby="roadmap-heading">
        <div className="container">
          <header className="platform-section-heading" data-reveal>
            <div>
              <p className="eyebrow">Integration roadmap</p>
              <h2 id="roadmap-heading">Integration second. Platform last.</h2>
              <p>These are target integrations, not current deployment claims. The sequence starts with a second real data consumer and grows the contracts only when the next boundary is earned.</p>
            </div>
          </header>

          <ol className="platform-roadmap-list">
            {[
              ["DecisionSQL", "BUILDING", "Structured data plane"],
              ["Enterprise Context V0", "NEXT", "One entity consumed across planes"],
              ["Cross-plane integration", "NEXT", "Knowledge, data, and action contracts"],
              ["Shared capability contracts", "NEXT", "Stable boundaries between bounded services"],
              ["Unified Registry", "NEXT", "Models, agents, knowledge, data, tools, policies, evaluations, deployments"],
              ["Unified Control Plane", "NEXT", "Common identity, configuration, policy, and lifecycle"],
            ].map(([title, status, detail], index, items) => (
              <li key={title}>
                <span className="platform-roadmap-line" aria-hidden="true"><b>{String(index + 1).padStart(2, "0")}</b>{index < items.length - 1 ? <i /> : null}</span>
                <div><PlatformStatusLabel status={status as PlatformStatus} /><h3>{title}</h3><p>{detail}</p></div>
              </li>
            ))}
          </ol>

          <div className="platform-context-block">
            <div className="platform-context-copy">
              <PlatformStatusLabel status="NEXT" />
              <h3>Enterprise Context V0 starts with Order.</h3>
              <p>Enterprise Context starts only after DecisionSQL creates a second real data consumer, avoiding a speculative ontology layer.</p>
              <p>The first success criterion is simple: the same Order entity is actually consumed by RAG, SQL, and Agent subsystems.</p>
            </div>
            <div className="platform-order-example" aria-label="Order entity integration contract">
              <div className="platform-order-code"><span>Order</span><code>data: commerce.orders</code><code>knowledge: order-policy · refund-policy</code><code>metrics: order_value · refund_rate</code><code>actions: cancel_order · refund_order</code></div>
              <div className="platform-entity-map">
                <span>Knowledge Base RAG</span><i />
                <span>DecisionSQL</span><i />
                <span>Agent Runtime</span><i />
                <strong>Order</strong>
              </div>
            </div>
          </div>

          <div className="platform-future-planes">
            <div><PlatformStatusLabel status="NEXT" /><h3>Unified Registry</h3><p>Models · Agents · Knowledge Bases · Data Sources · Tools · Connectors · Policies · Evaluation Suites · Deployments</p></div>
            <div><PlatformStatusLabel status="NEXT" /><h3>Unified Control Plane</h3><p>Common identity, configuration, policy, and lifecycle across independent bounded services.</p></div>
          </div>

          <div className="platform-architecture-intention">
            <strong>Independent bounded services</strong><span>+</span><strong>shared contracts</strong><span>+</span><strong>common control plane</strong>
            <p>Not one giant repo containing every project.</p>
          </div>
        </div>
      </section>

      <section className="platform-closing section-shell" aria-label="Platform summary">
        <div className="container">
          <p>Built independently. Measured explicitly. Now being connected deliberately.</p>
        </div>
      </section>
    </main>
  );
}
