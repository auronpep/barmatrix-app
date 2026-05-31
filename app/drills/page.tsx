"use client";

// Drill Library index — Web Component 04.
//   Tab 1 "Prescribed for you": red-zone-driven suggestions + resumable drills
//     (needs a signed-in, enrolled student; empty -> take the diagnostic).
//   Tab 2 "Catalog": tension- and trap-anchored drills from the active bank,
//     plus the seven existing subject quick-drills.
// Starting a drill creates a drill_assignments row and routes to the runner.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  api,
  ApiClientError,
  type DrillCatalogResponse,
  type DrillStartRequest,
  type PrescribedDrillsResponse,
  type PrescribedDrillSuggestion,
} from "@/lib/api-client";
import { useDashboard } from "@/lib/use-dashboard";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  SUBJECT_QUICK_DRILLS,
  humanizeTag,
  proficiencyBand,
  proficiencyPct,
} from "@/lib/drills";

type TabId = "prescribed" | "catalog";

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: "prescribed", label: "Prescribed for you" },
  { id: "catalog", label: "Catalog" },
];

export default function DrillsPage() {
  const dash = useDashboard();
  const { isLoaded: authLoaded, isSignedIn: authSignedIn, getToken } = useClerkAuth();
  const studentId = dash.data?.student_id ?? null;
  const router = useRouter();

  const [tab, setTab] = useState<TabId>("prescribed");
  const [catalog, setCatalog] = useState<DrillCatalogResponse | null>(null);
  const [prescribed, setPrescribed] = useState<PrescribedDrillsResponse | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const viewedRef = useRef(false);

  // Catalog is anonymous + cacheable.
  useEffect(() => {
    let active = true;
    api
      .getDrillCatalog()
      .then((c) => {
        if (active) setCatalog(c);
      })
      .catch(() => {
        if (active) setCatalog({ tensions: [], traps: [] });
      });
    return () => {
      active = false;
    };
  }, []);

  // Prescribed needs a Clerk token.
  useEffect(() => {
    if (!authLoaded || !authSignedIn) return;
    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token || !active) return;
        const p = await api.getPrescribedDrills(token);
        if (active) setPrescribed(p);
      } catch {
        if (active) setPrescribed({ suggested: [], in_progress: [] });
      }
    })();
    return () => {
      active = false;
    };
  }, [authLoaded, authSignedIn, getToken]);

  // Fire drill_library_viewed once, after the catalog resolves.
  useEffect(() => {
    if (viewedRef.current || !catalog) return;
    viewedRef.current = true;
    const freeCount = catalog.tensions.length + catalog.traps.length;
    const prescribedCount = prescribed
      ? prescribed.suggested.length + prescribed.in_progress.length
      : 0;
    trackAnalyticsEvent("drill_library_viewed", {
      free_count: freeCount,
      prescribed_count: prescribedCount,
      student_id: studentId ?? undefined,
    });
  }, [catalog, prescribed, studentId]);

  const startDrill = useCallback(
    async (key: string, payload: DrillStartRequest) => {
      if (busy) return;
      setBusy(key);
      setStartError(null);
      try {
        const token = authSignedIn ? await getToken() : null;
        const res = await api.startDrill({ ...payload }, token);
        if (!res.drill_id) {
          setStartError(
            "No active questions matched that drill yet. Try another while the bank is loading.",
          );
          setBusy(null);
          return;
        }
        router.push(`/drills/${res.drill_id}`);
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          setStartError("Sign in to start a drill.");
        } else if (err instanceof ApiClientError && err.status === 403) {
          setStartError("Enrollment required — enroll at barmatrix.app/checkout.");
        } else {
          setStartError(
            err instanceof ApiClientError
              ? `Could not start drill (API ${err.status}).`
              : "Could not start drill.",
          );
        }
        setBusy(null);
      }
    },
    [busy, router, authSignedIn, getToken],
  );

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const idx = TABS.findIndex((t) => t.id === tab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const nextTab = TABS[(idx + delta + TABS.length) % TABS.length];
      if (nextTab) setTab(nextTab.id);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Drill Library
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Targeted repair drills, prescribed from your weakest patterns.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
          Run a focused set on one tension point or trap architecture. Every
          answer feeds the Wrong-Answer Forensics loop and moves your Red-Zone Map.
        </p>
      </div>

      {startError && (
        <p className="mt-6 border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {startError}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Drill views"
        className="mt-8 flex gap-2 border-b border-zinc-200"
      >
        {TABS.map((t) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              id={`drills-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`drills-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={onTabKeyDown}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition ${
                selected
                  ? "border-red-700 text-zinc-950"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "prescribed" && (
        <div
          role="tabpanel"
          id="drills-panel-prescribed"
          aria-labelledby="drills-tab-prescribed"
          className="mt-8"
        >
          <PrescribedPanel
            dash={dash}
            prescribed={prescribed}
            busy={busy}
            onStart={startDrill}
          />
        </div>
      )}

      {tab === "catalog" && (
        <div
          role="tabpanel"
          id="drills-panel-catalog"
          aria-labelledby="drills-tab-catalog"
          className="mt-8"
        >
          <CatalogPanel catalog={catalog} busy={busy} onStart={startDrill} />
        </div>
      )}
    </section>
  );
}

function PrescribedPanel({
  dash,
  prescribed,
  busy,
  onStart,
}: {
  dash: ReturnType<typeof useDashboard>;
  prescribed: PrescribedDrillsResponse | null;
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  if (dash.loading) {
    return <p className="text-sm text-zinc-600">Loading your prescribed drills…</p>;
  }
  if (!dash.signedIn) {
    return (
      <EmptyState
        text="Sign in to see drills prescribed from your Red-Zone Map."
        href="/sign-in"
        label="Sign in"
      />
    );
  }
  if (dash.data && !dash.data.enrolled) {
    return (
      <EmptyState
        text="Enroll to unlock prescribed repair drills targeted at your weakest patterns."
        href="/checkout"
        label="Enroll now"
      />
    );
  }

  const suggested = prescribed?.suggested ?? [];
  const inProgress = prescribed?.in_progress ?? [];
  const review = prescribed?.review;
  const hasReview = !!review && review.available_count > 0;

  if (suggested.length === 0 && inProgress.length === 0 && !hasReview) {
    return (
      <EmptyState
        text="No prescribed drills yet. Take the diagnostic to build your Red-Zone Map and unlock targeted drills."
        href="/diagnostic"
        label="Take the diagnostic"
      />
    );
  }

  return (
    <div className="space-y-10">
      {hasReview && review && (
        <section aria-labelledby="review-heading">
          <h2
            id="review-heading"
            className="font-mono text-xs uppercase tracking-wider text-zinc-700"
          >
            Review your misses
          </h2>
          <div className="mt-4">
            <article className="flex flex-col border border-red-300 bg-red-50 p-5 md:max-w-md">
              <h3 className="font-serif text-xl font-semibold leading-tight text-zinc-950">
                Review missed questions
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                {review.available_count} question
                {review.available_count === 1 ? "" : "s"} you most recently
                missed, newest first.
              </p>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() =>
                  onStart("review", { kind: "review", size: review.suggested_size })
                }
                className="btn btn-sm red mt-4 self-start"
              >
                {busy === "review" ? "Starting…" : "Start review drill"}
              </button>
            </article>
          </div>
        </section>
      )}

      {inProgress.length > 0 && (
        <section aria-labelledby="resume-heading">
          <h2
            id="resume-heading"
            className="font-mono text-xs uppercase tracking-wider text-zinc-700"
          >
            Resume
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((d) => (
              <article key={d.drill_id} className="border border-zinc-300 bg-white p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  {d.red_zone_dimension ? humanizeTag(d.red_zone_dimension) : "In progress"}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-zinc-950">
                  {d.drill_name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{d.question_count} questions</p>
                <Link href={`/drills/${d.drill_id}`} className="btn btn-sm red mt-4">
                  Resume drill
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {suggested.length > 0 && (
        <section aria-labelledby="suggested-heading">
          <h2
            id="suggested-heading"
            className="font-mono text-xs uppercase tracking-wider text-zinc-700"
          >
            Prescribed from your red zones
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggested.map((s) => (
              <SuggestionCard key={`${s.red_zone_dimension}:${s.red_zone_tag}`} s={s} busy={busy} onStart={onStart} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SuggestionCard({
  s,
  busy,
  onStart,
}: {
  s: PrescribedDrillSuggestion;
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  const key = `pre:${s.red_zone_dimension}:${s.red_zone_tag}`;
  const band = proficiencyBand(s.proficiency_score);
  const tone =
    band.tone === "critical"
      ? "text-red-700"
      : band.tone === "watch"
        ? "text-amber-700"
        : "text-emerald-700";
  return (
    <article className="flex flex-col border border-zinc-300 bg-white p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {humanizeTag(s.red_zone_dimension)}
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-zinc-950">
        {s.label}
      </h3>
      <p className={`mt-2 font-mono text-xs uppercase tracking-wider ${tone}`}>
        {band.label} · {proficiencyPct(s.proficiency_score)}% proficiency
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        {s.candidate_question_count} questions available
      </p>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() =>
          onStart(key, {
            kind: "prescribed_red_zone",
            red_zone_dimension: s.red_zone_dimension,
            red_zone_tag: s.red_zone_tag,
            size: s.suggested_size,
          })
        }
        className="btn btn-sm red mt-4 self-start"
      >
        {busy === key ? "Starting…" : "Start drill"}
      </button>
    </article>
  );
}

function CatalogPanel({
  catalog,
  busy,
  onStart,
}: {
  catalog: DrillCatalogResponse | null;
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  if (!catalog) {
    return <p className="text-sm text-zinc-600">Loading the drill catalog…</p>;
  }
  return (
    <div className="space-y-10">
      <CatalogGroup
        heading="By tension point"
        empty="No tension-anchored drills are available in the active bank yet."
        items={catalog.tensions}
        kind="tension"
        busy={busy}
        onStart={onStart}
      />
      <CatalogGroup
        heading="By trap architecture"
        empty="No trap-anchored drills are available in the active bank yet."
        items={catalog.traps}
        kind="trap"
        busy={busy}
        onStart={onStart}
      />

      <section aria-labelledby="subjects-heading">
        <h2
          id="subjects-heading"
          className="font-mono text-xs uppercase tracking-wider text-zinc-700"
        >
          By subject
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECT_QUICK_DRILLS.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="border border-zinc-300 bg-white p-4 text-sm font-medium text-zinc-800 transition hover:border-zinc-500"
            >
              {s.label} quick drill →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function CatalogGroup({
  heading,
  empty,
  items,
  kind,
  busy,
  onStart,
}: {
  heading: string;
  empty: string;
  items: Array<{ slug: string; label: string; question_count: number }>;
  kind: "tension" | "trap";
  busy: string | null;
  onStart: (key: string, payload: DrillStartRequest) => void;
}) {
  return (
    <section aria-label={heading}>
      <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-700">{heading}</h2>
      {items.length === 0 ? (
        <p className="mt-4 border border-zinc-200 bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          {empty}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const key = `${kind}:${item.slug}`;
            return (
              <article key={key} className="flex flex-col border border-zinc-300 bg-white p-5">
                <h3 className="font-serif text-xl font-semibold leading-tight text-zinc-950">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{item.question_count} questions</p>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => onStart(key, { kind, slug: item.slug, size: 12 })}
                  className="btn btn-sm red mt-4 self-start"
                >
                  {busy === key ? "Starting…" : "Start drill"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyState({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-6">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      <Link
        href={href}
        className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
      >
        {label}
      </Link>
    </div>
  );
}
