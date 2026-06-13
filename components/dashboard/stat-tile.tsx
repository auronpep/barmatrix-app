// Small bordered stat tile (serif value over a mono caption).
// Extracted from the identical `Metric` defined in app/dashboard/mastery/page.tsx
// (lg) and app/dashboard/final-sprint/page.tsx (md). The two differed only in
// the value font size, preserved here via `size`.

export function StatTile({
  label,
  value,
  size = "md",
}: {
  label: string;
  value: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="border border-zinc-300 bg-white px-3 py-4">
      <p
        className={`font-serif font-semibold leading-none ${
          size === "lg" ? "text-3xl" : "text-2xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}
