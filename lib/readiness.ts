import type { CommandDeckData } from "@/lib/api-client";

export type ReadinessBand = "Exam-Ready" | "Strong" | "On Track" | "Building";

export interface Readiness {
  /** Synthesized 0-100 study signal (NOT a bar-result prediction). */
  readiness: number;
  band: ReadinessBand;
  /** Attempt-weighted recent (14d) accuracy. */
  accuracy: number;
  /** Total recent attempts the accuracy is weighted over. */
  attempted: number;
  /** Lifetime question-bank coverage %. */
  coverage: number;
  covered: number;
  bankTotal: number;
  /** Red-zone drill burn-down. */
  rzBurn: number;
  rzDone: number;
  rzTotal: number;
  /** Count of currently-active red zones. */
  activeRz: number;
  /** Latest rolling daily accuracy + its 7-day change. */
  dailyNow: number;
  delta7d: number;
  /** True once there is enough signal to render the hero honestly. */
  hasSignal: boolean;
}

function bandFor(readiness: number): ReadinessBand {
  if (readiness >= 85) return "Exam-Ready";
  if (readiness >= 73) return "Strong";
  if (readiness >= 60) return "On Track";
  return "Building";
}

// One synthesized readiness signal from the live deck data. Mirrors the design
// prototype's computeReadiness, adapted to the real (recent-window) shapes and
// guarded against divide-by-zero for fresh, low-data students. Honest by
// construction: every input is a real measured quantity, never a fabricated one.
export function computeReadiness(data: CommandDeckData): Readiness {
  const sm = data.subject_mastery;
  const attempted = sm.reduce((a, s) => a + s.attempted, 0);
  const accuracy =
    attempted > 0
      ? Math.round(sm.reduce((a, s) => a + s.pct * s.attempted, 0) / attempted)
      : 0;

  const coverage = data.coverage?.pct ?? 0;
  const covered = data.coverage?.covered ?? 0;
  const bankTotal = data.coverage?.bank_total ?? 0;

  const rzDone = data.red_zones.reduce((a, r) => a + r.drills_complete, 0);
  const rzTotal = data.red_zones.reduce((a, r) => a + r.drills_total, 0);
  const rzBurn = rzTotal > 0 ? Math.round((rzDone / rzTotal) * 100) : 0;

  const readiness = Math.round(
    accuracy * 0.6 + coverage * 0.25 + rzBurn * 0.15,
  );

  const t = data.mastery_trend;
  const dailyNow = t.length > 0 ? t[t.length - 1]!.pct : 0;
  const weekAgo =
    t.length > 0 ? (t[t.length - 8] ?? t[0]!).pct : 0;
  const delta7d = dailyNow - weekAgo;

  const activeRz = data.red_zones.filter((r) => r.active).length;

  return {
    readiness,
    band: bandFor(readiness),
    accuracy,
    attempted,
    coverage,
    covered,
    bankTotal,
    rzBurn,
    rzDone,
    rzTotal,
    activeRz,
    dailyNow,
    delta7d,
    hasSignal: attempted > 0,
  };
}
