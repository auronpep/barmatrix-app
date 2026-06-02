import CheckoutClient from "./checkout-client";

export const metadata = {
  title: "Checkout - BarMatrix",
  description: "Choose your BarMatrix Flagship payment plan.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
