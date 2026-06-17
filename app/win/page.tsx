import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, HERO, PRICING } from "./copy";

export const metadata: Metadata = {
  title: "BarMatrix - Diagnostic-First MBE Repair",
  description:
    "Start the free MBE diagnostic, get a Red-Zone Map, and use BarMatrix Flagship for guided wrong-answer repair.",
  alternates: {
    canonical: "/",
  },
};

const stats = [
  { num: "Free", lbl: "diagnostic first" },
  { num: "Red", red: ".", lbl: "Zone Map before purchase" },
  { num: "1", lbl: "guided repair task at a time" },
];

const problemList: [string, string][] = [
  ["do more questions", "but the same trap still gets you"],
  ["read explanations", "but cannot name why the wrong answer felt right"],
  ["track percentages", "but do not know which break to repair next"],
  ["open dashboards", "but end up choosing from too many resources"],
  ["keep your full course", "but need a sharper MBE-only repair layer"],
];

const redZoneSignals = [
  {
    title: "Red zones",
    body: "The diagnostic ranks where the leak appears: subject, subtopic, tension point, or wrong-answer architecture.",
  },
  {
    title: "Two-answer traps",
    body: "The map names when the problem is not knowledge, but choosing the attractive answer that breaks the call or rule.",
  },
  {
    title: "Forensic priority",
    body: "The first paid step is not a menu. It is the repair task attached to the highest-priority pattern.",
  },
];

const howItWorks = [
  {
    n: "01",
    title: "Start the free diagnostic",
    body: "Answer a focused MBE diagnostic before buying. The point is not motivation or a generic score; it is finding the first repair target.",
  },
  {
    n: "02",
    title: "Get the Red-Zone Map",
    body: "BarMatrix reads the misses for trap shape, confidence, timing, and C3 breaks: Call, Controlling Rule, Collision, Answer.",
  },
  {
    n: "03",
    title: "Inspect the wrong-answer forensics",
    body: "See why the wrong option pulled you, where it failed, and what selection habit needs repair.",
  },
  {
    n: "04",
    title: "Let Lead Me assign the next task",
    body: "Flagship turns the map into one guided repair task at a time, with milestones for context and no dashboard browsing.",
  },
];

const builtFor = [
  "California bar repeaters who are doing MBE questions but not improving",
  "July 2026 takers who keep narrowing to two answers and picking the trap",
  "Students using a full bar course who need a companion MBE repair system",
  "Working students who want the system to say what to do next",
  "Students who value diagnostic precision over a larger resource shelf",
];

const notFor = [
  "A full bar course replacement",
  "Essay preparation or performance-test preparation",
  "Legal advice or bar-admission guidance",
  "Passive resource browsing",
  "Outcome promises",
  "A generic question bank",
];

const modules = [
  {
    k: "Diagnostic",
    title: "Free Red-Zone Diagnostic",
    body: "The first conversion step. It shows the repair target before purchase.",
  },
  {
    k: "Map",
    title: "Red-Zone Map",
    body: "Ranks the leak by trap family, confidence, subject area, and repair urgency.",
  },
  {
    k: "Forensics",
    title: "Wrong-Answer Forensics",
    body: "Explains why the tempting option looked right and exactly where it failed.",
  },
  {
    k: "C3",
    title: "C3 Method",
    body: "Call, Controlling Rule, Collision, Answer: the operating method behind repair.",
  },
  {
    k: "Lead Me",
    title: "One Next Guided Task",
    body: "The paid dashboard is not a library. It leads the student into the next repair task.",
  },
  {
    k: "Catch-up",
    title: "Guided Continuity",
    body: "Missed work moves into catch-up instead of turning the plan into another backlog.",
  },
];

const homeFaq = [
  FAQ[0],
  FAQ[4],
  FAQ[1],
  FAQ[2],
  {
    q: "Do I have to buy before seeing value?",
    a: "No. The homepage sends you to the diagnostic first because the Red-Zone Map should make the repair target concrete before purchase.",
  },
].filter(Boolean) as Array<{ q: string; a: string }>;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">DIAGNOSTIC-FIRST</span>
            <span className="stamp">CALIFORNIA · JULY 2026</span>
            <span className="stamp">MBE ONLY</span>
          </div>

          <div className="hero-grid">
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ RED-ZONE MAP · WRONG-ANSWER FORENSICS · GUIDED REPAIR
              </div>
              <h1 className="display display-xl">
                Find the MBE red zones your question sets are{" "}
                <span style={{ color: "var(--red)" }}>hiding.</span>
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
                  No card.
                  <br />
                  Diagnose first.
                </div>
              </div>
            </div>

            <DiagnosticCard />
          </div>
        </div>
      </section>

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

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Problem · 01</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2 className="display display-lg" style={{ margin: "0 0 24px" }}>
                More MBE questions do not tell you{" "}
                <span style={{ color: "var(--red)" }}>which reasoning break</span>{" "}
                to repair next.
              </h2>
              <p className="body-lg">
                Repeat misses usually do not feel random to the student. They
                feel like a pattern that no one has named. BarMatrix is built
                for the student who wants diagnostic forensics before another
                block of volume.
              </p>
            </div>
            <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 48 }}>
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
                    <span className="mono" style={{ fontSize: 11, color: "var(--red)" }}>
                      0{i + 1}
                    </span>
                    <span className="serif" style={{ fontSize: 17, fontWeight: 500 }}>
                      You {a}
                    </span>
                    <span style={{ fontSize: 15, color: "var(--muted)", fontStyle: "italic" }}>
                      {b}.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Diagnostic / Red-Zone Map · 02</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 16 }}>
                ▸ PROOF BEFORE PURCHASE
              </div>
              <h2 className="display display-lg" style={{ margin: "0 0 24px" }}>
                Start with the map. Buy only after the repair target is visible.
              </h2>
              <p className="body-lg">
                The Red-Zone Map is the bridge between a free diagnostic and
                Flagship enrollment. It shows the pattern behind the miss, then
                Flagship carries that target into guided repair.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/diagnostic" className="btn red">
                  Get My Red-Zone Map <span className="arrow">→</span>
                </Link>
                <Link href="/pricing" className="btn ghost">
                  See Pricing
                </Link>
              </div>
            </div>
            <div className="info-panel" style={{ background: "var(--paper)" }}>
              <div className="eyebrow-strong" style={{ marginBottom: 16 }}>
                ▸ WHAT THE MAP READS
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {redZoneSignals.map((item, i, arr) => (
                  <li
                    key={item.title}
                    style={{
                      padding: "16px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--rule-soft)" : "none",
                    }}
                  >
                    <h3 className="serif" style={{ fontSize: 22, margin: "0 0 8px" }}>
                      {item.title}
                    </h3>
                    <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark" id="how-it-works">
        <div className="container">
          <div className="section-rule">
            <span className="label" style={{ color: "white" }}>
              ▌ How It Works · 03
            </span>
          </div>
          <h2
            className="display display-lg"
            style={{ color: "white", margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Diagnose, map, repair, then follow one next task.
          </h2>
          <p className="body-lg" style={{ color: "#c8c4ba", marginBottom: 56 }}>
            BarMatrix is serious by design: the diagnostic finds the red zone,
            C3 explains the break, and Lead Me turns it into the next repair
            assignment.
          </p>
          <div className="four-col">
            {howItWorks.map((step) => (
              <div key={step.n} style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 20 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--red)", marginBottom: 12 }}>
                  {step.n}
                </div>
                <h3 className="serif" style={{ color: "white", fontSize: 24, margin: "0 0 12px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#a39e93", fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Who It Is For / Not For · 04</span>
          </div>
          <div className="two-col">
            <FitList title="Built for" items={builtFor} marker="→" />
            <FitList title="Not built for" items={notFor} marker="×" muted />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Product Modules · 05</span>
          </div>
          <h2 className="display display-lg" style={{ margin: "0 0 24px", maxWidth: "24ch" }}>
            The system is not a shelf. It is a repair sequence.
          </h2>
          <p className="body-lg" style={{ margin: "0 0 48px", maxWidth: 760 }}>
            Every module has one job: make the next MBE repair decision clearer.
          </p>
          <div className="three-col">
            {modules.map((item) => (
              <div className="info-panel" key={item.title}>
                <div className="eyebrow-red" style={{ marginBottom: 12 }}>
                  ▸ {item.k}
                </div>
                <h3 className="serif" style={{ fontSize: 24, margin: "0 0 10px" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Pricing · 06</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 16 }}>
                ▸ FLAGSHIP AFTER THE DIAGNOSTIC
              </div>
              <h2 className="display display-md" style={{ margin: "0 0 24px" }}>
                {PRICING.flagshipName}:{" "}
                <span style={{ color: "var(--red)" }}>{PRICING.priceLabel}</span>
              </h2>
              <p className="body-lg">
                The free diagnostic comes first. Flagship is for students who
                look at the Red-Zone Map and want the guided repair path
                attached to it.
              </p>
              <p className="mono" style={{ marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
                {PRICING.paymentPlanLabel}.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/diagnostic" className="btn red">
                  Start Free Diagnostic <span className="arrow">→</span>
                </Link>
                <Link href="/pricing" className="btn ghost">
                  Review Flagship
                </Link>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "2px solid var(--ink)" }}>
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

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ FAQ · 07</span>
          </div>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {homeFaq.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="q">
                  <h2>{item.q}</h2>
                  <span className="toggle">+</span>
                </summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <div className="container">
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                ▌ START WITH THE DIAGNOSTIC
              </div>
              <h2 className="display display-lg" style={{ color: "white", margin: "0 0 24px" }}>
                Get the Red-Zone Map before you decide on Flagship.
              </h2>
              <p style={{ fontSize: 19, color: "#c8c4ba", lineHeight: 1.5, marginBottom: 32, maxWidth: "42ch" }}>
                The first ask is not payment. It is a diagnostic read on the
                pattern that keeps pulling points out of your MBE work.
              </p>
              <Link href="/diagnostic" className="btn btn-lg red">
                Start the Free Diagnostic <span className="arrow">→</span>
              </Link>
              <p className="mono" style={{ marginTop: 24, fontSize: 11, color: "var(--muted-light)" }}>
                {HERO.flagshipLine}
              </p>
            </div>
            <div style={{ border: "1px solid #c8c4ba", padding: 32 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--red)", marginBottom: 24 }}>
                ▌ LEAD ME
              </div>
              <h3 className="serif" style={{ color: "white", fontSize: 28, margin: "0 0 16px" }}>
                One next repair task.
              </h3>
              <p style={{ color: "#c8c4ba", lineHeight: 1.6, margin: 0 }}>
                BarMatrix is built for the student who does not want another
                dashboard full of resources. The system reads the miss, names
                the repair target, and leads the next move.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FitList({
  title,
  items,
  marker,
  muted = false,
}: {
  title: string;
  items: string[];
  marker: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div className={muted ? "eyebrow" : "eyebrow-red"} style={{ marginBottom: 16 }}>
        ▸ {title.toUpperCase()}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "2px solid var(--ink)" }}>
        {items.map((item) => (
          <li
            key={item}
            style={{
              padding: "16px 0",
              borderBottom: "1px solid var(--rule-soft)",
              fontSize: 16,
              display: "grid",
              gridTemplateColumns: "24px 1fr",
              gap: 12,
              color: muted ? "var(--muted)" : "var(--ink)",
            }}
          >
            <span className="mono" style={{ color: muted ? "var(--muted-light)" : "var(--red)" }}>
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiagnosticCard() {
  return (
    <div className="forensics-card">
      <div className="forensics-header">
        <span>
          <span className="live-dot" />
          Red-Zone Map
        </span>
        <span>Diagnostic-first</span>
      </div>
      <div className="forensics-body">
        <div className="q-meta">
          <div>
            <div className="k">Trap</div>
            <div className="v">Two-answer pull</div>
          </div>
          <div>
            <div className="k">Break</div>
            <div className="v">Rule/call clash</div>
          </div>
          <div>
            <div className="k">Priority</div>
            <div className="v">Red zone</div>
          </div>
          <div>
            <div className="k">Next</div>
            <div className="v">Guided task</div>
          </div>
        </div>

        <p className="q-stem">
          A student misses after narrowing the question to two plausible
          answers. BarMatrix does not start with more volume. It asks which
          wrong-answer pattern just won.
        </p>

        <div className="choices">
          <div className="choice picked">
            <span className="letter">1</span>
            <span className="text">The answer sounded legally familiar.</span>
            <span className="pct">Trap</span>
          </div>
          <div className="choice correct">
            <span className="letter">2</span>
            <span className="text">The correct answer stayed tied to the call and rule.</span>
            <span className="pct">Repair</span>
          </div>
          <div className="choice dim">
            <span className="letter">3</span>
            <span className="text">A broad dashboard will solve the next move.</span>
          </div>
          <div className="choice dim">
            <span className="letter">4</span>
            <span className="text">More questions matter only after the red zone is named.</span>
          </div>
        </div>

        <div className="forensic-breakdown">
          <div className="verdict">
            <span className="verdict-label">▌ Why the diagnostic comes first</span>
            <span className="verdict-stat">Map before payment</span>
          </div>
          <div className="tags-row">
            <span className="tag red">Red-Zone Map</span>
            <span className="tag">C3</span>
            <span className="tag solid">Lead Me</span>
          </div>
          <p className="forensic-why">
            The free diagnostic identifies the red zone. Flagship turns that
            map into wrong-answer forensics and one next guided repair task.
          </p>
          <div className="repair-cta">
            <div>
              <div className="label">Primary CTA</div>
              <div className="drill-name">Start the Free Diagnostic</div>
            </div>
            <span className="arrow">→</span>
          </div>
          <p className="demo-caption">Diagnostic preview shown before purchase</p>
        </div>
      </div>
    </div>
  );
}
