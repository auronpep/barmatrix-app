"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CAPACITY_COPY, DISCLAIMER, PRICING } from "@/lib/copy";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [context, setContext] = useState("California July-cycle MBE prep");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `Name: ${name || "(not provided)"}`,
      `Email: ${email || "(not provided)"}`,
      `Context: ${context || "(not provided)"}`,
      "",
      "Please add me to the BarMatrix waitlist.",
    ].join("\n");
    window.location.href = `mailto:support@barmatrix.app?subject=${encodeURIComponent(
      "BarMatrix waitlist",
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">WAITLIST · JULY 2026 COHORT</span>
            <span className="stamp">CAPACITY STATE : REACHED</span>
            <span className="stamp">BARMATRIX FLAGSHIP</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ {CAPACITY_COPY.waitlist}
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "20ch" }}
          >
            The cohort is full. Join the waitlist for the next available seat.
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            {PRICING.capacityLine} When the cohort is full, checkout pauses and waitlist
            requests are handled in order by the launch team.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col" style={{ alignItems: "start" }}>
            <form className="price-card flagship" onSubmit={submit}>
              <span className="ribbon">WAITLIST</span>
              <h2 className="name">Request a seat</h2>
              <p className="summary">
                Send your waitlist request to support. If a seat opens, the launch team
                will follow up with the next steps.
              </p>

              <label className="mono" style={labelStyle} htmlFor="waitlist-name">
                Name
              </label>
              <input
                id="waitlist-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                style={inputStyle}
              />

              <label className="mono" style={labelStyle} htmlFor="waitlist-email">
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />

              <label className="mono" style={labelStyle} htmlFor="waitlist-context">
                Prep context
              </label>
              <textarea
                id="waitlist-context"
                value={context}
                onChange={(event) => setContext(event.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <button
                type="submit"
                className="btn btn-lg red"
                style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
              >
                Open email to join waitlist <span className="arrow">→</span>
              </button>

              {submitted && (
                <p
                  className="mono"
                  style={{
                    marginTop: 16,
                    color: "var(--red-deep)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    lineHeight: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Email draft opened. Send it to finish the request.
                </p>
              )}
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="info-panel" style={{ background: "var(--paper)" }}>
                <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
                  ▸ WHAT HAPPENS NEXT
                </div>
                <ol style={orderedListStyle}>
                  <li>Checkout remains paused while the cohort is at capacity.</li>
                  <li>Waitlist requests are reviewed in received order.</li>
                  <li>If a seat opens, support sends the next enrollment step.</li>
                </ol>
              </div>

              <div className="scarcity-meter">
                <div className="meter-row">
                  <span className="left">July-cycle cohort</span>
                  <span className="right">Waitlist</span>
                </div>
                <div className="meter-bar">
                  <div className="fill" style={{ width: "100%" }} />
                </div>
                <div className="meter-meta">{CAPACITY_COPY.waitlist}</div>
              </div>

              <div className="info-panel">
                <div className="eyebrow" style={{ marginBottom: 12, color: "var(--ink)" }}>
                  ▸ STILL USEFUL NOW
                </div>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6 }}>
                  You can still take the free diagnostic, review how Red-Zone mapping works,
                  and keep your email ready for a seat offer.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
                  <Link href="/diagnostic" className="btn red">
                    Take diagnostic
                  </Link>
                  <Link href="/how-it-works" className="btn ghost">
                    See how it works
                  </Link>
                </div>
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
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.14em",
  marginTop: 18,
  marginBottom: 8,
  textTransform: "uppercase",
} as const;

const inputStyle = {
  width: "100%",
  border: "1px solid var(--rule-soft)",
  background: "var(--bg)",
  color: "var(--ink)",
  font: "inherit",
  padding: "14px 16px",
} as const;

const orderedListStyle = {
  margin: 0,
  paddingLeft: 20,
  color: "var(--ink-soft)",
  fontSize: 15,
  lineHeight: 1.7,
} as const;
