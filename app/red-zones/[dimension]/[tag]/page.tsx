"use client";

// Red Zone detail — one weak area, opened from the Red Zone Library. Shows the
// zone's stats, the questions inside it, the recent wrong-answer forensics that
// built it, and a one-click repair drill into the existing /drills/{subject}
// runner. Auth + enrollment states mirror the library index.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import {
  api,
  ApiClientError,
  type RedZoneDetail,
  type RedZoneDetailWrong,
} from "@/lib/api-client";
import { trackDrillStarted } from "@/lib/analytics";

const KNOWN_DRILL_SLUGS = new Set([
  "civil-procedure",
  "constitutional-law",
  "contracts",
  "criminal-law",
  "evidence",
  "real-property",
  "torts",
]);

type DetailState =
  | { phase: "loading" }
  | { phase: "signed-out" }
  | { phase: "error"; message: string }
  | { phase: "ready"; data: RedZoneDetail };

interface FetchResult {
  key: string;
  data: RedZoneDetail | null;
  error: string | null;
}

export default function RedZoneDetailPage() {
  const params = useParams<{ dimension: string; tag: string }>();
  const dimension = firstParam(params?.dimension);
  const tag = firstParam(params?.tag);
  const routeKey = `${dimension}/${tag}`;
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [result, setResult] = useState<FetchResult | null>(null);

  // The effect only writes state from its async callback (never synchronously),
  // so loading / signed-out / missing-param are DERIVED in render below — same
  // shape as lib/use-dashboard.ts. The result carries its routeKey so a stale
  // fetch from a previous zone is ignored after client-side navigation.
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !dimension || !tag) return;
    let cancelled = false;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const data = await api.getMyRedZoneDetail(token, dimension, tag);
        if (!cancelled) setResult({ key: routeKey, data, error: null });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiClientError
            ? `API ${err.status}`
            : err instanceof Error
              ? err.message
              : "Unknown error";
        setResult({ key: routeKey, data: null, error: message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, dimension, tag, routeKey]);

  const view = resolveView(isLoaded, isSignedIn, dimension, tag, routeKey, result);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/red-zones" className="btn btn-sm ghost">
          ← Red Zone Library
        </Link>
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {titleize(dimension) || "Red zone"}
        </p>
      </div>

      <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {tag ? decodeURIComponent(tag) : "Red zone"}
      </h1>

      {view.phase === "loading" && (
        <p className="mt-12 text-zinc-600">Loading this red zone…</p>
      )}

      {view.phase === "signed-out" && <SignedOut />}

      {view.phase === "error" && (
        <div className="mt-12 rounded-lg border border-red-200 bg-red-50 p-8">
          <p className="font-medium text-red-800">Couldn&apos;t load this red zone.</p>
          <p className="mt-2 font-mono text-xs text-red-700">{view.message}</p>
        </div>
      )}

      {view.phase === "ready" && <ReadyView data={view.data} />}
    </section>
  );
}

function ReadyView({ data }: { data: RedZoneDetail }) {
  if (!data.enrolled) {
    return (
      <div className="mt-12 rounded-lg border border-zinc-300 bg-zinc-50 p-8">
        <p className="text-zinc-800">
          Enroll to unlock your Red Zone Library and the repair drill for this
          zone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/checkout" className="rounded-md bg-zinc-950 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700">
            Enroll now
          </Link>
          <Link href="/diagnostic" className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100">
            Take the diagnostic
          </Link>
        </div>
      </div>
    );
  }

  const pct =
    data.zone != null
      ? clampPct(Math.round(normalizeScore(data.zone.proficiency_score) * 100))
      : null;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        {data.zone ? (
          <section className="border border-zinc-300 bg-white p-6" aria-labelledby="zone-stats">
            <p id="zone-stats" className="font-mono text-xs uppercase tracking-wider text-zinc-700">
              Zone status
            </p>
            <div className="mt-4 h-3 w-full overflow-hidden border border-zinc-900 bg-zinc-100">
              <div className="h-full bg-red-700" style={{ width: `${pct}%` }} aria-hidden="true" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Proficiency" value={`${pct}%`} />
              <Stat label="Attempts" value={String(data.zone.attempts)} />
              <Stat label="HC wrong" value={String(data.zone.high_confidence_wrongs)} />
              <Stat label="Questions" value={String(data.zone.question_count)} />
            </div>
          </section>
        ) : (
          <section className="border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-sm leading-6 text-zinc-700">
              You haven&apos;t built this zone yet — it has no recorded attempts.
              Run the repair drill or the diagnostic to start tracking it.
            </p>
          </section>
        )}

        <RecentWrongs wrongs={data.recent_wrongs} />
        <ZoneQuestions data={data} />
      </div>

      <RepairRail data={data} />
    </div>
  );
}

function RepairRail({ data }: { data: RedZoneDetail }) {
  const slug = data.repair_slug;
  const canDrill = !!slug && KNOWN_DRILL_SLUGS.has(slug);

  const onStart = () => {
    trackDrillStarted({
      drillId: data.drill?.drill_slug ?? slug ?? `${data.dimension}-${data.tag}`,
      source: "red_zone",
      subject: data.repair_subject ?? undefined,
    });
  };

  return (
    <aside className="border border-zinc-900 bg-zinc-950 p-6 text-white lg:sticky lg:top-6">
      <p className="font-mono text-xs uppercase tracking-wider text-red-300">
        Repair this zone
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
        {data.drill?.drill_name ?? "Targeted repair drill"}
      </h2>
      {data.drill?.reason && (
        <p className="mt-3 text-sm leading-7 text-zinc-200">{data.drill.reason}</p>
      )}
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-zinc-400">
        {data.repair_subject ? `${data.repair_subject} drill` : "Repair queue"}
      </p>

      {canDrill ? (
        <Link
          href={`/drills/${slug}`}
          onClick={onStart}
          className="btn btn-lg mt-6 w-full bg-white text-center text-zinc-950 hover:bg-red-700 hover:text-white"
        >
          Start repair drill
        </Link>
      ) : (
        <p className="mt-6 border border-zinc-700 bg-zinc-900 p-4 text-sm leading-6 text-zinc-300">
          A subject repair drill isn&apos;t available for this zone yet. Review
          the questions and recent forensics below, then practice from your
          dashboard.
        </p>
      )}

      <Link href="/dashboard" className="mt-4 block text-center font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white">
        Back to dashboard
      </Link>
    </aside>
  );
}

function RecentWrongs({ wrongs }: { wrongs: RedZoneDetailWrong[] }) {
  return (
    <section aria-labelledby="recent-wrongs">
      <h2 id="recent-wrongs" className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
        Recent wrong-answer forensics · {wrongs.length}
      </h2>
      {wrongs.length === 0 ? (
        <p className="mt-4 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          No wrong attempts recorded in this zone yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {wrongs.map((w) => (
            <li key={w.attempt_id} className="border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-serif text-lg font-semibold text-zinc-950">{w.trap_name}</p>
                <span className="shrink-0 border border-amber-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-800">
                  Selected {w.selected_letter ?? "-"}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {w.subject ?? "General"}
                {w.subtopic ? ` · ${w.subtopic}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ZoneQuestions({ data }: { data: RedZoneDetail }) {
  const count = data.zone?.question_count ?? data.questions.length;
  return (
    <section aria-labelledby="zone-questions">
      <h2 id="zone-questions" className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
        Questions in this zone · {count}
      </h2>
      {data.questions.length === 0 ? (
        <p className="mt-4 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          No active questions are mapped to this zone yet.
        </p>
      ) : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.questions.map((q) => (
            <li key={q.question_id} className="border border-zinc-200 bg-white p-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                {q.external_id ?? q.question_id.slice(0, 8)}
              </p>
              <p className="mt-1 text-sm text-zinc-800">
                {q.subtopic ?? q.subject ?? "General"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold leading-none text-zinc-950">{value}</p>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="mt-12 rounded-lg border border-zinc-300 bg-zinc-50 p-8">
      <p className="text-zinc-800">Sign in to open this red zone and its repair drill.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/sign-in" className="rounded-md bg-zinc-950 px-6 py-3 text-base font-medium text-white hover:bg-zinc-700">
          Sign in
        </Link>
        <Link href="/red-zones" className="rounded-md border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-100">
          Back to library
        </Link>
      </div>
    </div>
  );
}

function resolveView(
  isLoaded: boolean,
  isSignedIn: boolean,
  dimension: string,
  tag: string,
  routeKey: string,
  result: FetchResult | null,
): DetailState {
  if (!isLoaded) return { phase: "loading" };
  if (!isSignedIn) return { phase: "signed-out" };
  if (!dimension || !tag) {
    return { phase: "error", message: "Missing red-zone reference." };
  }
  if (!result || result.key !== routeKey) return { phase: "loading" };
  if (result.data) return { phase: "ready", data: result.data };
  return { phase: "error", message: result.error ?? "Unknown error" };
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function titleize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
