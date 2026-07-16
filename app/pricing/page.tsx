import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Free Registration - BarMatrix",
  description: "BarMatrix registration is complimentary. No card required.",
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  permanentRedirect("/sign-up?after=dashboard/path");
}
