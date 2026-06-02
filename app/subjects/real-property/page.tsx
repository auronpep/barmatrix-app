"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api-client";
import { BRAND } from "@/lib/copy";

const SUBJECT = "Real Property";
const SUBJECT_SLUG = "real-property";
const PAGE_SIZE = 12;

type LoadPhase = "idle" | "loading" | "ready" | "error";

interface SubjectQuestion {
  question_id: string;
  external_id: string | null;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  tension_point: string | null;
  question_stem: string | null;
  fact_pattern: string | null;
}

interface SubjectBank {
  questions: SubjectQuestion[];
  total: number;
  page: number;
  limit: number;
  loadedAt: string;
}

interface TopicSummary {
  label: string;
  count: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function subjectEndpoint(): string {
  const params = new URLSearchParams({
    subject: SUBJECT,
    page: "1",
    limit: String(PAGE_SIZE),
  });
  return `${API_URL}/api/questions/by-subject?${params.toString()}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function pickArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ["questions", "items", "results", "data"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (isRecord(value)) {
      const nested = pickArray(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeQuestion(value: unknown): SubjectQuestion | null {
  if (!isRecord(value)) return null;
  const questionId = asString(value.question_id) ?? asString(value.id);
  if (!questionId) return null;

  return {
    question_id: questionId,
    external_id: asString(value.external_id),
    subject: asString(value.subject),
    topic: asString(value.topic),
    subtopic: asString(value.subtopic),
    tension_point:
      asString(value.tension_point) ??
      asString(value.tension) ??
      asString(value.tension_slug),
    question_stem:
      asString(value.question_stem) ??
      asString(value.stem) ??
      asString(value.call_of_question),
    fact_pattern: asString(value.fact_pattern),
  };
}

function normalizeBank(payload: unknown): SubjectBank {
  const questions = pickArray(payload)
    .map(normalizeQuestion)
    .filter((question): question is SubjectQuestion => question !== null);

  let total = questions.length;
  let page = 1;
  let limit = PAGE_SIZE;

  if (isRecord(payload)) {
    total =
      asNumber(payload.total) ??
      asNumber(payload.count) ??
      asNumber(payload.total_count) ??
      questions.length;
    page = asNumber(payload.page) ?? 1;
    limit = asNumber(payload.limit) ?? PAGE_SIZE;
  }

  return {
    questions,
    total,
    page,
    limit,
    loadedAt: new Date().toISOString(),
  };
}

function humanError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function previewText(question: SubjectQuestion): string {
  const source =
    question.question_stem ?? question.fact_pattern ?? "Question preview pending.";
  return source.length > 190 ? `${source.slice(0, 187)}...` : source;
}

function readableTension(value: string | null): string {
  if (!value) return "Tension pending";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function topCounts(
  questions: SubjectQuestion[],
  selector: (question: SubjectQuestion) => string | null,
): TopicSummary[] {
  const counts = new Map<string, number>();
  for (const question of questions) {
    const key = selector(question) ?? "Unlabeled";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 6);
}

export default function RealPropertySubjectPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<LoadPhase>("idle");
  const [bank, setBank] = useState<SubjectBank | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  const topics = useMemo(
    () => topCounts(bank?.questions ?? [], (question) => question.topic),
    [bank],
  );
  const tensions = useMemo(
    () => topCounts(bank?.questions ?? [], (question) => question.tension_point),
    [bank],
  );
  const questionIds = useMemo(
    () => (bank?.questions ?? []).map((question) => question.question_id),
    [bank],
  );

  const syncBank = async () => {
    setPhase("loading");
    setError(null);
    setPracticeError(null);

    try {
      const response = await fetch(subjectEndpoint(), {
        headers: { accept: "application/json" },
      });
      const payload = await readJson(response);
      if (!response.ok) {
        throw new Error(`API ${response.status}: ${JSON.stringify(payload)}`);
      }
      setBank(normalizeBank(payload));
      setPhase("ready");
    } catch (nextError) {
      setError(humanError(nextError));
      setPhase("error");
    }
  };

  const startPractice = () => {
    setPracticeError(null);
    if (questionIds.length === 0) {
      setPracticeError("Sync the Real Property bank before starting practice.");
      return;
    }

    const practiceId = `${SUBJECT_SLUG}-${Date.now()}`;
    try {
      window.sessionStorage.setItem(
        `barmatrix.diagnostic.${practiceId}`,
        JSON.stringify({
          diagnostic_id: practiceId,
          question_ids: questionIds,
          total_questions: questionIds.length,
          expected_total: PAGE_SIZE,
          bank_loaded: true,
          subject: SUBJECT,
        }),
      );
    } catch {
      setPracticeError("This browser could not cache the Real Property queue.");
      return;
    }

    router.push(`/diagnostic/${encodeURIComponent(practiceId)}/0`);
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-meta">
            <span className="stamp">MBE SUBJECT</span>
            <span className="stamp">BY-SUBJECT API</span>
            <span className="stamp">SRC-0026</span>
          </div>
          <div className="eyebrow-red" style={{ marginBottom: 24 }}>
            | {BRAND} subject practice
          </div>
          <h1
            className="display display-lg"
            style={{ margin: "0 0 24px", maxWidth: "18ch" }}
          >
            Real Property
          </h1>
          <p className="body-lg" style={{ marginBottom: 0, maxWidth: 760 }}>
            Real Property practice starts from the live subject endpoint, then
            hands the selected queue to the same answer and forensics runner used
            by the diagnostic flow.
          </p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <button
              type="button"
              className="btn btn-lg red"
              onClick={() => void syncBank()}
              disabled={phase === "loading"}
            >
              {phase === "loading" ? "Syncing bank" : "Sync Real Property bank"}
              <span className="arrow">-&gt;</span>
            </button>
            <button
              type="button"
              className="btn btn-lg ghost"
              onClick={startPractice}
              disabled={questionIds.length === 0}
            >
              Start Real Property practice
            </button>
            <Link href="/subjects/contracts" className="btn btn-lg ghost">
              Compare Contracts
            </Link>
            <Link href={`/tensions?subject=${encodeURIComponent(SUBJECT)}`} className="btn btn-lg ghost">
              Explore Real Property tensions
            </Link>
          </div>
          {practiceError && (
            <p className="mono" style={{ color: "var(--red)", marginTop: 18 }}>
              {practiceError}
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-rule">
            <span className="label">Subject Bank</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
              gap: 32,
              alignItems: "start",
            }}
          >
            <div>
              {phase === "idle" && <IdlePanel onSync={() => void syncBank()} />}
              {phase === "loading" && <StatusPanel title="Loading Real Property bank" />}

              {phase === "error" && (
                <div className="info-panel error">
                  <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
                    API unavailable
                  </div>
                  <p style={{ margin: 0, color: "var(--ink-soft)" }}>
                    {error}
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm red"
                    style={{ marginTop: 20 }}
                    onClick={() => void syncBank()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {phase === "ready" && bank && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      borderTop: "2px solid var(--ink)",
                      borderBottom: "1px solid var(--rule)",
                    }}
                  >
                    <Metric label="Returned" value={String(bank.questions.length)} />
                    <Metric label="Total" value={String(bank.total)} />
                    <Metric label="Limit" value={String(bank.limit)} />
                  </div>

                  <div style={{ marginTop: 28 }}>
                    <QuestionList questions={bank.questions} />
                  </div>
                </>
              )}
            </div>

            <aside
              className="forensics-card"
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            >
              <div className="forensics-header">
                <span>
                  <span className="live-dot" />
                  Real Property Focus
                </span>
                <span>{phase === "ready" ? "READY" : "SYNC"}</span>
              </div>
              <div className="forensics-body">
                <div className="eyebrow-strong" style={{ marginBottom: 16 }}>
                  Practice posture
                </div>
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                    margin: "0 0 24px",
                  }}
                >
                  Real Property questions are routed by ownership form, transfer
                  posture, recording priority, landlord-tenant status, and land-use
                  interests so the practice flow can isolate recurring title and
                  possession traps.
                </p>

                <SummaryBlock title="Topics" items={topics} />
                <SummaryBlock
                  title="Tensions"
                  items={tensions.map((item) => ({
                    ...item,
                    label: readableTension(item.label),
                  }))}
                />

                {bank && (
                  <p
                    className="mono"
                    style={{
                      color: "var(--muted)",
                      fontSize: 11,
                      margin: "22px 0 0",
                    }}
                  >
                    Loaded {new Date(bank.loadedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderRight: "1px solid var(--rule-soft)",
        minWidth: 0,
      }}
    >
      <div className="eyebrow">{label}</div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 28,
          lineHeight: 1.1,
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function IdlePanel({ onSync }: { onSync: () => void }) {
  return (
    <div className="info-panel">
      <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
        Ready to sync
      </div>
      <p style={{ margin: 0, color: "var(--ink-soft)" }}>
        Load the first Real Property page from the by-subject endpoint, review
        the returned queue, then start practice.
      </p>
      <button
        type="button"
        className="btn btn-sm red"
        style={{ marginTop: 20 }}
        onClick={onSync}
      >
        Sync bank
      </button>
    </div>
  );
}

function StatusPanel({ title }: { title: string }) {
  return (
    <div className="info-panel">
      <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
        {title}
      </div>
      <p style={{ margin: 0, color: "var(--ink-soft)" }}>
        Syncing the first Real Property page from the subject endpoint.
      </p>
    </div>
  );
}

function QuestionList({ questions }: { questions: SubjectQuestion[] }) {
  if (questions.length === 0) {
    return (
      <div className="info-panel alert">
        <div className="eyebrow-strong" style={{ marginBottom: 12 }}>
          No Real Property questions returned
        </div>
        <p style={{ margin: 0 }}>
          The route is live, but the subject endpoint did not return a runnable
          queue yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {questions.map((question, index) => (
        <article
          key={question.question_id}
          style={{
            border: "1px solid var(--rule-soft)",
            background: "var(--paper)",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div className="eyebrow-strong">
              {String(index + 1).padStart(2, "0")} /{" "}
              {question.external_id ?? question.question_id.slice(0, 8)}
            </div>
            <div className="mono" style={{ color: "var(--muted)", fontSize: 12 }}>
              {question.topic ?? SUBJECT}
            </div>
          </div>
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              lineHeight: 1.45,
              margin: "0 0 14px",
              color: "var(--ink-soft)",
            }}
          >
            {previewText(question)}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Chip>{question.subtopic ?? "Subtopic pending"}</Chip>
            <Chip>{readableTension(question.tension_point)}</Chip>
          </div>
        </article>
      ))}
    </div>
  );
}

function SummaryBlock({ title, items }: { title: string; items: TopicSummary[] }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div className="eyebrow-strong" style={{ marginBottom: 10 }}>
        {title}
      </div>
      {items.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          Waiting on returned question metadata.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                borderTop: "1px solid var(--rule-soft)",
                padding: "10px 0",
              }}
            >
              <span>{item.label}</span>
              <span className="mono">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mono"
      style={{
        border: "1px solid var(--rule-soft)",
        color: "var(--muted)",
        fontSize: 11,
        padding: "5px 8px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
