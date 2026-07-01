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
