import Link from "next/link";
import CoachClient from "./coach-client";

export const metadata = {
  title: "C3 Coach — Adaptive MBE Repair",
  description:
    "The C3 Coach works from the locked Red-Zone V5 model: red zone, axis, choice pattern, choice diagnostic, and attempt signal.",
  alternates: { canonical: "/coach" },
};

const HOW = [
  {
    num: "STEP 01",
    title: "Names the red zone",
    body: "The Coach starts from the locked Red-Zone V5 catalog, then narrows the work to the axis and outline code that explain the miss.",
  },
  {
    num: "STEP 02",
    title: "Reads the choice pattern",
    body: "Each wrong choice is treated as a pattern: the mold, the filter that broke, the attraction, and the responsive repair.",
  },
  {
    num: "STEP 03",
    title: "Waits for validated signal",
    body: "Attempt-based mastery stays gated until a validated C3 choice diagnostic exists for the selected choice.",
  },
] as const;

export default function CoachPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">C3 COACH · ADAPTIVE</span>
            <span className="stamp">ONE BREAK AT A TIME</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ THE C3 COACH
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            Your red zone,{" "}
            <span style={{ fontStyle: "italic" }}>axis,</span>{" "}
            <span style={{ color: "var(--red)" }}>and choice pattern.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            The Coach shell now uses the same packet taxonomy as the redesigned
            library: Red Zone to Axis to Choice Pattern to Choice Diagnostic to
            Attempt Signal.
          </p>
        </div>
      </section>

      {/* How coaching works */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ How Coaching Works · 01</span>
          </div>
          <div className="three-col">
            {HOW.map((s) => (
              <div className="method-step" key={s.title}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live coach session */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Your Session · 02</span>
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="forensics-card">
              <div className="forensics-header">
                <span>
                  <span className="live-dot" />
                  Coaching Session
                </span>
                <span>C3-LIVE</span>
              </div>
              <div className="forensics-body">
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Works from the packet taxonomy first, then routes live attempts
                  only when the validated C3 diagnostic exists.
                </p>
                <CoachClient />
              </div>
            </div>
            <p
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginTop: 18,
                textAlign: "center",
              }}
            >
              Coaching is part of BarMatrix Flagship ·{" "}
              <Link
                href="/mastery"
                style={{ borderBottom: "1px solid var(--muted)" }}
              >
                See your mastery
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Continue training CTA band */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container center">
          <div
            className="eyebrow-red"
            style={{ marginBottom: 24, justifyContent: "center" }}
          >
            ▌ KEEP THE LOOP MOVING
          </div>
          <h2
            className="display display-md"
            style={{ color: "white", margin: "0 auto 20px", maxWidth: "22ch" }}
          >
            Keep the C3 taxonomy in view.
          </h2>
          <p
            className="body-lg"
            style={{
              color: "var(--muted-light)",
              margin: "0 auto 32px",
              maxWidth: "52ch",
            }}
          >
            Use the redesigned red-zone, axis, and choice-pattern libraries as
            the front door while the attempt bridge stays gated.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/dashboard" className="btn btn-lg red">
              Open Dashboard <span className="arrow">→</span>
            </Link>
            <Link
              href="/traps"
              className="btn btn-lg ghost"
              style={{ color: "white", borderColor: "white" }}
            >
              Open Choice Patterns
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
