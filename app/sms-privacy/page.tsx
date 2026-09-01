export const metadata = {
  title: "SMS Privacy Policy – BarMatrix",
  description:
    "How BarMatrix handles mobile numbers and message data for the SMS study programme.",
};

const LAST_UPDATED = "September 1, 2026";

export default function SmsPrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">SMS Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <p>
            This policy covers the BarMatrix SMS study programme &mdash; the text messages sent to
            enrolled bar exam students. It is in addition to our{" "}
            <a href="/privacy" className="underline text-zinc-900 hover:text-zinc-600">
              Privacy Policy
            </a>
            , which continues to apply.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">1. Information We Collect</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-4 text-left font-medium text-zinc-900">Data</th>
                  <th className="py-2 text-left font-medium text-zinc-900">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ["Mobile phone number", "To send study questions and receive answers"],
                  ["Message replies", "To grade answers and respond"],
                  ["Answer history and accuracy", "To track progress and select the next question"],
                  ["Message timestamps and delivery status", "To operate and troubleshoot the programme"],
                ].map(([d, p]) => (
                  <tr key={d}>
                    <td className="py-2 pr-4 font-medium text-zinc-900">{d}</td>
                    <td className="py-2 text-zinc-600">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            We do not collect location data, contacts, photos, or any information from your device
            beyond the content of messages you send us.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">2. How We Share Mobile Information</h2>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="font-medium text-zinc-900">
              No mobile information will be shared with third parties or affiliates for marketing or
              promotional purposes.
            </p>
            <p className="mt-2">
              All of the categories described in this policy exclude text messaging originator
              opt-in data and consent; this information will not be shared with any third parties.
            </p>
          </div>
          <p className="mt-4 font-medium">
            We do not sell, rent, trade, or transfer mobile phone numbers or SMS consent to anyone,
            for any purpose.
          </p>
          <p className="mt-4">
            Messages pass through our telecommunications provider (Twilio) solely to deliver and
            receive them, and through our hosting provider to store programme records. These
            providers act on our instructions, are bound to keep the information confidential, and
            may not use it for their own purposes. No other party receives this data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">3. How We Use It</h2>
          <p className="mt-4">
            Only to operate the study programme: to send practice questions, grade replies, produce
            written explanations, and show you your own progress. We do not use message data for
            advertising or profiling.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">4. Consent</h2>
          <p className="mt-4">
            Enrolment is individual and by request. You join by asking to take part and providing
            your own mobile number directly. Consent to receive text messages is a direct agreement
            between you and BarMatrix. We do not purchase, rent, or import phone numbers, and we do
            not add anyone who has not personally asked to take part.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">5. Opting Out</h2>
          <p className="mt-4">
            Reply <span className="font-medium text-zinc-900">STOP</span> to any message to end all
            messages immediately. Reply <span className="font-medium text-zinc-900">HELP</span> for
            assistance. Opt-outs are honoured automatically and permanently unless you later ask to
            rejoin.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">6. Retention and Deletion</h2>
          <p className="mt-4">
            We keep your mobile number and answer history for as long as you are enrolled, so
            progress can be shown over time. On request, or after you opt out and ask for removal,
            we delete the number and associated answer history within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">7. Security</h2>
          <p className="mt-4">
            Programme records are stored on access-controlled systems. Written explanation pages are
            reachable only through a unique, unguessable link sent to you; they are not indexed or
            listed publicly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">8. Children&apos;s Privacy</h2>
          <p className="mt-4">
            The programme is intended for adults preparing for the Multistate Bar Examination. We do
            not knowingly enrol anyone under 18.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">9. Contact Us</h2>
          <p className="mt-4">
            <a href="mailto:support@barmatrix.app" className="underline text-zinc-900 hover:text-zinc-600">
              support@barmatrix.app
            </a>
            <br />
            See also our{" "}
            <a href="/sms-terms" className="underline text-zinc-900 hover:text-zinc-600">
              SMS Terms of Service
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
