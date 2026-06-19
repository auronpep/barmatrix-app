import CheckoutClient from "./checkout-client";
import { BRAND, DOMAIN, FAQ, PRICING } from "@/lib/copy";

export const metadata = {
  title: "Checkout - BarMatrix",
  description: "Choose your BarMatrix Flagship payment plan.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRICING.flagshipName,
    description:
      "A web-live MBE multiple-choice diagnostic and repair layer with Red-Zone Map, Wrong Answer Forensics, assigned drills, boot camps, timed sets, and guided repair path access.",
    brand: {
      "@type": "Brand",
      name: BRAND,
    },
    offers: {
      "@type": "Offer",
      url: `https://${DOMAIN}/checkout`,
      priceCurrency: "USD",
      price: "999",
      availability: "https://schema.org/LimitedAvailability",
    },
  };

  const checkoutFaq = [
    ...FAQ,
    {
      q: "What is the refund window?",
      a: "You may request a full refund within 3 days of enrollment if the Terms refund limits have not been exceeded.",
    },
    {
      q: "What if Stripe completes but I do not see access?",
      a: "Open Account from the same email used at checkout, or contact support with your Stripe receipt.",
    },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: checkoutFaq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <CheckoutClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
