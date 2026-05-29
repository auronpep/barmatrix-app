"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const DEFAULT_PARTNER_ID = "partner-demo";
const DEFAULT_CAMPAIGN_ID = "july-study-plan";

export function ReferralShareClient() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const partnerId = cleanToken(
    searchParams.get("partner_id") ?? searchParams.get("ref"),
    DEFAULT_PARTNER_ID,
  );
  const campaignId = cleanToken(
    searchParams.get("campaign_id") ??
      searchParams.get("utm_campaign") ??
      searchParams.get("campaign"),
    DEFAULT_CAMPAIGN_ID,
  );

  const shareUrl = useMemo(
    () => buildShareUrl(partnerId, campaignId),
    [partnerId, campaignId],
  );

  const disclosureText = "I may receive compensation if you enroll through my link.";

  async function copyShareUrl() {
    setCopied(false);
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <div className="border-b border-zinc-900 pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-red-700">
          Referral Share
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
              Create a tracked partner link in one step.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700 sm:text-lg">
              Add a partner ID and campaign ID to the page URL, then share the
              generated diagnostic link with the required disclosure.
            </p>
          </div>

          <div className="border border-zinc-300 bg-white p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
              Current Attribution
            </p>
            <dl className="mt-4 space-y-3">
              <AttributionRow label="Partner ID" value={partnerId} />
              <AttributionRow label="Campaign ID" value={campaignId} />
              <AttributionRow label="Source" value="partner" />
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="border border-zinc-300 bg-white p-6" aria-labelledby="share-link">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
            Share Link
          </p>
          <h2
            id="share-link"
            className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950"
          >
            Diagnostic link with attribution attached
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-700">
            This link carries `partner_id`, `campaign_id`, `utm_source`, and
            `utm_campaign` into the diagnostic and checkout attribution flow.
          </p>

          <div className="mt-5 overflow-hidden border border-zinc-200 bg-zinc-50 p-4">
            <p className="break-all font-mono text-sm leading-6 text-zinc-900">
              {shareUrl}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyShareUrl} className="btn btn-lg">
              Copy Link
            </button>
            <Link href={shareUrl} className="btn btn-lg ghost">
              Open Link
            </Link>
          </div>
          <p className="mt-3 min-h-6 font-mono text-xs uppercase tracking-wider text-zinc-700" aria-live="polite">
            {copied ? "Copied to clipboard" : "Ready to share"}
          </p>
        </section>

        <aside className="border border-zinc-900 bg-zinc-950 p-6 text-white">
          <p className="font-mono text-xs uppercase tracking-wider text-red-300">
            Required Disclosure
          </p>
          <p className="mt-4 text-lg font-semibold leading-7">{disclosureText}</p>
          <div className="mt-6 border border-white/20 bg-white/10 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
              Paste With Link
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-100">
              BarMatrix diagnoses MBE wrong-answer patterns and assigns targeted
              repair drills. {disclosureText}
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Referral checks">
        <CheckCard label="Destination" value="/diagnostic" />
        <CheckCard label="Click Event" value="referral_click" />
        <CheckCard label="Attribution" value="checkout-ready" />
      </section>

      <section className="mt-8 border border-zinc-300 bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Partner Setup
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-zinc-950">
          Need an approved partner ID?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Request onboarding first, then return to this page with
          `?partner_id=your-id&amp;campaign_id=your-campaign` to create the
          tracked share link.
        </p>
        <div className="mt-5">
          <Link href="/partners" className="btn btn-sm ghost">
            Open Partner Page
          </Link>
        </div>
      </section>
    </section>
  );
}

function AttributionRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-700">
        {label}
      </dt>
      <dd className="mt-1 break-all text-sm font-semibold text-zinc-950">
        {value}
      </dd>
    </div>
  );
}

function CheckCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-zinc-300 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
        {label}
      </p>
      <p className="mt-3 break-words font-serif text-2xl font-semibold text-zinc-950">
        {value}
      </p>
    </article>
  );
}

function buildShareUrl(partnerId: string, campaignId: string) {
  const url = new URL("/diagnostic", "https://barmatrix.app");
  url.searchParams.set("partner_id", partnerId);
  url.searchParams.set("campaign_id", campaignId);
  url.searchParams.set("utm_source", "partner");
  url.searchParams.set("utm_campaign", campaignId);
  return url.toString();
}

function cleanToken(value: string | null, fallback: string) {
  const cleaned = (value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return cleaned || fallback;
}
