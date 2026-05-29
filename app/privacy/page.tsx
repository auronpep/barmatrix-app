export const metadata = {
  title: "Privacy Policy – BarMatrix",
  description: "How BarMatrix collects, uses, and protects your information.",
};

const LAST_UPDATED = "May 25, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">1. Information We Collect</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium text-zinc-900">Account Information</h3>
              <p className="mt-1">When you register, we collect your name, email address, and password credentials. Authentication is managed by Clerk. We do not store raw passwords.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Payment Information</h3>
              <p className="mt-1">Payments are processed by Stripe. We do not store credit card numbers or full payment credentials. We receive only a tokenized payment record and transaction status from Stripe.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Usage and Performance Data</h3>
              <p className="mt-1">We collect data about how you interact with the Platform, including questions answered, answer choices selected, diagnostic results, Red-Zone Map data, drill completion, and session duration. Error reports are collected via Sentry. Product analytics are collected via PostHog.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Device and Technical Information</h3>
              <p className="mt-1">We automatically collect IP address, browser type, operating system, device identifiers, and referring URLs when you access the Platform.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">2. How We Use Your Information</h2>
          <ul className="mt-4 list-disc pl-5 space-y-2">
            <li>Create and manage your account and cohort seat</li>
            <li>Deliver the Platform&apos;s core features (diagnostic, forensics, Red-Zone Map, drills)</li>
            <li>Process payments and payment plans, and issue referral payouts</li>
            <li>Send transactional emails (enrollment confirmation, receipts, reminders)</li>
            <li>Monitor and improve Platform performance and stability</li>
            <li>Detect fraud and enforce our Terms of Service</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-4 font-medium">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">3. How We Share Your Information</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-4 text-left font-medium text-zinc-900">Recipient</th>
                  <th className="py-2 text-left font-medium text-zinc-900">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ["Clerk", "Identity and session management"],
                  ["Stripe", "Payment processing and payment plan management"],
                  ["PostHog", "Product analytics"],
                  ["Sentry", "Error tracking and crash reporting"],
                  ["Email provider", "Transactional email delivery"],
                  ["Legal authorities", "When required by law, subpoena, or court order"],
                ].map(([r, p]) => (
                  <tr key={r}>
                    <td className="py-2 pr-4 font-medium text-zinc-900">{r}</td>
                    <td className="py-2 text-zinc-600">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">4. Data Retention</h2>
          <p className="mt-4">We retain your account and usage data for as long as your account is active and for a reasonable period afterward for legal and business purposes. You may request deletion by contacting us at support@barmatrix.app.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">5. Cookies and Tracking</h2>
          <p className="mt-4">We use cookies and similar technologies to maintain sessions, remember preferences, and support analytics. You may control cookie settings through your browser; disabling cookies may limit Platform functionality.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">6. Your Rights</h2>
          <p className="mt-4">Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal information. California residents have rights under the CCPA, including the right to know what we collect and to request deletion. We do not sell personal information.</p>
          <p className="mt-2">To exercise any of these rights, contact us at support@barmatrix.app.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">7. Children&apos;s Privacy</h2>
          <p className="mt-4">The Platform is intended for adults preparing for the Multistate Bar Examination. We do not knowingly collect personal information from anyone under 18.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">8. Security</h2>
          <p className="mt-4">We implement industry-standard security measures including encryption in transit (TLS), access controls, and monitoring. No system is completely secure.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">9. Changes to This Policy</h2>
          <p className="mt-4">We may update this policy from time to time. We will notify you of material changes by email or prominent notice on the Platform. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">10. Contact Us</h2>
          <p className="mt-4">
            <a href="mailto:support@barmatrix.app" className="underline text-zinc-900 hover:text-zinc-600">
              support@barmatrix.app
            </a>
            <br />
            barmatrix.app
          </p>
        </section>

      </div>
    </main>
  );
}

