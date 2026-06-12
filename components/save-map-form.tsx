"use client";

// Email capture on the diagnostic results page ("verdict screen").
//
// The anonymous Red-Zone Map is computed per session and is NOT persisted to an
// account, so a taker who bounces here is unreachable. This form stores their
// email plus the diagnostic session ID through the existing lead endpoint so
// the map can be recovered and followed up on. Honest copy: no automated email
// is sent, and saving is free — it is not the same as enrolling.

import { FormEvent, useState } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { trackMapSaveRequested } from "@/lib/analytics";

type SubmitState = "idle" | "submitting" | "saved" | "error";

export function SaveMapForm({
  diagnosticId,
  topTrapTags,
}: {
  diagnosticId: string;
  topTrapTags: readonly string[];
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage(null);
    try {
      await api.createWebinarLead({
        email,
        context: `red_zone_map diagnostic_id=${diagnosticId} traps=${topTrapTags.join(",")}`,
        source_page: "/diagnostic/results",
        website,
      });
      setState("saved");
      setMessage(
        "Saved. Your session is on file under this email — no automated email was sent. Reply-based follow-up only.",
      );
      trackMapSaveRequested({
        status: "saved",
        trapTags: topTrapTags,
        sessionId: diagnosticId,
      });
    } catch (err) {
      const detail =
        err instanceof ApiClientError
          ? `API ${err.status}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error";
      setState("error");
      setMessage(`Could not save the map. ${detail}`);
      trackMapSaveRequested({
        status: "error",
        trapTags: topTrapTags,
        sessionId: diagnosticId,
      });
    }
  }

  if (state === "saved") {
    return (
      <div className="mt-8 rounded-lg border border-emerald-300 bg-emerald-50 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
          Map saved
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-800" aria-live="polite">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6"
      onSubmit={submit}
    >
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
        Not ready to enroll?
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-zinc-900">
        Don&apos;t lose this map.
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
        This Red-Zone Map lives only in this anonymous session. Leave an email
        and we keep your session ID on file so you can come back to it — free,
        no card, and no automated email is sent.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="save-map-email">
          Email
        </label>
        <input
          id="save-map-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 sm:max-w-xs"
        />
        {/* Honeypot — hidden from real users, mirrors the webinar lead form. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
        />
        <button
          type="submit"
          className="btn red"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Saving…" : "Save my map"}
        </button>
      </div>
      <p
        className="mt-3 min-h-5 font-mono text-xs uppercase tracking-wider text-zinc-500"
        aria-live="polite"
      >
        {state === "error" ? message : "Used only to recover this map. No list, no spam."}
      </p>
    </form>
  );
}
