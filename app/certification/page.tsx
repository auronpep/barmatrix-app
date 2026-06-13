"use client";

import Link from "next/link";
import { useState } from "react";
import { useCertification } from "@/lib/use-certification";
import type { CertCompetencyStatus } from "@/lib/api-client";

export default function CertificationPage() {
  const { loading, signedIn, data, error } = useCertification();

  if (loading) {
    return (
      <Shell>
        <h1 className="sr-only">C3 Mastery Certification</h1>
        <p className="font-mono text-sm text-zinc-500">Loading certification…</p>
      </Shell>
    );
  }

  if (!signedIn) {
    return (
      <Shell>
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          C3 Mastery Certification
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
          Prove you can run the method.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
          The C3 Mastery Certification verifies the one skill the MBE actually
          rewards: cut the answers that are wrong on the law, clash the final two,
          and call the controlling distinction — across all ten C3 competencies.
          You earn it inside BarMatrix Flagship by finishing The Method and
          confirming each competency.
        </p>

        <div className="mt-8 border-2 border-zinc-900 bg-zinc-950 p-6 text-white">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            How you earn it
          </p>
          <ol className="mt-3 space-y-2 text-sm text-zinc-200">
            <li>
              <span className="font-semibold text-white">1 · Diagnose</span> — take
              the free MBE Trap Diagnostic to build your Red-Zone Map.
            </li>
            <li>
              <span className="font-semibold text-white">2 · Repair</span> — work The
              Method and your assigned drills until the traps stop firing.
            </li>
            <li>
              <span className="font-semibold text-white">3 · Confirm</span> — pass all
              ten C3 competencies to confirm your C3 Mastery.
            </li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
          >
            Sign in →
          </Link>
          <Link
            href="/diagnostic"
            className="rounded-md border border-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Take the free diagnostic
          </Link>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Certification is part of BarMatrix Flagship.
        </p>
      </Shell>
    );
  }

  if (!data || error) {
    return (
      <Shell>
        <Banner href="/dashboard" cta="Dashboard">
          Couldn&apos;t load certification{error ? `: ${error}` : ""}.
        </Banner>
      </Shell>
    );
  }

  if (!data.unlocked) {
    return (
      <Shell>
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Certification — locked
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
          Finish The Method first
        </h1>
        <div className="mt-8 border-2 border-zinc-900 bg-zinc-950 p-6 text-white">
          <p className="font-serif text-2xl font-semibold">
            {data.lessons_completed} of {data.lesson_count} lessons complete
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            The certification unlocks once you finish all {data.lesson_count}{" "}
            lessons of The Method. Keep going — the gate opens automatically.
          </p>
          <Link href="/foundations" className="certification-method-cta">
            Go to The Method →
          </Link>
        </div>
      </Shell>
    );
  }

  const confirmed = data.overall === "CONFIRMED";

  return (
    <Shell>
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">
        {data.preview ? "Preview Certification" : "Certification"}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
        {data.title}
      </h1>
      <p className="mt-4 border-l-2 border-red-700 bg-zinc-50 py-3 pl-4 text-sm leading-6 text-zinc-700">
        {data.preview_note}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`inline-block rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wider ${
            confirmed
              ? "bg-emerald-700 text-white"
              : "border border-zinc-900 text-zinc-900"
          }`}
        >
          {confirmed ? "C3 Mastery confirmed ✓" : "Not yet confirmed"}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {data.overall_gate}
        </span>
      </div>

      <section className="mt-8">
        <h2 className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
          The ten competencies
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.competencies.map((c) => (
            <CompetencyCard key={c.id} comp={c} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

function CompetencyCard({ comp }: { comp: CertCompetencyStatus }) {
  const [now] = useState(() => Date.now());
  const lockedUntil =
    comp.retry_at && new Date(comp.retry_at).getTime() > now
      ? comp.retry_at
      : null;

  return (
    <Link
      href={`/certification/${comp.id}`}
      className="flex items-start justify-between gap-3 border border-zinc-300 bg-white p-4 hover:border-zinc-900"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {comp.id}
        </p>
        <p className="mt-1 font-serif text-lg font-semibold leading-tight text-zinc-950">
          {comp.title}
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {comp.capture.replace(/_/g, " ")} · attempts {comp.attempts}
        </p>
      </div>
      <StatusChip status={comp.status} lockedUntil={lockedUntil} />
    </Link>
  );
}

function StatusChip({
  status,
  lockedUntil,
}: {
  status: CertCompetencyStatus["status"];
  lockedUntil: string | null;
}) {
  if (lockedUntil) {
    return (
      <span className="shrink-0 rounded-md border border-amber-400 bg-amber-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-800">
        locked until {formatRetry(lockedUntil)}
      </span>
    );
  }
  if (status === "passed") {
    return (
      <span className="shrink-0 rounded-md bg-emerald-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
        passed ✓
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-md border border-zinc-400 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
      {status === "not_yet" ? "not yet" : "start"}
    </span>
  );
}

function formatRetry(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">{children}</section>
  );
}

function Banner({
  href,
  cta,
  children,
}: {
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
      <p className="text-sm text-zinc-800">{children}</p>
      <Link
        href={href}
        className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
      >
        {cta}
      </Link>
    </div>
  );
}
