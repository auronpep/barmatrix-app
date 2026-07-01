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
  {
    questionId: "14824",
    transformId: "14824_banner_drone",
    title: "Preliminary Questions: Judge May Consider Hearsay",
    outlineCode: "31010107",
    sourceOutlineCode: "31010107",
    coverageGroup: "preliminary_question_judge_jury",
    seedBucket: "medium_friction",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A party offers a doctor's affidavit only to help the judge decide whether a dying statement is admissible. May the judge consider the hearsay affidavit?",
    stem:
      "At a private Christian makers' fair, Hannah is struck by a banner drone after Timothy launches it toward the exhibit hall. Hannah later dies, and Lydia, Hannah's executor, sues Timothy for wrongful death. At trial, Lydia calls Ruth, a nurse, to testify that the next morning Hannah said Timothy launched the drone after the marshal dropped the landing flag. To lay the foundation for Hannah's statement, Lydia offers the court Dr. Luke's affidavit stating that Hannah had said several times that she knew she was about to die. Is the affidavit properly considered by the court in ruling on the admissibility of Hannah's statement?",
    choices: [
      {
        letter: "A",
        text: "No, because statements made under belief of imminent death may be used only in prosecutions for homicide.",
        verdict: "trap",
        mold: "tiered_absolute / civil-case overclaim",
        explanation:
          "This over-tightens the dying-declaration exception. Under the federal rule, a dying declaration may apply in a homicide prosecution or in a civil case.",
      },
      {
        letter: "B",
        text: "Yes, because the judge may consider hearsay in ruling on preliminary questions.",
        verdict: "correct",
        mold: "residue / FRE 104(a) layer lock",
        explanation:
          "The affidavit is foundation material for the judge's admissibility ruling, not ordinary merits evidence for the jury. Under FRE 104(a), the judge is not bound by evidence rules except privilege.",
      },
      {
        letter: "C",
        text: "No, because the affidavit is hearsay and no hearsay exception covers it.",
        verdict: "trap",
        mold: "bait_doctrine / exception hunt",
        explanation:
          "This is the dominant trap. It treats the affidavit like trial evidence and starts hunting for a hearsay exception, but the call asks what the judge may consider while deciding admissibility.",
      },
      {
        letter: "D",
        text: "Yes, because, although hearsay, the affidavit is a statement of then-existing mental condition.",
        verdict: "trap",
        mold: "bait_doctrine / right-result-wrong-reason",
        explanation:
          "The yes result is right, but the reason is wrong. The affidavit is considered because of the preliminary-question rule, not because the affidavit itself fits the mental-condition exception.",
      },
    ],
    answerFlow: [
      "Lock the layer: the affidavit is offered to the court for an admissibility ruling.",
      "Apply FRE 104(a): the judge decides preliminary questions and is not bound by evidence rules except privilege.",
      "Cut C because the affidavit does not need a hearsay exception at this layer.",
      "Cut D because a right yes/no result with the wrong hearsay-exception reason is still wrong.",
      "Cut A because the federal dying-declaration exception is not limited to homicide prosecutions.",
      "Choose B because the judge may consider hearsay while ruling on the preliminary admissibility question.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Layer before label: ask whether the evidence is for the judge's preliminary ruling before asking for a hearsay exception.",
      },
      {
        label: "Purple profile",
        body: "The answer set surrounds the Rule 104(a) answer with a hearsay-exception hunt, a scope overclaim, and a right-result-wrong-reason choice.",
      },
      {
        label: "Blue signal",
        body: "The phrase considered by the court in ruling on admissibility points to the judge's preliminary-question layer.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every hearsay-looking document as jury evidence that needs its own exception.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PRELIM-HEARSAY-01",
        body: "For a preliminary admissibility question, the judge may consider hearsay; FRE 104(a) frees the court from the evidence rules except privilege.",
      },
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-DYING-CIVIL-02",
        body: "A federal dying declaration is not limited to homicide prosecutions; it may also apply in a civil case when the declarant is unavailable and believed death was imminent.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BANNER-DRONE-01",
        body: "Lock the layer: the call asks what the judge may consider while ruling, not whether the affidavit is admissible to the jury.",
      },
    ],
    leadMeSteps: [
      "Circle the words court and ruling on admissibility.",
      "Say who is using the affidavit: the judge, not the jury.",
      "Name FRE 104(a) before any hearsay exception.",
      "Reject the answer that needs an exception for the affidavit.",
      "Check the word only in the homicide-prosecution choice.",
      "Pick the answer that explains the preliminary-question layer.",
    ],
    drillSeeds: [
      {
        title: "Layer Lock",
        prompt:
          "A party offers a hearsay affidavit only to help the judge decide admissibility. May the judge consider it?",
        answer:
          "Yes. Under FRE 104(a), the judge is not bound by evidence rules except privilege when deciding preliminary questions.",
      },
      {
        title: "Exception Hunt",
        prompt:
          "The call asks whether the court may consider a foundation affidavit. Should you first hunt for a hearsay exception?",
        answer:
          "No. First lock the preliminary-admissibility layer. FRE 104(a) controls what the judge may consider.",
      },
      {
        title: "Scope Word",
        prompt:
          "A choice says dying declarations are usable only in homicide prosecutions. What breaks that choice under the federal rule?",
        answer:
          "The federal dying-declaration exception also reaches civil cases.",
      },
    ],
  },
  {
    questionId: "14763",
    transformId: "14763_puppet_camp_notice",
    title: "Non-Hearsay Purpose: Notice Is Not Truth",
    outlineCode: "33040203",
    sourceOutlineCode: "33040203",
    coverageGroup: "non_hearsay_purpose",
    seedBucket: "hard_or_high_pick_rate_trap",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A business offers a copy of a notice letter and routine-practice testimony only to prove that notice was given. Is the copy admissible?",
    stem:
      "Martha's MannaMakers, a private Christian puppet troupe, sues Daniel's privately owned Bible-memory camp for unpaid prop-and-travel add-ons under an expense-plus performance agreement. The agreement allowed reimbursement for materials not listed in the estimate only if the troupe first sent Daniel a written add-on notice. Daniel says he never received the required notice. At trial, Naomi, the troupe's booking coordinator, testifies that the troupe routinely sends add-on notices the same day they are approved. Naomi also offers a photocopy of the add-on notice letter to Daniel from the troupe's regular booking files. On the issue of giving notice, the letter copy is:",
    choices: [
      {
        letter: "A",
        text: "inadmissible, because it is hearsay not within any exception.",
        verdict: "trap",
        mold: "wrong_element / exception layer",
        explanation:
          "This answers a hearsay-exception question, but the call is notice. The letter is offered to show notice was given, not to prove the truth of the add-on details.",
      },
      {
        letter: "B",
        text: "inadmissible, because it is not the best evidence of the notice.",
        verdict: "trap",
        mold: "misfit / photocopy panic",
        explanation:
          "The photocopy is bait. The active question is not proving the exact terms of the writing; it is whether the notice event occurred.",
      },
      {
        letter: "C",
        text: "admissible, because of the routine practices of the troupe.",
        verdict: "correct",
        mold: "residue / notice non-hearsay",
        explanation:
          "The copy is offered on the issue of notice, not for the truth of its contents. The routine-practice evidence also supports the inference that the troupe acted in its usual way.",
      },
      {
        letter: "D",
        text: "admissible, though hearsay, under the business record exception.",
        verdict: "trap",
        mold: "bait_doctrine / right-result-wrong-route",
        explanation:
          "This was the dominant trap. It admits the copy but calls it hearsay and routes through business records. The better threshold answer is that notice use is not truth use.",
      },
    ],
    answerFlow: [
      "Lock the offered purpose: the letter copy is offered on the issue of giving notice.",
      "Ask whether the letter is offered for the truth of its contents. It is not.",
      "Use the routine-practice fact to support the inference that the notice was sent.",
      "Cut D because a hearsay exception is unnecessary when the item is not hearsay.",
      "Cut B because the original-document rule is not the active frame for notice use.",
      "Choose C because notice purpose plus routine practice supplies the admissibility route.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose before exception: identify notice use before naming business records.",
      },
      {
        label: "Purple profile",
        body: "The answer set creates an admit/admit clash between the non-hearsay notice route and the business-records route.",
      },
      {
        label: "Blue signal",
        body: "On the issue of giving notice points away from truth use and toward the event of notice.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every file copy from regular records as a business-records exception problem.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-NOTICE-NONHEARSAY-01",
        body: "A letter offered to prove that notice was sent or received is not offered for the truth of the letter's contents. Do not use a hearsay exception when the offered purpose is notice rather than truth.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-NONHEARSAY-THRESHOLD-01",
        body: "Before picking a hearsay exception, ask whether the evidence is hearsay at all. In a notice-use question, the threshold answer beats an exception answer.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-BUSINESS-RECORDS-OVERUSE",
        body: "Regular files and routine office practice can make business-records language tempting, but a non-hearsay purpose does not need a hearsay exception.",
      },
    ],
    leadMeSteps: [
      "Underline on the issue of giving notice.",
      "Say the offered purpose in six words: prove notice, not letter truth.",
      "Decide hearsay threshold before exception.",
      "Reject the business-records route as a right-result-wrong-route trap.",
      "Check whether the photocopy objection is actually proving contents.",
      "Pick the routine-practice/non-hearsay answer.",
    ],
    drillSeeds: [
      {
        title: "Purpose Pin",
        prompt:
          "A copy of a letter is offered only to show that notice was sent. Hearsay or not hearsay?",
        answer:
          "Not hearsay. It is offered to show notice, not the truth of the letter's contents.",
      },
      {
        title: "Threshold Before Exception",
        prompt:
          "Cut or keep: admissible, though hearsay, under the business-records exception.",
        answer:
          "Cut for wrong route when the purpose is notice. The threshold answer is non-hearsay.",
      },
      {
        title: "Photocopy Panic",
        prompt:
          "A photocopy is offered to show notice was given. Does the original-document rule automatically exclude it?",
        answer:
          "No. Do not use the original-document rule unless the contents are being proved or authenticity/fairness is contested.",
      },
    ],
  },
  {
    questionId: "14772",
    transformId: "14772_fishing_vessel_log",
    title: "Non-Hearsay Purpose: Identity from a Name",
    outlineCode: "33040203",
    sourceOutlineCode: "33040203",
    coverageGroup: "non_hearsay_purpose",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A missing person told his heir a pseudonym he intended to use. That pseudonym later appeared on a passenger log for a vessel that disappeared. Is testimony about the conversation admissible?",
    stem:
      "Daniel, a well-known Christian documentary filmmaker, held a life insurance policy naming his daughter Esther as beneficiary. Daniel disappeared from a small coastal town two years ago and has not been heard from since. On the day he vanished, a fishing trawler that departed from the town's only working harbor disappeared at sea. The vessel's log listed a passenger under a name that shared Daniel's first name but used a different surname. Esther sues the insurer for the policy proceeds. At trial, Esther offers to testify that Daniel told her he planned to use that same pseudonym when filming an undercover documentary in remote fishing communities. Esther's testimony is:",
    choices: [
      {
        letter: "A",
        text: "Inadmissible as a party admission, because Daniel's out-of-court statement to Esther binds him as a party.",
        verdict: "trap",
        mold: "misfit / party-admission shortcut",
        explanation:
          "Daniel is not the opposing party in Esther's suit against the insurer, and the statement does not need a party-admission route because it is not hearsay at the threshold.",
      },
      {
        letter: "B",
        text: "Inadmissible, because it is hearsay not within any exception.",
        verdict: "trap",
        mold: "flat_misstatement / auto-hearsay stamp",
        explanation:
          "This is the dominant trap. The testimony is not offered to prove Daniel truly planned a documentary; it is offered to connect Daniel to the name on the trawler log.",
      },
      {
        letter: "C",
        text: "Admissible as circumstantial evidence that Daniel was on the trawler.",
        verdict: "correct",
        mold: "residue / identity inference",
        explanation:
          "The statement is offered for a non-truth purpose: it links Daniel to the pseudonym found in the log. That identity inference makes it relevant circumstantial evidence, not hearsay.",
      },
      {
        letter: "D",
        text: "Inadmissible, because Daniel has not been missing for more than seven years.",
        verdict: "trap",
        mold: "fabricated_rule / imported threshold",
        explanation:
          "Any missing-person presumption is a different doctrine. The length of Daniel's disappearance does not decide whether the statement is hearsay.",
      },
    ],
    answerFlow: [
      "Identify the fact Esther needs to prove: Daniel's connection to the trawler name.",
      "Ask whether Daniel's statement is offered to prove its content. It is not.",
      "Use the statement as circumstantial evidence linking Daniel to the passenger log.",
      "Cut B because the auto-hearsay label skips the purpose-of-offer test.",
      "Cut A because Daniel is not the opposing party and the admission route is unnecessary.",
      "Choose C because the statement is non-hearsay identity evidence.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose before label: name the fact the statement is being used to prove before calling it hearsay.",
      },
      {
        label: "Purple profile",
        body: "The answer set contrasts identity inference against auto-hearsay, party-admission shortcutting, and an imported seven-year rule.",
      },
      {
        label: "Blue signal",
        body: "The pseudonym appearing elsewhere in the facts turns the statement into a connection clue, not proof of documentary plans.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: stamping every out-of-court statement as hearsay before asking why it is offered.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-NONHEARSAY-PURPOSE-01",
        body: "An out-of-court statement is not hearsay when offered to prove the speaker's connection to a name, event, or circumstance rather than the truth of what was said.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-OF-OFFER-01",
        body: "Before applying any hearsay label, name the precise fact the proponent wants to prove with the statement.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-AUTO-HEARSAY-STAMP",
        body: "Out-of-court statement is only the start of hearsay analysis. The truth purpose must also be present.",
      },
    ],
    leadMeSteps: [
      "State the exact fact Esther needs: Daniel was the person using the log name.",
      "Separate that fact from the statement's literal content.",
      "Classify the statement as identity-link circumstantial evidence.",
      "Reject the hearsay-not-within-exception choice.",
      "Reject party admission unless the declarant is the opposing party or agent.",
      "Pick the non-hearsay identity inference answer.",
    ],
    drillSeeds: [
      {
        title: "Purpose Identification",
        prompt:
          "A witness says the defendant once said, 'I keep a spare key under the mat.' It is offered to prove the burglar had access. Hearsay?",
        answer:
          "No. It is offered to prove access as a circumstance, not to prove the truth of the statement itself.",
      },
      {
        title: "Party Admission Check",
        prompt:
          "A plaintiff's mother made an out-of-court statement. The plaintiff offers it against the defendant. Is it automatically a party admission?",
        answer:
          "No. Party admission requires the declarant to be the opposing party or an authorized/adopted/agent speaker.",
      },
      {
        title: "Auto-Hearsay Brake",
        prompt:
          "A declarant's statement is offered to show the speaker was connected to a place or name, not to prove the statement's contents. Hearsay?",
        answer:
          "No. That is a non-truth purpose under FRE 801(c).",
      },
    ],
  },
  {
    questionId: "14778",
    transformId: "14778_retreat_loading_warning",
    title: "Non-Hearsay Purpose: Reason for Refusal",
    outlineCode: "33040203",
    sourceOutlineCode: "33040203",
    coverageGroup: "non_hearsay_purpose",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "If a hiring defendant offers a former supervisor's warning only to explain why he refused to hire the plaintiff, is the warning hearsay or admissible for the hiring reason?",
    stem:
      "Naomi sued Peter under an age discrimination statute, alleging that Peter refused to hire her for a dawn loading-crew job at his private Christian retreat-supply company because she was 67. Peter's defense was that he refused to employ Naomi because he reasonably believed that she could not safely complete the physical shift. Peter seeks to testify that Ruth, Naomi's former supervisor at a hymnbook bindery, warned him not to hire Naomi because Naomi could not keep up with lifting packed hymnals onto delivery carts for an entire predawn route. The testimony of Peter is:",
    choices: [
      {
        letter: "A",
        text: "Admissible as evidence that Naomi could not keep up with lifting packed hymnals for an entire predawn route.",
        verdict: "trap",
        mold: "half_truth / wrong-purpose admissibility",
        explanation:
          "A reaches the word admissible but uses the warning to prove Naomi's actual work capacity. The admissible purpose is Peter's reason, not the truth of Ruth's assertion.",
      },
      {
        letter: "B",
        text: "Inadmissible, because Ruth's warning is hearsay not within any exception.",
        verdict: "trap",
        mold: "bait_doctrine / hearsay-exception reflex",
        explanation:
          "This is the dominant trap. No hearsay exception is needed when the warning is offered for its effect on Peter and his reason for refusing to hire Naomi.",
      },
      {
        letter: "C",
        text: "Admissible as evidence of Peter's reason for refusing to hire Naomi.",
        verdict: "correct",
        mold: "residue / listener-reason purpose",
        explanation:
          "Peter is not offering the warning to prove Naomi actually lacked endurance. He is offering it to show what he heard and why he acted, so the hearsay rule is not triggered.",
      },
      {
        letter: "D",
        text: "Inadmissible, because Peter's view of Naomi's abilities is not based on personal knowledge.",
        verdict: "trap",
        mold: "misfit / personal-knowledge misframe",
        explanation:
          "Peter does not need personal knowledge of Naomi's actual lifting ability for this purpose. He has personal knowledge that he received the warning and that it affected his decision.",
      },
    ],
    answerFlow: [
      "Identify the consequential fact: Peter's asserted reason for refusing to hire Naomi.",
      "Ask why Ruth's warning is offered. It is offered to show Peter's reason, not to prove Naomi's actual ability.",
      "Classify the warning as a non-hearsay listener-reason use.",
      "Cut B because the hearsay-exception reflex skips the truth-purpose threshold.",
      "Cut A because it converts the warning into proof of the asserted work-capacity fact.",
      "Cut D because Peter can testify to what he heard and why he acted.",
      "Choose C because the warning explains Peter's hiring decision.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose of offer controls: reason-for-action use is different from truth-of-warning use.",
      },
      {
        label: "Purple profile",
        body: "The answer set surrounds the correct listener-reason route with a hearsay-exception trap, a truth-purpose trap, and a personal-knowledge misframe.",
      },
      {
        label: "Blue signal",
        body: "Peter's defense makes his reason consequential, so what he heard before deciding matters even if Ruth's assertion might be false.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: hunting hearsay exceptions before asking whether the statement is offered for truth.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-NONHEARSAY-PURPOSE-01",
        body: "An out-of-court statement is hearsay only when offered for its truth. If it is offered to show its effect on the listener or the listener's reason for acting, no hearsay exception is needed.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-OF-OFFER-01",
        body: "When answer choices split between truth of the assertion and reason for the action, name the purpose-of-offer axis before deciding hearsay.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-HEARSAY-EXCEPTION-REFLEX",
        body: "Do not hunt hearsay exceptions until the statement is actually offered for truth. A listener-reason use can stop at non-hearsay.",
      },
    ],
    leadMeSteps: [
      "Name Peter's defense: he refused to hire Naomi for a reason other than age.",
      "Separate that reason from the truth of Ruth's warning.",
      "Ask whether the warning is offered for truth before applying any hearsay exception.",
      "Reject the choice that admits the warning as proof of Naomi's actual ability.",
      "Reject the personal-knowledge objection because Peter can testify to receiving the warning and acting on it.",
      "Pick the reason-for-refusal answer.",
    ],
    drillSeeds: [
      {
        title: "Purpose Sort",
        prompt:
          "A witness repeats a warning to explain why she cancelled a contract. Is the warning offered for truth or effect on listener?",
        answer:
          "Effect on listener if offered only to explain the cancellation.",
      },
      {
        title: "Two-Answer Clash",
        prompt:
          "Two choices say a warning is admissible. One says it proves the warning true; one says it explains the listener's action. Which survives?",
        answer: "The listener-action purpose survives.",
      },
      {
        title: "Personal Knowledge Target",
        prompt:
          "A decisionmaker did not personally observe a worker's ability, but heard a warning and acted on it. What does personal knowledge need to cover?",
        answer:
          "The decisionmaker needs personal knowledge of receiving the warning and of the decision process, not firsthand knowledge that the warning was true.",
      },
    ],
  },
  {
    questionId: "14808",
    transformId: "14808_christian-radio-dispatch",
    title: "Non-Hearsay Purpose: Effect on the Listener",
    outlineCode: "33040203",
    sourceOutlineCode: "33040203",
    coverageGroup: "non_hearsay_purpose",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A defendant offers three pieces of evidence to show what description the arresting officer heard, not whether the description was accurate. Which items are admissible?",
    stem:
      "Peter sued a county sheriff's deputy for false arrest. The deputy's defense was that, based on a suspect description he heard over the sheriff's radio, he reasonably believed Peter was the person who had robbed a convenience store. A radio dispatcher at the sheriff's office, reading from a written note, had broadcast the robbery suspect's description over the radio. The deputy offers three items as evidence: the deputy's testimony relating the description he heard, the dispatcher's testimony relating the description he read over the radio, and the written note containing the description the dispatcher testifies he read over the radio. Which of the items are admissible on the issue of what description the deputy heard?",
    choices: [
      {
        letter: "A",
        text: "Only the deputy's testimony and the dispatcher's testimony.",
        verdict: "trap",
        mold: "EAR_FALSITY / half_truth",
        explanation:
          "A correctly admits both witnesses' testimony but wrongly excludes the note. The note is offered to show what was communicated, not to prove that the description was accurate.",
      },
      {
        letter: "B",
        text: "Only the dispatcher's testimony and the written note.",
        verdict: "trap",
        mold: "EAR_FALSITY / half_truth",
        explanation:
          "B correctly admits the dispatcher evidence but wrongly excludes the deputy's own testimony. The deputy's testimony is direct evidence of what he heard and how it affected him.",
      },
      {
        letter: "C",
        text: "All three items offered by the deputy.",
        verdict: "correct",
        mold: "residue / all-inclusive non-hearsay purpose",
        explanation:
          "All three items are admissible because they are offered to show what description reached the deputy, not to prove that the suspect actually matched the description.",
      },
      {
        letter: "D",
        text: "Only the deputy's testimony relating the description he heard.",
        verdict: "trap",
        mold: "ISSUE_SENSE / under-inclusion",
        explanation:
          "This is the dominant trap. The effect-on-listener doctrine is not limited to the listener's own testimony; the dispatcher testimony and note also show what was communicated.",
      },
    ],
    answerFlow: [
      "Lock the call phrase: on the issue of what description the deputy heard.",
      "Separate what the deputy heard from whether the robbery description was true.",
      "Classify each item as evidence of the communication and its effect on the listener.",
      "Keep the deputy's testimony because he can testify to what he heard.",
      "Keep the dispatcher's testimony because it shows what was broadcast.",
      "Keep the written note because it is not offered to prove the truth or terms of the writing.",
      "Choose C because every item is admissible for the limited non-hearsay purpose.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Truth purpose versus listener-effect purpose decides the hearsay issue before any exception analysis.",
      },
      {
        label: "Purple profile",
        body: "Every wrong answer under-includes by excluding one admissible item from the same communication chain.",
      },
      {
        label: "Blue signal",
        body: "The call asks what description the deputy heard, which makes the broadcast's effect on the deputy the proof target.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: applying the best evidence rule to a writing without asking whether its terms are being proved.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-EFFECT-ON-LISTENER-01",
        body: "An out-of-court statement offered to show its effect on the person who heard it is not hearsay because it is not offered for the truth of the matter asserted.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-CALL-LOCK-01",
        body: "When the call asks what a person heard, use that phrase as the purpose filter. Every item offered to show what was heard can come in for that limited purpose.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-BEST-EVIDENCE-OVERSCOPE",
        body: "The best evidence rule applies when proving the terms of a writing. It does not exclude a note offered only to show what was communicated.",
      },
    ],
    leadMeSteps: [
      "Circle the call phrase: what description the deputy heard.",
      "Ask whether the evidence proves the robber's actual description or the deputy's reasonable belief.",
      "Admit the deputy's testimony as firsthand evidence of what he heard.",
      "Admit the dispatcher's testimony as evidence of what was broadcast.",
      "Admit the note because it shows what was read, not whether the description was true.",
      "Reject every answer that leaves out one admissible item.",
      "Pick the all-three answer.",
    ],
    drillSeeds: [
      {
        title: "Effect Classification",
        prompt:
          "A witness repeats a manager's warning to prove the store had notice of a wet floor. Is the warning hearsay?",
        answer:
          "No, if it is offered to show notice or effect on the listener rather than the truth of the warning.",
      },
      {
        title: "Best Evidence Scope",
        prompt:
          "A note is offered to show what was communicated, not to prove the note's terms as true. Does the original-document rule automatically bar it?",
        answer:
          "No. The rule applies when the proponent is proving the contents or terms of the writing.",
      },
      {
        title: "Under-Inclusion Cut",
        prompt:
          "An answer admits the listener's testimony but excludes the speaker's testimony and the note used by the speaker. What is wrong?",
        answer:
          "It under-includes. All three can be admissible when each is offered to show what was heard.",
      },
    ],
  },
  {
    questionId: "14836",
    transformId: "14836_picnic_alibi",
    title: "Witness Truthfulness: Extrinsic Evidence Bar",
    outlineCode: "31010406",
    sourceOutlineCode: "31010406",
    coverageGroup: "witness_truthfulness",
    seedBucket: "clean_teaching",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A witness's credibility is attacked by a separate witness's testimony about a specific prior false statement on an application. Is that extrinsic evidence admissible to attack truthfulness?",
    stem:
      "At the defendant's trial for embezzlement from her church, one of the defendant's friends supported the defendant's alibi that they were planning the church's annual picnic together on the morning of the alleged theft. On cross-examination, the friend was asked whether her statement on a small-business loan application that she had been continuously self-employed as a freelance bookkeeper for the past eight years was false. The friend denied that the statement was false. The prosecutor then calls a witness, a loan officer who processed the application, to testify that although the friend had been self-employed for the first two and the most recent four of those years, there had been a two-year period during which she had not been self-employed at all. The testimony of the witness is:",
    choices: [
      {
        letter: "A",
        text: "Inadmissible, because whether the friend lied in her application is a matter that cannot be proved by extrinsic evidence.",
        verdict: "correct",
        mold: "residue / FRE 608(b) extrinsic-evidence bar",
        explanation:
          "FRE 608(b) bars extrinsic evidence of specific instances offered to attack a witness's character for truthfulness. The prosecutor left cross-examination and called a separate witness.",
      },
      {
        letter: "B",
        text: "Admissible, in the judge's discretion, because the friend's credibility is a fact of major consequence to the case.",
        verdict: "trap",
        mold: "EAR_FALSITY / wrong balancing frame",
        explanation:
          "This is the dominant trap. The judge has discretion over cross-examination inquiry, not over admitting extrinsic proof barred by FRE 608(b).",
      },
      {
        letter: "C",
        text: "Inadmissible, because the misstatement by the friend could have been caused by a misunderstanding of the application form.",
        verdict: "trap",
        mold: "EAR_DISTORTION / right verdict wrong reason",
        explanation:
          "C reaches the right bottom-line word but gives a common-sense speculation instead of the rule. The legal reason is the extrinsic-evidence bar.",
      },
      {
        letter: "D",
        text: "Admissible, as a matter of right, because the friend opened the door by her denial on cross-examination.",
        verdict: "trap",
        mold: "EAR_FALSITY / open-the-door overreach",
        explanation:
          "The denial may permit further cross-examination. It does not open the door to a separate witness proving the specific instance.",
      },
    ],
    answerFlow: [
      "Identify the attack: a specific prior false statement used to attack truthfulness.",
      "Spot the method: the prosecutor calls a separate witness after the friend denies the point on cross.",
      "Classify that method as extrinsic evidence.",
      "Apply FRE 608(b): specific instances may be inquired into on cross, but not proved by extrinsic evidence.",
      "Cut B because the rule is structural, not a major-consequence balancing test.",
      "Cut D because opening the door does not waive the 608(b) extrinsic-proof bar.",
      "Choose A because it names the actual rule.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Cross-examination inquiry is allowed only in the court's discretion; separate-witness proof is extrinsic evidence.",
      },
      {
        label: "Purple profile",
        body: "The answer set pairs two admissible lures with two inadmissible answers, forcing a clash on the stated reason.",
      },
      {
        label: "Blue signal",
        body: "The phrase calls a witness is the giveaway that the prosecutor has moved from cross-examination to extrinsic proof.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating credibility as a 403-style weighing question when FRE 608(b) supplies a structural bar.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVID-EXTRINSIC-01",
        body: "FRE 608(b) bars extrinsic evidence of specific instances to attack truthfulness. Cross-examination inquiry is the only door, and even that is discretionary.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVID-ARRAY-01",
        body: "When two answers share the same bottom-line verdict, clash on the stated reason. The correct answer names the operative rule.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVID-OPEN-DOOR-608B",
        body: "A denial on cross does not let the examiner call a separate witness to prove a specific-instance truthfulness attack.",
      },
    ],
    leadMeSteps: [
      "Name the impeachment target: character for truthfulness.",
      "Name the conduct type: a specific prior statement on an application.",
      "Ask whether the examiner stayed on cross-examination.",
      "Circle the separate witness as extrinsic evidence.",
      "Reject judicial-discretion language unless the answer is about cross-examination inquiry.",
      "Reject open-the-door language when it tries to admit separate-witness proof.",
      "Pick the extrinsic-evidence bar answer.",
    ],
    drillSeeds: [
      {
        title: "Spot the Separate Witness",
        prompt:
          "Cross asks a witness about a specific prior false statement, then calls a separate witness to prove it. Admissible under FRE 608(b)?",
        answer:
          "No. FRE 608(b) bars extrinsic evidence of specific instances for truthfulness; cross-examination inquiry is the only door.",
      },
      {
        title: "Verdict Clash",
        prompt:
          "Two answers say inadmissible. One says extrinsic evidence is barred; one says the witness might have misunderstood. Which reason wins?",
        answer:
          "The extrinsic-evidence bar wins because it states the operative FRE 608(b) rule.",
      },
      {
        title: "Open-the-Door Scope",
        prompt:
          "A witness denies on cross that a prior statement was false. Does that let the examiner call a separate witness to prove the prior statement?",
        answer:
          "No. The examiner may keep probing on cross if allowed, but FRE 608(b) bars separate-witness extrinsic proof.",
      },
    ],
  },
  {
    questionId: "14848",
    transformId: "14848_choir_retreat_mileage_form",
    title: "Witness Truthfulness: Specific Dishonest Acts on Cross",
    outlineCode: "31010406",
    sourceOutlineCode: "31010406",
    coverageGroup: "witness_truthfulness",
    seedBucket: "clean_teaching",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May a party cross-examine a truthfulness-reputation witness about that witness's own prior dishonest act to attack the witness's credibility?",
    stem:
      "In a negligence action arising from the collapse of a temporary platform at a private Easter choir rehearsal, Lydia testified for the plaintiff. The defendant later called Stephen, who testified that Lydia's reputation for truthfulness was bad. On cross-examination of Stephen, the plaintiff's counsel asks, \"Isn't it true that last year, when you requested reimbursement for a youth-choir retreat, you signed a mileage form saying you drove the van even though you had ridden with Mary?\" This question is:",
    choices: [
      {
        letter: "A",
        text: "Improper, because character cannot be proved by specific instances of conduct.",
        verdict: "trap",
        mold: "tiered_absolute / overbroad character rule",
        explanation:
          "A states a familiar character-evidence warning too broadly. FRE 608(b) permits cross-examination about a specific dishonest act if it bears on truthfulness.",
      },
      {
        letter: "B",
        text: "Proper, because it will show the witness's standard for judging another person's reputation for truthfulness.",
        verdict: "trap",
        mold: "wrong_element / proper result wrong reason",
        explanation:
          "This is the dominant trap. The question is proper, but not because it calibrates Stephen's reputation standards. It attacks Stephen's own credibility.",
      },
      {
        letter: "C",
        text: "Improper, because a party may not impeach a witness called only to impeach another witness.",
        verdict: "trap",
        mold: "flat_misstatement / witness-immunity myth",
        explanation:
          "An impeachment witness is still a witness. Nothing in the stem gives Stephen immunity from a proper credibility attack.",
      },
      {
        letter: "D",
        text: "Proper, because it bears on the witness's credibility.",
        verdict: "correct",
        mold: "residue / FRE 608(b) cross-examination lane",
        explanation:
          "The question asks Stephen on cross about his own prior dishonest paperwork. That act is probative of Stephen's truthfulness, so the question is proper in the court's discretion.",
      },
    ],
    answerFlow: [
      "Identify Stephen's role: he is a witness who gave reputation-for-truthfulness testimony.",
      "Name the method: plaintiff's counsel asks Stephen a question on cross-examination.",
      "Name the act: allegedly false mileage paperwork, a specific dishonest act.",
      "Apply FRE 608(b): specific dishonest acts may be asked about on cross if probative of truthfulness.",
      "Cut A because it ignores the cross-examination truthfulness lane.",
      "Cut C because impeachment witnesses can be impeached.",
      "Clash B against D: both say proper, but D names the right target, Stephen's credibility.",
      "Choose D.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Cross-examination about the witness's own dishonest act is different from proving the act with extrinsic evidence.",
      },
      {
        label: "Purple profile",
        body: "The answer set uses two proper/improper pairs, so the because-clause target decides the proper-answer clash.",
      },
      {
        label: "Blue signal",
        body: "The question is asked to Stephen on cross, which keeps the inquiry inside the FRE 608(b) lane.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every specific act as barred character proof without checking the cross-examination truthfulness exception.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-TRUTHFULNESS-01",
        body: "A witness may be asked on cross-examination about a specific dishonest act if the act is probative of that witness's truthfulness; the examiner may not prove the act with extrinsic evidence just for that attack.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BECAUSE-CLAUSE-01",
        body: "When two answers give the same proper/improper result, decide by the because-clause target.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-IMPEACHMENT-WITNESS-MYTH",
        body: "A witness called to impeach another witness is still a witness whose own credibility can be attacked.",
      },
    ],
    leadMeSteps: [
      "Ask whether the lawyer is asking on cross or offering extrinsic proof.",
      "Identify whose credibility the question attacks.",
      "Connect false reimbursement paperwork to truthfulness.",
      "Reject the broad character-specific-act bar because this is cross-examination.",
      "Reject the impeachment-witness immunity answer.",
      "Compare the two proper answers by their because clauses.",
      "Pick the credibility target answer.",
    ],
    drillSeeds: [
      {
        title: "Because-Clause Target",
        prompt:
          "Two answers both say a cross-examination question is proper. One says it tests reputation standards; one says it bears on credibility. What do you compare?",
        answer:
          "Compare the target of the question. A prior lie targets the witness's credibility.",
      },
      {
        title: "FRE 608(b) Trigger",
        prompt:
          "A witness is asked on cross about a prior dishonest form. What truthfulness rule should trigger?",
        answer:
          "Specific dishonest acts may be asked about on cross if probative of truthfulness.",
      },
      {
        title: "Cross vs. Extrinsic Proof",
        prompt:
          "The lawyer asks the witness about a lie on cross but does not offer a document or separate witness to prove it. Is that the same as extrinsic evidence?",
        answer:
          "No. Asking on cross is the lane FRE 608(b) may permit; proving it with outside evidence is the barred extrinsic-evidence move.",
      },
    ],
  },
  {
    questionId: "14844",
    transformId: "14844_divorce-to-deacon",
    title: "Witness Truthfulness: Cross vs. Extrinsic Proof",
    outlineCode: "31010406",
    sourceOutlineCode: "31010406",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "medium_friction",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May an expert witness be asked on cross-examination about prior false testimony that is probative of truthfulness, even though extrinsic proof of that prior act would be barred?",
    stem:
      "A church hired a licensed contractor to build a new fellowship hall. After the work was completed, the church sued the contractor for breach of contract, claiming that the building had serious structural defects. The church called a structural engineer as an expert witness to testify about the cost of repairs. On cross-examination, the contractor's attorney asks the engineer whether he had previously provided false testimony as a witness in his own divorce proceedings. This question is:",
    choices: [
      {
        letter: "A",
        text: "Inadmissible, because impeachment on a collateral matter may not be proved by extrinsic evidence.",
        verdict: "trap",
        mold: "right_rule_wrong_form / extrinsic-evidence overread",
        explanation:
          "A states the extrinsic-evidence limit, but the lawyer is asking the expert a question on cross-examination. FRE 608(b) bars outside proof of the act; it does not automatically bar the question.",
      },
      {
        letter: "B",
        text: "Admissible, because the questioning occurred on cross-examination of the expert witness.",
        verdict: "correct",
        mold: "residue / FRE 608(b) cross-examination lane",
        explanation:
          "The prior false testimony is a specific dishonest act that bears on the expert's truthfulness. The inquiry is on cross-examination, so it may be allowed in the court's discretion.",
      },
      {
        letter: "C",
        text: "Inadmissible, because a witness's character for truthfulness cannot be attacked by specific instances of conduct.",
        verdict: "trap",
        mold: "tiered_absolute / overbroad character rule",
        explanation:
          "C overstates the rule. Specific acts generally cannot be proved with extrinsic evidence, but truthful-character impeachment may include cross-examination about dishonest acts that bear on truthfulness.",
      },
      {
        letter: "D",
        text: "Admissible, because a certified transcript of the prior testimony would be self-authenticating.",
        verdict: "trap",
        mold: "authentication_not_admissibility / wrong proof route",
        explanation:
          "Authentication does not solve the FRE 608(b) problem. A transcript may prove what happened, but extrinsic proof of the prior act is barred when offered only to attack truthfulness.",
      },
    ],
    answerFlow: [
      "Identify the form of the impeachment: the lawyer asks the expert a question on cross-examination.",
      "Identify the act: allegedly false testimony in the expert's own divorce proceeding.",
      "Connect the act to truthfulness because false testimony is a dishonest act.",
      "Apply FRE 608(b): the court may allow cross-examination about a specific act probative of truthfulness.",
      "Keep the extrinsic-evidence bar in its lane: it blocks outside proof, not the question itself.",
      "Cut A because it applies the extrinsic-evidence limit to the wrong procedural form.",
      "Cut C because it turns a limited rule into an absolute ban.",
      "Cut D because authentication does not make barred extrinsic proof admissible.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Question vs. proof: asking about a dishonest act on cross is different from proving that act with a transcript or another outside source.",
      },
      {
        label: "Purple profile",
        body: "The answer set offers one proper cross-examination route, then distracts with collateral-proof, overbroad character, and authentication reasons.",
      },
      {
        label: "Blue signal",
        body: "The phrase on cross-examination is the signal that keeps the issue inside the FRE 608(b) inquiry lane.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: seeing a specific act and stopping at barred, without asking whether the lawyer is only asking about the act on cross.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-TRUTHFULNESS-01",
        body: "A witness may be asked on cross-examination about a specific dishonest act if the act is probative of that witness's truthfulness; the examiner may not prove the act with extrinsic evidence just for that attack.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-CROSS-EXTRINSIC-01",
        body: "First classify the impeachment method. Cross-examination may be allowed; a transcript or other outside proof is the separate barred route.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-AUTHENTICATION-NOT-ADMISSIBILITY",
        body: "A document can be authenticated and still excluded if it is offered as extrinsic proof of a specific truthfulness act.",
      },
    ],
    leadMeSteps: [
      "Ask whether the lawyer is asking a question or offering proof.",
      "Identify whose credibility is being attacked.",
      "Classify false testimony as a dishonest act probative of truthfulness.",
      "Apply the cross-examination side of FRE 608(b).",
      "Hold the extrinsic-evidence bar for transcripts, documents, or other outside proof.",
      "Reject the absolute specific-act answer.",
      "Reject authentication as a substitute for admissibility.",
      "Pick the cross-examination answer.",
    ],
    drillSeeds: [
      {
        title: "Cross or Proof?",
        prompt:
          "Counsel asks a witness on cross about a prior lie but offers no transcript. Which side of FRE 608(b) are you on?",
        answer:
          "The cross-examination side. The judge may allow the question if the prior lie bears on truthfulness.",
      },
      {
        title: "Absolute Language",
        prompt:
          "An answer says truthfulness cannot be attacked by specific acts. What word makes that answer dangerous?",
        answer:
          "Cannot. FRE 608(b) allows some specific-act questions on cross-examination.",
      },
      {
        title: "Authentication Does Not Cure Purpose",
        prompt:
          "A certified transcript could prove the prior false testimony. Why is that not enough?",
        answer:
          "Authentication only proves what the document is. FRE 608(b) still bars extrinsic proof offered only to prove the specific act.",
      },
    ],
  },
  {
    questionId: "14807",
    transformId: "14807_mission_kitchen_notice_letters",
    title: "Non-Hearsay Purpose: Notice Needs a Limiting Instruction",
    outlineCode: "33040203",
    sourceOutlineCode: "33040203",
    coverageGroup: "non_hearsay_purpose",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When prior complaint letters are offered to show notice rather than the truth of the complaints, should the court admit them for that limited purpose and give a timely requested limiting instruction?",
    stem:
      "A mission kitchen sued the manufacturer of an industrial warming oven after volunteers were burned while heating food in sealed containers. The kitchen offered three letters that the manufacturer received before shipping this oven. In the letters, other customers reported similar burn incidents. The manufacturer objects that the letters are hearsay and, in the alternative, asks the court to instruct the jury that the letters may be considered only on notice, not for the truth of the earlier incidents. How should the court rule?",
    choices: [
      {
        letter: "A",
        text: "Sustain the objection and treat the request for a limiting instruction as moot.",
        verdict: "trap",
        mold: "threshold_miss / truth-purpose assumption",
        explanation:
          "A assumes the letters are offered for the truth of the earlier incidents. They can instead show the manufacturer had notice before this oven shipped.",
      },
      {
        letter: "B",
        text: "Overrule the objection and deny the request for a limiting instruction.",
        verdict: "trap",
        mold: "half_right / FRE 105 omission",
        explanation:
          "B gets admissibility right but misses the requested limiting instruction. When evidence is admitted for one purpose but not another, FRE 105 requires a proper limiting instruction on timely request.",
      },
      {
        letter: "C",
        text: "Overrule the objection and give the limiting instruction.",
        verdict: "correct",
        mold: "residue / non-hearsay notice plus FRE 105",
        explanation:
          "The letters are admissible to show notice, not to prove the earlier customers were actually burned. Because the manufacturer timely requested a limiting instruction, the court should restrict the jury to the notice purpose.",
      },
      {
        letter: "D",
        text: "Overrule the objection but allow only that the letters be read aloud, not received as exhibits.",
        verdict: "trap",
        mold: "invented_remedy / exhibit-access distractor",
        explanation:
          "D invents a handling limit that does not answer the hearsay and limiting-instruction issue. If the letters are admitted for notice, they may be received as exhibits subject to the limiting instruction.",
      },
    ],
    answerFlow: [
      "Identify the out-of-court statements: customer letters sent before this shipment.",
      "Ask why the letters are offered: to show the manufacturer had notice of similar incidents.",
      "Classify the use as non-hearsay because notice is different from proving the complaints were true.",
      "Overrule the hearsay objection for the limited notice purpose.",
      "Apply FRE 105 because the manufacturer made a timely limiting-instruction request.",
      "Cut A because it misses the non-hearsay notice purpose.",
      "Cut B because it omits the required limiting instruction.",
      "Cut D because the exhibit-reading limit is not the governing rule.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose first: the letters matter because they reached the manufacturer, not because every prior incident happened exactly as described.",
      },
      {
        label: "Purple profile",
        body: "The array splits admissibility from limiting instruction, so the correct answer must satisfy both gates.",
      },
      {
        label: "Blue signal",
        body: "The phrase only regarding the issue of notice points away from truth use and toward a limited non-hearsay purpose.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: stopping after non-hearsay admissibility and forgetting the requested FRE 105 instruction.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-NOTICE-NONHEARSAY-01",
        body: "A letter offered to prove that notice was sent or received is not offered for the truth of the letter's contents. Do not use a hearsay exception when the offered purpose is notice rather than truth.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-FRE105-LIMITING-01",
        body: "When evidence is admissible for one purpose but not another, a timely request requires the court to restrict the evidence to its proper scope and instruct the jury.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-HALF-RIGHT-LIMITING-INSTRUCTION",
        body: "An answer can be half right by admitting non-hearsay purpose evidence while denying the limiting instruction that FRE 105 requires.",
      },
    ],
    leadMeSteps: [
      "Name the statement and the listener.",
      "Say the offered purpose before touching a hearsay exception.",
      "Classify notice as non-hearsay use.",
      "Ask whether a limiting instruction was requested.",
      "Pair admissibility with the limiting instruction.",
      "Reject the mootness answer.",
      "Reject the no-instruction answer.",
      "Pick the answer that does both jobs.",
    ],
    drillSeeds: [
      {
        title: "Purpose First",
        prompt:
          "A complaint letter is offered to show the defendant received warning before the plaintiff was injured. What is the offered purpose?",
        answer:
          "Notice. The letter is not being used to prove the earlier complaint was true.",
      },
      {
        title: "FRE 105 Add-On",
        prompt:
          "The evidence is admissible for notice but not for truth, and the opponent asks for a limiting instruction. What must the court do?",
        answer:
          "Admit for the limited purpose and give the limiting instruction.",
      },
      {
        title: "Half-Right Trap",
        prompt:
          "Why is admit the letters but deny a limiting instruction not enough?",
        answer:
          "Because FRE 105 requires the instruction on timely request when evidence is limited to a proper purpose.",
      },
    ],
  },
  {
    questionId: "22232",
    transformId: "22232_harvest_stage_oath",
    title: "Witness Truthfulness: Religion Is Not a Credibility Lever",
    outlineCode: "31010406",
    sourceOutlineCode: "31010502",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "recode_or_ambiguous",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May a lawyer use a witness's religious beliefs or opinions to suggest the witness does not take the oath seriously and is less credible?",
    stem:
      "During a negligence trial over a stage-platform collapse at a community harvest concert, Daniel takes the oath and testifies that Mary was the sole cause of the collapse. On cross-examination, Mary asks Daniel whether his leadership role in the Order of the Hollow Lantern means he does not take his oath to tell the truth seriously, because a known teaching of the order is that there is no divine being. After a proper objection, will the court require Daniel to answer that question?",
    choices: [
      {
        letter: "A",
        text: "Yes, because the question goes directly to whether the witness treats the oath as binding.",
        verdict: "trap",
        mold: "bait_doctrine / oath-duty detour",
        explanation:
          "A makes the religion-based credibility attack sound like a narrow oath question. FRE 610 still bars using religious beliefs or opinions to argue that a witness is less truthful.",
      },
      {
        letter: "B",
        text: "No, because religious beliefs or opinions cannot be used to attack or support a witness's credibility.",
        verdict: "correct",
        mold: "residue / full Rule 610 credibility bar",
        explanation:
          "The question uses Daniel's beliefs to attack his credibility under oath. FRE 610 bars using religious beliefs or opinions to attack or support credibility, so the court should not require an answer.",
      },
      {
        letter: "C",
        text: "No, because the question does not use the witness's religious beliefs to support credibility.",
        verdict: "trap",
        mold: "wrong_element / one-sided half-rule",
        explanation:
          "C reaches the no result but gives the wrong reason. The actual use is an attack on credibility, so the answer must state the full attack-or-support bar.",
      },
      {
        letter: "D",
        text: "Yes, because the witness is a ranking official in the religious organization.",
        verdict: "trap",
        mold: "fabricated_rule / rank-based exception myth",
        explanation:
          "D invents an exception. Rule 610 does not turn on whether the witness is an ordinary member, leader, or officer in the religious group.",
      },
    ],
    answerFlow: [
      "Identify the purpose of the question: counsel is using religious beliefs to suggest Daniel is less credible.",
      "Keep the oath language in view but do not let it change the offered purpose.",
      "Apply FRE 610: religious beliefs or opinions cannot be used to attack or support credibility.",
      "Cut A because oath seriousness is only a label for the same forbidden credibility attack.",
      "Cut D because religious rank creates no exception.",
      "Clash B against C: both say no, but B states the full attack-or-support rule.",
      "Reject C because it states only the support side while the stem is an attack.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Offered purpose controls: if religion is the lever for saying a witness is less truthful, FRE 610 shuts the question down.",
      },
      {
        label: "Purple profile",
        body: "The answer set uses two yes answers that let religion into credibility and two no answers, one full rule and one half rule.",
      },
      {
        label: "Blue signal",
        body: "The words does not take his oath seriously are the trap signal; they repackage a credibility attack as oath analysis.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating oath language or religious title as a side door around the religion-credibility bar.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-RELIGION-CREDIBILITY-01",
        body: "FRE 610 bars using a witness's religious beliefs or opinions to attack or support credibility, even when the question is framed as oath sincerity.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-FULL-RULE-CLASH-01",
        body: "When two answers give the same bottom line, choose the one that states the full rule tied to the actual use in the stem.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-OATH-DETOUR-610",
        body: "Rule 603 oath language does not authorize counsel to use religion as a credibility weapon.",
      },
    ],
    leadMeSteps: [
      "Ask why counsel is asking about religion.",
      "Label the use as attack, support, or something else.",
      "If the use is credibility, trigger FRE 610.",
      "Cut yes answers that allow the religion-based credibility question.",
      "Compare no answers by rule completeness.",
      "Reject the one-sided support-only answer.",
      "Reject rank or title as an invented exception.",
      "Pick the full Rule 610 answer.",
    ],
    drillSeeds: [
      {
        title: "Oath Detour",
        prompt:
          "Counsel says the witness's beliefs show the oath means less to the witness. What rule blocks that move?",
        answer:
          "FRE 610. The oath framing is still a religion-based attack on credibility.",
      },
      {
        title: "Full Rule Clash",
        prompt:
          "One no-answer says religion cannot support credibility; another says religion cannot attack or support credibility. Which one fits an attack question?",
        answer:
          "The full attack-or-support answer. The stem uses religion to attack credibility.",
      },
      {
        title: "No Rank Exception",
        prompt:
          "Does a witness's leadership role in a religious group make religious beliefs usable for credibility impeachment?",
        answer:
          "No. FRE 610 has no rank-based exception.",
      },
    ],
  },
  {
    questionId: "14765",
    transformId: "14765_daniel_bookstore_arson_bias",
    title: "Bias Impeachment: Leniency Promise",
    outlineCode: "31010503",
    sourceOutlineCode: "31010503",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "clean_teaching",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a prosecution witness has been promised dismissal of her own pending charge after she testifies, may the defendant use that promise to impeach her for bias?",
    stem:
      "Daniel was charged with arson after a storage room at a Christian bookstore burned. Ruth testified for the prosecution. On cross-examination of Ruth, Daniel seeks to elicit an admission that Ruth was also charged with the same arson and that the prosecutor told her, \"If you testify against Daniel, we will dismiss the charges against you after Daniel's trial.\" The evidence about the prosecutor's promise is:",
    choices: [
      {
        letter: "A",
        text: "Inadmissible, because the promise is hearsay not within any exception.",
        verdict: "trap",
        mold: "flat_misstatement / hearsay-purpose trap",
        explanation:
          "A treats the promise as though Daniel offers it to prove dismissal will actually happen. The impeachment use is different: the promise shows Ruth's motive to favor the prosecution.",
      },
      {
        letter: "B",
        text: "Admissible, as proper impeachment of Ruth.",
        verdict: "correct",
        mold: "residue / bias and motive-to-testify impeachment",
        explanation:
          "Ruth has a concrete reason to testify favorably for the prosecution: her own charge may be dismissed. That expected benefit is admissible to show bias or motive to lie.",
      },
      {
        letter: "C",
        text: "Inadmissible, because the law encourages negotiated resolutions of criminal charges.",
        verdict: "trap",
        mold: "half_truth / plea-policy overprotection",
        explanation:
          "C overextends a real policy instinct. Negotiated resolutions may be encouraged, but that does not hide a prosecution witness's motive to testify favorably.",
      },
      {
        letter: "D",
        text: "Admissible, as a statement by an agent of a party-opponent.",
        verdict: "trap",
        mold: "wrong_route / party-opponent shortcut",
        explanation:
          "D reaches the admissible result through the wrong route. The prosecutor's promise is used to show witness bias, not as a party-opponent admission against the government.",
      },
    ],
    answerFlow: [
      "Identify Ruth's status: she is a prosecution witness.",
      "Identify the benefit: her same-arson charge may be dismissed after Daniel's trial.",
      "Ask why Daniel offers the promise: to show Ruth's motive to favor the prosecution.",
      "Classify the use as bias impeachment, not truth of the dismissal promise.",
      "Cut A because hearsay depends on purpose of offer.",
      "Cut C because settlement or plea policy does not erase witness-bias impeachment.",
      "Cut D because party-opponent admission is the wrong admissibility theory.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose of offer: the promise matters because it gives Ruth a reason to shade testimony, not because dismissal must actually occur.",
      },
      {
        label: "Purple profile",
        body: "The array separates correct admissibility from wrong theories: hearsay, plea-policy overprotection, and party-opponent shortcut.",
      },
      {
        label: "Blue signal",
        body: "The charge against Ruth and the promised dismissal are the bias signals; they point to motive-to-testify impeachment.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: seeing prosecutor promise and jumping to hearsay or plea policy before asking what the promise proves about the witness.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-BIAS-LENIENCY-PROMISE-01",
        body: "A promise of leniency or dismissal to a prosecution witness is admissible to show bias or motive to testify favorably.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BIAS-PURPOSE-OF-OFFER-01",
        body: "Before calling a prosecutor's promise hearsay, ask whether the promise is offered for its truth or to reveal why the witness may favor one side.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-PLEA-POLICY-OVERPROTECTION",
        body: "Policy favoring negotiated resolutions does not block cross-examination that exposes a prosecution witness's expected benefit.",
      },
    ],
    leadMeSteps: [
      "Name the witness's role.",
      "Name the promised benefit.",
      "Ask what the promise shows about the witness.",
      "Classify the use as bias rather than truth.",
      "Reject the hearsay-purpose trap.",
      "Reject the plea-policy shield.",
      "Reject the party-opponent shortcut.",
      "Pick the bias-impeachment answer.",
    ],
    drillSeeds: [
      {
        title: "Bias Not Truth",
        prompt:
          "A prosecutor promises a witness dismissal if she testifies. The defense offers the promise to show the witness wants to please the prosecution. Is it hearsay?",
        answer:
          "No. It is offered to show bias or motive, not to prove the promise will be performed.",
      },
      {
        title: "Leniency Signal",
        prompt:
          "A prosecution witness has a pending charge that may be dismissed after testimony. What impeachment route does that create?",
        answer:
          "Bias or motive-to-testify impeachment.",
      },
      {
        title: "Wrong Admissible Route",
        prompt:
          "A choice says the prosecutor's promise is admissible as a party-opponent admission. What is wrong with that route?",
        answer:
          "The cleaner route is bias impeachment; the promise is used to show the witness's motive.",
      },
    ],
  },
  {
    questionId: "14826",
    transformId: "14826_mary_scooter_fundraiser_bias",
    title: "Bias Impeachment: Hearsay Declarant",
    outlineCode: "31010503",
    sourceOutlineCode: "31010503",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "After a hearsay declarant's statement is admitted, may the opponent attack the declarant's credibility with evidence showing possible bias against the opponent?",
    stem:
      "Mary is suing Peter for injuries suffered when their electric scooters collided outside a Christian homeschool co-op fundraiser. At trial, Mary's first witness testified that, although she did not see the collision, she heard her friend Lydia say just before the crash, \"Watch Peter weave through the cones like a maniac!\" Peter offers evidence to impeach Lydia by asking the witness, \"Isn't it true that Lydia shoved Peter and tore his jacket the night before the fundraiser?\" The question is:",
    choices: [
      {
        letter: "A",
        text: "Improper, because Lydia has not been given an opportunity to explain or deny the incident.",
        verdict: "trap",
        mold: "half_truth / explain-or-deny trap",
        explanation:
          "A focuses on Lydia's absence and misses the admitted-declarant lane. Once Lydia's hearsay statement is in evidence, her credibility can be attacked as if she had testified.",
      },
      {
        letter: "B",
        text: "Proper, because it tends to show Lydia's violent character.",
        verdict: "trap",
        mold: "bait_doctrine / character shortcut",
        explanation:
          "B names the wrong purpose. The incident is not offered to show violent character; it is offered to show possible hostility toward Peter.",
      },
      {
        letter: "C",
        text: "Proper, because it tends to show possible bias of Lydia against Peter.",
        verdict: "correct",
        mold: "residue / Rule 806 declarant-bias impeachment",
        explanation:
          "Lydia's statement has been admitted through the witness, so Peter may attack Lydia's credibility. The prior hostile incident tends to show bias against Peter.",
      },
      {
        letter: "D",
        text: "Improper, because impeachment cannot properly be by specific instances of conduct.",
        verdict: "trap",
        mold: "tiered_absolute / specific-instance overclaim",
        explanation:
          "D overstates the rule. Specific conduct may be used when the purpose is bias rather than general character impeachment.",
      },
    ],
    answerFlow: [
      "Identify the credibility target: Lydia, the out-of-court declarant.",
      "Confirm Lydia's statement has been admitted through the in-court witness.",
      "Apply the declarant-impeachment lane: Lydia can be attacked as if she had testified.",
      "Classify the shove-and-jacket incident by purpose: possible bias against Peter.",
      "Cut B because violent character is the wrong frame.",
      "Cut D because specific-incident limits are not an absolute bar to bias proof.",
      "Clash A against C: Lydia's absence does not defeat Rule 806 bias impeachment.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Target first: the person being impeached is the admitted hearsay declarant, and bias is a proper credibility attack.",
      },
      {
        label: "Purple profile",
        body: "The array tries to mislabel the hostile incident as character, procedure, or an absolute specific-act problem.",
      },
      {
        label: "Blue signal",
        body: "The night-before shove and torn jacket point to hostility toward Peter, which is a bias signal.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: forgetting that admitted hearsay declarants can be impeached and then applying live-witness or character shortcuts.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-DECLARANT-BIAS-806-01",
        body: "When a hearsay statement is admitted, the declarant's credibility can be attacked as if the declarant had testified; bias against a party is a proper attack.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BIAS-PURPOSE-FIRST-01",
        body: "Before using a character or specific-act rule, ask what the incident is offered to prove; bias is a credibility purpose with its own lane.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-SPECIFIC-ACT-BIAS-OVERCLAIM",
        body: "A specific incident is not categorically barred when it is offered to show bias rather than general character.",
      },
    ],
    leadMeSteps: [
      "Identify whose credibility is being attacked.",
      "Confirm the out-of-court statement has been admitted.",
      "Treat the declarant as an impeachment target.",
      "Ask whether the incident shows character or bias.",
      "Reject the character shortcut.",
      "Reject the absolute specific-act answer.",
      "Reject the explain-or-deny trap.",
      "Pick the declarant-bias answer.",
    ],
    drillSeeds: [
      {
        title: "Rule 806 Target",
        prompt:
          "A witness repeats an out-of-court speaker's statement, and the opponent wants to show the speaker disliked the opponent. What rule lane should fire?",
        answer:
          "Rule 806 declarant impeachment by bias.",
      },
      {
        title: "Bias Not Character",
        prompt:
          "A prior hostile incident is offered to show the speaker had a reason to accuse a party. Is the purpose character or bias?",
        answer: "Bias.",
      },
      {
        title: "Specific Act Check",
        prompt:
          "An answer says a specific prior incident can never be used for impeachment. What should you check before accepting it?",
        answer:
          "Check whether the incident is offered for bias rather than character.",
      },
    ],
  },
  {
    questionId: "14830",
    transformId: "14830_lydia_bike_repair_adjuster",
    title: "Insurance Evidence: Bias Only",
    outlineCode: "31010503",
    sourceOutlineCode: "31010503",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May a party ask a defense witness about employment by the defendant's liability insurer to show bias, and if so, for what purpose?",
    stem:
      "Lydia sued Peter, alleging that she was seriously injured when Peter steered a cargo bike through a retreat-center walkway and knocked her down while she was carrying hymnals. During Peter's case, Timothy testified that Lydia had told him that the cargo bike \"only brushed my sleeve.\" On cross-examination, should the court allow Lydia to ask Timothy whether he is a claims adjuster for Peter's liability insurance company?",
    choices: [
      {
        letter: "A",
        text: "Yes, for both substantive and impeachment purposes.",
        verdict: "trap",
        mold: "half_truth / purpose overclaim",
        explanation:
          "A sees the bias purpose but lets it travel too far. The insurance tie can impeach Timothy; it is not substantive proof that Peter acted negligently.",
      },
      {
        letter: "B",
        text: "No, because testimony about liability insurance is barred by the rules of evidence.",
        verdict: "trap",
        mold: "tiered_absolute / insurance bar overclaim",
        explanation:
          "B remembers the general insurance limit but treats it as absolute. FRE 411 allows insurance evidence for another purpose, including witness bias.",
      },
      {
        letter: "C",
        text: "Yes, for impeachment purposes only.",
        verdict: "correct",
        mold: "residue / limited-purpose bias impeachment",
        explanation:
          "Timothy's job with Peter's liability insurer gives him a possible motive to shade his testimony. The question is allowed for credibility impeachment only.",
      },
      {
        letter: "D",
        text: "No, because the reference to insurance raises a collateral issue.",
        verdict: "trap",
        mold: "flat_misstatement / collateral-label trap",
        explanation:
          "D sounds like trial-management language, but bias is a direct credibility issue. The insurer relationship explains a possible motive to slant testimony.",
      },
    ],
    answerFlow: [
      "Spot the insurance fact.",
      "Ask what use Lydia is making of it.",
      "Separate fault proof from credibility proof.",
      "Block substantive use: insurance is not negligence evidence.",
      "Allow impeachment use: Timothy may be biased because he works for Peter's insurer.",
      "Cut B because the bar is not absolute.",
      "Cut D because bias is not collateral clutter.",
      "Clash A against C and choose the limited-purpose answer: C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose split first: the same insurance fact is barred for proving fault but allowed for showing witness bias.",
      },
      {
        label: "Purple profile",
        body: "The array pressures students with an absolute bar, a collateral label, and an overbroad yes.",
      },
      {
        label: "Blue signal",
        body: "Timothy is a defense witness tied to Peter's insurer; that employment tie is a bias signal.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating one allowed purpose as all purposes, or memorizing insurance as always barred.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-INSURANCE-BIAS-01",
        body: "FRE 411 bars liability-insurance evidence to prove negligence, but allows it for another purpose such as proving a witness's bias or prejudice.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-SPLIT-01",
        body: "When an answer says evidence is admissible for more than one purpose, split the purposes before choosing.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-INSURANCE-ALWAYS-BARRED",
        body: "Insurance is not an always-barred word; the offered purpose controls.",
      },
    ],
    leadMeSteps: [
      "Name the insurance fact.",
      "Name the witness's relationship to the insurer.",
      "Ask whether the use is fault proof or credibility proof.",
      "Reject substantive negligence use.",
      "Allow the bias-impeachment use.",
      "Reject the absolute insurance bar.",
      "Reject the collateral-issue label.",
      "Pick the limited-purpose answer.",
    ],
    drillSeeds: [
      {
        title: "Insurance Purpose Split",
        prompt:
          "A defense witness works for the defendant's insurer. Is that fact admissible to prove negligence or to show bias?",
        answer: "To show bias only.",
      },
      {
        title: "Absolute Bar Check",
        prompt:
          "An answer says liability-insurance evidence is always barred. What exception should you check?",
        answer:
          "Check whether it is offered for another purpose, such as witness bias.",
      },
      {
        title: "Both-Purposes Trap",
        prompt:
          "A choice allows insurance evidence for both substantive and impeachment purposes. What word should alarm you?",
        answer: "Both.",
      },
    ],
  },
  {
    questionId: "14829",
    transformId: "14829_daniel_retreat_supply_room_confession",
    title: "Preliminary Questions: Confession Hearing",
    outlineCode: "31010107",
    sourceOutlineCode: "31010107",
    coverageGroup: "preliminary_question_judge_jury",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a criminal defendant challenges the admissibility of an alleged confession, must the court hold the preliminary hearing outside the jury's hearing?",
    stem:
      "Daniel was on trial for burglary after a retreat center supply room was broken into during a weekend Christian leadership event. The prosecutor called the arresting deputy to testify that, shortly after Daniel's arrest and questioning, Daniel orally admitted committing the burglary. Before the deputy testified, Daniel objected that no Miranda warnings had been given and asked for a hearing outside the presence of the jury to hear evidence on that issue. How should the court proceed?",
    choices: [
      {
        letter: "A",
        text: "The court may grant or deny the request, because preliminary admissibility hearings are generally within the court's discretion as to whether the jury hears them.",
        verdict: "trap",
        mold: "half_truth / generic-discretion trap",
        explanation:
          "A states a generally plausible idea about preliminary matters, but this is a confession-admissibility hearing. Rule 104(c) makes that hearing outside the jury's hearing mandatory.",
      },
      {
        letter: "B",
        text: "The court should deny the request and admit the statement, because Daniel's own statement offered against him is an opposing-party statement.",
        verdict: "trap",
        mold: "bait_doctrine / hearsay-lane trap",
        explanation:
          "B answers a different question. Opposing-party statement status does not solve the Miranda challenge or the required hearing procedure.",
      },
      {
        letter: "C",
        text: "The court should grant the request, because a hearing on the admissibility of a confession must be conducted so the jury cannot hear it.",
        verdict: "correct",
        mold: "residue / Rule 104(c) confession-hearing carveout",
        explanation:
          "Daniel challenges the admissibility of an alleged confession. That preliminary hearing must be conducted so the jury cannot hear it.",
      },
      {
        letter: "D",
        text: "The court should deny the request and rule the statement inadmissible, because only signed confessions may be used in criminal trials.",
        verdict: "trap",
        mold: "fabricated_rule / signed-confession myth",
        explanation:
          "D invents a formality. An oral confession is not categorically barred just because it was not signed; the real issue is the Miranda-based admissibility hearing.",
      },
    ],
    answerFlow: [
      "Classify the objection: Daniel challenges an alleged confession.",
      "Notice the requested procedure: a hearing outside the jury's presence.",
      "Apply the special Rule 104(c) lane for confession admissibility.",
      "Cut D because there is no signed-confession-only rule.",
      "Cut B because hearsay status does not answer the Miranda hearing issue.",
      "Clash A against C: generic discretion loses to the confession-specific carveout.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Classify the preliminary question first; confession admissibility triggers a mandatory outside-the-jury hearing.",
      },
      {
        label: "Purple profile",
        body: "The array mixes a generic-discretion half-truth, a hearsay bait lane, and a fabricated signature requirement.",
      },
      {
        label: "Blue signal",
        body: "The words confession, Miranda, and outside the jury point to Rule 104(c)'s protected hearing procedure.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: applying ordinary preliminary-hearing discretion before classifying the confession category.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PRELIM-CONFESSION-HEARING-01",
        body: "A hearing on the admissibility of a confession is a mandatory outside-the-jury hearing under Rule 104(c); it is not left to ordinary preliminary-hearing discretion.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PRELIM-CLASSIFY-HEARING-01",
        body: "Before choosing discretion, classify the preliminary question; confession admissibility is the special category that forces the hearing outside the jury's hearing.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-PARTY-OPPONENT-MIRANDA-SKIP",
        body: "A defendant's own statement may clear a hearsay label, but that does not skip Miranda admissibility or the Rule 104(c) hearing procedure.",
      },
    ],
    leadMeSteps: [
      "Name the offered evidence: Daniel's alleged confession.",
      "Name the objection: no Miranda warnings.",
      "Name the requested procedure: outside-jury hearing.",
      "Classify the preliminary question as confession admissibility.",
      "Reject the signed-confession myth.",
      "Reject the opposing-party shortcut.",
      "Reject generic discretion.",
      "Pick the Rule 104(c) hearing answer.",
    ],
    drillSeeds: [
      {
        title: "Rule 104(c) Trigger",
        prompt:
          "A defendant challenges an alleged confession and asks for a hearing outside the jury's presence. What hearing-location rule fires?",
        answer:
          "The confession-admissibility hearing must be conducted so the jury cannot hear it.",
      },
      {
        title: "Hearsay Lane Check",
        prompt:
          "The prosecution says the statement is the defendant's own words. Why does that not end the analysis?",
        answer:
          "Party-opponent status does not answer the Miranda challenge or Rule 104(c) hearing procedure.",
      },
      {
        title: "Oral Confession Form",
        prompt:
          "An answer says an oral confession is inadmissible solely because it was not signed. What is wrong?",
        answer: "There is no signed-confession-only rule.",
      },
    ],
  },
  {
    questionId: "14834",
    transformId: "14834_orchard-dying-declaration",
    title: "Preliminary Questions: Dying Declaration Foundation",
    outlineCode: "31010107",
    sourceOutlineCode: "31010107",
    coverageGroup: "preliminary_question_judge_jury",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When the prosecution lays the foundation for a dying declaration, who decides whether it qualifies, and may that decider rely on an affidavit?",
    stem:
      "Peter, a vineyard owner, was attacked at dusk among his grape rows and left mortally wounded. Before he died, he took a piece of chalk from his apron and wrote on the side of a wooden crate: \"Barnabas did this.\" In the prosecution of Barnabas for murder, the government seeks to introduce the properly authenticated crate writing as a dying declaration. In laying the foundation, the prosecution offered an affidavit from the attending physician stating that Peter knew he was about to die when he wrote the words. The admissibility of the crate writing as a dying declaration is:",
    choices: [
      {
        letter: "A",
        text: "A question of weight and credibility for the jury, and the jury may properly consider the affidavit.",
        verdict: "trap",
        mold: "backwards / jury-weight trap",
        explanation:
          "A sounds natural because juries weigh credibility, but the call asks whether the statement is admissible as a hearsay exception. That preliminary admissibility question belongs to the judge.",
      },
      {
        letter: "B",
        text: "A preliminary fact question for the judge, and the judge must not consider the affidavit.",
        verdict: "trap",
        mold: "half_truth / false affidavit bar",
        explanation:
          "B names the right decider but adds the wrong limit. On a Rule 104(a) admissibility ruling, the judge is not bound by the evidence rules except privilege.",
      },
      {
        letter: "C",
        text: "A preliminary fact question for the judge, and the judge may properly consider the affidavit.",
        verdict: "correct",
        mold: "residue / Rule 104(a) admissibility ruling",
        explanation:
          "Whether the dying-declaration exception applies is a preliminary admissibility question for the judge, and the judge may rely on the affidavit in deciding it.",
      },
      {
        letter: "D",
        text: "A question of weight and credibility for the jury, and the jury must not consider the affidavit.",
        verdict: "trap",
        mold: "flat_misstatement / double-axis miss",
        explanation:
          "D misses both axes. The judge, not the jury, decides admissibility, and the judge may consider the affidavit for the preliminary ruling.",
      },
    ],
    answerFlow: [
      "Name the offered evidence: a statement offered as a dying declaration.",
      "Classify the call as admissibility of a hearsay exception.",
      "Resolve the first axis: admissibility is for the judge, not the jury.",
      "Cut A and D because both put the decision with the jury.",
      "Resolve the second axis: Rule 104(a) does not bind the judge to the evidence rules except privilege.",
      "Cut B because it falsely bars the affidavit.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Admissibility first: whether a hearsay exception applies is a preliminary question for the judge.",
      },
      {
        label: "Purple profile",
        body: "The array is a 2x2 board: judge or jury crossed with may consider or must not consider the affidavit.",
      },
      {
        label: "Blue signal",
        body: "The words admissibility and dying declaration point to a Rule 104(a) preliminary ruling, not jury weight.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: confusing jury credibility weighing with the judge's gateway decision on admissibility.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVID-PRELIM-ADMISS-01",
        body: "Whether a hearsay exception applies is a preliminary admissibility question for the judge under Rule 104(a), and the judge is not bound by the evidence rules except privilege.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVID-DECIDER-FIRST-01",
        body: "On a who-decides admissibility item, resolve judge versus jury before the sub-question; admissibility equals judge.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-JURY-WEIGHT-ADMISSIBILITY-SWAP",
        body: "Do not turn a gateway admissibility ruling into a jury weight-and-credibility question.",
      },
    ],
    leadMeSteps: [
      "Identify the statement as a hearsay-exception candidate.",
      "Read the call word: admissibility.",
      "Assign admissibility to the judge.",
      "Cut both jury choices.",
      "Ask whether the judge may use the affidavit.",
      "Apply Rule 104(a)'s not-bound-by-evidence-rules rule.",
      "Cut the must-not-consider answer.",
      "Pick judge plus may consider.",
    ],
    drillSeeds: [
      {
        title: "Decider First",
        prompt:
          "A statement is offered under a hearsay exception and the parties dispute whether the exception applies. Who decides admissibility?",
        answer: "The judge.",
      },
      {
        title: "Affidavit Foundation",
        prompt:
          "In deciding a Rule 104(a) preliminary admissibility question, may the judge consider hearsay such as an affidavit?",
        answer:
          "Yes, except for privilege, the judge is not bound by the evidence rules.",
      },
      {
        title: "Weight Trap",
        prompt:
          "An answer says the jury decides whether a dying declaration is admissible because it is about weight and credibility. What is the error?",
        answer:
          "It confuses admissibility, which the judge decides, with the jury's later weighing of admitted evidence.",
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
