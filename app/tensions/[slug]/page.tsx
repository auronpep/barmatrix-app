import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTensionDetail } from "@/lib/tensions";
import type { TensionExample } from "@/lib/api-client";
import { TensionDetailAnalytics } from "../tension-analytics";
import { TensionQuestionsClient } from "./tension-questions-client";

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getTensionDetail(slug);
  if (!detail) {
    return { title: "Tension not found" };
  }
  return {
    title: `${detail.name} — Tension Map`,
    description: detail.legal_collision
      ? `${detail.name}: ${detail.legal_collision}`
      : `The "${detail.name}" tension point and the MBE questions targeted to it.`,
  };
}

export default async function TensionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getTensionDetail(slug);
  if (!detail) {
    notFound();
  }

  const maxCount = detail.subject_distribution.reduce(
    (max, entry) => Math.max(max, entry.question_count),
    0,
  );

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <TensionDetailAnalytics detail={detail} />

      <Link
        href="/tensions"
        className="rounded-md font-mono text-xs uppercase tracking-wider text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        ← Tension Map
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {detail.subject && (
          <span className="rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            {detail.subject}
          </span>
        )}
        {detail.domain && (
          <span className="rounded-full border border-zinc-300 bg-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            {detail.domain}
          </span>
        )}
        {detail.official ? (
          <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
            Curated tension
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
      <p className="mt-2 font-mono text-xs text-zinc-400">{detail.slug}</p>

      {!detail.catalog_ready && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          The curated tension catalog isn&apos;t provisioned in this environment
          yet, so this tension is derived from the live question bank. Curated
          copy (the doctrinal collision and decision axis) appears once the catalog
          migration is applied.
        </p>
      )}

      {detail.legal_collision && (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            The collision
          </p>
          <p className="mt-1 text-lg leading-7 text-zinc-800">
            {detail.legal_collision}
          </p>
        </div>
      )}

      {detail.decision_axis && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            How to decide it
          </p>
          <p className="mt-1 leading-7 text-zinc-800">{detail.decision_axis}</p>
        </div>
      )}

      {detail.common_misconceptions && (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-red-700">
            Where students go wrong
          </p>
          <p className="mt-1 leading-7 text-zinc-700">
            {detail.common_misconceptions}
          </p>
        </div>
      )}

      <p className="mt-6 max-w-2xl text-zinc-600">
        This tension shows up in {detail.question_count} active{" "}
        {detail.question_count === 1 ? "question" : "questions"}. Practice them and
        get full Wrong Answer Forensics on submit.
      </p>

      {detail.subject_distribution.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Subject distribution
          </p>
          <ul className="mt-4 space-y-3">
            {detail.subject_distribution.map((entry) => {
              const pct =
                maxCount > 0
                  ? Math.round((entry.question_count / maxCount) * 100)
                  : 0;
              return (
                <li key={entry.subject}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-800">{entry.subject}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      {entry.question_count}
                    </span>
                  </div>
                  <div
                    className="mt-1 h-1.5 w-full rounded-full bg-zinc-100"
                    role="progressbar"
                    aria-label={`${entry.subject}: ${entry.question_count} questions (${pct}% of maximum)`}
                    aria-valuenow={entry.question_count}
                    aria-valuemax={maxCount}
                  >
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

      <div className="mt-12">
        <div className="flex items-baseline justify-between border-b border-zinc-200 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-zinc-950">
            Questions targeted to this tension
          </h2>
          {detail.examples_truncated && (
            <span className="font-mono text-xs text-zinc-500">
              showing {detail.examples.length} of {detail.question_count}
            </span>
          )}
        </div>
        {detail.examples.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-600">
            No questions are loaded for this tension yet.
          </p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {detail.examples.map((example) => (
                <li key={example.question_id}>
                  <TensionExampleCard example={example} tensionSlug={detail.slug} />
                </li>
              ))}
            </ul>
            {detail.examples_truncated && (
              <TensionQuestionsClient
                slug={detail.slug}
                initialCount={detail.examples.length}
                totalCount={detail.question_count}
                initialPage={0}
                pageSize={12}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-12 rounded-lg border border-zinc-300 bg-zinc-50 p-6">
        <p className="text-zinc-800">
          Drill the questions built on this tension and see why each wrong answer
          looked right.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/practice?tension=${encodeURIComponent(detail.slug)}`}
            className="inline-block rounded-md bg-red-700 px-6 py-3 text-base font-medium text-white hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Practice this tension →
          </Link>
          <Link
            href={`/drills?tension=${encodeURIComponent(detail.slug)}`}
            className="inline-block rounded-md border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            See drills for this tension
          </Link>
        </div>
      </div>
    </section>
  );
}

function TensionExampleCard({
  example,
  tensionSlug,
}: {
  example: TensionExample;
  tensionSlug: string;
}) {
  return (
    <Link
      href={`/practice?tension=${encodeURIComponent(tensionSlug)}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {example.external_id ?? "—"} · {example.subject}
        {example.subtopic ? ` · ${example.subtopic}` : ""}
      </p>
      {example.stem_preview && (
        <p className="mt-1 text-sm leading-6 text-zinc-700">
          {example.stem_preview}
        </p>
      )}
    </Link>
  );
}
