"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiClientError, type AtlasAnswer, type AtlasAnswerDetour, type Letter } from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";
import styles from "./answer-client.module.css";

type State =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error"; message: string }
  | { kind: "ready"; answer: AtlasAnswer };

const CASE_STUDY_LABELS: Record<string, string> = {
  hero_verdict: "Verdict",
  question_card: "Question card",
  fork: "Fork",
  solve: "Solve",
  facts: "Facts",
  traps_wrong_answer_log: "Wrong-answer traps",
  bank_it: "Bank it",
  repair: "Repair",
};

const LETTERS: Letter[] = ["A", "B", "C", "D"];
const OUTLINE_CODE_RE = /^[0-9]{8}$/;
const PREVIEW_NATIVE_KEYS = new Set(["hero_verdict", "question_card", "fork", "solve"]);

export function AtlasAnswerClient() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        const answer = await api.getAtlasAnswer(token, params.id);
        if (!cancelled) setState({ kind: "ready", answer });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403) setState({ kind: "locked" });
        else if (err instanceof ApiClientError && err.status === 401) setState({ kind: "loading" });
        else setState({ kind: "error", message: "This Atlas answer is unavailable." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, params.id]);

  if (!isLoaded || (isSignedIn && state.kind === "loading")) return <Shell><StateBox text="Loading answer..." /></Shell>;
  if (isLoaded && !isSignedIn) return <Shell><StateBox text="Sign in to view this Atlas answer." href="/sign-in" cta="Sign in" /></Shell>;
  if (state.kind === "locked") return <Shell><StateBox text="Atlas answers are part of the paid repair program." href="/checkout" cta="Enroll" /></Shell>;
  if (state.kind === "error") return <Shell><StateBox text={state.message} /></Shell>;
  if (state.kind !== "ready") return <Shell><StateBox text="Loading answer..." /></Shell>;

  const q = state.answer.question;
  const selected = parseLetter(searchParams.get("pick"));
  const isCorrectPick = selected ? selected === q.correct_answer : null;
  const practiceHref = `/atlas/questions/${encodeURIComponent(q.question_id)}/practice`;
  const codeQuestionsHref = `/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-questions`;
  const caseStudyEntries = Object.entries(state.answer.case_study_modules).filter(
    ([key, value]) =>
      // ponytail: raw detour specs render only through filtered answer.detours.
      key !== "detours" && isRenderableModule(value),
  );
  const answerModules = caseStudyEntries.filter(([key]) => !PREVIEW_NATIVE_KEYS.has(key));
  const detours = state.answer.detours
    .map((detour) => ({ detour, href: detourHref(detour, q.outline_code) }))
    .filter((item): item is { detour: AtlasAnswerDetour; href: string } => item.href !== null);

  return (
    <Shell atlasHref={codeQuestionsHref}>
      <main className={styles.inner}>
        <Hero answer={state.answer} selected={selected} isCorrectPick={isCorrectPick} />
        <QuestionCard answer={state.answer} selected={selected} />

        <Band num="01" title="The fork" meta="tap any node to open the evidence">
          <ForkBoard answer={state.answer} selected={selected} />
        </Band>

        <Band num="02" title="Work the solve" meta="see the fork / lock the call / C3">
          <SolveStations answer={state.answer} />
        </Band>

        <Band num="03" title="The answer" meta={`credited / ${q.correct_answer}`}>
          <AnswerSection answer={state.answer} />
        </Band>

        <p className="sr-only">Case study path</p>
        {answerModules.map(([key, value], index) => (
          <Band
            key={key}
            num={String(index + 4).padStart(2, "0")}
            title={moduleBandTitle(key, index)}
            meta={moduleBandMeta(key)}
          >
            <ModulePanel label={caseStudyLabel(key)} value={value} open={index === 0} />
          </Band>
        ))}

        {detours.length > 0 ? (
          <Band num={String(answerModules.length + 4).padStart(2, "0")} title="Related study detours" meta="repair this pattern">
            <div id="atlas-answer-detours">
              <a href="#atlas-answer-detours" className="sr-only">Review related detours</a>
              <p className="sr-only">Review related detours</p>
              <div className={styles.detourGrid}>
                {detours.map(({ detour, href }) => (
                  <Link key={`${detour.type}:${detour.key}`} href={href} className={styles.detour}>
                    <p className={styles.eyebrow}>{caseStudyLabel(detour.type)}</p>
                    <h3>{detour.label}</h3>
                    <p className={`${styles.tiny} ${styles.muted}`}>
                      {detour.target_count} approved {detour.target_count === 1 ? "item" : "items"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Band>
        ) : null}
      </main>

      <StickyBar answer={state.answer} practiceHref={practiceHref} codeQuestionsHref={codeQuestionsHref} />
    </Shell>
  );
}

function Hero({
  answer,
  selected,
  isCorrectPick,
}: {
  answer: AtlasAnswer;
  selected: Letter | null;
  isCorrectPick: boolean | null;
}) {
  const q = answer.question;
  return (
    <section className={styles.hero}>
      <div>
        <p className={styles.kicker}>Decision-first answer key / {q.question_id}</p>
        <h1>Two questions hide in one call.<br />Only one is <em>asked.</em></h1>
        <p className={styles.meta}>
          {q.subject_display} / {q.subtopic} / governing lane: {q.outline_text}
        </p>
      </div>
      <div className={`${styles.stamp} ${isCorrectPick === true ? styles.stampGood : isCorrectPick === false ? styles.stampBad : ""}`}>
        <b>{isCorrectPick === true ? "Correct" : isCorrectPick === false ? "Missed" : "Key"}</b>
        <small>{selected ? `You chose ${selected} / key ${q.correct_answer}` : `credited / ${q.correct_answer}`}</small>
      </div>
    </section>
  );
}

function QuestionCard({ answer, selected }: { answer: AtlasAnswer; selected: Letter | null }) {
  const q = answer.question;
  return (
    <section className={styles.qcard}>
      <div className={styles.qcardTop}>
        <p className={styles.eyebrow}>The question as asked</p>
        <p className={`${styles.tiny} ${styles.muted}`}>{q.question_id} / {q.subject_display}</p>
      </div>
      <p className={styles.stem}>{q.stem}</p>
      <p className={styles.call}>{q.call_text}</p>
      <div className={styles.choices}>
        {LETTERS.map((letter) => {
          const correct = letter === q.correct_answer;
          const picked = selected === letter;
          return (
            <div
              key={letter}
              className={[
                styles.choice,
                correct ? styles.choiceCorrect : "",
                picked ? styles.choicePicked : "",
              ].filter(Boolean).join(" ")}
            >
              <span className={styles.letter}>{letter}</span>
              <span className={styles.choiceText}>{q.choices[letter]}</span>
              {correct ? <span className={`${styles.tag} ${styles.tagGood}`}>Credited</span> : picked ? <span className={`${styles.tag} ${styles.tagBad}`}>Your pick</span> : <span />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ForkBoard({ answer, selected }: { answer: AtlasAnswer; selected: Letter | null }) {
  const q = answer.question;
  const wrongLetters = LETTERS.filter((letter) => letter !== q.correct_answer);
  const leftLetters = wrongLetters.slice(0, 2);
  const rightLetters = [q.correct_answer, ...wrongLetters.slice(2)];

  return (
    <div>
      <div className={styles.forkCall}>
        <p className={styles.eyebrow}>The call asks one thing</p>
        <p>{q.call_text}</p>
      </div>
      <div className={styles.forkSplit}>
        <div className={`${styles.forkCol} ${styles.forkLeft}`}>
          <p className={styles.forkLabel}>Branch 1 / the decoy question</p>
          <h3 className={styles.forkTitle}>Does a vivid fact pull you away from the call?</h3>
          <p className={styles.hint}>True-ish can still lose if it answers the wrong remedy question.</p>
          <div className={styles.nodes}>
            {leftLetters.map((letter) => <ForkNode key={letter} answer={answer} letter={letter} selected={selected} />)}
          </div>
        </div>
        <div className={`${styles.forkCol} ${styles.forkRight}`}>
          <p className={styles.forkLabel}>Branch 2 / the remedy question</p>
          <h3 className={styles.forkTitle}>Which answer resolves the asked question?</h3>
          <p className={styles.hint}>Only one answer lands here correctly. Tap a node.</p>
          <div className={styles.nodes}>
            {rightLetters.map((letter) => <ForkNode key={letter} answer={answer} letter={letter} selected={selected} />)}
          </div>
        </div>
      </div>
      <div className={styles.forkFoot}>
        <p className={styles.eyebrow}>Call resolves it</p>
        <p><b>{q.correct_answer}</b> is credited because it answers the call: {q.minimum_explanation}</p>
      </div>
    </div>
  );
}

function ForkNode({ answer, letter, selected }: { answer: AtlasAnswer; letter: Letter; selected: Letter | null }) {
  const q = answer.question;
  const correct = letter === q.correct_answer;
  const picked = letter === selected;
  return (
    <details
      className={[
        styles.node,
        correct ? styles.nodeCorrect : "",
        picked ? styles.nodePicked : "",
      ].filter(Boolean).join(" ")}
      open={correct || picked}
    >
      <summary className="contents">
        <span className={styles.letter}>{letter}</span>
        <span className={styles.nodeText}>{q.choices[letter]}</span>
        <span className={`${styles.tiny} ${styles.muted}`}>{correct ? "credited" : picked ? "your pick" : "open"}</span>
      </summary>
      <div className={styles.nodeDetails}>
        {correct ? q.minimum_explanation : "This choice can contain a real fact, but the answer key tests whether it actually resolves the question asked."}
      </div>
    </details>
  );
}

function SolveStations({ answer }: { answer: AtlasAnswer }) {
  const q = answer.question;
  return (
    <div className={styles.solve}>
      <div className={styles.solveStation}>
        <div className={styles.stationHead}>
          <span className={`${styles.stationMark} ${styles.stationRound}`}>?</span>
          <h3>See the fork</h3>
          <small>violation vs. remedy</small>
        </div>
        <div className={styles.stationBox}>
          <p className={styles.eyebrow}>The key legal question</p>
          <h4>{q.call_text}</h4>
          <p>Before reading the choices, identify what the call is asking the court to do. A vivid fact may matter, but it does not win unless it supplies the requested result.</p>
        </div>
      </div>

      <div className={styles.solveStation}>
        <div className={styles.stationHead}>
          <span className={styles.stationMark}>02</span>
          <h3>Lock the call</h3>
          <small>call first</small>
        </div>
        <div className={styles.stationBox}>
          <p className={styles.eyebrow}>The call fixes the remedy</p>
          <h4>{q.call_text}</h4>
          <p>{q.minimum_explanation}</p>
        </div>
      </div>

      <div className={styles.solveStation}>
        <div className={styles.stationHead}>
          <span className={styles.stationMark}>C3</span>
          <h3>Cut - Clash - Call</h3>
          <small>run the program / lands on {q.correct_answer}</small>
        </div>
        <div className={styles.cccGrid}>
          <div className={styles.cccCell}>
            <p className={styles.eyebrow}>1 / Cut</p>
            <p>Eliminate choices that answer a different legal job than the one in the call.</p>
          </div>
          <div className={styles.cccCell}>
            <p className={styles.eyebrow}>2 / Clash</p>
            <p>Separate the tempting fact from the legal consequence the question asks for.</p>
          </div>
          <div className={`${styles.cccCell} ${styles.cccCall}`}>
            <p className={styles.eyebrow}>3 / Call</p>
            <p>{q.correct_answer} controls because it is responsive to the question asked.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerSection({ answer }: { answer: AtlasAnswer }) {
  const q = answer.question;
  const script = firstText(answer.case_study_modules.bank_it) ?? firstText(answer.case_study_modules.repair) ?? q.minimum_explanation;
  return (
    <>
      <div className={styles.answerBox}>
        <div className={styles.answerTop}>
          <span className={styles.answerLetter}>{q.correct_answer}</span>
          <div>
            <p className={styles.eyebrow}>True and responsive</p>
            <h3>{q.choices[q.correct_answer]}</h3>
          </div>
        </div>
        <p className={styles.answerCopy}>{q.correct_answer} is the best answer. {q.minimum_explanation}</p>
      </div>
      <div className={styles.scriptBox}>
        <p className={styles.eyebrow}>Say it to yourself / the final script</p>
        <p>{script}</p>
      </div>
    </>
  );
}

function Band({ num, title, meta, children }: { num: string; title: string; meta: string; children: React.ReactNode }) {
  return (
    <section className={styles.band}>
      <div className={styles.bandHead}>
        <span className={styles.bandNum}>{num}</span>
        <h2>{title}</h2>
        <span className={styles.rule} />
        <span className={styles.bandMeta}>{meta}</span>
      </div>
      {children}
    </section>
  );
}

function ModulePanel({ label, value, open }: { label: string; value: unknown; open: boolean }) {
  return (
    <details className={styles.moduleBox} open={open}>
      <summary className={styles.moduleSummary}>
        <span className={styles.plus}>+</span>
        <span>
          <span className={styles.moduleKey}>{label}</span>
          <strong>Approved answer module</strong>
        </span>
        <span className={styles.tiny}>+</span>
      </summary>
      <div className={styles.moduleBody}>
        <ModuleValue value={value} />
      </div>
    </details>
  );
}

function StickyBar({
  answer,
  practiceHref,
  codeQuestionsHref,
}: {
  answer: AtlasAnswer;
  practiceHref: string;
  codeQuestionsHref: string;
}) {
  const q = answer.question;
  return (
    <div className={styles.sticky}>
      <div className={styles.stickyInner}>
        <div className={styles.stickyTitle}>
          <p className={`${styles.tiny} ${styles.muted}`}>Atlas answer key / {q.outline_code}</p>
          <strong>{q.outline_text}</strong>
        </div>
        <Link className={styles.stickyLink} href={`/atlas?code=${encodeURIComponent(q.outline_code)}#atlas-code-lesson`}>
          Study this outline code
        </Link>
        <Link className={styles.stickyLink} href={codeQuestionsHref}>
          Review code questions
        </Link>
        <Link className={styles.stickyCta} href={practiceHref}>
          Practice this question
        </Link>
      </div>
    </div>
  );
}

function detourHref(detour: AtlasAnswerDetour, outlineCode: string): string | null {
  if (detour.type === "outline_code" && OUTLINE_CODE_RE.test(detour.key)) {
    return `/atlas?code=${encodeURIComponent(detour.key)}#atlas-code-lesson`;
  }
  const atlasCode = `?atlasCode=${encodeURIComponent(outlineCode)}`;
  if (detour.type === "trap") {
    return `/traps/${encodeURIComponent(detour.key)}${atlasCode}`;
  }
  if (detour.type === "tension") {
    return `/tensions/${encodeURIComponent(detour.key)}${atlasCode}`;
  }
  return null;
}

function Shell({
  children,
  atlasHref = "/atlas",
}: {
  children: React.ReactNode;
  atlasHref?: string;
}) {
  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <Link href="/atlas" className={styles.brand}>
          <b>BARMATRIX</b>
          <span className={styles.dot} />
          <span>Answer key / Mixed combos</span>
        </Link>
        <div className={styles.tabs}>
          <span className={styles.tab}>Combo A<small>Margin spine</small></span>
          <span className={`${styles.tab} ${styles.tabActive}`}>Combo B<small>Fork-first</small></span>
          <span className={styles.tab}>Combo C<small>Spine / fork-first</small></span>
          <span className={styles.tab}>Combo D<small>Routing read</small></span>
          <span className={styles.tab}>Combo E<small>The transcript</small></span>
        </div>
        <div className={styles.topActions}>
          <Link href={atlasHref} className={styles.atlasLink}>Atlas</Link>
        </div>
      </header>
      {children}
    </div>
  );
}

function StateBox({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <main className={styles.stateWrap}>
      <div className={styles.stateBox}>
        <p>{text}</p>
        {href && cta ? <Link href={href} className={styles.stickyCta}>{cta}</Link> : null}
      </div>
    </main>
  );
}

function ModuleValue({ value }: { value: unknown }) {
  if (!isRenderableModule(value)) return null;

  if (typeof value === "string" || typeof value === "number") {
    return <p>{String(value)}</p>;
  }

  if (typeof value === "boolean") {
    return <p>{value ? "Yes" : "No"}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <div className={styles.moduleValue}>
        {value.filter(isRenderableModule).map((item, index) => (
          <div key={index} className={styles.moduleItem}>
            <ModuleValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value).filter(([, child]) => isRenderableModule(child));
    return (
      <div className={styles.moduleValue}>
        {entries.map(([key, child]) => (
          <div key={key} className={styles.moduleItem}>
            <p className={`${styles.tiny} ${styles.muted}`}>{caseStudyLabel(key)}</p>
            <ModuleValue value={child} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function parseLetter(value: string | null): Letter | null {
  const normalized = value?.toUpperCase();
  return normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D" ? normalized : null;
}

function isRenderableModule(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(isRenderableModule);
  if (isRecord(value)) return Object.values(value).some(isRenderableModule);
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function caseStudyLabel(key: string): string {
  return (
    CASE_STUDY_LABELS[key] ??
    key
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function moduleBandTitle(key: string, index: number): string {
  if (key === "facts") return "Facts in the stem";
  if (key === "traps_wrong_answer_log") return "How the traps are built";
  if (key === "bank_it") return "Bank it";
  if (key === "repair") return "Repair this pattern";
  return index === 0 ? "Case study path" : caseStudyLabel(key);
}

function moduleBandMeta(key: string): string {
  if (key === "facts") return "each fact / how you use it";
  if (key === "traps_wrong_answer_log") return "trap taxonomy / full log";
  if (key === "bank_it") return "one line to remember";
  if (key === "repair") return "red-zone map / repair drill";
  return "approved answer module";
}

function firstText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = firstText(item);
      if (text) return text;
    }
  }
  if (isRecord(value)) {
    const preferred = ["final_script", "finalScript", "review_truth", "reviewTruth", "body", "text"];
    for (const key of preferred) {
      const text = firstText(value[key]);
      if (text) return text;
    }
    for (const child of Object.values(value)) {
      const text = firstText(child);
      if (text) return text;
    }
  }
  return null;
}
