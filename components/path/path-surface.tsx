"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api, type PathResponse } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import type { PathState } from "@/lib/use-path";
import NextStepCard from "./next-step-card";
import PathProgressStrip from "./path-progress-strip";
import MilestoneMap from "./milestone-map";

const CLAIM_KEY = "bm_path_claim";
type OptimisticOverride = {
  base: PathResponse | null;
  data: PathResponse;
};

// The "lead me" surface. Renders exactly one next task (or a caught-up state),
// the gamified progress strip, and the milestone map. Owns inline step completion
// and the off-page XP claim (foundations lesson). Receives the path state from
// usePath so a host page can gate on it without double-fetching.
export default function PathSurface({ state }: { state: PathState }) {
  const { getToken } = useClerkAuth();
  const [override, setOverride] = useState<OptimisticOverride | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const claimed = useRef(false);

  // One-shot: claim XP for an external step (foundations lesson) finished off-page.
  useEffect(() => {
    if (claimed.current) return;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(CLAIM_KEY);
    } catch {
      pending = null;
    }
    if (!pending) return;
    claimed.current = true;
    try {
      sessionStorage.removeItem(CLAIM_KEY);
    } catch {
      /* ignore */
    }
    let cancelled = false;
    void (async () => {
      const token = await getToken().catch(() => null);
      if (!token || cancelled) return;
      // 200 grants XP if the signal is satisfied; 422 (bailed early) is a no-op.
      await api.completePathStep(token, pending).catch(() => undefined);
      if (!cancelled) {
        await state.reload();
        setOverride(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, state]);

  const onInlineComplete = useCallback(
    async (stepId: string) => {
      setBusy(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("no token");
        const res = await api.completePathStep(token, stepId);
        const current = override?.data ?? state.data;
        if (current) {
          setOverride({
            base: state.data,
            data: {
              ...current,
              next_step: res.next_step,
              completed_steps:
                current.completed_steps + (res.status === "completed" ? 1 : 0),
              day_completed_steps:
                current.day_completed_steps + (res.status === "completed" ? 1 : 0),
              gamification: {
                ...current.gamification,
                total_xp: res.total_xp ?? current.gamification.total_xp,
              },
            },
          });
        }
        setFlash(res.xp_earned > 0 ? `+${res.xp_earned} XP` : null);
        state.reload();
      } catch {
        setFlash("Couldn't save — try again");
      } finally {
        setBusy(false);
      }
    },
    [getToken, override, state],
  );

  if (state.loading) {
    return <CenterNote>Loading your path…</CenterNote>;
  }
  if (!state.signedIn) {
    return (
      <Banner
        text="Sign in to start your guided path."
        cta={{ href: "/sign-in", label: "Sign in" }}
      />
    );
  }
  const notEnrolled = state.error?.includes("403") ?? false;
  if (notEnrolled || (!state.data && state.error)) {
    return (
      <Banner
        text="Enroll to unlock your guided path."
        cta={{ href: "/checkout", label: "Enroll now" }}
      />
    );
  }

  const data =
    override && override.base === state.data ? override.data : state.data;
  if (!data) {
    return <CenterNote>Loading your path…</CenterNote>;
  }

  const milestones = data.milestones.filter((m) => m.day === data.current_day);

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Your path
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          One task at a time. We&apos;ll lead.
        </h1>
      </header>

      <PathProgressStrip data={data} />

      {flash && (
        <p className="border border-emerald-300 bg-emerald-50 px-3 py-2 font-mono text-xs text-emerald-900">
          {flash}
        </p>
      )}

      {data.next_step ? (
        <NextStepCard
          step={data.next_step}
          busy={busy}
          onInlineComplete={onInlineComplete}
        />
      ) : (
        <section className="border-2 border-zinc-900 bg-white p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-red-700">
            All caught up
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
            You&apos;ve cleared everything available.
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-700">
            New tasks unlock as your program progresses. Want to go deeper now?
          </p>
          <Link
            href="/red-zones"
            className="mt-5 inline-block rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
          >
            Open your Red-Zone Map →
          </Link>
        </section>
      )}

      <MilestoneMap milestones={milestones} />
    </div>
  );
}

function CenterNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm leading-6 text-zinc-600">
      {children}
    </p>
  );
}

function Banner({
  text,
  cta,
}: {
  text: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
      <p className="text-sm leading-6 text-zinc-800">{text}</p>
      <Link
        href={cta.href}
        className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
      >
        {cta.label}
      </Link>
    </div>
  );
}
