import type { Metadata } from "next";
import Link from "next/link";
import { DISCLAIMER } from "@/lib/copy";

export const metadata: Metadata = {
  title: "About",
  description:
    "BarMatrix is a diagnostic-first MBE repair system that maps recurring wrong-answer patterns into a Red-Zone Map and a guided repair path.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About BarMatrix",
    description:
      "A diagnostic-first MBE repair system for recurring wrong-answer patterns, Red-Zone Maps, and guided repair.",
    url: "/about",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BarMatrix",
    description:
      "A diagnostic-first MBE repair system for recurring wrong-answer patterns, Red-Zone Maps, and guided repair.",
    images: ["/og-image.svg"],
  },
};

const METHOD_LEDGER = [
  {
    label: "Miss",
    value: "True rule, wrong question",
    detail: "The answer sounded familiar but did not answer the call.",
  },
  {
    label: "Red zone",
    value: "Issue-fit failure",
    detail: "The student recognized law before checking responsiveness.",
  },
  {
    label: "Repair",
    value: "Call-first drill",
    detail: "Repeat the filter until the first cut is automatic.",
  },
] as const;

const METHOD_STEPS = [
  {
    title: "Diagnose the miss",
    body: "The diagnostic looks past raw score and reads the selected wrong answer for the trap pattern underneath it.",
  },
  {
    title: "Map the red zone",
    body: "Related misses are grouped by subject, subtopic, and wrong-answer architecture so the next move is not random review.",
  },
  {
    title: "Assign the repair",
    body: "The guided repair path turns the highest-priority pattern into one targeted task, drill, or review loop.",
  },
] as const;

const SCOPE_ROWS = [
  ["Built for", "MBE multiple-choice misses, Red-Zone Maps, and targeted repair drills."],
  ["Not built for", "Replacing a full bar course, essay prep, performance tests, or outcome promises."],
  ["Best first step", "Take the free diagnostic and inspect the map before deciding whether to enroll."],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-meta" style={{ marginBottom: 32 }}>
                <span className="stamp">Diagnostic-first MBE repair</span>
              </div>
              <h1
                className="display display-lg"
                style={{ margin: "0 0 24px", maxWidth: "18ch" }}
              >
                Built for the moment your MBE misses stop looking random.
              </h1>
              <p className="body-lg" style={{ margin: "0 0 28px" }}>
                BarMatrix diagnoses recurring wrong-answer patterns and turns
                the next repair into one guided task.
              </p>
              <div className="hero-actions">
                <Link href="/diagnostic" className="btn btn-lg red">
                  Start the Free Diagnostic
                </Link>
                <Link href="/how-it-works" className="btn btn-lg ghost">
                  See the Method
                </Link>
              </div>
            </div>

            <aside
              className="info-panel"
              aria-label="Sample BarMatrix method ledger"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "var(--ink)",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "18px 20px",
                }}
              >
                <span className="mono" style={{ fontSize: 12 }}>
                  Method Ledger
                </span>
                <span className="mono" style={{ color: "#d6d0c4", fontSize: 12 }}>
                  Red-Zone Map
                </span>
              </div>
              <div style={{ padding: 24 }}>
                {METHOD_LEDGER.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderBottom: "1px solid var(--rule-soft)",
                      padding: "18px 0",
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        color: "var(--red)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>
                    <h2
                      className="serif"
                      style={{
                        color: "var(--ink)",
                        fontSize: 28,
                        lineHeight: 1.05,
                        margin: "8px 0 8px",
                      }}
                    >
                      {item.value}
                    </h2>
                    <p
                      style={{
                        color: "var(--ink-soft)",
                        fontSize: 15,
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
                <div
                  style={{
                    background: "var(--red)",
                    color: "white",
                    marginTop: 22,
                    padding: 18,
                  }}
                >
                  <div className="mono" style={{ fontSize: 11, marginBottom: 8 }}>
                    Next action
                  </div>
                  <p className="serif" style={{ fontSize: 24, lineHeight: 1.15, margin: 0 }}>
                    Run the repair drill before adding more random volume.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="section-rule">
            <span className="label">What BarMatrix Is</span>
          </div>
          <div style={{ maxWidth: 900 }}>
            <h2
              className="display display-md"
              style={{ margin: "0 0 20px", maxWidth: "18ch" }}
            >
              A repair system, not a pile of questions.
            </h2>
            <p className="body-lg" style={{ margin: 0 }}>
              BarMatrix is built for students who have already seen plenty of
              law but keep losing points to the same answer-choice traps.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="info-panel" style={{ padding: "8px 28px" }}>
            {METHOD_STEPS.map((step) => (
              <article
                key={step.title}
                style={{
                  borderBottom: "1px solid var(--rule-soft)",
                  display: "grid",
                  gap: 18,
                  padding: "24px 0",
                }}
              >
                <h3
                  className="serif"
                  style={{
                    color: "var(--ink)",
                    fontSize: 30,
                    lineHeight: 1.05,
                    margin: "0 0 14px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="section-rule">
                <span className="label">Scope</span>
              </div>
              <h2
                className="display display-md"
                style={{ margin: "0 0 20px", maxWidth: "16ch" }}
              >
                Narrow on purpose.
              </h2>
              <p className="body-lg" style={{ margin: 0 }}>
                The product stays focused because the problem is focused:
                repeated MBE misses that need diagnosis before more practice.
              </p>
            </div>
            <div className="info-panel" style={{ padding: "6px 24px" }}>
              {SCOPE_ROWS.map(([label, body]) => (
                <div
                  className="grid gap-3 py-5 sm:grid-cols-[150px_minmax(0,1fr)]"
                  key={label}
                  style={{
                    borderBottom: "1px solid var(--rule-soft)",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      color: "var(--red)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  <p
                    style={{
                      color: "var(--ink-soft)",
                      fontSize: 15,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container center">
          <h2
            className="display display-md"
            style={{ color: "white", margin: "0 auto 24px", maxWidth: "20ch" }}
          >
            See your map before you buy.
          </h2>
          <p
            className="body-lg"
            style={{ color: "#f6f3ec", margin: "0 auto 32px" }}
          >
            The free diagnostic shows the first repair priority and a sample of
            the guided repair path. No card. No commitment.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <Link href="/diagnostic" className="btn btn-lg red">
              Start the Free Diagnostic
            </Link>
            <Link
              href="/pricing"
              className="btn btn-lg ghost"
              style={{ borderColor: "white", color: "white" }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div style={{ margin: "0 auto", maxWidth: 880 }}>
            <div className="section-rule">
              <span className="label">Important</span>
            </div>
            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 13,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "80ch",
              }}
            >
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
