import CoachClient from "./coach-client";

export const metadata = { title: "Coach — BarMatrix" };

export default function CoachPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <a href="/app" className="text-sm text-zinc-500 hover:underline">← Back to dashboard</a>
      <h1 className="mt-2 text-2xl font-semibold">The C3 Coach</h1>
      <p className="mt-1 text-sm text-zinc-600">Works your weakest C3 break first, then re-surfaces the lesson that fixes it.</p>
      <CoachClient />
    </main>
  );
}
