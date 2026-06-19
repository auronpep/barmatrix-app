import Link from "next/link";
import { PROOF_CARD } from "@/lib/copy";

export const metadata = {
  title: "How BarMatrix works — Wrong Answer Forensics",
  description:
    "Diagnostic first. Wrong Answer Forensics. Assigned repair. The BarMatrix method for MBE repair.",
};

const sections = [
  {
    num: "STEP 01",
    title: "Diagnostic first",
    body: "Start with a short MBE Trap Diagnostic. Instead of reporting only a percentage, BarMatrix looks at the type of wrong answers you choose: legally true but irrelevant, wrong timing, exception omitted, wrong party, wrong standard, and other recurring MBE trap patterns.",
  },
  {
    num: "STEP 02",
    title: "Wrong Answer Forensics",
    body: "When you miss a question, BarMatrix explains why your selected answer was attractive before explaining why it was wrong. A miss becomes a diagnosis: the rule boundary, trigger fact, timing issue, or misconception that needs repair.",
  },
  {
    num: "STEP 03",
    title: "Assigned repair",
    body: "Each miss is connected to a repair action: a Red-Zone Drill, boot camp, timed set, or spaced review assignment. The goal is not to do more questions randomly. The goal is to stop repeating the same trap.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">METHOD · 03 STEPS</span>
            <span className="stamp">WRONG-ANSWER FORENSICS</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ HOW BARMATRIX WORKS
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Diagnose the miss.{" "}
            <span style={{ fontStyle: "italic" }}>Repair the pattern.</span>{" "}
            <span style={{ color: "var(--red)" }}>Stop repeating it.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            The MBE reuses recurring legal tension points and answer-choice
            traps. BarMatrix maps those traps, diagnoses why attractive wrong
            answers pull you in, and assigns the drill that repairs the
            underlying misconception.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Method · 01</span>
          </div>
          <div className="four-col">
            {sections.map((s) => (
              <div className="method-step" key={s.title}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worked example — proof card */}
      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Worked Example · 02</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div>
              <h2
                className="display display-md"
                style={{ margin: "0 0 24px" }}
              >
                One miss →{" "}
                <span style={{ fontStyle: "italic" }}>one diagnosis</span> →{" "}
                <span style={{ color: "var(--red)" }}>one drill</span>.
              </h2>
              <p className="body-lg">
                A wrong answer isn&apos;t the end of the explanation —
                it&apos;s the start of the forensic record. Every miss gets
                tagged with the trap that pulled you in and the drill that
                repairs it.
              </p>
            </div>
            <div className="forensics-card">
              <div className="forensics-header">
                <span>
                  <span className="live-dot" />
                  Forensic Record
                </span>
                <span>EX-0001</span>
              </div>
              <div className="forensics-body">
                <div className="q-meta">
                  <div>
                    <div className="k">Trap</div>
                    <div className="v">{PROOF_CARD.trap}</div>
                  </div>
                  <div>
                    <div className="k">Selected</div>
                    <div className="v">{PROOF_CARD.studentSelected}</div>
                  </div>
                  <div>
                    <div className="k">Tension</div>
                    <div className="v">Purpose of Offer</div>
                  </div>
                  <div>
                    <div className="k">Forensic tag</div>
                    <div className="v">{PROOF_CARD.forensicTag}</div>
                  </div>
                </div>
                <p className="forensic-why">
                  <strong>Why it looked right:</strong>{" "}
                  {PROOF_CARD.whyLookedRight}
                </p>
                <p className="forensic-why" style={{ marginBottom: 16 }}>
                  <strong>Why it fails:</strong> {PROOF_CARD.whyFails}
                </p>
                <div className="repair-cta">
                  <div>
                    <div className="label">Assigned Drill</div>
                    <div className="drill-name">{PROOF_CARD.nextDrill}</div>
                  </div>
                  <span className="arrow">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container center">
          <div
            className="eyebrow-red"
            style={{ marginBottom: 24, justifyContent: "center" }}
          >
            ▌ READY TO FIND YOUR TRAPS?
          </div>
          <h2
            className="display display-md"
            style={{ color: "white", margin: "0 auto 32px", maxWidth: "20ch" }}
          >
            Take the Free Diagnostic.
          </h2>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/diagnostic" className="btn btn-lg red">
              Start the Diagnostic <span className="arrow">→</span>
            </Link>
            <Link href="/pricing" className="btn btn-lg ghost" style={{ color: "white", borderColor: "white" }}>
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
