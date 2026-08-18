import { ArrowUpRight } from "lucide-react";

type MachineReadableLinkProps = {
  href: string;
};

/** A small, subtle discovery link to a page's Markdown representation.
 * Plain <a>, not next/link -- the target is a route handler returning
 * text/markdown, not an app page, so client-side route prefetching
 * doesn't apply. Server-rendered so agents can find it by reading markup,
 * not by executing JavaScript. */
export function MachineReadableLink({ href }: MachineReadableLinkProps) {
  return (
    <a className="section-link machine-readable-link" href={href}>
      View as Markdown <ArrowUpRight aria-hidden="true" size={13} />
    </a>
  );
}
