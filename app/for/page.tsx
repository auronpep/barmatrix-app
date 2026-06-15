import type { Metadata } from "next";
import Link from "next/link";
import { NICHE_PAGES } from "@/lib/niche-pages";

export const metadata: Metadata = {
  title: "Who BarMatrix is built for",
  description:
    "Repeat takers, near-miss examinees, working professionals, foreign-trained attorneys, and full-course students. Find the BarMatrix path built for your situation.",
  alternates: { canonical: "/for" },
};

export default function ForIndexPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">AUDIENCES · {String(NICHE_PAGES.length).padStart(2, "0")}</span>
            <span className="stamp">JULY 2026 CYCLE</span>
            <span className="stamp">EDITION : LAUNCH</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            ▌ WHO IT&apos;S FOR
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "22ch" }}
          >
            Same traps. <span style={{ fontStyle: "italic" }}>Different</span>{" "}
            <span style={{ color: "var(--red)" }}>starting points.</span>
          </h1>
          <p className="body-lg" style={{ marginBottom: 0 }}>
            The MBE reuses a finite set of trap patterns — but how you got here
            shapes the repair plan. Pick the path that matches your situation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">▌ Choose Your Path · 01</span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderTop: "2px solid var(--ink)",
            }}
          >
            {NICHE_PAGES.map((p, i) => (
              <li key={p.slug} style={{ borderBottom: "1px solid var(--rule-soft)" }}>
                <Link
                  href={`/for/${p.slug}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 24px",
                    gap: 16,
                    padding: "24px 0",
                    textDecoration: "none",
                    color: "inherit",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--red)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span>
                    <span
                      className="serif"
                      style={{
                        display: "block",
                        fontSize: 22,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {p.eyebrow.replace("▌ FOR ", "").replace("▌ ", "")}
                    </span>
                    <span
                      style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.5 }}
                    >
                      {p.metaDescription}
                    </span>
                  </span>
                  <span className="mono" style={{ color: "var(--red)" }}>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
