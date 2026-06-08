import type { PathMilestone } from "@/lib/api-client";

// Read-only orientation aid: the day's milestones with status. NOT interactive
// (no choices) — it just shows where the prescribed path is taking the student.
function status(m: PathMilestone): { text: string; cls: string } {
  if (m.completed) return { text: "Done", cls: "border-emerald-700 text-emerald-800" };
  if (!m.available) return { text: "Coming soon", cls: "border-zinc-300 text-zinc-500" };
  return { text: "Ahead", cls: "border-zinc-400 text-zinc-700" };
}

export default function MilestoneMap({ milestones }: { milestones: PathMilestone[] }) {
  if (milestones.length === 0) return null;
  return (
    <section className="border border-zinc-300 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
        Today&apos;s milestones
      </p>
      <ol className="mt-4 space-y-2">
        {milestones.map((m, i) => {
          const s = status(m);
          return (
            <li
              key={m.step_id}
              className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-2 last:border-0 last:pb-0"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-semibold ${
                    m.completed
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                      : "border-zinc-300 text-zinc-500"
                  }`}
                  aria-hidden="true"
                >
                  {m.completed ? "✓" : i + 1}
                </span>
                <span
                  className={`truncate text-sm ${
                    m.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                  }`}
                >
                  {m.title}
                </span>
              </span>
              <span
                className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.cls}`}
              >
                {s.text}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
