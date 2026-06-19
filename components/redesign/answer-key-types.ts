// Redesign V2 — Answer Key ("Combo B · Fork-First") debrief data contract.
//
// This is the per-question object that drives the post-answer debrief screen
// (components/redesign/answer-key-debrief.tsx). It mirrors the design handoff's
// BM_AK schema (design_handoff_combo_b_answer_key/teardown/ak-data.js),
// re-expressed as a typed TS contract.
//
// PHASE 2 source-of-truth note: in production this object is assembled by the
// answer-key API endpoint from c3_annotations + answer_choices + gold/silver
// keys (see docs/C3_REWRITE_DB_INGEST_PLAN.md). For the Phase-2 PREVIEW it is
// supplied as a static fixture so the founder can review the layout before the
// ingest + endpoint land. Fields the runner derives at request time (drill
// session %, collection counts) are NOT part of this object.

export type StemSegment =
  | string
  | {
      t: string;
      mark?: "circle" | "underline" | "highlight" | "strike" | "box";
      type?: FactTone;
      note?: string;
    };

export type FactTone =
  | "easement"
  | "baseline"
  | "expanded"
  | "bait"
  | "selfhelp"
  | "call";

export interface DebriefRedZone {
  id: string;
  label: string;
  rank: number;
  dimension?: string | null;
  tag?: string | null;
}

export interface DebriefChoice {
  letter: string;
  correct: boolean;
  dominant: boolean;
  text: string;
  keyPhrase?: string;
  keyType?: FactTone;
  verdict: string;
  studentLabel?: string;
  mold?: string | null;
  moldFamily?: string | null;
  c3Signal?: string;
  pull?: string;
  breaker?: string;
  trueResponsive?: string;
  lawyer?: string;
  fullRight?: string;
  fullWrong?: string;
  recovery?: string | null;
  redZone?: DebriefRedZone | null;
}

export interface TriggerFact {
  fact: string;
  role: string;
  use: string;
  type: FactTone;
}

export interface Mold {
  code: string;
  family: string;
  choice: string;
  tone: "bait" | "expanded" | "selfhelp" | "call";
  label: string;
  definition: string;
  tell: string;
}

export interface KeyCard {
  id: string;
  kind: string;
  statement: string;
  unlocks?: string;
  navigates?: string;
  trigger: string;
  testedChoice: string;
  authority?: string;
  outlineCode?: string;
}

export interface DebriefData {
  // identity
  qid: string;
  subject: string;
  topic: string;
  subtopic: string;
  outlineCode: string;
  outlinePath: string;
  difficultyBand: string;
  mechanic: string;
  governingLane: string;

  // verdict
  correctLetter: string;
  dominantTrap: string;
  residual: string;
  callVerb: string;
  /** The relief sought, as a clean verb phrase for inline use (e.g. "terminate the easement"). */
  requestedRelief: string;
  call: string;
  callResolution: string;
  keyLegalQuestion: string;
  distilledCore: string;
  reviewTruth: string;
  prediction: string;
  finalScript: string;
  programFrame: string;

  // Combo B §01 fork branch labels. Data-driven so non-easement items don't read
  // "violation / remedy". Omitted by the fixture → the component's easement
  // defaults render; supplied by the answer-key endpoint for generic questions.
  decoyBranchLabel?: string;
  askedBranchLabel?: string;

  stemSegments: StemSegment[];
  triggerFacts: TriggerFact[];
  choices: DebriefChoice[];
  molds: Mold[];

  // cut → clash → call
  cut: { letter: string; mold: string; note: string }[];
  clash: string;

  // keys
  goldKey: KeyCard;
  silverKey: KeyCard;

  tension: { axis: string; resolver: string };

  remediation: {
    cardId: string;
    title: string;
    signal: string;
    studentMove: string;
    tinyRule: string;
    confidence: string;
    queueTitle: string;
    queueMeta: string;
  };

  redZone: DebriefRedZone;
}
