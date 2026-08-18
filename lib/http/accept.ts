// Minimal Accept-header parsing for one purpose: deciding whether a
// request explicitly opted into `text/markdown`. Deliberately does not
// implement full RFC 9110 media-range matching (no wildcard subtype/type
// matching, no relative-preference ranking against other types) -- the
// site only ever needs a yes/no answer for one concrete media type, and
// silently upgrading "*/*" or "text/*" to markdown would be exactly the
// accidental-negotiation bug the feature has to avoid.

type MediaRange = {
  type: string;
  subtype: string;
  q: number;
};

function parseAccept(header: string): readonly MediaRange[] {
  return header
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [mediaType, ...params] = entry.split(";").map((part) => part.trim());
      const [type = "", subtype = ""] = mediaType.split("/");
      let q = 1;
      for (const param of params) {
        const [key, value] = param.split("=").map((part) => part.trim());
        if (key === "q" && value) {
          const parsed = Number.parseFloat(value);
          if (!Number.isNaN(parsed)) q = parsed;
        }
      }
      return { type: type.toLowerCase(), subtype: subtype.toLowerCase(), q };
    });
}

/** True only when the header contains an explicit, non-zero-weight
 * `text/markdown` range. `*\/*`, `text/*` and typos like
 * `application/markdown` are all treated as "not accepted". */
export function acceptsMarkdown(acceptHeader: string | null | undefined): boolean {
  if (!acceptHeader) return false;
  return parseAccept(acceptHeader).some(
    (range) => range.type === "text" && range.subtype === "markdown" && range.q > 0,
  );
}
