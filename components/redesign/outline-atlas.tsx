"use client";

// Redesign V2 — Outline Atlas.
//
// The canonical MBE outline as a study reviewer: a master-detail surface — tree
// navigator (left) + lesson / performance / drill detail (right) — driven by the
// OutlineData object. This replaces the old "All Drills" page with an outline
// reviewer (browse → open a lesson → drill an item → see your performance on it).
//
// PHASE 2 (presentation): per-item performance is a deterministic stand-in
// (itemPerf) so the preview shows realistic, stable variation. In production it
// comes from real attempt data via the API, keyed by 8-digit outline code.
// Re-expressed in the app's primitives (Tailwind, serif/mono/zinc-red) — not a
// port of the prototype CSS. onStartDrill resolves to the live drill runner.

import { useMemo, useState } from "react";
import type {
  ItemPerf,
  OutlineData,
  OutlineItem,
  OutlineSubject,
  OutlineSubtopic,
  PerfStatus,
} from "@/components/redesign/outline-atlas-types";

/* ── deterministic per-item performance (stands in for real attempt data) ── */

function fnv(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const OA_TRAPS = [
  "Decisionmaker Inversion",
  "Wrong Exception",
  "Extreme of Range",
  "Bait Doctrine",
  "Stale Rule",
  "Channel Mismatch",
  "Scope Creep",
];

function itemPerf(code: string): ItemPerf {
  const h = fnv(code);
  const qAvail = 3 + (h % 12);
  const roll = (h >> 3) % 100;
  if (roll < 22) return { status: "untouched", attempts: 0, accuracy: null, qAvail, lastDays: null, trap: null };
  const attempts = 6 + ((h >> 7) % (qAvail * 4));
  const accuracy = 40 + ((h >> 11) % 56);
  const status: PerfStatus =
    accuracy >= 80 ? "mastered" : accuracy >= 66 ? "proficient" : accuracy >= 52 ? "shaky" : "weak";
  const lastDays = (h >> 5) % 18;
  const trap = status === "mastered" ? null : OA_TRAPS[h % OA_TRAPS.length];
  return { status, attempts, accuracy, qAvail, lastDays, trap };
}

const OA_STATUS: Record<PerfStatus, string> = {
  mastered: "Mastered",
  proficient: "Proficient",
  shaky: "Shaky",
  weak: "Weak",
  untouched: "Not started",
};

// pip / badge color per status
const PIP: Record<PerfStatus, string> = {
  mastered: "bg-green-800 border-green-800",
  proficient: "bg-zinc-900 border-zinc-900",
  shaky: "bg-amber-600 border-amber-600",
  weak: "bg-red-700 border-red-700",
  untouched: "bg-transparent border-zinc-400",
};
const BADGE: Record<PerfStatus, string> = {
  mastered: "bg-green-800 text-white",
  proficient: "bg-zinc-900 text-white",
  shaky: "bg-amber-600 text-white",
  weak: "bg-red-700 text-white",
  untouched: "border border-zinc-300 bg-zinc-100 text-zinc-500",
};

// a few authored lessons; everything else shows the outline-mapped scaffold
const OA_LESSONS: Record<string, { tests: string; spine: string; points: string[] }> = {
  "31010101": {
    tests: "Who decides a preliminary admissibility question — the judge or the jury — and under what standard.",
    spine: "FRE 104(a)–(b) · CA Evidence Code §§ 402, 405",
    points: [
      "Under FRE 104(a), the court decides foundational questions of admissibility and is not bound by the rules of evidence — except privilege.",
      "Under FRE 104(b), the court only screens for evidence sufficient to support a finding; the jury then weighs the conditional fact.",
      "The signature trap is Decisionmaker Inversion — treating a judge's 104(a) question as if the jury decides it.",
    ],
  },
};
const OA_DRILL_BY_CODE: Record<string, string> = { "31010101": "A1-roles-judge-jury" };

const lastLabel = (d: number | null) => (d == null ? "—" : d === 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`);

/* ── rollups over the outline tree ── */

interface Rollup {
  total: number;
  attempted: number;
  coverage: number;
  accuracy: number | null;
  mastered: number;
  weakest: { item: OutlineItem; acc: number } | null;
}

function rollupLeaves(leaves: OutlineItem[]): Rollup {
  let att = 0, sumAcc = 0, nAcc = 0, mastered = 0;
  let weakest: { item: OutlineItem; acc: number } | null = null;
  leaves.forEach((it) => {
    const pf = itemPerf(it.code);
    if (pf.status !== "untouched" && pf.accuracy != null) {
      att++; sumAcc += pf.accuracy; nAcc++;
      if (pf.status === "mastered") mastered++;
      if (weakest == null || pf.accuracy < weakest.acc) weakest = { item: it, acc: pf.accuracy };
    }
  });
  return {
    total: leaves.length,
    attempted: att,
    coverage: leaves.length ? Math.round((att / leaves.length) * 100) : 0,
    accuracy: nAcc ? Math.round(sumAcc / nAcc) : null,
    mastered,
    weakest,
  };
}

function descendantLeaves(node: OutlineItem, subtopicItems: OutlineItem[]): OutlineItem[] {
  const prefix = node.code.endsWith("0000")
    ? node.code.slice(0, 4)
    : node.code.endsWith("00")
    ? node.code.slice(0, 6)
    : node.code;
  return subtopicItems.filter((it) => it.leaf && it.code.startsWith(prefix));
}

interface IndexEntry {
  item: OutlineItem;
  subject: OutlineSubject;
  subtopic: OutlineSubtopic;
}

export interface OutlineAtlasProps {
  data: OutlineData;
  onStartDrill?: (drillId?: string) => void;
}

export function OutlineAtlas({ data: O, onStartDrill }: OutlineAtlasProps) {
  const [query, setQuery] = useState("");
  const [openSubj, setOpenSubj] = useState<Set<string>>(() => new Set([O.subjects[0].name]));
  const [openSub, setOpenSub] = useState<Set<string>>(
    () => new Set([O.subjects[0].name + "::" + O.subjects[0].subtopics[0].name]),
  );
  const firstLeaf =
    O.subjects[0].subtopics[0].items.find((it) => it.leaf) ?? O.subjects[0].subtopics[0].items[0];
  const [sel, setSel] = useState(firstLeaf.code);

  const index = useMemo(() => {
    const m: Record<string, IndexEntry> = {};
    O.subjects.forEach((s) =>
      s.subtopics.forEach((t) => t.items.forEach((it) => (m[it.code] = { item: it, subject: s, subtopic: t }))),
    );
    return m;
  }, [O]);

  const summary = useMemo(() => {
    const counts: Record<PerfStatus, number> = { mastered: 0, proficient: 0, shaky: 0, weak: 0, untouched: 0 };
    let att = 0, sumAcc = 0, nAcc = 0, leaves = 0;
    O.subjects.forEach((s) =>
      s.subtopics.forEach((t) =>
        t.items.forEach((it) => {
          if (!it.leaf) return;
          leaves++;
          const pf = itemPerf(it.code);
          counts[pf.status]++;
          if (pf.status !== "untouched" && pf.accuracy != null) {
            att++; sumAcc += pf.accuracy; nAcc++;
          }
        }),
      ),
    );
    return {
      counts,
      leaves,
      attempted: att,
      coverage: leaves ? Math.round((att / leaves) * 100) : 0,
      accuracy: nAcc ? Math.round(sumAcc / nAcc) : 0,
    };
  }, [O]);

  const subjRollup = useMemo(() => {
    const m: Record<string, Rollup> = {};
    O.subjects.forEach((s) => {
      const leaves: OutlineItem[] = [];
      s.subtopics.forEach((t) => t.items.forEach((it) => it.leaf && leaves.push(it)));
      m[s.name] = rollupLeaves(leaves);
    });
    return m;
  }, [O]);

  const toggle = (setFn: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
    setFn((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const q = query.trim().toLowerCase();
  const results = q
    ? (() => {
        const out: IndexEntry[] = [];
        O.subjects.forEach((s) =>
          s.subtopics.forEach((t) =>
            t.items.forEach((it) => {
              if (it.level !== 0 && (it.name.toLowerCase().includes(q) || it.code.includes(q)))
                out.push({ item: it, subject: s, subtopic: t });
            }),
          ),
        );
        return out.slice(0, 60);
      })()
    : null;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      {/* summary strip */}
      <div className="relative grid grid-cols-1 items-center gap-6 border-t-4 border-red-700 bg-zinc-950 px-6 py-4 text-zinc-100 md:grid-cols-[auto_1fr]">
        <div className="flex items-baseline gap-3 border-zinc-700 pr-6 md:border-r">
          <span className="font-serif text-3xl font-bold leading-none tracking-tight">MBE</span>
          <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-zinc-400">
            Bar<span className="text-red-500">Matrix</span>
            <br />
            Blueprint
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <SumStat v={O.meta.subjectCount} k="Subjects" />
          <SumStat v={O.meta.subtopicCount} k="Subtopics" />
          <SumStat v={O.meta.leafCount} k="Outline items" />
          <SumStat v={summary.counts.mastered} k="Mastered" tone="green" />
          <SumStat v={summary.counts.untouched} k="Not started" tone="muted" />
          <div className="min-w-[180px] flex-1">
            <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400">
              <span>▌ Bank coverage</span>
              <span>
                {summary.attempted}/{summary.leaves} items · {summary.accuracy}% avg
              </span>
            </div>
            <div className="h-[7px] bg-white/15">
              <div className="h-full bg-red-700" style={{ width: `${summary.coverage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* split */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[372px_1fr]">
        {/* TREE */}
        <div className="flex max-h-[420px] flex-col overflow-y-auto border border-zinc-900 bg-[#fffdf7] lg:max-h-[calc(100vh-220px)] lg:min-h-[480px]">
          <div className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950 p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search outline · name or code"
              className="w-full border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs tracking-wide text-white outline-none placeholder:uppercase placeholder:tracking-wider placeholder:text-zinc-500 focus:border-red-700"
            />
          </div>

          {results ? (
            <div>
              {results.map(({ item: it, subject: s, subtopic: t }) => {
                const pf = itemPerf(it.code);
                return (
                  <TreeRow
                    key={it.code}
                    selected={it.code === sel}
                    onClick={() => setSel(it.code)}
                    pip={pf.status}
                    pad="pl-3.5"
                    name={it.name}
                    sub={`${s.abbr} · ${t.name}`}
                    acc={pf.accuracy}
                  />
                );
              })}
              {results.length === 0 && (
                <div className="p-6 font-mono text-[11px] text-zinc-500">No outline items match “{query}”.</div>
              )}
            </div>
          ) : (
            O.subjects.map((s) => {
              const r = subjRollup[s.name];
              const open = openSubj.has(s.name);
              return (
                <div className="border-b border-zinc-300" key={s.name}>
                  <button
                    type="button"
                    onClick={() => toggle(setOpenSubj, s.name)}
                    className="grid w-full grid-cols-[16px_44px_1fr_auto] items-center gap-2.5 bg-zinc-100 px-3.5 py-3 text-left hover:bg-zinc-200"
                  >
                    <span className={`font-mono text-[11px] text-zinc-500 transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
                    <span className="bg-zinc-950 py-1 text-center font-mono text-[9px] font-bold tracking-wide text-white">
                      {s.abbr}
                    </span>
                    <span className="min-w-0 font-serif text-[15px] font-bold leading-tight tracking-tight">
                      {s.name}
                      <small className="ml-2 font-mono text-[10px] font-normal tracking-wide text-zinc-500">
                        {s.subtopics.length} subtopics · {r.total} items
                      </small>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-14 bg-zinc-200">
                        <span className="block h-full bg-zinc-950" style={{ width: `${r.coverage}%` }} />
                      </span>
                      <span className="min-w-[30px] text-right font-mono text-[11px] font-semibold">{r.coverage}%</span>
                    </span>
                  </button>

                  {open &&
                    s.subtopics.map((t) => {
                      const subKey = s.name + "::" + t.name;
                      const sopen = openSub.has(subKey);
                      const tr = rollupLeaves(t.items.filter((it) => it.leaf));
                      return (
                        <div className="border-t border-zinc-200" key={subKey}>
                          <button
                            type="button"
                            onClick={() => toggle(setOpenSub, subKey)}
                            className="grid w-full grid-cols-[14px_1fr_auto] items-center gap-2.5 py-2.5 pl-6 pr-3.5 text-left hover:bg-black/5"
                          >
                            <span className={`font-mono text-[10px] text-zinc-500 transition-transform ${sopen ? "rotate-90" : ""}`}>▸</span>
                            <span className="font-serif text-[13.5px] font-semibold leading-snug">{t.name}</span>
                            <span className="whitespace-nowrap font-mono text-[10px] tracking-wide text-zinc-500">
                              {tr.total} · {tr.coverage}%
                            </span>
                          </button>
                          {sopen &&
                            t.items
                              .filter((it) => it.level !== 0)
                              .map((it) => {
                                const pf = itemPerf(it.code);
                                const isSection = !it.leaf;
                                return (
                                  <TreeRow
                                    key={it.code}
                                    selected={it.code === sel}
                                    onClick={() => setSel(it.code)}
                                    pip={isSection ? "untouched" : pf.status}
                                    sectionPip={isSection}
                                    pad="pl-[54px]"
                                    section={isSection}
                                    name={it.name}
                                    acc={isSection ? null : pf.accuracy}
                                    hideAcc={isSection}
                                  />
                                );
                              })}
                        </div>
                      );
                    })}
                </div>
              );
            })
          )}
        </div>

        {/* DETAIL */}
        <OutlineDetail entry={index[sel]} onStartDrill={onStartDrill} />
      </div>
    </div>
  );
}

function SumStat({ v, k, tone }: { v: number; k: string; tone?: "green" | "muted" }) {
  const c = tone === "green" ? "text-green-400" : tone === "muted" ? "text-zinc-400" : "";
  return (
    <div>
      <div className={`font-serif text-[22px] font-bold leading-none tracking-tight ${c}`}>{v}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-400">{k}</div>
    </div>
  );
}

function TreeRow({
  selected,
  onClick,
  pip,
  sectionPip,
  pad,
  section,
  name,
  sub,
  acc,
  hideAcc,
}: {
  selected: boolean;
  onClick: () => void;
  pip: PerfStatus;
  sectionPip?: boolean;
  pad: string;
  section?: boolean;
  name: string;
  sub?: string;
  acc: number | null;
  hideAcc?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[12px_1fr_auto] items-center gap-2.5 border-t border-zinc-200 py-2 pr-3.5 text-left hover:bg-black/[0.03] ${pad} ${
        selected ? "bg-red-700/[0.07] shadow-[inset_3px_0_0_#c8102e]" : ""
      }`}
    >
      <span className={`h-[9px] w-[9px] border ${sectionPip ? "border-transparent bg-transparent" : PIP[pip]}`} />
      <span className="min-w-0">
        <span
          className={
            section
              ? "font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
              : "text-[12.5px] leading-snug text-zinc-800"
          }
        >
          {name}
        </span>
        {sub && (
          <span className="mt-0.5 block font-mono text-[9px] tracking-wide text-zinc-500">{sub}</span>
        )}
      </span>
      {!hideAcc && (
        <span className={`min-w-[30px] text-right font-mono text-[11px] font-semibold ${acc == null ? "font-normal text-zinc-400" : ""}`}>
          {acc == null ? "—" : acc + "%"}
        </span>
      )}
    </button>
  );
}

function OutlineDetail({ entry, onStartDrill }: { entry?: IndexEntry; onStartDrill?: (id?: string) => void }) {
  if (!entry) {
    return (
      <div className="flex items-center justify-center border border-zinc-900 bg-[#fffdf7] p-10 text-center">
        <div>
          <div className="font-serif text-5xl text-zinc-300">§</div>
          <div className="mt-4 font-serif text-xl font-semibold">Pick an outline item</div>
          <div className="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-zinc-500">
            Select any node in the outline to open its lesson, drill it, and see your performance on that exact item.
          </div>
        </div>
      </div>
    );
  }

  const { item, subject, subtopic } = entry;
  const isLeaf = item.leaf;
  const pf = itemPerf(item.code);
  const lesson = OA_LESSONS[item.code];
  const drillId = OA_DRILL_BY_CODE[item.code];
  const leaves = descendantLeaves(item, subtopic.items);
  const roll = !isLeaf ? rollupLeaves(leaves) : null;
  const badgeStatus: PerfStatus = isLeaf
    ? pf.status
    : roll!.accuracy == null
    ? "untouched"
    : roll!.accuracy >= 80
    ? "mastered"
    : roll!.accuracy >= 66
    ? "proficient"
    : roll!.accuracy >= 52
    ? "shaky"
    : "weak";

  return (
    <div className="flex flex-col overflow-y-auto border border-zinc-900 bg-[#fffdf7]">
      <div className="border-b-2 border-zinc-950 px-7 pb-5 pt-6">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          {subject.abbr}
          <span className="mx-2 text-zinc-300">›</span>
          {subtopic.name}
          {!isLeaf && (
            <>
              <span className="mx-2 text-zinc-300">›</span>SECTION
            </>
          )}
        </div>
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-[28px] font-bold leading-[1.1] tracking-tight">{item.name}</h2>
            <span className="mt-2 inline-block border border-zinc-400 px-2.5 py-1 font-mono text-[11px] tracking-wide text-zinc-500">
              OUTLINE {item.code}
            </span>
          </div>
          <span className={`shrink-0 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${BADGE[badgeStatus]}`}>
            {isLeaf ? OA_STATUS[pf.status] : `${roll!.coverage}% covered`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-7 pb-8 pt-6">
        {isLeaf ? (
          <>
            {/* LESSON */}
            <Card title="▌ Lesson" meta={lesson ? "Authored · ~6 min read" : "Outline-mapped"}>
              {lesson ? (
                <>
                  <p className="font-serif text-base leading-relaxed text-zinc-900">{lesson.tests}</p>
                  <div className="mb-4 mt-3 border-b border-zinc-200 pb-3 font-mono text-[11px] tracking-wide text-red-700">
                    ▌ Rule spine · {lesson.spine}
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {lesson.points.map((p, i) => (
                      <li key={i} className="relative pl-5 text-[13.5px] leading-relaxed text-zinc-700">
                        <span className="absolute left-0 top-0 font-mono text-red-700">▸</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => onStartDrill?.(drillId)} className="btn red mt-4">
                    Start lesson →
                  </button>
                </>
              ) : (
                <>
                  <p className="font-serif text-base leading-relaxed text-zinc-900">
                    {subtopic.name} — {item.name.toLowerCase()}.
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="font-mono text-base text-zinc-400">▤</span>
                    <p className="text-[13.5px] leading-relaxed text-zinc-500">
                      This item is mapped in the master outline. A full authored lesson — black-letter rule, the tested
                      tension, and the dominant trap — is in production. Until then, drill it to generate live forensics.
                    </p>
                  </div>
                </>
              )}
            </Card>

            {/* PERFORMANCE */}
            <Card title="▌ Your performance" meta="on this exact item">
              {pf.status === "untouched" ? (
                <div className="text-[13.5px] leading-relaxed text-zinc-500">
                  You haven&apos;t attempted any questions tagged to this item yet. Drill it to generate Wrong-Answer
                  Forensics and a mastery reading.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
                    <PerfCell v={`${pf.accuracy}%`} k="Accuracy" />
                    <PerfCell v={pf.attempts} k="Attempts" />
                    <PerfCell v={OA_STATUS[pf.status]} k="Status" small />
                    <PerfCell v={lastLabel(pf.lastDays)} k="Last seen" small />
                  </div>
                  {pf.trap && (
                    <span className="mt-4 inline-flex items-center gap-2 border border-red-700 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-red-700">
                      ▲ Your trap here · {pf.trap}
                    </span>
                  )}
                </>
              )}
            </Card>

            {/* DRILL */}
            <div className="border border-zinc-300 bg-zinc-50">
              <div className="grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">▌ Drill this item</div>
                  <div className="font-serif text-[17px] font-semibold">{pf.qAvail} questions tagged to {item.code}</div>
                  <div className="mt-1 font-mono text-[10px] tracking-wide text-zinc-500">
                    {drillId ? "Authored forensic set · live" : "Forensic-tagged · sequenced by attractiveness"}
                  </div>
                </div>
                <button type="button" onClick={() => onStartDrill?.(drillId)} className="btn red btn-lg">
                  Drill now →
                </button>
              </div>
            </div>
          </>
        ) : (
          /* SECTION rollup */
          <>
            <Card title="▌ Section coverage" meta={`${roll!.total} items beneath this node`}>
              <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
                <PerfCell v={`${roll!.coverage}%`} k="Covered" />
                <PerfCell v={roll!.mastered} k="Mastered" tone="green" />
                <PerfCell v={roll!.accuracy == null ? "—" : roll!.accuracy + "%"} k="Avg accuracy" />
                <PerfCell v={roll!.total - roll!.attempted} k="Not started" />
              </div>
            </Card>
            {roll!.weakest && (
              <div className="border border-zinc-300 bg-zinc-50">
                <div className="grid grid-cols-1 items-center gap-4 p-5 sm:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
                      ▌ Weakest item in this section
                    </div>
                    <div className="font-serif text-[17px] font-semibold">{roll!.weakest.item.name}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-wide text-zinc-500">
                      {roll!.weakest.acc}% accuracy · highest payoff to repair
                    </div>
                  </div>
                  <button type="button" onClick={() => onStartDrill?.()} className="btn red btn-lg">
                    Drill weakest →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Card({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-300 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-900">{title}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{meta}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function PerfCell({
  v,
  k,
  tone,
  small,
}: {
  v: string | number;
  k: string;
  tone?: "green";
  small?: boolean;
}) {
  return (
    <div className="border-r border-zinc-200 px-4 first:pl-0 last:border-r-0">
      <div className={`font-serif font-bold leading-none tracking-tight ${small ? "text-lg" : "text-3xl"} ${tone === "green" ? "text-green-800" : ""}`}>
        {v}
      </div>
      <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-zinc-500">{k}</div>
    </div>
  );
}
