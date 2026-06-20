import type { Metadata } from "next";
import Link from "next/link";

type ComparisonRow = {
  label: string;
  alternative: string;
  barMatrix: string;
};

type CompetitorPage = {
  route: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  accent: string;
  lead: string;
  competitorName: string;
  competitorFit: string[];
  barMatrixFit: string[];
  rows: ComparisonRow[];
  useWhen: string[];
  faqs: Array<{ q: string; a: string }>;
  finalLine: string;
};

const sharedRows = {
  diagnostic: {
    label: "Starting point",
    alternative: "Practice, course work, lectures, or review materials.",
    barMatrix: "A free MBE diagnostic that produces a Red-Zone Map before purchase.",
  },
  repair: {
    label: "Repair method",
    alternative: "Question review and performance reporting.",
    barMatrix: "Wrong-answer forensics, C3 analysis, and one guided repair task.",
  },
  role: {
    label: "Best role",
    alternative: "A valid primary tool for its own job.",
    barMatrix: "An MBE-only companion when repeated misses need diagnosis.",
  },
} satisfies Record<string, ComparisonRow>;

export const competitorPages = {
  adaptibar: {
    route: "/alternatives/adaptibar",
    title: "AdaptiBar Alternative for MBE Trap Repair",
    description:
      "Compare AdaptiBar-style MBE question practice with BarMatrix diagnostic repair, Red-Zone Map, and wrong-answer forensics.",
    eyebrow: "ADAPTIBAR ALTERNATIVE",
    h1: "When more MBE questions are not enough, find the trap pattern.",
    accent: "trap pattern.",
    lead:
      "AdaptiBar is a strong fit when you want released multiple-choice practice, adaptive stats, and timing feedback. BarMatrix is for the student who has already done question volume but still cannot name why the same wrong answers keep winning.",
    competitorName: "AdaptiBar",
    competitorFit: [
      "You want a dedicated MBE multiple-choice simulator.",
      "You want adaptive practice and performance stats.",
      "You are supplementing a full bar course with more MBE volume.",
    ],
    barMatrixFit: [
      "You keep narrowing to two answers and choosing the tempting trap.",
      "You need a Red-Zone Map before deciding whether to enroll.",
      "You want one assigned repair task, not another self-directed menu.",
    ],
    rows: [
      sharedRows.diagnostic,
      {
        label: "Practice surface",
        alternative: "Released and simulated MBE-style questions with adaptive analytics.",
        barMatrix: "Diagnostic question work that routes misses into red zones and repair tasks.",
      },
      sharedRows.repair,
      sharedRows.role,
    ],
    useWhen: [
      "Keep AdaptiBar if you mainly need more MBE practice volume.",
      "Add BarMatrix if the missing piece is why the wrong answer keeps feeling responsive.",
      "Start with the diagnostic before paying for another layer.",
    ],
    faqs: [
      {
        q: "Does BarMatrix take the place of AdaptiBar?",
        a: "No. BarMatrix is an MBE diagnostic repair companion. Use AdaptiBar for practice volume if that is the job you need done.",
      },
      {
        q: "What does BarMatrix add?",
        a: "It names the red zone, explains the wrong-answer trap, and assigns one guided repair task from the diagnostic result.",
      },
      {
        q: "Should I start with the free diagnostic?",
        a: "Yes. The Red-Zone Map should make the repair target concrete before you consider Flagship.",
      },
    ],
    finalLine:
      "If your MBE work has become more questions without clearer repair, start with the free diagnostic.",
  },
  uworld: {
    route: "/alternatives/uworld-mbe-qbank",
    title: "UWorld MBE QBank Alternative for Trap Repair",
    description:
      "Compare UWorld MBE QBank practice with BarMatrix Red-Zone Map, wrong-answer forensics, and guided MBE repair.",
    eyebrow: "UWORLD MBE QBANK ALTERNATIVE",
    h1: "UWorld explains the law. BarMatrix diagnoses the miss.",
    accent: "diagnoses the miss.",
    lead:
      "UWorld is a strong fit for visual answer explanations, a large MBE QBank, flashcards, and analytics. BarMatrix fits when the student understands the explanation after reading it but still repeats the same selection error later.",
    competitorName: "UWorld MBE QBank",
    competitorFit: [
      "You want visual rationales and a broad MBE practice bank.",
      "You want flashcards, notes, and analytics in the same QBank tool.",
      "You are already inside Themis and using UWorld as the practice layer.",
    ],
    barMatrixFit: [
      "You read explanations but cannot name the wrong-answer architecture.",
      "You want the first repair target ranked before purchase.",
      "You need a guided repair path instead of another practice dashboard.",
    ],
    rows: [
      sharedRows.diagnostic,
      {
        label: "Explanation style",
        alternative: "Visual rationales, notes, flashcards, and performance reporting.",
        barMatrix: "Forensic wrong-answer debriefs focused on why the trap attracted you.",
      },
      sharedRows.repair,
      sharedRows.role,
    ],
    useWhen: [
      "Keep UWorld if visual explanations and QBank practice are moving you forward.",
      "Add BarMatrix when your issue is not explanation access, but repeated trap selection.",
      "Use the Red-Zone Map to decide whether guided repair is worth buying.",
    ],
    faqs: [
      {
        q: "Is BarMatrix a bigger QBank than UWorld?",
        a: "No. BarMatrix should not be evaluated as a bigger question bank. It is a diagnostic repair layer for MBE miss patterns.",
      },
      {
        q: "Can I use BarMatrix with UWorld?",
        a: "Yes. BarMatrix is built to sit beside a practice tool or full course when you need sharper wrong-answer diagnosis.",
      },
      {
        q: "What is the main CTA?",
        a: "Start the free diagnostic and review the Red-Zone Map before deciding on Flagship.",
      },
    ],
    finalLine:
      "If your explanations make sense only after the fact, let the diagnostic show which trap pattern needs repair first.",
  },
  qbank: {
    route: "/alternatives/mbe-question-bank",
    title: "Best MBE Question Bank Alternative for Diagnostic Repair",
    description:
      "Review MBE question-bank alternatives and when BarMatrix is the right diagnostic repair companion instead of another generic QBank.",
    eyebrow: "MBE QUESTION BANK ALTERNATIVES",
    h1: "The right MBE tool depends on the job: volume or repair.",
    accent: "volume or repair.",
    lead:
      "UWorld, AdaptiBar, NCBE study aids, BarMax, Quimbee SideBar, and self-study materials can all be useful. BarMatrix is narrower: it diagnoses repeated MBE misses and turns the highest-priority red zone into one guided repair task.",
    competitorName: "MBE question banks",
    competitorFit: [
      "You mainly need more questions, more explanations, or exam-style practice.",
      "You want to self-direct by subject, subtopic, timing, or released-question source.",
      "You already know what to repair and need repetition.",
    ],
    barMatrixFit: [
      "You have plenty of material but no clear repair target.",
      "Your score report does not explain why the wrong answer was attractive.",
      "You need a diagnostic-first path before buying another study shelf.",
    ],
    rows: [
      sharedRows.diagnostic,
      {
        label: "Tool category",
        alternative: "Question volume, answer explanations, lectures, videos, or official study aids.",
        barMatrix: "MBE wrong-answer forensics and guided repair.",
      },
      sharedRows.repair,
      sharedRows.role,
    ],
    useWhen: [
      "Choose a QBank when the shortage is practice volume.",
      "Choose official study aids when the shortage is released exam style.",
      "Choose BarMatrix when the shortage is diagnosis and repair sequencing.",
    ],
    faqs: [
      {
        q: "Is BarMatrix an official MBE question source?",
        a: "No. BarMatrix is not an official source of NCBE materials. It is a diagnostic-first MBE repair system.",
      },
      {
        q: "Which alternatives belong on the comparison list?",
        a: "The useful set is UWorld, AdaptiBar, NCBE study aids, BarMax, Quimbee SideBar, and self-study materials.",
      },
      {
        q: "What should I try first?",
        a: "If repeated misses are the problem, start with the free BarMatrix diagnostic and inspect the Red-Zone Map.",
      },
    ],
    finalLine:
      "If another QBank would only add volume, use the diagnostic to find the repair target first.",
  },
  barbri: {
    route: "/barbri-mbe-companion",
    title: "BARBRI MBE Companion for Wrong-Answer Repair",
    description:
      "Use BarMatrix alongside BARBRI when you need MBE diagnostic repair, Red-Zone Map, and wrong-answer forensics.",
    eyebrow: "BARBRI MBE COMPANION",
    h1: "Keep your full course. Add sharper MBE repair.",
    accent: "MBE repair.",
    lead:
      "BARBRI is a full bar review course. BarMatrix is not trying to replace that job. It fits beside BARBRI when your MBE question work is happening, but the same wrong-answer traps keep reappearing.",
    competitorName: "BARBRI",
    competitorFit: [
      "You need a full course structure across the bar exam.",
      "You want a broad schedule, lectures, assignments, and course materials.",
      "You need essay or performance-test support outside BarMatrix's scope.",
    ],
    barMatrixFit: [
      "Your MBE misses repeat even while you follow the course calendar.",
      "You want a Red-Zone Map that names the trap pattern.",
      "You need one next guided MBE repair task alongside your main course.",
    ],
    rows: [
      sharedRows.diagnostic,
      {
        label: "Coverage",
        alternative: "Full bar review structure across multiple exam components.",
        barMatrix: "Multiple-choice-only MBE diagnostic repair.",
      },
      sharedRows.repair,
      sharedRows.role,
    ],
    useWhen: [
      "Keep BARBRI for the full-course job.",
      "Use BarMatrix only for the MBE repair layer.",
      "Do the free diagnostic before adding another paid product.",
    ],
    faqs: [
      {
        q: "Is this a BARBRI alternative page?",
        a: "No. This is a companion page. BarMatrix is not a full bar course and does not cover essays or performance tests.",
      },
      {
        q: "When does BarMatrix fit beside BARBRI?",
        a: "When your MBE errors repeat and you need the trap pattern named, ranked, and converted into one repair task.",
      },
      {
        q: "What should a BARBRI student do first?",
        a: "Take the free diagnostic, review the Red-Zone Map, and only enroll if the repair target is clear.",
      },
    ],
    finalLine:
      "If your full course is doing its job but your MBE traps are still unnamed, start with the free diagnostic.",
  },
  themis: {
    route: "/themis-uworld-mbe-companion",
    title: "Themis and UWorld MBE Companion",
    description:
      "Use BarMatrix alongside Themis and UWorld when you need MBE trap diagnosis, Red-Zone Map, and guided repair.",
    eyebrow: "THEMIS / UWORLD MBE COMPANION",
    h1: "Themis gives structure. UWorld gives practice. BarMatrix gives MBE trap repair.",
    accent: "MBE trap repair.",
    lead:
      "Themis includes UWorld access, so many students already have a strong full-course plus QBank setup. BarMatrix only belongs beside it when the remaining issue is diagnostic: the same tempting wrong answers keep surviving review.",
    competitorName: "Themis and UWorld",
    competitorFit: [
      "You need full bar review structure plus UWorld practice.",
      "You want graded work, lectures, assignments, and QBank review.",
      "You are progressing with the course and can self-direct repair.",
    ],
    barMatrixFit: [
      "You can review the explanation but still repeat the same MBE trap.",
      "You want the diagnostic to rank the first repair target.",
      "You want Lead Me to assign one next MBE repair task.",
    ],
    rows: [
      sharedRows.diagnostic,
      {
        label: "Coverage",
        alternative: "Full course structure plus UWorld MBE practice.",
        barMatrix: "MBE-only diagnostic repair beside that structure.",
      },
      sharedRows.repair,
      sharedRows.role,
    ],
    useWhen: [
      "Keep Themis and UWorld for broad course structure and QBank work.",
      "Add BarMatrix only if repeated wrong-answer traps remain unnamed.",
      "Use the free diagnostic as the decision point.",
    ],
    faqs: [
      {
        q: "Does BarMatrix take the place of Themis or UWorld?",
        a: "No. It is a narrow MBE diagnostic repair companion for students who still need trap-level guidance.",
      },
      {
        q: "Why mention Themis and UWorld together?",
        a: "Because Themis includes UWorld access, so the honest comparison is not course versus QBank. It is course plus QBank versus a narrow repair layer.",
      },
      {
        q: "How do I know whether I need BarMatrix?",
        a: "Start with the free diagnostic. If the Red-Zone Map names a useful repair target, then consider Flagship.",
      },
    ],
    finalLine:
      "If Themis and UWorld are giving you material but not naming the trap, start with the diagnostic.",
  },
} satisfies Record<string, CompetitorPage>;

export function competitorMetadata(page: CompetitorPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.route },
  };
}

function ForensicVisual({ page }: { page: CompetitorPage }) {
  return (
    <div
      className="info-panel"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        minHeight: 420,
      }}
    >
      <div className="eyebrow-red" style={{ marginBottom: 18 }}>
        RED-ZONE SNAPSHOT
      </div>
      <h2 className="serif" style={{ fontSize: 34, lineHeight: 1.05, margin: "0 0 24px" }}>
        Diagnostic evidence before another study shelf.
      </h2>
      <div style={{ display: "grid", gap: 14 }}>
        {[
          ["01", "Miss pattern", "Two-answer trap keeps surviving review"],
          ["02", "Forensic read", page.barMatrixFit[0]],
          ["03", "Next task", "Repair the highest-priority red zone first"],
        ].map(([n, label, body]) => (
          <div
            key={n}
            style={{
              border: "1px solid rgba(246, 243, 236, 0.24)",
              padding: 18,
              display: "grid",
              gridTemplateColumns: "44px 1fr",
              gap: 14,
            }}
          >
            <span className="mono" style={{ color: "var(--red)", fontSize: 12 }}>
              {n}
            </span>
            <span>
              <span className="eyebrow" style={{ color: "var(--muted-light)" }}>
                {label}
              </span>
              <span style={{ display: "block", marginTop: 6, lineHeight: 1.45 }}>
                {body}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompetitorLandingPage({ page }: { page: CompetitorPage }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">COMPARISON</span>
            <span className="stamp">MBE ONLY</span>
            <span className="stamp">DIAGNOSTIC FIRST</span>
          </div>
          <div className="hero-grid">
            <div>
              <div className="eyebrow-red" style={{ marginBottom: 24 }}>
                {page.eyebrow}
              </div>
              <h1 className="display display-lg" style={{ margin: "0 0 24px" }}>
                {page.h1.replace(page.accent, "")}
                <span style={{ color: "var(--red)" }}>{page.accent}</span>
              </h1>
              <p className="body-lg">{page.lead}</p>
              <div className="hero-actions">
                <Link href="/diagnostic" className="btn btn-lg red">
                  Start the free diagnostic <span className="arrow">-&gt;</span>
                </Link>
                <Link href="/pricing" className="btn btn-lg ghost">
                  Review Flagship
                </Link>
                <div className="platforms">
                  No card.
                  <br />
                  Red-Zone Map first.
                </div>
              </div>
            </div>
            <ForensicVisual page={page} />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="stat-strip">
            {[
              ["Free", "diagnostic before purchase"],
              ["MBE", "multiple-choice repair only"],
              ["1", "guided task at a time"],
            ].map(([num, label]) => (
              <div key={label}>
                <span className="num">{num}</span>
                <span className="lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-rule">
            <span className="label">WHERE EACH TOOL FITS</span>
          </div>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="info-panel">
              <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
                {page.competitorName}
              </div>
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 18px" }}>
                Strong when this is the job.
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65 }}>
                {page.competitorFit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="info-panel">
              <div className="eyebrow-red" style={{ marginBottom: 12 }}>
                BARMATRIX
              </div>
              <h2 className="serif" style={{ fontSize: 30, margin: "0 0 18px" }}>
                Strong when repair is the job.
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65 }}>
                {page.barMatrixFit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">COMPARISON</span>
          </div>
          <div style={{ borderTop: "2px solid var(--ink)" }}>
            {page.rows.map((row) => (
              <div
                key={row.label}
                className="comparison-row"
              >
                <strong className="mono" style={{ fontSize: 12 }}>
                  {row.label}
                </strong>
                <p style={{ margin: 0, lineHeight: 1.55, color: "var(--ink-soft)" }}>
                  {row.alternative}
                </p>
                <p style={{ margin: 0, lineHeight: 1.55 }}>
                  {row.barMatrix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="section-rule">
            <span className="label">DECISION RULE</span>
          </div>
          <div className="two-col" style={{ alignItems: "center" }}>
            <h2 className="display display-md" style={{ margin: 0 }}>
              Do not buy another layer until the diagnostic makes the repair target clear.
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              {page.useWhen.map((item) => (
                <div
                  key={item}
                  style={{
                    borderTop: "1px solid rgba(246, 243, 236, 0.24)",
                    paddingTop: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">FAQ</span>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {page.faqs.map((item) => (
              <div key={item.q} className="info-panel">
                <h3 className="serif" style={{ margin: "0 0 8px", fontSize: 24 }}>
                  {item.q}
                </h3>
                <p style={{ margin: 0, lineHeight: 1.55, color: "var(--ink-soft)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container center">
          <h2 className="display display-md" style={{ margin: "0 auto 18px", maxWidth: "18ch" }}>
            {page.finalLine}
          </h2>
          <p className="body-lg" style={{ margin: "0 auto 28px" }}>
            BarMatrix Flagship is $999, or $500 today plus $499 in 30 days.
            Start free so the Red-Zone Map comes before the price.
          </p>
          <Link href="/diagnostic" className="btn btn-lg red">
            Get my Red-Zone Map <span className="arrow">-&gt;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
