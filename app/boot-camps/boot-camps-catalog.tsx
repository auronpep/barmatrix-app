"use client";

// Live catalog island for /boot-camps. Fetches the API catalog on mount and
// renders cards that deep-link to each camp's detail page. Degrades to a clear
// empty/error state when the boot-camps endpoint is not yet deployed (the seed
// migration is an operator step), rather than rendering placeholder camps.

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiClientError, type BootCampSummary } from "@/lib/api-client";
import { formatBootCampTargetLabel } from "@/lib/boot-camps";
import GamificationStrip from "./gamification-strip";

type State =
  | { phase: "loading" }
  | { phase: "ready"; camps: BootCampSummary[] }
  | { phase: "error"; message: string };

export default function BootCampCatalog() {
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    let active = true;
    api
      .listBootCamps({ cache: "no-store" })
      .then((res) => {
        if (!active) return;
        setState({ phase: "ready", camps: res.boot_camps });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof ApiClientError ? `API ${err.status}` : "Catalog unavailable";
        setState({ phase: "error", message });
      });
    return () => {
      active = false;
    };
  }, []);

  if (state.phase === "loading") {
    return (
      <div className="border border-zinc-300 bg-white p-8" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Loading camps</p>
        <p className="mt-3 text-zinc-700">Loading the boot camp catalog…</p>
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <div className="border border-amber-300 bg-amber-50 p-8" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
          Catalog unavailable
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-amber-950">
          The boot camp catalog is not reachable yet.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-900">
          The boot camp endpoints come online once the camp tables are applied to
          the database. Check back shortly — your other surfaces still work.
        </p>
        <p className="mt-3 font-mono text-xs text-amber-800">{state.message}</p>
      </div>
    );
  }

  if (state.camps.length === 0) {
    return (
      <div className="border border-zinc-300 bg-white p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">No camps yet</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-zinc-900">
          No boot camps are published yet.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Camps appear here as soon as they are seeded. In the meantime, run the
          diagnostic to build your Red-Zone Map.
        </p>
        <Link href="/diagnostic" className="btn red mt-6">
          Start the diagnostic
        </Link>
      </div>
    );
  }

  return (
    <>
      <GamificationStrip />
      <div className="grid gap-6">
      {state.camps.map((camp) => (
        <article
          key={camp.slug}
          className="border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                <span className="border border-zinc-200 px-2 py-1">{camp.subject}</span>
                <span className="border border-zinc-200 px-2 py-1">
                  {camp.day_count} days
                </span>
                <span className="border border-zinc-200 px-2 py-1">
                  {camp.questions_per_day}/day
                </span>
              </div>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                {camp.display_name}
              </h2>
              {camp.description && (
                <p className="mt-3 max-w-3xl text-zinc-600">{camp.description}</p>
              )}
            </div>
            <Link href={`/boot-camps/${camp.slug}`} className="btn red shrink-0">
              View camp <span className="arrow">-&gt;</span>
            </Link>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <TagGroup label="Tension points" values={camp.target_tensions} />
            <TagGroup label="Trap architectures" values={camp.target_traps} />
          </div>
        </article>
      ))}
    </div>
    </>
  );
}

function TagGroup({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
          >
            {formatBootCampTargetLabel(value)}
          </span>
        ))}
      </div>
    </div>
  );
}
