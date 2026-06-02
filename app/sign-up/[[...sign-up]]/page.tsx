import { AuthForm } from "@/app/auth-form";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = {
  title: "Create account · BarMatrix",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-up" />;
  }

  return <AuthForm mode="sign-up" />;
}
