import Link from "next/link";

interface AuthUnavailableProps {
  mode: "sign-in" | "sign-up";
}

export function AuthUnavailable({ mode }: AuthUnavailableProps) {
  const title = mode === "sign-up" ? "Account creation is coming online." : "Sign-in is coming online.";
  const body =
    mode === "sign-up"
      ? "BarMatrix account creation is being connected for the cohort launch. If you already enrolled, check your email for access details."
      : "BarMatrix sign-in is being connected for the cohort launch. If you already enrolled, check your email for access details.";

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
          <Link href="/account" className="btn red">
            Open Account
          </Link>
          <Link href="/diagnostic" className="btn ghost">
            Free Diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}
