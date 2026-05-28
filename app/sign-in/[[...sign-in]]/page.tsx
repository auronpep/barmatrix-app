import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Sign in · BarMatrix" };

export default function SignInPage() {
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
