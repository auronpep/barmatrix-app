import Link from "next/link";
import CoachClient from "./coach-client";

export const metadata = {
  title: "C3 Coach — Adaptive MBE Repair",
  description:
    "The C3 Coach finds your weakest break, serves the question that targets it, and re-surfaces the lesson that fixes it. Adaptive, one trap at a time.",
  alternates: { canonical: "/coach" },
};

const HOW = [
  {
    num: "STEP 01",
    title: "Finds the weakest break",
    body: "The Coach reads your C3 mastery and the exam blueprint, then picks the skill break that is costing you the most — not a random next question.",
  },
  {
    num: "STEP 02",
    title: "Serves the targeted question",
    body: "You get one question chosen to hit that exact break, with Wrong Answer Forensics on every choice so a miss turns into a diagnosis, not a guess.",
  },
  {
    num: "STEP 03",
    title: "Re-surfaces the fix",
    body: "When a break keeps biting, the Coach links you straight back to the lesson that repairs it, then spaces it until the pattern stops.",
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
            Your weakest break,{" "}
            <span style={{ fontStyle: "italic" }}>worked first.</span>{" "}
            <span style={{ color: "var(--red)" }}>Then the fix.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            The Coach doesn&apos;t hand you the next random question. It finds the
            C3 break that&apos;s draining the most points, serves the question
            built to expose it, and re-surfaces the lesson that repairs it — then
            keeps spacing it until the pattern stops.
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
                  Works your weakest C3 break first, then re-surfaces the lesson
                  that fixes it.
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
            Feed the Coach with more live attempts.
          </h2>
          <p
            className="body-lg"
            style={{
              color: "var(--muted-light)",
              margin: "0 auto 32px",
              maxWidth: "52ch",
            }}
          >
            Your dashboard, drills, and red-zone map keep adding signal. The
            Coach uses that work to choose the next break worth repairing.
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
              href="/drills"
              className="btn btn-lg ghost"
              style={{ color: "white", borderColor: "white" }}
            >
              Work Drills
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
