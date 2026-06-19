"use client";

// Live catalog island for /boot-camps. Fetches the API catalog on mount and
// renders cards that deep-link to each camp's detail page. Empty/error states
// route students into active repair work instead of exposing operator setup.

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type BootCampSummary } from "@/lib/api-client";
import { formatBootCampTargetLabel } from "@/lib/boot-camps";
import GamificationStrip from "./gamification-strip";

type State =
  | { phase: "loading" }
  | { phase: "ready"; camps: BootCampSummary[] }
  | { phase: "error" };

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
      .catch(() => {
        if (!active) return;
        setState({ phase: "error" });
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
          Boot-camp queue recalibrating
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-amber-950">
          Keep building the Red-Zone signal that drives your camp.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-900">
          Your diagnostic, Red-Zone Map, and targeted drills stay active while
          the boot-camp queue calibrates from your recent work.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/red-zones" className="btn red">
            Open Red-Zone Map
          </Link>
          <Link href="/drills" className="btn ghost">
            Work drills
          </Link>
        </div>
      </div>
    );
  }

  if (state.camps.length === 0) {
    return (
      <div className="border border-zinc-300 bg-white p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Boot-camp queue
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-zinc-900">
          Your next sequence starts from your Red-Zone Map.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Keep working the diagnostic and targeted drills. As your weak patterns
          sharpen, this page routes you into the focused sequence that fits the
          signal.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/red-zones" className="btn red">
            Open Red-Zone Map
          </Link>
          <Link href="/drills" className="btn ghost">
            Work drills
          </Link>
        </div>
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
