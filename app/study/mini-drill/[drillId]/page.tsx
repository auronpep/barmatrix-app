"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  ApiClientError,
  type MiniDrillResponse,
  type MiniDrillQuestion,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

// Mini-drill runner (J7 task types: charge_picker and trap_spotter).
// Shows 3-5 questions one at a time. Student picks a choice → answer + explanation
// revealed. Navigation: next question → when last question done → "Done →" calls
// completePathStep and returns to the guided path.

export default function MiniDrillPage() {
  const params = useParams<{ drillId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useClerkAuth();

  const drillId =
    typeof params.drillId === "string"
      ? params.drillId
      : Array.isArray(params.drillId)
        ? (params.drillId[0] ?? "")
        : "";
  const stepId = search.get("step");

  const [drill, setDrill] = useState<MiniDrillResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  useEffect(() => {
    if (!drillId) return;
    let cancelled = false;
    void (async () => {
      try {
        const d = await api.getMiniDrill(drillId);
        if (!cancelled) setDrill(d);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? `API ${err.status}`
              : "Couldn't load this drill.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [drillId]);

  if (error) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          {error}
        </p>
      </Wrap>
    );
  }
  if (!drill) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          Loading…
        </p>
      </Wrap>
    );
  }
  if (drill.questions.length === 0) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          This mini-drill is unavailable while learning content is being rebuilt.
        </p>
      </Wrap>
    );
  }

  const q: MiniDrillQuestion | undefined = drill.questions[qIdx];
  const total = drill.questions.length;
  const isLast = qIdx === total - 1;
  const revealed = selected !== null;

  function pick(choiceId: string) {
    if (!revealed) setSelected(choiceId);
  }

  function advance() {
    setSelected(null);
    setQIdx((i) => i + 1);
  }

  async function finish() {
    setFinishing(true);
    setFinishError(null);
    try {
      if (!isLoaded) {
        setFinishError("Checking sign-in. Try again in a moment.");
        return;
      }
      if (stepId && !isSignedIn) {
        setFinishError("Sign in again to save this step.");
        return;
      }
      if (isSignedIn && stepId) {
        const token = await getToken();
        if (!token) {
          setFinishError("Sign in again to save this step.");
          return;
        }
        await api.completeMyDayPlanStep(token, stepId);
      }
      router.push("/dashboard/path");
    } catch {
      setFinishError("We couldn't save that step. Try again.");
    } finally {
      setFinishing(false);
    }
  }

  const drillTypeLabel =
    drill.drill_type === "charge_picker" ? "Charge Picker" : "Trap Spotter";

  return (
    <Wrap>
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {drill.subject} · {drillTypeLabel}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
          {drill.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{drill.instruction}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          Question {qIdx + 1} of {total}
        </p>
      </header>

      {q ? (
        <Question
          q={q}
          selected={selected}
          onPick={pick}
          onAdvance={isLast ? undefined : advance}
          onFinish={isLast && revealed ? finish : undefined}
          finishing={finishing}
        />
      ) : null}
      {finishError && (
        <p className="mt-5 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
          {finishError}
        </p>
      )}
    </Wrap>
  );
}

function Question({
  q,
  selected,
  onPick,
  onAdvance,
  onFinish,
  finishing,
}: {
  q: MiniDrillQuestion;
  selected: string | null;
  onPick: (id: string) => void;
  onAdvance?: () => void;
  onFinish?: () => void;
  finishing: boolean;
}) {
  const revealed = selected !== null;

  return (
    <div>
      <p className="mb-5 text-base leading-7 text-zinc-900">{q.stem}</p>

      <div className="flex flex-col gap-3">
        {q.choices.map((c) => {
          const isSelected = selected === c.id;
          const isCorrect = c.id === q.answer_id;
          let border = "border-zinc-300";
          let bg = "bg-white";
          let text = "text-zinc-700";
          if (revealed) {
            if (isCorrect) {
              border = "border-emerald-500";
              bg = "bg-emerald-50";
              text = "text-emerald-900";
            } else if (isSelected) {
              border = "border-red-500";
              bg = "bg-red-50";
              text = "text-red-900";
            }
          } else if (isSelected) {
            border = "border-zinc-900";
            bg = "bg-zinc-50";
          }

          return (
            <button
              key={c.id}
              type="button"
              disabled={revealed}
              onClick={() => onPick(c.id)}
              className={`w-full border p-4 text-left text-sm leading-6 transition-colors disabled:cursor-default ${border} ${bg} ${text} ${!revealed ? "hover:border-zinc-900 hover:bg-zinc-50" : ""}`}
            >
              {c.text}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-5 border-l-4 border-zinc-900 bg-zinc-50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {selected === q.answer_id ? "Correct" : "Not quite"}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-800">{q.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {revealed && onAdvance && (
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Next →
          </button>
        )}
        {revealed && onFinish && (
          <button
            type="button"
            onClick={onFinish}
            disabled={finishing}
            className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40"
          >
            {finishing ? "Saving…" : "Done →"}
          </button>
        )}
      </div>
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-10 sm:py-14">{children}</section>
  );
}
