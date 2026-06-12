"use client";

// Share block on the diagnostic results page.
//
// Turns the Red-Zone Map into a Wordle-style spoiler-free text card: trap
// names with severity squares, no raw score, and a link back to /diagnostic
// tagged utm_source=share so shared-link signups are attributable. Uses the
// native share sheet when available, clipboard otherwise.

import { useState } from "react";
import type { DiagnosticTrapPattern } from "@/lib/api-client";
import { trackMapShared } from "@/lib/analytics";

const SHARE_URL =
  "https://barmatrix.app/diagnostic?utm_source=share&utm_campaign=red_zone_map";

export function buildShareText(patterns: readonly DiagnosticTrapPattern[]): string {
  const lines = patterns
    .slice(0, 3)
    .map((p) => `${p.severity === "high" ? "🟥" : "🟧"} ${p.label}`);
  const header =
    lines.length > 0
      ? ["My MBE Red-Zone Map · BarMatrix", "These traps caught me:", ...lines]
      : ["My MBE Red-Zone Map · BarMatrix", "🟩 No repeated trap pattern caught me."];
  return [...header, `18 free questions. Find yours: ${SHARE_URL}`].join("\n");
}

export function ShareMap({
  patterns,
  scoreBand,
  sessionId,
}: {
  patterns: readonly DiagnosticTrapPattern[];
  scoreBand: string;
  sessionId: string;
}) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied" | "error">(
    "idle",
  );
  const shareText = buildShareText(patterns);
  const trapTags = patterns.slice(0, 3).map((p) => p.tag);

  async function share() {
    setStatus("idle");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: shareText });
        setStatus("shared");
        trackMapShared({ channel: "web_share", trapTags, scoreBand, sessionId });
        return;
      } catch {
        // User dismissed the sheet or share failed — fall through to copy.
      }
    }
    await copy();
  }

  async function copy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setStatus("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setStatus("copied");
      trackMapShared({ channel: "clipboard", trapTags, scoreBand, sessionId });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Compare maps
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-zinc-900">
        Every bar taker has a trap. Find out theirs.
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
        Share your trap card — names only, no score — and see which traps catch
        your study group.
      </p>
      <pre className="mt-4 max-w-xl overflow-x-auto whitespace-pre-wrap border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm leading-6 text-zinc-800">
        {shareText}
      </pre>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={share} className="btn red">
          Share my trap card
        </button>
        <button type="button" onClick={copy} className="btn ghost">
          Copy text
        </button>
      </div>
      <p
        className="mt-3 min-h-5 font-mono text-xs uppercase tracking-wider text-zinc-500"
        aria-live="polite"
      >
        {status === "copied"
          ? "Copied — paste it anywhere"
          : status === "shared"
            ? "Shared"
            : status === "error"
              ? "Could not copy — select the text above"
              : "Spoiler-free: trap names only, never your score"}
      </p>
    </div>
  );
}
