import Link from "next/link";
import { HERO, PRICING, PROOF_CARD } from "@/lib/copy";

const stats = [
  { num: "2,400", red: ".", lbl: "Questions · fully tagged" },
  { num: "156", lbl: "Tension points mapped" },
  { num: "07", lbl: "MBE subjects covered" },
];

const problemList: [string, string][] = [
  ["narrow to two", "and pick the wrong one"],
  ["see a familiar fact pattern", "and apply the stale rule"],
  ["recognize the doctrine", "and miss the exception"],
  ["know the rule", "and miss the timing trigger"],
  ["read the question fast", "and miss the changed party"],
];

const methodSteps = [
  {
    num: "STEP 01",
    title: "Diagnose",
    body: "A short MBE Trap Diagnostic weighted toward the highest-attractiveness wrong answers — the ones engineered to be most attractive.",
  },
  {
    num: "STEP 02",
    title: "Map",
    body: "Your misses are plotted onto the Tension Matrix — the grid of every rule × exception × trigger that the MBE reuses across cycles.",
  },
  {
    num: "STEP 03",
    title: "Forensic",
    body: "Each wrong answer is tagged: stale rule, wrong timing, wrong party, wrong scope, overbroad waiver. You see why your specific miss was attractive.",
  },
  {
    num: "STEP 04",
    title: "Repair",
    body: "Every miss is connected to a Red-Zone Drill — a targeted micro-set that hits the same tension point until it stops misfiring.",
  },
];

const anatomy = [
  {
    k: "01 · Tension Point",
    v: "Rule × Exception",
    note: "Where the rule and the exception meet — the structural pivot of the question.",
  },
  {
    k: "02 · Trigger Fact",
    v: "The detail you skimmed",
    note: "The fact that changed which rule applies. Catch the trigger, catch the trap.",
  },
  {
    k: "03 · Forensic Tag",
    v: PROOF_CARD.forensicTag,
    note: "The taxonomy of why your wrong answer looked right. Each tag links to a repair drill.",
  },
  {
    k: "04 · Repair Drill",
    v: PROOF_CARD.nextDrill,
    note: "Every tagged miss links to the exact drill that repairs that pattern.",
  },
];

const builtFor = [
  "Examinees whose MBE percentage is stuck despite high question volume",
  "Full-course users who need deeper MBE diagnosis than their bank provides",
  "Repeat takers whose prior question volume did not convert into points",
  "Working students who cannot afford broad, undirected review cycles",
  "California July 2026 examinees and students in any MBE jurisdiction",
];

const notFor = [
  "A full bar review course replacement",
  "Essay preparation or grading",
  "Performance-test preparation",
  "Official NCBE or State Bar material",
  "A guarantee of any score or exam outcome",
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">VOL. 1 · NO. 1</span>
            <span className="stamp">CALIFORNIA · JULY 2026 CYCLE</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>

          <div className="hero-grid">
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ MBE TRAP DIAGNOSIS · WEB · iOS · ANDROID
              </div>
              <h1 className="display display-xl">
                Master the{" "}
                <span style={{ fontStyle: "italic" }}>finite universe</span>{" "}
                of <span style={{ color: "var(--red)" }}>MBE traps.</span>
              </h1>
              <p className="lede">{HERO.subhead}</p>
              <div className="hero-actions">
                <Link href={HERO.primaryCta.href} className="btn btn-lg red">
                  {HERO.primaryCta.label} <span className="arrow">→</span>
                </Link>
                <Link href={HERO.secondaryCta.href} className="btn btn-lg ghost">
                  {HERO.secondaryCta.label}
                </Link>
                <div className="platforms">
                  WEB · iOS · ANDROID
                  <br />
                  Same account. Same drills.
                </div>
              </div>
            </div>

            <ForensicsCard />
          </div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="section-tight">
        <div className="container">
          <div className="stat-strip">
            {stats.map((s) => (
              <div key={s.lbl}>
                <span className="num">
                  {s.num}
                  {s.red && <span className="red-dot">{s.red}</span>}
                </span>
                <span className="lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Problem · 01</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2
                className="display display-lg"
                style={{ margin: "0 0 24px" }}
              >
                More questions <br />
                <span style={{ fontStyle: "italic", color: "var(--muted)" }}>
                  ≠{" "}
                </span>
                <span
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: "var(--red)",
                    textDecorationThickness: 6,
                  }}
                >
                  more points
                </span>
              </h2>
              <p className="body-lg">
                You have done thousands of MBE questions. Your score plateaued
                anyway. The problem is not volume. It is that every miss is
                treated the same: read the explanation, move on, repeat the
                trap on the real exam.
              </p>
            </div>
            <div
              style={{
                borderLeft: "1px solid var(--rule)",
                paddingLeft: 48,
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {problemList.map(([a, b], i) => (
                  <li
                    key={a}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr 1fr",
                      gap: 16,
                      borderTop: "1px solid var(--rule-soft)",
                      paddingTop: 14,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--red)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="serif"
                      style={{ fontSize: 17, fontWeight: 500 }}
                    >
                      You {a}
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        color: "var(--muted)",
                        fontStyle: "italic",
                      }}
                    >
                      {b}.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ METHOD ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Method · 02</span>
          </div>
          <h2
            className="display display-lg"
            style={{ margin: "0 0 56px", maxWidth: "20ch" }}
          >
            The MBE recycles a{" "}
            <span style={{ color: "var(--red)" }}>finite set</span> of trap
            patterns.
          </h2>
          <div className="four-col">
            {methodSteps.map((s) => (
              <div className="method-step" key={s.title}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ANATOMY OF A MISS ============ */}
      <section className="section dark">
        <div className="container">
          <div className="section-rule">
            <span className="label" style={{ color: "white" }}>
              ▌ Anatomy of a Miss · 03
            </span>
          </div>
          <h2
            className="display display-lg"
            style={{ color: "white", margin: "0 0 24px", maxWidth: "22ch" }}
          >
            One miss.{" "}
            <span style={{ color: "var(--red)" }}>Four data points.</span> One
            assigned drill.
          </h2>
          <p
            className="body-lg"
            style={{ color: "#c8c4ba", marginBottom: 56 }}
          >
            When you miss a question on BarMatrix, you don&apos;t see
            &quot;incorrect.&quot; You see exactly which trap pulled you in,
            why that wrong answer was attractive, and the next drill
            assignment.
          </p>
          <div className="four-col">
            {anatomy.map((item) => (
              <div
                key={item.k}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.3)",
                  paddingTop: 20,
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "var(--red)",
                    marginBottom: 12,
                  }}
                >
                  {item.k}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "white",
                    lineHeight: 1.15,
                  }}
                >
                  {item.v}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#a39e93",
                    lineHeight: 1.45,
                  }}
                >
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHO ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Who It Is For · 04</span>
          </div>
          <div className="two-col">
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                ▸ BUILT FOR
              </div>
              <h3
                className="display display-md"
                style={{ margin: "0 0 28px", color: "var(--ink)" }}
              >
                Students who keep{" "}
                <span style={{ fontStyle: "italic" }}>narrowing to two</span>{" "}
                and choosing wrong.
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  borderTop: "2px solid var(--ink)",
                }}
              >
                {builtFor.map((t) => (
                  <li
                    key={t}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid var(--rule-soft)",
                      fontSize: 16,
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 12,
                    }}
                  >
                    <span className="mono" style={{ color: "var(--red)" }}>
                      →
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div
                className="eyebrow"
                style={{ marginBottom: 16, color: "var(--red)" }}
              >
                ▸ NOT BUILT FOR
              </div>
              <h3
                className="display display-md"
                style={{ margin: "0 0 28px" }}
              >
                Students looking for a{" "}
                <span style={{ textDecoration: "line-through" }}>
                  full bar course
                </span>
                .
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  borderTop: "2px solid var(--ink)",
                }}
              >
                {notFor.map((t) => (
                  <li
                    key={t}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid var(--rule-soft)",
                      fontSize: 16,
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 12,
                      color: "var(--muted)",
                      textDecoration: "line-through",
                      textDecorationColor: "var(--rule-soft)",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        color: "var(--muted-light)",
                        textDecoration: "none",
                      }}
                    >
                      ×
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container">
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ START HERE
              </div>
              <h2
                className="display display-lg"
                style={{ color: "white", margin: "0 0 24px" }}
              >
                Short diagnostic.{" "}
                <br />
                <span style={{ fontStyle: "italic", color: "var(--red)" }}>
                  Your trap profile.
                </span>
              </h2>
              <p
                style={{
                  fontSize: 19,
                  color: "#c8c4ba",
                  lineHeight: 1.5,
                  marginBottom: 32,
                  maxWidth: "40ch",
                }}
              >
                The free MBE Trap Diagnostic is the fastest way to see your
                Red-Zone Map — your most attractive trap patterns, built from
                your actual misses.
              </p>
              <Link href="/diagnostic" className="btn btn-lg red">
                Start the Diagnostic <span className="arrow">→</span>
              </Link>
              <p
                className="mono"
                style={{
                  marginTop: 24,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "var(--muted-light)",
                  textTransform: "uppercase",
                }}
              >
                {HERO.flagshipLine}
              </p>
            </div>
            <div>
              <div style={{ border: "1px solid #c8c4ba", padding: 32 }}>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "var(--red)",
                    marginBottom: 24,
                  }}
                >
                  ▌ WHAT YOU GET
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Personal Red-Zone Map (dashboard)",
                    "Top trap patterns ranked by attractiveness",
                    "Forensic tags explaining why each miss was attractive",
                    "Sample assigned drills — try before you buy",
                    "Companion path with your existing bar course",
                  ].map((t, i, arr) => (
                    <li
                      key={t}
                      style={{
                        padding: "14px 0",
                        borderBottom:
                          i < arr.length - 1
                            ? "1px solid rgba(255,255,255,0.15)"
                            : "none",
                        fontSize: 15,
                        display: "grid",
                        gridTemplateColumns: "24px 1fr",
                        gap: 12,
                        color: "white",
                      }}
                    >
                      <span className="mono" style={{ color: "var(--red)" }}>
                        →
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FLAGSHIP TEASE ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Flagship · 05</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 16 }}>
                ONE COHORT · JULY 2026
              </div>
              <h2
                className="display display-md"
                style={{ margin: "0 0 24px" }}
              >
                {PRICING.flagshipName} —{" "}
                <span style={{ color: "var(--red)" }}>
                  {PRICING.priceLabel}
                </span>
              </h2>
              <p className="body-lg">
                Full MBE trap-repair access for the July-cycle cohort.
                Multiple-choice only — designed to sit alongside your full bar
                course, not replace it.
              </p>
              <p
                className="mono"
                style={{
                  marginTop: 16,
                  fontSize: 13,
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                }}
              >
                {PRICING.paymentPlanLabel}.
              </p>
              <p
                className="mono"
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                }}
              >
                {PRICING.capacityLine}
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/pricing" className="btn">
                  See the full flagship <span className="arrow">→</span>
                </Link>
                <Link href="/checkout" className="btn red">
                  Enroll now
                </Link>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                borderTop: "2px solid var(--ink)",
              }}
            >
              {PRICING.includes.slice(0, 8).map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid var(--rule-soft)",
                    fontSize: 15,
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--red)" }}>
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function ForensicsCard() {
  return (
    <div className="forensics-card">
      <div className="forensics-header">
        <span>
          <span className="live-dot" />
          Wrong-Answer Forensics · Live
        </span>
        <span>Q-247 · Evidence</span>
      </div>
      <div className="forensics-body">
        <div className="q-meta">
          <div>
            <div className="k">Subject</div>
            <div className="v">Evidence</div>
          </div>
          <div>
            <div className="k">Subtopic</div>
            <div className="v">Hearsay</div>
          </div>
          <div>
            <div className="k">Difficulty</div>
            <div className="v">Hard</div>
          </div>
          <div>
            <div className="k">Tension</div>
            <div className="v">Purpose of Offer</div>
          </div>
        </div>

        <p className="q-stem">
          At a civil trial, plaintiff offers testimony that defendant&apos;s
          neighbor said, &quot;I warned him about that broken step a week
          before the fall.&quot; What is the most likely ruling?
        </p>

        <div className="choices">
          <div className="choice picked">
            <span className="letter">A</span>
            <span className="text">
              Exclude as hearsay — out-of-court statement offered to prove the
              defect existed.
            </span>
            <span className="pct">Your pick</span>
          </div>
          <div className="choice correct">
            <span className="letter">B</span>
            <span className="text">
              Admit — offered to show notice, not for the truth of the matter
              asserted.
            </span>
            <span className="pct">Correct</span>
          </div>
          <div className="choice dim">
            <span className="letter">C</span>
            <span className="text">
              Exclude — improper character evidence.
            </span>
          </div>
          <div className="choice dim">
            <span className="letter">D</span>
            <span className="text">
              Admit only with a limiting instruction on bias.
            </span>
          </div>
        </div>

        <div className="forensic-breakdown">
          <div className="verdict">
            <span className="verdict-label">▌ Trap Diagnosed</span>
            <span className="verdict-stat">
              Purpose-of-offer trap
            </span>
          </div>
          <div className="tags-row">
            <span className="tag red">{PROOF_CARD.forensicTag}</span>
            <span className="tag">Stale Rule</span>
            <span className="tag solid">Repair · Hearsay Purpose</span>
          </div>
          <p className="forensic-why">
            You picked A. The statement <em>was</em> made out of court, so the
            hearsay instinct fires. But the offer isn&apos;t for{" "}
            <strong>truth of the matter</strong> — it&apos;s for{" "}
            <strong>notice</strong>. Purpose of offer changes the analysis.
          </p>
          <div className="repair-cta">
            <div>
              <div className="label">Next Drill</div>
              <div className="drill-name">{PROOF_CARD.nextDrill}</div>
            </div>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
