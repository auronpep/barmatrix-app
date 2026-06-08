import StreakFlame from "@/components/gamification/streak-flame";
import XpTotal from "@/components/gamification/xp-total";
import type { PathResponse } from "@/lib/api-client";

// Gamified status row for the guided path: today's progress bar + the reused
// streak/XP primitives from the boot-camp gamification toolkit.
export default function PathProgressStrip({ data }: { data: PathResponse }) {
  const pct =
    data.day_total_steps > 0
      ? Math.round((data.day_completed_steps / data.day_total_steps) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 border border-zinc-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-700">
          Day {data.current_day}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden border border-zinc-900 bg-zinc-100">
          <div className="h-full bg-red-700" style={{ width: `${pct}%` }} aria-hidden="true" />
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {data.day_completed_steps}/{data.day_total_steps} tasks today
        </p>
      </div>
      <div className="flex items-center gap-6 sm:pl-6">
        <StreakFlame count={data.gamification.current_streak} />
        <XpTotal value={data.gamification.total_xp} />
      </div>
    </div>
  );
}
