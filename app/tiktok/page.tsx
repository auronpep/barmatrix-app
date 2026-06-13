import Link from "next/link";

export const metadata = {
  title: "BarMatrix TikTok Entry - Free MBE Trap Diagnostic",
  description:
    "Start BarMatrix from TikTok with the free MBE Trap Diagnostic, then enroll in Flagship if the repair path fits.",
};

export default function TikTokEntryPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">TIKTOK ENTRY</span>
            <span className="stamp">FREE DIAGNOSTIC FIRST</span>
            <span className="stamp">FLAGSHIP · $999</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ BARMATRIX MBE REPAIR
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "19ch" }}
          >
            Find the trap pattern before you buy another resource.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            Start with the free MBE Trap Diagnostic. BarMatrix reads the misses,
            names the red zones, and shows whether the Flagship repair path is
            the right next step for July-cycle prep.
          </p>
          <div
            className="hero-actions"
            style={{ marginTop: 34, display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <Link
              href="/diagnostic?utm_source=tiktok&utm_medium=social&utm_campaign=tiktok-entry"
              className="btn btn-lg red"
            >
              Start free diagnostic <span className="arrow">→</span>
            </Link>
            <Link
              href="/pricing?utm_source=tiktok&utm_medium=social&utm_campaign=tiktok-entry"
              className="btn btn-lg ghost"
            >
              View Flagship pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ The Path</span>
          </div>
          <div className="three-col">
            {[
              {
                label: "01",
                title: "Take the diagnostic",
                body: "Answer a short MBE set so BarMatrix can rank the traps that pulled your choices off course.",
              },
              {
                label: "02",
                title: "Read the map",
                body: "See the red zones, wrong-answer forensics, and recurring patterns behind the score.",
              },
              {
                label: "03",
                title: "Repair with Flagship",
                body: "Enroll only when the map proves the need for guided drills, timed repair work, and account access.",
              },
            ].map((step) => (
              <div className="info-panel" key={step.label}>
                <div className="eyebrow-red" style={{ marginBottom: 14 }}>
                  ▌ {step.label}
                </div>
                <h2
                  className="serif"
                  style={{ fontSize: 24, margin: "0 0 12px" }}
                >
                  {step.title}
                </h2>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--bg)" }}
      >
        <div className="container">
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 20 }}>
                ▌ JULY-CYCLE FLAGSHIP
              </div>
              <h2
                className="display display-md"
                style={{ color: "white", margin: "0 0 18px" }}
              >
                Full repair access after the diagnostic proves the gap.
              </h2>
              <p
                style={{
                  color: "#c8c4ba",
                  fontSize: 18,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                Flagship includes the Red-Zone Map, wrong-answer forensics,
                targeted drills, timed repair sets, boot camps, certification
                checks, and the account dashboard.
              </p>
            </div>
            <div>
              <Link
                href="/checkout?utm_source=tiktok&utm_medium=social&utm_campaign=tiktok-entry"
                className="btn btn-lg red"
              >
                Enroll in Flagship - $999 <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
