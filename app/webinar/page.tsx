import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DISCLAIMER } from "@/lib/copy";
import { WebinarLeadForm } from "./webinar-lead-form";

export const metadata: Metadata = {
  title: "Next Webinar Notice",
  description:
    "BarMatrix webinar interest form. The next session is not scheduled yet; sign up to be notified when it is.",
  alternates: {
    canonical: "/webinar",
  },
};

export default function WebinarPage() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">WEBINAR</span>
            <span className="stamp">NEXT SESSION : NOT SCHEDULED</span>
            <span className="stamp">BARMATRIX FLAGSHIP</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ NEXT BARMATRIX WEBINAR
          </div>
          <h1 className="display display-lg" style={{ margin: "0 0 24px", maxWidth: "22ch" }}>
            The next webinar is not scheduled yet.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            Add your email and prep context if you want to be informed when the
            next session is placed on the calendar. BarMatrix will not send an
            automated confirmation from this form.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <Suspense fallback={<WebinarFormFallback />}>
              <WebinarLeadForm />
            </Suspense>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="info-panel" style={{ background: "var(--paper)" }}>
                <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
                  ▸ WHAT THIS SIGNUP DOES
                </div>
                <ol style={orderedListStyle}>
                  <li>Stores your webinar interest in the BarMatrix lead table.</li>
                  <li>Preserves campaign and partner attribution if you arrived from a tracked link.</li>
                  <li>Does not trigger a confirmation email, autoresponder, or sales sequence.</li>
                </ol>
              </div>

              <div className="info-panel">
                <div className="eyebrow" style={{ marginBottom: 12, color: "var(--ink)" }}>
                  ▸ USEFUL WHILE YOU WAIT
                </div>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6 }}>
                  You can still run the free diagnostic now. It identifies the trap
                  patterns behind your missed MBE answers and points you toward the
                  repair layer the webinar will cover.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
                  <Link href="/diagnostic" className="btn red">
                    Run free diagnostic
                  </Link>
                  <Link href="/how-it-works" className="btn ghost">
                    See how it works
                  </Link>
                </div>
              </div>

              <div className="scarcity-meter">
                <div className="meter-row">
                  <span className="left">Next webinar</span>
                  <span className="right">Unscheduled</span>
                </div>
                <div className="meter-bar">
                  <div className="fill" style={{ width: "0%" }} />
                </div>
                <div className="meter-meta">No date, time, or seat limit is being claimed.</div>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--muted)",
              margin: "40px 0 0",
              maxWidth: "80ch",
            }}
          >
            {DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}

function WebinarFormFallback() {
  return (
    <div className="price-card flagship">
      <span className="ribbon">NEXT SESSION</span>
      <h2 className="name">Loading signup</h2>
      <p className="summary">Preparing the webinar interest form.</p>
    </div>
  );
}

const orderedListStyle = {
  margin: 0,
  paddingLeft: 20,
  color: "var(--ink-soft)",
  fontSize: 15,
  lineHeight: 1.7,
} as const;
