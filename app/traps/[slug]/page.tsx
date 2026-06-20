import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { humanizeSubject } from "@/lib/format-subject";
import { getTrapDetail } from "@/lib/traps";
import type { TrapExample, TrapKind } from "@/lib/api-client";
import { TrapDetailAnalytics } from "../trap-analytics";
import { YourTrapHistory } from "../your-trap-history";

export const revalidate = 60;

const KIND_LABEL: Record<TrapKind, string> = {
  forensic: "Architecture",
  misconception: "Misconception",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getTrapDetail(slug);
  if (!detail) {
    return { title: "Trap not found" };
  }
  return {
    title: `${detail.name} — Trap Taxonomy`,
    description: `How the "${detail.name}" wrong-answer architecture is built, where it shows up by subject, and the MBE questions that deploy it as a distractor.`,
  };
}

export default async function TrapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getTrapDetail(slug);
  if (!detail) {
    notFound();
  }

  const maxCount = detail.subject_distribution.reduce(
    (max, entry) => Math.max(max, entry.question_count),
    0,
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <TrapDetailAnalytics detail={detail} />

      <Link
        href="/traps"
        className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        ← All traps
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {detail.kinds.map((kind) => (
          <span
            key={kind}
            className="rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600"
          >
            {KIND_LABEL[kind] ?? kind}
          </span>
        ))}
        {detail.official ? (
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
            BarMatrix curated
          </span>
        ) : (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-700">
            Observed in bank
          </span>
        )}
      </div>

      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {detail.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        This trap appears as a wrong-answer choice in {detail.question_count}{" "}
        active {detail.question_count === 1 ? "question" : "questions"}. Spotting how
        it is built is the repair: read each example&apos;s &ldquo;why it&apos;s
        attractive&rdquo; before the &ldquo;why it&apos;s wrong.&rdquo;
      </p>

      {detail.subject_distribution.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Subject distribution
          </p>
          <ul className="mt-4 space-y-3">
            {detail.subject_distribution.map((entry) => {
              const subjectLabel = humanizeSubject(entry.subject);
              const pct =
                maxCount > 0
                  ? Math.round((entry.question_count / maxCount) * 100)
                  : 0;
              return (
                <li key={entry.subject}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-800">{subjectLabel}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      {entry.question_count}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100">
                    <div
                      className="h-1.5 rounded-full bg-zinc-800"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <YourTrapHistory slug={detail.slug} />

      <div className="mt-12">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-zinc-950">
            Example wrong choices
          </h2>
          {detail.examples_truncated && (
            <span className="font-mono text-xs text-zinc-500">
              first {detail.examples.length}
            </span>
          )}
        </div>
        {detail.examples.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-600">
            No example choices are loaded for this trap yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.examples.map((example, index) => (
              <li key={`${example.question_id}-${example.letter}-${index}`}>
                <TrapExampleCard example={example} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 rounded-lg border border-zinc-300 bg-zinc-50 p-6">
        <p className="text-zinc-800">
          Practice the questions that use this trap as a distractor and get full
          Wrong Answer Forensics on submit.
        </p>
        <Link
          href={`/practice?trap=${encodeURIComponent(detail.slug)}`}
          className="mt-4 inline-block rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Practice questions using this trap →
        </Link>
      </div>
    </section>
  );
}

function TrapExampleCard({ example }: { example: TrapExample }) {
  return (
    <details className="rounded-lg border border-zinc-200 bg-white p-4 open:border-zinc-400">
      <summary className="cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {example.external_id ?? "—"} · {example.subject} · Choice {example.letter}
        </span>
        <span className="mt-1 block text-zinc-900">{example.choice_text}</span>
      </summary>
      <div className="mt-4 space-y-4 border-t border-zinc-100 pt-4">
        {example.why_attractive && (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-700">
              Why it&apos;s attractive
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-700">
              {example.why_attractive}
            </p>
          </div>
        )}
        {example.why_wrong && (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
              Why it&apos;s wrong
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-700">
              {example.why_wrong}
            </p>
          </div>
        )}
        {example.future_cue && (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-700">
              Spot it next time
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-700">
              {example.future_cue}
            </p>
          </div>
        )}
      </div>
    </details>
  );
}
