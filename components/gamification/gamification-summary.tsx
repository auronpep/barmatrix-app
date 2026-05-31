import type { MyGamification } from "@/lib/api-client";
import StreakFlame from "./streak-flame";
import XpTotal from "./xp-total";
import BadgeShelf from "./badge-shelf";

export default function GamificationSummary({ data }: { data: MyGamification }) {
  return (
    <div className="flex flex-col gap-4 border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-6">
        <StreakFlame count={data.current_streak} />
        <XpTotal value={data.total_xp} />
      </div>
      <BadgeShelf earnedSlugs={data.badges.map((b) => b.slug)} />
    </div>
  );
}
