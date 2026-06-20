import Link from "next/link";
import { DISCLAIMER, FAQ } from "@/lib/copy";

export const metadata = {
  title: "FAQ - BarMatrix",
  description:
    "Frequently asked questions about BarMatrix Flagship pricing, the free diagnostic, Red-Zone Map, guided repair, enrollment, and July 2026 access.",
  alternates: { canonical: "/faq" },
};

const FAQ_GROUPS = [
  {
    id: "price",
    label: "Price",
    marker: "$",
    questions: ["What is the price?", "Is there a payment plan?"],
  },
  {
    id: "diagnostic",
    label: "Diagnostic",
    marker: "D",
    questions: [
      "Why start with the diagnostic before purchase?",
      "What does the diagnostic show?",
    ],
  },
  {
    id: "scope",
    label: "Scope",
    marker: "S",
    questions: ["What is BarMatrix?", "Is this a full bar course?"],
  },
  {
    id: "enrollment",
    label: "Enrollment",
    marker: "E",
    questions: ["How does enrollment work?", "How long does paid access last?"],
  },
  {
    id: "proof",
    label: "Proof",
    marker: "P",
    questions: ["What makes guided repair different?"],
  },
] as const;

const RED_ZONE_CELLS = new Set([
  3, 4, 10, 11, 12, 17, 18, 19, 25, 26, 32, 33, 34, 40,
]);

function getFaq(question: string) {
  const item = FAQ.find((entry) => entry.q === question);

  if (!item) {
    throw new Error(`FAQ copy missing: ${question}`);
  }

  return item;
}

function RedZoneGridMap() {
  return (
    <div className="faq-rz-map" aria-label="Red-Zone Map grid preview">
      <div className="faq-rz-grid" aria-hidden="true">
        {Array.from({ length: 49 }, (_, index) => (
          <span
            className={
              RED_ZONE_CELLS.has(index)
                ? "faq-rz-cell faq-rz-cell-hot"
                : "faq-rz-cell"
            }
            key={index}
          />
        ))}
      </div>
      <div className="faq-rz-axis faq-rz-axis-top">MBE rule areas</div>
      <div className="faq-rz-axis faq-rz-axis-side">Trap patterns</div>
      <div className="faq-rz-caption">
        <span>Red-Zone Grid</span>
        <strong>Priority clusters first</strong>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const groupedFaq = FAQ_GROUPS.map((group) => ({
    ...group,
    items: group.questions.map(getFaq),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <div className="faq-redesign">
        <section className="faq-hero" aria-labelledby="faq-title">
          <div className="faq-hero-copy">
            <p className="faq-kicker">FAQ</p>
            <h1 id="faq-title">Questions answered before you start.</h1>
            <p className="faq-lede">
              What BarMatrix is, what it costs, and how the free diagnostic
              proves the method before checkout.
            </p>
          </div>

          <div className="faq-hero-system">
            <RedZoneGridMap />
            <div className="faq-proof-stack" aria-label="BarMatrix proof flow">
              <div className="faq-proof-card">
                <span>Wrong Answer Forensics</span>
                <strong>Rule misread</strong>
                <i />
                <b />
              </div>
              <div className="faq-proof-card">
                <span>Root Cause</span>
                <strong>Two-answer trap</strong>
                <i />
              </div>
              <div className="faq-proof-card">
                <span>Repair Step</span>
                <strong>Targeted drill set</strong>
                <div className="faq-progress-dots" aria-hidden="true">
                  <em />
                  <em />
                  <em />
                  <em />
                  <em className="is-hot" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-main" aria-label="Frequently asked questions">
          <nav className="faq-rail" aria-label="FAQ categories">
            {FAQ_GROUPS.map((group) => (
              <a href={`#faq-${group.id}`} key={group.id}>
                <span>{group.marker}</span>
                {group.label}
              </a>
            ))}
          </nav>

          <div className="faq-questions">
            {groupedFaq.map((group) => (
              <section id={`faq-${group.id}`} key={group.id}>
                <h2>{group.label}</h2>
                <div className="faq-accordion">
                  {group.items.map((item) => (
                    <details key={item.q}>
                      <summary>
                        <span>{item.q}</span>
                        <b aria-hidden="true">⌄</b>
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="faq-start" aria-label="Start here">
            <div>
              <h2>Start here</h2>
              <p>
                The fastest way to understand BarMatrix is to see your Red-Zone
                Map.
              </p>
              <Link href="/diagnostic" className="faq-primary-link">
                <span aria-hidden="true">↗</span>
                Free Diagnostic
              </Link>
              <Link href="/how-it-works" className="faq-secondary-link">
                See How It Works
              </Link>
            </div>

            <ul>
              <li>
                <strong>Red-Zone Map</strong>
                See where your MBE misses cluster.
              </li>
              <li>
                <strong>Wrong Answer Forensics</strong>
                Understand why a tempting answer pulled you in.
              </li>
              <li>
                <strong>Guided Repair Path</strong>
                Follow one next task built for the weak spot.
              </li>
            </ul>

            <p className="faq-note">
              No credit card required for the diagnostic. Paid access runs
              through the July 2026 bar exam.
            </p>
          </aside>
        </section>

        <section className="faq-clarity" aria-label="What BarMatrix is and is not">
          <div className="faq-clarity-panel">
            <div className="faq-clarity-icon faq-clarity-icon-check" aria-hidden="true" />
            <div>
              <h2>What it is</h2>
              <ul>
                <li>A diagnostic-first MBE repair system</li>
                <li>Your Red-Zone Map based on diagnostic results</li>
                <li>Wrong Answer Forensics that find root causes</li>
                <li>A guided repair path that targets weak rules</li>
                <li>Focused practice that builds accuracy over time</li>
              </ul>
            </div>
          </div>

          <div className="faq-clarity-panel">
            <div className="faq-clarity-icon faq-clarity-icon-x" aria-hidden="true" />
            <div>
              <h2>What it is not</h2>
              <ul>
                <li>Not a replacement for a full bar course</li>
                <li>Not passive video lectures without accountability</li>
                <li>Not one-size-fits-all practice</li>
                <li>Not a guarantee of any outcome</li>
                <li>Not a substitute for consistent work</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="faq-cta" aria-label="Free diagnostic">
          <RedZoneGridMap />
          <div>
            <h2>See your Red-Zone Grid first.</h2>
            <p>
              Answer real MBE-style questions, see where you stand, and get a
              guided repair priority before paid checkout.
            </p>
          </div>
          <Link href="/diagnostic" className="faq-cta-button">
            Free Diagnostic
          </Link>
        </section>

        <section className="faq-disclaimer" aria-label="Important disclaimer">
          <h2>Important</h2>
          <p>{DISCLAIMER}</p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <style>{`
        .faq-redesign {
          --faq-bg: #f8f8f5;
          --faq-ink: #141720;
          --faq-muted: #51545f;
          --faq-faint: #efefea;
          --faq-rule: #d7d7d0;
          --faq-red: #b30f19;
          --faq-red-dark: #8f0811;
          --faq-shadow: 0 24px 70px rgba(20, 23, 32, 0.08);
          background:
            linear-gradient(90deg, rgba(20, 23, 32, 0.035) 1px, transparent 1px),
            linear-gradient(0deg, rgba(20, 23, 32, 0.035) 1px, transparent 1px),
            var(--faq-bg);
          background-size: 56px 56px;
          color: var(--faq-ink);
        }

        .faq-redesign :where(h1, h2, p, ul) {
          margin: 0;
        }

        .faq-hero,
        .faq-main,
        .faq-clarity,
        .faq-cta,
        .faq-disclaimer {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .faq-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
          gap: 64px;
          align-items: center;
          padding: 68px 0 42px;
          border-bottom: 1px solid var(--faq-rule);
        }

        .faq-kicker {
          color: var(--faq-red);
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0;
          margin-bottom: 18px;
        }

        .faq-hero h1 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(54px, 6vw, 82px);
          line-height: 0.96;
          letter-spacing: 0;
          max-width: 9.4ch;
        }

        .faq-lede {
          color: var(--faq-muted);
          font-size: 19px;
          line-height: 1.55;
          margin-top: 28px;
          max-width: 58ch;
        }

        .faq-hero-system {
          display: grid;
          grid-template-columns: minmax(230px, 1fr) minmax(220px, 0.82fr);
          gap: 24px;
          align-items: center;
          min-height: 300px;
        }

        .faq-rz-map {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 282px;
          border: 1px solid rgba(20, 23, 32, 0.1);
          background:
            linear-gradient(90deg, rgba(20, 23, 32, 0.055) 1px, transparent 1px),
            linear-gradient(0deg, rgba(20, 23, 32, 0.055) 1px, transparent 1px),
            rgba(255, 255, 255, 0.58);
          background-size: 18px 18px;
          box-shadow: var(--faq-shadow);
          overflow: hidden;
        }

        .faq-rz-grid {
          display: grid;
          grid-template-columns: repeat(7, 24px);
          grid-auto-rows: 24px;
          gap: 7px;
          transform: rotate(-8deg) skewY(4deg);
        }

        .faq-rz-cell {
          display: block;
          border: 1px solid rgba(20, 23, 32, 0.23);
          background: rgba(255, 255, 255, 0.72);
        }

        .faq-rz-cell-hot {
          border-color: rgba(179, 15, 25, 0.76);
          background: linear-gradient(135deg, #d7192a, #a80d17);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
        }

        .faq-rz-axis {
          position: absolute;
          color: rgba(20, 23, 32, 0.48);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .faq-rz-axis-top {
          top: 18px;
          left: 22px;
        }

        .faq-rz-axis-side {
          right: -25px;
          top: 115px;
          transform: rotate(90deg);
        }

        .faq-rz-caption {
          position: absolute;
          left: 18px;
          bottom: 18px;
          display: grid;
          gap: 4px;
          color: var(--faq-ink);
          font-size: 12px;
        }

        .faq-rz-caption span {
          color: var(--faq-red);
          font-weight: 800;
          text-transform: uppercase;
        }

        .faq-rz-caption strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
        }

        .faq-proof-stack {
          display: grid;
          gap: 14px;
        }

        .faq-proof-card {
          position: relative;
          display: grid;
          gap: 9px;
          min-height: 92px;
          padding: 18px;
          border: 1px solid rgba(20, 23, 32, 0.15);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 18px 46px rgba(20, 23, 32, 0.09);
        }

        .faq-proof-card span {
          color: var(--faq-ink);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .faq-proof-card strong {
          font-size: 15px;
        }

        .faq-proof-card i,
        .faq-proof-card b {
          display: block;
          width: 78%;
          height: 7px;
          border-radius: 999px;
          background: #deded8;
        }

        .faq-proof-card b {
          width: 56px;
          background: var(--faq-red);
        }

        .faq-progress-dots {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 4px;
        }

        .faq-progress-dots em {
          display: block;
          width: 12px;
          height: 12px;
          border: 1px solid rgba(20, 23, 32, 0.2);
          border-radius: 999px;
          background: #dcdcd6;
        }

        .faq-progress-dots .is-hot {
          background: var(--faq-red);
          border-color: var(--faq-red);
        }

        .faq-main {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr) 270px;
          gap: 46px;
          align-items: start;
          padding: 34px 0 72px;
        }

        .faq-rail {
          position: sticky;
          top: 96px;
          display: grid;
          gap: 10px;
          padding: 12px 0;
          border-right: 1px solid var(--faq-rule);
        }

        .faq-rail a {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 48px;
          color: var(--faq-ink);
          text-decoration: none;
          font-size: 16px;
          font-weight: 650;
        }

        .faq-rail span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid var(--faq-rule);
          color: var(--faq-red);
          font-size: 14px;
          font-weight: 900;
        }

        .faq-questions {
          display: grid;
          gap: 28px;
        }

        .faq-questions h2,
        .faq-start h2,
        .faq-clarity h2,
        .faq-disclaimer h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 26px;
          line-height: 1.12;
          letter-spacing: 0;
        }

        .faq-accordion {
          border-top: 1px solid var(--faq-rule);
          margin-top: 12px;
        }

        .faq-accordion details {
          border-bottom: 1px solid var(--faq-rule);
        }

        .faq-accordion summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 48px;
          padding: 12px 0;
          cursor: pointer;
          list-style: none;
          color: var(--faq-ink);
          font-size: 16px;
          font-weight: 760;
        }

        .faq-accordion summary::-webkit-details-marker {
          display: none;
        }

        .faq-accordion summary b {
          color: var(--faq-muted);
          font-size: 20px;
          line-height: 1;
          transition: transform 160ms ease;
        }

        .faq-accordion details[open] summary b {
          transform: rotate(180deg);
        }

        .faq-accordion p {
          color: var(--faq-muted);
          font-size: 15px;
          line-height: 1.62;
          max-width: 76ch;
          padding: 0 42px 18px 0;
        }

        .faq-start {
          position: sticky;
          top: 96px;
          display: grid;
          gap: 26px;
          padding: 30px;
          border: 1px solid rgba(20, 23, 32, 0.08);
          background: rgba(255, 255, 255, 0.7);
          box-shadow: var(--faq-shadow);
        }

        .faq-start h2::after {
          content: "";
          display: block;
          width: 48px;
          height: 4px;
          margin-top: 18px;
          background: var(--faq-red);
        }

        .faq-start p {
          color: var(--faq-muted);
          font-size: 15px;
          line-height: 1.55;
          margin-top: 22px;
        }

        .faq-primary-link,
        .faq-secondary-link,
        .faq-cta-button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 18px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 850;
        }

        .faq-primary-link {
          gap: 12px;
          margin-top: 26px;
          color: white;
          background: linear-gradient(135deg, var(--faq-red), var(--faq-red-dark));
          box-shadow: 0 14px 30px rgba(179, 15, 25, 0.22);
        }

        .faq-secondary-link {
          margin-top: 12px;
          color: var(--faq-ink);
          border: 1px solid rgba(20, 23, 32, 0.42);
          background: white;
        }

        .faq-start ul {
          display: grid;
          gap: 18px;
          padding: 0;
          list-style: none;
        }

        .faq-start li {
          display: grid;
          gap: 4px;
          color: var(--faq-muted);
          font-size: 14px;
          line-height: 1.42;
        }

        .faq-start li strong {
          color: var(--faq-ink);
          font-size: 15px;
        }

        .faq-start .faq-note {
          margin: 0;
          font-size: 14px;
        }

        .faq-clarity {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          padding: 38px 0 52px;
          border-top: 1px solid var(--faq-rule);
          border-bottom: 1px solid var(--faq-rule);
        }

        .faq-clarity-panel {
          display: grid;
          grid-template-columns: 96px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
        }

        .faq-clarity-icon {
          position: relative;
          width: 68px;
          height: 68px;
          border: 2px solid var(--faq-red);
          border-radius: 999px;
        }

        .faq-clarity-icon-check::before {
          content: "";
          position: absolute;
          left: 20px;
          top: 18px;
          width: 22px;
          height: 34px;
          border-bottom: 3px solid var(--faq-red);
          border-right: 3px solid var(--faq-red);
          transform: rotate(42deg);
        }

        .faq-clarity-icon-x::before,
        .faq-clarity-icon-x::after {
          content: "";
          position: absolute;
          left: 18px;
          top: 32px;
          width: 30px;
          height: 3px;
          background: var(--faq-red);
        }

        .faq-clarity-icon-x::before {
          transform: rotate(45deg);
        }

        .faq-clarity-icon-x::after {
          transform: rotate(-45deg);
        }

        .faq-clarity ul {
          color: var(--faq-muted);
          font-size: 15px;
          line-height: 1.65;
          margin-top: 14px;
          padding-left: 18px;
        }

        .faq-cta {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr) 220px;
          gap: 42px;
          align-items: center;
          width: 100%;
          min-height: 220px;
          margin-top: 0;
          padding: 28px max(48px, calc((100vw - 1180px) / 2));
          color: white;
          background:
            linear-gradient(90deg, rgba(141, 8, 17, 0.96), rgba(188, 19, 31, 0.96)),
            var(--faq-red);
        }

        .faq-cta .faq-rz-map {
          min-height: 160px;
          border-color: rgba(255, 255, 255, 0.22);
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px),
            rgba(255, 255, 255, 0.05);
          background-size: 14px 14px;
          box-shadow: none;
        }

        .faq-cta .faq-rz-grid {
          grid-template-columns: repeat(7, 13px);
          grid-auto-rows: 13px;
          gap: 4px;
        }

        .faq-cta .faq-rz-cell {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .faq-cta .faq-rz-cell-hot {
          background: rgba(255, 255, 255, 0.86);
        }

        .faq-cta .faq-rz-axis,
        .faq-cta .faq-rz-caption {
          display: none;
        }

        .faq-cta h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1.03;
          letter-spacing: 0;
        }

        .faq-cta p {
          color: rgba(255, 255, 255, 0.88);
          font-size: 18px;
          line-height: 1.5;
          margin-top: 14px;
          max-width: 58ch;
        }

        .faq-cta-button {
          color: var(--faq-red);
          background: white;
        }

        .faq-disclaimer {
          padding: 36px 0 54px;
        }

        .faq-disclaimer p {
          color: var(--faq-muted);
          font-size: 13px;
          line-height: 1.6;
          max-width: 92ch;
          margin-top: 12px;
        }

        @media (max-width: 1060px) {
          .faq-hero,
          .faq-main,
          .faq-clarity,
          .faq-cta {
            grid-template-columns: 1fr;
          }

          .faq-hero-system {
            grid-template-columns: 1fr;
          }

          .faq-main {
            gap: 28px;
          }

          .faq-rail,
          .faq-start {
            position: static;
          }

          .faq-rail {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            border-right: 0;
            border-bottom: 1px solid var(--faq-rule);
            padding-bottom: 20px;
          }

          .faq-rail a {
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
            text-align: center;
          }

          .faq-start {
            grid-template-columns: 1fr 1fr;
          }

          .faq-start > div,
          .faq-start .faq-note {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 720px) {
          .faq-hero,
          .faq-main,
          .faq-clarity,
          .faq-disclaimer {
            width: min(100% - 32px, 1180px);
          }

          .faq-hero {
            gap: 36px;
            padding-top: 42px;
          }

          .faq-hero h1 {
            font-size: clamp(45px, 15vw, 62px);
          }

          .faq-hero-system,
          .faq-proof-stack,
          .faq-start,
          .faq-clarity-panel {
            grid-template-columns: 1fr;
          }

          .faq-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .faq-rail a {
            justify-content: flex-start;
            text-align: left;
          }

          .faq-rz-grid {
            grid-template-columns: repeat(7, 19px);
            grid-auto-rows: 19px;
            gap: 6px;
          }

          .faq-rz-axis-side {
            display: none;
          }

          .faq-clarity {
            gap: 30px;
          }

          .faq-cta {
            padding: 30px 24px;
            gap: 24px;
          }

          .faq-cta .faq-rz-map {
            min-height: 142px;
          }
        }
      `}</style>
    </>
  );
}
