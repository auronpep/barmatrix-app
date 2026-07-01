import CheckoutClient from "@/app/checkout/checkout-client";
import { JESUSLOVESYOU_ROUTE_PREFIX } from "@/lib/jesuslovesyou/pilot-data";

export const metadata = {
  title: "Jesuslovesyou Checkout - BarMatrix",
  description: "Choose a BarMatrix Flagship payment plan from the Jesuslovesyou route.",
  robots: { index: false, follow: false },
};

export default function JesuslovesyouCheckoutPage() {
  return <CheckoutClient routePrefix={JESUSLOVESYOU_ROUTE_PREFIX} />;
}

