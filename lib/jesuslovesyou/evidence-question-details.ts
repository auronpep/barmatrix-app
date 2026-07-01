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
  {
    questionId: "14835",
    transformId: "14835_conference_badge_email",
    title: "Preliminary Questions: Expert Qualification",
    outlineCode: "31010107",
    sourceOutlineCode: "31010107",
    coverageGroup: "preliminary_question_judge_jury",
    seedBucket: "clean_teaching",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Who decides an expert-qualification objection, and may that decisionmaker consider a hearsay email about the expert's reputation?",
    stem:
      "In a federal prosecution of Paul for counterfeiting admission badges to a private Christian youth conference, the prosecution calls Lydia, a forensic ink-and-paper analyst, as an expert. Paul objects that Lydia is not adequately qualified as an expert. To support Lydia's qualifications, the prosecution offers a printed email from Lydia's former forensic-document supervisor, stating that Lydia is widely regarded among document examiners as well qualified. On the issue of Lydia's qualifications, the email may be considered by:",
    choices: [
      {
        letter: "A",
        text: "Both the judge and the jury, because the email is not being used for a hearsay purpose.",
        verdict: "trap",
        mold: "bait_doctrine / nonhearsay-purpose overreach",
        explanation:
          "A imports a familiar hearsay-purpose label into the wrong lane. Expert qualification is a judge-only preliminary admissibility question, not evidence for both judge and jury.",
      },
      {
        letter: "B",
        text: "Neither the judge nor the jury, because the email is hearsay and no hearsay exception applies.",
        verdict: "trap",
        mold: "flat_misstatement / hearsay overblock",
        explanation:
          "B treats hearsay as a complete bar. For the judge's Rule 104(a) preliminary ruling, the evidence rules do not bind the court except privilege.",
      },
      {
        letter: "C",
        text: "The jury, without regard to the hearsay rule.",
        verdict: "trap",
        mold: "wrong_element / right hearsay move, wrong actor",
        explanation:
          "C catches that hearsay does not block the preliminary decision, but assigns the decision to the wrong actor. The judge decides qualification.",
      },
      {
        letter: "D",
        text: "The judge, without regard to the hearsay rule.",
        verdict: "correct",
        mold: "residue / Rule 104(a) expert-qualification ruling",
        explanation:
          "Expert qualification is a preliminary admissibility question for the judge, and the judge may consider the email without applying the hearsay rule.",
      },
    ],
    answerFlow: [
      "Identify the issue: Lydia's expert qualification.",
      "Classify it as a preliminary admissibility question.",
      "Lock the decisionmaker: the judge decides expert qualification.",
      "Cut A because both judge and jury is too broad.",
      "Cut C because it sends the decision to the jury.",
      "Apply Rule 104(a): the judge is not bound by evidence rules except privilege.",
      "Cut B because it overblocks hearsay.",
      "Choose D.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Decisionmaker first: expert qualification is a judge-only preliminary admissibility question.",
      },
      {
        label: "Purple profile",
        body: "The array splits judge, jury, both, and neither while baiting students with hearsay labels.",
      },
      {
        label: "Blue signal",
        body: "The qualification objection and written reputation support point to Rule 104(a), not jury trial evidence.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: chasing hearsay labels before deciding who rules on expert qualification.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-104-JUDGE-HEARSAY-01",
        body: "Expert qualification is a preliminary admissibility question for the judge, and the judge is not bound by evidence rules except privilege when deciding it.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-JUDGE-JURY-LANE-01",
        body: "When the answer set splits judge, jury, both, and neither, lock the decisionmaker before chasing hearsay labels.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-NONHEARSAY-PURPOSE-JURY-OVERREACH",
        body: "A nonhearsay-purpose label does not turn a judge-only preliminary qualification ruling into jury evidence.",
      },
    ],
    leadMeSteps: [
      "Name the objection: expert qualification.",
      "Classify the issue as preliminary admissibility.",
      "Assign the ruling to the judge.",
      "Reject both-actor and jury-only answers.",
      "Ask whether hearsay blocks the judge.",
      "Apply Rule 104(a)'s not-bound-by-evidence-rules rule.",
      "Reject neither because hearsay overblocks.",
      "Pick judge without regard to hearsay.",
    ],
    drillSeeds: [
      {
        title: "Expert Qualification Decider",
        prompt:
          "A party objects that an expert is not qualified. Who decides that preliminary question?",
        answer: "The judge.",
      },
      {
        title: "Hearsay Support",
        prompt:
          "The proponent offers a hearsay email to support expert qualification. May the judge consider it for the preliminary ruling?",
        answer:
          "Yes. Under Rule 104(a), the judge is not bound by the evidence rules except privilege.",
      },
      {
        title: "Both-Actor Trap",
        prompt:
          "An answer lets both judge and jury consider hearsay support for expert qualification. What is the lane error?",
        answer:
          "Expert qualification is judge-only; the jury does not decide the threshold qualification issue.",
      },
    ],
  },
  {
    questionId: "14837",
    transformId: "14837_dying-declaration-preliminary-hearing",
    title: "Preliminary Questions: Dying Declaration Hearing",
    outlineCode: "31010107",
    sourceOutlineCode: "31010107",
    coverageGroup: "preliminary_question_judge_jury",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "In a criminal trial, who decides whether a hearsay exception's foundational requirement is met, who participates, and is the jury present?",
    stem:
      "Paul is on trial for the murder of Daniel. The prosecution calls Lydia to testify that, after being stabbed, Daniel said, \"Paul stabbed me.\" Before Lydia testifies, Paul's attorney requests a hearing on whether Daniel believed his death was imminent when he made the statement. Before admitting the dying declaration, the judge should:",
    choices: [
      {
        letter: "A",
        text: "Hear evidence from both sides, with the jury present, and decide whether the witness may testify to the statement.",
        verdict: "trap",
        mold: "flat_misstatement / jury-present trap",
        explanation:
          "A gets both sides and judge decision right, but leaves the jury in the room. The preliminary admissibility hearing must be conducted outside the jury's presence when justice requires it.",
      },
      {
        letter: "B",
        text: "Hear evidence from the prosecutor only, with the jury not present, and permit the testimony if the judge believes a jury could reasonably find that Daniel knew he was dying.",
        verdict: "trap",
        mold: "tiered_overclaim / prosecutor-only and wrong-standard trap",
        explanation:
          "B is the polished trap. The jury is out, but the defense is wrongly excluded and the choice imports a reasonable-jury standard instead of the judge deciding admissibility.",
      },
      {
        letter: "C",
        text: "Hear evidence from both sides, with the jury not present, and decide whether the witness may testify to the statement.",
        verdict: "correct",
        mold: "residue / Rule 104 preliminary-admissibility hearing",
        explanation:
          "The judge decides the preliminary admissibility issue, both sides may be heard, and the jury is kept out of the hearing.",
      },
      {
        letter: "D",
        text: "Hear evidence from both sides, with the jury present, and allow the jury to determine whether the witness may testify to the statement.",
        verdict: "trap",
        mold: "issue_sense / jury-decides trap",
        explanation:
          "D confuses jury factfinding with admissibility gatekeeping. The jury weighs admitted evidence; the judge decides whether the statement comes in.",
      },
    ],
    answerFlow: [
      "Identify the issue: foundation for a dying declaration.",
      "Classify the issue as preliminary admissibility.",
      "Apply Rule 104(a): the judge decides admissibility.",
      "Require both sides to be heard on the admissibility issue.",
      "Apply Rule 104(c): keep the jury out when justice requires.",
      "Cut A because the jury is present.",
      "Cut B because it excludes the defense and uses the wrong standard.",
      "Cut D because it gives admissibility to the jury.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Run the three-part preliminary-hearing checklist: judge decides, both sides participate, jury out.",
      },
      {
        label: "Purple profile",
        body: "The array offers three near-misses: jury present, prosecutor only with the wrong standard, and jury decides.",
      },
      {
        label: "Blue signal",
        body: "The requested hearing on Daniel's belief in imminent death signals a Rule 104 admissibility gate, not a jury trial issue.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: accepting an answer that gets two procedural elements right while missing the third.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PRELIM-01",
        body: "Under Rule 104(a), the judge decides preliminary questions of admissibility, and both sides may present evidence and argument on the issue.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PRELIM-01",
        body: "On preliminary-hearing questions, check three elements in order: judge decides, both sides participate, jury stays out when justice requires.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-104B-STANDARD-SWAP",
        body: "Do not import a reasonable-jury conditional-relevance standard into a Rule 104(a) admissibility decision.",
      },
    ],
    leadMeSteps: [
      "Name the offered statement.",
      "Name the disputed foundation fact.",
      "Classify the issue as preliminary admissibility.",
      "Assign the decision to the judge.",
      "Require both sides to participate.",
      "Keep the jury out of the hearing.",
      "Reject reasonable-jury standard language.",
      "Pick the answer with all three procedure elements correct.",
    ],
    drillSeeds: [
      {
        title: "Three-Part Hearing Checklist",
        prompt:
          "A Rule 104 preliminary admissibility hearing appears in the choices. What three procedure points must be right?",
        answer: "Judge decides, both sides participate, and the jury is out when justice requires.",
      },
      {
        title: "Wrong Standard",
        prompt:
          "A choice says the judge should admit the statement if a jury could reasonably find the foundation fact. What standard is being smuggled in?",
        answer:
          "The conditional-relevance sufficiency standard, not the judge's Rule 104(a) admissibility decision.",
      },
      {
        title: "Jury Role",
        prompt:
          "The jury weighs admitted evidence. Who decides whether the dying declaration comes in?",
        answer: "The judge.",
      },
    ],
  },
  {
    questionId: "14825",
    transformId: "14825_pantry-volunteer-incident-report",
    title: "Refreshing Recollection: Before vs. During",
    outlineCode: "31010407",
    sourceOutlineCode: "31010407",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a witness refreshes memory with a writing before testifying, when may or must the court let the adverse party examine the writing?",
    stem:
      "Lydia has volunteered for years at Grace Community Food Pantry, a Christian ministry that gives groceries to families in need. She was working the distribution line when a man she later identified as the defendant took several boxes of donated canned goods from the loading area without authorization. At trial for theft, Lydia testified for the prosecution. Before she took the stand, she had trouble remembering the exact sequence of what she saw the defendant load and carry. To prepare, she refreshed her memory by silently reviewing a short incident report that Timothy, the pantry's volunteer coordinator, had written the day after the event. The defendant has asked to examine the report. How should the court respond?",
    choices: [
      {
        letter: "A",
        text: "The court must allow the examination, but only to the extent that the report contains Lydia's own statement to Timothy.",
        verdict: "trap",
        mold: "fabricated_rule / own-statement limit",
        explanation:
          "A adds an authorship limit that Rule 612 does not require. The inspection right turns on the writing being used to refresh, not on whether Lydia wrote or adopted it.",
      },
      {
        letter: "B",
        text: "The court should not allow the examination, because the report was not shown to have been read and approved by Lydia while the matter was fresh in her mind.",
        verdict: "trap",
        mold: "flat_misstatement / recorded-recollection import",
        explanation:
          "B imports the read-and-approved-while-fresh idea from recorded recollection. Refreshing recollection under Rule 612 does not require that foundation.",
      },
      {
        letter: "C",
        text: "The court may allow the examination if the report was used by Lydia to refresh her memory before testifying, and must allow it if she used it during her testimony.",
        verdict: "correct",
        mold: "residue / Rule 612 timing distinction",
        explanation:
          "Lydia used the report before testifying, so the court may allow examination if justice requires. If the refresh happened while she was testifying, production would be mandatory.",
      },
      {
        letter: "D",
        text: "The court should not allow the examination, unless the report was used by Lydia to refresh her memory while on the witness stand.",
        verdict: "trap",
        mold: "half_truth / only-on-the-stand trap",
        explanation:
          "D states only half the timing rule. Refreshing while testifying makes inspection mandatory, but pre-testimony refresh can still trigger discretionary production.",
      },
    ],
    answerFlow: [
      "Spot the timing fact: Lydia refreshed before she took the stand.",
      "Apply the Rule 612 timing split.",
      "Before testifying means the court may allow inspection if justice requires.",
      "While testifying would mean the adverse party is entitled to inspection.",
      "Cut A because authorship is not the trigger.",
      "Cut B because it imports recorded-recollection foundation.",
      "Cut D because it ignores the pre-testimony discretionary lane.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Timing controls: before testifying is discretionary; while testifying is mandatory.",
      },
      {
        label: "Purple profile",
        body: "The array baits students with own-statement limits, recorded-recollection freshness, and an only-on-the-stand half-rule.",
      },
      {
        label: "Blue signal",
        body: "The phrase before she took the stand is the key signal; the answer must preserve the may-before and must-during split.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: importing the recorded-recollection rule or memorizing only the in-court refresh rule.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-612-REFRESH-TIMING-01",
        body: "Under Rule 612, a writing used while testifying must be produced to the adverse party; a writing used before testifying may be produced if justice requires.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-REFRESH-NOT-RECORDED-RECOLLECTION",
        body: "Do not import recorded-recollection foundation into refreshing recollection; authorship and read-and-approved status are not the Rule 612 trigger.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-REFRESH-ONLY-ON-STAND",
        body: "The on-stand rule is mandatory, but it is not exclusive; pre-testimony refresh remains discretionary.",
      },
    ],
    leadMeSteps: [
      "Find when the witness used the writing.",
      "Classify the use as before testifying or while testifying.",
      "Apply may before if justice requires.",
      "Apply must during if used on the stand.",
      "Reject the own-statement limit.",
      "Reject the read-and-approved-while-fresh requirement.",
      "Reject the only-on-the-stand half-rule.",
      "Pick the timing-split answer.",
    ],
    drillSeeds: [
      {
        title: "Before vs. During",
        prompt:
          "A witness reviews a third-party report the night before trial to refresh memory. What is the court's inspection rule for the adverse party?",
        answer:
          "The court may allow inspection if justice requires.",
      },
      {
        title: "On-Stand Refresh",
        prompt:
          "A witness reviews a writing while testifying. What is the adverse party's right?",
        answer:
          "The adverse party is entitled to have the writing produced for inspection and related cross-examination.",
      },
      {
        title: "Recorded-Recollection Import",
        prompt:
          "A choice requires the refresh writing to have been read and approved while fresh. What rule is it confusing with Rule 612?",
        answer: "Recorded recollection.",
      },
    ],
  },
  {
    questionId: "17318",
    transformId: "source_only_17318_refreshing-recollection-calendar",
    title: "Refreshing Recollection: On-Stand Access",
    outlineCode: "31010407",
    sourceOutlineCode: "31010407",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a witness uses a writing while testifying to refresh memory, may the adverse party inspect it even though the writing was not offered into evidence?",
    stem:
      "In a federal civil trial, Sarah testifies that she cannot remember the date she inspected a warehouse. Her lawyer hands her a handwritten calendar. Sarah looks at the calendar, returns it, and testifies, \"Now I remember: the inspection was May 3.\" Opposing counsel Moses immediately asks to inspect the calendar and cross-examine Sarah about the entry. Sarah's lawyer objects that the calendar was not offered into evidence. How should the court rule?",
    choices: [
      {
        letter: "A",
        text: "Sustain the objection because a writing used only to refresh memory is unavailable to the adverse party unless the proponent offers it into evidence.",
        verdict: "trap",
        mold: "flat_misstatement / evidence-offer trap",
        explanation:
          "A makes admissibility by the proponent the access trigger. Rule 612 gives the adverse party inspection rights when the writing is used while testifying.",
      },
      {
        letter: "B",
        text: "Overrule the objection because a writing used to refresh a witness while testifying must be produced for inspection and related cross-examination by the adverse party.",
        verdict: "correct",
        mold: "residue / Rule 612 on-stand access",
        explanation:
          "Sarah used the calendar while testifying. Under Rule 612, Moses may inspect it and cross-examine Sarah about related portions even though Sarah's lawyer did not offer it into evidence.",
      },
      {
        letter: "C",
        text: "Admit the entire calendar as substantive evidence because Sarah used it to refresh her recollection.",
        verdict: "trap",
        mold: "overcorrection / substantive-evidence trap",
        explanation:
          "C swings too far. Refreshing memory gives inspection and cross-examination rights; it does not automatically make the whole writing substantive evidence.",
      },
      {
        letter: "D",
        text: "Sustain the objection unless Moses first proves that the calendar is an original business record.",
        verdict: "trap",
        mold: "wrong_doctrine / business-record import",
        explanation:
          "D imports business-record and original-document ideas. The issue is Rule 612 access after a writing refreshes testimony.",
      },
    ],
    answerFlow: [
      "Spot when Sarah used the calendar: while testifying.",
      "Apply Rule 612's mandatory on-stand production rule.",
      "Reject A because the proponent does not need to offer the writing.",
      "Reject C because inspection rights do not equal automatic substantive admission.",
      "Reject D because business-record proof is not the access trigger.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Use while testifying triggers mandatory adverse-party access under Rule 612.",
      },
      {
        label: "Purple profile",
        body: "The traps confuse inspection with admissibility, substantive evidence, and business-record foundation.",
      },
      {
        label: "Blue signal",
        body: "The word immediately after Sarah refreshed on the stand points to on-stand access, not later discovery discretion.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: thinking a refresh writing stays hidden unless the proponent offers it.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-612-ON-STAND-PRODUCTION-01",
        body: "A writing used to refresh memory while the witness is testifying must be produced for adverse-party inspection and related cross-examination.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-REFRESH-ACCESS-NOT-SUBSTANTIVE-ADMISSION",
        body: "Rule 612 access does not automatically admit the entire writing as substantive evidence.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-REFRESH-NOT-OFFERED-OBJECTION",
        body: "The objection that the writing was not offered into evidence misses the point; on-stand refresh triggers inspection rights.",
      },
    ],
    leadMeSteps: [
      "Ask whether the witness used the writing before testifying or while testifying.",
      "Mark this as while-testifying use.",
      "Apply mandatory production for inspection.",
      "Keep inspection separate from substantive admission.",
      "Ignore business-record and original-document distractions.",
      "Pick the on-stand access answer.",
    ],
    drillSeeds: [
      {
        title: "Not Offered",
        prompt:
          "A witness uses a note on the stand to refresh memory, but the proponent never offers the note. Can the adverse party inspect it?",
        answer: "Yes. Use while testifying triggers Rule 612 inspection rights.",
      },
      {
        title: "Access vs. Admission",
        prompt:
          "A witness refreshes memory from a calendar. Does Rule 612 automatically admit the whole calendar as substantive evidence?",
        answer:
          "No. It gives the adverse party inspection and related cross-examination rights, not automatic substantive admission.",
      },
      {
        title: "Wrong Foundation",
        prompt:
          "A choice requires the calendar to qualify as a business record before inspection. What is wrong with that?",
        answer:
          "Business-record foundation is not the Rule 612 trigger; the trigger is use to refresh while testifying.",
      },
    ],
  },
  {
    questionId: "18076",
    transformId: "source_only_18076_attorney-notes-refresh",
    title: "Refreshing Recollection: Any Material Can Jog Memory",
    outlineCode: "31010407",
    sourceOutlineCode: "31010407",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May a witness look at someone else's notes, not yet in evidence, to see whether they refresh present recollection?",
    stem:
      "The plaintiff sues the defendant for breaching an agreement to market her products. At trial, the plaintiff testifies that she and the defendant discussed five products at a conference in her attorney's office, but she can remember only four. After having the attorney's conference notes marked for identification, plaintiff's counsel asks whether looking at the notes would refresh her memory of the fifth product. Defense counsel objects before the plaintiff looks at the notes. How should the court rule?",
    choices: [
      {
        letter: "A",
        text: "Sustain the objection because the notes were not made by the plaintiff.",
        verdict: "trap",
        mold: "fabricated_rule / authorship trap",
        explanation:
          "A adds an authorship requirement. A witness may use material made by someone else if it actually refreshes present memory.",
      },
      {
        letter: "B",
        text: "Sustain the objection because the notes were not in evidence.",
        verdict: "trap",
        mold: "flat_misstatement / admitted-evidence trap",
        explanation:
          "B confuses refreshing recollection with admitting the writing. The writing used to refresh need not already be in evidence.",
      },
      {
        letter: "C",
        text: "Sustain the objection because asking whether the notes would refresh the plaintiff's memory is leading.",
        verdict: "trap",
        mold: "wrong_doctrine / leading-question distraction",
        explanation:
          "C mislabels the question. Asking whether a writing may refresh memory does not suggest the missing product name.",
      },
      {
        letter: "D",
        text: "Overrule the objection.",
        verdict: "correct",
        mold: "residue / refresh-foundation permission",
        explanation:
          "The judge should let the plaintiff look at the marked notes to see whether they refresh present recollection. If they do, she testifies from memory; if not, the court can handle the problem then.",
      },
    ],
    answerFlow: [
      "Spot that the notes are offered only to jog memory.",
      "Ask whether Rule 612 requires the writing to be authored by the witness.",
      "It does not.",
      "Ask whether the writing must already be in evidence.",
      "It does not.",
      "Check the leading-question objection: the question does not suggest the missing product.",
      "Overrule the objection and let the witness try to refresh.",
      "Choose D.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Refreshing recollection can use any material that helps restore present memory.",
      },
      {
        label: "Purple profile",
        body: "The traps impose fake prerequisites: witness authorship, admitted-evidence status, or a leading-question label.",
      },
      {
        label: "Blue signal",
        body: "The notes were marked for identification and offered only for the witness to look at, not for substantive admission.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating refresh material like it must independently satisfy an admissibility foundation before the witness can look at it.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-612-ANY-MATERIAL-REFRESH-01",
        body: "A witness may use any material to refresh present recollection; authorship and admissibility of the material are not prerequisites.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-REFRESH-TRY-FIRST-JUDGE-MONITORS",
        body: "The court can let the witness look first, then decide whether the witness truly has refreshed present memory or is just reading from the writing.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-REFRESH-ADMISSIBILITY-FOUNDATION",
        body: "Do not require the refresh material itself to be in evidence before the witness may use it to jog memory.",
      },
    ],
    leadMeSteps: [
      "Classify the use as refreshing recollection, not substantive proof.",
      "Reject the authorship requirement.",
      "Reject the admitted-evidence requirement.",
      "Reject the leading-question label unless the question suggests the factual answer.",
      "Let the witness look and test whether memory returns.",
      "Pick the overrule answer.",
    ],
    drillSeeds: [
      {
        title: "Someone Else's Notes",
        prompt:
          "A witness wants to look at notes written by another person to refresh memory. Is authorship required?",
        answer: "No. Any material may be used if it refreshes present recollection.",
      },
      {
        title: "Not in Evidence",
        prompt:
          "A writing has only been marked for identification. Can it still be used to refresh the witness's memory?",
        answer:
          "Yes. Refreshing recollection does not require that the writing already be admitted.",
      },
      {
        title: "Leading Label",
        prompt:
          "Counsel asks whether looking at notes would refresh memory. Why is that usually not a leading question?",
        answer:
          "It asks about memory-refreshing, not the substantive answer the witness forgot.",
      },
    ],
  },
  {
    questionId: "22211",
    transformId: "22211_lydia-purple-cloth",
    title: "Business Records vs. Past Recollection Recorded",
    outlineCode: "31010407",
    sourceOutlineCode: "31010407",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a business record is made from information supplied by an employee with a business duty to report, is it admitted as a business record or past recollection recorded?",
    stem:
      "Lydia is a dealer in purple cloth. She employs a warehouse clerk named Marcus who inspects every incoming shipment and reports its contents to her. On March 3, Marcus inspected a shipment of dye materials and immediately told Lydia what it contained. Lydia wrote the information on a shipping receipt and signed it. A copy was sent to the buyer, a textile workshop in Philippi. At trial in a contract dispute over the shipment, Lydia testifies that she supervised the transaction, that she no longer has any independent recollection of what the shipment contained, and that the original receipt is now in the hands of her attorney. Her attorney shows her a document; Lydia identifies it as the receipt she signed. The attorney offers the receipt into evidence. The opposing party objects. If the court admits the receipt into evidence, what will it be admitted as?",
    choices: [
      {
        letter: "A",
        text: "An original document under the best evidence rule.",
        verdict: "trap",
        mold: "wrong_frame / best-evidence distraction",
        explanation:
          "A points to the wrong rule. The best evidence rule governs proof of a writing's contents; it is not a hearsay exception that makes the receipt admissible.",
      },
      {
        letter: "B",
        text: "A present recollection refreshed.",
        verdict: "trap",
        mold: "procedural_misfit / refresh-vs-exhibit",
        explanation:
          "B fails because Lydia has no recollection to refresh and the receipt itself is being offered as an exhibit. Rule 612 is a testimony tool, not this exhibit's admission theory.",
      },
      {
        letter: "C",
        text: "A record kept in the usual course of business.",
        verdict: "correct",
        mold: "residue / business-record exception",
        explanation:
          "C fits FRE 803(6). Lydia made the receipt in the ordinary course from Marcus's prompt report, and Marcus had a business duty to inspect and report the shipment contents.",
      },
      {
        letter: "D",
        text: "A past recollection recorded.",
        verdict: "trap",
        mold: "half_truth / PRC personal-knowledge trap",
        explanation:
          "D is the dominant trap. Lydia made the record and now lacks memory, but past recollection recorded requires the witness's own knowledge of the recorded facts. She relied on Marcus's report.",
      },
    ],
    answerFlow: [
      "Notice that the receipt itself is offered into evidence.",
      "Cut present recollection refreshed because that uses a writing to jog testimony, not admit the writing.",
      "Cut best evidence because it is not a hearsay exception.",
      "Clash business records against past recollection recorded.",
      "Ask whether Lydia personally knew the shipment contents.",
      "She did not; Marcus inspected and reported them under a business duty.",
      "That defeats past recollection recorded and supports the business-record exception.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Business records can use information transmitted by a person with knowledge and a business duty to report.",
      },
      {
        label: "Purple profile",
        body: "The trap sells past recollection recorded because the witness made a record and now lacks memory.",
      },
      {
        label: "Blue signal",
        body: "The splitting fact is that Marcus, not Lydia, personally inspected the shipment.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every made-when-fresh record as past recollection recorded without checking personal knowledge.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PRC-VS-BR-01",
        body: "Past recollection recorded requires the witness's own knowledge; business records may rely on information from a person with knowledge and a business duty to report.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-EXHIBIT-NOT-REFRESH",
        body: "When the document itself is offered as an exhibit, do not classify it as present recollection refreshed under Rule 612.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-BER-NOT-HEARSAY-EXCEPTION",
        body: "The best evidence rule does not supply a hearsay exception; it does not answer why a record is admissible.",
      },
    ],
    leadMeSteps: [
      "Classify the procedural posture: the receipt is offered as an exhibit.",
      "Remove Rule 612 because no refreshed testimony is being used.",
      "Remove best evidence because it is not an admissibility exception.",
      "Compare business records with past recollection recorded.",
      "Check whose knowledge supplied the contents.",
      "Use Marcus's business duty to route to business records.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Entrant Lacks Personal Knowledge",
        prompt:
          "A manager records shipment contents from a clerk's business-duty report, then later has no memory. The record is offered as an exhibit. Which exception fits?",
        answer: "Business records under FRE 803(6), not past recollection recorded.",
      },
      {
        title: "PRC Split",
        prompt:
          "What fact defeats past recollection recorded when a signed business receipt is offered?",
        answer:
          "The witness did not personally observe the recorded facts; another employee supplied them.",
      },
      {
        title: "Exhibit vs. Refresh",
        prompt:
          "The document itself is offered into evidence. Why is present recollection refreshed wrong?",
        answer:
          "Rule 612 refreshes testimony; it does not admit the refresh document as the exhibit.",
      },
    ],
  },
  {
    questionId: "22227",
    transformId: "22227_barn-fire-daniel",
    title: "Refreshing Recollection: Pretrial Notes Inspection",
    outlineCode: "31010407",
    sourceOutlineCode: "31010407",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a witness refreshed recollection before trial by reviewing notes, what may the court require on the opposing party's motion?",
    stem:
      "Three years passed before a negligence suit against a landowner reached trial. The plaintiff alleged that the defendant's poorly maintained fence allowed livestock to escape onto a neighboring road, causing a collision that injured the plaintiff. At trial, the plaintiff's attorney called Daniel, an eyewitness to the accident. Daniel testified that before coming to court, he had refreshed his recollection by reviewing written notes he had taken during his conversation with the plaintiff's attorney two weeks after the accident. On proper motion by the defendant's attorney, what should the court do?",
    choices: [
      {
        letter: "A",
        text: "Admit the notes into evidence as an admission of a party.",
        verdict: "trap",
        mold: "issue_misfit / admission trap",
        explanation:
          "A misfires because Daniel is a witness, not a party. A nonparty witness's notes are not admissions of a party-opponent.",
      },
      {
        letter: "B",
        text: "Strike Daniel's testimony, unless it is shown that the notes themselves are unavailable.",
        verdict: "trap",
        mold: "flat_misstatement / best-evidence trap",
        explanation:
          "B imports the best evidence rule. Daniel is testifying from refreshed memory, not proving the contents of the notes, so there is no basis to strike his testimony.",
      },
      {
        letter: "C",
        text: "Direct that the notes be brought into court for inspection by the defendant's attorney.",
        verdict: "correct",
        mold: "residue / FRE 612 production",
        explanation:
          "C applies Rule 612. Because Daniel used the notes to refresh memory before testifying, the court may require production so the defendant can inspect them and cross-examine effectively.",
      },
      {
        letter: "D",
        text: "Direct that the notes cannot be brought into court because they have not been offered into evidence.",
        verdict: "trap",
        mold: "flat_misstatement / not-offered trap",
        explanation:
          "D gets Rule 612 backwards. A refresh writing can be produced for inspection even though it has not been offered into evidence.",
      },
    ],
    answerFlow: [
      "Identify the trigger: Daniel refreshed memory before trial by reviewing notes.",
      "Ask whether the notes are being used to prove their contents.",
      "They are not; Daniel is testifying from refreshed memory.",
      "Cut the best evidence rule trap.",
      "Cut the admission trap because Daniel is not a party.",
      "Cut the not-offered trap because Rule 612 production does not require offering the notes.",
      "Apply Rule 612 inspection.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Rule 612 lets the court require production of writings used to refresh memory before testifying.",
      },
      {
        label: "Purple profile",
        body: "The traps confuse refresh inspection with best evidence, party admissions, and formal admission of the writing.",
      },
      {
        label: "Blue signal",
        body: "Daniel reviewed the notes before coming to court and then testified from memory; that points to Rule 612, not proof of contents.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: seeing notes and unavailable and reflexively applying the best evidence rule.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-REFRESH-01",
        body: "A writing used to refresh recollection before trial can be produced for opposing-party inspection; the witness testifies from memory, and the writing is a cross-examination tool.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-REFRESH-NOT-BEST-EVIDENCE",
        body: "The best evidence rule applies to proving a writing's contents, not to testimony from memory after a refresh.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-NONPARTY-NOTES-NOT-ADMISSION",
        body: "Notes made by a nonparty witness are not admissions of a party-opponent merely because they involve a party's attorney.",
      },
    ],
    leadMeSteps: [
      "Find the refresh event.",
      "Confirm the witness refreshed before trial.",
      "Separate refreshed-memory testimony from proof of note contents.",
      "Reject best evidence.",
      "Reject admissions because the witness is not a party.",
      "Reject the offered-into-evidence prerequisite.",
      "Order production for inspection.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Refresh vs. Contents",
        prompt:
          "A witness reviews notes before trial and then testifies from memory. Does the best evidence rule require the notes to be unavailable before the testimony stands?",
        answer:
          "No. The best evidence rule governs proof of contents, not refreshed-memory testimony.",
      },
      {
        title: "Production Trigger",
        prompt:
          "A writing was used to refresh recollection before testimony. What can the court require on the opposing party's motion?",
        answer:
          "Production of the writing for inspection and related cross-examination under Rule 612.",
      },
      {
        title: "Admission Misfit",
        prompt:
          "A nonparty witness's notes from a conversation with a party's lawyer are offered as an admission. What is the missing requirement?",
        answer: "A party-opponent statement.",
      },
    ],
  },
  {
    questionId: "14840",
    transformId: "14840_youth-ministry-leadership-rivalry",
    title: "Bias: Impeaching the Hearsay Declarant",
    outlineCode: "31010503",
    sourceOutlineCode: "31010503",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When former testimony is admitted from an unavailable declarant, what evidence of the declarant's motive to lie is most likely admissible?",
    stem:
      "At the trial of Barnabas for the murder of a rival Christian youth ministry leader, the prosecution introduced, as former testimony, a statement by Timothy, a former youth leader who testified against Barnabas at a preliminary hearing and has now invoked his privilege against self-incrimination. If Barnabas now seeks to impeach the credibility of Timothy, which evidence is the court most likely to admit?",
    choices: [
      {
        letter: "A",
        text: "Evidence that Timothy had three misdemeanor convictions for disorderly conduct at youth events.",
        verdict: "trap",
        mold: "half_truth / misdemeanor-conviction trap",
        explanation:
          "A treats any misdemeanor as credibility impeachment. Misdemeanors impeach under Rule 609(a)(2) only when they involve dishonesty or a false statement.",
      },
      {
        letter: "B",
        text: "Testimony by a psychologist that persons with Timothy's background have a tendency to fabricate.",
        verdict: "trap",
        mold: "wrong_frame / expert-credibility trap",
        explanation:
          "B sounds sophisticated, but general credibility is for the jury. Expert testimony that a witness or declarant tends to fabricate is usually excluded.",
      },
      {
        letter: "C",
        text: "Testimony by a witness that, at the time Timothy testified, Timothy was actively campaigning to replace Barnabas as the director of the regional youth conference.",
        verdict: "correct",
        mold: "residue / bias impeachment",
        explanation:
          "C shows direct bias. Timothy had a motive to implicate Barnabas falsely because Barnabas held the leadership position Timothy wanted.",
      },
      {
        letter: "D",
        text: "Testimony by a witness that Timothy runs a side business selling pirated copies of Christian worship albums.",
        verdict: "trap",
        mold: "half_truth / bad-act truthfulness trap",
        explanation:
          "D offers a bad act that is only weakly tied to truthfulness and would usually run into the extrinsic-proof limit for specific bad acts.",
      },
    ],
    answerFlow: [
      "Recognize that former testimony is a hearsay statement.",
      "Apply Rule 806: the declarant's credibility may be attacked as if he had testified.",
      "Look for the impeachment method most likely to be admitted.",
      "Bias is highly probative and liberally admitted.",
      "Cut A because disorderly conduct is not dishonesty or false statement.",
      "Cut B because expert veracity testimony invades the jury's credibility role.",
      "Cut D because the side business is not strong truthfulness evidence and extrinsic proof is limited.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Rule 806 lets a party impeach a hearsay declarant the same way a live witness could be impeached.",
      },
      {
        label: "Purple profile",
        body: "The traps use familiar impeachment boxes: convictions, expert credibility, and bad acts.",
      },
      {
        label: "Blue signal",
        body: "The leadership rivalry gives Timothy a personal motive to lie about Barnabas.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: looking for character-for-truthfulness evidence before checking direct bias.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-FRE806-BIAS-01",
        body: "When a hearsay statement is admitted, Rule 806 treats the declarant like a witness for impeachment; bias evidence is admissible if it would be allowed against a live witness.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BIAS-BEATS-CHARACTER-IMPEACHMENT",
        body: "Bias asks why this declarant might lie in this case; that is stronger than general character attacks.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-EXPERT-CREDIBILITY-JURY-ROLE",
        body: "A psychologist's generalized opinion that a person tends to fabricate usually invades the jury's job of judging credibility.",
      },
    ],
    leadMeSteps: [
      "Identify the declarant whose former testimony was admitted.",
      "Use Rule 806 to allow impeachment as if the declarant testified.",
      "Search for a concrete motive to lie.",
      "Choose the leadership-rivalry bias evidence.",
      "Reject misdemeanor convictions not involving dishonesty.",
      "Reject expert veracity testimony.",
      "Reject weak bad-act truthfulness evidence.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Declarant Treated Like Witness",
        prompt:
          "Former testimony from an unavailable declarant is admitted. Can the opposing party use bias evidence to impeach that declarant?",
        answer: "Yes. Rule 806 allows impeachment as if the declarant had testified.",
      },
      {
        title: "Bias Signal",
        prompt:
          "A declarant wanted the defendant's leadership role when he made the statement. What impeachment category is that?",
        answer: "Bias: a personal motive to lie.",
      },
      {
        title: "Misdemeanor Limit",
        prompt:
          "A declarant has misdemeanor disorderly conduct convictions. Why is that usually weak impeachment?",
        answer:
          "The misdemeanors do not involve dishonesty or false statement under Rule 609(a)(2).",
      },
    ],
  },
  {
    questionId: "14852",
    transformId: "14852_family_worship_laptop_bias",
    title: "Bias: Motive Is Not Truthfulness Character",
    outlineCode: "31010503",
    sourceOutlineCode: "31010503",
    coverageGroup: "witness_truthfulness_bias",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May cross-examination ask about a recent punishment to show the witness had a motive to accuse falsely, even if the punished act is not about truthfulness?",
    stem:
      "Timothy was prosecuted for assaulting Hannah, his 13-year-old niece, after a family Bible-study music night. Hannah testified about Timothy's conduct. On cross-examination, Timothy's lawyer asks Hannah, \"Isn't it true that shortly before you reported that Timothy assaulted you, he grounded you from the next music night because you deliberately cracked his laptop that held the worship-track recordings?\" The question is:",
    choices: [
      {
        letter: "A",
        text: "proper, because Hannah's misconduct is relevant to her character for truthfulness.",
        verdict: "trap",
        mold: "flat_misstatement / right-result-wrong-reason",
        explanation:
          "A reaches the proper side but gives the wrong reason. Cracking a laptop is not character-for-truthfulness impeachment.",
      },
      {
        letter: "B",
        text: "improper, because the question goes beyond the subject matter covered on direct examination.",
        verdict: "trap",
        mold: "flat_misstatement / scope-of-direct trap",
        explanation:
          "B overstates the scope limit. Credibility issues, including bias and motive, may be explored on cross-examination.",
      },
      {
        letter: "C",
        text: "proper, because it relates to a possible motive for Hannah to accuse Timothy falsely.",
        verdict: "correct",
        mold: "residue / bias-motive impeachment",
        explanation:
          "C names the correct offered purpose. The recent punishment could give Hannah a motive to be angry at Timothy and accuse him falsely.",
      },
      {
        letter: "D",
        text: "improper, because cracking the laptop had nothing to do with Hannah's truthfulness.",
        verdict: "trap",
        mold: "half_truth / offered-purpose trap",
        explanation:
          "D states a true premise but draws the wrong conclusion. The laptop incident is not offered to prove truthfulness character; it is offered to show bias or motive.",
      },
    ],
    answerFlow: [
      "Identify the setting: this is cross-examination about credibility.",
      "Name the offered purpose before judging the fact.",
      "The punishment fact is offered to show motive to accuse falsely.",
      "Do not ask whether laptop damage itself proves truthfulness.",
      "Cut A because it gives the wrong truthfulness-character reason.",
      "Cut B because cross may cover credibility matters.",
      "Cut D because it ignores the bias purpose.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Bias and motive to lie are independent impeachment lanes.",
      },
      {
        label: "Purple profile",
        body: "The traps force the student into the wrong frame: truthfulness character or direct-exam scope.",
      },
      {
        label: "Blue signal",
        body: "The timing matters: Timothy grounded Hannah shortly before she reported him.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: rejecting motive evidence because the underlying act is not dishonest.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-BIAS-MOTIVE-01",
        body: "Bias or motive to lie is its own impeachment lane; the fact showing bias does not have to be a truthfulness act under Rule 608.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-OFFERED-PURPOSE-01",
        body: "Before judging an impeachment fact, name what the question is offered to show: truthfulness character, contradiction, or bias.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-NONTRUTHFULNESS-HALF-TRUTH",
        body: "A fact can have nothing to do with truthfulness and still be admissible to show bias or motive.",
      },
    ],
    leadMeSteps: [
      "Start with the cross-examination purpose.",
      "Spot the recent punishment.",
      "Connect the punishment to possible resentment or motive.",
      "Separate motive from character for truthfulness.",
      "Reject the right-result-wrong-reason answer.",
      "Reject the scope-of-direct overrestriction.",
      "Reject the truthfulness half-truth.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Purpose Sort",
        prompt:
          "A witness is asked about being punished by the defendant shortly before accusing him. Is the fact offered for truthfulness character or bias?",
        answer: "Bias or motive to accuse falsely.",
      },
      {
        title: "Cross Scope",
        prompt:
          "Direct examination did not mention the witness's anger at the defendant. May cross-examination ask about it if it affects credibility?",
        answer: "Yes. Credibility matters may be explored on cross-examination.",
      },
      {
        title: "Half-Truth Trap",
        prompt:
          "A choice says a prior property-damage incident has nothing to do with truthfulness. What must you ask next?",
        answer:
          "Whether the incident is offered for another impeachment purpose, such as bias or motive.",
      },
    ],
  },
  {
    questionId: "14872",
    transformId: "14872_hannah_sleet_cart",
    title: "Rule 403: Fit Before Drama",
    outlineCode: "32020302",
    sourceOutlineCode: "32020302",
    coverageGroup: "fre_403_insurance_policy_purpose",
    seedBucket: "clean_teaching",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Which offered item is most likely admitted when it helps an expert explain a disputed fact and carries less Rule 403 confusion risk than dramatic alternatives?",
    stem:
      "Naomi, as representative of Hannah's estate, has brought a products-liability action against the manufacturer of a three-wheel electric delivery cart that Hannah was driving after a Bible-study coat drive when she was fatally injured in a tip-over on a sloped service road. Naomi claims that a design defect in the cart caused it to tip over. The defendant claims that Hannah was driving too fast during a sleet storm. Witnesses leaving the fellowship hall gave contradictory estimates about the cart's speed just before it tipped. It is also disputed whether Hannah was killed instantly. Which item of offered evidence is the court most likely to admit?",
    choices: [
      {
        letter: "A",
        text: "Evidence offered by the defendant that Hannah had received two citations for speeding in the previous three years.",
        verdict: "trap",
        mold: "flat_misstatement / propensity trap",
        explanation:
          "A invites the forbidden inference that Hannah drove fast this time because she had prior speeding citations. That is propensity reasoning.",
      },
      {
        letter: "B",
        text: "Photographs taken at the accident scene and during the autopsy that would help Naomi's medical expert explain to the jury why she concluded that Hannah did not die instantly.",
        verdict: "correct",
        mold: "residue / expert-purpose fit",
        explanation:
          "B has the cleanest fit. The photos help a medical expert explain a disputed death-timing issue, and the court can limit the jury's use of them.",
      },
      {
        letter: "C",
        text: "A videotape offered by the defendant of a test showing that the same model cart did not tip over when driven by a professional driver on a dry proving lane at the top speed testified to by the witnesses.",
        verdict: "trap",
        mold: "wrong_element / dissimilar-experiment trap",
        explanation:
          "C looks scientific because it uses the same model and speed, but the important conditions changed: professional driver, dry lane, and no sleet.",
      },
      {
        letter: "D",
        text: "A videotape offered by Naomi of a television news program about three-wheel electric delivery carts that includes footage of accident scenes in which the carts had tipped over.",
        verdict: "trap",
        mold: "wrong_element / generalized-footage trap",
        explanation:
          "D is dramatic but weakly fitted. Other carts in other accidents do not answer this cart, this road, this weather, or this disputed fact.",
      },
    ],
    answerFlow: [
      "Read the call as a most-likely-to-admit comparison.",
      "Cut old speeding citations because they rely on propensity.",
      "Cut general news footage because it is vivid but not fitted to this accident.",
      "Cut the dry professional test because the experiment conditions are materially different.",
      "Keep the item tied to a disputed fact.",
      "Use the expert-explanation purpose to support probative value.",
      "Balance Rule 403 risks against that fit.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Rule 403 favors evidence with a clean disputed-fact purpose over dramatic evidence with weak fit.",
      },
      {
        label: "Purple profile",
        body: "The traps are visually or narratively tempting: old citations, a same-model test, and dramatic media footage.",
      },
      {
        label: "Blue signal",
        body: "The photos are tied to a disputed medical issue and help an expert explain her conclusion.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: choosing the most vivid evidence instead of the evidence with the best purpose-fit.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-403-PHOTOS-01",
        body: "Graphic or unpleasant photos can be admitted when they help an expert explain a disputed consequential fact; Rule 403 excludes only when unfair prejudice or confusion substantially outweighs probative value.",
      },
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-SIMILAR-EXPERIMENTS-01",
        body: "A test or demonstration is weak when the conditions that matter are not sufficiently similar to the litigated event.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-OFFERED-PURPOSE-01",
        body: "For an admissibility question, read the offered purpose before reacting to the evidence's emotional force.",
      },
    ],
    leadMeSteps: [
      "Name the disputed facts: speed and death timing.",
      "Sort each item by offered purpose.",
      "Reject prior citations as propensity.",
      "Reject general footage as low-fit drama.",
      "Reject the experiment for changed conditions.",
      "Keep the expert photos because they explain a disputed fact.",
      "Apply Rule 403's substantially-outweighed standard.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Propensity Cut",
        prompt:
          "A civil defendant offers old driving citations to prove a party drove fast during the accident. What is the first Evidence cut?",
        answer: "Cut it as propensity evidence.",
      },
      {
        title: "Similar Experiment Fit",
        prompt:
          "A test uses the same product and speed but different weather, surface, and driver skill. What axis should you name?",
        answer: "Substantial similarity of conditions.",
      },
      {
        title: "Expert Purpose",
        prompt:
          "Unpleasant photos help a medical expert explain a disputed death-timing issue. What makes them admissible?",
        answer:
          "They are tied to a disputed consequential fact through a proper expert-explanation purpose.",
      },
    ],
  },
  {
    questionId: "14875",
    transformId: "14875_rule_403_surprise_not_factor",
    title: "Rule 403: The Missing Factor",
    outlineCode: "32020302",
    sourceOutlineCode: "32020302",
    coverageGroup: "fre_403_insurance_policy_purpose",
    seedBucket: "clean_teaching",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Which concern is not one of the Rule 403 dangers that can substantially outweigh probative value?",
    stem:
      "A trial judge is applying Rule 403 to relevant evidence. Which concern is not part of the Rule 403 balancing list?",
    choices: [
      {
        letter: "A",
        text: "The jury may be confused about how the evidence applies to the issues in the case.",
        verdict: "trap",
        mold: "flat_misstatement / listed-factor trap",
        explanation:
          "A is a real Rule 403 concern. Confusing the issues or misleading the jury can justify exclusion when it substantially outweighs probative value.",
      },
      {
        letter: "B",
        text: "The evidence may create unfair prejudice against one side.",
        verdict: "trap",
        mold: "flat_misstatement / listed-factor trap",
        explanation:
          "B is the classic Rule 403 danger. The rule targets unfair prejudice, not merely damaging evidence.",
      },
      {
        letter: "C",
        text: "The opposing party is surprised by the evidence and is not fairly prepared to meet it.",
        verdict: "correct",
        mold: "residue / discovery-problem contrast",
        explanation:
          "C is the odd one out. Surprise or lack of preparation may raise scheduling, disclosure, or discovery issues, but it is not one of Rule 403's balancing dangers.",
      },
      {
        letter: "D",
        text: "The trial would become longer and more cumbersome because the evidence has only slight importance.",
        verdict: "trap",
        mold: "flat_misstatement / listed-factor trap",
        explanation:
          "D describes undue delay, wasting time, or cumulative/trivial proof. Those are Rule 403 concerns.",
      },
    ],
    answerFlow: [
      "Read the call as a negative-list question.",
      "Recall the Rule 403 dangers.",
      "Keep unfair prejudice.",
      "Keep confusion or misleading the jury.",
      "Keep delay, waste of time, and needless cumulative proof.",
      "Separate surprise from Rule 403.",
      "Treat surprise as a different procedural problem.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Rule 403 has a specific balancing list; do not add general unfairness concerns to it.",
      },
      {
        label: "Purple profile",
        body: "Three choices are real Rule 403 dangers, and the correct answer is the outsider.",
      },
      {
        label: "Blue signal",
        body: "Surprise and lack of preparation point toward disclosure or case-management problems, not Rule 403 balancing.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating any unfair-sounding trial problem as a Rule 403 factor.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-403-ENUMERATED-DANGERS-01",
        body: "Rule 403 weighs probative value against unfair prejudice, confusing the issues, misleading the jury, undue delay, wasting time, or needlessly cumulative evidence.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-NEGATIVE-CALL-01",
        body: "When the call asks which item is not included, turn each answer into a checklist item and hunt for the outsider.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-SURPRISE-NOT-403",
        body: "Surprise may matter under disclosure, continuance, or discovery rules, but it is not a Rule 403 balancing danger by itself.",
      },
    ],
    leadMeSteps: [
      "Mark the word not in the call.",
      "List the Rule 403 dangers from memory.",
      "Match jury confusion to the list.",
      "Match unfair prejudice to the list.",
      "Match delay or waste of time to the list.",
      "Notice that surprise is absent.",
      "Move surprise to procedural/discovery territory.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "403 List Drill",
        prompt:
          "Name three Rule 403 dangers besides unfair prejudice.",
        answer:
          "Confusing the issues, misleading the jury, undue delay, wasting time, or needless cumulative evidence.",
      },
      {
        title: "Surprise Sort",
        prompt:
          "A party says evidence should be excluded because it was a surprise and they are unprepared. Is that a Rule 403 danger by itself?",
        answer:
          "No. Treat it as a disclosure, continuance, or discovery issue unless another Rule 403 danger is present.",
      },
      {
        title: "Negative Call",
        prompt:
          "A question asks which factor is not part of a rule. What is the safest first move?",
        answer:
          "Build the rule's checklist, then select the answer that is outside it.",
      },
    ],
  },
  {
    questionId: "14899",
    transformId: "14899_v1",
    title: "Polygraph Reference: Strike the Answer",
    outlineCode: "32020302",
    sourceOutlineCode: "32020302",
    coverageGroup: "fre_403_insurance_policy_purpose",
    seedBucket: "medium_friction",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "What should the court do when a witness volunteers inadmissible polygraph testimony after a narrow cross-examination question?",
    stem:
      "Paul was charged with stealing a laptop from a coworker's desk. At trial, a witness testified that she saw Paul take the laptop. The jurisdiction does not allow polygraph results into evidence. On cross-examination by Paul's attorney, the witness was asked, \"The office was too dimly lit to see clearly, wasn't it?\" She responded, \"I'm so certain it was Paul that I passed a polygraph test the police gave me.\" Paul's attorney immediately objects and moves to strike the witness's answer. The trial court should",
    choices: [
      {
        letter: "A",
        text: "deny the motion, because polygraph results are admissible when volunteered by a witness.",
        verdict: "trap",
        mold: "flat_misstatement / volunteered-evidence myth",
        explanation:
          "A invents a volunteered-evidence exception. If the jurisdiction bars polygraph results, the witness cannot make them admissible by blurting them out.",
      },
      {
        letter: "B",
        text: "deny the motion, because Paul's attorney opened the door by asking about the lighting.",
        verdict: "trap",
        mold: "wrong_frame / open-door overreach",
        explanation:
          "B uses a real doctrine too broadly. A lighting question does not open the door to a categorically barred polygraph reference.",
      },
      {
        letter: "C",
        text: "grant the motion, because the probative value of the unresponsive testimony is substantially outweighed by the danger of unfair prejudice.",
        verdict: "correct",
        mold: "residue / Rule 403 unfair-prejudice balance",
        explanation:
          "C keeps the right frame. The answer was unresponsive, the jurisdiction bars the evidence, and jurors may overvalue a claimed polygraph result.",
      },
      {
        letter: "D",
        text: "grant the motion, because the question was leading.",
        verdict: "trap",
        mold: "wrong_issue / question-form red herring",
        explanation:
          "D attacks the wrong thing. Leading questions are generally allowed on cross-examination, and the motion targets the witness's answer.",
      },
    ],
    answerFlow: [
      "Start with the motion: the lawyer asks the court to strike the answer.",
      "Separate the cross-examination question from the witness's answer.",
      "Keep the jurisdictional bar on polygraph results in view.",
      "Cut the volunteered-evidence exception because it does not exist.",
      "Cut the opened-door answer because the question asked only about lighting.",
      "Cut the leading-question answer because leading is allowed on cross.",
      "Use Rule 403 to name the unfair-prejudice danger.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "A jurisdictional evidence bar plus an unresponsive answer defeats open-door and volunteered-evidence traps.",
      },
      {
        label: "Purple profile",
        body: "The traps are procedural decoys: volunteered, opened door, and leading question.",
      },
      {
        label: "Blue signal",
        body: "The witness volunteered a polygraph result even though the jurisdiction bars polygraph evidence.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: letting a real doctrine like opened door override a categorical evidence bar.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVID-POLY-01",
        body: "Polygraph or lie-detector references are inadmissible in many jurisdictions, and jurors may overvalue them; a volunteered reference can be struck under Rule 403.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVID-403-UNRESPONSIVE-ANSWER-01",
        body: "For a motion to strike, separate the question from the answer; the answer may be excluded even when the question itself was proper.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVID-OPEN-DOOR-NOT-CATEGORICAL-BAR",
        body: "Opened door is not a magic override for evidence that the jurisdiction categorically bars.",
      },
    ],
    leadMeSteps: [
      "Identify what the lawyer moved to strike.",
      "Name the barred evidence: polygraph results.",
      "Notice that the answer was unresponsive to a lighting question.",
      "Reject the volunteered-evidence myth.",
      "Reject the opened-door overreach.",
      "Reject the leading-question red herring.",
      "Apply Rule 403 unfair prejudice.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Motion Target",
        prompt:
          "A lawyer moves to strike after a witness gives an unresponsive answer. What should you separate first?",
        answer: "Separate the propriety of the question from the admissibility of the answer.",
      },
      {
        title: "Polygraph Signal",
        prompt:
          "A witness volunteers that she passed a polygraph in a jurisdiction that bars polygraph results. What is the Evidence move?",
        answer:
          "Grant the motion to strike because the barred reference creates unfair prejudice.",
      },
      {
        title: "Opened Door Limit",
        prompt:
          "Does asking about lighting open the door to a barred polygraph result?",
        answer:
          "No. Opened door does not override a categorical bar, and the answer went beyond the question.",
      },
    ],
  },
  {
    questionId: "17130",
    transformId: "17130_bias_mini_trial_403",
    title: "Bias Proof Without a Mini-Trial",
    outlineCode: "32020302",
    sourceOutlineCode: "32020302",
    coverageGroup: "fre_403_insurance_policy_purpose",
    seedBucket: "medium_friction",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "May the judge allow targeted bias inquiry while excluding a time-consuming collateral presentation under Rule 403?",
    stem:
      "In a federal contract trial, Naomi wants to impeach a witness by showing that the witness has been hostile toward her for years. Naomi offers to call seven witnesses and introduce records, emails, and accountant testimony about a separate business dispute between Naomi and the witness. The judge allows Naomi to ask the witness directly about hostility but excludes the seven-witness side presentation under Rule 403. Was the exclusion proper?",
    choices: [
      {
        letter: "A",
        text: "No, because bias evidence can never be limited.",
        verdict: "trap",
        mold: "flat_misstatement / bias-is-untouchable trap",
        explanation:
          "A overstates the bias rule. Bias evidence is important, but the method and volume of proof can still be controlled.",
      },
      {
        letter: "B",
        text: "No, because once evidence is relevant to credibility, Rule 403 does not apply.",
        verdict: "trap",
        mold: "flat_misstatement / credibility-immunity trap",
        explanation:
          "B gives credibility evidence immunity it does not have. Rule 403 still applies to credibility proof.",
      },
      {
        letter: "C",
        text: "Yes, because the court may allow targeted bias inquiry while excluding a collateral mini-trial whose time and confusion substantially outweigh added probative value.",
        verdict: "correct",
        mold: "residue / targeted-bias Rule 403 control",
        explanation:
          "C preserves both ideas. The judge lets Naomi ask about hostility but blocks a sprawling side dispute with limited additional value.",
      },
      {
        letter: "D",
        text: "Yes, but only because bias evidence is always inadmissible character evidence.",
        verdict: "trap",
        mold: "wrong_reason / bias-character confusion",
        explanation:
          "D reaches the yes result for the wrong reason. Bias is not barred character evidence; the problem is collateral proof that wastes time and confuses the trial.",
      },
    ],
    answerFlow: [
      "Start with the judge's compromise.",
      "Notice that bias can be tested directly.",
      "Separate bias relevance from proof volume.",
      "Reject the idea that bias evidence can never be limited.",
      "Reject the idea that credibility evidence escapes Rule 403.",
      "Reject the character-evidence label.",
      "Use Rule 403 to control the collateral mini-trial.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "A strong impeachment purpose does not erase Rule 403 control over cumulative or confusing collateral proof.",
      },
      {
        label: "Purple profile",
        body: "The traps treat bias as either untouchable, immune from Rule 403, or wrongly reclassified as character evidence.",
      },
      {
        label: "Blue signal",
        body: "The judge allowed direct hostility questions but excluded seven witnesses and records about a separate dispute.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: thinking relevance to credibility automatically permits every supporting side presentation.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-403-BIAS-MINI-TRIAL-01",
        body: "Bias impeachment is relevant, but Rule 403 lets the judge limit collateral proof that adds little beyond a direct bias inquiry while consuming time or confusing the issues.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PROOF-METHOD-01",
        body: "Separate whether a fact may be explored from how much proof the court must allow to prove it.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-CREDIBILITY-NOT-403-IMMUNE",
        body: "Credibility evidence is not immune from Rule 403 just because it attacks or supports a witness.",
      },
    ],
    leadMeSteps: [
      "Name the purpose: bias impeachment.",
      "Confirm the judge allowed a direct question about hostility.",
      "Spot the proposed seven-witness side presentation.",
      "Treat the side dispute as collateral proof.",
      "Reject bias-is-untouchable language.",
      "Reject credibility immunity from Rule 403.",
      "Reject the character-evidence reason.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Bias Scope",
        prompt:
          "A party may ask a witness directly about hostility. Must the court also allow seven witnesses to prove a separate dispute?",
        answer:
          "No. Rule 403 may limit collateral proof that adds little and creates delay or confusion.",
      },
      {
        title: "Credibility Control",
        prompt:
          "Does evidence become immune from Rule 403 because it relates to witness credibility?",
        answer: "No. Credibility evidence remains subject to Rule 403.",
      },
      {
        title: "Wrong Reason",
        prompt:
          "Why is it wrong to say bias evidence is always inadmissible character evidence?",
        answer:
          "Bias is a proper impeachment purpose; the issue is excessive collateral proof, not character inadmissibility.",
      },
    ],
  },
  {
    questionId: "18503",
    transformId: "18503_barnabas-stipulated-status",
    title: "Stipulation Reduces the 403 Need",
    outlineCode: "32020302",
    sourceOutlineCode: "32020302",
    coverageGroup: "fre_403_insurance_policy_purpose",
    seedBucket: "hard_trap",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "How does a stipulation to a prior-conviction status element affect Rule 403 balancing of the prior judgment's details?",
    stem:
      "Barnabas is charged in federal court with being a felon in possession of a firearm. At a pretrial hearing, Barnabas's lawyer offers a written stipulation that Barnabas has a qualifying prior felony conviction. The prosecutor declines and instead offers a certified copy of the judgment from ten years earlier, which states that Barnabas was convicted of aggravated assault and sentenced to imprisonment. How should the court rule on the details in the judgment?",
    choices: [
      {
        letter: "A",
        text: "Admit the full judgment because the prosecutor is always entitled to prove every element in the most dramatic way.",
        verdict: "trap",
        mold: "wrong_frame / prosecutorial-autonomy overclaim",
        explanation:
          "A overclaims. The prosecutor has to prove the element, but Rule 403 still limits proof whose added value is substantially outweighed by unfair prejudice.",
      },
      {
        letter: "B",
        text: "Exclude the nature and details of the prior conviction if the stipulation supplies the status element and the remaining probative value is substantially outweighed by unfair prejudice.",
        verdict: "correct",
        mold: "residue / stipulated-status Rule 403 balance",
        explanation:
          "B applies the reduced-need step. The stipulation proves status, so the name and details of the prior offense add less probative value and carry more unfair-prejudice risk.",
      },
      {
        letter: "C",
        text: "Admit the judgment only to prove Barnabas's bad character.",
        verdict: "trap",
        mold: "wrong_purpose / character-evidence bleed",
        explanation:
          "C spots the prejudice risk but states a forbidden purpose. The judgment is not admitted to prove bad character.",
      },
      {
        letter: "D",
        text: "Exclude all evidence of the prior conviction, including the fact of a qualifying conviction, because prior convictions are never relevant.",
        verdict: "trap",
        mold: "flat_misstatement / total-ban overclaim",
        explanation:
          "D goes too far. The fact of a qualifying conviction remains relevant to the status element; the issue is the unnecessary details.",
      },
    ],
    answerFlow: [
      "Identify the status element.",
      "Notice the written stipulation supplies that element.",
      "Separate the fact of conviction from the name and details.",
      "Cut the dramatic-proof entitlement overclaim.",
      "Cut the bad-character purpose.",
      "Cut the total-ban answer.",
      "Reweigh the details under Rule 403 after the stipulation reduces their need.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "A stipulation to a status element reduces the probative need for more prejudicial details.",
      },
      {
        label: "Purple profile",
        body: "The traps overprotect prosecution choice, import character evidence, or overban prior convictions.",
      },
      {
        label: "Blue signal",
        body: "Barnabas offers a stipulation that already proves the qualifying-conviction element.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: forgetting that available alternative proof can change the Rule 403 balance.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-STIP-01",
        body: "When a stipulation fully supplies a status element, the probative value of more detailed proof drops; Rule 403 may require the less prejudicial form of proof.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-STATUS-DETAIL-SPLIT-01",
        body: "Split the fact needed for the element from extra details that mainly create prejudice.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-PROSECUTOR-NOT-ALWAYS-DRAMATIC",
        body: "A prosecutor is not always entitled to prove an element through the most dramatic version when less prejudicial proof fully supplies the point.",
      },
    ],
    leadMeSteps: [
      "Name what the government must prove: qualifying-conviction status.",
      "Read the stipulation as supplying that status element.",
      "Ask what the judgment details add.",
      "Weigh the added value against unfair prejudice.",
      "Reject the prosecutor-always-chooses trap.",
      "Reject the bad-character purpose.",
      "Reject the total-ban overclaim.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Status Split",
        prompt:
          "In a felon-in-possession case, what is the difference between the fact of a qualifying conviction and the name of the prior offense?",
        answer:
          "The fact proves the status element; the name may add little after a stipulation and create unfair prejudice.",
      },
      {
        title: "403 Reweigh",
        prompt:
          "How does a complete stipulation affect the probative value of more detailed proof of the same element?",
        answer:
          "It reduces the need for the details, so their probative value drops in the Rule 403 balance.",
      },
      {
        title: "Dramatic Proof Trap",
        prompt:
          "A choice says the prosecutor is always entitled to the most dramatic proof. What word should bother you?",
        answer:
          "Always. Rule 403 is a balancing rule, so absolute entitlement language is suspect.",
      },
    ],
  },
  {
    questionId: "14873",
    transformId: "14873_crossbow_goliath_room",
    title: "404(b): Purpose Beats Propensity",
    outlineCode: "32020404",
    sourceOutlineCode: "32020404",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "medium_friction",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When the defendant claims accident, can prior violent acts against the same victim be admitted to show intent rather than propensity?",
    stem:
      "Daniel is on trial for the murder of Peter, his partner in a privately owned Bible-themed escape room business. Daniel's defense is that an antique crossbow in the David and Goliath room discharged accidentally while he and Peter were resetting props. The prosecutor calls Stephen, the mall's security supervisor, to testify that twice during the year before the incident, he responded to noise alarms from the business's storage bay, found Daniel and Peter in heated arguments, and had to pull Daniel off Peter while Daniel was striking him. The testimony is:",
    choices: [
      {
        letter: "A",
        text: "inadmissible, because Stephen lacks first-hand knowledge of who started the storage-bay arguments.",
        verdict: "trap",
        mold: "wrong_element / side-fact foundation trap",
        explanation:
          "A focuses on who started the prior arguments. Stephen personally observed Daniel striking Peter, and starter identity is not the purpose question.",
      },
      {
        letter: "B",
        text: "admissible to show that Daniel killed Peter intentionally.",
        verdict: "correct",
        mold: "residue / non-propensity intent purpose",
        explanation:
          "B names the permitted purpose. Daniel claims accident, so intent and absence of accident are live issues.",
      },
      {
        letter: "C",
        text: "admissible to show that Daniel is a violent person.",
        verdict: "trap",
        mold: "flat_misstatement / propensity-purpose trap",
        explanation:
          "C gives the forbidden reason. The prior acts cannot be used to prove Daniel is violent and therefore acted violently this time.",
      },
      {
        letter: "D",
        text: "inadmissible, because it is improper character evidence.",
        verdict: "trap",
        mold: "bait_doctrine / character-label panic",
        explanation:
          "D hears the character-evidence danger but stops too early. The offered purpose is intent or absence of accident, not propensity.",
      },
    ],
    answerFlow: [
      "Start with the defense theory: accident.",
      "Ask what fact the prior acts are offered to prove.",
      "Treat intent and absence of accident as live issues.",
      "Cut the who-started-it side fact.",
      "Cut the violent-person propensity answer.",
      "Cut the blanket character-evidence exclusion.",
      "Keep the non-propensity intent purpose.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Purpose controls: prior acts barred for propensity can be admitted for intent or absence of accident when that issue is live.",
      },
      {
        label: "Purple profile",
        body: "The traps either panic at the character label, accept propensity, or chase a side foundation fact.",
      },
      {
        label: "Blue signal",
        body: "Daniel says the crossbow discharge was accidental, so intent is the disputed purpose.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating all prior bad acts as one category instead of reading the offered purpose.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-404B-NONPROPENSITY-01",
        body: "Prior bad acts are not usable for propensity, but they may be used for a non-propensity purpose such as intent or absence of mistake or accident when that purpose is genuinely disputed.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-AXIS-01",
        body: "In a character-evidence array, lock the offered purpose before the admissibility word.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-CHARACTER-LABEL-PANIC",
        body: "Do not stop at 'prior bad act.' Ask whether the answer uses it for propensity or for a permitted non-propensity purpose.",
      },
    ],
    leadMeSteps: [
      "Name the defense theory: accident.",
      "Spot the same-victim prior acts.",
      "Ask what purpose the prosecutor offers them for.",
      "Reject the side-fact foundation answer.",
      "Reject violent-person propensity.",
      "Reject blanket character exclusion.",
      "Use intent and absence of accident.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Purpose Lock",
        prompt:
          "A defendant claims a killing was accidental. Prior violence against the same victim is offered. What permitted 404(b) purpose should you test?",
        answer: "Intent or absence of accident.",
      },
      {
        title: "Character Trap",
        prompt:
          "A choice says prior violence is admissible to show the defendant is violent. What is wrong with that purpose?",
        answer:
          "It is propensity reasoning, which is barred even if the same act could be admitted for intent.",
      },
      {
        title: "Side Fact Cut",
        prompt:
          "The witness saw the defendant strike the victim but does not know who started the argument. Does that decide admissibility?",
        answer:
          "No. The key is the observed act and its offered purpose, not who started the argument.",
      },
    ],
  },
  {
    questionId: "14883",
    transformId: "14883_burning_bible_bookstore",
    title: "404(b): Test Both Offered Acts",
    outlineCode: "32020404",
    sourceOutlineCode: "32020404",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "clean_teaching",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "In an arson case, should the court admit both extra-insurance evidence and a witness threat when each has a noncharacter purpose?",
    stem:
      "Stephen is on trial for arson after a fire destroyed his privately owned Bible bookstore and coffee counter. During its case in chief, the prosecution offers evidence that, two weeks before the fire, Stephen quietly bought overlapping fire-insurance policies from two different companies on the store inventory and fixtures. The prosecution also offers evidence that Stephen told his former wife, Mary, that he would kill her if she testified for the prosecution. The court should admit evidence of",
    choices: [
      {
        letter: "A",
        text: "Stephen's threat to kill Mary only.",
        verdict: "trap",
        mold: "half_truth / threat-only answer",
        explanation:
          "A keeps the witness-threat evidence but wrongly drops the insurance evidence. The overlapping policies supply a motive for arson.",
      },
      {
        letter: "B",
        text: "both Stephen's overlapping fire insurance and his threat to kill Mary.",
        verdict: "correct",
        mold: "residue / both noncharacter purposes",
        explanation:
          "B tests both offered acts. The insurance shows motive, and the threat shows consciousness of guilt and witness suppression.",
      },
      {
        letter: "C",
        text: "neither Stephen's overlapping fire insurance nor his threat to kill Mary.",
        verdict: "trap",
        mold: "flat_misstatement / overbroad 404(b) shutoff",
        explanation:
          "C treats all bad-looking acts as barred. Rule 404(b) blocks propensity use, not every noncharacter use.",
      },
      {
        letter: "D",
        text: "Stephen's overlapping fire insurance only.",
        verdict: "trap",
        mold: "half_truth / insurance-only dominant trap",
        explanation:
          "D sees the obvious motive evidence but stops early. The threat also has a noncharacter purpose as consciousness-of-guilt evidence.",
      },
    ],
    answerFlow: [
      "Recognize the both/only/neither answer array.",
      "Test the insurance evidence first.",
      "Use overlapping coverage as motive for arson.",
      "Test the witness threat separately.",
      "Use the threat as consciousness of guilt or witness suppression.",
      "Reject the broad neither answer.",
      "Reject the one-item half answers.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Other-act evidence can be admitted when each act has a real noncharacter job.",
      },
      {
        label: "Purple profile",
        body: "The traps invite a half answer: insurance only, threat only, or neither because both look bad.",
      },
      {
        label: "Blue signal",
        body: "Insurance before an arson points to motive; threatening a witness points to consciousness of guilt.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: stopping after the most obvious admissible item instead of testing every offered item.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-404B-NONCHARACTER-01",
        body: "Rule 404(b) bars propensity use, but permits other-act evidence offered for a real noncharacter purpose such as motive, plan, knowledge, identity, absence of mistake, or consciousness of guilt.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BOTH-ONLY-ARRAY-01",
        body: "In a two-item admissibility array, decide each item independently before choosing only, both, or neither.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-INSURANCE-ONLY-HALF-ANSWER",
        body: "The obvious motive item does not make the second item inadmissible; ask whether the second item has its own noncharacter job.",
      },
    ],
    leadMeSteps: [
      "Mark the answer array: threat only, both, neither, insurance only.",
      "Give the insurance its job: motive.",
      "Give the threat its job: consciousness of guilt.",
      "Reject neither because both jobs are real.",
      "Reject threat only because insurance matters.",
      "Reject insurance only because witness suppression matters.",
      "Apply 404(b) as a purpose rule, not a total bad-act ban.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Two-Item Array",
        prompt:
          "In an arson trial, the defendant bought extra fire insurance and threatened a prosecution witness. Which item has a noncharacter purpose?",
        answer:
          "Both. Insurance shows motive, and the threat shows consciousness of guilt or witness suppression.",
      },
      {
        title: "404(b) Recall",
        prompt:
          "What does Rule 404(b) block, and what does it allow?",
        answer:
          "It blocks propensity use but allows proper noncharacter purposes such as motive or consciousness of guilt.",
      },
      {
        title: "Half-Answer Cut",
        prompt:
          "Why is an insurance-only answer incomplete in this arson/witness-threat fact pattern?",
        answer:
          "Because the threat also has a noncharacter purpose: consciousness of guilt and witness suppression.",
      },
    ],
  },
  {
    questionId: "14896",
    transformId: "14896_gospel_fair_cashbox",
    title: "404(b): Identity Needs a Bridge",
    outlineCode: "32020404",
    sourceOutlineCode: "32020402",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "recode_or_ambiguous",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When identity is denied, are generic similar prior robberies enough to admit other-act evidence for identity or intent?",
    stem:
      "Lydia ran a mobile Bible-engraving cart at a private gospel-music festival. A masked person robbed her cash box, and Peter is now on trial for armed robbery. Peter's defense is mistaken identity. Before resting the state's case, the prosecutor offers proof that Peter robbed two other vendor cash tables at faith-and-music events during the last eight months. This evidence is",
    choices: [
      {
        letter: "A",
        text: "inadmissible, because its probative value is substantially outweighed by the danger of unfair prejudice.",
        verdict: "correct",
        mold: "residue / no-bridge Rule 403 exclusion",
        explanation:
          "A is the endpoint once the claimed purpose has no bridge. Generic prior robberies mostly invite the forbidden inference that Peter did it before, so he did it now.",
      },
      {
        letter: "B",
        text: "inadmissible, because character must be proved by reputation or opinion and may not be proved by specific acts.",
        verdict: "trap",
        mold: "wrong_layer / method-of-proof trap",
        explanation:
          "B answers a later character-proof method question. The first problem is that the other robberies are not admissible for a valid purpose.",
      },
      {
        letter: "C",
        text: "admissible, to prove Peter's intent and identity.",
        verdict: "trap",
        mold: "bait_doctrine / purpose-label without bridge",
        explanation:
          "C uses real 404(b) labels, but the stem gives no special signature, plan, or other non-propensity bridge from the prior robberies to this robber.",
      },
      {
        letter: "D",
        text: "admissible, to prove a pertinent trait of Peter's character and Peter's action in conformity therewith.",
        verdict: "trap",
        mold: "flat_misstatement / explicit propensity use",
        explanation:
          "D states the forbidden inference directly. Other-act evidence cannot be used to prove character and action in conformity.",
      },
    ],
    answerFlow: [
      "Start with the offered evidence: two prior robberies.",
      "Notice the defense is mistaken identity.",
      "Do not let the word identity do all the work.",
      "Ask for a non-propensity bridge.",
      "Cut the method-of-proof answer as a later layer.",
      "Cut the intent-and-identity label because the bridge is missing.",
      "Cut explicit character-conformity reasoning.",
      "Choose A.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "A permitted 404(b) purpose needs a real non-propensity bridge; same general crime is not enough.",
      },
      {
        label: "Purple profile",
        body: "The traps are exception-label shopping, proof-method distraction, and explicit propensity.",
      },
      {
        label: "Blue signal",
        body: "The prior acts are only other vendor-table robberies; the stem gives no signature or special linking fact.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: buying intent or identity as magic words without checking the factual bridge.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-OTHER-ACTS-PROPENSITY-01",
        body: "Other-act evidence cannot use he did it before, so he did it this time. A listed purpose like identity or intent needs a real non-propensity bridge; same general crime is not enough.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-FIRST-01",
        body: "Pin the offered purpose before buying an exception label; if the label has no factual bridge, treat it as a purpose-axis trap.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-IDENTITY-LABEL-NOT-MAGIC",
        body: "Identity being disputed does not automatically make generic prior crimes admissible identity evidence.",
      },
    ],
    leadMeSteps: [
      "Name the prior acts: two other robberies.",
      "Name the defense: mistaken identity.",
      "Ask whether the prior robberies share a special signature.",
      "Notice the stem gives only generic similarity.",
      "Reject proof-method analysis as too late.",
      "Reject intent and identity without a bridge.",
      "Reject character-conformity reasoning.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Bridge Check",
        prompt:
          "The state offers two generic prior robberies and says identity is disputed. What fact must you find before admitting them for identity?",
        answer:
          "A real non-propensity bridge, such as a distinctive signature or special linking method.",
      },
      {
        title: "Layer Order",
        prompt:
          "A choice talks about reputation or opinion proof for character. What should you decide first?",
        answer:
          "Whether the evidence is admissible for a valid purpose at all.",
      },
      {
        title: "Propensity Cut",
        prompt:
          "Why is 'he robbed before, so he robbed now' not a valid purpose?",
        answer:
          "It is character-conformity reasoning, which Rule 404 blocks.",
      },
    ],
  },
  {
    questionId: "19579",
    transformId: "19579_grace_chapel",
    title: "Entrapment Opens Predisposition Proof",
    outlineCode: "32020404",
    sourceOutlineCode: "32020404",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a defendant raises entrapment, may the prosecution use prior similar sales to prove predisposition?",
    stem:
      "At a private Christian university, President Elias suspected that some students were selling illegal drugs on campus and requested state-police help. An undercover officer, Silas, enrolled as a transfer student and became friendly with Timothy, who was rumored among dorm residents to be involved in drug sales. After Timothy twice denied knowing anything about drugs, Silas kept pressing and offered $50 for a small packet. Timothy then handed Silas the packet and accepted the money. Timothy was arrested and charged with an unauthorized drug sale. At trial, Timothy raised the defense of entrapment. The prosecution called three dorm residents, Peter, John, and Lydia, who each testified that they had previously bought the same drug from Timothy that semester. Timothy's attorney objected. The objection should have been",
    choices: [
      {
        letter: "A",
        text: "overruled, since evidence of past conduct is relevant to establish that a defendant engaged in criminal behavior on a particular occasion.",
        verdict: "trap",
        mold: "flat_misstatement / propensity-purpose trap",
        explanation:
          "A gives the wrong reason. Prior acts cannot come in just to prove Timothy acted the same way on the charged occasion.",
      },
      {
        letter: "B",
        text: "overruled, since such evidence would tend to prove that Timothy was predisposed to commit the crime with which he has been charged.",
        verdict: "correct",
        mold: "residue / entrapment-predisposition purpose",
        explanation:
          "B names the purpose opened by the defense. Once Timothy raises entrapment, prior similar sales can rebut it by showing predisposition.",
      },
      {
        letter: "C",
        text: "sustained, since character evidence is not admissible against a defendant in a criminal proceeding.",
        verdict: "trap",
        mold: "overclaim / absolute-character-ban trap",
        explanation:
          "C states the character rule too broadly. Other-act evidence may be admitted for a permitted noncharacter purpose.",
      },
      {
        letter: "D",
        text: "sustained, since proof of unconvicted bad acts is not admissible for the purpose of establishing a person's character.",
        verdict: "trap",
        mold: "half_truth / general-rule trap",
        explanation:
          "D states a true general prohibition but misses the offered purpose. The prior sales are offered to prove predisposition after entrapment is raised, not character.",
      },
    ],
    answerFlow: [
      "Start with the objection to prior-buyer testimony.",
      "Spot the defense: entrapment.",
      "Name what entrapment puts in issue: predisposition.",
      "Cut the pure propensity reason.",
      "Cut the absolute character ban.",
      "Cut the unconvicted-acts half truth.",
      "Use the prior similar sales for predisposition.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Entrapment changes the purpose of prior similar acts: predisposition becomes a live noncharacter issue.",
      },
      {
        label: "Purple profile",
        body: "The traps recite general character limits but miss the defense-triggered purpose.",
      },
      {
        label: "Blue signal",
        body: "Timothy raised entrapment, so the prosecution may answer with evidence that he was already predisposed.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: stopping at the prior-bad-acts rule without asking what the defense put in issue.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PREDISPOSITION-01",
        body: "When the defendant claims entrapment, prior similar acts may be admitted under Rule 404(b) to prove predisposition, a non-propensity purpose.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-PURPOSE-01",
        body: "When two admissibility choices survive, name the offered purpose; the entrapment fact decides whether prior acts are character or predisposition proof.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-UNCONVICTED-ACTS-HALF-TRUTH",
        body: "A true statement about unconvicted bad acts can still lose when the acts are offered for a permitted noncharacter purpose.",
      },
    ],
    leadMeSteps: [
      "Read the objection target: prior similar sales.",
      "Find the defense: entrapment.",
      "Ask what entrapment puts in dispute.",
      "Use predisposition as the live purpose.",
      "Reject past-conduct propensity.",
      "Reject absolute character-ban language.",
      "Reject the unconvicted-acts half truth.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Entrapment Trigger",
        prompt:
          "A defendant raises entrapment and the prosecution offers prior similar sales. What purpose should you test?",
        answer: "Predisposition to commit the charged crime.",
      },
      {
        title: "Propensity Reason",
        prompt:
          "Why is 'past conduct proves he did it this time' the wrong reason?",
        answer:
          "That is propensity reasoning; the admissible purpose is predisposition after entrapment is raised.",
      },
      {
        title: "Half-Truth Cut",
        prompt:
          "A choice says unconvicted bad acts cannot prove character. Why can that still be wrong here?",
        answer:
          "Because the prosecution is not offering the acts for character; it is offering them to rebut entrapment by showing predisposition.",
      },
    ],
  },
  {
    questionId: "22231",
    transformId: "22231_revival_bus_cards",
    title: "Plan Theory Beats Propensity",
    outlineCode: "32020404",
    sourceOutlineCode: "32020404",
    coverageGroup: "adjacent_pilot_code",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a defendant used one payment card fraudulently and police found dozens more cards in other names plus matching IDs, can the prosecutor use that stash to show a broader fraud plan rather than bad character?",
    stem:
      "The defendant was arrested after she used a fleet fuel card bearing the name Lydia Harper to pay for diesel for a charter bus headed to a regional revival concert. She was later charged with fraudulent use of a payment card. At trial, a police officer testified that when he arrested the defendant, he found seven fleet fuel cards bearing Lydia Harper's name and 34 other fuel cards bearing 34 different names. He also found driver's licenses matching each of the names on the cards. If defense counsel moves to exclude evidence that the defendant possessed cards or driver's licenses other than the card she was charged with fraudulently using, which argument would be the prosecutor's most effective response?",
    choices: [
      {
        letter: "A",
        text: "The number of fuel cards in the defendant's possession makes it likely that she stole them.",
        verdict: "trap",
        mold: "misfit / uncharged-theft propensity detour",
        explanation:
          "A feels powerful because the stash makes theft seem likely. The defect is that theft is not the fact of consequence for the charged fraudulent use, so the answer depends on forbidden propensity reasoning.",
      },
      {
        letter: "B",
        text: "The defendant's possession of 41 fuel cards in names other than her own counts as an admission by conduct.",
        verdict: "trap",
        mold: "bait_doctrine / wrong evidence label",
        explanation:
          "B uses a real evidence label, but these facts do not show consciousness of guilt for the charged swipe. Mere possession of more cards is not conduct like flight, concealment, or a bribe.",
      },
      {
        letter: "C",
        text: "The number of fuel cards and matching driver's licenses in the defendant's possession tends to show a larger fraud plan.",
        verdict: "correct",
        mold: "residue / 404(b) plan purpose",
        explanation:
          "C gives the stash a noncharacter job tied to the charged offense. The prosecutor can argue that the charged use was part of a coordinated fraud plan, subject to ordinary Rule 403 balancing.",
      },
      {
        letter: "D",
        text: "Once that many cards were found, the defendant had to explain why she had them.",
        verdict: "trap",
        mold: "backwards / unconstitutional burden shift",
        explanation:
          "D appeals to common-sense suspicion, but the prosecutor cannot make a criminal defendant explain incriminating possession. The admissibility theory has to stand without forcing the defendant to testify.",
      },
    ],
    answerFlow: [
      "Start with the evidence the prosecutor wants: extra cards and matching IDs.",
      "Identify the charge: fraudulent use of one payment card.",
      "Ask what lawful job the extra stash does for that charge.",
      "Cut the stolen-card answer because it proves another possible crime.",
      "Cut admission by conduct because possession is not consciousness of guilt.",
      "Cut the forced-explanation answer because the defendant does not have to testify.",
      "Keep the answer that ties the stash to a larger fraud plan.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Other acts may show plan only when the plan theory does work beyond a bad-character inference.",
      },
      {
        label: "Purple profile",
        body: "The traps are uncharged-crime suspicion, doctrine-label shopping, and burden shifting.",
      },
      {
        label: "Blue signal",
        body: "The matching cards and licenses can explain the charged swipe as one step in a broader fraud setup.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating highly suspicious evidence as automatically admissible.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-EVIDENCE-PLAN-NONCHARACTER-01",
        body: "Other-act evidence can be admitted for a real noncharacter purpose like plan, but not merely to prove the defendant is the kind of person who commits crimes.",
      },
      {
        kind: "Silver Key",
        id: "SK-EVIDENCE-BEST-RESPONSE-01",
        body: "When the call asks for the prosecutor's best response to exclusion, choose the theory that connects the extra acts to the charged offense itself.",
      },
      {
        kind: "Trap Key",
        id: "TK-EVIDENCE-SUSPICION-NOT-PURPOSE",
        body: "A fact can be suspicious and still fail if the answer only uses it to prove another bad act or general criminality.",
      },
    ],
    leadMeSteps: [
      "Name the extra evidence: more cards and matching IDs.",
      "Name the offered use: the prosecutor wants to defeat exclusion.",
      "Separate plan from propensity.",
      "Reject the stolen-card detour.",
      "Reject admission by conduct.",
      "Reject any answer that forces the defendant to explain.",
      "Use the plan theory tied to the charged fraudulent use.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Plan Job",
        prompt:
          "Why does a stash of matching cards and IDs help the prosecutor more as plan evidence than as theft evidence?",
        answer:
          "Plan evidence gives the stash a noncharacter job tied to the charged fraud; theft evidence only invites a forbidden propensity jump.",
      },
      {
        title: "Best Response Call",
        prompt:
          "When the call asks for the prosecutor's best response to exclusion, what should the winning answer do?",
        answer:
          "It should name a valid admissibility theory that connects the extra evidence to the charged offense.",
      },
      {
        title: "Burden Shift",
        prompt:
          "Why is an answer requiring the defendant to explain suspicious possession a bad move in a criminal case?",
        answer:
          "A criminal defendant cannot be forced to testify or explain incriminating facts.",
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
