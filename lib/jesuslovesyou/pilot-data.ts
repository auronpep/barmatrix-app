export const JESUSLOVESYOU_ROUTE_PREFIX = "/Jesuslovesyou";

export type PilotCode = {
  code: string;
  node: string;
  role: string;
  lesson: string;
  trap: string;
};

export type PilotSubset = {
  id: string;
  subject: string;
  name: string;
  status: string;
  seedCount: number;
  thesis: string;
  gates: string[];
  coverage: string[];
  codes: PilotCode[];
};

export const pilotSubsets: PilotSubset[] = [
  {
    id: "EVIDENCE-PILOT-01",
    subject: "Evidence",
    name: "Use / Purpose / Witness Attack / Hearsay Gate",
    status: "Seed/detail routes complete locally",
    seedCount: 50,
    thesis:
      "Evidence calibrates the factory first because use, purpose, foundation, witness attack, and hearsay gates produce strong answer-flow and LeadMe cards.",
    gates: [
      "Use before meaning",
      "Witness attack classification",
      "FRE 104(a)/(b) decisionmaker",
      "403 and policy-purpose routing",
      "Hearsay exception availability",
    ],
    coverage: [
      "5 witness truthfulness or bias items",
      "5 non-hearsay purpose items",
      "5 FRE 403, insurance, or policy-purpose items",
      "5 hearsay exception items",
      "5 preliminary question judge/jury items",
    ],
    codes: [
      {
        code: "33040203",
        node: "Hearsay > Hearsay Exemptions > Statements used for non-hearsay purposes",
        role: "Primary Use Before Meaning node",
        lesson: "Ask what the statement is being used to prove before calling it hearsay.",
        trap: "Treating every out-of-court statement as hearsay without checking purpose.",
      },
      {
        code: "31010406",
        node: "Presentation of Evidence > Witnesses > Truthfulness",
        role: "Witness attack classification",
        lesson: "Classify whether the attack is character for truthfulness, contradiction, bias, or capacity.",
        trap: "Overusing FRE 608(b) when the actual attack is not truthfulness.",
      },
      {
        code: "31010503",
        node: "Presentation of Evidence > Impeachment > Bias",
        role: "Bias versus 608(b) guardrail",
        lesson: "Bias is always relevant to credibility and is not capped by the same character-for-truthfulness box.",
        trap: "Rejecting bias proof because it looks like an extrinsic-act impeachment problem.",
      },
      {
        code: "31010107",
        node: "Presentation of Evidence > General Provisions > Preliminary questions",
        role: "104(a)/(b) gate",
        lesson: "Decide whether the judge resolves admissibility or only screens a conditional fact for the jury.",
        trap: "Sending a FRE 104(a) admissibility ruling to the jury because facts are disputed.",
      },
      {
        code: "32020302",
        node: "Relevance > Exclusion of Relevant Evidence > Discretionary exclusion",
        role: "403 balancing and insurance purpose traps",
        lesson: "Relevant evidence can still lose when unfair prejudice or waste substantially outweighs value.",
        trap: "Making 403 a simple relevance test instead of a weighted exclusion rule.",
      },
      {
        code: "32020404",
        node: "Relevance > Character Evidence > Specific acts for noncharacter purposes",
        role: "MIMIC purpose board",
        lesson: "Specific acts can come in for a real noncharacter purpose when the chain does not rely on propensity.",
        trap: "Calling every prior act propensity even when motive, intent, or identity is doing the work.",
      },
      {
        code: "33040301",
        node: "Hearsay > Hearsay Exceptions > Requiring unavailability of declarant",
        role: "Dying declaration and unavailable declarant gates",
        lesson: "Check unavailability first, then match the exception's required subject matter and posture.",
        trap: "Using an unavailable-declarant exception without proving the declarant is unavailable.",
      },
      {
        code: "33040302",
        node: "Hearsay > Hearsay Exceptions > Not requiring unavailability of declarant",
        role: "Recorded recollection and recurring exception contrasts",
        lesson: "Some exceptions work whether or not the declarant is available; do not add a missing condition.",
        trap: "Rejecting a valid exception because the declarant could testify.",
      },
      {
        code: "35030304",
        node: "Privileges and Public Policy Exclusions > Public Policy Exclusions > Liability insurance",
        role: "Insurance policy exclusion versus relevance purpose",
        lesson: "Insurance evidence is barred for fault but may be used for ownership, control, bias, or another proper purpose.",
        trap: "Treating the insurance rule as an absolute privilege instead of a purpose-limited exclusion.",
      },
      {
        code: "31010407",
        node: "Presentation of Evidence > Witnesses > Refreshing recollection",
        role: "Refresh recollection versus recorded recollection",
        lesson: "Refreshing recollection uses a prompt to revive memory; recorded recollection substitutes a record when memory stays weak.",
        trap: "Reading the writing into evidence just because it refreshed the witness.",
      },
    ],
  },
  {
    id: "CONLAW-PILOT-01",
    subject: "Constitutional Law",
    name: "Actor / Source / Rights Gate",
    status: "Seed/detail routes complete locally",
    seedCount: 30,
    thesis:
      "Con Law tests actor, source, posture, forum, and tier gates after the Evidence pipeline proves the content factory.",
    gates: [
      "State action before merits",
      "Private actor decoys",
      "Due process versus equal protection routing",
      "Speech forum and tier sequence",
      "Standing, ripeness, and mootness overlay",
    ],
    coverage: [
      "5 state action items",
      "5 First Amendment speech/forum items",
      "5 free exercise items",
      "5 due process/equal protection routing items",
      "5 standing/ripeness/mootness gate items",
    ],
    codes: [
      {
        code: "44040100",
        node: "Individual Rights > State Action Requirement",
        role: "Pure threshold gate",
        lesson: "Find a government actor or sufficient state involvement before reaching constitutional merits.",
        trap: "Treating private unfairness as a constitutional violation.",
      },
      {
        code: "44040502",
        node: "Individual Rights > First Amendment Protections > Freedom of speech and expression",
        role: "Forum, permit, and scrutiny routing",
        lesson: "Classify the forum and content status before choosing the scrutiny rule.",
        trap: "Jumping to strict scrutiny before the forum gate is settled.",
      },
      {
        code: "44040501",
        node: "Individual Rights > First Amendment Protections > Freedom of religion",
        role: "Neutral law and targeting guardrail",
        lesson: "Separate neutral generally applicable rules from rules that target religious conduct.",
        trap: "Turning every religious burden into strict scrutiny.",
      },
      {
        code: "44040300",
        node: "Individual Rights > Equal Protection Clause",
        role: "Classification and tier routing",
        lesson: "Identify the classification and actor source before picking the review tier.",
        trap: "Confusing equal protection classification with substantive due process liberty.",
      },
      {
        code: "44040200",
        node: "Individual Rights > Due Process Clause",
        role: "Clause-routing pair with equal protection",
        lesson: "Ask whether the claim is about process, a protected liberty/property interest, or classification.",
        trap: "Calling every rights claim equal protection when no classification drives the injury.",
      },
      {
        code: "43020201",
        node: "Judicial Review > Jurisdiction of Courts > Constitutional limitations and justiciability",
        role: "Small threshold gate overlay",
        lesson: "Standing, ripeness, mootness, and political question can stop the case before merits.",
        trap: "Answering the constitutional merits when the court cannot hear the claim.",
      },
    ],
  },
];

export const pipelineSteps = [
  "Source row normalizer",
  "Outline-code validator",
  "C3 scaffold trace",
  "Choice forensics",
  "Color locks",
  "Designed decoy profile",
  "Answer explanation page v7",
  "Christian transform after invariants lock",
  "QA promotion",
];

export const lockedSemantics = [
  {
    label: "Red",
    body: "Correct reasoning move. The student learns the action that wins the item.",
  },
  {
    label: "Purple",
    body: "Wrong-answer-set ecology. The system names how the trap array is built.",
  },
  {
    label: "Blue",
    body: "Answer-choice signal and polarity. The signal can point toward the key or toward a trap.",
  },
  {
    label: "Orange",
    body: "Student miss habit or designed decoy habit. This is routed to repair work.",
  },
];

export const firstDeliverables = [
  "Evidence question inventory",
  "Evidence golden seed set",
  "Evidence keys and trap keys",
  "Evidence Outline Atlas nodes",
  "Evidence LeadMe cards",
  "Evidence answer-flow examples",
  "Evidence QA report",
];

export function getEvidencePilotCode(code: string): PilotCode | null {
  return pilotSubsets[0].codes.find((item) => item.code === code) ?? null;
}

export const evidencePilotCodeParams = pilotSubsets[0].codes.map(({ code }) => ({
  code,
}));

export function getConLawPilotCode(code: string): PilotCode | null {
  return pilotSubsets[1].codes.find((item) => item.code === code) ?? null;
}

export const conLawPilotCodeParams = pilotSubsets[1].codes.map(({ code }) => ({
  code,
}));

export const evidencePilotPageModules = [
  {
    label: "Annotated Solve Board",
    body: "Renders call lock, stem annotations, solve steps, answer decode, color strip, bank-it line, and repair prompt from validated scaffold data.",
  },
  {
    label: "Choice Decode",
    body: "Names the broken filter, why the choice looked attractive, why it loses, and which method class should repair it.",
  },
  {
    label: "Trap Key Module",
    body: "Appears when the selected wrong answer or an adjacent repair cell maps to an unseen high-priority Trap Key.",
  },
  {
    label: "Gold / Silver Key Module",
    body: "Stores reusable winning moves after the legal invariant layer is locked.",
  },
];

export const evidenceLeadMeRun = {
  moduleId: "leadme_evidence_104a_001",
  title: "Roles of Judge and Jury LeadMe",
  targetReason: "Repair decisionmaker inversion in Evidence preliminary admissibility.",
  tasks: [
    "Offer It First",
    "Judge decides FRE 104(a)",
    "Trap Key: jury decides because facts are disputed",
    "Roles of Judge and Jury Q1",
    "State the gate",
  ],
};

export const evidenceOutlineNode = {
  displayCode: "3.01.01.01.00.00",
  legacyOutlineCode: "31010101",
  title: "Roles of Judge and Jury",
  path: "Evidence > Presentation of Evidence > General Provisions > Roles of judge and jury",
  anchors: [
    "FRE 104(a): court decides preliminary admissibility questions and is not bound by evidence rules except privilege.",
    "FRE 104(b): court screens whether a reasonable jury could find a conditional fact; jury ultimately decides.",
  ],
  trapSummary: "Decisionmaker inversion: treating a judge question as a jury question.",
  linkedAssets: [
    "q_evid_104a_001",
    "GK-EVIDENCE-FRE104A-JUDGE",
    "TK-EVIDENCE-JURY-DISPUTED-FACTS",
    "drill_roles_judge_jury_5q",
  ],
};
