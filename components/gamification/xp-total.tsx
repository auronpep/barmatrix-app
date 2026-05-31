import { formatXp } from "@/lib/gamification";

export default function XpTotal({ value }: { value: number }) {
  return (
    <div className="leading-tight" aria-label={`${formatXp(value)} total XP`}>
      <p className="font-serif text-xl font-semibold text-zinc-900">{formatXp(value)}</p>
      <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">total XP</p>
    </div>
  );
}
