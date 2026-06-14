"use client";

// Redesign V2 — Answer Key debrief ("Combo B · Fork-First").
//
// PHASE 2 (presentation): the post-answer debrief screen a student sees after
// answering an MBE item. One long editorial scroll driven by a single DebriefData
// object: Hero verdict → Question Card → 01 The Fork → 02 Work the Solve
// (Cut→Clash→Call + Gold/Silver keys) → 03 Facts → 04 Trap molds + wrong-answer
// log → 05 Bank it → 06 Repair, plus a sticky mid-drill footer.
//
// Re-expressed in the app's own primitives (Tailwind, serif/mono/zinc-red, the
// redesign-chrome SectionLabel and .btn classes) — NOT a port of the prototype's
// CSS. The flip into the live runner replaces ForensicsCard with this card; the
// nav callbacks resolve to /red-zones, api.startDrill(prescribed_red_zone), and
// the runner's next().

import { useState } from "react";
import type {
  DebriefChoice,
  DebriefData,
  FactTone,
  KeyCard,
  StemSegment,
} from "@/components/redesign/answer-key-types";

export interface AnswerKeyDebriefProps {
  data: DebriefData;
  /** The letter the student actually chose ("A"–"D"). */
  yourPick: string;
  /** Drill-session state for the sticky footer (derived at request time). */
  session?: { index: number; total: number; percent: number; minutesLeft: number };
  onContinue?: () => void;
  onStartRepair?: () => void;
  onOpenRedZoneMap?: () => void;
}

const TONE_TEXT: Record<FactTone, string> = {
  call: "text-red-700",
  bait: "text-red-700",
  expanded: "text-amber-700",
  baseline: "text-amber-700",
  easement: "text-zinc-900",
  selfhelp: "text-zinc-500",
};

const TONE_PIP: Record<FactTone, string> = {
  call: "bg-red-700",
  bait: "bg-red-700",
  expanded: "bg-amber-600",
  baseline: "bg-amber-400",
  easement: "bg-zinc-900",
  selfhelp: "bg-zinc-400",
};

function plainStem(segments: StemSegment[]): string {
  return segments.map((s) => (typeof s === "string" ? s : s.t)).join("");
}

export function AnswerKeyDebrief({
  data,
  yourPick,
  session,
  onContinue,
  onStartRepair,
  onOpenRedZoneMap,
}: AnswerKeyDebriefProps) {
  const isCorrect = yourPick === data.correctLetter;

  return (
    <div className="relative">
      <div className="mx-auto max-w-[1000px] px-6 pb-28 sm:px-8">
        <Hero data={data} yourPick={yourPick} isCorrect={isCorrect} />
        <QuestionCard data={data} yourPick={yourPick} isCorrect={isCorrect} />
        <ForkSection data={data} yourPick={yourPick} />
        <SolveSection data={data} />
        <FactsSection data={data} />
        <MoldsSection data={data} />
        <BankItSection data={data} />
        <RepairSection data={data} onStartRepair={onStartRepair} onOpenRedZoneMap={onOpenRedZoneMap} />
      </div>
      <DrillBar data={data} session={session} onContinue={onContinue} />
    </div>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function Eyebrow({ children, tone = "red" }: { children: React.ReactNode; tone?: "red" | "muted" }) {
  return (
    <p
      className={`flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
        tone === "red" ? "text-red-700" : "text-zinc-500"
      }`}
    >
      <span aria-hidden className="inline-block h-3 w-[3px] bg-current" />
      {children}
    </p>
  );
}

function NumberedSection({
  n,
  title,
  meta,
  children,
}: {
  n: string;
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-zinc-200 py-9 last:border-0">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[15px] font-bold text-red-700">{n}</span>
        <h2 className="whitespace-nowrap font-serif text-2xl font-bold tracking-tight text-zinc-950">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-zinc-200" />
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">{meta}</span>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* ───────────────────────── hero ───────────────────────── */

function Hero({ data, yourPick, isCorrect }: { data: DebriefData; yourPick: string; isCorrect: boolean }) {
  return (
    <header className="grid grid-cols-1 items-end gap-6 border-b-[3px] border-zinc-950 pb-6 pt-9 sm:grid-cols-[1fr_auto]">
      <div>
        <Eyebrow>▌ Decision-first answer key · {data.qid}</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-extrabold leading-[1.04] tracking-tight text-zinc-950">
          Two questions hide in one call.
          <br />
          Only one is <span className="italic text-red-700">asked</span>.
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
          {data.subject} · {data.subtopic} · governing lane: {data.governingLane}
        </p>
      </div>
      <div
        className={`min-w-[150px] border-2 px-3 py-2.5 text-center ${
          isCorrect ? "border-green-800 text-green-800" : "border-red-700 text-red-700"
        }`}
      >
        <p className="font-serif text-[22px] font-bold leading-none">
          {isCorrect ? "✓ Correct" : "✕ Missed"}
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
          you chose {yourPick} · key {data.correctLetter}
        </p>
      </div>
    </header>
  );
}

/* ───────────────────────── question card ───────────────────────── */

function QuestionCard({ data, yourPick, isCorrect }: { data: DebriefData; yourPick: string; isCorrect: boolean }) {
  return (
    <article className="mt-7 border border-zinc-950 bg-[#fffdf7] px-6 py-5 sm:px-7">
      <div className="flex items-center justify-between">
        <Eyebrow>▌ The question as asked</Eyebrow>
        <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">
          {data.qid} · {data.subject}
        </span>
      </div>
      <p className="mt-4 font-serif text-[16px] leading-[1.72] text-zinc-900">{plainStem(data.stemSegments)}</p>
      <p className="mt-4 border-l-[3px] border-red-700 pl-3.5 font-serif text-[16.5px] font-semibold italic text-zinc-900">
        {data.call}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {data.choices.map((c) => {
          const credited = c.letter === data.correctLetter;
          const yours = c.letter === yourPick;
          const wrongPick = yours && !isCorrect;
          return (
            <div
              key={c.letter}
              className={`grid grid-cols-[26px_1fr_auto] items-center gap-3 border px-3 py-2.5 ${
                credited ? "border-green-800" : wrongPick ? "border-red-700" : "border-zinc-300"
              }`}
            >
              <span
                className={`flex h-[26px] w-[26px] items-center justify-center border font-mono text-xs font-bold ${
                  credited
                    ? "border-green-800 bg-green-800 text-white"
                    : wrongPick
                    ? "border-red-700 bg-red-700 text-white"
                    : "border-zinc-400 text-zinc-700"
                }`}
              >
                {c.letter}
              </span>
              <span className="font-serif text-sm text-zinc-900">{c.text}</span>
              {credited ? (
                <span className="bg-green-800 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wide text-white">
                  ✓ credited
                </span>
              ) : wrongPick ? (
                <span className="bg-red-700 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wide text-white">
                  your pick
                </span>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

/* ───────────────────────── 01 the fork ───────────────────────── */

function ForkSection({ data, yourPick }: { data: DebriefData; yourPick: string }) {
  // Branch sorting: violation choices are the dominant-trap mold families
  // (ISSUE_SENSE / EAR_*), remedy choices answer the call (credited + others).
  const violation = data.choices.filter((c) => c.keyType === "bait" || c.keyType === "expanded");
  const remedy = data.choices.filter((c) => !(c.keyType === "bait" || c.keyType === "expanded"));

  return (
    <NumberedSection n="01" title="The fork" meta="tap any node to open the evidence">
      <div className="text-center">
        <Eyebrow>▌ The call asks one thing</Eyebrow>
        <p className="mx-auto mt-2 max-w-xl font-serif text-xl italic text-zinc-900">
          {data.call}{" "}
          <span className="font-bold not-italic text-red-700">{data.callVerb} the easement.</span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 border border-zinc-950 md:grid-cols-2">
        <div className="border-b border-zinc-950 bg-[rgba(194,65,12,0.04)] p-4 md:border-b-0 md:border-r">
          <p className="font-mono text-[10px] uppercase tracking-wide text-amber-700">
            ↯ Branch 1 · The violation question — a decoy
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {violation.map((c) => (
              <ForkNode key={c.letter} c={c} data={data} yourPick={yourPick} />
            ))}
          </div>
        </div>
        <div className="bg-[rgba(31,111,58,0.05)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-wide text-green-800">
            ◉ Branch 2 · The remedy question — what’s asked
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {remedy.map((c) => (
              <ForkNode key={c.letter} c={c} data={data} yourPick={yourPick} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 bg-zinc-950 px-5 py-4 text-center text-white">
        <p className="font-mono text-[9px] uppercase tracking-wide text-red-400">▌ Call resolves it</p>
        <p className="mt-1.5 font-serif text-[15px] leading-relaxed">{data.callResolution}</p>
      </div>
    </NumberedSection>
  );
}

function ForkNode({ c, data, yourPick }: { c: DebriefChoice; data: DebriefData; yourPick: string }) {
  const [open, setOpen] = useState(false);
  const credited = c.letter === data.correctLetter;
  const wrongPick = c.letter === yourPick && !credited;
  const label = credited
    ? "✓ credited"
    : wrongPick
    ? "✕ your pick"
    : c.dominant
    ? "▲ dominant trap"
    : "distractor";

  return (
    <div
      className={`border bg-[#fffdf7] ${
        credited ? "border-green-800" : wrongPick ? "border-red-700" : "border-zinc-300"
      } ${open ? "shadow-[4px_4px_0_#0a0a0a]" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[26px_1fr_auto] items-center gap-3 px-3.5 py-3 text-left"
      >
        <span
          className={`flex h-[26px] w-[26px] items-center justify-center border font-mono text-xs font-bold ${
            credited
              ? "border-green-800 bg-green-800 text-white"
              : wrongPick
              ? "border-red-700 bg-red-700 text-white"
              : "border-amber-600 text-amber-700"
          }`}
        >
          {c.letter}
        </span>
        <span>
          <span className="font-serif text-sm text-zinc-900">{c.text}</span>
          <span className="mt-1 block font-mono text-[9px] uppercase tracking-wide text-zinc-500">
            {label} · {c.studentLabel}
          </span>
        </span>
        <span className={`font-mono text-zinc-400 transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
      </button>

      {open && (
        <div className="border-t border-zinc-200 px-3.5 pb-4 pt-3">
          <span
            className={`inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white ${
              credited ? "bg-green-800" : "bg-red-700"
            }`}
          >
            {c.verdict}
          </span>
          <p className="mt-3 font-serif text-[13.5px] leading-relaxed text-zinc-800">
            {credited ? c.fullRight : c.breaker}
          </p>
          {!credited && c.trueResponsive && (
            <div className="mt-3 border-l-2 border-green-800 bg-[#fff8d6] px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">
                What a true / responsive version says
              </p>
              <p className="mt-1 font-serif text-[13px] italic leading-relaxed text-zinc-800">
                {c.trueResponsive}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── 02 work the solve ───────────────────────── */

function SolveSection({ data }: { data: DebriefData }) {
  return (
    <NumberedSection n="02" title="Work the solve" meta="see the fork · lock the call · C³">
      {/* Station 1 — see the fork */}
      <Station glyph="⑂" round title="See the fork" desc="violation vs. remedy">
        <div className="border border-zinc-300 bg-zinc-50 px-4 py-3">
          <Eyebrow>▌ The key legal question</Eyebrow>
          <p className="mt-2 font-serif text-[15px] leading-relaxed text-zinc-900">{data.keyLegalQuestion}</p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-zinc-300 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-wide text-amber-700">
              ↯ The axis — what splits the survivors
            </p>
            <p className="mt-1.5 font-serif text-sm text-zinc-900">{data.tension.axis}</p>
          </div>
          <div className="border border-zinc-300 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-wide text-green-800">
              ◉ The resolver — what the call decides
            </p>
            <p className="mt-1.5 font-serif text-sm text-zinc-900">{data.tension.resolver}</p>
          </div>
        </div>
      </Station>

      {/* Station 2 — lock the call */}
      <Station glyph="◉" title="Lock the call" desc={`remedy = ${data.callVerb}`}>
        <div className="border border-zinc-950 bg-[rgba(194,65,12,0.04)] px-5 py-4">
          <Eyebrow>▌ The call fixes the remedy</Eyebrow>
          <p className="mt-2 font-serif text-lg italic text-zinc-900">
            {data.call} <span className="font-semibold not-italic text-red-700">{data.callVerb} the easement.</span>
          </p>
          <p className="mt-2 font-serif text-[14.5px] leading-relaxed text-zinc-700">{data.callResolution}</p>
        </div>
      </Station>

      {/* Station 3 — Cut → Clash → Call */}
      <Station glyph="C³" title="Cut → Clash → Call" desc={`run the program · lands on ${data.residual}`}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="border border-zinc-300 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">① Cut</p>
            <div className="mt-2 flex flex-col gap-2">
              {data.cut.map((x) => (
                <div key={x.letter} className="flex gap-2">
                  <span className="flex h-5 w-5 flex-none items-center justify-center border border-zinc-400 font-mono text-[10px] font-bold text-zinc-500 line-through">
                    {x.letter}
                  </span>
                  <span className="text-[12px] leading-snug text-zinc-700">{x.note}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 border-t border-zinc-200 pt-2 font-mono text-[10px] uppercase tracking-wide text-green-800">
              Residual: {data.residual}
            </p>
          </div>
          <div className="border border-zinc-300 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">② Clash</p>
            <p className="mt-2 font-serif text-[17px] italic leading-snug text-zinc-900">{data.clash}</p>
          </div>
          <div className="bg-zinc-950 px-4 py-3 text-white">
            <p className="font-mono text-[9px] uppercase tracking-wide text-red-400">③ Call</p>
            <p className="mt-2 font-serif text-[15px] leading-snug">{data.callResolution}</p>
          </div>
        </div>
      </Station>

      {/* Keys payoff */}
      <div className="mt-7">
        <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">▌ Bank the keys you just earned</p>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <KeyCardView tone="gold" k={data.goldKey} />
          <KeyCardView tone="silver" k={data.silverKey} />
        </div>
      </div>
    </NumberedSection>
  );
}

function Station({
  glyph,
  round,
  title,
  desc,
  children,
}: {
  glyph: string;
  round?: boolean;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-dashed border-zinc-300 py-6 first:border-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center border border-red-700 font-mono text-sm text-red-700 ${
            round ? "rounded-full" : ""
          }`}
        >
          {glyph}
        </span>
        <h3 className="font-serif text-[21px] font-bold text-zinc-950">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-zinc-200" />
        <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">{desc}</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function KeyCardView({ tone, k }: { tone: "gold" | "silver"; k: KeyCard }) {
  const accent = tone === "gold" ? "border-amber-500" : "border-zinc-400";
  const chip = tone === "gold" ? "text-amber-700" : "text-zinc-500";
  return (
    <div className={`border-2 ${accent} bg-white px-5 py-4`}>
      <p className={`font-mono text-[9px] uppercase tracking-[0.16em] ${chip}`}>
        ⚷ {tone} key · {k.kind} · {k.id}
      </p>
      <p className="mt-2 font-serif text-[15px] leading-relaxed text-zinc-900">{k.statement}</p>
      <dl className="mt-3 space-y-1 border-t border-zinc-200 pt-3 text-[12px] text-zinc-600">
        {k.unlocks && (
          <div className="flex gap-2">
            <dt className="font-mono uppercase tracking-wide text-zinc-400">Unlocks</dt>
            <dd>{k.unlocks}</dd>
          </div>
        )}
        {k.navigates && (
          <div className="flex gap-2">
            <dt className="font-mono uppercase tracking-wide text-zinc-400">Navigates</dt>
            <dd>{k.navigates}</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="font-mono uppercase tracking-wide text-zinc-400">Trigger</dt>
          <dd>{k.trigger}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-mono uppercase tracking-wide text-zinc-400">Tested-by</dt>
          <dd>choice {k.testedChoice}</dd>
        </div>
      </dl>
      {k.authority && (
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-zinc-400">{k.authority}</p>
      )}
    </div>
  );
}

/* ───────────────────────── 03 facts ───────────────────────── */

function FactsSection({ data }: { data: DebriefData }) {
  return (
    <NumberedSection n="03" title="Facts in the stem" meta="each fact → how you use it">
      <div className="border border-zinc-300">
        <div className="grid grid-cols-[1.4fr_1fr_1.4fr] gap-3 border-b border-zinc-300 bg-zinc-50 px-4 py-2 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
          <span>Fact in the stem</span>
          <span>Role</span>
          <span>How you use it</span>
        </div>
        {data.triggerFacts.map((f, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1.4fr_1fr_1.4fr] items-start gap-3 border-b border-zinc-200 px-4 py-3 last:border-0 ${
              f.type === "call" ? "bg-[rgba(200,16,46,0.04)]" : ""
            }`}
          >
            <span className="flex gap-2 font-serif text-sm text-zinc-900">
              <span aria-hidden className={`mt-1.5 h-2 w-2 flex-none rounded-full ${TONE_PIP[f.type]}`} />
              {f.fact}
            </span>
            <span className="text-[12px] text-zinc-600">{f.role}</span>
            <span className={`text-[12px] ${TONE_TEXT[f.type]}`}>{f.use}</span>
          </div>
        ))}
      </div>
    </NumberedSection>
  );
}

/* ───────────────────────── 04 molds + wrong-answer log ───────────────────────── */

function MoldsSection({ data }: { data: DebriefData }) {
  return (
    <NumberedSection n="04" title="How the traps are built" meta="trap taxonomy + full log">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.molds.map((m) => (
          <div key={m.code} className="border border-zinc-300 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-serif text-[15px] font-bold text-zinc-950">{m.label}</p>
              <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">choice {m.choice}</span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">
              {m.code} · {m.family}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-700">{m.definition}</p>
            <p className="mt-2 font-serif text-[12.5px] italic text-zinc-600">{m.tell}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
        ▌ Wrong-answer log — full explanations
      </p>
      <div className="mt-3 border border-zinc-300">
        {data.choices.map((c) => {
          const credited = c.letter === data.correctLetter;
          return (
            <div key={c.letter} className="border-b border-zinc-200 px-4 py-3 last:border-0">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center border font-mono text-[11px] font-bold ${
                    credited ? "border-green-800 bg-green-800 text-white" : "border-zinc-400 text-zinc-700"
                  }`}
                >
                  {c.letter}
                </span>
                <span className="font-serif text-sm text-zinc-900">{c.text}</span>
                <span
                  className={`ml-auto whitespace-nowrap font-mono text-[9px] uppercase tracking-wide ${
                    credited ? "text-green-800" : c.dominant ? "text-red-700" : "text-zinc-400"
                  }`}
                >
                  {credited ? "✓ Credited" : c.dominant ? "▲ Dominant trap" : (c.studentLabel ?? "")}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-700">
                {credited ? c.fullRight : c.fullWrong}
              </p>
              {!credited && c.recovery && (
                <p className="mt-1.5 font-mono text-[11px] text-red-700">Recovery · {c.recovery}</p>
              )}
            </div>
          );
        })}
      </div>
    </NumberedSection>
  );
}

/* ───────────────────────── 05 bank it ───────────────────────── */

function BankItSection({ data }: { data: DebriefData }) {
  return (
    <NumberedSection n="05" title="Bank it" meta="one line to remember">
      <div className="relative border border-zinc-950 bg-[#fff8d6] px-6 py-6">
        <span aria-hidden className="absolute left-3 top-1 font-serif text-5xl leading-none text-amber-300">
          “
        </span>
        <p className="pl-6 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
          ▌ Review truth — bank this one line
        </p>
        <p className="mt-2 pl-6 font-serif text-lg font-medium leading-relaxed text-zinc-900">
          {data.reviewTruth}
        </p>
      </div>
    </NumberedSection>
  );
}

/* ───────────────────────── 06 repair ───────────────────────── */

function RepairSection({
  data,
  onStartRepair,
  onOpenRedZoneMap,
}: {
  data: DebriefData;
  onStartRepair?: () => void;
  onOpenRedZoneMap?: () => void;
}) {
  return (
    <NumberedSection n="06" title="Repair this pattern" meta="red-zone map + repair drill">
      <div className="flex flex-wrap items-center gap-3 border border-zinc-300 bg-zinc-50 px-4 py-3">
        <span aria-hidden className="text-red-700">⚷</span>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">
            ▌ This pattern is one of your Red Zones
          </p>
          <p className="font-serif text-sm font-semibold text-zinc-900">
            Red-Zone #{data.redZone.rank} · {data.redZone.label}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenRedZoneMap}
          className="ml-auto font-mono text-[11px] uppercase tracking-wide text-red-700 hover:underline"
        >
          Open Red-Zone Map ↗
        </button>
      </div>

      <div className="mt-4 border border-zinc-950">
        <p className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 font-mono text-[10px] uppercase tracking-wide text-zinc-700">
          ▌ Queued for repair · {data.remediation.cardId}
        </p>
        <div className="px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-zinc-950">{data.remediation.title}</h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
            {data.remediation.queueMeta} · confidence: {data.remediation.confidence}
          </p>
          <dl className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200">
            <RepairRung label="Signal" value={data.remediation.signal} />
            <RepairRung label="Move" value={data.remediation.studentMove} />
            <RepairRung label="Tiny rule" value={data.remediation.tinyRule} />
          </dl>
          <button type="button" onClick={onStartRepair} className="btn red btn-lg mt-5">
            Start repair →
          </button>
        </div>
      </div>
    </NumberedSection>
  );
}

function RepairRung({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 py-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="text-[13px] leading-6 text-zinc-900">{value}</dd>
    </div>
  );
}

/* ───────────────────────── mid-drill bar ───────────────────────── */

function DrillBar({
  data,
  session,
  onContinue,
}: {
  data: DebriefData;
  session?: { index: number; total: number; percent: number; minutesLeft: number };
  onContinue?: () => void;
}) {
  const s = session ?? { index: 4, total: 6, percent: 66, minutesLeft: 7 };
  return (
    <div className="sticky bottom-0 z-10 border-t-[3px] border-red-700 bg-zinc-950 text-white shadow-[0_-10px_28px_rgba(0,0,0,0.2)]">
      <div className="mx-auto grid max-w-[1000px] grid-cols-[1fr_auto] items-center gap-5 px-6 py-3 sm:grid-cols-[1fr_auto_auto] sm:px-8">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2.5 w-2.5 flex-none animate-pulse rounded-full bg-red-600" />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">
              You’re mid-drill · {data.remediation.queueTitle}
            </p>
            <p className="font-serif text-sm">
              Question {s.index} of {s.total} · ~{s.minutesLeft} min left in this set
            </p>
          </div>
        </div>
        <div className="hidden w-40 sm:block">
          <p className="text-right font-mono text-[10px] text-zinc-300">{s.percent}%</p>
          <div className="mt-1 h-[5px] bg-white/15">
            <div className="h-full bg-green-700" style={{ width: `${s.percent}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="!border-0 bg-red-700 px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-red-800"
        >
          Continue drill →
        </button>
      </div>
    </div>
  );
}
