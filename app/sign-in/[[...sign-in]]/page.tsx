import { AuthForm } from "@/app/auth-form";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = {
  title: "Sign in · BarMatrix",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-in" />;
  }

  return <AuthForm mode="sign-in" />;
}
