// J7 dashboard shell.
//
// The paid dashboard is no longer a command center. It is a prescribed daily
// path, so this layout intentionally avoids study-program nav links and tabs.
// The root layout owns <main>; child dashboard pages own their section roots.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-zinc-900 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">
            BarMatrix daily path
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
