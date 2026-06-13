import { resolveAuthReturnPath } from "@/app/auth-return-path";
import Link from "next/link";

interface AuthUnavailableProps {
  mode: "sign-in" | "sign-up";
  after?: string | null;
}

export function AuthUnavailable({ mode, after }: AuthUnavailableProps) {
  const returnPath = resolveAuthReturnPath(after);
  const title =
    mode === "sign-up"
      ? "Create your BarMatrix account."
      : "Sign in to BarMatrix.";
  const body =
    mode === "sign-up"
      ? "Use the email from checkout. If your access email includes an account link, open that link first so enrollment connects automatically."
      : "Use the email from checkout to reach your dashboard, Red-Zone Map, drills, and account status.";

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <div className="border border-zinc-300 bg-white p-8 shadow-sm sm:p-10">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-700">
          Account Access
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={returnPath} className="btn red">
            Continue to dashboard
          </Link>
          <Link href="/account" className="btn ghost">
            Account status
          </Link>
          <Link href="/diagnostic" className="btn ghost">
            Free Diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}
