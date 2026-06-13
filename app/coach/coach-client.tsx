"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useCoach } from "@/lib/use-coach";
import QuestionRunner from "@/components/question-runner";

export default function CoachClient() {
  const { isLoaded, isSignedIn, current, loading, error, served, fetchNext } = useCoach();
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [started, setStarted] = useState(false);

  if (!isLoaded) return <p className="mt-6 text-sm text-zinc-500" role="status">Loading…</p>;
  if (!isSignedIn) {
    return (
      <p className="mt-6 text-sm text-zinc-600">
        <Link href="/sign-in" className="underline">Sign in</Link> to start coaching.
      </p>
    );
  }
  if (!started) {
    return (
      <button
        type="button"
        onClick={() => { setStarted(true); void fetchNext(); }}
        className="mt-6 rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-900"
      >
        Start coaching
      </button>
    );
  }
  if (loading) return <p className="mt-6 text-sm text-zinc-500" role="status">Finding your weak spot…</p>;
  if (error) {
    return (
      <p className="mt-6 text-sm text-red-600" role="alert">
        Couldn&apos;t load the next question.{" "}
        <button type="button" className="underline" onClick={() => void fetchNext()}>Retry</button>
      </p>
    );
  }
  if (!current || !sessionId) return null;

  if (!current.available) {
    const unavailable = getCoachUnavailableState(current.reason);

    return (
      <section className="mt-6 rounded-lg border border-zinc-200 p-5">
        <h2 className="font-medium">{unavailable.title}</h2>
        <p className="mt-1 text-sm text-zinc-600">{unavailable.body}</p>
      </section>
    );
  }

  const { question, coaching, remediation } = current;
  const isStarterBaseline = coaching.target_mold === "starter_baseline";
  return (
    <div className="mt-6 space-y-5">
      <p className="text-xs uppercase tracking-wide text-zinc-400">Items this session: {served}</p>
      <section aria-live="polite" className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-sm font-semibold text-amber-900">Why this question</h2>
        <p className="mt-1 text-sm text-amber-800">
          {isStarterBaseline ? (
            <>
              Starting with a baseline question: <strong>{coaching.name}</strong>{" "}
              <span className="text-amber-700">({coaching.family.replaceAll("_", " ").toLowerCase()})</span>
              <> — your C3-specific pattern is not measured yet, so this item starts the coaching loop.</>
            </>
          ) : (
            <>
              Targeting your weak break: <strong>{coaching.name}</strong>{" "}
              <span className="text-amber-700">({coaching.family.replaceAll("_", " ").toLowerCase()})</span>
              {coaching.measured
                ? <> — you bite this {coaching.deficit_pct}% of the time.</>
                : <> — based on the exam blueprint (not yet measured for you).</>}
            </>
          )}
        </p>
        {remediation.lesson_slug && (
          <Link className="mt-2 inline-block text-sm font-medium text-amber-900 underline"
                href={`/foundations/${remediation.lesson_slug}`}>
            Review the lesson →
          </Link>
        )}
      </section>
      <QuestionRunner
        key={question.question_id}
        questionIds={[question.question_id]}
        setId={sessionId}
        completeLabel="Next question"
        onComplete={() => void fetchNext()}
      />
    </div>
  );
}

function getCoachUnavailableState(reason: string): {
  title: string;
  body: ReactNode;
} {
  if (reason === "not_enrolled") {
    return {
      title: "Account access needed",
      body: (
        <>
          Activate your BarMatrix access from <Link className="underline" href="/account">Account</Link> before
          starting coaching.
        </>
      ),
    };
  }

  if (reason === "no_tagged_items" || reason === "c3_not_provisioned") {
    return {
      title: "Coach coverage pending",
      body: (
        <>
          C3 Coach is waiting on tagged question coverage. Work{" "}
          <Link className="underline" href="/practice">practice questions</Link> or a{" "}
          <Link className="underline" href="/diagnostic">diagnostic</Link> while the bank is being tagged.
        </>
      ),
    };
  }

  return {
    title: "Not measurable yet",
    body: (
      <>
        Finish <Link className="underline" href="/foundations">The Method</Link>, then work questions or a{" "}
        <Link className="underline" href="/diagnostic">diagnostic</Link> so the Coach can find your weak C3 break.
      </>
    ),
  };
}
