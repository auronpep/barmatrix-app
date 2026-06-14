"use client";

// Operator Console — the founder's launch-sprint command center.
//
// PHASE 2 (presentation): a private founder dashboard ported from the design
// bundle's operator.html. Two-column shell (dark sidebar + main), in-memory route
// switching, dark "command console" chrome over the app's existing tokens
// (serif/mono, zinc/red). Mission Control is the heart; operations + partner +
// secondary views follow. Content Pipeline / Question Author (content-engineering
// tools, data-heavy) are stubbed pending their dataset.
//
// FLIP to production: move to a founder-gated route group app/(operator)/operator/
// with a server-side Clerk allowlist check (revenue / refunds / PII — never
// client-gated), add /operator to robots disallow, and wire BM_OP_DATA to
// GET /api/me/operator. This preview is unauthenticated demo data only.

import { useState } from "react";
import { BM_OP_DATA, type OpData } from "@/app/preview/operator/op-data";

const D = BM_OP_DATA;
const NOW = new Date("2026-05-21");
const daysAgo = (s: string) => Math.floor((NOW.getTime() - new Date(s).getTime()) / 86400000);
const k$ = (n: number) => `$${(n / 1000).toFixed(1)}k`;

type Route =
  | "mission" | "funnel" | "revenue" | "refunds" | "support" | "webinars"
  | "partners" | "payouts" | "bank" | "author" | "diagnostic";

const TITLES: Record<Route, string> = {
  mission: "Mission Control", funnel: "Conversion Funnel", revenue: "Revenue Live",
  refunds: "Refund Queue", support: "Support Inbox", webinars: "Webinar Performance",
  partners: "Referral Console", payouts: "Partner Payouts", bank: "Content Pipeline",
  author: "Question Author", diagnostic: "Diagnostic Items",
};

const NAV: { sec: string; items: { k: Route; i: string; l: string; badge?: string; live?: boolean }[] }[] = [
  { sec: "LIVE", items: [
    { k: "mission", i: "▣", l: "Mission Control" },
    { k: "funnel", i: "▼", l: "Conversion Funnel" },
    { k: "revenue", i: "◧", l: "Revenue", badge: "LIVE", live: true },
  ] },
  { sec: "OPERATIONS", items: [
    { k: "refunds", i: "↩", l: "Refunds", badge: "2" },
    { k: "support", i: "?", l: "Support", badge: "7" },
    { k: "webinars", i: "▶", l: "Webinars" },
  ] },
  { sec: "PARTNERS", items: [
    { k: "partners", i: "▌", l: "Referral Console" },
    { k: "payouts", i: "$", l: "Payouts" },
  ] },
  { sec: "CONTENT", items: [
    { k: "bank", i: "≡", l: "Content Pipeline" },
    { k: "author", i: "✎", l: "Question Author", badge: "NEW", live: true },
    { k: "diagnostic", i: "▦", l: "Diagnostic Items" },
  ] },
];

export function OperatorConsole() {
  const [route, setRoute] = useState<Route>("mission");
  return (
    <div className="grid h-[calc(100vh-120px)] min-h-[560px] grid-cols-1 overflow-hidden border border-zinc-900 md:grid-cols-[230px_1fr]">
      <Sidebar route={route} setRoute={setRoute} />
      <div className="grid grid-rows-[64px_1fr] overflow-hidden bg-[#f6f3ec]">
        <Topbar route={route} />
        <div className="overflow-y-auto">
          <div className="mx-auto max-w-[1600px] p-5">
            <View route={route} setRoute={setRoute} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── sidebar ── */
function Sidebar({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  const m = D.meta, h = D.health;
  return (
    <aside className="relative hidden flex-col overflow-y-auto bg-zinc-950 text-zinc-300 md:flex">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-red-700" />
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-1 font-serif text-xl font-bold text-white">
          <span className="bg-red-700 px-1.5 leading-tight">B</span>
          <span>BarMatrix</span>
          <span className="-translate-y-2 inline-block h-1 w-1 bg-red-700" />
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">▌ Operator · v1</div>
      </div>

      <nav className="flex-1 py-2">
        {NAV.map((sec) => (
          <div key={sec.sec}>
            <div className="px-4 pb-1.5 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">▌ {sec.sec}</div>
            {sec.items.map((it) => {
              const active = route === it.k;
              return (
                <button
                  key={it.k}
                  type="button"
                  onClick={() => setRoute(it.k)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-[13px] transition ${
                    active ? "border-l-2 border-red-700 bg-red-700/10 text-white" : "border-l-2 border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <span className="w-3 font-mono text-zinc-500">{it.i}</span>
                  <span className="flex-1">{it.l}</span>
                  {it.badge && (
                    <span className={`px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide ${it.live ? "animate-pulse bg-red-700 text-white" : "bg-zinc-800 text-zinc-300"}`}>
                      {it.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
        <StatusRow label="System" v={`${h.uptime}%`} />
        <StatusRow label="Stripe webhooks" v={`${h.stripeWebhookSuccess}%`} />
        <StatusRow label="Active now" v={`${h.activeNow}`} />
        <StatusRow label="Error rate" v={`${(h.errorRate * 100).toFixed(2)}%`} amber />
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center bg-red-700 font-mono text-xs font-bold text-white">{m.operatorInitials}</div>
        <div>
          <div className="text-[13px] font-semibold text-white">{m.operator}</div>
          <div className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">{m.operatorRole.split(" · ")[0]}</div>
        </div>
      </div>
    </aside>
  );
}

function StatusRow({ label, v, amber }: { label: string; v: string; amber?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${amber ? "bg-amber-500" : "bg-green-500"}`} />
      <span className="flex-1 text-zinc-500">{label}</span>
      <span className="text-zinc-200">{v}</span>
    </div>
  );
}

/* ── topbar ── */
function Topbar({ route }: { route: Route }) {
  const k = D.kpis, m = D.meta;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-zinc-300 bg-[#fffdf7] px-5">
      <div className="min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">BARMATRIX OPERATOR / {route.toUpperCase()}</div>
        <div className="truncate font-serif text-lg font-bold">{TITLES[route]}</div>
      </div>
      <div className="hidden items-center gap-5 lg:flex">
        <Ticker lbl="Enrolled" v={`${k.enrollments.value}`} sub="/1000" />
        <Ticker lbl="Revenue" v={k$(k.revenueTotal.value)} />
        <Ticker lbl="Today" v={`+${k$(k.revenueToday.value)}`} tone="green" />
        <Ticker lbl="Seats left" v={`${D.capacity.remaining}`} tone="red" />
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide text-zinc-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
        Sprint D{m.sprintDay}/{m.sprintTotal} · Live
      </div>
    </header>
  );
}

function Ticker({ lbl, v, sub, tone }: { lbl: string; v: string; sub?: string; tone?: "green" | "red" }) {
  const c = tone === "green" ? "text-green-700" : tone === "red" ? "text-red-700" : "text-zinc-900";
  return (
    <div>
      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-zinc-500">{lbl}</div>
      <div className={`font-serif text-lg font-bold leading-none ${c}`}>
        {v}
        {sub && <span className="font-mono text-xs font-medium text-zinc-500">{sub}</span>}
      </div>
    </div>
  );
}

/* ── shared atoms ── */
function KpiCard({ label, value, unit, delta, dir, target, red }: {
  label: string; value: string | number; unit?: string; delta: string; dir: "up" | "down"; target: string; red?: boolean;
}) {
  return (
    <div className="border border-zinc-300 bg-[#fffdf7] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">▌ {label}</div>
      <div className={`mt-2 font-serif text-[40px] font-bold leading-none tracking-tight ${red ? "text-red-700" : ""}`}>
        {value}
        {unit && <span className="font-mono text-base font-medium text-zinc-400">{unit}</span>}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className={`font-mono text-[11px] ${dir === "up" ? "text-green-700" : "text-red-700"}`}>{delta}</span>
        <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-400">{target}</span>
      </div>
    </div>
  );
}

function Panel({ title, meta, children, action }: { title: string; meta?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border border-zinc-300 bg-[#fffdf7]">
      <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2.5">
        <span className="flex-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{title}</span>
        {meta && <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">{meta}</span>}
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

const PILL: Record<string, string> = {
  "auto-approved": "bg-zinc-200 text-zinc-600", approved: "bg-green-800 text-white",
  review: "bg-amber-600 text-white", denied: "bg-red-700 text-white", active: "bg-green-800 text-white",
};
function StatusPill({ s }: { s: string }) {
  return <span className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${PILL[s] ?? "bg-zinc-200 text-zinc-600"}`}>{s.replace("-", " ")}</span>;
}
const TYPE_TINT: Record<string, string> = { Influencer: "text-red-700", Tutor: "text-zinc-700", Org: "text-amber-700" };

function KpiRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

/* ── router ── */
function View({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  switch (route) {
    case "mission": return <MissionControl setRoute={setRoute} />;
    case "funnel": return <FunnelView />;
    case "refunds": return <RefundsView />;
    case "partners": return <PartnersView />;
    case "revenue": return <RevenueView />;
    case "webinars": return <WebinarsView />;
    case "payouts": return <PayoutsView />;
    case "support": return <SupportView />;
    case "diagnostic": return <DiagItemsView />;
    default: return <Stub route={route} />;
  }
}

/* ── Mission Control ── */
function MissionControl({ setRoute }: { setRoute: (r: Route) => void }) {
  const k = D.kpis;
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Enrollments" value={k.enrollments.value} unit="/1000" delta={`▲ ${k.enrollments.deltaLabel}`} dir="up" target={`${((k.enrollments.value / 1000) * 100).toFixed(1)}% to 1K`} />
        <KpiCard label="Gross revenue" value={k$(k.revenueTotal.value)} delta={`▲ ${k.revenueToday.deltaLabel}`} dir="up" target={`${((k.revenueTotal.value / 974000) * 100).toFixed(0)}% of $974k target`} />
        <KpiCard label="Pay-in-full rate" value={`${(k.payInFullRate.value * 100).toFixed(0)}%`} delta={`▲ ${k.payInFullRate.deltaLabel}`} dir="up" target="vs $500+$499 plan" red />
        <KpiCard label="Refund rate" value={`${(k.refundRate.value * 100).toFixed(1)}%`} delta={`▲ ${k.refundRate.deltaLabel}`} dir="down" target="Target ≤ 1.5%" />
      </KpiRow>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        <Panel title="▌ Revenue · 7-day sprint" meta="$168,013 cumulative · target $974,000">
          <div className="p-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">▌ Cumulative</div>
                <div className="font-serif text-3xl font-bold tracking-tight">$168,013</div>
              </div>
              <div className="text-right font-mono text-[11px] text-zinc-500">
                <div>$21,576 today</div>
                <strong className="text-green-700">▲ +$4.6k vs yesterday</strong>
              </div>
            </div>
            <RevenueBars />
            <p className="mt-3 border-t border-zinc-200 pt-3 font-mono text-[11px] leading-relaxed text-zinc-500">
              <strong className="text-zinc-900">Today&apos;s pace:</strong> 24 enrollments by 16:34 PT · projecting{" "}
              <strong className="text-red-700">~35 by EOD</strong>. Need ~33/day through Day 7 to hit 1K.
            </p>
          </div>
        </Panel>

        <Panel title="▌ Live Activity" meta="● Streaming · last 30 min">
          <div className="max-h-[340px] divide-y divide-zinc-200 overflow-y-auto">
            {D.activity.map((ev) => <ActivityRow key={ev.id} ev={ev} />)}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        <Panel title="▌ Conversion Funnel · last 7 days" meta={`${D.funnel[0].count.toLocaleString()} → ${D.funnel[D.funnel.length - 1].count} · ${D.funnel[D.funnel.length - 1].pctTotal}% e2e`}>
          <div className="space-y-2 p-4">{D.funnel.map((s, i) => <FunnelRow key={i} stage={s} hasPrev={i > 0} />)}</div>
        </Panel>
        <Panel title="▌ Enrollment capacity" meta="Limited seats">
          <CapacityGauge />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        <Panel title="▌ Top Referring Partners · today" meta="$199/conversion · payable after refund window">
          <PartnerTable rows={D.partners.slice(0, 5)} />
        </Panel>
        <Panel title="▌ Geo Distribution" meta="By billing zip">
          <div className="space-y-1.5 p-4">
            {D.geo.map((g) => (
              <div key={g.state} className="grid grid-cols-[90px_1fr_auto_auto] items-center gap-2 text-[12px]">
                <span className="text-zinc-700">{g.state}</span>
                <span className="h-1.5 bg-zinc-200"><span className="block h-full bg-zinc-900" style={{ width: `${Math.min(100, g.pct * 2)}%` }} /></span>
                <span className="w-7 text-right font-mono text-zinc-900">{g.count}</span>
                <span className="w-10 text-right font-mono text-zinc-400">{g.pct}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="▌ Secondary Metrics" meta="Hourly refresh · Stripe · analytics">
        <div className="grid grid-cols-2 divide-zinc-200 sm:grid-cols-4 sm:divide-x">
          <Micro lbl="Diagnostic completions" v={D.kpis.diagnosticCompleted.value.toLocaleString()} d={`▲ ${D.kpis.diagnosticCompleted.deltaLabel}`} />
          <Micro lbl="Email list" v={D.kpis.emailList.value.toLocaleString()} d={`▲ ${D.kpis.emailList.deltaLabel}`} />
          <Micro lbl="Diag → complete" v="60.1%" d="▲ +2.4pt vs Day 1" />
          <Micro lbl="Checkout → buy" v="65.2%" d="▲ +8.1pt · target 50%" green />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="▌ Webinars · launch sprint" meta="Attendees → purchases">
          <div className="divide-y divide-zinc-200">{D.webinars.map((w) => <WebinarRow key={w.id} w={w} />)}</div>
        </Panel>
        <Panel title="▌ Refund Queue · 2 need review" meta="7-day window" action={
          <button type="button" onClick={() => setRoute("refunds")} className="!bg-red-700 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide !text-white">View all →</button>
        }>
          <RefundTable rows={D.refunds.slice(0, 5)} compact />
        </Panel>
      </div>
    </div>
  );
}

function RevenueBars() {
  const max = Math.max(...D.revenueTrend.map((d) => d.rev));
  return (
    <div className="mt-4 flex h-32 items-end gap-2">
      {D.revenueTrend.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <div className="font-mono text-[9px] text-zinc-500">{k$(d.rev)}</div>
          <div className={`w-full ${d.day === "May 21" ? "bg-red-700" : "bg-zinc-900"}`} style={{ height: `${max ? (d.rev / max) * 100 : 0}%`, minHeight: 2 }} />
          <div className="font-mono text-[9px] text-zinc-400">{d.day.split(" ")[1]}</div>
        </div>
      ))}
    </div>
  );
}

function ActivityRow({ ev }: { ev: OpData["activity"][number] }) {
  const label = ev.type === "purchase" ? "BUY" : ev.type === "refund" ? "REFUND" : ev.type === "diagnostic" ? "DIAG" : "EVENT";
  const tint = ev.type === "purchase" ? "bg-green-800 text-white" : ev.type === "refund" ? "bg-red-700 text-white" : "bg-zinc-200 text-zinc-700";
  return (
    <div className="grid grid-cols-[36px_1fr_auto] items-start gap-2 px-4 py-2.5 text-[12px]">
      <span className="font-mono text-[10px] text-zinc-400">{ev.ts}</span>
      <div className="min-w-0">
        <span className={`mr-1.5 px-1 py-0.5 font-mono text-[8px] uppercase tracking-wide ${tint}`}>{label}</span>
        <span className="font-semibold text-zinc-900">{ev.who}</span>{" "}
        <span className="text-zinc-600">{ev.what}</span>
        {ev.partner && <span className="ml-1 font-mono text-[10px] text-zinc-400">▸ via {ev.partner}</span>}
      </div>
      <span className={`whitespace-nowrap font-mono text-[11px] ${ev.amount && ev.amount > 0 ? "text-green-700" : ev.amount && ev.amount < 0 ? "text-red-700" : ""}`}>
        {ev.amount == null ? "" : (ev.amount > 0 ? "+" : "−") + "$" + Math.abs(ev.amount)}
      </span>
    </div>
  );
}

function FunnelRow({ stage, hasPrev }: { stage: OpData["funnel"][number]; hasPrev: boolean }) {
  const miss = hasPrev && stage.pctOfPrev < 65;
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[11px]">
        <span className="font-semibold text-zinc-900">▌ {stage.stage}</span>
        <span className="text-zinc-500">
          {hasPrev && <span className="mr-3">−{(100 - stage.pctOfPrev).toFixed(1)}% drop</span>}
          {stage.count.toLocaleString()} · {stage.pctTotal}%
        </span>
      </div>
      <div className={`mt-1 flex items-center justify-between px-2 py-1 font-mono text-[10px] text-white ${miss ? "bg-red-700" : "bg-zinc-900"}`} style={{ width: `${Math.max(stage.pctTotal, 28)}%`, minWidth: 200 }}>
        <span>{stage.count.toLocaleString()}</span>
        <span className="opacity-70">{stage.pctTotal}% of top</span>
      </div>
    </div>
  );
}

function CapacityGauge() {
  const c = D.capacity;
  const pct = (c.enrolled / c.cap) * 100;
  return (
    <div className="p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">▌ Founding cohort · limited seats</div>
      <div className="mt-1 font-serif text-4xl font-bold tracking-tight">{c.enrolled}<span className="text-zinc-400">/{c.cap}</span></div>
      <div className="mt-1 text-[13px] leading-relaxed text-zinc-600">
        enrolled · <strong>{c.remaining}</strong> seats remain. Limited seats available — enrollment closes when capacity is reached.
      </div>
      <div className="mt-3 h-2 bg-zinc-200"><div className="h-full bg-red-700" style={{ width: `${pct}%` }} /></div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wide text-zinc-500">
        <span>{pct.toFixed(1)}% filled</span>
        <span>Est. {k$(c.revenueIfFilled)} at capacity</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4">
        <div>
          <div className="font-serif text-3xl font-bold tracking-tight">{c.remaining}</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">Seats to capacity</div>
        </div>
        <div>
          <div className="font-serif text-3xl font-bold tracking-tight text-green-800">{k$(c.revenueIfFilled)}</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">Remaining revenue at $999</div>
        </div>
      </div>
    </div>
  );
}

function Micro({ lbl, v, d, green }: { lbl: string; v: string; d: string; green?: boolean }) {
  return (
    <div className="px-4 py-3 first:pl-4">
      <div className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">{lbl}</div>
      <div className={`mt-1 font-serif text-2xl font-bold tracking-tight ${green ? "text-green-700" : ""}`}>{v}</div>
      <div className="mt-0.5 font-mono text-[10px] text-green-700">{d}</div>
    </div>
  );
}

function WebinarRow({ w }: { w: OpData["webinars"][number] }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3">
      <div className="min-w-0">
        <div className="truncate font-serif text-[14px] font-semibold">
          {w.title}
          {w.live && <span className="ml-2 animate-pulse font-mono text-[9px] uppercase text-red-700">● Live</span>}
          {w.upcoming && <span className="ml-2 font-mono text-[9px] uppercase text-zinc-400">Upcoming</span>}
        </div>
        <div className="font-mono text-[10px] text-zinc-500">▸ {w.date} · {w.id}</div>
      </div>
      <Stat lbl="Attend" v={`${w.attendees}`} />
      <Stat lbl="Conv" v={w.conv ? `${(w.conv * 100).toFixed(1)}%` : "—"} />
      <Stat lbl="Led to" v={w.ledTo > 0 ? `+${w.ledTo}` : "—"} red />
    </div>
  );
}
function Stat({ lbl, v, red }: { lbl: string; v: string; red?: boolean }) {
  return (
    <div className="text-right">
      <div className="font-mono text-[8px] uppercase tracking-wide text-zinc-400">{lbl}</div>
      <div className={`font-serif text-base font-bold ${red ? "text-red-700" : ""}`}>{v}</div>
    </div>
  );
}

/* ── tables shared by views ── */
function PartnerTable({ rows, full }: { rows: OpData["partners"]; full?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-zinc-200 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
            {full && <th className="px-4 py-2 text-left">#</th>}
            <th className="px-4 py-2 text-left">Partner</th>
            <th className="px-4 py-2 text-left">Type</th>
            {full && <th className="px-4 py-2 text-left">Top geo</th>}
            <th className="px-4 py-2 text-right">Clicks</th>
            <th className="px-4 py-2 text-right">Conv</th>
            <th className="px-4 py-2 text-right">CR%</th>
            <th className="px-4 py-2 text-right">Commission</th>
            {full && <th className="px-4 py-2 text-left">Status</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.id} className="border-b border-zinc-100 last:border-0">
              {full && <td className="px-4 py-2 font-mono text-zinc-400">{i + 1}</td>}
              <td className="px-4 py-2 font-medium">{p.name}</td>
              <td className={`px-4 py-2 font-mono text-[11px] ${TYPE_TINT[p.type]}`}>{p.type}</td>
              {full && <td className="px-4 py-2 text-zinc-600">{p.topGeo}</td>}
              <td className="px-4 py-2 text-right font-mono">{p.clicks.toLocaleString()}</td>
              <td className="px-4 py-2 text-right font-mono text-red-700">{p.conversions}</td>
              <td className="px-4 py-2 text-right font-mono text-zinc-500">{((p.conversions / p.clicks) * 100).toFixed(2)}%</td>
              <td className="px-4 py-2 text-right font-mono text-green-700">${p.commission.toLocaleString()}</td>
              {full && <td className="px-4 py-2"><StatusPill s={p.status} /></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RefundTable({ rows, compact }: { rows: OpData["refunds"]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-zinc-200 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
            {!compact && <th className="px-4 py-2 text-left">ID</th>}
            <th className="px-4 py-2 text-left">Student</th>
            {!compact && <th className="px-4 py-2 text-left">Purchased</th>}
            <th className="px-4 py-2 text-left">Days</th>
            <th className="px-4 py-2 text-left">Usage</th>
            <th className="px-4 py-2 text-right">Amt</th>
            {!compact && <th className="px-4 py-2 text-left">Reason</th>}
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-zinc-100 last:border-0">
              {!compact && <td className="px-4 py-2 font-mono text-zinc-400">{r.id}</td>}
              <td className="px-4 py-2 font-medium">{r.student}</td>
              {!compact && <td className="px-4 py-2 font-mono text-zinc-500">{r.purchased}</td>}
              <td className="px-4 py-2 font-mono text-zinc-500">{daysAgo(r.purchased)}d</td>
              <td className={`px-4 py-2 font-mono ${r.usage > 50 ? "text-red-700" : r.usage > 20 ? "text-amber-700" : "text-zinc-500"}`}>{r.usage}%</td>
              <td className="px-4 py-2 text-right font-mono">${r.price}</td>
              {!compact && <td className="px-4 py-2 max-w-[240px] truncate text-zinc-600">{r.reason}</td>}
              <td className="px-4 py-2"><StatusPill s={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── operations + secondary views ── */
function FunnelView() {
  const f = D.funnel;
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Diag completion" value={`${f[1].pctTotal}%`} delta="▲ +2.4pt" dir="up" target="of starts" />
        <KpiCard label="Checkout start" value={`${f[4].pctTotal}%`} delta="▲ +1.1pt" dir="up" target="of starts" />
        <KpiCard label="End-to-end" value={`${f[5].pctTotal}%`} delta="▲ +0.9pt" dir="up" target="diag → buy" red />
        <KpiCard label="Checkout → buy" value="65.2%" delta="▲ +8.1pt" dir="up" target="target 50%" />
      </KpiRow>
      <Panel title="▌ Conversion Funnel · last 7 days" meta="Diagnostic → purchase">
        <div className="space-y-2 p-4">{f.map((s, i) => <FunnelRow key={i} stage={s} hasPrev={i > 0} />)}</div>
      </Panel>
    </div>
  );
}

function RefundsView() {
  const r = D.refunds;
  const total = r.reduce((a, x) => a + x.price, 0);
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Refund rate" value="1.1%" delta="▲ +0.2pt" dir="down" target="target ≤ 1.5%" />
        <KpiCard label="In review" value={r.filter((x) => x.status === "review").length} delta="2 open" dir="down" target="needs decision" red />
        <KpiCard label="Auto-approved" value={r.filter((x) => x.status === "auto-approved").length} delta="0% usage" dir="up" target="no-questions window" />
        <KpiCard label="Total refunded" value={`$${total.toLocaleString()}`} delta="7 requests" dir="down" target="sprint to date" />
      </KpiRow>
      <Panel title="▌ Refund Queue" meta="7-day no-questions window"><RefundTable rows={r} /></Panel>
    </div>
  );
}

function PartnersView() {
  const p = D.partners;
  const conv = p.reduce((a, x) => a + x.conversions, 0);
  const comm = p.reduce((a, x) => a + x.commission, 0);
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Active partners" value={p.length} delta="▲ +2 today" dir="up" target="referral console" />
        <KpiCard label="Partner buyers" value={conv} delta={`${((conv / 187) * 100).toFixed(0)}% of enrollments`} dir="up" target="attributed" />
        <KpiCard label="Commission accrued" value={k$(comm)} delta="$199/conversion" dir="down" target="payable after window" red />
        <KpiCard label="Avg conv rate" value={`${((conv / p.reduce((a, x) => a + x.clicks, 0)) * 100).toFixed(2)}%`} delta="▲ +0.3pt" dir="up" target="clicks → buyers" />
      </KpiRow>
      <Panel title="▌ Partner Leaderboard" meta="Ranked by conversions"><PartnerTable rows={p} full /></Panel>
    </div>
  );
}

function RevenueView() {
  const k = D.kpis;
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Gross revenue" value={k$(k.revenueTotal.value)} delta={`▲ ${k.revenueToday.deltaLabel}`} dir="up" target="of $974k target" />
        <KpiCard label="Today" value={k$(k.revenueToday.value)} delta="▲ +$4.6k vs yest" dir="up" target="still running" red />
        <KpiCard label="Avg order" value="$899" delta="70% pay-in-full" dir="up" target="$999 / $500+$499" />
        <KpiCard label="Daily target" value="$139k" delta="to hit $974k" dir="down" target="through Day 7" />
      </KpiRow>
      <Panel title="▌ Revenue · 7-day sprint" meta="Cumulative $168,013"><div className="p-4"><RevenueBars /></div></Panel>
    </div>
  );
}

function WebinarsView() {
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Sessions" value={D.webinars.length} delta="1 live · 1 upcoming" dir="up" target="launch sprint" />
        <KpiCard label="Total attendees" value={D.webinars.reduce((a, w) => a + w.attendees, 0)} delta="▲ +287 today" dir="up" target="across sessions" />
        <KpiCard label="Webinar buyers" value={D.webinars.reduce((a, w) => a + w.ledTo, 0)} delta="attributed" dir="up" target="attendees → buy" red />
        <KpiCard label="Avg conv" value="6.5%" delta="▲ +0.8pt" dir="up" target="attendee → purchase" />
      </KpiRow>
      <Panel title="▌ Webinars · launch sprint" meta="Attendees → purchases">
        <div className="divide-y divide-zinc-200">{D.webinars.map((w) => <WebinarRow key={w.id} w={w} />)}</div>
      </Panel>
    </div>
  );
}

function PayoutsView() {
  const rows = D.partners.map((p) => ({ ...p, pending: Math.round(p.commission * 0.45), payable: Math.round(p.commission * 0.3), paid: Math.round(p.commission * 0.25) }));
  const sum = (key: "pending" | "payable" | "paid") => rows.reduce((a, r) => a + r[key], 0);
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Total accrued" value={k$(sum("pending") + sum("payable") + sum("paid"))} delta="$199 × conv" dir="up" target="all partners" />
        <KpiCard label="Pending window" value={k$(sum("pending"))} delta="in refund window" dir="down" target="not yet payable" red />
        <KpiCard label="Payable now" value={k$(sum("payable"))} delta="cleared window" dir="up" target="ready to send" />
        <KpiCard label="Paid out" value={k$(sum("paid"))} delta="this sprint" dir="up" target="settled" />
      </KpiRow>
      <Panel title="▌ Partner Payout Schedule" meta="45% pending · 30% payable · 25% paid">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-zinc-200 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2 text-left">Partner</th><th className="px-4 py-2 text-right">Conv</th>
              <th className="px-4 py-2 text-right">Pending</th><th className="px-4 py-2 text-right">Payable</th><th className="px-4 py-2 text-right">Paid</th>
            </tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2 text-right font-mono">{r.conversions}</td>
                <td className="px-4 py-2 text-right font-mono text-amber-700">${r.pending.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-mono text-green-700">${r.payable.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-mono text-zinc-400">${r.paid.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function SupportView() {
  const s = D.support;
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Open tickets" value={s.open} delta="needs reply" dir="down" target="inbox" red />
        <KpiCard label="Answered" value={s.answered} delta="this sprint" dir="up" target="resolved" />
        <KpiCard label="Avg response" value={`${s.avgResponseMin}m`} delta="▲ fast" dir="up" target="first reply" />
        <KpiCard label="Top issue" value={`${s.topIssues[0].count}×`} delta={s.topIssues[0].issue} dir="down" target="this week" />
      </KpiRow>
      <Panel title="▌ Top Issues" meta="Grouped by theme">
        <div className="divide-y divide-zinc-200">
          {s.topIssues.map((t) => (
            <div key={t.issue} className="flex items-center justify-between px-4 py-3 text-[13px]">
              <span>{t.issue}</span>
              <span className="font-mono text-red-700">{t.count} open</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DiagItemsView() {
  return (
    <div className="space-y-5">
      <KpiRow>
        <KpiCard label="Diagnostic items" value={12} delta="curated pool" dir="up" target="12-question diag" />
        <KpiCard label="Completions" value={D.kpis.diagnosticCompleted.value.toLocaleString()} delta={`▲ ${D.kpis.diagnosticCompleted.deltaLabel}`} dir="up" target="sprint to date" />
        <KpiCard label="Completion rate" value="60.1%" delta="▲ +2.4pt" dir="up" target="of starts" red />
        <KpiCard label="Avg score" value="5.3/12" delta="high-attractiveness" dir="down" target="trap-weighted" />
      </KpiRow>
      <Panel title="▌ Diagnostic Item Calibration" meta="Wired to the live 12-question diagnostic pool">
        <div className="p-5 text-[13px] leading-relaxed text-zinc-600">
          The diagnostic-item calibration table (per-item focus-group accuracy, top wrong answer, trap archetype)
          mounts here once wired to the live diagnostic pool + attempt data. The pool itself is the curated
          20-question Red-Zone set already ingested.
        </div>
      </Panel>
    </div>
  );
}

function Stub({ route }: { route: Route }) {
  const copy: Record<string, string> = {
    bank: "The Content Pipeline — Tension Matrix (44 POE tensions), the 280-slot blueprint, the Wrong-Answer taxonomy, CA distinctions, QA rubric, and sample audit — mounts here once the pipeline dataset is wired in.",
    author: "The Question Author — slot picker → forensic spec → trap-architecture draft against the live QA rubric — mounts here once wired to the question bank.",
  };
  return (
    <Panel title={`▌ ${TITLES[route]}`} meta="Content-engineering tool · pending dataset">
      <div className="p-6 text-[13px] leading-relaxed text-zinc-600">{copy[route] ?? "Coming soon."}</div>
    </Panel>
  );
}
