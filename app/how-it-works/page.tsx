import Link from "next/link";

export const metadata = {
  title: "How BarMatrix Works - Red-Zone Map and Guided Repair",
  description:
    "See how the free BarMatrix diagnostic surfaces MBE trap patterns, builds a Red-Zone Map, and assigns a guided repair plan.",
};

const heatmapRows = [
  ["Civ Pro", "high", "high", "medium", "low"],
  ["Contracts", "medium", "high", "low", "medium"],
  ["Con Law", "medium", "low", "high", "medium"],
  ["Crim Law", "high", "medium", "medium", "low"],
  ["Evidence", "high", "low", "medium", "medium"],
  ["Real Property", "medium", "high", "low", "medium"],
  ["Torts", "medium", "medium", "medium", "low"],
];

const workflow = [
  {
    n: "1",
    icon: "list",
    title: "Take the Free Diagnostic",
    body: "Complete a timed set of focused MBE-style questions. We analyze your results for trap patterns across subjects and skills.",
    label: "You'll get",
    bullets: [
      "Performance by subject and skill",
      "Top trap patterns identified",
      "Initial Red Zone Map",
    ],
  },
  {
    n: "2",
    icon: "map",
    title: "See Your Red Zone Map",
    body: "Your map shows where traps are costing you points so you can focus effort where it matters most.",
    label: "You'll see",
    bullets: [
      "Severity by subject and skill",
      "Top trap patterns ranked",
      "Recommended focus areas",
    ],
  },
  {
    n: "3",
    icon: "target",
    title: "Follow Your Guided Repair",
    body: "Work targeted lessons and drill sets built for your patterns. Re-test to confirm improvement.",
    label: "You'll get",
    bullets: [
      "Personalized repair plan",
      "High-yield lessons and drills",
      "Retest and progress tracking",
    ],
  },
];

const forensicRows = [
  {
    icon: "target",
    label: "Trap Identified",
    title: "Misreading scope qualifiers",
    detail:
      "The answer choices used limiting language that narrowed the rule more than the facts supported.",
  },
  {
    icon: "A",
    label: "Your Selected Answer",
    title: "Choice A",
    detail:
      "\"The contract is unenforceable because the offer specified a material term.\"",
  },
  {
    icon: "idea",
    label: "Why It Looked Right",
    title:
      "The choice matched a rule you know: material terms are required for enforceability.",
  },
  {
    icon: "x",
    label: "Why It Fails",
    title:
      "The facts did not show the term was material to both parties under the applicable standard.",
    detail: "The rule was over-applied.",
  },
  {
    icon: "repair",
    label: "Assigned Repair",
    title: "Contracts: Material Terms vs. Price Terms",
    detail: "Scope Qualifiers in Offer and Acceptance (15 questions)",
  },
  {
    icon: "trend",
    label: "Track This Pattern",
    title:
      "This miss has been added to your Red Zone Map and will be retested in spaced intervals.",
  },
];

function MiniIcon({ type }: { type: string }) {
  return (
    <span className={`hiw-icon hiw-icon-${type}`} aria-hidden="true">
      <span />
    </span>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="hiw-page">
      <section className="hiw-hero">
        <div className="hiw-wrap hiw-hero-grid">
          <div className="hiw-hero-copy">
            <p className="hiw-kicker">Diagnostic-first. Repair second.</p>
            <h1>Find the trap pattern before you buy.</h1>
            <p className="hiw-lede">
              BarMatrix starts with a free diagnostic that surfaces your trap
              patterns across subjects and MBE skills.
            </p>
            <p className="hiw-lede">
              You&apos;ll get a Red Zone Map that shows exactly where to focus,
              then a guided repair plan built for those patterns.
            </p>
            <div className="hiw-actions">
              <Link className="hiw-btn hiw-btn-primary" href="/diagnostic">
                Start the Free Diagnostic <span>{"->"}</span>
              </Link>
              <Link className="hiw-btn hiw-btn-secondary" href="/pricing">
                View Pricing
              </Link>
            </div>
            <div className="hiw-value-row">
              <div>
                <MiniIcon type="target" />
                <strong>Diagnostic first</strong>
                <span>Know your patterns before you buy.</span>
              </div>
              <div>
                <MiniIcon type="map" />
                <strong>Targeted repair</strong>
                <span>Fix the right issues, not more content.</span>
              </div>
              <div>
                <MiniIcon type="trend" />
                <strong>Transparent process</strong>
                <span>See your data. Track your progress.</span>
              </div>
            </div>
          </div>

          <aside className="hiw-map-card" aria-label="Sample Red Zone Map">
            <div className="hiw-map-head">
              <h2>Red Zone Map</h2>
              <div className="hiw-legend" aria-hidden="true">
                <span>
                  <i className="hiw-high" /> High
                </span>
                <span>
                  <i className="hiw-medium" /> Medium
                </span>
                <span>
                  <i className="hiw-low" /> Lower
                </span>
              </div>
            </div>
            <div className="hiw-heatmap">
              <div />
              {["Spot Issue", "Rule Recall", "Application", "Analysis"].map(
                (label) => (
                  <b key={label}>{label}</b>
                ),
              )}
              {heatmapRows.map(([subject, ...cells]) => (
                <div className="hiw-row" key={subject}>
                  <span>{subject}</span>
                  {cells.map((cell, i) => (
                    <i className={`hiw-${cell}`} key={`${subject}-${i}`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="hiw-trap-list">
              <h3>Top Trap Patterns</h3>
              <p>
                <span>Misreading scope qualifiers</span>
                <strong>High</strong>
              </p>
              <p>
                <span>Confusing similar standards</span>
                <strong>High</strong>
              </p>
              <p>
                <span>Irrelevant facts attraction</span>
                <em>Medium</em>
              </p>
            </div>
            <div className="hiw-card-foot">
              <strong>Your recommended focus</strong>
              <Link href="/diagnostic">See plan {"->"}</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="hiw-section hiw-steps">
        <div className="hiw-wrap">
          <div className="hiw-section-head">
            <p className="hiw-kicker">How it works</p>
            <h2>From diagnostic to directed repair in three steps</h2>
          </div>
          <div className="hiw-step-grid">
            {workflow.map((step) => (
              <article className="hiw-step" key={step.n}>
                <span className="hiw-step-num">{step.n}</span>
                <MiniIcon type={step.icon} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="hiw-bullet-card">
                  <strong>{step.label}</strong>
                  {step.bullets.map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hiw-section hiw-forensics">
        <div className="hiw-wrap">
          <div className="hiw-section-head">
            <p className="hiw-kicker">Worked forensics record</p>
            <h2>See exactly how we analyze each miss</h2>
          </div>
          <div className="hiw-record">
            <div className="hiw-record-meta">
              <span>
                <strong>Subject:</strong> Contracts
              </span>
              <span>
                <strong>Skill:</strong> Contract Formation
              </span>
              <span>
                <strong>Question Type:</strong> Multiple Choice
              </span>
              <span>
                <strong>Difficulty:</strong> Medium
              </span>
              <Link href="/diagnostic">View Question</Link>
            </div>
            {forensicRows.map((row) => (
              <div className="hiw-record-row" key={row.label}>
                <div className="hiw-record-label">
                  <MiniIcon type={row.icon} />
                  <strong>{row.label}</strong>
                </div>
                <div className="hiw-record-copy">
                  <strong>{row.title}</strong>
                  {row.detail ? <p>{row.detail}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hiw-final">
        <div className="hiw-wrap hiw-final-card">
          <MiniIcon type="list" />
          <div>
            <h2>Start with clarity. Repair with purpose.</h2>
            <p>
              Take the free diagnostic to see your trap patterns and get your
              Red Zone Map.
            </p>
            <div className="hiw-actions">
              <Link className="hiw-btn hiw-final-primary" href="/diagnostic">
                Start the Free Diagnostic <span>{"->"}</span>
              </Link>
              <Link className="hiw-btn hiw-final-secondary" href="/pricing">
                View Pricing
              </Link>
            </div>
            <div className="hiw-final-proof">
              <span>Takes about 60 minutes</span>
              <span>MBE-style questions</span>
              <span>No payment required</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hiw-page {
          --hiw-red: #c8102e;
          --hiw-red-dark: #a90016;
          --hiw-ink: #050817;
          --hiw-muted: #4d5362;
          --hiw-line: #d8dce5;
          --hiw-soft: #f7f8fb;
          --hiw-panel: #ffffff;
          background: #ffffff;
          color: var(--hiw-ink);
          font-family: var(--sans);
        }

        .hiw-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .hiw-hero {
          padding: 72px 0 92px;
          background:
            radial-gradient(circle at 85% 12%, rgba(200, 16, 46, 0.08), transparent 28%),
            linear-gradient(180deg, #fff 0%, #fbfcff 100%);
          border-bottom: 1px solid #eef0f4;
        }

        .hiw-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 500px);
          gap: 84px;
          align-items: center;
        }

        .hiw-kicker {
          margin: 0 0 22px;
          color: var(--hiw-red);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hiw-hero h1,
        .hiw-section h2,
        .hiw-final h2 {
          margin: 0;
          color: var(--hiw-ink);
          font-family: var(--sans);
          font-weight: 900;
          letter-spacing: -0.055em;
          line-height: 0.98;
        }

        .hiw-hero h1 {
          max-width: 650px;
          font-size: clamp(54px, 7vw, 88px);
        }

        .hiw-lede {
          max-width: 560px;
          margin: 26px 0 0;
          color: #272d3b;
          font-size: 21px;
          line-height: 1.55;
        }

        .hiw-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
          margin-top: 32px;
        }

        .hiw-btn {
          display: inline-flex;
          min-height: 66px;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 6px;
          padding: 0 34px;
          font-size: 16px;
          font-weight: 800;
          transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
        }

        .hiw-btn:active {
          transform: translateY(1px);
        }

        .hiw-btn-primary {
          background: linear-gradient(180deg, #d10f28, #b80018);
          color: #fff;
          box-shadow: 0 16px 32px rgba(200, 16, 46, 0.28);
        }

        .hiw-btn-primary:hover {
          background: var(--hiw-red-dark);
          color: #fff;
        }

        .hiw-btn-secondary {
          border: 1px solid #cfd4df;
          background: #fff;
          color: var(--hiw-ink);
        }

        .hiw-value-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          max-width: 620px;
          margin-top: 42px;
        }

        .hiw-value-row div {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 4px 14px;
          align-items: center;
        }

        .hiw-value-row strong {
          font-size: 14px;
        }

        .hiw-value-row span:not(.hiw-icon) {
          grid-column: 2;
          color: #3f4654;
          font-size: 13px;
          line-height: 1.35;
        }

        .hiw-map-card {
          padding: 28px;
          border: 1px solid #dce0e8;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 24px 70px rgba(20, 26, 44, 0.14);
        }

        .hiw-map-head,
        .hiw-card-foot,
        .hiw-record-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .hiw-map-head h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .hiw-legend {
          display: grid;
          gap: 7px;
          color: #333949;
          font-size: 12px;
          font-weight: 700;
        }

        .hiw-legend span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hiw-legend i,
        .hiw-heatmap i {
          display: block;
          border-radius: 2px;
        }

        .hiw-legend i {
          width: 12px;
          height: 12px;
        }

        .hiw-high {
          background: #d23a36;
        }

        .hiw-medium {
          background: #f5b66a;
        }

        .hiw-low {
          background: #eef0f4;
        }

        .hiw-heatmap {
          display: grid;
          grid-template-columns: 86px repeat(4, 1fr);
          gap: 5px;
          margin-top: 34px;
        }

        .hiw-heatmap b {
          align-self: end;
          color: #565d6d;
          font-size: 11px;
          line-height: 1.15;
          text-align: center;
        }

        .hiw-row {
          display: contents;
        }

        .hiw-row span {
          align-self: center;
          color: #2c3342;
          font-size: 12px;
          font-weight: 700;
        }

        .hiw-heatmap i {
          height: 31px;
        }

        .hiw-trap-list {
          margin-top: 28px;
          padding: 22px 24px;
          border: 1px solid #e0e4ec;
          border-radius: 8px;
          background: #fff;
        }

        .hiw-trap-list h3 {
          margin: 0 0 18px;
          font-size: 16px;
          letter-spacing: -0.02em;
        }

        .hiw-trap-list p {
          display: grid;
          grid-template-columns: 14px 1fr auto;
          gap: 12px;
          align-items: center;
          margin: 0 0 16px;
          color: #141928;
          font-size: 13px;
          font-weight: 700;
        }

        .hiw-trap-list p::before,
        .hiw-bullet-card span::before {
          content: "";
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--hiw-red);
        }

        .hiw-trap-list strong {
          color: var(--hiw-red);
        }

        .hiw-trap-list em {
          color: #111827;
          font-style: normal;
          font-weight: 700;
        }

        .hiw-card-foot {
          margin-top: 22px;
          font-size: 15px;
        }

        .hiw-card-foot a {
          color: var(--hiw-red);
          font-weight: 900;
        }

        .hiw-section {
          padding: 96px 0;
          background: #fff;
        }

        .hiw-section-head {
          margin: 0 auto 60px;
          text-align: center;
        }

        .hiw-section h2 {
          max-width: 820px;
          margin: 0 auto;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.05;
        }

        .hiw-step-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 44px;
        }

        .hiw-step {
          position: relative;
          padding: 0 22px;
          border-right: 1px solid var(--hiw-line);
        }

        .hiw-step:last-child {
          border-right: 0;
        }

        .hiw-step-num {
          display: grid;
          width: 54px;
          height: 54px;
          place-items: center;
          margin-bottom: 14px;
          border: 1.5px solid var(--hiw-red);
          border-radius: 50%;
          color: var(--hiw-red);
          font-size: 24px;
          font-weight: 800;
        }

        .hiw-step > .hiw-icon {
          width: 76px;
          height: 76px;
          margin: 0 0 24px 92px;
        }

        .hiw-step h3 {
          margin: 0 0 14px;
          color: var(--hiw-ink);
          font-size: 24px;
          letter-spacing: -0.035em;
          line-height: 1.1;
        }

        .hiw-step p {
          margin: 0 0 28px;
          color: #303746;
          font-size: 16px;
          line-height: 1.5;
        }

        .hiw-bullet-card {
          display: grid;
          gap: 14px;
          padding: 24px;
          border-radius: 8px;
          background: #f8f9fb;
          box-shadow: inset 0 0 0 1px #eef1f5;
        }

        .hiw-bullet-card strong {
          margin-bottom: 4px;
        }

        .hiw-bullet-card span {
          display: grid;
          grid-template-columns: 12px 1fr;
          gap: 12px;
          align-items: center;
          color: #161c2a;
          font-size: 14px;
        }

        .hiw-bullet-card span::before {
          width: 9px;
          height: 9px;
        }

        .hiw-forensics {
          padding-top: 70px;
        }

        .hiw-record {
          overflow: hidden;
          border: 1px solid #cfd5df;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 20px 60px rgba(20, 26, 44, 0.08);
        }

        .hiw-record-meta {
          flex-wrap: wrap;
          padding: 20px 34px;
          border-bottom: 1px solid #dde2ea;
          color: #151b29;
          font-size: 14px;
        }

        .hiw-record-meta span {
          padding-right: 28px;
          border-right: 1px solid #cfd5df;
        }

        .hiw-record-meta a {
          min-height: 44px;
          padding: 12px 20px;
          border: 1px solid #cbd1dc;
          border-radius: 5px;
          font-weight: 800;
        }

        .hiw-record-row {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 92px;
          border-bottom: 1px solid #e1e5ec;
        }

        .hiw-record-row:last-child {
          background: #f8f9fb;
          border-bottom: 0;
        }

        .hiw-record-label {
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 16px;
          align-items: center;
          padding: 24px 34px;
        }

        .hiw-record-label .hiw-icon {
          width: 38px;
          height: 38px;
        }

        .hiw-record-copy {
          padding: 24px 30px;
          border-left: 1px solid #e1e5ec;
          color: #232a39;
          font-size: 15px;
          line-height: 1.5;
        }

        .hiw-record-copy strong {
          display: block;
          margin-bottom: 4px;
          color: #111827;
          font-size: 16px;
        }

        .hiw-record-copy p {
          margin: 0;
          color: #4d5362;
        }

        .hiw-final {
          padding: 28px 0 72px;
          background: #fff;
        }

        .hiw-final-card {
          display: grid;
          grid-template-columns: 190px 1fr;
          gap: 42px;
          align-items: center;
          padding: 44px 72px;
          border-radius: 8px;
          background:
            radial-gradient(circle at 78% 12%, rgba(255, 255, 255, 0.22), transparent 26%),
            linear-gradient(135deg, #d40d22 0%, #b90017 56%, #d31629 100%);
          color: #fff;
          box-shadow: 0 22px 60px rgba(200, 16, 46, 0.24);
        }

        .hiw-final-card > .hiw-icon {
          width: 118px;
          height: 118px;
          color: #fff;
        }

        .hiw-final h2 {
          color: #fff;
          font-size: clamp(34px, 4vw, 48px);
        }

        .hiw-final p {
          margin: 12px 0 0;
          font-size: 19px;
          line-height: 1.4;
        }

        .hiw-final-primary {
          background: #fff;
          color: var(--hiw-ink);
        }

        .hiw-final-secondary {
          border: 1px solid rgba(255, 255, 255, 0.75);
          color: #fff;
        }

        .hiw-final-proof {
          display: flex;
          flex-wrap: wrap;
          gap: 34px;
          margin-top: 26px;
          font-size: 14px;
          font-weight: 800;
        }

        .hiw-final-proof span::before {
          content: "";
          display: inline-block;
          width: 9px;
          height: 9px;
          margin-right: 10px;
          border: 2px solid currentColor;
          border-radius: 50%;
          vertical-align: 1px;
        }

        .hiw-icon {
          position: relative;
          display: inline-grid;
          width: 42px;
          height: 42px;
          place-items: center;
          color: var(--hiw-red);
        }

        .hiw-icon::before,
        .hiw-icon::after,
        .hiw-icon span,
        .hiw-icon span::before,
        .hiw-icon span::after {
          content: "";
          position: absolute;
          box-sizing: border-box;
        }

        .hiw-icon-target::before {
          inset: 6px;
          border: 2px solid currentColor;
          border-radius: 50%;
        }

        .hiw-icon-target::after {
          inset: 16px;
          border: 2px solid currentColor;
          border-radius: 50%;
        }

        .hiw-icon-target span {
          width: 100%;
          height: 2px;
          background: currentColor;
        }

        .hiw-icon-target span::before {
          left: 50%;
          top: -20px;
          width: 2px;
          height: 42px;
          background: currentColor;
        }

        .hiw-icon-map::before {
          inset: 7px 6px;
          border: 2px solid currentColor;
          transform: skewY(-8deg);
        }

        .hiw-icon-map::after {
          left: 50%;
          top: 8px;
          width: 2px;
          height: 26px;
          background: currentColor;
          box-shadow: -12px 2px 0 currentColor, 12px -2px 0 currentColor;
        }

        .hiw-icon-trend::before {
          left: 9px;
          bottom: 8px;
          width: 4px;
          height: 14px;
          background: currentColor;
          box-shadow: 11px -8px 0 currentColor, 22px -18px 0 currentColor;
        }

        .hiw-icon-list::before {
          inset: 9px 7px 5px;
          border: 3px solid currentColor;
          border-radius: 7px;
        }

        .hiw-icon-list::after {
          top: 3px;
          left: 15px;
          width: 28px;
          height: 14px;
          border: 3px solid currentColor;
          border-radius: 5px;
          background: transparent;
        }

        .hiw-icon-list span {
          left: 17px;
          top: 26px;
          width: 26px;
          height: 3px;
          background: currentColor;
          box-shadow: 0 12px 0 currentColor, 0 24px 0 currentColor;
        }

        .hiw-icon-list span::before {
          left: -9px;
          top: -2px;
          width: 7px;
          height: 7px;
          border: 2px solid currentColor;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg);
          box-shadow: 8px 8px 0 -1px transparent;
        }

        .hiw-icon-A,
        .hiw-icon-x,
        .hiw-icon-idea,
        .hiw-icon-repair {
          border: 2px solid currentColor;
          border-radius: 50%;
          font-weight: 900;
        }

        .hiw-icon-A::before {
          content: "A";
          position: static;
          font-size: 18px;
        }

        .hiw-icon-x::before,
        .hiw-icon-x::after {
          left: 10px;
          top: 18px;
          width: 18px;
          height: 2px;
          background: currentColor;
          transform: rotate(45deg);
        }

        .hiw-icon-x::after {
          transform: rotate(-45deg);
        }

        .hiw-icon-idea::before {
          inset: 7px 12px 15px;
          border: 2px solid currentColor;
          border-radius: 50% 50% 45% 45%;
        }

        .hiw-icon-idea::after {
          left: 15px;
          bottom: 7px;
          width: 12px;
          height: 7px;
          border-top: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
        }

        .hiw-icon-repair::before {
          left: 13px;
          top: 7px;
          width: 8px;
          height: 27px;
          border: 2px solid currentColor;
          transform: rotate(45deg);
        }

        .hiw-icon-repair::after {
          left: 20px;
          top: 23px;
          width: 15px;
          height: 8px;
          border: 2px solid currentColor;
          border-left: 0;
          transform: rotate(45deg);
        }

        @media (max-width: 980px) {
          .hiw-hero-grid,
          .hiw-step-grid,
          .hiw-final-card {
            grid-template-columns: 1fr;
          }

          .hiw-hero-grid {
            gap: 42px;
          }

          .hiw-value-row {
            grid-template-columns: 1fr;
          }

          .hiw-step {
            padding: 0 0 32px;
            border-right: 0;
            border-bottom: 1px solid var(--hiw-line);
          }

          .hiw-step:last-child {
            border-bottom: 0;
          }

          .hiw-step > .hiw-icon {
            margin-left: 76px;
          }

          .hiw-final-card {
            padding: 36px;
          }

          .hiw-final-card > .hiw-icon {
            width: 86px;
            height: 86px;
          }
        }

        @media (max-width: 640px) {
          .hiw-wrap {
            padding: 0 20px;
          }

          .hiw-hero {
            padding: 52px 0 64px;
          }

          .hiw-hero h1 {
            font-size: clamp(44px, 13vw, 58px);
          }

          .hiw-lede {
            font-size: 17px;
          }

          .hiw-actions,
          .hiw-btn {
            width: 100%;
          }

          .hiw-map-card {
            min-width: 0;
            padding: 18px;
          }

          .hiw-heatmap {
            grid-template-columns: 72px repeat(4, minmax(42px, 1fr));
            overflow-x: auto;
          }

          .hiw-section {
            padding: 68px 0;
          }

          .hiw-section-head {
            margin-bottom: 42px;
          }

          .hiw-section h2 {
            font-size: 34px;
          }

          .hiw-record-meta {
            align-items: flex-start;
            flex-direction: column;
          }

          .hiw-record-meta span {
            border-right: 0;
          }

          .hiw-record-row {
            grid-template-columns: 1fr;
          }

          .hiw-record-label {
            padding: 20px;
          }

          .hiw-record-copy {
            border-left: 0;
            border-top: 1px solid #e1e5ec;
            padding: 20px;
          }

          .hiw-final-card {
            gap: 24px;
            padding: 30px 24px;
          }
        }
      `}</style>
    </main>
  );
}
