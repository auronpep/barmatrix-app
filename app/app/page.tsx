import { APP_STATUS } from "@/lib/copy";

export const metadata = {
  title: "App — BarMatrix on the web",
  description:
    "Use BarMatrix from any browser. Start with the diagnostic, review your Red-Zone Map, and see Wrong Answer Forensics after each miss.",
};

const platforms = [
  {
    name: "Web app",
    body: "Start immediately from any browser. Full dashboard review, assigned drills, and longer mixed sets — same account, same red-zone state, same forensics.",
  },
];

export default function AppPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Built for focused MBE repair wherever you study.
      </h1>
      <p className="mt-6 text-lg text-zinc-600">
        Use BarMatrix from any browser. Start with the diagnostic, review your Red-Zone Map, complete assigned drills, and see Wrong Answer Forensics after each miss.
      </p>

      <div className="mt-12 grid gap-6">
        {platforms.map((p) => (
          <div key={p.name} className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold">{p.name}</h2>
            <p className="mt-3 text-sm text-zinc-600">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-zinc-300 bg-zinc-50 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">App status</p>
        <p className="mt-2 text-zinc-700">{APP_STATUS.webLiveAppsSubmitted}</p>
      </div>
    </section>
  );
}
