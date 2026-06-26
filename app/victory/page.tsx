import type { Metadata } from "next";
import Link from "next/link";
import { DIAGNOSTIC_FIRST, FAQ, HERO, PRICING, PROOF_CARD } from "./copy";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const stats = [
  { num: "07", lbl: "MBE subjects in the Red-Zone Map" },
  { num: "04", lbl: "C3 dimensions checked per miss" },
  { num: "01", lbl: "Next guided repair task surfaced" },
];

const heroProof = [
  "Free diagnostic first",
  "Red-Zone Map output",
  "Wrong-answer forensics",
  "One guided repair task",
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

const redZoneCards = [
  {
    subject: "Evidence",
    trap: "Purpose-of-offer hearsay trap",
    signal: "High trap pull",
    repair: "Run Hearsay Purpose Drill",
  },
  {
    subject: "Contracts",
    trap: "Acceptance timing drift",
    signal: "Medium trap pull",
    repair: "Run Formation Trigger Drill",
  },
  {
    subject: "Civil Procedure",
    trap: "Wrong procedural standard",
    signal: "High priority",
    repair: "Run Standard-Selection Drill",
  },
];

const patternDashboard = [
  ["Top red zone", "Evidence · Hearsay purpose"],
  ["Why it repeats", "Out-of-court statement instinct overrides purpose"],
  ["Wrong answer pull", "The tempting answer uses a true rule too broadly"],
  ["Next task", "Hearsay Purpose-of-Offer Drill"],
];

const trapTaxonomy = [
  ["Stale rule", "A remembered rule fires before the changed fact is processed."],
  ["Wrong party", "The answer fits someone in the fact pattern, but not the tested actor."],
  ["Wrong timing", "The rule is correct before or after the decisive procedural moment."],
  ["Overbroad scope", "A true principle is stretched beyond the exception or limit."],
  ["Exception miss", "The exception carries the question, but the broad rule feels safer."],
  ["Purpose drift", "Evidence is offered for one purpose while the answer treats another."],
];

const c3Cells = [
  ["Call", "What is the question asking you to decide?"],
  ["Controlling Rule", "Which rule governs after the facts are sorted?"],
  ["Collision", "Where does the tempting wrong answer collide with the trigger fact?"],
  ["Answer", "Which choice survives the collision without overclaiming?"],
];

const diagnosticTimeline = [
  ["01", "Answer diagnostic prompts", "Use a short MBE diagnostic to expose the repeated trap pattern."],
  ["02", "Read the Red-Zone Map", "See the subject, trap, and repair priority before checkout."],
  ["03", "Enter Flagship if it fits", "Follow one guided repair task at a time after enrollment."],
];

const proofPanels = [
  ["Diagnostic artifact", "A sample Red-Zone Map shows what the student receives, without invented social proof."],
  ["Answer autopsy", "The miss is explained through the attractive wrong answer and the trigger fact."],
  ["Repair assignment", "The next drill is tied to the diagnosed trap instead of a broad resource shelf."],
];

const priceCards = [
  ["Pay in full", PRICING.priceLabel, "One July-cycle guided repair program."],
  ["Payment plan", "$500 + $499", "Same total price, split across two payments."],
];

const enhancedFaq = [
  ...FAQ,
  {
    q: "I already have a bar course. Where does this fit?",
    a: "Keep the full course. BarMatrix is the MBE diagnostic and repair layer beside it: red zones, wrong-answer forensics, and one next MBE repair task.",
  },
  {
    q: "Is this another dashboard full of resources?",
    a: "No. The public product promise is Lead Me: one active repair task from the Red-Zone Map, with supporting context only when it helps the task.",
  },
  {
    q: "What proof do I see before paying?",
    a: "The free diagnostic is the proof step. It returns a Red-Zone Map style readout so you can judge whether the repair path is specific enough to pursue.",
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
  "Official bar-exam source material",
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
                ▌ RED-ZONE MAP · WRONG-ANSWER FORENSICS · GUIDED REPAIR
              </div>
              <h1 className="display display-xl">
                Down to{" "}
                <span style={{ fontStyle: "italic" }}>two answers</span>{" "}
                and still choosing the{" "}
                <span style={{ color: "var(--red)" }}>trap?</span>
              </h1>
              <p className="lede">{HERO.subhead}</p>
              <div className="hero-proof-strip">
                {heroProof.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="hero-actions">
                <Link href={HERO.primaryCta.href} className="btn btn-lg red">
                  {HERO.primaryCta.label} <span className="arrow">→</span>
                </Link>
                <Link href={HERO.secondaryCta.href} className="btn btn-lg ghost">
                  {HERO.secondaryCta.label}
                </Link>
                <div className="platforms">
                  WEB
                  <br />
                  Diagnose before price.
                </div>
              </div>
            </div>

            <ForensicsCard />
          </div>
        </div>
      </section>

      {/* ============ PROOF BEFORE PRICE ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ PROOF BEFORE PRICE · 01</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <h2
              className="display display-md"
              style={{ margin: 0, maxWidth: "18ch" }}
            >
              {DIAGNOSTIC_FIRST.headline}
            </h2>
            <div>
              <p className="body-lg" style={{ marginTop: 8 }}>
                {DIAGNOSTIC_FIRST.body}
              </p>
              <Link href={DIAGNOSTIC_FIRST.cta.href} className="btn red">
                {DIAGNOSTIC_FIRST.cta.label}{" "}
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RED-ZONE MAP ARTIFACT ============ */}
      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Red-Zone Map · Diagnostic Artifact</span>
          </div>
          <div className="diagnostic-artifact-grid">
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 20px" }}>
                Your free diagnostic should feel like a product, not a form.
              </h2>
              <p className="body-lg">
                The Red-Zone Map names the subject, trap pattern, and next
                repair task. It does not sell a score promise. It shows whether
                BarMatrix can identify the miss pattern you keep repeating.
              </p>
              <div className="diagnostic-timeline">
                {diagnosticTimeline.map(([num, title, body]) => (
                  <div key={num}>
                    <span>{num}</span>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="red-zone-map" aria-label="Sample Red-Zone Map">
              <div className="red-zone-map-header">
                <span>Sample Red-Zone Map</span>
                <span>Output example</span>
              </div>
              {redZoneCards.map((card) => (
                <div className="red-zone-row" key={card.subject}>
                  <div>
                    <span className="eyebrow-red">{card.subject}</span>
                    <strong>{card.trap}</strong>
                  </div>
                  <span>{card.signal}</span>
                  <p>{card.repair}</p>
                </div>
              ))}
            </div>
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
                </span>
                <span className="lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCT MECHANICS ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Product Mechanics · Pattern Dashboard</span>
          </div>
          <div className="product-proof-grid">
            <div className="pattern-dashboard">
              <div className="pattern-dashboard-top">
                <span>Pattern Dashboard</span>
                <span>Lead Me mode</span>
              </div>
              {patternDashboard.map(([label, value]) => (
                <div className="dashboard-line" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className="next-task-card">
                <span>One next repair task</span>
                <strong>Run 8 hearsay-purpose misses, then review the collision note.</strong>
                <Link href="/how-it-works" className="btn btn-sm red">
                  See how repair works <span className="arrow">→</span>
                </Link>
              </div>
            </div>
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 18px" }}>
                The page should show the mechanism it promises.
              </h2>
              <p className="body-lg">
                BarMatrix is not promising motivation, an outcome statistic, or
                another bank of questions. The product claim is narrower:
                diagnose the trap, show why it pulled you, and assign the next
                repair task.
              </p>
              <div className="proof-panel-grid">
                {proofPanels.map(([title, body]) => (
                  <div className="proof-panel" key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
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
                You have done plenty of MBE questions. The same miss patterns
                keep showing up anyway. The problem is not simply volume. It is
                that every miss gets treated the same: read the explanation,
                move on, repeat the trap when pressure rises.
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

      {/* ============ C3 + TRAP TAXONOMY ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ C3 + Trap Taxonomy · 03</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 22px" }}>
                C3 turns a miss into four repairable dimensions.
              </h2>
              <div className="c3-grid">
                {c3Cells.map(([title, body]) => (
                  <div key={title}>
                    <span>{title}</span>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="display display-sm" style={{ margin: "0 0 22px" }}>
                Trap archetypes students can recognize again.
              </h3>
              <div className="trap-taxonomy-grid">
                {trapTaxonomy.map(([title, body]) => (
                  <div className="trap-taxonomy-card" key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
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
                    "Assigned repair drills tied to your diagnostic misses",
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
            <span className="label">▌ The Flagship · Proof-Safe Price</span>
          </div>
          <div className="pricing-proof-grid">
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
              <div className="price-option-grid">
                {priceCards.map(([label, price, body]) => (
                  <div className="price-option-card" key={label}>
                    <span>{label}</span>
                    <strong>{price}</strong>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/pricing" className="btn red">
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

      {/* ============ FAQ ============ */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Objections · Claim-Safe Answers</span>
          </div>
          <div className="faq-proof-grid">
            <div>
              <h2 className="display display-md" style={{ margin: "0 0 18px" }}>
                The offer stays narrow on purpose.
              </h2>
              <p className="body-lg">
                Start with the diagnostic. Buy only if the Red-Zone Map makes
                the repair target concrete enough to pursue.
              </p>
            </div>
            <div>
              {enhancedFaq.map((item) => (
                <details className="faq-item" key={item.q}>
                  <summary className="q">
                    <h3>{item.q}</h3>
                    <span className="toggle">+</span>
                  </summary>
                  <p className="a">{item.a}</p>
                </details>
              ))}
            </div>
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
          <p className="proof-caption">Diagnostic output example</p>
        </div>
      </div>
    </div>
  );
}
