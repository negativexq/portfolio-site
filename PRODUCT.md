# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engineering Managers, Staff Engineers, and Hiring Managers reviewing the portfolio after seeing the CV. They need to understand the implemented AI/ML systems, the evidence behind them, and the deliberately bounded path toward a coherent platform architecture.

## Product Purpose

The portfolio communicates public engineering work across AI, data, distributed systems, and platform infrastructure. The `/platform` surface puts implemented subsystems and their measured evidence before the larger architecture they are being connected toward.

## Positioning

Implemented subsystems are presented as independent reference implementations with explicit evidence boundaries; planned integrations are labeled as building, evolving, or next rather than presented as completed platform capabilities.

## Operating Context

Visitors skim on desktop or mobile after reviewing a CV. They should be able to inspect repository, architecture, evaluation, and design-note links without searching through GitHub. The existing site uses a dark/light web interface with responsive project, graph, writing, and learning surfaces.

## Capabilities and Constraints

- `/platform` must preserve the existing site shell, navigation, typography, spacing, theme behavior, responsive conventions, and motion preferences.
- The page must show Knowledge Base RAG, Agent Runtime foundation, and ModelOps as PROVEN; DecisionSQL as BUILDING; Adaptive Model Router as EVOLVING; and future integration components as NEXT.
- Public evidence must use precise benchmark language and remain scoped to the current repository evidence.
- Architecture nodes must be keyboard, mouse, and touch interactive, with detail content visible without hover.
- Competitor comparisons, fake deployment state, invented progress, and claims that the full enterprise platform is complete are out of scope.

## Evidence on Hand

- Existing portfolio sources in `data/projects.ts`, `data/knowledge-base-rag.ts`, `data/agentic-customer-service-platform.ts`, and `data/modelops-control-plane.ts`.
- Public repositories and documentation linked from the platform page.
- Existing graph, project, status, section-heading, and site-shell components.

## Product Principles

- Evidence before architecture vision.
- Models provide intelligence; deterministic systems provide authority.
- Evaluation evidence remains scoped and attributable.
- Independent bounded services are connected through shared contracts, not collapsed into a monolith.

## Accessibility & Inclusion

Use visible text alongside status color, preserve keyboard focus, support touch interactions, respect `prefers-reduced-motion`, and keep the mobile architecture readable without horizontal overflow.
