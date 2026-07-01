import rawSeedCandidates from "@/lib/jesuslovesyou/evidence-seed-candidates.json";

export type EvidenceSeedCandidate = {
  question_id: string;
  outline_code: string;
  source_outline_code: string;
  coverage_group: string;
  seed_bucket: string;
  correct_percent: string | null;
  key: string | null;
  has_finished_transform: boolean;
  review_status: string;
};

export type EvidenceQuestionDetail = {
  questionId: string;
  transformId: string;
  title: string;
  outlineCode: string;
  sourceOutlineCode: string;
  coverageGroup: string;
  seedBucket: string;
  key: string;
  reviewStatus: string;
  distilledCoreQuestion: string;
  stem: string;
  choices: {
    letter: string;
    text: string;
    verdict: "correct" | "trap";
    mold: string;
    explanation: string;
  }[];
  answerFlow: string[];
  locks: {
    label: string;
    body: string;
  }[];
  keys: {
    kind: "Gold Key" | "Silver Key" | "Trap Key";
    id: string;
    body: string;
  }[];
  leadMeSteps: string[];
  drillSeeds: {
    title: string;
    prompt: string;
    answer: string;
  }[];
};

export const evidenceSeedCandidates =
  rawSeedCandidates as EvidenceSeedCandidate[];

export const evidenceQuestionDetails: EvidenceQuestionDetail[] = [
  {
    questionId: "22198",
    transformId: "22198_antiquarian_smuggler",
    title: "Dying Declaration: Civil-or-Criminal Scope",
    outlineCode: "33040301",
    sourceOutlineCode: "35030200",
    coverageGroup: "hearsay_exception",
    seedBucket: "recode_or_ambiguous",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "In a civil wrongful-death action, a victim's out-of-court statement identifying his assailant, made while believing death was imminent, is offered against the defendant. Is the statement admissible?",
    stem:
      "Paul had been a member of a Mediterranean antiquities-smuggling ring for 20 years. After receiving transactional immunity, he testified against other members and later published a book describing crimes he had committed, including Stephen's death. Stephen's wife Ruth then brought a wrongful-death civil action. At trial, a museum curator testified that just before Stephen died, Stephen said, \"I'm dying. I saw Paul strike me with the statue.\" The jurisdiction has a dead man's statute. If Paul moves to strike the curator's testimony, his motion should be:",
    choices: [
      {
        letter: "A",
        text: "denied, since the jurisdiction has a dead man's statute.",
        verdict: "trap",
        mold: "EAR_FALSITY / flat_misstatement",
        explanation:
          "A dead man's statute is exclusionary, not admission-creating. It is not the reason this statement comes in.",
      },
      {
        letter: "B",
        text: "granted, since Paul received transactional immunity.",
        verdict: "trap",
        mold: "EAR_FALSITY / fabricated_rule",
        explanation:
          "Transactional immunity prevents criminal prosecution by the government. It does not bar a private civil action or decide a hearsay motion.",
      },
      {
        letter: "C",
        text: "denied, since Stephen believed himself to be dying when he made the statement.",
        verdict: "correct",
        mold: "residue / FRE 804(b)(2)",
        explanation:
          "The declarant is unavailable, the statement concerns the cause or circumstances of the believed-impending death, and FRE 804(b)(2) applies in a civil case.",
      },
      {
        letter: "D",
        text: "granted, since a dying declaration is admissible only in a trial for criminal homicide.",
        verdict: "trap",
        mold: "EAR_OVERCLAIM / tiered_absolute",
        explanation:
          "The common-law limit is the trap. FRE 804(b)(2) covers a homicide prosecution or a civil case.",
      },
    ],
    answerFlow: [
      "Lock the forum: this is a civil wrongful-death case.",
      "Lock the hearsay exception: FRE 804(b)(2), statement under belief of imminent death.",
      "Check the elements: unavailable declarant, cause or circumstances of death, belief death was imminent.",
      "Cut the named-fact traps: transactional immunity and dead man's statute do not control admissibility.",
      "Deny the motion to strike.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Element-check FRE 804(b)(2) before reacting to the stem's immunity and statute distractors.",
      },
      {
        label: "Purple profile",
        body: "The answer set surrounds the right hearsay exception with three official-sounding but forum-mismatched reasons.",
      },
      {
        label: "Blue signal",
        body: "The word only in the criminal-homicide choice is trap-side polarity because the FRE expanded the scope.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating named legal phrases as dispositive without asking what each doctrine actually does.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-DYING-DECL-01",
        body: "FRE 804(b)(2) admits a dying declaration in a homicide prosecution or in a civil case. Criminal-homicide-only is the old common-law trap.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-DYING-DECL-01",
        body: "When a stem names a statute, ask what the statute does before accepting the answer choice's use of it.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-IMMUNITY-FORUM-MISMATCH",
        body: "Transactional immunity is a criminal-procedure shield, not a civil evidence rule.",
      },
    ],
    leadMeSteps: [
      "State the forum before naming the exception.",
      "Say the FRE 804(b)(2) scope out loud: homicide prosecution or civil case.",
      "Cross out the choice that says only criminal homicide.",
      "Explain why immunity does not answer a civil evidence question.",
      "Bank the Gold Key and run one scope-flip drill.",
    ],
    drillSeeds: [
      {
        title: "Scope Flip",
        prompt:
          "A student says a dying declaration is admissible only in a homicide prosecution. Correct the rule.",
        answer:
          "Under FRE 804(b)(2), the exception applies in a homicide prosecution or in a civil case.",
      },
      {
        title: "Forum Match",
        prompt:
          "A defendant received transactional immunity, then faces a private wrongful-death suit. Does the immunity decide hearsay admissibility?",
        answer:
          "No. Transactional immunity blocks criminal prosecution by the government; it does not decide a civil hearsay motion.",
      },
      {
        title: "Statute Function",
        prompt:
          "A jurisdiction has a dead man's statute. Does that statute itself make a dying declaration admissible?",
        answer:
          "No. Dead man's statutes are exclusionary. The admission route is FRE 804(b)(2), not the statute.",
      },
    ],
  },
];

export const evidenceQuestionDetailParams = evidenceQuestionDetails.map(
  ({ questionId }) => ({ questionId }),
);

export const evidenceSeedQuestionParams = evidenceSeedCandidates.map(
  ({ question_id: questionId }) => ({ questionId }),
);

export function getEvidenceQuestionDetail(questionId: string) {
  return (
    evidenceQuestionDetails.find((question) => question.questionId === questionId) ??
    null
  );
}

export function getEvidenceSeedCandidate(questionId: string) {
  return (
    evidenceSeedCandidates.find(
      (candidate) => candidate.question_id === questionId,
    ) ?? null
  );
}

export function hasEvidenceQuestionDetail(questionId: string) {
  return evidenceQuestionDetails.some(
    (question) => question.questionId === questionId,
  );
}
