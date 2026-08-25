import type { ReactNode } from "react";
import { ArticleDiagram } from "@/components/writing/article-diagram";
import { isWritingDiagramId } from "@/lib/writing/diagrams";

export function articleHeadingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function inline(text: string): ReactNode[] {
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const safeHref = href.startsWith("/") || href.startsWith("#") || /^https?:\/\//.test(href) ? href : "#";
      const external = /^https?:\/\//.test(safeHref);
      return <a key={index} href={safeHref} rel={external ? "noreferrer" : undefined}>{label}</a>;
    }
    return part;
  });
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

function tableCells(line: string) {
  return line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

export function ArticleMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const diagram = line.match(/^:::diagram\s+([a-z0-9-]+)$/);
    if (diagram) {
      if (!isWritingDiagramId(diagram[1])) throw new Error(`Unknown writing diagram: ${diagram[1]}`);
      blocks.push(<ArticleDiagram id={diagram[1]} key={blocks.length} />);
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
      if (index === lines.length) throw new Error("Unclosed fenced code block");
      blocks.push(<pre key={blocks.length}><code data-language={language || undefined}>{code.join("\n")}</code></pre>);
      index += 1;
      continue;
    }

    const heading = line.match(/^(##|###)\s+(.+)$/);
    if (heading) {
      const id = articleHeadingId(heading[2]);
      blocks.push(heading[1] === "##" ? <h2 id={id} key={blocks.length}>{inline(heading[2])}</h2> : <h3 id={id} key={blocks.length}>{inline(heading[2])}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith("> ")) quote.push(lines[index++].slice(2));
      blocks.push(<blockquote key={blocks.length}><p>{inline(quote.join(" "))}</p></blockquote>);
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index])) items.push(lines[index++].replace(/^-\s+/, ""));
      blocks.push(<ul key={blocks.length}>{items.map((item) => <li key={item}>{inline(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) items.push(lines[index++].replace(/^\d+\.\s+/, ""));
      blocks.push(<ol key={blocks.length}>{items.map((item) => <li key={item}>{inline(item)}</li>)}</ol>);
      continue;
    }

    if (index + 1 < lines.length && line.includes("|") && isTableSeparator(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(tableCells(lines[index++]));
      blocks.push(
        <div className="article-table-wrap" key={blocks.length} tabIndex={0}>
          <table>
            <thead><tr>{headers.map((cell) => <th key={cell} scope="col">{inline(cell)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length
      && lines[index].trim()
      && !/^(##|###|```|:::diagram\s|>\s|\-\s|\d+\.\s)/.test(lines[index])
      && !(index + 1 < lines.length && lines[index].includes("|") && isTableSeparator(lines[index + 1]))
    ) paragraph.push(lines[index++].trim());
    blocks.push(<p key={blocks.length}>{inline(paragraph.join(" "))}</p>);
  }

  return <div className="article-prose">{blocks}</div>;
}
