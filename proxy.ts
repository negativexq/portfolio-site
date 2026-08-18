import { NextResponse, type NextRequest } from "next/server";
import { acceptsMarkdown } from "@/lib/http/accept";

// Only the human-facing routes that have a real, already-existing .md
// sibling route (see commit 4deb8d4's app/*.md/route.ts handlers) are
// eligible for negotiation. Explicit allowlist, not `${path}.md` for
// every path -- that would also match /projects.md itself and loop, and
// would offer Markdown for routes that were never meant to have it
// (there is no /skills page, only /skills.md, so it's absent here).
const markdownRoutes = new Map<string, string>([
  ["/projects", "/projects.md"],
  ["/experience", "/experience.md"],
  ["/learning", "/learning.md"],
  ["/resume", "/resume.md"],
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const markdownTarget = markdownRoutes.get(pathname);

  // The Markdown representation must say `Vary: Accept` so a cache keyed
  // on this response never serves it to a later request with a different
  // Accept header -- this is the concrete "agent's Markdown response
  // leaks to a browser" risk, and it's what actually matters: Proxy
  // re-evaluates Accept on every request to a matched path before any
  // cache lookup, so a cache can only ever store *this* response under
  // *this* request's Accept value in the first place.
  if (markdownTarget && acceptsMarkdown(request.headers.get("accept"))) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = markdownTarget;
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("Vary", "Accept");
    return response;
  }

  // Best-effort on the HTML pass-through path: verified (dev and
  // `next start`) that Next's App Router overwrites this response's Vary
  // header with its own RSC-navigation value (`rsc, next-router-state-tree,
  // ...`) by the time the page finishes rendering, for both a header set
  // here and one declared via next.config.ts's headers() -- there is no
  // supported hook to append to it for a full page render. Left in place
  // as defense-in-depth for any negotiated path Next doesn't override this
  // way; see the implementation report for the full safety analysis of why
  // this doesn't undermine the actual requirement.
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  return response;
}

export const config = {
  matcher: ["/projects", "/experience", "/learning", "/resume"],
};
