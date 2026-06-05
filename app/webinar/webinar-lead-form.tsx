"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiClientError } from "@/lib/api-client";

type SubmitState = "idle" | "submitting" | "saved" | "error";

const ROLE_OPTIONS = [
  "Bar exam student",
  "Repeat taker",
  "Working student",
  "Tutor or partner",
  "Other",
];

export function WebinarLeadForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [jurisdiction, setJurisdiction] = useState("California");
  const [examWindow, setExamWindow] = useState("July 2026");
  const [context, setContext] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(true);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const attribution = useMemo(() => {
    const pick = (key: string) => searchParams.get(key) || null;
    return {
      utm_source: pick("utm_source"),
      utm_medium: pick("utm_medium"),
      utm_campaign: pick("utm_campaign"),
      utm_content: pick("utm_content"),
      utm_term: pick("utm_term"),
      partner_id: pick("partner_id"),
      referral_click_id: pick("referral_click_id") ?? pick("click_id"),
    };
  }, [searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setState("error");
      setMessage("Confirm that BarMatrix can use this email for the next webinar notice.");
      return;
    }

    setState("submitting");
    setMessage(null);
    try {
      const result = await api.createWebinarLead({
        email,
        full_name: fullName,
        role,
        jurisdiction,
        exam_window: examWindow,
        context,
        source_page: "/webinar",
        website,
        ...attribution,
      });
      setState("saved");
      setMessage(
        result.status === "ignored"
          ? "Your request has been received."
          : "Saved. No automated email was sent; BarMatrix will use this only when the next webinar session is scheduled.",
      );
    } catch (err) {
      const detail =
        err instanceof ApiClientError
          ? `API ${err.status}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error";
      setState("error");
      setMessage(`Could not save the webinar request. ${detail}`);
    }
  }

  return (
    <form className="price-card flagship" onSubmit={submit}>
      <span className="ribbon">NEXT SESSION</span>
      <h2 className="name">Get the next webinar notice</h2>
      <p className="summary">
        Leave your email and prep context. The next webinar is not scheduled yet, and
        this form does not send an automated confirmation.
      </p>

      <label className="mono" style={labelStyle} htmlFor="webinar-name">
        Name
      </label>
      <input
        id="webinar-name"
        autoComplete="name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        placeholder="Your name"
        style={inputStyle}
      />

      <label className="mono" style={labelStyle} htmlFor="webinar-email">
        Email
      </label>
      <input
        id="webinar-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
        style={inputStyle}
      />

      <label className="mono" style={labelStyle} htmlFor="webinar-role">
        Role
      </label>
      <select
        id="webinar-role"
        value={role}
        onChange={(event) => setRole(event.target.value)}
        style={inputStyle}
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <div>
          <label className="mono" style={labelStyle} htmlFor="webinar-jurisdiction">
            Jurisdiction
          </label>
          <input
            id="webinar-jurisdiction"
            value={jurisdiction}
            onChange={(event) => setJurisdiction(event.target.value)}
            placeholder="California"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="mono" style={labelStyle} htmlFor="webinar-exam-window">
            Exam window
          </label>
          <input
            id="webinar-exam-window"
            value={examWindow}
            onChange={(event) => setExamWindow(event.target.value)}
            placeholder="July 2026"
            style={inputStyle}
          />
        </div>
      </div>

      <label className="mono" style={labelStyle} htmlFor="webinar-context">
        What should the next session cover?
      </label>
      <textarea
        id="webinar-context"
        value={context}
        onChange={(event) => setContext(event.target.value)}
        rows={4}
        placeholder="Hearsay, timing, repeat-taker strategy, wrong-answer forensics..."
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginTop: 18,
          color: "var(--ink-soft)",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        <input
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          type="checkbox"
          style={{ marginTop: 4 }}
        />
        <span>
          Use this email only to notify me when the next BarMatrix webinar session is
          scheduled.
        </span>
      </label>

      <input
        aria-hidden="true"
        autoComplete="off"
        tabIndex={-1}
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        style={{ display: "none" }}
      />

      <button
        type="submit"
        className="btn btn-lg red"
        disabled={state === "submitting"}
        style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
      >
        {state === "submitting" ? "Saving..." : "Save my webinar interest"}
        <span className="arrow">→</span>
      </button>

      {message && (
        <p
          aria-live="polite"
          className="mono"
          style={{
            marginTop: 16,
            color: state === "error" ? "var(--red-deep)" : "var(--correct)",
            fontSize: 12,
            letterSpacing: "0.05em",
            lineHeight: 1.6,
            textTransform: "uppercase",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.14em",
  marginTop: 18,
  marginBottom: 8,
  textTransform: "uppercase",
} as const;

const inputStyle = {
  width: "100%",
  border: "1px solid var(--rule-soft)",
  background: "var(--bg)",
  color: "var(--ink)",
  font: "inherit",
  padding: "14px 16px",
} as const;
