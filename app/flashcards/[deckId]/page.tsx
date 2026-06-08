"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  ApiClientError,
  type FlashcardDeckResponse,
} from "@/lib/api-client";
import { useClerkAuth } from "@/lib/use-clerk-auth";

// Minimal flip-card runner (J7 item 3). Public deck content; reviews are recorded
// for signed-in students. Completion = every card flipped once; on finish we
// record the reviews + complete the path step, then return to the guided path.
export default function FlashcardDeckPage() {
  const params = useParams<{ deckId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useClerkAuth();

  const deckId =
    typeof params.deckId === "string"
      ? params.deckId
      : Array.isArray(params.deckId)
        ? (params.deckId[0] ?? "")
        : "";
  const stepId = search.get("step");

  const [deck, setDeck] = useState<FlashcardDeckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!deckId) return;
    let cancelled = false;
    void (async () => {
      try {
        const d = await api.getFlashcardDeck(deckId);
        if (!cancelled) setDeck(d);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? `API ${err.status}` : "Couldn't load this deck.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deckId]);

  if (error) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">{error}</p>
      </Wrap>
    );
  }
  if (!deck) {
    return (
      <Wrap>
        <p className="border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">Loading…</p>
      </Wrap>
    );
  }

  const card = deck.cards[idx];
  const total = deck.cards.length;
  const allReviewed = reviewed.size >= total;

  function flip() {
    setFlipped((f) => {
      if (!f && card) {
        setReviewed((prev) => {
          const n = new Set(prev);
          n.add(card.card_id);
          return n;
        });
      }
      return !f;
    });
  }

  function go(delta: number) {
    setFlipped(false);
    setIdx((i) => Math.max(0, Math.min(total - 1, i + delta)));
  }

  async function finish() {
    setFinishing(true);
    try {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          await api
            .completeFlashcardDeck(token, deckId, Array.from(reviewed))
            .catch(() => undefined);
          if (stepId) {
            await api.completePathStep(token, stepId).catch(() => undefined);
          }
        }
      }
      router.push("/dashboard/path");
    } finally {
      setFinishing(false);
    }
  }

  return (
    <Wrap>
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          {deck.subject} · Flashcards
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
          {deck.deck_title}
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Card {idx + 1} of {total} · {reviewed.size}/{total} reviewed
        </p>
      </header>

      <button
        type="button"
        onClick={flip}
        className="flex min-h-56 w-full flex-col justify-center border-2 border-zinc-900 bg-white p-8 text-left transition-colors hover:bg-zinc-50"
        aria-label={flipped ? "Show front" : "Reveal answer"}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {flipped ? "Answer" : "Prompt — tap to flip"}
        </span>
        <span className="mt-3 font-serif text-xl leading-8 text-zinc-950">
          {flipped ? card?.back : card?.front}
        </span>
      </button>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:border-zinc-900 hover:text-zinc-950 disabled:opacity-40"
        >
          ← Back
        </button>
        {idx < total - 1 ? (
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={!allReviewed || finishing}
            className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40"
          >
            {finishing ? "Saving…" : allReviewed ? "Finish deck →" : "Flip every card first"}
          </button>
        )}
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-2xl px-6 py-10 sm:py-14">{children}</section>;
}
