# Agent architecture — UI/UX update

The Agentic Customer Service Platform architecture now opens with five boundaries instead of the full 33-node diagram. Existing technical details and engineering notes remain available in native disclosures.

Preview: `/projects/agentic-customer-service-platform#architecture`.

## Changes

- The overview follows Request → Identity & scope → Agent proposal → Deterministic gates → Typed execution. Execution is explicitly limited to allowed or confirmed actions.
- Allow, Confirm, Human and Deny are presented as alternative policy outcomes. Human and Deny have no execution destination. The canonical architecture data also stops merging those outcomes back into the execution path.
- Knowledge and memory have a separate context explanation. They cannot grant authority.
- Selecting a boundary opens its technical details, scrolls to the disclosure and moves keyboard focus to its summary.
- Details cover authentication, semantic proposals, knowledge, memory, deterministic checks, confirmation, revalidation, tools, persistence, observability and evaluation. All 33 original nodes and the original engineering notes are retained.
- Mobile uses a single forward path instead of alternating left/right rows. Policy alternatives remain separate from that path.
- The new component uses the existing color/font tokens, readable 13–16 px supporting text, keyboard focus indicators and reduced-motion behavior. Native disclosures also work without JavaScript.

The change is scoped to this project's architecture. The other project diagrams and the broader site audit remain separate work.

## Verification

- 69 existing tests passed.
- Targeted ESLint and TypeScript checks passed.
- Production build passed, including generation of all 99 static pages.
- Taste v2 static lint found no issues in the three new implementation files. This is not a claim that the whole site passes Taste v2.
- Browser checks at 1440, 1024, 768, 390 and 320 px; light theme additionally at 1440 and 390 px. No horizontal page overflow or JavaScript exceptions were recorded.
- Boundary selection focuses the correct summary. Native Enter closes it; Space opens it. Native disclosure interaction also passed with JavaScript disabled.
- All-detail content was checked for mobile overflow and coverage of the original architecture nodes.

Full measurements: [verification.json](audits/agentic-architecture/verification.json).

## Screenshots

- [Desktop overview](audits/agentic-architecture/desktop.jpg)
- [Mobile policy alternatives](audits/agentic-architecture/mobile-policy.jpg)
- [Expanded execution boundary on mobile](audits/agentic-architecture/mobile-detail.jpg)
