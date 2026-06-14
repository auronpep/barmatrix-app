// Redesign V2 — Outline Atlas data contract.
//
// The canonical MBE outline as a study reviewer: browse the full outline, open a
// lesson, drill an item, see per-item performance. Ported from the design bundle's
// window.BM_OUTLINE (generated from the 8-digit outline-codes sheet).

export interface OutlineItem {
  name: string;
  /** 8-digit outline code. */
  code: string;
  /** 0 = subtopic root, 1 = section, 2 = leaf item. */
  level: number;
  leaf: boolean;
}

export interface OutlineSubtopic {
  name: string;
  items: OutlineItem[];
}

export interface OutlineSubject {
  name: string;
  abbr: string;
  /** Roll-up counts present in the codes-sheet data. */
  itemCount?: number;
  leafCount?: number;
  subtopics: OutlineSubtopic[];
}

export interface OutlineData {
  meta: { subjectCount: number; subtopicCount: number; itemCount: number; leafCount: number };
  subjects: OutlineSubject[];
}

export type PerfStatus = "mastered" | "proficient" | "shaky" | "weak" | "untouched";

export interface ItemPerf {
  status: PerfStatus;
  attempts: number;
  accuracy: number | null;
  qAvail: number;
  lastDays: number | null;
  trap: string | null;
}
