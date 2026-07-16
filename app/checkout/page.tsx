import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Free Registration - BarMatrix",
  description: "Create a free BarMatrix account and begin guided MBE repair.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  permanentRedirect("/sign-up?after=dashboard/path");
}
