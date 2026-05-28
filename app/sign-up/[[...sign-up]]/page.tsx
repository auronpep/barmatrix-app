import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Create account · BarMatrix" };

export default function SignUpPage() {
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
