// Mono-label / value pair used inside dashboard cards.
// Extracted from byte-identical copies in app/dashboard/path/page.tsx and
// app/dashboard/day-cards.tsx.

export function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-6 text-zinc-950">{value}</p>
    </div>
  );
}
