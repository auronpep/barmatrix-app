import { SignIn } from "@clerk/nextjs";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = { title: "Sign in · BarMatrix" };

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-in" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "64px 16px 96px",
      }}
    >
      <SignIn />
    </div>
  );
}
