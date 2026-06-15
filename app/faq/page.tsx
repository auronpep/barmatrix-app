import Link from "next/link";
import { FAQ, DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "FAQ — BarMatrix",
  description:
    "Frequently asked questions for California MBE test takers: pricing, cohort access, method scope, and refunds.",
};

export default function FaqPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">MBE-FIRST FAQ</span>
            <span className="stamp">SRC-0029</span>
            <span className="stamp">{FAQ.length} CLARITY BLOCKS</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ FAQ
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Frequently asked{" "}
            <span style={{ fontStyle: "italic" }}>questions.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            The answers below address the objections and method-level questions
            that come up before starting the diagnostic-first repair flow.
            Don&apos;t see your question?{" "}
            <Link
              href="mailto:support@barmatrix.app"
              style={{
                borderBottom: "1px solid var(--ink)",
                paddingBottom: 1,
              }}
          >
              Email support
            </Link>
            .
          </p>
          <div
            className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5"
            style={{ maxWidth: 760 }}
          >
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
              Proof and claim policy
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              BarMatrix is a diagnostic-first California MBE repair system only.
              We do not guarantee pass rates, outcomes, or score increases, and
              we are not officially affiliated with NCBE, the State Bar, or other
              bar authorities.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            {FAQ.map((item) => (
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

      <section className="section alt">
        <div className="container">
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div
              className="eyebrow-strong"
              style={{ marginBottom: 16 }}
            >
              ▌ IMPORTANT
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--ink-soft)",
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
