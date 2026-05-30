"use client";

import { Fragment, type ReactNode } from "react";

// Minimal, dependency-free markdown renderer for the Foundations course content.
//
// The lesson/drill markdown is AUTHORED by us (built by scripts/build_foundations
// .py from the source lessons) and contains a small, known subset: headings
// (##..######), bold, italic, inline code, unordered/ordered lists, blockquotes,
// horizontal rules, and paragraphs. There are no tables, images, or raw HTML in
// the corpus (verified at build time).
//
// We build React nodes (never dangerouslySetInnerHTML) and the inline pass runs
// over plain text only, so even though the source is trusted there is no HTML
// injection surface.

interface MarkdownProps {
  text: string;
  className?: string;
}

const HEADING_RE = /^(#{2,6})\s+(.*)$/;
const UL_RE = /^[-*]\s+(.*)$/;
const OL_RE = /^(\d+)\.\s+(.*)$/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;
const HR_RE = /^---+$/;

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[]; start: number }
  | { kind: "blockquote"; lines: string[] }
  | { kind: "hr" }
  | { kind: "p"; text: string };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  const n = lines.length;

  while (i < n) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (trimmed === "") {
      i += 1;
      continue;
    }
    if (HR_RE.test(trimmed)) {
      blocks.push({ kind: "hr" });
      i += 1;
      continue;
    }
    const heading = trimmed.match(HEADING_RE);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1]!.length, text: heading[2]! });
      i += 1;
      continue;
    }
    if (UL_RE.test(trimmed)) {
      const items: string[] = [];
      while (i < n) {
        const m = (lines[i] ?? "").trim().match(UL_RE);
        if (!m) break;
        items.push(m[1]!);
        i += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    const olStart = trimmed.match(OL_RE);
    if (olStart) {
      const items: string[] = [];
      const start = Number.parseInt(olStart[1]!, 10);
      while (i < n) {
        const m = (lines[i] ?? "").trim().match(OL_RE);
        if (!m) break;
        items.push(m[2]!);
        i += 1;
      }
      blocks.push({ kind: "ol", items, start: Number.isFinite(start) ? start : 1 });
      continue;
    }
    if (BLOCKQUOTE_RE.test(trimmed)) {
      const qlines: string[] = [];
      while (i < n) {
        const m = (lines[i] ?? "").trim().match(BLOCKQUOTE_RE);
        if (!m) break;
        qlines.push(m[1]!);
        i += 1;
      }
      blocks.push({ kind: "blockquote", lines: qlines });
      continue;
    }
    // Paragraph: gather consecutive non-blank, non-structural lines.
    const para: string[] = [];
    while (i < n) {
      const l = lines[i] ?? "";
      const t = l.trim();
      if (
        t === "" ||
        HR_RE.test(t) ||
        HEADING_RE.test(t) ||
        UL_RE.test(t) ||
        OL_RE.test(t) ||
        BLOCKQUOTE_RE.test(t)
      ) {
        break;
      }
      para.push(t);
      i += 1;
    }
    blocks.push({ kind: "p", text: para.join(" ") });
  }
  return blocks;
}

// Inline pass: **bold**, *italic*, `code`. Operates on plain text; emits nodes.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${k++}`;
    if (match[2] !== undefined) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={key}>{match[3]}</em>);
    } else if (match[4] !== undefined) {
      nodes.push(
        <code key={key} className="md-code">
          {match[4]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function headingClass(level: number): string {
  switch (level) {
    case 2:
      return "mt-8 font-serif text-2xl font-semibold tracking-tight text-zinc-950";
    case 3:
      return "mt-6 font-serif text-xl font-semibold tracking-tight text-zinc-950";
    default:
      return "mt-5 font-mono text-xs font-semibold uppercase tracking-wider text-red-700";
  }
}

function renderHeading(level: number, text: string, key: string): ReactNode {
  const cls = headingClass(level);
  const children = renderInline(text, key);
  switch (Math.min(level, 6)) {
    case 2:
      return <h2 key={key} className={cls}>{children}</h2>;
    case 3:
      return <h3 key={key} className={cls}>{children}</h3>;
    case 4:
      return <h4 key={key} className={cls}>{children}</h4>;
    case 5:
      return <h5 key={key} className={cls}>{children}</h5>;
    default:
      return <h6 key={key} className={cls}>{children}</h6>;
  }
}

export function Markdown({ text, className }: MarkdownProps) {
  const blocks = parseBlocks(text ?? "");
  return (
    <div className={className ?? "md-body space-y-4 text-base leading-7 text-zinc-800"}>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`;
        switch (block.kind) {
          case "hr":
            return <hr key={key} className="my-6 border-zinc-200" />;
          case "heading":
            return renderHeading(block.level, block.text, key);
          case "ul":
            return (
              <ul key={key} className="list-disc space-y-2 pl-6">
                {block.items.map((it, j) => (
                  <li key={`${key}-${j}`}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} start={block.start} className="list-decimal space-y-2 pl-6">
                {block.items.map((it, j) => (
                  <li key={`${key}-${j}`}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-red-700 bg-zinc-50 py-2 pl-4 text-zinc-700"
              >
                {block.lines.map((l, j) => (
                  <Fragment key={`${key}-${j}`}>
                    {renderInline(l, `${key}-${j}`)}
                    {j < block.lines.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </blockquote>
            );
          default:
            return (
              <p key={key} className="leading-7">
                {renderInline(block.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
