"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  api,
  ApiClientError,
  type CertGradeResult,
  type CertPublicCompetency,
  type CertPublicItem,
  type CertSubmitAnswer,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

// One item's in-progress answer. Mirrors CertSubmitAnswer minus the id; the id is
// supplied when we assemble the submission payload.
type Draft = Omit<CertSubmitAnswer, "id">;

export default function CertificationRunnerPage() {
  const params = useParams<{ competencyId: string }>();
  const id =
    typeof params.competencyId === "string" ? params.competencyId : "";
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();

  const [comp, setComp] = useState<CertPublicCompetency | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Draft>>({});
  const [result, setResult] = useState<CertGradeResult | null>(null);
  const [cooldown, setCooldown] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // On mount: start a server session, then load the key-free content.
  useEffect(() => {
    if (!isLoaded || !id) return;
    let cancelled = false;
    if (!isSignedIn) {
      queueMicrotask(() => {
        if (!cancelled) setError("signed_out");
      });
      return () => {
        cancelled = true;
      };
    }
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no session token");
        await api.startCert(token, id).catch(() => undefined); // best-effort timestamp
        const data = await api.getCertCompetency(token, id);
        if (!cancelled) setComp(data);
      } catch (err) {
        if (!cancelled) setError(messageFor(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, id]);

  const update = useCallback((itemId: string, patch: Draft) => {
    setAnswers((prev) => ({ ...prev, [itemId]: { ...prev[itemId], ...patch } }));
  }, []);

  const onSubmit = useCallback(async () => {
    if (!comp) return;
    setSubmitting(true);
    setError(null);
    setCooldown(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("no session token");
      const payload: CertSubmitAnswer[] = comp.items.map((it) => ({
        id: it.id,
        ...(answers[it.id] ?? {}),
      }));
      const graded = await api.submitCert(token, comp.id, payload);
      setResult(graded);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 429) {
        setCooldown(retryFromBody(err.body));
      } else {
        setError(messageFor(err));
      }
    } finally {
      setSubmitting(false);
    }
  }, [comp, answers, getToken]);

  if (error === "signed_out") {
    return (
      <Shell>
        <Back />
        <Banner href="/sign-in" cta="Sign in">
          Sign in to take this competency.
        </Banner>
      </Shell>
    );
  }

  if (error === "locked") {
    return (
      <Shell>
        <Back />
        <Banner href="/foundations" cta="Go to The Method">
          Finish The Method before taking this competency.
        </Banner>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <Back />
        <p className="mt-6 border border-amber-300 bg-amber-50 p-4 font-mono text-sm text-amber-900">
          Couldn&apos;t load this competency. Try again from the certification
          scorecard.
        </p>
      </Shell>
    );
  }

  if (cooldown !== null && !result) {
    return (
      <Shell>
        <Back />
        <p className="mt-6 border border-amber-300 bg-amber-50 p-4 font-mono text-sm text-amber-900">
          You&apos;re on a retake cooldown.{" "}
          {cooldown
            ? `Try again after ${formatTime(cooldown)}.`
            : "Try again later."}
        </p>
      </Shell>
    );
  }

  if (!comp) {
    return (
      <Shell>
        <p className="font-mono text-sm text-zinc-500">Loading competency…</p>
      </Shell>
    );
  }

  if (result) {
    return <GradedView comp={comp} result={result} />;
  }

  return (
    <Shell>
      <Back />
      <header className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {comp.id} · {comp.capture.replace(/_/g, " ")}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
          {comp.title}
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Pass: {describePass(comp.pass)}
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {comp.items.map((item, i) => (
          <ItemCard
            key={item.id}
            n={i + 1}
            item={item}
            comp={comp}
            draft={answers[item.id] ?? {}}
            onChange={(patch) => update(item.id, patch)}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-zinc-300 pt-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-md bg-red-700 px-6 py-3 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-50"
        >
          {submitting ? "Grading…" : "Submit for grading"}
        </button>
        <span className="font-mono text-[11px] text-zinc-500">
          Auto-graded on submit · answers are fixed sample items
        </span>
      </div>
    </Shell>
  );
}

// --- Per-item input, dispatched by capture type ---

function ItemCard({
  n,
  item,
  comp,
  draft,
  onChange,
}: {
  n: number;
  item: CertPublicItem;
  comp: CertPublicCompetency;
  draft: Draft;
  onChange: (patch: Draft) => void;
}) {
  return (
    <div className="border border-zinc-300 bg-white p-5">
      <p className="font-serif text-base leading-7 text-zinc-900">
        <span className="font-mono text-xs text-zinc-500">{n}.</span>{" "}
        {item.prompt}
      </p>
      <div className="mt-4">{renderInput(item, comp, draft, onChange)}</div>
    </div>
  );
}

function renderInput(
  item: CertPublicItem,
  comp: CertPublicCompetency,
  draft: Draft,
  onChange: (patch: Draft) => void,
) {
  // single: item-level options (MCQ letters) OR competency label_options.
  if (comp.capture === "single") {
    if (item.options && item.options.length > 0) {
      return (
        <RadioGroup
          name={`${item.id}-value`}
          label="Answer"
          options={item.options.map((o) => ({
            value: o.letter,
            label: `(${o.letter}) ${o.text}`,
          }))}
          value={draft.value ?? null}
          onChange={(v) => onChange({ value: v })}
        />
      );
    }
    return (
      <RadioGroup
        name={`${item.id}-value`}
        label="Label"
        options={(comp.label_options ?? []).map((o) => ({ value: o, label: o }))}
        value={draft.value ?? null}
        onChange={(v) => onChange({ value: v })}
      />
    );
  }

  if (comp.capture === "rule_distractor") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          name={`${item.id}-rule`}
          label="Rule type"
          options={(comp.rule_options ?? []).map((o) => ({ value: o, label: o }))}
          value={draft.rule ?? null}
          onChange={(v) => onChange({ rule: v })}
        />
        <RadioGroup
          name={`${item.id}-distractor`}
          label="Distractor type"
          options={(comp.distractor_options ?? []).map((o) => ({
            value: o,
            label: o,
          }))}
          value={draft.distractor ?? null}
          onChange={(v) => onChange({ distractor: v })}
        />
      </div>
    );
  }

  if (comp.capture === "axis_survivor") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          name={`${item.id}-axis`}
          label="Decision axis"
          options={(item.axis_options ?? []).map((o) => ({ value: o, label: o }))}
          value={draft.axis ?? null}
          onChange={(v) => onChange({ axis: v })}
        />
        <RadioGroup
          name={`${item.id}-survivor`}
          label="Survivor"
          options={(item.survivor_options ?? []).map((o) => ({
            value: o.letter,
            label: `(${o.letter}) ${o.text}`,
          }))}
          value={draft.survivor ?? null}
          onChange={(v) => onChange({ survivor: v })}
        />
      </div>
    );
  }

  if (comp.capture === "band") {
    return (
      <RadioGroup
        name={`${item.id}-band`}
        label="Band"
        options={(comp.band_options ?? ["HIGH", "MED", "COIN"]).map((o) => ({
          value: o,
          label: o,
        }))}
        value={draft.band ?? null}
        onChange={(v) => onChange({ band: v as Draft["band"] })}
      />
    );
  }

  // integration: answer + phase + flag-as-coin
  return (
    <div className="space-y-4">
      <RadioGroup
        name={`${item.id}-value`}
        label="Answer"
        options={(item.options ?? []).map((o) => ({
          value: o.letter,
          label: `(${o.letter}) ${o.text}`,
        }))}
        value={draft.value ?? null}
        onChange={(v) => onChange({ value: v })}
      />
      <RadioGroup
        name={`${item.id}-phase`}
        label="Phase"
        options={(comp.phase_options ?? ["CUT", "CLASH", "CALL"]).map((o) => ({
          value: o,
          label: o,
        }))}
        value={draft.phase ?? null}
        onChange={(v) => onChange({ phase: v as Draft["phase"] })}
      />
      <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-700">
        <input
          type="checkbox"
          checked={draft.flag === true}
          onChange={(e) => onChange({ flag: e.target.checked })}
          className="h-4 w-4 accent-red-700"
        />
        Flag as coin-flip (fork)
      </label>
    </div>
  );
}

function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </legend>
      <div className="mt-2 space-y-1.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-zinc-800"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="mt-1 h-4 w-4 accent-red-700"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// --- Graded view ---

function GradedView({
  comp,
  result,
}: {
  comp: CertPublicCompetency;
  result: CertGradeResult;
}) {
  return (
    <Shell>
      <Back />
      <header className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {comp.id} · results
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
          {comp.title}
        </h1>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`inline-block rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wider ${
            result.passed
              ? "bg-emerald-700 text-white"
              : "border border-red-700 text-red-700"
          }`}
        >
          {result.passed ? "Passed ✓" : "Not yet"}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          score {result.score} · pass {describePass(comp.pass)}
        </span>
        {!result.persisted && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-amber-700">
            (not saved — sync pending)
          </span>
        )}
      </div>

      <ConditionsRow result={result} />

      <section className="mt-8">
        <h2 className="border-b border-zinc-300 pb-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
          Item-by-item
        </h2>
        <div className="mt-4 space-y-3">
          {result.per_item.map((p) => (
            <div
              key={p.id}
              className={`border p-4 ${
                p.correct
                  ? "border-emerald-300 bg-emerald-50/40"
                  : "border-red-300 bg-red-50/40"
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
                {p.id} · {p.correct ? "correct ✓" : "missed"}
              </p>
              <p className="mt-2 font-mono text-xs text-zinc-700">
                your: {p.your ?? "—"} · key: {p.key ?? "—"}
              </p>
              {p.explanation && (
                <p className="mt-2 text-sm leading-6 text-zinc-800">
                  {p.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {result.remediation_lessons.length > 0 && !result.passed && (
        <section className="mt-8 border border-zinc-300 bg-zinc-50 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Remediation
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.remediation_lessons.map((slug) => (
              <Link
                key={slug}
                href={`/foundations/${slug}`}
                className="rounded-md border border-zinc-900 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-900 hover:bg-zinc-950 hover:text-white"
              >
                Repair → {slug}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 border-t border-zinc-300 pt-6">
        <Link
          href="/certification"
          className="font-mono text-xs uppercase tracking-wider text-zinc-600 hover:text-zinc-900"
        >
          ← Back to the scorecard
        </Link>
      </div>
    </Shell>
  );
}

function ConditionsRow({ result }: { result: CertGradeResult }) {
  const c = result.conditions;
  const cells: Array<[string, string]> = [];
  if (c.accuracy_score !== null)
    cells.push(["accuracy", String(c.accuracy_score)]);
  if (c.phase_score !== null) cells.push(["phase", String(c.phase_score)]);
  if (c.forks_passed !== null)
    cells.push(["forks", c.forks_passed ? "passed" : "missed"]);
  if (c.calibration_passed !== null)
    cells.push(["calibration", c.calibration_passed ? "passed" : "missed"]);
  if (cells.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {cells.map(([k, v]) => (
        <span
          key={k}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-700"
        >
          {k}: {v}
        </span>
      ))}
    </div>
  );
}

// --- helpers + shell ---

function describePass(pass: CertPublicCompetency["pass"]): string {
  if (pass.type === "min_correct" && pass.n != null && pass.of != null) {
    return `${pass.n}/${pass.of} correct`;
  }
  if (pass.type === "calibration" && pass.band_match_min != null) {
    return `${pass.band_match_min}/${pass.of ?? "?"} bands, no under-called cut`;
  }
  if (pass.type === "integration") {
    const acc = pass.accuracy ? `${pass.accuracy.n}/${pass.accuracy.of} accuracy` : "";
    const phase = pass.phase_min != null ? `${pass.phase_min}/${pass.of ?? "?"} phase` : "";
    return [acc, phase, "all forks flagged"].filter(Boolean).join(" · ");
  }
  return pass.type;
}

function retryFromBody(body: unknown): string | null {
  if (body && typeof body === "object" && "retry_at" in body) {
    const v = (body as { retry_at?: unknown }).retry_at;
    if (typeof v === "string") return v;
  }
  return null;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function messageFor(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.status === 401) return "signed_out";
    if (err.status === 403) return "locked";
    return `API ${err.status}`;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">{children}</section>
  );
}

function Back() {
  return (
    <Link
      href="/certification"
      className="font-mono text-xs text-zinc-500 hover:text-zinc-900"
    >
      ← Certification
    </Link>
  );
}

function Banner({
  href,
  cta,
  children,
}: {
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-300 bg-zinc-50 p-5">
      <p className="text-sm text-zinc-800">{children}</p>
      <Link
        href={href}
        className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
      >
        {cta}
      </Link>
    </div>
  );
}
