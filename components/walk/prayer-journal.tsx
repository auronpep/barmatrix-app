"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "barmatrix.walk.prayers";

interface Entry {
  id: string;
  text: string;
  at: string;
}

// localStorage-backed store read via useSyncExternalStore — the React-blessed
// way to read external (browser) state without setState-in-effect, and it stays
// hydration-safe (server snapshot is always empty; the client subscribes after).
function read(): Entry[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Entry[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}
const EMPTY: Entry[] = [];

let cache: Entry[] = EMPTY;
function getSnapshot(): Entry[] {
  const next = read();
  // Stable reference unless content changed, so the store doesn't loop.
  if (JSON.stringify(next) !== JSON.stringify(cache)) cache = next;
  return cache;
}
function getServerSnapshot(): Entry[] {
  return EMPTY;
}
function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function write(entries: Entry[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
    // Notify same-tab subscribers (storage event only fires cross-tab).
    window.dispatchEvent(new Event("storage"));
  } catch {
    /* private mode / quota — entry stays in component state only */
  }
}

// A private, local-only prayer journal. Stays in this browser (no server, no
// account sync) — honest about that. Phase 2 can add a real send-to-team
// endpoint on api.barmatrix.app.
export function PrayerJournal() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [draft, setDraft] = useState("");

  const save = () => {
    const text = draft.trim();
    if (!text) return;
    const entry: Entry = {
      id: `${entries.length}-${text.slice(0, 8)}`,
      text,
      at: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    write([entry, ...entries].slice(0, 100));
    setDraft("");
  };

  const remove = (id: string) => write(entries.filter((e) => e.id !== id));

  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-zinc-600">
        Before the work, offer it. Write a prayer, a burden, or a thanksgiving.
        It stays private to this device.
      </p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder="Lord, as I study today…"
        className="w-full resize-y border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={save}
          className="!bg-[var(--red)] px-5 py-2 font-sans text-[13px] font-semibold uppercase tracking-wide text-white hover:!bg-[var(--red-deep)]"
        >
          Save prayer
        </button>
      </div>

      {entries.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {entries.map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-[1fr_auto] items-start gap-3 border-l-2 border-[var(--red)] bg-white p-4"
            >
              <div>
                <p className="text-sm leading-relaxed text-zinc-800">{e.text}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  {e.at}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(e.id)}
                className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:text-[var(--red)]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
