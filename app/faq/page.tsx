import Link from "next/link";
import { FAQ, DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "FAQ — BarMatrix",
  description:
    "Frequently asked questions about BarMatrix Flagship: pricing, cohort access, course companion use, and refund terms.",
};

export default function FaqPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">LOCKED COPY</span>
            <span className="stamp">SRC-0029</span>
            <span className="stamp">{FAQ.length} ANSWERS</span>
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
            The answers below are rendered from the locked BarMatrix FAQ copy.
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
