import Link from "next/link";
import { FAQ, DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "FAQ — BarMatrix",
  description:
    "Frequently asked questions about BarMatrix Flagship: pricing, cohort access, iOS/Android availability, course companion use, and refund terms.",
};

const EXTENDED_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Does BarMatrix include essays or performance tests?",
    a: "No. BarMatrix focuses on MBE multiple choice. You remain responsible for essay and performance-test preparation.",
  },
  {
    q: "Are these official NCBE questions?",
    a: "No. BarMatrix uses original MBE-style questions unless a question is expressly identified as licensed material. The product is not affiliated with or endorsed by NCBE or any bar authority.",
  },
  {
    q: "Can I use BarMatrix with BARBRI, Themis, Kaplan, UWorld, AdaptiBar, or Quimbee?",
    a: "Yes. BarMatrix is designed as a companion MBE repair system. Keep using your main course for the full bar exam, including essays and performance tests.",
  },
  {
    q: "Does BarMatrix guarantee that I will pass?",
    a: "No. No score, pass result, or exam outcome is guaranteed. BarMatrix provides structured MBE practice, diagnosis, and repair.",
  },
  {
    q: "What happens after I buy?",
    a: "You create or access your account, complete the diagnostic if you have not already done so, review your Red-Zone Map, and begin assigned repair drills. Your dashboard tracks accuracy, confidence, wrong-answer traps, and red-zone assignments.",
  },
];

const ALL = [...FAQ, ...EXTENDED_FAQ];

export default function FaqPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">SUPPORT · ANSWERS</span>
            <span className="stamp">PRICING · SCOPE · PLATFORMS</span>
            <span className="stamp">EDITION : LAUNCH</span>
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
            Quick answers about pricing, scope, platforms, and what comes after
            you enroll. Don&apos;t see your question?{" "}
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
            {ALL.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="q">
                  <h4>{item.q}</h4>
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
