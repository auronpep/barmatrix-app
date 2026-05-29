import { SignUp } from "@clerk/nextjs";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = { title: "Create account · BarMatrix" };

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-up" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "64px 16px 96px",
      }}
    >
      <SignUp />
    </div>
  );
}
