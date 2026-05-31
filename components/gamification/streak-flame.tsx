import { streakLabel } from "@/lib/gamification";

export default function StreakFlame({ count }: { count: number }) {
  const active = count > 0;
  return (
    <div className="flex items-center gap-2" aria-label={streakLabel(count)}>
      <span
        className={
          active
            ? "text-2xl transition-transform hover:scale-110"
            : "text-2xl opacity-30 grayscale"
        }
        aria-hidden="true"
      >
        🔥
      </span>
      <div className="leading-tight">
        <p className="font-serif text-xl font-semibold text-zinc-900">{Math.max(0, count)}</p>
        <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">day streak</p>
      </div>
    </div>
  );
}
