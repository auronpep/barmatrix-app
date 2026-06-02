"use client";
import Link from "next/link";
import { useC3 } from "@/lib/use-c3";
import type { C3Mastery } from "@/lib/api-client";

const TRACK_LABELS: Array<[keyof C3Mastery["tracks"], string]> = [
  ["ear_overclaim", "Ear · Overclaim"], ["ear_falsity", "Ear · Falsity"],
  ["ear_distortion", "Ear · Distortion"], ["issue_sense", "Issue-Sense"],
];

export default function MasteryPage() {
  const { loading, signedIn, data, error } = useC3();
  if (loading) return <Shell><p className="font-mono text-sm text-zinc-500">Loading your C3 mastery…</p></Shell>;
  if (!signedIn) return <Shell><Banner href="/sign-in" cta="Sign in">Sign in to see your C3 mastery.</Banner></Shell>;
  if (!data || error) return <Shell><Banner href="/dashboard" cta="Dashboard">Couldn&apos;t load mastery{error ? `: ${error}` : ""}.</Banner></Shell>;

  const measured = data.readiness.score !== null;
  const coveragePending =
    data.coverage.total_attempts > 0 && data.coverage.measured_attempts === 0;
  return (
    <Shell>
      <p className="font-mono text-xs uppercase tracking-wider text-red-700">C3 Mastery</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950">How well you run the method</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Measured on {data.coverage.measured_attempts} of your {data.coverage.total_attempts} attempts
        ({data.coverage.pct}% C3-tagged).
      </p>

      {!measured ? (
        <div className="mt-8 border-2 border-zinc-900 bg-zinc-950 p-6 text-white">
          <p className="font-serif text-2xl font-semibold">
            {coveragePending ? "Tagged coverage pending" : "Not yet measured"}
          </p>
          <p className="mt-2 text-sm text-zinc-200">
            {coveragePending
              ? "Your attempts are recorded, but C3-tagged question coverage is still being populated. Work practice questions or the diagnostic while the bank is being tagged."
              : `Finish The Method first, then work questions or the diagnostic — your mastery lights up after ${data.readiness.mold_floor} exposures per skill.`}
          </p>
          <Link href={coveragePending ? "/practice" : "/foundations"} className="mt-4 inline-block rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900">
            {coveragePending ? "Practice the bank →" : "Go to The Method →"}
          </Link>
        </div>
      ) : (
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="C3 Readiness" value={`${data.readiness.score}`} detail="Exam-weighted accuracy (calibration shown separately)" />
          <Metric label="Clean-cut hit rate" value={data.tracks.clean_cut_hit_rate == null ? "—" : `${Math.round(data.tracks.clean_cut_hit_rate * 100)}%`} detail="Target ≈ 85%" />
          <Metric label="Calibration" value={data.tracks.calibration.direction} detail={`error ${Math.round(data.tracks.calibration.error * 100)} pts`} />
        </section>
      )}

      <section className="mt-8">
        <h2 className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">Skill tracks</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TRACK_LABELS.map(([key, label]) => {
            const v = data.tracks[key] as number | null;
            return <Bar key={String(key)} label={label} pct={v == null ? null : Math.round(v * 100)} />;
          })}
        </div>
      </section>

      {data.weak_molds.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-300 pb-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-700">Top weak spots (remediation)</h2>
            <Link href="/coach" className="btn btn-sm red">Start Coaching →</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {data.weak_molds.map((m) => (
              <div key={m.mold_code} className="flex flex-wrap items-center justify-between gap-3 border border-zinc-300 bg-white p-4">
                <div>
                  <p className="font-serif text-lg font-semibold text-zinc-950">{m.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{m.family} · bites {m.bite_pct}% over {m.exposures} questions</p>
                </div>
                {m.lesson_slug && <Link href={`/foundations/${m.lesson_slug}`} className="btn btn-sm ghost">Repair → {m.lesson_slug}</Link>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">By subject (a facet of C3)</h2>
        <div className="mt-4 grid gap-2">
          {data.facets.by_subject.map((s) => (
            <Bar key={s.subject} label={s.subject} pct={Math.round(s.accuracy * 100)} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">{children}</section>;
}
function Banner({ href, cta, children }: { href: string; cta: string; children: React.ReactNode }) {
  return (<div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
    <p className="text-sm text-zinc-800">{children}</p>
    <Link href={href} className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900">{cta}</Link></div>);
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (<article className="border border-zinc-300 bg-white p-5">
    <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">{label}</p>
    <p className="mt-3 font-serif text-4xl font-semibold leading-none text-zinc-950">{value}</p>
    <p className="mt-3 text-sm leading-6 text-zinc-700">{detail}</p></article>);
}
function Bar({ label, pct }: { label: string; pct: number | null }) {
  return (<div className="border border-zinc-200 p-3">
    <div className="flex justify-between"><span className="text-sm text-zinc-800">{label}</span>
      <span className="font-mono text-xs text-zinc-600">{pct == null ? "not yet measured" : `${pct}%`}</span></div>
    <div className="mt-2 h-2 w-full overflow-hidden border border-zinc-900 bg-zinc-100">
      <div className="h-full bg-red-700" style={{ width: `${pct ?? 0}%` }} aria-hidden /></div></div>);
}
