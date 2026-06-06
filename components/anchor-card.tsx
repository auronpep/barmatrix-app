// The Day-1 "you learned this" win moment. Surfaces the reusable rule(s) the
// user now owns from the anchor cards seeded on each answered diagnostic item.
// Contract (experience spec G5): EVERY path ends on at least one anchor — a
// 1-item bounce shows one card; a full session shows the stack. When the items
// answered carried no seeded anchor (5 of 20 are null), we fall back to the
// method anchor so the win moment never disappears.
//
// Theming note: Christian flavor lives only in the example names inside a rule,
// never in the rule text itself — this component renders whatever rule string
// it's given, presentation only.

import type { AnchorCard as AnchorCardData } from "@/lib/api-client";

// The one rule the whole platform runs on — used when answered items had no
// seeded anchor, so the close always lands on something concrete to own.
const METHOD_FALLBACK: AnchorCardData = {
  id: "METHOD-CORE",
  title: "The BarMatrix method",
  rule: "The credited answer is the one choice that is both TRUE and RESPONSIVE. On every other choice, name the break — untrue, or true-but-not-responsive — and cut it.",
  prompt: "Which choice answers the actual call of the question?",
  source_tag: "method",
  subject: "Method",
};

function AnchorCardItem({ anchor }: { anchor: AnchorCardData }) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      {anchor.prompt ? (
        <p className="font-serif text-base italic leading-6 text-zinc-500">
          {anchor.prompt}
        </p>
      ) : null}
      <p className="mt-2 font-serif text-lg font-semibold leading-7 text-zinc-900">
        {anchor.rule}
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-zinc-400">
        {anchor.subject}
        {anchor.title ? ` · ${anchor.title}` : ""}
      </p>
    </li>
  );
}

export function AnchorStack({ anchors }: { anchors?: AnchorCardData[] | null }) {
  // De-dupe defensively and drop any anchor with no rule to own.
  const seen = new Set<string>();
  const usable = (anchors ?? []).filter((a) => {
    if (!a || !a.rule || seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
  const cards = usable.length > 0 ? usable : [METHOD_FALLBACK];
  const many = cards.length > 1;

  return (
    <section
      className="mt-8 rounded-lg border border-zinc-900 bg-zinc-950 p-6 text-white shadow-sm"
      aria-labelledby="anchor-stack-title"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
        {many ? "Today you own these rules" : "Today you own this rule"}
      </p>
      <h2
        id="anchor-stack-title"
        className="mt-2 font-serif text-2xl font-semibold tracking-tight"
      >
        Your Day-1 takeaway
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        Carry {many ? "these" : "this"} into every question from here — name the
        break, answer the call.
      </p>
      <ul className="mt-5 space-y-3">
        {cards.map((a) => (
          <AnchorCardItem key={a.id} anchor={a} />
        ))}
      </ul>
    </section>
  );
}

// Single-card variant for non-diagnostic surfaces (e.g. a Foundations lesson
// end) where the caller supplies exactly one rule.
export function AnchorCard({ anchor }: { anchor: AnchorCardData }) {
  return <AnchorStack anchors={[anchor]} />;
}
