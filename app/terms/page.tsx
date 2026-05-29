export const metadata = {
  title: "Terms of Service – BarMatrix",
  description: "Terms governing your use of the BarMatrix platform.",
};

const LAST_UPDATED = "May 25, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">1. Eligibility</h2>
          <p className="mt-4">You must be at least 18 years old to use the Platform. By using the Platform, you represent that you meet this requirement.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">2. Account Registration</h2>
          <p className="mt-4">You must create an account to access paid features. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately at support@barmatrix.app if you suspect unauthorized access.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">3. Enrollment and Payment</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium text-zinc-900">Pricing</h3>
              <p className="mt-1">BarMatrix Flagship is offered at <strong>$999</strong> per cohort enrollment. A payment plan of <strong>$500 today and $499 due 30 days later</strong> is available at checkout.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Cohort Access</h3>
              <p className="mt-1">Enrollment grants access to one designated cohort cycle (currently the July cycle). Cohort capacity is limited. Enrollment closes when capacity is reached or the enrollment window closes, whichever comes first.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Payment Processing</h3>
              <p className="mt-1">All payments are processed by Stripe. By enrolling, you authorize Stripe to charge your payment method per the plan you select. If a payment plan installment fails, we may suspend access until the balance is resolved.</p>
            </div>
            <div>
              <h3 className="font-medium text-zinc-900">Refund Policy</h3>
              <p className="mt-1">You may request a full refund within <strong>3 days of your enrollment date</strong>, provided you have not completed more than 10% of the diagnostic or accessed more than 25 questions in the Platform. To request a refund, contact support@barmatrix.app with your order details. Refunds are processed back to your original payment method within 5–10 business days. After the 3-day window, all sales are final.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">4. License and Access</h2>
          <p className="mt-4">Upon confirmed enrollment and payment, we grant you a limited, non-exclusive, non-transferable license to access the Platform for personal, non-commercial use during your cohort cycle. This license does not include the right to:</p>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li>Copy, reproduce, or redistribute any Platform content</li>
            <li>Share your account credentials with others</li>
            <li>Use automated tools to scrape, harvest, or download content</li>
            <li>Reverse engineer any portion of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">5. Intellectual Property</h2>
          <p className="mt-4">All content on the Platform — including the question bank, wrong-answer forensics, Red-Zone Map data, trap architecture taxonomy, boot camp modules, and all associated text, graphics, and code — is owned by BarMatrix or its licensors and protected by copyright law. You receive no ownership interest in any Platform content.</p>
        </section>


        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">6. Referral Program</h2>
          <p className="mt-4">We offer a referral payout of <strong>$199 per qualified paid referral</strong>. A qualified referral means a new student who enrolls and completes full payment through your unique referral link and was not previously known to us. Referral payouts are issued after the referred student&apos;s payment plan is complete and all funds clear. We reserve the right to modify or discontinue the referral program at any time. Fraudulent referrals void the payout and may result in account termination.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">7. No Guarantee of Results</h2>
          <p className="mt-4">BarMatrix is an educational preparation tool. <strong>We do not guarantee that use of the Platform will result in passing the Multistate Bar Examination or any other examination.</strong> Bar exam passage depends on many factors beyond our control. Nothing on the Platform constitutes legal advice.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">8. Acceptable Use</h2>
          <p className="mt-4">You agree not to use the Platform for any unlawful purpose, impersonate any person, interfere with Platform operations, attempt unauthorized access, or upload malicious code. We reserve the right to suspend or terminate your account for violations without refund.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">9. Mobile Applications</h2>
          <p className="mt-4">The Platform is available on iOS and Android. Additional terms from Apple and Google apply to those versions. Where checkout is web-only, Apple and Google are not responsible for purchases or refunds.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">10. Disclaimer of Warranties</h2>
          <p className="mt-4 uppercase text-sm">The platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the platform will be uninterrupted or error-free.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">11. Limitation of Liability</h2>
          <p className="mt-4 uppercase text-sm">To the maximum extent permitted by law, BarMatrix and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">12. Governing Law and Disputes</h2>
          <p className="mt-4">These Terms are governed by the laws of the State of California. Disputes shall be resolved by binding arbitration under AAA rules, except that either party may seek injunctive relief in court for intellectual property violations. You waive the right to participate in a class action.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">13. Changes to These Terms</h2>
          <p className="mt-4">We may update these Terms at any time. We will notify you of material changes by email or prominent notice at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">14. Contact Us</h2>
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

