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
  {
    questionId: "14823",
    transformId: "14823_coastal_bakery",
    title: "Witness Truthfulness: Bias vs. Specific Acts",
    outlineCode: "31010406",
    sourceOutlineCode: "31010406",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "medium_friction",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "After a defendant's opinion character witness testifies that the defendant is honest, which rebuttal item is least likely to be admissible: bias evidence, a specific-act truthfulness attack, the defendant's contrary reputation, or the witness's reputation for untruthfulness?",
    stem:
      "Barnabas is on trial for embezzlement from a small coastal bakery. His first witness, Ruth, the bakery's longtime bookkeeper, testifies that in her opinion Barnabas is honest and trustworthy. The prosecution does not cross-examine Ruth, and she is excused from further attendance. Which rebuttal item is least likely to be admissible?",
    choices: [
      {
        letter: "A",
        text: "Testimony by Barnabas's former business partner that he overheard Ruth offer to provide favorable testimony if Barnabas would pay her $7,500.",
        verdict: "trap",
        mold: "bait_doctrine / bias-as-truthfulness confusion",
        explanation:
          "This is the dominant trap. A pay-for-testimony offer shows bias, motive, or interest to lie. It is not a character-for-truthfulness attack, so the FRE 608(b) extrinsic-evidence bar does not block it.",
      },
      {
        letter: "B",
        text: "Testimony by Ruth's former co-worker that Ruth had submitted fabricated inventory counts eighteen months ago.",
        verdict: "correct",
        mold: "residue / FRE 608(b) extrinsic bar",
        explanation:
          "This is extrinsic evidence of a specific past act offered to attack Ruth's character for truthfulness. FRE 608(b) bars that proof route, so this is the least likely rebuttal item to be admissible.",
      },
      {
        letter: "C",
        text: "Testimony by a sheriff's deputy that Barnabas has a long-standing reputation in the community for dishonesty.",
        verdict: "trap",
        mold: "wrong_element / opened-door rebuttal",
        explanation:
          "Barnabas opened the character door by offering opinion testimony that he is honest. The prosecution may answer with reputation evidence for the opposing trait.",
      },
      {
        letter: "D",
        text: "Testimony by a fellow church choir member that Ruth has a long-standing reputation in the community as an untruthful person.",
        verdict: "trap",
        mold: "wrong_element / witness-off-stand confusion",
        explanation:
          "Reputation or opinion testimony about a witness's character for truthfulness is allowed under FRE 608(a). Ruth does not need to be back on the stand for that witness-reputation proof.",
      },
    ],
    answerFlow: [
      "Lock the call: the question asks for the least likely admissible rebuttal item.",
      "Classify the attack before applying a rule: witness bias, witness truthfulness, defendant character rebuttal, or witness reputation.",
      "Cut A because the $7,500 testimony proves bias or motive, not character for truthfulness.",
      "Cut C because the defendant opened the character door with opinion testimony, allowing opposite-trait reputation rebuttal.",
      "Cut D because FRE 608(a) allows reputation or opinion proof about a witness's truthfulness.",
      "Choose B because it is extrinsic evidence of a specific act offered to attack Ruth's truthfulness, which FRE 608(b) bars.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Use-before-rule: identify what the rebuttal proof is being used to show before naming FRE 608(b).",
      },
      {
        label: "Purple profile",
        body: "The answer set gives three admissible rebuttal routes and one inadmissible truthfulness-specific-act route.",
      },
      {
        label: "Blue signal",
        body: "Money for favorable testimony points to bias or motive; fabricated inventory counts point to character for truthfulness.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every extrinsic witness attack as a FRE 608(b) problem.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-WITNESS-SPECIFIC-ACT-01",
        body: "Extrinsic evidence of a witness's specific acts is not admissible to attack or support the witness's character for truthfulness.",
      },
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-BIAS-MOTIVE-EXTRINSIC-01",
        body: "Bias, motive, or interest to testify in a particular way is separate from character for truthfulness; extrinsic evidence of bias is admissible.",
      },
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-WITNESS-REPUTATION-01",
        body: "A witness's credibility may be attacked by reputation or opinion testimony about the witness's character for truthfulness.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-OPENED-DOOR-01",
        body: "When a defendant opens the character door by opinion testimony, the prosecution may rebut with reputation evidence of the opposite pertinent trait.",
      },
    ],
    leadMeSteps: [
      "Name the witness being attacked before naming the rule.",
      "Sort each rebuttal item into bias, truthfulness reputation, specific truthfulness act, or opened-door character rebuttal.",
      "Say why the money offer is bias, not FRE 608(b).",
      "Say why fabricated inventory counts are specific-act truthfulness evidence.",
      "Pick the only barred proof route and bank the Gold Key.",
    ],
    drillSeeds: [
      {
        title: "Specific Act Bar",
        prompt:
          "A witness is excused. The prosecution offers a former co-worker to prove the witness falsified inventory counts eighteen months ago. Is that admissible to attack truthfulness?",
        answer:
          "No. It is extrinsic evidence of a specific act offered to attack character for truthfulness, so FRE 608(b) bars it.",
      },
      {
        title: "Bias Split",
        prompt:
          "The prosecution offers testimony that a witness requested money in exchange for favorable testimony. Is FRE 608(b) the blocker?",
        answer:
          "No. That proof shows bias, motive, or interest to lie. It is not a character-for-truthfulness specific-act attack.",
      },
      {
        title: "Opened Door",
        prompt:
          "The defendant offers opinion testimony that he is honest. May the prosecution call a reputation witness for dishonesty?",
        answer:
          "Yes. The defendant opened the character door, so the prosecution may rebut with reputation evidence for the opposite pertinent trait.",
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
