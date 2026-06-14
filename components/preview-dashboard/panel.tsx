import type { ReactNode } from "react";

// Shared panel chrome for the command deck: hairline border, mono uppercase
// title bar, optional meta + actions. Matches the prototype's `.panel`.
export function Panel({
  title,
  meta,
  actions,
  flush = false,
  children,
}: {
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border border-zinc-900 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-900">
          {title}
        </span>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : meta ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">
            {meta}
          </span>
        ) : null}
      </div>
      <div className={flush ? "" : "p-5"}>{children}</div>
    </div>
  );
}
