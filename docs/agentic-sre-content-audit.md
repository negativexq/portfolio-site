# Agentic SRE case-study evidence audit

Reviewed 2026-10-11 against upstream main commit `87fc192b94932ddad51aeb48a77911488e470a03`. Source checkout was read-only, outside this repository. Recent merged PRs #103–110 were checked: peer attribution, dependency frontier A/C, withdrawal of healthy-call rule B, and twentieth HOLDOUT pre-registration.

## Before editing

- `data/projects.ts` supplies homepage/list cards, proof points, Markdown serialization and project SEO/FAQ structured data. It led with historical TEST25 accuracy without consistently marking it historical, described three development fault families and no held-out testbed result, and included obsolete coverage and certificate lifecycle limitations.
- `data/agentic-sre.ts` and `components/content/agentic-sre-case-study.tsx` repeated those results; the case study had no real console media, no current exact-score comparison and no RESOLVED/AMBIGUOUS/INSUFFICIENT_EVIDENCE explanation.
- `data/architectures.ts` already represented the outbound Connector boundary but claimed enrollment/rotation were absent and coverage was provenance only.
- No Agentic SRE media existed under `public/projects`. Existing Next Image and case-study styling were reused.
- The related article, `content/writing/agentic-without-the-llm-deterministic-kubernetes-rca.md`, is a historical publication. Its content and measurements are preserved with a current-state link.
- Project route metadata, dynamic Open Graph route and JSON-LD use shared project data; routes and SEO infrastructure are preserved.

## Evidence map

All paths below refer to the reviewed upstream revision. Public claim links in `data/agentic-sre.ts` are pinned to it.

| Claim | Source | Scope |
| --- | --- | --- |
| 24/24 valid; 12/99 RESOLVED; zero false RESOLVED/strong authority; decoy never named | docs/architecture/testbed-scenarios-design.md §35.1 | Nineteenth HOLDOUT, 2026-10-11, engine 2.8.0 frozen at bb54305; 24 runs, 99 scored diagnoses |
| Six fault families, held-out protocol and independent causal witnesses | same, §12 and §35 | Variants A development; B/C held-out injections; frozen manifests and acceptance criteria |
| ~1.2 s median / 1.9 s p90 | docs/architecture/connector-boundary-contract.md §15.1 | WATCH + follow comparison, 105 changes, lab 2026-09-30 / 10-01; ingestion, not diagnosis |
| 17/22 TEST25 accuracy; 21/25 agreement; 26/31 combined accuracy | evals/results/v1.1.2/README.md | Historical frozen paths; ground truth and FULL_SOURCE agreement are separate runs |
| 18/31 (58.1%) exact root score | docs/architecture/c11-itbench-equivalence.md; docs/results/measured-performance.md | Engine 2.2.2 full-source; equivalence/controller scores do not replace exact accuracy |
| Historical confidence / reads / zero model calls | evals/results/v1.1.2/README.md | VERIFIED 13/16, LIKELY 13/19; TEST25 six reads each, 150 total; no current calibration claim |
| 25/25 expected outcomes | docs/results/measured-performance.md; evals/results/live-suite-2026-09-24.md | Historical in-house live suite and M16 rerun; 16 actor identifications, 9 abstentions, 0 RESOLVED |
| Connector lifecycle now implemented | docs/architecture/roadmap.md A8; README.md | Preflight, enrollment, rotation, revocation, Helm; no published image or completed multi-cluster diagnosis |
| Causal engine 2.10.0, dependency rules A and C | docs/architecture/m21-causal-semantics-contract.md §29 | A/C implemented; observed-healthy B withdrawn after two DEV failures |
| Twentieth HOLDOUT | docs/architecture/testbed-scenarios-design.md §36 | Pre-registration only; no completed result at reviewed revision |
| Images and GIF | docs/ui/screenshots/README.md | PNGs: actual production frontend build with seeded local data. GIF: copy of held-out packet-loss lab run, AMBIGUOUS |
| Deployment and replay limits | README.md limitations; docs/how-it-works.md | Single replica, unauthenticated reads, retention/storage lifetime, bounded traffic not live, one configured Connector |

## Deliberately excluded claims

No customer-production deployment, throughput, production latency, current-engine accuracy/calibration, general multi-cluster or HA support, automatic remediation, successful observed-healthy dependency rule, or completed twentieth HOLDOUT result. Do not transfer historical scores to engine 2.10.0. Later regression reports may be unchanged without establishing a new current exact-score claim.

## Media loading

Six repository assets copied byte-for-byte. Hero PNG has intrinsic dimensions and preload; remaining PNGs are lazy Next Images with full-resolution links. The 5.3 MB GIF is mounted only after the visitor presses Play, with a Stop control; no conversion or automatic animation. Its frame reserves the same aspect ratio for the static preview and recording.

## Verification completed

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test`: 62/62 passed (existing Node module-type warnings).
- `npm run build`: passed; all 95 static pages generated, including the project and Open Graph routes.
- `git diff --check`: passed.
- Production preview inspected at 1440 × 1000 and 390 × 844: no page-level horizontal overflow; architecture stacks on mobile; benchmark tables scroll locally; all section anchors resolve.
- All six images loaded successfully during inspection; static media preserves aspect ratios. Recording Play/Stop works, and the GIF is absent until activated and removed on Stop.
- Homepage, listing, historical article, Open Graph image, project Markdown feed, media links and checked navigation routes returned HTTP 200. All pinned documentation paths exist in the verified upstream checkout.
- Final desktop proof screenshot saved outside shipped assets at `/tmp/portfolio-agentic-verification/desktop.jpg`.
