import Link from "next/link";
import { DISCLAIMER } from "@/lib/copy";

export const metadata = {
  title: "Partner with BarMatrix — Influencer & tutor program",
  description:
    "Help students stop repeating MBE traps. Apply to refer BarMatrix to your audience and earn per qualified referral. FTC-compliant disclosure required.",
};

const partnerSegments = [
  { name: "Influencers / creators", body: "Short-form content, YouTube, email/newsletter. Strict disclosure and approved-claims standard required." },
  { name: "Tutors", body: "High-trust referrals from existing students. Same payout structure or custom agreement on request." },
  { name: "Law-school ambassadors", body: "Student peer distribution. Disclosure required; pressure tactics not permitted." },
  { name: "Bar-prep organizations", body: "Group referrals or co-hosted webinars. May qualify for custom revenue share." },
];

const partnerRules = [
  "You must include an FTC-compliant disclosure on every promotional post.",
  "You must use the approved short description verbatim or a close paraphrase that preserves accuracy.",
  "You may not claim guaranteed pass, guaranteed score improvement, NCBE / State Bar approval, or use \"official MBE prep\" framing.",
  "You may not state exclusive access to actual exam questions.",
  "You may not claim superiority over named competitors without approved substantiation in writing.",
  "Self-referrals, duplicate accounts, and undisclosed paid promotions void the conversion and may terminate the partnership.",
];

export default function PartnersPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Partner with BarMatrix
        </h1>
        <p className="mt-6 text-lg text-zinc-600">
          Help students stop repeating the same MBE traps. BarMatrix is a premium MBE wrong-answer intelligence system — diagnostic-first and drill-assigned. We work with creators, tutors, and bar-prep organizations who can recommend it accurately.
        </p>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-2xl font-semibold">Approved short copy for partners</h2>
          <blockquote className="mt-6 rounded-lg border-l-4 border-zinc-900 bg-white p-6 font-serif text-lg italic text-zinc-800">
            &ldquo;BarMatrix is a premium MBE repair system that diagnoses wrong-answer patterns and assigns targeted drills. It is built for students whose MBE review has plateaued or whose full course is not isolating the traps behind their misses. Limited July-cycle cohort seats are available.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-zinc-600">
            Required disclosure (paste verbatim alongside your link):
          </p>
          <p className="mt-2 font-mono text-sm text-zinc-800">
            I may receive compensation if you enroll through my link.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-2xl font-semibold">Partner types</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {partnerSegments.map((p) => (
            <li key={p.name} className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="font-serif text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-zinc-600">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-2xl font-semibold">Partner rules</h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-zinc-700">
            {partnerRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-2xl font-semibold">Request a partner link</h2>
        <p className="mt-4 text-zinc-600">
          Email{" "}
          <Link href="mailto:partners@barmatrix.app" className="underline">
            partners@barmatrix.app
          </Link>{" "}
          with your name, the audience you reach, a sample of recent content, and your preferred payout email. We&apos;ll respond with onboarding, approved copy, and your unique tracked link.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Partner approval is at BarMatrix&apos;s discretion. Approval requires written acknowledgement of the claims rules and required disclosure language.
        </p>

        <p className="mt-10 text-xs leading-relaxed text-zinc-500">{DISCLAIMER}</p>
      </section>
    </>
  );
}
