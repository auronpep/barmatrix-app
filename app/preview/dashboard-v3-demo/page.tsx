"use client";

// Sample-data preview of Briefing v3 — the full command deck (v2 body) inside the
// persistent left-sidebar app shell. No Clerk auth / live API needed. The real
// route is /preview/dashboard-v3. Self-contained mock so it never touches v1/v2.

import { DashboardShell } from "@/components/preview-dashboard/dashboard-shell";
import { DashboardV2Body } from "@/components/preview-dashboard/dashboard-v2-body";
import type {
  CommandDeckData,
  DashboardRecentAttempt,
} from "@/lib/api-client";

const DATA: CommandDeckData = {
  enrolled: true,
  status: "active",
  student: {
    first_name: "Jordan",
    days_to_exam: 44,
    streak_days: 11,
    session_done_min: 18,
    session_goal_min: 45,
  },
  subject_mastery: [
    { subject: "Crim Pro", pct: 52, delta: -1, attempted: 198 },
    { subject: "Contracts", pct: 58, delta: 1, attempted: 298 },
    { subject: "Property", pct: 61, delta: 2, attempted: 221 },
    { subject: "Con Law", pct: 64, delta: -2, attempted: 287 },
    { subject: "Evidence", pct: 67, delta: 3, attempted: 268 },
    { subject: "Civ Pro", pct: 71, delta: 4, attempted: 312 },
    { subject: "Crim Law", pct: 74, delta: 6, attempted: 244 },
    { subject: "Torts", pct: 78, delta: 5, attempted: 256 },
  ],
  coverage: { covered: 1486, bank_total: 3666, pct: 41 },
  red_zones: [
    { rank: 1, name: "Decisionmaker Inversion", subject: "Evidence", dimension: "subject", tag: "evidence", miss_count: 12, total_attempts: 24, drills_total: 8, drills_complete: 0, trend: "rising", last_missed: "12 min ago", active: true },
    { rank: 2, name: "Wrong Hearsay Exception", subject: "Evidence", dimension: "subtopic", tag: "hearsay", miss_count: 11, total_attempts: 24, drills_total: 11, drills_complete: 2, trend: "flat", last_missed: "yesterday", active: true },
    { rank: 3, name: "Speculative Standing Injury", subject: "Con Law", dimension: "subject", tag: "con_law", miss_count: 8, total_attempts: 19, drills_total: 8, drills_complete: 5, trend: "falling", last_missed: "4 days ago", active: true },
    { rank: 4, name: "Foreseeable Zone Confusion", subject: "Torts", dimension: "subject", tag: "torts", miss_count: 7, total_attempts: 18, drills_total: 7, drills_complete: 1, trend: "flat", last_missed: "5 days ago", active: true },
    { rank: 5, name: "Vehicle Container Searches", subject: "Crim Pro", dimension: "subject", tag: "crim_pro", miss_count: 9, total_attempts: 17, drills_total: 9, drills_complete: 0, trend: "rising", last_missed: "today", active: true },
  ],
  mastery_trend: [
    { day: "2026-05-31", pct: 52, attempts: 8 },
    { day: "2026-06-02", pct: 51, attempts: 6 },
    { day: "2026-06-04", pct: 58, attempts: 9 },
    { day: "2026-06-06", pct: 61, attempts: 7 },
    { day: "2026-06-08", pct: 60, attempts: 10 },
    { day: "2026-06-10", pct: 66, attempts: 8 },
    { day: "2026-06-12", pct: 67, attempts: 9 },
    { day: "2026-06-14", pct: 74, attempts: 11 },
  ],
  recent_attempts: [
    { attempt_id: "1", question_id: "POE-CALMAP-003", subject: "Evidence", subtopic: "Hearsay", selected_letter: "C", correct: false, trap_name: "Decisionmaker Inversion trap", attempted_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { attempt_id: "2", question_id: "POE-CALMAP-002", subject: "Evidence", subtopic: "Hearsay", selected_letter: "A", correct: true, trap_name: null, attempted_at: new Date(Date.now() - 14 * 60000).toISOString() },
    { attempt_id: "3", question_id: "MBE-CR-0421", subject: "Crim Pro", subtopic: "Searches", selected_letter: "B", correct: false, trap_name: "Stale Rule — Chadwick trap", attempted_at: new Date(Date.now() - 60 * 60000).toISOString() },
    { attempt_id: "4", question_id: "MBE-CN-0883", subject: "Contracts", subtopic: "UCC", selected_letter: "D", correct: true, trap_name: null, attempted_at: new Date(Date.now() - 70 * 60000).toISOString() },
    { attempt_id: "5", question_id: "MBE-TT-0445", subject: "Torts", subtopic: "Negligence", selected_letter: "A", correct: true, trap_name: null, attempted_at: new Date(Date.now() - 120 * 60000).toISOString() },
  ] as DashboardRecentAttempt[],
  next_up: {
    drill_slug: "evidence-hearsay",
    title: "Roles of Judge and Jury",
    subject: "Evidence",
    reason: "Highest-attractiveness traps in your current red zone",
    question_count: 8,
    est_min: 14,
  },
  queue: [
    { drill_slug: "evidence-hearsay", title: "Roles of Judge and Jury", subject: "Evidence", reason: "Highest-attractiveness traps in your current red zone", question_count: 8, est_min: 14 },
    { drill_slug: "crim-pro-searches", title: "Vehicle Container Searches", subject: "Crim Pro", reason: "Sequenced after yesterday's foundation drill", question_count: 6, est_min: 11 },
    { drill_slug: "con-law-standing", title: "Speculative Standing Injury", subject: "Con Law", reason: "Spaced repetition · weakest tags first", question_count: 5, est_min: 9 },
  ],
  tension_matrix: {
    cols: ["Rule/Excptn", "Timing", "Party", "Scope", "Standard", "Triggers", "Remedy"],
    rows: [
      { name: "Con Law", heat: [2, 0, 1, 3, 4, 1, 0], attempts: [38, 24, 32, 47, 51, 36, 18] },
      { name: "Contracts", heat: [5, 3, 1, 0, 2, 3, 1], attempts: [62, 45, 28, 22, 36, 41, 24] },
      { name: "Crim Pro", heat: [4, 2, 0, 5, 1, 3, 1], attempts: [41, 28, 16, 48, 24, 35, 22] },
      { name: "Evidence", heat: [4, 0, 1, 2, 5, 1, 0], attempts: [55, 18, 26, 38, 58, 32, 16] },
      { name: "Torts", heat: [0, 0, 2, 1, 1, 0, 0], attempts: [24, 18, 38, 32, 31, 22, 19] },
    ],
  },
};

export default function DemoV3Page() {
  const noop = () => {};
  return (
    <DashboardShell
      data={DATA}
      crumb="DASHBOARD · DEMO"
      user={{ name: "Jordan A. Reyes", initials: "JR", sublabel: "Founding · #142" }}
    >
      <DashboardV2Body
        data={DATA}
        examDateLabel="Jul 28"
        onStartDrill={noop}
        onOpenRoute={noop}
      />
    </DashboardShell>
  );
}
