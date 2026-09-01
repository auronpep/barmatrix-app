export const metadata = {
  title: "SMS Terms of Service – BarMatrix",
  description: "Terms for the BarMatrix SMS bar exam study programme.",
};

const LAST_UPDATED = "September 1, 2026";

export default function SmsTermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">SMS Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <p>
            These terms cover the BarMatrix SMS study programme &mdash; the text messages sent to
            enrolled bar exam students. They are in addition to our{" "}
            <a href="/terms" className="underline text-zinc-900 hover:text-zinc-600">
              Terms of Service
            </a>
            , which continue to apply.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">1. The Programme</h2>
          <p className="mt-4">
            A private, one-to-one bar exam study drip delivered by text message. Twice a day you
            receive one multiple-choice practice question. You reply A, B, C, or D. We grade the
            reply and text back the credited answer with a link to a written explanation.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-4 text-left font-medium text-zinc-900">You text</th>
                  <th className="py-2 text-left font-medium text-zinc-900">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ["A, B, C, D", "Answers the current question"],
                  ["Q", "Sends another practice question"],
                  ["STATS", "Your accuracy by subject and current streak"],
                  ["TERM", "A legal definition"],
                  ["MENU", "Lists the available keywords"],
                  ["HELP", "Assistance and contact details"],
                  ["STOP", "Ends all messages immediately"],
                ].map(([k, r]) => (
                  <tr key={k}>
                    <td className="py-2 pr-4 font-medium text-zinc-900">{k}</td>
                    <td className="py-2 text-zinc-600">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">2. Eligibility</h2>
          <p className="mt-4">
            You must be at least 18 years old. The programme is for adults preparing for the
            Multistate Bar Examination.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">3. How You Join</h2>
          <p className="mt-4">
            You join by asking to take part and giving us your own mobile number directly. Consent
            to receive these texts is a direct agreement between you and BarMatrix. We do not buy,
            rent, or import phone numbers, and we never add anyone who has not personally asked to
            take part.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">4. Message Frequency and Cost</h2>
          <p className="mt-4">
            Two scheduled messages per day, plus a reply to each answer you send, plus any messages
            you request by texting a keyword. Message frequency varies with your own use.
          </p>
          <p className="mt-4 font-medium text-zinc-900">Message and data rates may apply.</p>
          <p className="mt-2">
            Your mobile carrier&apos;s standard charges apply to messages you send and receive.
            BarMatrix does not charge for the text messages themselves.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">5. Opting Out</h2>
          <p className="mt-4">
            Reply <span className="font-medium text-zinc-900">STOP</span> at any time to any
            message. Messages end immediately and permanently unless you later ask to rejoin. Reply{" "}
            <span className="font-medium text-zinc-900">HELP</span> at any time for assistance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">6. Carrier Liability</h2>
          <p className="mt-4">
            Carriers are not liable for delayed or undelivered messages. Delivery depends on your
            carrier, device, and network coverage, none of which we control.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">7. Study Content, Not Legal Advice</h2>
          <p className="mt-4">
            Practice questions and explanations are exam preparation material. They are not legal
            advice, do not create an attorney-client relationship, and must not be relied on for any
            actual legal matter. We do not guarantee any exam result.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">8. Acceptable Use</h2>
          <p className="mt-4">
            The programme is for your personal exam preparation. Practice questions and explanations
            are licensed content and may not be republished, redistributed, or shared publicly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">9. Privacy</h2>
          <p className="mt-4">
            Your mobile number and SMS consent are never shared with third parties. See the{" "}
            <a href="/sms-privacy" className="underline text-zinc-900 hover:text-zinc-600">
              SMS Privacy Policy
            </a>{" "}
            for full detail.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">10. Changes</h2>
          <p className="mt-4">
            We may update these terms; the date above will change. Continued participation after an
            update constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">11. Contact Us</h2>
          <p className="mt-4">
            <a href="mailto:support@barmatrix.app" className="underline text-zinc-900 hover:text-zinc-600">
              support@barmatrix.app
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
