export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-zinc-900 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-red-700">
              Paid Dashboard
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-950">
              Today&apos;s Guided Path
            </p>
          </div>
          <span className="w-full border border-zinc-300 px-3 py-1.5 text-center font-mono text-[11px] uppercase tracking-wider text-zinc-600 sm:hidden">
            1 task
          </span>
          <span className="hidden shrink-0 border border-zinc-300 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-600 sm:inline-block">
            One active task
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
