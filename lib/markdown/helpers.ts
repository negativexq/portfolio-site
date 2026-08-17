// Shared building blocks for the /*.md and /llms.txt serializers. Kept
// framework-free (no Next.js imports) so they run under both the App
// Router route handlers and a plain `node` test run.

/** Escapes CommonMark's emphasis/link/code-span trigger characters so
 * free-text content (summaries, rationale, descriptions) can't be
 * accidentally reinterpreted as Markdown formatting. */
export function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_[\]]/g, (match) => `\\${match}`);
}

export function heading(level: number, text: string): string {
  return `${"#".repeat(level)} ${text}`;
}

export function renderBulletList(items: readonly (string | undefined | null)[]): string {
  const visible = items.filter((item): item is string => Boolean(item && item.trim().length > 0));
  return visible.map((item) => `- ${item}`).join("\n");
}

export function renderTechList(label: string, items: readonly string[]): string | undefined {
  if (items.length === 0) return undefined;
  return `**${label}:** ${items.map(escapeMarkdown).join(", ")}`;
}

/** Joins non-empty blocks with a blank line between them, dropping any
 * `undefined`/empty section instead of leaving a gap or literal "undefined". */
export function joinBlocks(blocks: readonly (string | undefined | null)[]): string {
  return blocks.filter((block): block is string => Boolean(block && block.trim().length > 0)).join("\n\n");
}
