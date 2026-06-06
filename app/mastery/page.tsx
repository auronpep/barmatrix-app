"use client";
import Link from "next/link";
import { useC3 } from "@/lib/use-c3";
import type { C3Mastery } from "@/lib/api-client";

const TRACK_LABELS: Array<[keyof C3Mastery["tracks"], string]> = [
  ["ear_overclaim", "Ear · Overclaim"],
  ["ear_falsity", "Ear · Falsity"],
  ["ear_distortion", "Ear · Distortion"],
  ["issue_sense", "Issue-Sense"],
];

// What every visitor sees first — the editorial hero, rendered across all states
// (loading, signed-out, measured) so the page never reads as a bare data dump.
function MasteryHero({ stamps }: { stamps: string[] }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-meta">
          {stamps.map((s) => (
            <span className="stamp" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="eyebrow-red" style={{ marginBottom: 24 }}>
          ▌ THE PATTERN MASTERY BOARD
        </div>
        <h1
          className="display display-lg"
          style={{ margin: "0 0 24px", maxWidth: "20ch" }}
        >
          How well you{" "}
          <span style={{ fontStyle: "italic" }}>run the method.</span>
        </h1>
        <p className="body-lg" style={{ marginBottom: 0 }}>
          Not a raw percentage — a read on the skills the MBE actually tests:
          catching overclaims, spotting falsity, resisting distortion, and
          sensing the issue. Your board lights up as you work tagged questions,
          then points you at the break that needs repair.
        </p>
      </div>
    </section>
  );
}

export default function MasteryPage() {
  const { loading, signedIn, data, error } = useC3();

  if (loading) {
    return (
      <>
        <MasteryHero stamps={["C3 MASTERY", "LOADING", "EDITION : LAUNCH"]} />
        <section className="section">
          <div className="container">
            <p className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>
              Loading your C3 mastery…
            </p>
          </div>
        </section>
      </>
    );
  }

  if (!signedIn) {
    return (
      <>
        <MasteryHero stamps={["C3 MASTERY", "SIGN IN", "EDITION : LAUNCH"]} />
        <section className="section">
          <div className="container">
            <StatePanel
              eyebrow="▸ SIGN IN TO SEE YOUR BOARD"
              title="Your mastery board is waiting."
              body="Sign in to see your C3 readiness, skill tracks, and the weak spots the Coach should work first. New here? Start with the free diagnostic — it builds the first read on your patterns."
              primary={{ href: "/sign-in", label: "Sign in" }}
              secondary={{ href: "/diagnostic", label: "Take the Free Diagnostic" }}
            />
            <PreviewTracks />
          </div>
        </section>
      </>
    );
  }

  if (!data || error) {
    return (
      <>
        <MasteryHero stamps={["C3 MASTERY", "SYNC", "EDITION : LAUNCH"]} />
        <section className="section">
          <div className="container">
            <StatePanel
              eyebrow="▸ COULDN'T LOAD MASTERY"
              title="Live data sync unavailable."
              body={`We couldn't load your mastery${error ? ` (${error})` : ""}. Head back to your dashboard and try again in a moment.`}
              primary={{ href: "/dashboard", label: "Back to Dashboard" }}
            />
          </div>
        </section>
      </>
    );
  }

  const measured = data.readiness.score !== null;
  const coveragePending =
    data.coverage.total_attempts > 0 && data.coverage.measured_attempts === 0;

  return (
    <>
      <MasteryHero stamps={["C3 MASTERY", "YOUR BOARD", "EDITION : LAUNCH"]} />

      <section className="section">
        <div className="container">
          <p
            className="mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.05em",
              color: "var(--muted)",
              margin: "0 0 40px",
            }}
          >
            Measured on {data.coverage.measured_attempts} of your{" "}
            {data.coverage.total_attempts} attempts ({data.coverage.pct}%
            C3-tagged).
          </p>

          {!measured ? (
            <div
              className="info-panel"
              style={{
                background: "var(--ink)",
                color: "var(--bg)",
                borderColor: "var(--ink)",
              }}
            >
              <div
                className="eyebrow-red"
                style={{ marginBottom: 14 }}
              >
                ▸ {coveragePending ? "TAGGED COVERAGE PENDING" : "NOT YET MEASURED"}
              </div>
              <p
                className="serif"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  margin: "0 0 12px",
                }}
              >
                {coveragePending
                  ? "Your attempts are in. Coverage is catching up."
                  : "Work a few questions to light up the board."}
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--muted-light)",
                  margin: "0 0 24px",
                  maxWidth: "60ch",
                }}
              >
                {coveragePending
                  ? "Your attempts are recorded, but C3-tagged question coverage is still being populated. Work practice questions or the diagnostic while the bank is being tagged."
                  : `Finish The Method first, then work questions or the diagnostic — your mastery lights up after ${data.readiness.mold_floor} exposures per skill.`}
              </p>
              <Link
                href={coveragePending ? "/practice" : "/foundations"}
                className="btn red"
              >
                {coveragePending ? "Practice the bank" : "Go to The Method"}{" "}
                <span className="arrow">→</span>
              </Link>
            </div>
          ) : (
            <div className="three-col">
              <Metric
                label="C3 Readiness"
                value={`${data.readiness.score}`}
                detail="Exam-weighted accuracy (calibration shown separately)"
                accent
              />
              <Metric
                label="Clean-cut hit rate"
                value={
                  data.tracks.clean_cut_hit_rate == null
                    ? "—"
                    : `${Math.round(data.tracks.clean_cut_hit_rate * 100)}%`
                }
                detail="Target ≈ 85%"
              />
              <Metric
                label="Calibration"
                value={data.tracks.calibration.direction}
                detail={`error ${Math.round(data.tracks.calibration.error * 100)} pts`}
              />
            </div>
          )}
        </div>
      </section>

      {/* Skill tracks */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Skill Tracks</span>
          </div>
          <div className="two-col" style={{ gap: 16 }}>
            {TRACK_LABELS.map(([key, label]) => {
              const v = data.tracks[key] as number | null;
              return (
                <Bar
                  key={String(key)}
                  label={label}
                  pct={v == null ? null : Math.round(v * 100)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Weak spots */}
      {data.weak_molds.length > 0 && (
        <section className="section">
          <div className="container">
            <div
              className="section-rule"
              style={{ marginBottom: 24 }}
            >
              <span className="label">▌ Top Weak Spots · Remediation</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 24,
              }}
            >
              <Link href="/coach" className="btn btn-sm red">
                Start Coaching <span className="arrow">→</span>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {data.weak_molds.map((m) => (
                <div
                  key={m.mold_code}
                  className="info-panel"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 24px",
                  }}
                >
                  <div>
                    <p
                      className="serif"
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        margin: 0,
                      }}
                    >
                      {m.name}
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        margin: "4px 0 0",
                      }}
                    >
                      {m.family} · bites {m.bite_pct}% over {m.exposures}{" "}
                      questions
                    </p>
                  </div>
                  {m.lesson_slug && (
                    <Link
                      href={`/foundations/${m.lesson_slug}`}
                      className="btn btn-sm ghost"
                    >
                      Repair <span className="arrow">→</span> {m.lesson_slug}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* By subject */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ By Subject · A Facet Of C3</span>
          </div>
          <div className="two-col" style={{ gap: 16 }}>
            {data.facets.by_subject.map((s) => (
              <Bar
                key={s.subject}
                label={s.subject}
                pct={Math.round(s.accuracy * 100)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// A design-system state panel (sign-in / error / empty) — replaces the old bare
// zinc banners with the editorial info-panel + btn vocabulary.
function StatePanel({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="info-panel" style={{ padding: "32px 36px" }}>
      <div className="eyebrow-red" style={{ marginBottom: 14 }}>
        {eyebrow}
      </div>
      <h2
        className="serif"
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: "var(--ink-soft)",
          margin: "0 0 24px",
          maxWidth: "60ch",
        }}
      >
        {body}
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link href={primary.href} className="btn red">
          {primary.label} <span className="arrow">→</span>
        </Link>
        {secondary && (
          <Link href={secondary.href} className="btn ghost">
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// Signed-out preview so the page shows what the board looks like before sign-in.
function PreviewTracks() {
  return (
    <div style={{ marginTop: 48 }}>
      <div className="section-rule">
        <span className="label">▌ What You&apos;ll See</span>
      </div>
      <div className="two-col" style={{ gap: 16 }}>
        {TRACK_LABELS.map(([key, label]) => (
          <Bar key={String(key)} label={label} pct={null} />
        ))}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <article
      className="info-panel"
      style={{ padding: "24px 28px" }}
    >
      <p
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        className="serif"
        style={{
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          margin: "18px 0 0",
          color: accent ? "var(--red)" : "var(--ink)",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--ink-soft)",
          margin: "16px 0 0",
        }}
      >
        {detail}
      </p>
    </article>
  );
}

function Bar({ label, pct }: { label: string; pct: number | null }) {
  return (
    <div
      className="info-panel"
      style={{ padding: "16px 20px", background: "var(--paper)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          className="serif"
          style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}
        >
          {label}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 12,
            color: pct == null ? "var(--muted-light)" : "var(--muted)",
            whiteSpace: "nowrap",
          }}
        >
          {pct == null ? "not yet measured" : `${pct}%`}
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          height: 8,
          width: "100%",
          overflow: "hidden",
          border: "1px solid var(--ink)",
          background: "var(--bg-alt)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct ?? 0}%`,
            background: "var(--red)",
            transition: "width 400ms",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
