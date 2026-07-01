import type { ConLawSeedCandidate } from "./conlaw-seed-candidates";

type Choice = {
  letter: string;
  text: string;
  verdict: "correct" | "trap";
  mold: string;
  explanation: string;
};

type Lock = {
  label: string;
  body: string;
};

type Key = {
  kind: string;
  id: string;
  body: string;
};

type DrillSeed = {
  title: string;
  prompt: string;
  answer: string;
};

export type ConLawQuestionDetail = {
  questionId: string;
  transformId: string;
  title: string;
  selectorCode: string;
  selectorMatch: ConLawSeedCandidate["selector_match"];
  outlineCode: string;
  sourceOutlineCode: string;
  coverageGroup: string;
  seedBucket: string;
  key: string;
  reviewStatus: string;
  distilledCoreQuestion: string;
  stem: string;
  choices: Choice[];
  answerFlow: string[];
  locks: Lock[];
  keys: Key[];
  leadMeSteps: string[];
  drillSeeds: DrillSeed[];
};

export const conLawQuestionDetails: ConLawQuestionDetail[] = [
  {
    questionId: "14293",
    transformId: "14293_mootness-live-stream",
    title: "Mootness Ends the Streaming Fight",
    selectorCode: "43020201",
    selectorMatch: "exact",
    outlineCode: "43020201",
    sourceOutlineCode: "43020201",
    coverageGroup: "standing_ripeness_mootness_gate",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a plaintiff seeks only an injunction to resume a live-streamed trial, and the trial ends before the federal case is heard, should the court dismiss as moot?",
    stem:
      "Timothy, a church deacon, paid $1,200 for a premium online streaming subscription solely to watch the live broadcast of a high-profile criminal trial in state court. The trial judge had initially permitted live streaming but abruptly ordered it stopped midway through the proceedings, concluding that the streaming was prejudicing the jury. Timothy filed suit in federal district court against the trial judge, seeking only an injunction to resume the live broadcast. He alleged that the judge's order deprived him of his $1,200 streaming investment without due process of law. Before Timothy's federal case was heard, the criminal trial concluded with a conviction and sentence. No obvious errors tainted the criminal proceedings. The judge in Timothy's federal case moved to dismiss. The most proper disposition of the motion to dismiss is to:",
    choices: [
      {
        letter: "A",
        text: "Defer action until after the state Supreme Court rules on the proper disposition, because state law of mootness governs suits in federal court when the federal case is intertwined with a state proceeding.",
        verdict: "trap",
        mold: "wrong frame / state-law justiciability",
        explanation:
          "A sounds cautious, but federal mootness is an Article III case-or-controversy doctrine. State mootness law does not control federal jurisdiction.",
      },
      {
        letter: "B",
        text: "Grant the motion, because the subject matter of the controversy has ceased to exist and there is no strong likelihood that it will be revived.",
        verdict: "correct",
        mold: "residue / live controversy ended",
        explanation:
          "B is the clean answer. Timothy sought an injunction to resume a live broadcast of a trial that has already ended, and no exception keeps the controversy alive.",
      },
      {
        letter: "C",
        text: "Deny the motion, because Timothy raised an important constitutional question about whether his streaming investment is property protected by the Fourteenth Amendment.",
        verdict: "trap",
        mold: "merits bait / federal question overclaim",
        explanation:
          "C jumps to the due process merits. A federal question cannot be decided unless Article III still supplies a live case or controversy.",
      },
      {
        letter: "D",
        text: "Defer action until after any appellate proceedings in the criminal case conclude, because the conviction might be set aside and the streaming issue could resurface.",
        verdict: "trap",
        mold: "remote hypothetical / capable-of-repetition overclaim",
        explanation:
          "D is the dominant trap. A theoretical chance of a new trial is not a strong likelihood that Timothy will face the same injury again.",
      },
    ],
    answerFlow: [
      "Start with the relief Timothy asks for: an injunction to resume the live broadcast.",
      "The criminal trial has already ended with conviction and sentencing.",
      "Ask whether the federal court can still grant the requested relief.",
      "Because it cannot, Article III mootness defeats jurisdiction unless an exception applies.",
      "Cut state-law mootness because federal justiciability is not governed by state law.",
      "Cut constitutional-question bait because merits importance does not revive a moot case.",
      "Cut appellate speculation because no strong likelihood of recurrence is shown.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Mootness asks whether the court can still grant effective relief; if the requested event is over, the case is usually gone.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with state-court deference, constitutional merits, and remote appellate possibilities.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is not the streaming payment; it is that the trial Timothy wanted streamed has already ended.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: reaching the constitutional merits before checking Article III justiciability.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-MOOT-01",
        body: "A federal question still needs a live case or controversy; mootness removes jurisdiction even when the issue sounds constitutional.",
      },
      {
        kind: "Gold Key",
        id: "GK-CONLAW-MOOT-02",
        body: "Capable of repetition requires a reasonable expectation of recurrence, not a remote possibility of appellate reversal.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-MOOT-RELIEF-01",
        body: "For mootness, ask first whether the court can still give the plaintiff the exact relief requested.",
      },
    ],
    leadMeSteps: [
      "Name the requested relief.",
      "Ask whether the event has already ended.",
      "Ask whether effective relief remains possible.",
      "Check the capable-of-repetition exception.",
      "Reject important-constitutional-question bait.",
      "Reject remote appellate speculation.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Mootness Trigger",
        prompt:
          "A plaintiff seeks an injunction to resume an event, but the event ends before the case is heard. What is the first justiciability issue?",
        answer:
          "Mootness. The court must ask whether it can still grant effective relief.",
      },
      {
        title: "Federal Question Trap",
        prompt:
          "Why does an important constitutional question not save an otherwise moot case?",
        answer:
          "Article III still requires a live case or controversy. A federal question alone is not enough.",
      },
      {
        title: "Remote Appeal Trap",
        prompt:
          "Does a theoretical chance that a conviction could be reversed defeat mootness?",
        answer:
          "No. Capable of repetition requires a reasonable expectation of recurrence, not a remote possibility.",
      },
    ],
  },
  {
    questionId: "14294",
    transformId: "14294_bible_quiz_uprising",
    title: "State Ground Ends Federal Review",
    selectorCode: "43020201",
    selectorMatch: "exact",
    outlineCode: "43020201",
    sourceOutlineCode: "43020201",
    coverageGroup: "standing_ripeness_mootness_gate",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a state supreme court reverses a conviction under its own state constitution and says it need not decide the federal free-speech issue, what should the United States Supreme Court do after granting certiorari?",
    stem:
      "Peter has a fierce temper and a voice that carries across a hall. At a privately run Christian Bible quiz finals, several close scoring rulings went against Peter's favorite youth team. Peter repeatedly stood on his folding chair, swung a rolled program overhead, and angrily shouted, \"Throw the quiz officials out!\" The third time he did this, many other spectators also rose from their seats, waved programs, and shouted, \"Throw the quiz officials out!\" Peter's favorite team lost the match. Although no violence occurred, spectators pressed menacingly around the quiz officials after the event. The officials were able to leave the hall only with the help of a large police escort. For his conduct, Peter was charged with inciting to riot and was convicted in a jury trial in state court. He appealed. The state supreme court reversed the conviction. In its opinion, the court discussed in detail decisions of the United States Supreme Court dealing with the First Amendment Free Speech Clause as incorporated into the Fourteenth Amendment. At the end of that discussion, however, the court stated that it need not decide how those federal cases would resolve Peter's case. Instead, the court stated that it had always interpreted the free-expression guarantee of the state constitution more broadly than the federal guarantee, and that because no riot or other violence occurred, the state constitution did not permit the conviction for incitement to riot to stand. The United States Supreme Court grants a writ of certiorari to review this decision of the state supreme court. In this case, the United States Supreme Court should:",
    choices: [
      {
        letter: "A",
        text: "Remand the case to the state supreme court with directions that it resolve the First and Fourteenth Amendment free-speech issue that it discussed in such detail.",
        verdict: "trap",
        mold: "procedural remand bait / federal discussion overclaim",
        explanation:
          "A is the dominant trap. The state court discussed federal law, but it clearly said state constitutional law independently controlled the judgment.",
      },
      {
        letter: "B",
        text: "Dismiss the writ as improvidently granted, because the state supreme court's decision rests on an independent and adequate state law ground.",
        verdict: "correct",
        mold: "jurisdictional exit / independent state ground",
        explanation:
          "B matches the posture. A clear state constitutional ground independently supports reversal, so a federal merits ruling would not change the judgment.",
      },
      {
        letter: "C",
        text: "Reverse the decision of the state supreme court, because incitement to imminent crowd violence is not speech protected by the First and Fourteenth Amendments.",
        verdict: "trap",
        mold: "merits bait / unprotected-speech reversal",
        explanation:
          "C answers the federal incitement merits. The Court should not reach that issue once the state-law ground independently supports the result.",
      },
      {
        letter: "D",
        text: "Affirm the state supreme court's decision, because Peter's heated festival outburst was commonplace hyperbole that cannot, consistently with the First and Fourteenth Amendments, be punished.",
        verdict: "trap",
        mold: "right-result wrong-verb / protected-speech affirmance",
        explanation:
          "D gives Peter the same practical win, but for the wrong reason. The proper action is dismissal, not federal merits affirmance.",
      },
    ],
    answerFlow: [
      "Start with the call: what should the United States Supreme Court do after granting certiorari?",
      "Notice that the state supreme court discussed federal free-speech cases.",
      "Then lock the decisive sentence: the state court said it need not decide the federal issue.",
      "The court rested the reversal on a broader state constitutional free-expression guarantee.",
      "That state ground is independent of federal law and adequate to support the judgment.",
      "Cut remand because the state court already gave a clear state-law ground.",
      "Cut both merits answers because federal speech doctrine would not change the state judgment.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Supreme Court review stops when a state judgment rests on a clear state-law ground that independently supports the result.",
      },
      {
        label: "Purple profile",
        body: "The answer set offers remand bait plus two federal free-speech merits answers before the jurisdictional exit.",
      },
      {
        label: "Blue signal",
        body: "The decisive signal is the state court's plain statement that state constitutional law, not federal law, controls.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: chasing vivid First Amendment facts before choosing the Supreme Court action verb.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STATE-GROUNDS-01",
        body: "When a state supreme court clearly rests its judgment on a state constitutional ground that is independent of federal law and adequate to support the result, the United States Supreme Court dismisses rather than decides the federal issue.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-COURT-ACTION-01",
        body: "On a Supreme Court disposition call, choose the action verb before touching the merits: dismiss, affirm, reverse, and remand do different work.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FEDERAL-DISCUSSION-01",
        body: "A state opinion can discuss federal cases without making federal law the ground of decision.",
      },
    ],
    leadMeSteps: [
      "Name the reviewing court.",
      "Name the action verb the call asks for.",
      "Find whether the state court relied on federal law or state law.",
      "Ask whether the state ground independently supports the judgment.",
      "Reject remand if the state-law ground is already clear.",
      "Reject federal merits answers.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Plain State Ground",
        prompt:
          "A state supreme court discusses federal law, then says its state constitution independently requires the same judgment. What should the United States Supreme Court do?",
        answer:
          "Dismiss the writ because the judgment rests on an independent and adequate state ground.",
      },
      {
        title: "Federal Discussion Trap",
        prompt:
          "Does detailed discussion of federal cases automatically make the state judgment reviewable on federal grounds?",
        answer:
          "No. The controlling question is whether federal law actually supports the judgment or whether a clear independent state ground does.",
      },
      {
        title: "Merits Bait Cut",
        prompt:
          "Why are federal free-speech answers wrong when a state constitutional ground independently supports the judgment?",
        answer:
          "Because deciding federal merits would not change the state judgment; the Court should not issue an advisory opinion.",
      },
    ],
  },
  {
    questionId: "20714",
    transformId: "20714_prayer_robotics_kits",
    title: "Taxpayer Standing Has a Narrow Door",
    selectorCode: "43020201",
    selectorMatch: "exact",
    outlineCode: "43020201",
    sourceOutlineCode: "43020201",
    coverageGroup: "standing_ripeness_mootness_gate",
    seedBucket: "needs_human_review",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A federal taxpayer challenges a congressional spending program that gives neutral materials to public and church-affiliated private recipients, claiming an Establishment Clause violation. Does the taxpayer have standing?",
    stem:
      "After reports that teenagers at weekend robotics competitions are injuring themselves while soldering circuit boards, Congress enacts a provision distributing free soldering-safety kits to participants in public programs and private youth academies. The kits contain goggles, burn pads, and safety cards; they contain no prayer, worship material, or religious instruction. In many states, most private youth academies are church-affiliated. Lydia, a federal taxpayer, challenges the provision, arguing that it unconstitutionally supports religious entities. Does Lydia have standing to make the challenge?",
    choices: [
      {
        letter: "A",
        text: "No, because Lydia has not shown the required nexus between her taxpayer status and the safety-kit expenditures.",
        verdict: "trap",
        mold: "backwards / missing-nexus overread",
        explanation:
          "A sounds technical, but the spending-power connection is supplied by the facts: congressional spending challenged under an Establishment Clause limit.",
      },
      {
        letter: "B",
        text: "Yes, because any federal taxpayer may challenge a congressional spending authorization.",
        verdict: "trap",
        mold: "overclaim / any-taxpayer myth",
        explanation:
          "B is too broad. Federal taxpayer standing is generally barred; this item turns on a narrow exception, not an open gate.",
      },
      {
        letter: "C",
        text: "No, because there is no proof that any money freed up by the free kits will be used for religious purposes.",
        verdict: "trap",
        mold: "wrong element / merits proof on a standing call",
        explanation:
          "C litigates whether religious support has been proved. The call asks whether Lydia may bring the challenge at all.",
      },
      {
        letter: "D",
        text: "Yes, because the challenge alleges a possible violation of a specific constitutional limit on Congress's spending power.",
        verdict: "correct",
        mold: "exception / congressional spending plus Establishment Clause",
        explanation:
          "D fits the narrow taxpayer-standing exception: congressional spending plus an alleged violation of a specific constitutional limit on that spending power.",
      },
    ],
    answerFlow: [
      "Start with the call: standing, not Establishment Clause merits.",
      "The actor is Congress, and the provision distributes federally funded safety kits.",
      "Lydia is suing as a federal taxpayer.",
      "General taxpayer status is usually too attenuated for Article III standing.",
      "The narrow exception is congressional taxing-and-spending action challenged under a specific constitutional limit.",
      "The Establishment Clause is the classic trigger for that exception.",
      "Cut any-taxpayer language and downstream religious-use proof.",
      "Choose D.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Taxpayer standing is a threshold question; decide entry to court before deciding whether the aid is unconstitutional.",
      },
      {
        label: "Purple profile",
        body: "The answer set creates a two-yes/two-no split: one overbroad yes, one merits-proof no, one technical no, and one narrow-exception yes.",
      },
      {
        label: "Blue signal",
        body: "The key signal is federal taxpayer plus congressional spending plus an Establishment Clause challenge.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating taxpayer standing as either always available or never available.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-FLAST-SPENDING-01",
        body: "Federal taxpayers generally lack standing, but they may challenge a congressional taxing-and-spending enactment when the claim alleges violation of a specific constitutional limit on that spending power; the Establishment Clause is the classic trigger.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-STANDING-MERITS-01",
        body: "On a standing call, separate entry-to-court from whether the plaintiff will win the constitutional merits.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-OVERCLAIM-ANY-TAXPAYER-01",
        body: "The phrase any federal taxpayer is usually too broad; look for the narrow exception facts.",
      },
    ],
    leadMeSteps: [
      "Name the call as standing.",
      "Identify the plaintiff's status as a federal taxpayer.",
      "Identify the challenged action as congressional spending.",
      "Identify the constitutional limit as the Establishment Clause.",
      "Reject any-taxpayer overclaim.",
      "Reject merits-proof bait.",
      "Pick D.",
    ],
    drillSeeds: [
      {
        title: "Flast Trigger",
        prompt:
          "A federal taxpayer challenges congressional spending as violating the Establishment Clause. What standing exception is triggered?",
        answer:
          "The narrow Flast taxpayer-standing exception for congressional spending challenged under a specific constitutional limit.",
      },
      {
        title: "Any Taxpayer Trap",
        prompt:
          "A choice says any federal taxpayer may challenge any congressional spending. What is wrong with it?",
        answer:
          "It overclaims. Federal taxpayer standing is generally barred and allowed only in narrow circumstances.",
      },
      {
        title: "Standing Versus Merits",
        prompt:
          "Why does lack of proof that freed-up money will be used for religion not defeat standing here?",
        answer:
          "That is a merits/proof issue. Standing turns on congressional spending plus the Establishment Clause challenge.",
      },
    ],
  },
  {
    questionId: "22590",
    transformId: "22590_good_neighbor_shuttle",
    title: "Ripeness Before Merits",
    selectorCode: "43020201",
    selectorMatch: "exact",
    outlineCode: "43020201",
    sourceOutlineCode: "43020201",
    coverageGroup: "standing_ripeness_mootness_gate",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Can a federal court decide a pre-enforcement challenge to possible retroactive penalties when the city has not imposed them and may never do so?",
    stem:
      "A city enacted a Good Neighbor Shuttle program for private shuttle companies that use curb lanes outside a city-owned civic center. The program required each shuttle to display a small window decal listing a city phone number for traffic, safety, and noise complaints. A national association of shuttle companies, including companies owned by Lydia, Barnabas, and Timothy, sued the city in federal court, arguing that the program was unfair and unconstitutional. The city agreed not to enforce the decal rule while that litigation was pending, and the rule was ultimately upheld. After the rule was upheld, the association filed a new suit to stop the city from penalizing companies for failing to display the decals while the earlier litigation was pending. The city has not imposed any such penalties. The city moved to dismiss the new claim. How should the court rule?",
    choices: [
      {
        letter: "A",
        text: "Grant the motion, because the association's claim depends on penalties the city has not imposed and may never impose.",
        verdict: "correct",
        mold: "ripe timing answer / missing enforcement event",
        explanation:
          "A is the only answer that uses the missing event. The city has not imposed the feared penalties, so the dispute depends on contingent future enforcement.",
      },
      {
        letter: "B",
        text: "Deny the motion, because Article I, Section 10 prohibits ex post facto laws.",
        verdict: "trap",
        mold: "merits bait / ex post facto label",
        explanation:
          "B jumps to whether a retroactive penalty would be unconstitutional. The court first has to ask whether there is a ripe enforcement dispute.",
      },
      {
        letter: "C",
        text: "Grant the motion, because no state court has yet ruled on the city's shuttle program.",
        verdict: "trap",
        mold: "fabricated rule / state-court waiting requirement",
        explanation:
          "C invents the wrong procedural reason. The problem is missing concrete enforcement, not missing state-court review.",
      },
      {
        letter: "D",
        text: "Deny the motion, because the city program affects companies that operate in interstate commerce.",
        verdict: "trap",
        mold: "merits bait / commerce frame",
        explanation:
          "D is the dominant trap. Interstate commerce might matter in another challenge, but it does not make this contingent penalty claim ripe.",
      },
    ],
    answerFlow: [
      "Start with the motion: the city asks to dismiss the new claim.",
      "The association wants protection from penalties for the earlier litigation period.",
      "The rule was upheld, which tempts a merits fight about what the city can do next.",
      "But the city has not imposed those penalties.",
      "Ask whether the claim depends on future enforcement that may never occur.",
      "Because it does, the claim is premature under ripeness doctrine.",
      "Cut ex post facto, state-court-first, and interstate-commerce bait.",
      "Choose A.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Ripeness asks whether the court can decide the dispute now; contingent future enforcement is usually too early.",
      },
      {
        label: "Purple profile",
        body: "The answer set offers one timing answer against three merits or procedural bait answers.",
      },
      {
        label: "Blue signal",
        body: "The decisive phrase is that the city has not imposed any such penalties.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: chasing constitutional labels before checking whether the feared enforcement has happened.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-RIPENESS-CONTINGENT-01",
        body: "A federal court does not decide a claim that depends on future government enforcement the government has not yet attempted and may never attempt.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CALL-TIMING-01",
        body: "On a motion-to-dismiss call, check whether the court can hear the dispute now before chasing merits labels in the answer choices.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-MERITS-BAIT-01",
        body: "Commerce, ex post facto, and similar labels can be legally meaningful but still lose when the justiciability gate is closed.",
      },
    ],
    leadMeSteps: [
      "Name the requested ruling.",
      "Identify the feared penalty.",
      "Ask whether the city has imposed or clearly threatened that penalty.",
      "Label the missing event as a ripeness problem.",
      "Reject merits labels.",
      "Reject state-court-first bait.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Contingent Enforcement",
        prompt:
          "A plaintiff asks a federal court to block a penalty the city has not imposed and may never impose. What justiciability issue comes first?",
        answer: "Ripeness. The claim depends on contingent future enforcement.",
      },
      {
        title: "Merits Bait Cut",
        prompt:
          "Why should a commerce-based answer be cut when the city has not imposed the feared penalty?",
        answer:
          "It answers the merits before the claim is ready for adjudication.",
      },
      {
        title: "State-Court Myth",
        prompt:
          "Does a federal court have to wait for a state court before deciding every local-rule constitutional challenge?",
        answer:
          "No. The ripeness defect here is the missing enforcement event, not the absence of state-court review.",
      },
    ],
  },
  {
    questionId: "22611",
    transformId: "22611_state-id-church-roster",
    title: "Speculative Chill Is Not Ripe",
    selectorCode: "43020201",
    selectorMatch: "exact",
    outlineCode: "43020201",
    sourceOutlineCode: "43020201",
    coverageGroup: "standing_ripeness_mootness_gate",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Can a federal court hear a First Amendment chilling-effect claim when the plaintiff alleges only the existence of a government roster and no objective harm or specific threat?",
    stem:
      "A state community services department keeps a Community Participation Roster that lists residents who attend public volunteer trainings, join neighborhood-safety briefings, or serve in outreach programs. The roster is kept by state agency staff and may be reviewed by program directors. David, a resident who appears on the roster, files suit in federal court against the responsible state officials, seeking an injunction to stop the practice. David alleges that because nearly every active volunteer appears on the roster, the file is likely to chill his First Amendment rights of speech and association. David has never been denied any benefit, disciplined, or threatened with adverse action because of the roster. What is the clearest reason for dismissing David's suit?",
    choices: [
      {
        letter: "A",
        text: "The creation of a community participation roster involves the resolution of a political question.",
        verdict: "trap",
        mold: "political-question overclaim / wrong justiciability doctrine",
        explanation:
          "A uses a real doctrine in the wrong place. A First Amendment challenge to a state roster gives courts manageable legal standards.",
      },
      {
        letter: "B",
        text: "The action is unripe.",
        verdict: "correct",
        mold: "ripeness answer / speculative chill without objective harm",
        explanation:
          "B is correct. David alleges only a possible chill from the roster's existence, with no objective harm and no specific threat of future harm.",
      },
      {
        letter: "C",
        text: "Under the Eleventh Amendment, state officials are immune to lawsuits of this kind.",
        verdict: "trap",
        mold: "sovereign-immunity overclaim / injunction exception ignored",
        explanation:
          "C is the dominant trap. The word state tempts immunity, but an injunction against officials for ongoing unconstitutional conduct is not barred merely because officials are named.",
      },
      {
        letter: "D",
        text: "The question presented is moot.",
        verdict: "trap",
        mold: "timing-doctrine confusion / already-over instead of too-early",
        explanation:
          "D picks the wrong timing doctrine. Mootness means the controversy has ended; this dispute is live but too speculative.",
      },
    ],
    answerFlow: [
      "Start with the call: clearest reason for dismissal.",
      "David alleges a chilling effect from a government roster.",
      "The stem gives no denied benefit, discipline, or threat.",
      "That makes the alleged injury speculative rather than concrete.",
      "Label the timing problem as ripeness.",
      "Cut political-question, immunity, and mootness bait.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Ripeness asks whether the court should decide the dispute now; a subjective chill without objective harm is too early.",
      },
      {
        label: "Purple profile",
        body: "The answer set pits one timing answer against three familiar justiciability labels.",
      },
      {
        label: "Blue signal",
        body: "The decisive negative fact is that David has never been denied a benefit, disciplined, or threatened.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating every constitutional concern as a court-ready injury.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-RIPENESS-SPECULATIVE-CHILL-01",
        body: "A subjective chilling effect from a government data practice is not enough by itself; the plaintiff needs objective harm or a specific threat of future harm before the case is court-ready.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-RIPENESS-01",
        body: "When a plaintiff challenges the mere existence of a data-collection practice, ask whether anything has actually happened to the plaintiff yet.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-RIPENESS-MOOTNESS-01",
        body: "Unripe means too early; moot means already over. Do not use mootness when the practice still exists.",
      },
    ],
    leadMeSteps: [
      "Name the requested dismissal ground.",
      "Identify the asserted injury as a chilling effect.",
      "Find the missing harm or threat.",
      "Sort the timing doctrine: too early, not already over.",
      "Reject immunity and political-question labels.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Subjective Chill",
        prompt:
          "A plaintiff says a state file chills his First Amendment activity, but he has not been punished or threatened. What justiciability problem appears first?",
        answer:
          "Ripeness. A subjective chill without objective harm or a specific threat is too speculative.",
      },
      {
        title: "Too Early Or Already Over",
        prompt:
          "The challenged roster still exists, but no one has acted against the plaintiff. Is the timing problem mootness or ripeness?",
        answer:
          "Ripeness. Mootness is for disputes that have already ended.",
      },
      {
        title: "Immunity Overclaim",
        prompt:
          "Why does an Eleventh Amendment immunity answer overreach when the plaintiff seeks an injunction against state officials?",
        answer:
          "Suits for prospective injunctive relief against officials are not barred merely because state officials are named.",
      },
    ],
  },
  {
    questionId: "14231",
    transformId: "14231_hymn-trailer-premium",
    title: "State Action Before Scrutiny",
    selectorCode: "44040100",
    selectorMatch: "exact",
    outlineCode: "44040100",
    sourceOutlineCode: "44040100",
    coverageGroup: "state_action",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Does equal protection apply to a private insurer's risk-based pricing decision when the state only audits the insurer for solvency?",
    stem:
      "In one state, theft coverage for privately owned event equipment is sold only by private insurance companies. The state insurance commissioner audits the companies to make sure they remain solvent, but the state does not set their premiums or policy terms. Covenant Mutual, a private insurer, charges higher premiums for theft coverage on personal hymn-sing sound trailers kept by residents in the west end of Cedar County than for similar trailers kept by residents in the east end, because theft claims have been more frequent in the west end. Martha owns one of those trailers for neighborhood hymn-sings and lives in the west end, so Covenant Mutual charged her the higher premium. Martha sues Covenant Mutual, alleging that the premium difference unconstitutionally denies her the equal protection of the laws. Will Martha's suit succeed?",
    choices: [
      {
        letter: "A",
        text: "No, because the different theft rates in the two areas provide a rational basis for the different premiums.",
        verdict: "trap",
        mold: "rational-basis merits trap / threshold skipped",
        explanation:
          "A reaches the right bottom line for the wrong reason. Scrutiny only matters after state action exists.",
      },
      {
        letter: "B",
        text: "No, because the Equal Protection Clause does not apply to this private insurer's pricing decision.",
        verdict: "correct",
        mold: "state-action threshold / private pricing",
        explanation:
          "B is correct. Covenant Mutual is private, and the state only audits solvency without setting or driving the challenged premium.",
      },
      {
        letter: "C",
        text: "Yes, because the higher theft rate in Martha's neighborhood shows that the county sheriff is not giving residents there the equal protection of the laws.",
        verdict: "trap",
        mold: "wrong-party detour / police theory",
        explanation:
          "C changes the defendant and the challenged act. Martha sued the insurer over premiums, not the sheriff over policing.",
      },
      {
        letter: "D",
        text: "Yes, because charging a higher premium based on a customer's residential area is inherently discriminatory.",
        verdict: "trap",
        mold: "private-discrimination overclaim / fairness bait",
        explanation:
          "D treats equal protection as a general fairness code for private pricing. Without state action, that is too broad.",
      },
    ],
    answerFlow: [
      "Start with the actor: Martha sued Covenant Mutual.",
      "Covenant Mutual is a private insurer.",
      "The state audits solvency but does not set premiums or policy terms.",
      "That means the challenged premium is not the state's act.",
      "Resolve constitutional reach before rational-basis scrutiny.",
      "Cut the sheriff detour and private-discrimination overclaim.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Equal protection starts with state action; private conduct is outside the clause unless the state is responsible for the challenged act.",
      },
      {
        label: "Purple profile",
        body: "The answer set offers two no answers: one threshold answer and one rational-basis decoy.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is that the state audits solvency but does not set premiums or policy terms.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: applying scrutiny before asking whether the Constitution reaches the defendant.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STATE-ACTION-01",
        body: "Equal protection starts with the actor: the Fourteenth Amendment restricts state action, not ordinary private pricing. State inspection or general regulation of a private business is not enough unless the state drives the challenged act.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-THRESHOLD-FIRST-01",
        body: "When one no answer says no constitutional reach and another no answer applies scrutiny, resolve reach first.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-WRONG-DEFENDANT-01",
        body: "Do not let a government actor mentioned in the facts pull you away from the defendant and challenged conduct in the call.",
      },
    ],
    leadMeSteps: [
      "Name the defendant.",
      "Identify the challenged conduct.",
      "Ask whether the state set or drove that conduct.",
      "Separate threshold reach from scrutiny.",
      "Reject wrong-party and fairness-code answers.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Threshold Before Scrutiny",
        prompt:
          "A private insurer sets a risk-based premium, and the state only audits solvency. Should you analyze rational basis first?",
        answer:
          "No. Ask first whether the insurer's pricing is state action. If not, scrutiny never turns on.",
      },
      {
        title: "Regulation Is Not Enough",
        prompt:
          "Why does ordinary state regulation or inspection of a private business not automatically create state action?",
        answer:
          "The state must be responsible for the challenged act; general oversight alone does not make every private decision governmental.",
      },
      {
        title: "Wrong Defendant",
        prompt:
          "A plaintiff sues a private insurer, but an answer blames the sheriff. What is the move?",
        answer:
          "Cut it as a wrong-defendant detour unless the call asks about the sheriff's policy.",
      },
    ],
  },
  {
    questionId: "14233",
    transformId: "14233_galilee_nets_fieldhouse",
    title: "Public Money Does Not Decide the Act",
    selectorCode: "44040100",
    selectorMatch: "exact",
    outlineCode: "44040100",
    sourceOutlineCode: "44040100",
    coverageGroup: "state_action",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Does a one-time state grant to a privately owned team make the team's later private contractor-selection decisions state action?",
    stem:
      "A state wanted to prevent the Galilee Nets, its only professional e-sports team, from moving its training center and home finals to a rival state. The team was privately owned by Lydia Sports LLC. After a loud legislative fight, the state enacted a statute providing a one-time grant of $7.5 million in state funds to the team to cover part of the projected sponsorship and streaming losses the team would suffer during the next four years if it stayed in the state. The statute required that the team remain in the state for at least nine years if it accepted the grant. After accepting the grant, the owners of the Galilee Nets decided to build a new $120 million media arena and training hall called Bethany Fieldhouse. As plans for construction proceeded, it became evident that all contractors and subcontractors would be white males, chosen by the team owners without public bids because those contractors had successfully built the only other dedicated e-sports arena in the region. Several contractors who were women or members of minority racial groups sued the owners in federal district court to compel public solicitation of bids on an equal-opportunity basis and to enjoin construction until compliance was ensured. Their only claim was that the owners' contracting practices denied them equal protection in violation of the Fourteenth Amendment. In this suit, the court will probably rule that",
    choices: [
      {
        letter: "A",
        text: "In the absence of additional evidence that the state controlled, encouraged, or participated in the team owners' contracting decisions, the one-time grant is insufficient to warrant treating those decisions as subject to the limitations of the Fourteenth Amendment.",
        verdict: "correct",
        mold: "state-action threshold / missing state responsibility",
        explanation:
          "A is correct. The challenged act is the owners' contractor selection, and the stem gives no state control, encouragement, or participation in that choice.",
      },
      {
        letter: "B",
        text: "The intense public preoccupation with professional e-sports teams, coupled with the fact that live gaming finals have become a favorite modern pastime, is sufficient to justify application of the Fourteenth Amendment to the activities of professional e-sports teams.",
        verdict: "trap",
        mold: "public-function overread / popularity as government power",
        explanation:
          "B sells cultural importance as state action. A private entertainment team does not become the state because the public values it.",
      },
      {
        letter: "C",
        text: "The issues presented by this case are nonjusticiable political questions because the fieldhouse grant followed a partisan legislative fight and there is a lack of judicially manageable standards to resolve the dispute.",
        verdict: "trap",
        mold: "political-question misfit / background politics bait",
        explanation:
          "C turns political background into political-question doctrine. Courts can decide whether the challenged conduct is state action.",
      },
      {
        letter: "D",
        text: "The nexus between the contracting decisions of the team owners and the one-time grant of state funds is sufficiently substantial to subject those decisions to the limitations of the Fourteenth Amendment.",
        verdict: "trap",
        mold: "grant-nexus overread / subsidy treated as control",
        explanation:
          "D is the dominant trap. The state wrote a check and attached a stay condition, but no fact ties the state to the contractor-selection decision.",
      },
    ],
    answerFlow: [
      "Start with the sued-over act: contractor selection.",
      "Identify who made that act: the private owners.",
      "Separate the public grant from the later private contracting decision.",
      "Ask whether the state controlled, encouraged, or participated in that decision.",
      "No fact supplies that missing link.",
      "Cut popularity, political-question, and grant-nexus overreads.",
      "Choose A.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "State action turns on whether the challenged private decision is fairly attributable to the state.",
      },
      {
        label: "Purple profile",
        body: "The answer set makes the grant look powerful, but the missing link is state responsibility for contractor selection.",
      },
      {
        label: "Blue signal",
        body: "The decisive split is grant/stay condition versus control of the contracting decision.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating public money or public attention as enough without tying the state to the challenged act.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STATE-ACTION-GRANT-01",
        body: "Public money, public affection, or regulation does not make a private entity's own decision state action unless the state is responsible for the challenged decision through coercion, significant encouragement, joint participation, management, or an exclusive public function.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CHALLENGED-ACT-FIRST-01",
        body: "Circle the challenged act before ranking the government facts; the sued-over decision may be private even when the background includes state money.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-PUBLIC-MONEY-BAIT-01",
        body: "A subsidy is evidence to inspect, not a shortcut to state action. Look for state responsibility for the specific decision being challenged.",
      },
    ],
    leadMeSteps: [
      "Name the challenged act.",
      "Name the actor who made that act.",
      "Separate the grant from the contracting decision.",
      "Test for state control or encouragement.",
      "Reject public-popularity and political-question bait.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Challenged Act First",
        prompt:
          "A state gives a private team a retention grant, and the team later picks contractors. Which act matters for state action?",
        answer:
          "The challenged contractor-selection decision, not the background decision to offer the grant.",
      },
      {
        title: "Subsidy Is Not Control",
        prompt:
          "Why does a one-time state grant not automatically make a private team's later business decision state action?",
        answer:
          "The plaintiff still needs a link showing state control, coercion, encouragement, joint participation, or an exclusive public function.",
      },
      {
        title: "Popularity Trap",
        prompt:
          "Does public affection for a private sports or entertainment team make the team a state actor?",
        answer:
          "No. Cultural importance is not an exclusive governmental function and does not make private decisions state action.",
      },
    ],
  },
  {
    questionId: "14237",
    transformId: "14237_harvest_table_radio_segment",
    title: "Funding Is Not the Firing",
    selectorCode: "44040100",
    selectorMatch: "exact",
    outlineCode: "44040100",
    sourceOutlineCode: "44040100",
    coverageGroup: "state_action",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Does a private, state-accredited school that receives 25 percent of its budget from state funds become a state actor when it fires an instructor for a public statement, without state coercion or participation in the firing?",
    stem:
      "A private culinary-and-hospitality institute is owned and operated by a Christian nonprofit foundation. The institute is accredited by the department of education of the state in which it is located, and the accreditation certifies that the institute meets prescribed educational standards for its certificate programs. Because it is accredited, the institute qualifies for state funding for certain operating expenses, and 25 percent of its total operating budget comes from state funds. Mary, an instructor at the institute, also hosted an occasional local radio segment about food and community life. In one broadcast, Mary made a public statement criticizing religious organizations. The institute later discharged Mary, giving as its sole reason her authorship and broadcast of that statement. Mary sued the institute, claiming only that her discharge violated her constitutional right to freedom of speech. The institute moved to dismiss Mary's lawsuit on the ground that the U.S. Constitution does not provide Mary with a cause of action in this case. Should the court grant the institute's motion to dismiss?",
    choices: [
      {
        letter: "A",
        text: "No, because the state's accreditation and partial funding of the institute are sufficient to make the state an active participant in Mary's discharge.",
        verdict: "trap",
        mold: "funding/accreditation state-action overread",
        explanation:
          "A is the dominant trap. The state contacts are real, but they do not show that the state drove, encouraged, or participated in Mary's discharge.",
      },
      {
        letter: "B",
        text: "No, because the U.S. Constitution provides a cause of action against any state-accredited school that restricts freedom of speech as a condition of employment.",
        verdict: "trap",
        mold: "fabricated accreditation cause of action",
        explanation:
          "B turns accreditation into an automatic constitutional lawsuit. State accreditation alone does not make every private school a constitutional defendant.",
      },
      {
        letter: "C",
        text: "Yes, because the institute's discharge of Mary is not attributable to the state for purposes of the Fourteenth Amendment.",
        verdict: "correct",
        mold: "state-action threshold / missing state responsibility",
        explanation:
          "C is correct. The challenged act is Mary's discharge by a private institute, and no fact makes that firing fairly attributable to the state.",
      },
      {
        letter: "D",
        text: "Yes, because the First and Fourteenth Amendments affirmatively protect the institute's right to employ only instructors who share and communicate its views.",
        verdict: "trap",
        mold: "correct result / wrong reason",
        explanation:
          "D reaches the grant-the-motion result, but the reason is wrong. The motion is granted because Mary's constitutional claim lacks state action.",
      },
    ],
    answerFlow: [
      "Start with the claim Mary actually brings: a constitutional free-speech claim against a private institute.",
      "Circle the challenged act: the institute's decision to discharge Mary.",
      "Separate background government contacts from responsibility for that discharge.",
      "Accreditation and 25 percent operating support are not enough by themselves.",
      "Ask whether the state coerced, significantly encouraged, approved, or participated in the firing.",
      "No fact supplies that missing link.",
      "Cut the automatic-accreditation and private-autonomy reasons.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "State action asks whether the challenged private decision is fairly attributable to the state.",
      },
      {
        label: "Purple profile",
        body: "The answer set makes accreditation and public funding feel official enough to pull students away from the challenged-act link.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is not who funds part of the school; it is who was responsible for Mary's firing.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating government-adjacent facts as automatic constitutional accountability.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STATE-ACTION-FUNDING-01",
        body: "State accreditation, regulation, or partial funding does not make a private school's employment decision state action unless the state coerced, significantly encouraged, or was otherwise responsible for the challenged decision.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-THRESHOLD-BEFORE-SPEECH-01",
        body: "On a private-actor free-speech claim, do the threshold first: who performed the challenged act, and did the state drive that act?",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CHALLENGED-ACT-FIRST-02",
        body: "Circle the act being sued over before weighing public funding, licensing, accreditation, or regulation.",
      },
    ],
    leadMeSteps: [
      "Name the constitutional claim.",
      "Name the defendant.",
      "Identify the challenged firing.",
      "Separate accreditation and funding from control over the firing.",
      "Test for state coercion or significant encouragement.",
      "Reject automatic accreditation liability.",
      "Reject correct-result wrong-reason autonomy language.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Funding Is Not the Firing",
        prompt:
          "A private school receives state accreditation and a quarter of its budget from the state. It fires an instructor without state involvement. What threshold blocks a constitutional speech claim?",
        answer:
          "No state action. The firing is not fairly attributable to the state.",
      },
      {
        title: "Rewrite the Trap",
        prompt:
          "Rewrite the trap that funding and accreditation automatically make a private school a state actor.",
        answer:
          "Funding, accreditation, or regulation may be relevant, but the challenged private decision must be coerced, significantly encouraged, or otherwise fairly attributable to the state.",
      },
      {
        title: "Threshold Before Speech",
        prompt:
          "One answer says the speech firing is unconstitutional. Another says the Constitution does not apply because a private school made the decision. What fact decides?",
        answer:
          "Whether the state was responsible for the firing.",
      },
    ],
  },
  {
    questionId: "14275",
    transformId: "14275_lantern_launch_observatory",
    title: "Public Venue Is Not State Action",
    selectorCode: "44040100",
    selectorMatch: "exact",
    outlineCode: "44040100",
    sourceOutlineCode: "44040100",
    coverageGroup: "state_action",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A private group with a men-only leadership rule rents a city facility on neutral terms for a public officer induction; does that alone make the leadership rule unconstitutional state action?",
    stem:
      "A city owns and operates a large public observatory dome. It rents the dome to any group that wants to hold a meeting, lecture, recital, contest, or community display. Each user must post a cleaning deposit and pay rent calculated only for the actual hours the dome is used, and reservations are made on a first-come, first-served basis. A private organization called the Good Samaritan Kite League permits only men to serve on its National Steward Council, the League's highest offices. The League rented the observatory dome for its annual lantern-and-kite exposition and planned to install its new National Steward Council during that event. It broadly publicized the exposition and invited members of the public to attend the installation ceremony at the city observatory. No statute or administrative rule prohibits the League from restricting its highest offices to men. An appropriate plaintiff sues the League, seeking to enjoin it from using the city observatory for the installation of its new officers. The plaintiff's sole claim is that the League's use of the city observatory for the installation ceremony is unconstitutional because the League disqualifies women from serving in its highest offices. Will the plaintiff prevail?",
    choices: [
      {
        letter: "A",
        text: "Yes, because once the League invited the public to the officer-installation ceremony, the Fourteenth Amendment barred it from excluding women from any leadership role connected to that event.",
        verdict: "trap",
        mold: "fabricated public-invitation rule",
        explanation:
          "A treats public attendance as the constitutional trigger. A public invitation does not turn a private group's internal leadership rule into state action.",
      },
      {
        letter: "B",
        text: "No, because the League is a private organization, and its officer-selection rule is not state action merely because the ceremony uses a city facility rented on neutral terms.",
        verdict: "correct",
        mold: "state-action threshold / neutral public venue",
        explanation:
          "B is correct. The city made the facility neutrally available, but the League made the challenged leadership rule.",
      },
      {
        letter: "C",
        text: "No, because freedom of association under the Fourteenth Amendment prohibits the city from placing any conditions on a private group's use of city facilities.",
        verdict: "trap",
        mold: "correct result / association-rights overclaim",
        explanation:
          "C reaches the no result, but the reason is too broad. The cleaner answer is no state action, not an absolute ban on city facility conditions.",
      },
      {
        letter: "D",
        text: "Yes, because renting the city observatory for the officer-installation ceremony subjects the League's leadership rule to the Fourteenth Amendment.",
        verdict: "trap",
        mold: "public-venue conversion trap",
        explanation:
          "D is the dominant trap. City property is a real fact, but neutral rental alone does not make the League's internal rule the city's rule.",
      },
    ],
    answerFlow: [
      "Start with the actor: the League is private.",
      "Circle the challenged act: the League's own officer-selection rule.",
      "Separate city ownership of the venue from responsibility for that rule.",
      "The city rents the dome to any group on first-come, hourly terms.",
      "No fact shows city coercion, encouragement, joint participation, public function, or entwinement.",
      "Cut public-invitation and association-overclaim answers.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The Fourteenth Amendment needs state action; private conduct needs an attribution bridge.",
      },
      {
        label: "Purple profile",
        body: "The answer set uses the public venue to make private conduct feel governmental.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is neutral rental: the city did not make, enforce, or encourage the League's leadership rule.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating city property as automatic constitutional control over a private group's internal rule.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STATE-ACTION-PUBLIC-VENUE-01",
        body: "The Fourteenth Amendment reaches state action, not merely private conduct; a private group's internal rule is not state action merely because the group uses a public venue on neutral rental terms.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-STATE-ACTION-PRIVATE-ACTOR-01",
        body: "When a constitutional claim targets a private actor, check state action before equal-protection merits.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-PUBLIC-BUILDING-CLUE-01",
        body: "A public building fact is only a clue. Look for coercion, significant encouragement, joint participation, public function, or entwinement.",
      },
    ],
    leadMeSteps: [
      "Name the actor.",
      "Name the challenged rule.",
      "Separate the public venue from the private rule.",
      "Check the rental terms.",
      "Look for an attribution bridge.",
      "Reject public-invitation and association-rights overclaims.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Public Venue Threshold",
        prompt:
          "A private group rents a public building on neutral terms and applies its own internal rule. What is the first constitutional question?",
        answer:
          "Whether the private rule is fairly attributable to the state.",
      },
      {
        title: "Stronger Than Rental",
        prompt:
          "Name two facts that would be stronger than neutral public-facility rental for state action.",
        answer:
          "State coercion, significant encouragement, joint participation, public function, or entwinement.",
      },
      {
        title: "Right Result Wrong Reason",
        prompt:
          "A no answer says freedom of association forbids any city condition. Why is that not the best no?",
        answer:
          "It overstates association rights and misses that the cleaner reason is no state action.",
      },
    ],
  },
  {
    questionId: "18457",
    transformId: "18457_lydia_book_club",
    title: "Threshold Before Scrutiny",
    selectorCode: "44040100",
    selectorMatch: "exact",
    outlineCode: "44040100",
    sourceOutlineCode: "44040100",
    coverageGroup: "state_action",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A private social group with no government funding or public-function role limits membership to one racial or ethnic group. Does an Equal Protection claim reach scrutiny?",
    stem:
      "A private Christian book club meets monthly in members' homes to discuss literature and community service projects. The club is not a church or religious institution, receives no government funding, and performs no public function. The club admits only members of one racial or ethnic group. Lydia, an applicant from a different racial or ethnic background, is rejected and sues the club directly under the Equal Protection Clause. The club's strongest constitutional defense is that:",
    choices: [
      {
        letter: "A",
        text: "Strict scrutiny applies because the book club uses race or ethnicity in its membership criteria.",
        verdict: "trap",
        mold: "strict-scrutiny skipped-threshold trap",
        explanation:
          "A jumps to the scrutiny tier too soon. Strict scrutiny matters only after state action is established.",
      },
      {
        letter: "B",
        text: "The book club loses because the Constitution bans all private discrimination.",
        verdict: "trap",
        mold: "constitutional overclaim",
        explanation:
          "B overstates the Constitution. The Equal Protection Clause requires state action and does not itself ban all private discrimination.",
      },
      {
        letter: "C",
        text: "The Equal Protection Clause does not reach purely private discrimination without state action.",
        verdict: "correct",
        mold: "state-action threshold",
        explanation:
          "C is correct. The challenged membership rule belongs to a private group, and no fact makes that rule fairly attributable to the government.",
      },
      {
        letter: "D",
        text: "Rational basis applies because private clubs receive deference in membership decisions.",
        verdict: "trap",
        mold: "wrong level of analysis",
        explanation:
          "D uses a scrutiny-tier frame when the threshold problem is state action. The claim fails before any tier of review applies.",
      },
    ],
    answerFlow: [
      "Start with the defendant: a private book club.",
      "Name the claim: Equal Protection.",
      "Check state action before choosing a scrutiny tier.",
      "No fact shows government funding, public-function responsibility, coercion, joint participation, or entwinement.",
      "The challenged membership rule is purely private conduct.",
      "Cut strict scrutiny because scrutiny comes only after state action.",
      "Cut the broad private-discrimination and rational-basis-deference traps.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Equal Protection starts with state action; private conduct needs an attribution bridge before the Fourteenth Amendment applies.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students to see race or ethnicity and jump straight to scrutiny.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are private membership, no government funding, no public function, and no state role in the club's rule.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: skipping the threshold and treating every race fact as a strict-scrutiny question.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONSTITUTIONAL-LAW-LYDIA-BOOK-CLUB-01",
        body: "The Equal Protection Clause is a constraint on government action; the threshold problem is state action, and the scrutiny tier is reached only after state action is established.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONSTITUTIONAL-LAW-LYDIA-BOOK-CLUB-01",
        body: "When a constitutional claim is filed against a private actor, run the state-action threshold first; do not skip to the scrutiny tier.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-PRIVATE-DISCRIMINATION-EP-01",
        body: "An Equal Protection answer can mention private discrimination only after asking whether the private conduct is fairly attributable to the government.",
      },
    ],
    leadMeSteps: [
      "Name the constitutional clause.",
      "Name the defendant.",
      "Separate private conduct from government action.",
      "Check for funding, public function, coercion, joint participation, or entwinement.",
      "Refuse to choose a scrutiny tier before the threshold is satisfied.",
      "Reject the Constitution-bans-all-private-discrimination overclaim.",
      "Reject rational basis as the wrong level of analysis.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Threshold Before Scrutiny",
        prompt:
          "A private social group with no government funding and no public-function role limits membership to one racial group. A rejected applicant sues under Equal Protection. Does the constitutional claim reach the scrutiny tier?",
        answer:
          "No. The Equal Protection Clause requires state action, so the claim fails at the threshold before scrutiny.",
      },
      {
        title: "Strict Scrutiny Trap",
        prompt:
          "A choice says strict scrutiny applies because a private club uses race. What step is missing?",
        answer:
          "State action. Strict scrutiny applies only after the challenged conduct is fairly attributable to the government.",
      },
      {
        title: "Private Discrimination Overclaim",
        prompt:
          "A choice says the Constitution bans all private discrimination. Why is that overbroad for Equal Protection?",
        answer:
          "Equal Protection requires state action. The constitutional claim itself does not reach purely private conduct without an attribution bridge.",
      },
    ],
  },
  {
    questionId: "17114",
    transformId: "17114_farmstand_excessive_fine",
    title: "Incorporation Before Proportionality",
    selectorCode: "44040201",
    selectorMatch: "exact",
    outlineCode: "44040201",
    sourceOutlineCode: "44040201",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A county seeks a large forfeiture for a minor food-code placard violation. The defendant invokes the Excessive Fines Clause through the Fourteenth Amendment. What is the incorporation route?",
    stem:
      "Daniel runs a small roadside farm stand in a rural county, selling eggs, honey, and produce raised on his own land. After a routine inspection, the county health department cited him for failing to display a state-issued refrigeration placard on one small cooler. The county then brought a forfeiture action seeking $400,000, even though the maximum civil fine for this kind of citation, if proven, is $250. Daniel concedes the placard violation but argues that the forfeiture is grossly excessive under the Excessive Fines Clause of the Eighth Amendment, applied to the county through the Fourteenth Amendment Due Process Clause. The county moves to dismiss on the ground that the Excessive Fines Clause constrains only the federal government. What is the best incorporation route for Daniel's Excessive Fines claim?",
    choices: [
      {
        letter: "A",
        text: "The claim fails because the Excessive Fines Clause of the Eighth Amendment applies only to the federal government, not to states or their political subdivisions.",
        verdict: "trap",
        mold: "federal-only incorporation trap",
        explanation:
          "A is the dominant trap. The Excessive Fines Clause is not federal-only; it applies to state and local governments through the Fourteenth Amendment Due Process Clause.",
      },
      {
        letter: "B",
        text: "The claim wins automatically because every forfeiture larger than the maximum statutory fine is unconstitutional, regardless of the violation.",
        verdict: "trap",
        mold: "automatic-win overclaim",
        explanation:
          "B skips the call. Incorporation answers whether the right applies; the merits still require a gross-disproportionality analysis.",
      },
      {
        letter: "C",
        text: "The claim can proceed because the Excessive Fines Clause of the Eighth Amendment is incorporated against the states and their political subdivisions through the Fourteenth Amendment Due Process Clause.",
        verdict: "correct",
        mold: "incorporated-right route",
        explanation:
          "C is correct. A county is a local government actor, and the Excessive Fines Clause reaches it through Fourteenth Amendment incorporation.",
      },
      {
        letter: "D",
        text: "The claim belongs only under the procedural due process rules requiring notice and a hearing before a forfeiture is imposed.",
        verdict: "trap",
        mold: "procedural due process misdirection",
        explanation:
          "D swaps the issue. Daniel challenges the size of the forfeiture, not the notice or hearing used to impose it.",
      },
    ],
    answerFlow: [
      "Start with the government actor: a county seeks the forfeiture.",
      "Name the right Daniel invokes: the Eighth Amendment Excessive Fines Clause.",
      "Name the route question: does that right apply to the county through the Fourteenth Amendment?",
      "The Excessive Fines Clause is incorporated against states and local governments through Due Process.",
      "Cut the federal-only answer.",
      "Do not make incorporation an automatic merits win.",
      "Cut procedural due process because Daniel challenges excessiveness, not process.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The call asks for incorporation route, not whether the forfeiture is ultimately excessive.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with federal-only Bill of Rights thinking, automatic victory, and notice-and-hearing language.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is a local government fine paired with an Eighth Amendment right applied through Fourteenth Amendment Due Process.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: answering the proportionality or procedure question before answering whether the right applies.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-FARMSTAND-EXCESSIVE-FINE-01",
        body: "The Excessive Fines Clause of the Eighth Amendment is incorporated against the states and their political subdivisions through the Fourteenth Amendment Due Process Clause; the federal-only incorporation theory fails.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FARMSTAND-EXCESSIVE-FINE-01",
        body: "When the call asks for the best incorporation route, test each answer against the route question before deciding the proportionality merits.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-EXCESSIVE-FINES-NOTICE-01",
        body: "A claim that a fine is too large is not merely a notice-and-hearing problem; keep the Excessive Fines constraint separate from procedural due process.",
      },
    ],
    leadMeSteps: [
      "Name the government actor.",
      "Name the Eighth Amendment right.",
      "Translate the call into an incorporation question.",
      "Apply Fourteenth Amendment Due Process incorporation.",
      "Reject the federal-only trap.",
      "Reject automatic merits victory.",
      "Reject the procedural due process misdirection.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Incorporation Route",
        prompt:
          "A county seeks a large forfeiture, and the defendant invokes the Excessive Fines Clause through the Fourteenth Amendment. What route lets the claim proceed against the county?",
        answer:
          "The Excessive Fines Clause is incorporated against states and local governments through the Fourteenth Amendment Due Process Clause.",
      },
      {
        title: "Route Is Not Merits",
        prompt:
          "If the Excessive Fines Clause applies to a county, does the defendant automatically win because the forfeiture is larger than the ordinance fine?",
        answer:
          "No. Incorporation only answers whether the right applies; the merits still ask whether the forfeiture is grossly disproportional.",
      },
      {
        title: "Not Notice And Hearing",
        prompt:
          "A forfeiture challenge says the amount is grossly excessive. Why is procedural due process not the best route?",
        answer:
          "Procedural due process focuses on notice and hearing. The Excessive Fines claim attacks the size of the forfeiture.",
      },
    ],
  },
  {
    questionId: "19280",
    transformId: "19280_patmos_relic_chalice",
    title: "Guideposts, Not Jury Free Rein",
    selectorCode: "44040202",
    selectorMatch: "exact",
    outlineCode: "44040202",
    sourceOutlineCode: "44040202",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A state-court fraud verdict with no physical harm produced tiny compensatory damages and a huge punitive award. What must the court consider on due process review?",
    stem:
      "Paul, a seminary student in a Christian college town, paid Esther, a local antiques dealer, $80 for what she represented as a genuine second-century communion chalice from the Patmos region, suitable for display in his chapel. Paul later learned through an expert analysis that the chalice was a modern reproduction worth roughly $30, and that Esther had known or recklessly disregarded the inaccuracy at the time of sale. Paul sued Esther in state court for a single economic tort with no physical harm. The jury awarded $80 in compensatory damages and $1.5 million in punitive damages. Comparable state civil penalties under the state's deceptive trade practices act are modest, capped at $5,000 per violation. Esther raises a due process challenge. What should the court consider?",
    choices: [
      {
        letter: "A",
        text: "Strict scrutiny because money is a fundamental right.",
        verdict: "trap",
        mold: "wrong-tier strict scrutiny",
        explanation:
          "A grabs the wrong tier. A punitive-damages excessiveness challenge is not strict scrutiny, and money is not a fundamental right.",
      },
      {
        letter: "B",
        text: "Mathews balancing of hearing procedures only.",
        verdict: "trap",
        mold: "procedural due process misdirection",
        explanation:
          "B uses a procedure frame. Esther challenges the size of the award, not the notice or hearing procedures.",
      },
      {
        letter: "C",
        text: "Nothing, because punitive damages are entirely within jury discretion.",
        verdict: "trap",
        mold: "jury-discretion overclaim",
        explanation:
          "C is the dominant trap. Juries have discretion, but due process still limits grossly excessive punitive awards.",
      },
      {
        letter: "D",
        text: "Reprehensibility, ratio to actual harm, and comparable civil penalties.",
        verdict: "correct",
        mold: "punitive-damages due process guideposts",
        explanation:
          "D is correct. Substantive due process review of punitive damages uses the defendant's reprehensibility, the ratio to harm, and comparable civil penalties.",
      },
    ],
    answerFlow: [
      "Start with the kind of challenge: due process against a punitive damages award.",
      "Separate award size from trial procedure.",
      "Cut strict scrutiny because no fundamental right or suspect class is involved.",
      "Cut procedural balancing because the complaint is excessiveness, not process.",
      "Cut jury free rein because constitutional review still applies.",
      "Use the punitive-damages guideposts.",
      "Look at reprehensibility, ratio to actual harm, and comparable civil penalties.",
      "Choose D.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Punitive-damages due process asks whether the award is grossly excessive, not whether the hearing procedures were enough.",
      },
      {
        label: "Purple profile",
        body: "The answer set mixes strict scrutiny, procedural balancing, jury discretion, and the real substantive guideposts.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are tiny compensatory damages, no physical harm, a huge punitive award, and modest comparable civil penalties.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating damages as pure jury discretion or using the most familiar due process test without matching the call.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONSTITUTIONAL_LAW-PATMOS-RELIC-CHALICE-01",
        body: "A punitive damages award is reviewed under substantive due process for excessiveness using three guideposts: reprehensibility, the ratio of punitive damages to actual harm, and comparable civil penalties. Jury discretion does not displace that review.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONSTITUTIONAL_LAW-PATMOS-RELIC-CHALICE-01",
        body: "On a punitive-damages due process challenge, separate tier of scrutiny from due process frame: strict scrutiny is wrong, procedural balancing is wrong, and excessiveness guideposts are right.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-PUNITIVE-DAMAGES-RATIO-01",
        body: "A huge punitive-to-compensatory ratio is a signal for guidepost review, not an automatic win by itself.",
      },
    ],
    leadMeSteps: [
      "Name the challenge.",
      "Identify that the complaint is award size.",
      "Reject strict scrutiny.",
      "Reject procedural balancing.",
      "Reject unlimited jury discretion.",
      "Name the three guideposts.",
      "Match the guideposts to the facts.",
      "Pick D.",
    ],
    drillSeeds: [
      {
        title: "Guidepost Trio",
        prompt:
          "A punitive award is challenged as grossly excessive under due process. Name the three guideposts.",
        answer:
          "Reprehensibility, the ratio of punitive damages to actual harm, and comparable civil penalties.",
      },
      {
        title: "Frame The Challenge",
        prompt:
          "A defendant challenges the size of a punitive award, not the hearing. Is procedural due process balancing the right frame?",
        answer:
          "No. The right frame is substantive due process excessiveness review.",
      },
      {
        title: "Jury Discretion Ceiling",
        prompt:
          "Why is 'punitive damages are entirely within jury discretion' too broad?",
        answer:
          "Because due process imposes constitutional limits on grossly excessive punitive awards.",
      },
    ],
  },
  {
    questionId: "14225",
    transformId: "14225_christian-tutor-license",
    title: "Fair Hearing Means Testing The Witnesses",
    selectorCode: "44040203",
    selectorMatch: "exact",
    outlineCode: "44040203",
    sourceOutlineCode: "44040203",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A state agency revokes a professional license based only on statements from unnamed absent informants. Does the licensee's inability to question them violate procedural due process?",
    stem:
      "Timothy is a licensed private bar-prep tutor in a state that requires a license to offer paid bar-exam preparation services. A state statute provides that the Tutor Licensing Commission may revoke a tutor's license if it finds that the tutor used a place of business for an illegal purpose. Federal narcotics agents arrested Timothy at his tutoring office, alleging that he sold methamphetamine from the office in violation of federal law. The local United States Attorney declined to prosecute, and the charges were dropped. Nevertheless, the Commission initiated a proceeding to revoke Timothy's license on the ground that he used his tutoring office for illegal drug sales. At the hearing, the only evidence against Timothy consisted of written, signed statements from unnamed informants, none of whom were present or available for questioning. The statements asserted that each informant purchased methamphetamine from Timothy at the tutoring office. Based solely on those statements, the Commission found that Timothy used his place of business for an illegal purpose and ordered his license revoked. In a suit to set aside the revocation, Timothy's best constitutional argument is:",
    choices: [
      {
        letter: "A",
        text: "The administrative license revocation proceeding was invalid because it denied full faith and credit to the dismissal of the criminal charges by the United States Attorney.",
        verdict: "trap",
        mold: "full faith and credit misfire",
        explanation:
          "A reaches for the wrong constitutional tool. A prosecutor's decision not to proceed is not a state judgment that the licensing commission must honor under full faith and credit.",
      },
      {
        letter: "B",
        text: "Article II requires a penalty of this kind to be imposed by a court rather than by an administrative agency.",
        verdict: "trap",
        mold: "agency power overclaim",
        explanation:
          "B overstates the separation-of-powers point. Agencies may conduct licensing proceedings; the constitutional issue is whether the hearing gave enough process.",
      },
      {
        letter: "C",
        text: "Timothy's inability to cross-examine his accusers denied him a fair hearing and caused the deprivation of his tutor license without due process.",
        verdict: "correct",
        mold: "procedural due process hearing defect",
        explanation:
          "C is correct. A professional license is a protected interest, and revocation based solely on untested statements from absent informants creates a serious due process problem.",
      },
      {
        letter: "D",
        text: "Federal laws penalizing the illegal sale of methamphetamine preempt state action relating to drug trafficking of the kind involved.",
        verdict: "trap",
        mold: "preemption overclaim",
        explanation:
          "D sounds sophisticated but skips the actual injury. Federal drug laws do not automatically displace a state's power to regulate licenses; Timothy's strongest claim is the defective hearing.",
      },
    ],
    answerFlow: [
      "Start with what the state took: Timothy's professional tutor license.",
      "Treat the license as a protected property interest.",
      "Ask what process the Commission gave before revocation.",
      "The only evidence was statements from unnamed absent informants.",
      "Timothy had no meaningful way to test credibility through questioning.",
      "Cut full faith and credit because a prosecutor's declination is not the kind of judgment the Commission must honor.",
      "Cut Article II and preemption because they do not address the hearing defect.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Procedural due process protects a professional license with notice and a meaningful opportunity to be heard before revocation.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with sovereign and structural doctrines instead of the fairness of the hearing.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is that the only evidence came from unnamed absent informants Timothy could not question.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: picking a plausible constitutional doctrine instead of the argument tied to the specific injury.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-DPHEAR-01",
        body: "A state-issued professional license is a property interest protected by due process. When the only evidence against the licensee is untested statements from absent informants, the hearing is not meaningful unless the licensee has a fair way to test that evidence.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-BESTARG-01",
        body: "When the call asks for the best constitutional argument, choose the argument that directly attacks the injury in the facts, not the doctrine that merely sounds constitutional.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CROSS-EXAM-ONLY-EVIDENCE-01",
        body: "When credibility is the whole case, inability to question adverse witnesses can make an administrative hearing constitutionally inadequate.",
      },
    ],
    leadMeSteps: [
      "Name the state action.",
      "Name the interest taken.",
      "Classify the license as property.",
      "Inspect the evidence used at the hearing.",
      "Ask whether Timothy could test that evidence.",
      "Reject full faith and credit, Article II, and preemption frames.",
      "Tie the best argument to the hearing defect.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "License Revocation Process",
        prompt:
          "A state agency revokes a professional license based solely on untested statements from absent informants. What constitutional right is violated?",
        answer:
          "Procedural due process under the Fourteenth Amendment: the licensee needs a meaningful hearing, including a fair way to confront and question adverse witnesses when credibility drives the case.",
      },
      {
        title: "Preemption Overclaim",
        prompt:
          "A student argues that federal drug laws automatically preempt a state's authority to revoke a professional license for drug sales from the licensed business. What is the error?",
        answer:
          "Federal regulation on the same subject is not enough. Preemption requires express preemption, field occupation, or an actual conflict with federal law.",
      },
      {
        title: "Best Argument Focus",
        prompt:
          "When a question asks for the best constitutional argument, what should you compare?",
        answer:
          "Compare which argument most directly addresses the specific injury. Here, the injury is the defective hearing before license revocation, so procedural due process beats structural distractions.",
      },
    ],
  },
  {
    questionId: "17163",
    transformId: "17163_permit_fee_ledger",
    title: "Negligence Is Not Due Process",
    selectorCode: "44040200",
    selectorMatch: "child_code",
    outlineCode: "44040203",
    sourceOutlineCode: "44040203",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A state employee accidentally loses a small permit fee while moving it between offices. The applicant sues under the Due Process Clause, alleging only negligence and a small property loss. Is that a constitutional violation?",
    stem:
      "Paul, a pastor at a small church, applied in person for a state concealed-carry permit at a county clerk's office. He paid the $75 application fee in cash to the clerk, Daniel, who placed the cash envelope in an interoffice pouch to be delivered to the finance office for deposit. While moving the pouch between offices, Daniel accidentally dropped the envelope behind a filing cabinet and never recovered it. Paul's permit was not issued, and the $75 was never refunded. Paul sued Daniel and the county in federal court under 42 U.S.C. § 1983, alleging a Due Process Clause violation based only on Daniel's negligence and the loss of the $75 fee. What is the best due process answer?",
    choices: [
      {
        letter: "A",
        text: "Strict scrutiny applies, because permit fees burden travel within the state.",
        verdict: "trap",
        mold: "wrong-frame level of review",
        explanation:
          "A jumps to the wrong frame. The claim is about an accidental loss of a small fee, not a suspect classification or a fundamental-rights burden.",
      },
      {
        letter: "B",
        text: "The clerk must receive a hearing before the applicant can sue.",
        verdict: "trap",
        mold: "wrong-party due process",
        explanation:
          "B redirects the call to Daniel's process. The question asks whether Paul's due process rights were violated by the negligent loss.",
      },
      {
        letter: "C",
        text: "The Due Process Clause is not ordinarily violated by mere negligence.",
        verdict: "correct",
        mold: "negligent-loss due process rule",
        explanation:
          "C is correct. Mere carelessness by a state employee causing an unintended property loss is not itself a constitutional due process violation.",
      },
      {
        letter: "D",
        text: "Every property loss by a state employee is a due process violation.",
        verdict: "trap",
        mold: "tiered absolute overclaim",
        explanation:
          "D is the dominant trap. Due process protects property, but it does not turn every careless government mistake into a federal constitutional case.",
      },
    ],
    answerFlow: [
      "Start with the allegation: Daniel accidentally lost the cash envelope.",
      "Identify the injury: a $75 property loss and a permit not issued.",
      "Ask what mental state the due process claim alleges.",
      "The stem alleges only negligence, not deliberate or reckless state action.",
      "Cut D because every property loss is too broad.",
      "Cut A because strict scrutiny is the wrong frame for a negligent-loss claim.",
      "Cut B because the applicant's process is at issue, not the clerk's employment process.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is every property loss versus the negligence rule: due process does not constitutionalize mere carelessness.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with an absolute property rule, a strict-scrutiny frame, and a wrong-party hearing issue.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is that Daniel accidentally dropped the envelope; the claim alleges only negligence.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: seeing a state actor plus lost property and skipping the required wrongful-state-action check.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONSTITUTIONAL-LAW-PERMIT-FEE-LEDGER-01",
        body: "Mere negligent loss of property by a state official is not a due process violation; the clause targets deliberate or reckless deprivations, not carelessness.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONSTITUTIONAL-LAW-PERMIT-FEE-LEDGER-01",
        body: "On a constitutional item, keep the government actor as the government actor and do not reframe the call to the defendant's process.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-NEGLIGENCE-NOT-TORT-01",
        body: "A state tort or refund problem does not automatically become a federal due process claim just because a state employee caused the loss.",
      },
    ],
    leadMeSteps: [
      "Name the claimant.",
      "Name the state actor.",
      "Name the property loss.",
      "Identify the alleged mental state.",
      "Separate negligence from deliberate deprivation.",
      "Reject strict scrutiny and wrong-party hearing frames.",
      "Reject the every-loss overclaim.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Negligent Loss",
        prompt:
          "A state employee accidentally loses a citizen's $50 application fee. The citizen sues under the Due Process Clause. Is that a constitutional violation?",
        answer:
          "No. Negligent loss by a state official is not a constitutional deprivation; the likely remedy is state law, not a federal due process claim.",
      },
      {
        title: "Wrong Party",
        prompt:
          "A due process claim is brought by a citizen against a state clerk. The answer choice says the clerk needs a hearing first. What is the problem?",
        answer:
          "The call is about the citizen's due process rights, not the clerk's employment process.",
      },
      {
        title: "Overclaim Cut",
        prompt:
          "Why is 'every property loss by a state employee is a due process violation' too broad?",
        answer:
          "Because the Due Process Clause does not make every negligent state mistake constitutional. The student must ask whether there was wrongful state action, not mere carelessness.",
      },
    ],
  },
  {
    questionId: "19025",
    transformId: "19025_manna_roof_alert",
    title: "Stigma Needs A Plus",
    selectorCode: "44040200",
    selectorMatch: "child_code",
    outlineCode: "44040203",
    sourceOutlineCode: "44040203",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Government publicly defames a contractor but does not change any license, contract, roster status, entitlement, or other legal right. Does reputation harm alone create a procedural due process liberty claim?",
    stem:
      'After spring floods, a state emergency-repair board uploaded a public vendor alert saying that Ruth, owner of Manna Roof & Repair, had "forged inspection tags and preyed on families." The statement was false. The board did not suspend Ruth\'s repair permit, cancel her cleanup contract, remove her from the state grant-vendor roster, or otherwise change any legal entitlement. Ruth sues for procedural due process, arguing that the public accusation damaged her reputation and required a hearing before it was posted. What is the best answer?',
    choices: [
      {
        letter: "A",
        text: "Ruth likely lacks a procedural due process liberty claim because the alert added stigma but did not change a legal status, entitlement, or right.",
        verdict: "correct",
        mold: "stigma-plus threshold",
        explanation:
          "A is correct. The alert is stigmatizing, but procedural due process requires more than reputation harm alone; the state must also alter a protected status, entitlement, or right.",
      },
      {
        letter: "B",
        text: "Ruth loses only if the board proves the alert was true beyond a reasonable doubt.",
        verdict: "trap",
        mold: "criminal-burden import",
        explanation:
          "B imports the wrong burden. This is a civil procedural due process threshold question, not a criminal prosecution.",
      },
      {
        letter: "C",
        text: "Ruth wins because due process regulates false accusations by private and public speakers alike.",
        verdict: "trap",
        mold: "general defamation code",
        explanation:
          "C turns due process into a universal false-statement rule. Due process is about government deprivation of protected interests, not every false accusation.",
      },
      {
        letter: "D",
        text: "Ruth has a due process liberty claim whenever government speech damages reputation.",
        verdict: "trap",
        mold: "reputation-alone overclaim",
        explanation:
          "D is the dominant trap. Government stigma can matter, but reputation harm alone is not enough without the plus of a changed legal status or right.",
      },
    ],
    answerFlow: [
      "Start with the threshold: procedural due process requires deprivation of a protected liberty or property interest.",
      "Ruth has stigma because the state publicly accused her business of misconduct.",
      "Now ask whether the board changed anything legal.",
      "The board did not suspend a permit, cancel a contract, remove roster status, or alter an entitlement.",
      "Cut B because beyond a reasonable doubt is a criminal burden, not this threshold.",
      "Cut C because due process is not a general defamation rule for all speakers.",
      "Cut D because reputation alone skips the required plus.",
      "Choose A.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is reputation-only harm versus stigma plus alteration of legal status, entitlement, or right.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with criminal-proof language, universal fairness, and an absolute reputation rule.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are the no-change facts: no permit suspension, no contract cancellation, no roster removal, and no entitlement change.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: jumping straight to what hearing feels fair before proving a protected due process interest was deprived.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STIGMA-PLUS-01",
        body: "Reputation harm alone is not a procedural due process liberty deprivation; a claimant generally needs stigma plus alteration of legal status, entitlement, or right.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-DUE-PROCESS-THRESHOLD-01",
        body: "On procedural due process questions, do the threshold check before the hearing check: identify the protected liberty or property interest first.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-DEFAMATION-NOT-DUE-PROCESS-01",
        body: "A false statement may sound like defamation, but due process does not become a general reputation-repair code.",
      },
    ],
    leadMeSteps: [
      "Name the government actor.",
      "Name the stigma.",
      "Look for the plus.",
      "Confirm no permit, contract, roster, or entitlement changed.",
      "Reject criminal burden language.",
      "Reject universal false-statement due process.",
      "Reject reputation-alone overclaim.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Stigma Plus",
        prompt:
          "A state official falsely calls a vendor dishonest but does not revoke a license, cancel a contract, or change vendor status. Is reputation harm alone a procedural due process liberty deprivation?",
        answer:
          "No. Reputation harm alone is not enough; the claim generally needs stigma plus alteration of legal status or right.",
      },
      {
        title: "Absolute Language Cut",
        prompt:
          "Cut this answer: 'A due process liberty claim exists whenever government speech damages reputation.'",
        answer:
          "Cut it as an overclaim. Government stigma alone is not enough without the plus of a changed legal status, entitlement, or right.",
      },
      {
        title: "Threshold Before Hearing",
        prompt:
          "Before deciding what hearing was owed in procedural due process, what must you identify?",
        answer:
          "A protected liberty or property interest that the government deprived.",
      },
    ],
  },
  {
    questionId: "17157",
    transformId: "17157_vocational-rehab",
    title: "Pregnancy Is Not Automatic Intermediate Scrutiny",
    selectorCode: "44040300",
    selectorMatch: "exact",
    outlineCode: "44040300",
    sourceOutlineCode: "44040300",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A state disability-benefit program excludes pregnancy-related conditions; the plaintiff brings only an Equal Protection claim and offers no proof of sex-stereotyping purpose. What level of scrutiny applies?",
    stem:
      "A state vocational rehabilitation program provides paid medical leave for workers injured in program-sponsored training. The program excludes leave for disabilities arising from pregnancy-related complications. An employee brings a federal Equal Protection claim against the exclusion but offers no evidence that the state adopted the exclusion because of sex stereotypes. Which statement is most accurate?",
    choices: [
      {
        letter: "A",
        text: "Equal Protection requires every state benefit program to cover all medical conditions without exception.",
        verdict: "trap",
        mold: "universal-coverage overclaim",
        explanation:
          "A overstates Equal Protection. The state may draw rational lines in benefit programs; the Constitution does not require every program to cover every condition.",
      },
      {
        letter: "B",
        text: "The exclusion automatically receives intermediate scrutiny because pregnancy is always a sex classification under the Equal Protection Clause.",
        verdict: "trap",
        mold: "automatic-sex-classification trap",
        explanation:
          "B is the dominant trap. Pregnancy is sex-linked, but a pregnancy classification is not automatically a constitutional sex classification.",
      },
      {
        letter: "C",
        text: "The Equal Protection claim does not automatically trigger intermediate scrutiny on pregnancy status alone.",
        verdict: "correct",
        mold: "pregnancy-classification distinction",
        explanation:
          "C is correct. With only a constitutional Equal Protection claim and no sex-stereotyping proof, pregnancy status alone does not automatically trigger intermediate scrutiny.",
      },
      {
        letter: "D",
        text: "Strict scrutiny applies because pregnancy implicates bodily autonomy.",
        verdict: "trap",
        mold: "due-process frame import",
        explanation:
          "D imports a different framework. Bodily autonomy belongs in substantive due process analysis; this stem asks only about Equal Protection classification scrutiny.",
      },
    ],
    answerFlow: [
      "Start with the claim: federal Equal Protection only.",
      "Identify the classification: pregnancy-related disabilities are excluded.",
      "Ask whether the stem gives proof of sex stereotypes or sex-based purpose.",
      "It does not.",
      "Cut A because Equal Protection does not require universal benefit coverage.",
      "Cut D because bodily autonomy is a due process frame, not this Equal Protection trigger.",
      "Cut B because pregnancy is not automatically a sex classification under constitutional Equal Protection.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is pregnancy-linked classification versus automatic sex classification under constitutional Equal Protection.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with universal coverage, automatic intermediate scrutiny, and bodily-autonomy strict scrutiny.",
      },
      {
        label: "Blue signal",
        body: "The decisive fact is the absence of proof that the state adopted the exclusion because of sex stereotypes.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: collapsing constitutional Equal Protection into statutory pregnancy-discrimination rules or substantive due process concerns.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-EP-01",
        body: "A pregnancy-based classification is not automatically a sex-based classification under the constitutional Equal Protection Clause. Intermediate scrutiny applies only when the classification is genuinely sex-based or sex-stereotyping purpose is shown.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-EP-01",
        body: "When a choice says pregnancy always triggers intermediate scrutiny and another says it does not automatically do so, the hedged Equal Protection answer is usually the safer constitutional rule.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CONSTITUTIONAL-STATUTORY-LANE-01",
        body: "Keep the constitutional Equal Protection lane separate from statutory pregnancy-discrimination protections; a statute may go further than the constitutional floor.",
      },
    ],
    leadMeSteps: [
      "Name the claim.",
      "Name the classification.",
      "Check for sex-stereotyping proof.",
      "Separate Equal Protection from statutory employment law.",
      "Reject universal coverage.",
      "Reject bodily-autonomy strict scrutiny.",
      "Reject automatic intermediate scrutiny.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Constitutional Lane",
        prompt:
          "A state benefit program excludes pregnancy-related conditions, and the plaintiff brings only an Equal Protection claim with no sex-stereotyping proof. Does intermediate scrutiny automatically apply?",
        answer:
          "No. Under the constitutional Equal Protection rule, pregnancy status alone does not automatically make the classification sex-based.",
      },
      {
        title: "Statutory Lane",
        prompt:
          "Why can a statutory pregnancy-discrimination rule be stronger than the constitutional Equal Protection rule?",
        answer:
          "Congress can define pregnancy discrimination as sex discrimination by statute, but that does not change the constitutional Equal Protection baseline for an EP-only claim.",
      },
      {
        title: "Frame Separation",
        prompt:
          "A choice says strict scrutiny applies because pregnancy implicates bodily autonomy. Why is that wrong in an Equal Protection classification question?",
        answer:
          "Bodily autonomy is a substantive due process frame. Equal Protection scrutiny asks what classification the state used and whether heightened scrutiny is triggered.",
      },
    ],
  },
  {
    questionId: "14234",
    transformId: "14234_barnabas-house",
    title: "No Trigger Means Rational Basis",
    selectorCode: "44040300",
    selectorMatch: "child_code",
    outlineCode: "44040301",
    sourceOutlineCode: "44040301",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A city denied a fully compliant permit for a reentry residence. What Equal Protection burden applies when no suspect or quasi-suspect class and no fundamental right are involved?",
    stem:
      "Emmaus City's land-use code provides that a person who wants to operate a community residence must obtain a conditional-use permit from the city's land-use commission. The code defines a community residence as a dwelling in which six or more unrelated adults live together. Daniel applied for a permit to run Barnabas House, an ordinary fee-based residence for adults moving from prison sentences into parole supervision. Barnabas House satisfied every listed condition for the permit. The commission nonetheless denied the application because of the proposed use. Daniel sued the commission for declaratory and injunctive relief under the Constitution. Which statement best describes the burden of persuasion?",
    choices: [
      {
        letter: "A",
        text: "Because the commission's action effectively discriminates against a quasi-suspect class in relation to a basic subsistence need, the commission must prove that the denial is substantially related to an important governmental interest.",
        verdict: "trap",
        mold: "fabricated intermediate-scrutiny trigger",
        explanation:
          "A sounds measured, but it invents the trigger. Reentry status is not a quasi-suspect class, and a basic living need does not automatically create intermediate scrutiny.",
      },
      {
        letter: "B",
        text: "Because the commission's action is in the nature of economic or social welfare regulation, Daniel must prove that the denial is not rationally related to a legitimate governmental interest.",
        verdict: "correct",
        mold: "rational-basis burden assignment",
        explanation:
          "B is correct. With no recognized suspect or quasi-suspect class and no fundamental right, Equal Protection uses rational basis and the challenger carries the burden.",
      },
      {
        letter: "C",
        text: "Because housing is a fundamental right, the commission must prove that the denial is necessary to serve a compelling governmental interest.",
        verdict: "trap",
        mold: "housing-as-fundamental-right overclaim",
        explanation:
          "C is the dominant trap. Housing is important, but the Supreme Court has not treated housing access as a fundamental right that automatically triggers strict scrutiny in this Equal Protection burden question.",
      },
      {
        letter: "D",
        text: "Because the commission's action invidiously discriminates against a suspect class, the commission must prove that the denial is necessary to serve a compelling governmental interest.",
        verdict: "trap",
        mold: "suspect-class label overclaim",
        explanation:
          "D uses strict-scrutiny vocabulary without a matching class. Adults moving from prison into parole supervision are not a recognized suspect class.",
      },
    ],
    answerFlow: [
      "Read the call as a burden-of-persuasion question.",
      "Sort the answers by burden: A, C, and D put heightened scrutiny on the government; B puts rational-basis burden on Daniel.",
      "Ask what fact elevates the Equal Protection scrutiny tier.",
      "Housing is not a recognized fundamental right for this burden question.",
      "Reentry or parole-transition status is not a suspect or quasi-suspect class.",
      "No heightened trigger remains.",
      "Use rational basis.",
      "Choose B because Daniel must prove no rational relation to a legitimate governmental interest.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is recognized heightened-scrutiny trigger versus ordinary social or economic regulation.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with three government-burden heightened-scrutiny choices against one challenger-burden rational-basis answer.",
      },
      {
        label: "Blue signal",
        body: "The decisive absence is no suspect class, no quasi-suspect class, and no recognized fundamental right.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: promoting a sympathetic housing or reentry fact into strict or intermediate scrutiny without a recognized constitutional trigger.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONSTITUTIONAL_LAW-RATIONAL-BASIS-REENTRY-01",
        body: "Equal Protection uses rational basis when a government land-use decision burdens neither a recognized suspect or quasi-suspect class nor a fundamental right; the challenger bears the burden to negate rational relation to a legitimate governmental interest.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONSTITUTIONAL_LAW-BURDEN-ARRAY-01",
        body: "In a burden-of-persuasion array, first sort who carries the burden. If no recognized heightened-scrutiny trigger appears, the challenger-burden rational-basis answer is the safe residual.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-HOUSING-NEED-IS-NOT-TRIGGER-01",
        body: "Housing and reentry facts may be sympathetic, but importance alone does not make a right fundamental or a group suspect for Equal Protection scrutiny.",
      },
    ],
    leadMeSteps: [
      "Read the call.",
      "Sort the burdens.",
      "Name the class.",
      "Check for a fundamental right.",
      "Reject housing as an automatic strict-scrutiny trigger.",
      "Reject reentry status as a suspect or quasi-suspect class.",
      "Apply rational basis.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Scrutiny Trigger",
        prompt:
          "A city denies a permit for a reentry residence. The affected residents are adults moving from prison into parole supervision. What scrutiny tier applies absent another protected classification or fundamental right?",
        answer:
          "Rational basis. Reentry status alone does not create suspect or quasi-suspect classification review.",
      },
      {
        title: "Burden Assignment",
        prompt:
          "Under rational-basis Equal Protection review, who bears the burden of showing that the government action lacks a rational relationship to a legitimate interest?",
        answer: "The challenger bears that burden.",
      },
      {
        title: "Housing Trap",
        prompt:
          "Why is 'housing is a fundamental right, so strict scrutiny applies' a trap in this permit-denial item?",
        answer:
          "Housing is important, but it is not a recognized fundamental right for this Equal Protection scrutiny question.",
      },
    ],
  },
  {
    questionId: "17170",
    transformId: "17170_good_samaritan_shelter_remedy",
    title: "Strict Scrutiny Is Still A Test",
    selectorCode: "44040300",
    selectorMatch: "child_code",
    outlineCode: "44040303",
    sourceOutlineCode: "44040303",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a city uses a temporary, individualized race-conscious remedy after a court finds its own intentional exclusion from one program, what Equal Protection test applies?",
    stem:
      "After a court found that Esther's city purchasing office had intentionally kept minority-owned repair teams out of the city's Good Samaritan shelter-repair contract roster for many years, the city adopted a race-conscious corrective rule. The rule applies only to that shelter-repair roster, ends after 18 months, and uses case-by-case file review before any contract preference is given. Which statement best describes the Equal Protection analysis?",
    choices: [
      {
        letter: "A",
        text: "The rule gets rational-basis review because it is meant to assist a disadvantaged group.",
        verdict: "trap",
        mold: "benign-purpose downgrade",
        explanation:
          "A uses the remedial purpose to lower the standard. Equal Protection chooses the scrutiny level from the racial classification, not from the government's helpful label.",
      },
      {
        letter: "B",
        text: "The rule gets intermediate scrutiny because the contracts involve economic activity.",
        verdict: "trap",
        mold: "economic-setting wrong axis",
        explanation:
          "B points to the contract setting instead of the challenged line. Contracting is the program context; race is the classification that selects the scrutiny level.",
      },
      {
        letter: "C",
        text: "The racial classification triggers strict scrutiny, and the city must prove a compelling remedial interest and narrow tailoring.",
        verdict: "correct",
        mold: "strict-scrutiny test stated",
        explanation:
          "C is correct. Government racial classifications trigger strict scrutiny, and the city must prove both a compelling remedial interest and narrow tailoring.",
      },
      {
        letter: "D",
        text: "The rule is automatically invalid as soon as strict scrutiny applies.",
        verdict: "trap",
        mold: "strict-scrutiny automatic-loss overclaim",
        explanation:
          "D is the dominant trap. Strict scrutiny is demanding, but it is still an interest-and-tailoring test rather than automatic invalidity by label alone.",
      },
    ],
    answerFlow: [
      "Spot the government actor: the city purchasing office.",
      "Spot the classification: the corrective rule is race-conscious.",
      "Use the classification, not the friendly purpose, to choose the scrutiny level.",
      "Use the classification, not the economic contract setting, to choose the scrutiny level.",
      "Race triggers strict scrutiny.",
      "Separate the standard from the outcome.",
      "Strict scrutiny asks whether the city can prove compelling remedial interest and narrow tailoring.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is strict scrutiny as a test versus strict scrutiny as automatic defeat.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with benign-purpose rational basis, economic-setting intermediate scrutiny, and strict-scrutiny automatic invalidity.",
      },
      {
        label: "Blue signal",
        body: "The decisive words are race-conscious rule, court-found exclusion from the same roster, 18-month limit, and case-by-case review.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: downgrading race classifications because the purpose is helpful or overclaiming strict scrutiny as a one-word loss.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-RACE-STRICT-SCRUTINY-01",
        body: "A government racial classification triggers strict scrutiny even when the government calls it remedial or benign; the government must prove a compelling interest and narrow tailoring.",
      },
      {
        kind: "Gold Key",
        id: "GK-CONLAW-STRICT-NOT-AUTO-INVALID-02",
        body: "Strict scrutiny is demanding, but it is still a two-part test; a remedy tied to specific identified discrimination must be tested for compelling interest and narrow tailoring rather than rejected by label alone.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-RACE-CLASSIFICATION-01",
        body: "Pick the scrutiny level from the classification the government used, not from the subject matter of the program or the government's friendly purpose.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-STANDARD-OUTCOME-02",
        body: "Separate the standard from the result: strict scrutiny tells you what the city must prove, not that the city has already lost.",
      },
    ],
    leadMeSteps: [
      "Name the government actor.",
      "Name the classification.",
      "Ignore the helpful-purpose shortcut.",
      "Ignore the economic-setting shortcut.",
      "Apply strict scrutiny.",
      "Separate test from outcome.",
      "Require compelling interest and narrow tailoring.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Classification Sort",
        prompt:
          "A city uses race-conscious criteria to remedy a court-found exclusion from one contract roster. What scrutiny starts the analysis?",
        answer: "Strict scrutiny.",
      },
      {
        title: "Standard Versus Outcome",
        prompt: "Why is 'strict scrutiny means automatic invalidity' too strong?",
        answer:
          "Strict scrutiny requires proof of a compelling interest and narrow tailoring; it is not a label-only judgment.",
      },
      {
        title: "Wrong Axis Cut",
        prompt:
          "A race-conscious rule appears in an economic contract program. Which fact selects the Equal Protection review level?",
        answer: "The racial classification, not the economic setting.",
      },
    ],
  },
  {
    questionId: "14242",
    transformId: "14242_lydia_linen_kiosk",
    title: "Grandfather Lines Get Rational Basis",
    selectorCode: "44040300",
    selectorMatch: "child_code",
    outlineCode: "44040305",
    sourceOutlineCode: "44040305",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Does Equal Protection invalidate an ordinary city vendor ordinance with a grandfather exemption when no suspect class or fundamental right is involved?",
    stem:
      "A city has severe pedestrian backups around its commuter plaza. To reduce the congestion, the city enacted an ordinance prohibiting all retail sales or repair services offered directly to the public from rolling kiosks, trailers, or carts stationed on city-owned sidewalks and plazas. The ordinance included an inseverable grandfather provision exempting vendors who, for 18 years or more, have continuously offered such goods or services from mobile stands on those public walkways. Peter, a shoe-repair vendor, qualifies for the exemption and is the only repair vendor who does. Lydia operates a linen-mending cart similar to Peter's mobile stand, but she has offered her service from city walkways for only seven years. Lydia filed suit in an appropriate federal district court to enjoin enforcement of the ordinance on the ground that it denies her equal protection of the laws. In this case, the court will probably rule that the ordinance is:",
    choices: [
      {
        letter: "A",
        text: "Constitutional, because its validity is governed by the rational basis test, and courts defer to economic choices in local legislation if they are even plausibly justifiable.",
        verdict: "correct",
        mold: "rational-basis economic regulation",
        explanation:
          "A is correct. The ordinance regulates ordinary commercial activity, uses no suspect classification, and burdens no fundamental right, so deferential rational-basis review applies.",
      },
      {
        letter: "B",
        text: "Unconstitutional, because economic benefits or burdens imposed by legislatures through grandfather provisions have consistently been declared per se violations of the Equal Protection Clause of the Fourteenth Amendment.",
        verdict: "trap",
        mold: "grandfather-clause per se overclaim",
        explanation:
          "B overclaims. Economic grandfather provisions are not automatically invalid; if no suspect class or fundamental right is involved, they are reviewed under rational basis.",
      },
      {
        letter: "C",
        text: "Constitutional, because it is narrowly tailored to implement the city's compelling interest in reducing pedestrian congestion and therefore satisfies the strict scrutiny test applicable to such cases.",
        verdict: "trap",
        mold: "correct result wrong scrutiny",
        explanation:
          "C is the dominant trap because it reaches constitutionality through the wrong test. Strict scrutiny is not triggered by the seriousness of the city's congestion problem alone.",
      },
      {
        letter: "D",
        text: "Unconstitutional, because the relationship between the legitimate purpose of the ordinance and the conduct it regulates is so tenuous and underinclusive that the ordinance fails the substantial relationship test applicable to such cases.",
        verdict: "trap",
        mold: "underinclusion intermediate-scrutiny import",
        explanation:
          "D imports the wrong lane. Rational basis tolerates imperfect and incremental economic lines if a plausible legitimate reason supports the classification.",
      },
    ],
    answerFlow: [
      "Identify the government action: a city regulates mobile commercial stands on public walkways.",
      "Identify the classification: long-time vendors are grandfathered; newer vendors are excluded.",
      "Check for a suspect class.",
      "None appears.",
      "Check for a fundamental right.",
      "None is burdened.",
      "Route the case to rational basis, not strict scrutiny or substantial relationship.",
      "Choose A because the ordinance is plausibly tied to congestion control and local economic regulation.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is rational-basis economic regulation versus heightened-scrutiny or per se invalidity theories.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with per se invalidity, correct-result wrong-test strict scrutiny, and underinclusion under substantial relationship.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are ordinary commercial activity, a grandfather line, no suspect class, and no fundamental-right burden.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating unfair-looking economic classifications as heightened scrutiny without first identifying the scrutiny trigger.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-EP-RATIONAL-BASIS-01",
        body: "Ordinary economic and social-welfare classifications receive rational-basis review unless the law burdens a fundamental right or uses a suspect classification.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-EP-SCRUTINY-LANE-01",
        body: "Before judging whether the city wins, identify the classification and pick the scrutiny lane; a correct result with the wrong scrutiny is not responsive.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-GRANDFATHER-LINES-01",
        body: "Grandfather clauses in ordinary economic regulation may look like favoritism, but they are not per se Equal Protection violations.",
      },
    ],
    leadMeSteps: [
      "Name the classification.",
      "Check for suspect class.",
      "Check for fundamental right.",
      "Reject per se invalidity.",
      "Reject strict scrutiny.",
      "Reject substantial relationship.",
      "Apply rational basis.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Scrutiny Lane",
        prompt:
          "A city regulates ordinary commercial vendors and exempts businesses that have operated for many years. No suspect class or fundamental right appears. What scrutiny applies?",
        answer: "Rational basis.",
      },
      {
        title: "Correct Result, Wrong Reason",
        prompt:
          "An answer says the economic ordinance is constitutional because it satisfies strict scrutiny. What is the cut?",
        answer:
          "Wrong scrutiny lane. Strict scrutiny is not triggered by ordinary economic regulation.",
      },
      {
        title: "Grandfather Overclaim",
        prompt:
          "An Equal Protection answer says all economic grandfather clauses are per se invalid. What is the breaker?",
        answer:
          "Economic grandfather clauses are reviewed under rational basis and are not automatically invalid.",
      },
    ],
  },
  {
    questionId: "17680",
    transformId: "17680_ministry_housing_permit",
    title: "Animus Fails Rational Basis",
    selectorCode: "44040300",
    selectorMatch: "child_code",
    outlineCode: "44040305",
    sourceOutlineCode: "44040305",
    coverageGroup: "due_process_equal_protection_routing",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A town denies a routine permit to a disfavored group and gives only bare animus, with no safety, zoning, fiscal, or land-use reason. What is the strongest Equal Protection argument?",
    stem:
      "Mary applied to the town of Cedar Bend for a routine zoning permit to open a small transitional residence for women recovering from addiction. The town planning board held a public hearing, voted, and denied the permit. In the hearing record, board members stated that they wanted to keep \"that kind of recovery home\" out of the neighborhood and identified no safety, zoning, fiscal, or land-use reason for the denial. Mary sued in federal court, alleging that the denial violates the Equal Protection Clause. Which statement is the strongest Equal Protection argument on Mary's behalf?",
    choices: [
      {
        letter: "A",
        text: "The denial can fail rational basis review because it rests only on bare animus toward the group.",
        verdict: "correct",
        mold: "rational-basis with bite",
        explanation:
          "A is correct. Rational basis is deferential, but animus is not a legitimate government interest.",
      },
      {
        letter: "B",
        text: "Strict scrutiny applies automatically because the group is unpopular.",
        verdict: "trap",
        mold: "animus-to-tier-escalation trap",
        explanation:
          "B is the dominant trap. Animus can defeat rational basis without converting the group into a suspect class or automatically triggering strict scrutiny.",
      },
      {
        letter: "C",
        text: "The denial is valid because rational basis review means no review at all.",
        verdict: "trap",
        mold: "rational-basis rubber-stamp overclaim",
        explanation:
          "C overstates deference. Rational basis still requires a legitimate government interest, and bare animus is not legitimate.",
      },
      {
        letter: "D",
        text: "The denial is valid if any resident dislikes the group.",
        verdict: "trap",
        mold: "resident-dislike colloquialism",
        explanation:
          "D replaces legal analysis with neighborhood dislike. Equal Protection asks for a legitimate government interest, not whether someone dislikes the group.",
      },
    ],
    answerFlow: [
      "Read the call: strongest Equal Protection argument.",
      "Identify the review lane: no suspect class or fundamental-right trigger appears.",
      "Do not escalate to strict scrutiny merely because the group is unpopular.",
      "Remember that rational basis is deferential, not nonexistent.",
      "Ask whether the town identified a legitimate interest.",
      "The hearing record gives only animus and no safety, zoning, fiscal, or land-use reason.",
      "Animus is not a legitimate government interest.",
      "Choose A.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is rational-basis with bite versus automatic tier escalation.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with strict scrutiny, no-review rational basis, and resident-dislike shortcuts.",
      },
      {
        label: "Blue signal",
        body: "The decisive record fact is that the board gave only animus and no legitimate safety, zoning, fiscal, or land-use reason.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating rational basis as either no review or strict scrutiny whenever animus appears.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-RATIONAL-BASIS-ANIMUS-01",
        body: "Even under rational basis review, government action based only on bare animus toward an unpopular group lacks a legitimate government interest.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-ANIMUS-NO-TIER-ESCALATION-01",
        body: "Animus can make the government lose at rational basis without making the group suspect or automatically triggering strict scrutiny.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-RATIONAL-BASIS-STILL-REVIEWS-01",
        body: "Rational basis is deferential, but it is not no review; there still must be a legitimate government reason.",
      },
    ],
    leadMeSteps: [
      "Read the call.",
      "Name the review lane.",
      "Reject automatic strict scrutiny.",
      "Reject no-review rational basis.",
      "Reject resident dislike.",
      "Find the missing legitimate interest.",
      "Apply the animus rule.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Animus Rule",
        prompt:
          "A town denies a routine permit and states only that it wants to keep 'those people' out. No safety, zoning, fiscal, or land-use reason appears. What is the strongest Equal Protection argument?",
        answer:
          "The denial can fail rational basis review because bare animus is not a legitimate government interest.",
      },
      {
        title: "No Tier Escalation",
        prompt: "Does animus toward a group automatically trigger strict scrutiny?",
        answer:
          "No. The government can lose under rational basis because animus is not legitimate, without the group becoming suspect.",
      },
      {
        title: "Rational Basis Still Reviews",
        prompt: "Does rational basis review mean the court gives no review at all?",
        answer:
          "No. It is deferential, but the government still needs a legitimate interest.",
      },
    ],
  },
  {
    questionId: "14236",
    transformId: "14236_sacred-grove",
    title: "Free Exercise Needs Targeting",
    selectorCode: "44040501",
    selectorMatch: "exact",
    outlineCode: "44040501",
    sourceOutlineCode: "44040501",
    coverageGroup: "free_exercise",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A federal land-use permit will eliminate a sincere worship site on public land. What must the community show to win a First Amendment Free Exercise claim?",
    stem:
      "For generations, a small Christian community has gathered at a clearing on a hillside within a national forest to hold outdoor worship services and baptisms at a natural spring. The community's pastor, Timothy, has led these gatherings for more than a decade. Last year, the United States Forest Service granted a permit to a private company to operate a commercial logging operation that will clear the trees around the spring and destroy the clearing where the community worships. Timothy and the community filed suit in federal district court against the Forest Service, claiming solely that the permit violates their First Amendment right to the free exercise of religion. The Forest Service concedes that the community's religious beliefs are sincere and that the logging will eliminate the worship site. What must the community show to prevail on its First Amendment claim?",
    choices: [
      {
        letter: "A",
        text: "The burden on the community's religious exercise from the logging operation outweighs the government's interest in permitting commercial timber harvesting.",
        verdict: "trap",
        mold: "pre-Smith balancing trap",
        explanation:
          "A uses the old balancing instinct. For a neutral, generally applicable land-use action, the First Amendment Free Exercise claim does not turn on burden-versus-interest balancing.",
      },
      {
        letter: "B",
        text: "The logging operation will have a discriminatory impact on the community's religious practices in relation to the practices of other religious groups.",
        verdict: "trap",
        mold: "impact without targeting",
        explanation:
          "B focuses on effect. Discriminatory impact is not enough; the First Amendment Free Exercise claim needs proof that the government aimed at religion.",
      },
      {
        letter: "C",
        text: "The permit issued by the Forest Service is aimed at suppressing the community's religious practices.",
        verdict: "correct",
        mold: "intent-to-target requirement",
        explanation:
          "C is correct. Sincerity and severe burden are not enough by themselves; the community must show the permit was motivated by intent to target or suppress religious practice.",
      },
      {
        letter: "D",
        text: "The government can serve its legitimate interest in timber harvesting by selecting a logging site that is less burdensome on the community's religious practices.",
        verdict: "trap",
        mold: "least-burdensome alternative premature",
        explanation:
          "D imports strict-scrutiny tailoring before strict scrutiny is triggered. Least-burdensome alternatives matter only after the challenger shows targeting or another strict-scrutiny trigger.",
      },
    ],
    answerFlow: [
      "Read the claim: First Amendment Free Exercise only.",
      "Confirm the government concedes sincerity and severe adverse effect.",
      "Do not stop there; severe burden alone is not enough under the First Amendment rule for neutral, generally applicable action.",
      "Cut A because the case is not solved by burden-versus-interest balancing.",
      "Cut B because impact is not intent.",
      "Cut D because least-burdensome alternatives belong to strict scrutiny after the trigger.",
      "Ask what would trigger strict scrutiny: government action aimed at religion.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is neutral/general land-use burden versus intent to target religion.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with burden balancing, impact alone, and least-burdensome alternatives.",
      },
      {
        label: "Blue signal",
        body: "The decisive missing fact is anti-religious targeting; sincerity and serious burden are conceded but not sufficient.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: applying Sherbert-style balancing or strict-scrutiny tailoring before proving targeting.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-FREEEX-01",
        body: "Under Employment Division v. Smith, a neutral law of general applicability does not violate the First Amendment Free Exercise Clause merely because it incidentally burdens religion. The challenger must prove government action was motivated by intent to target or suppress religion.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FREEEX-IMPACT-INTENT-01",
        body: "In Free Exercise questions, do not equate severe religious impact with unconstitutional targeting; impact and intent are separate steps.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FREEEX-STRICT-SCRUTINY-TRIGGER-01",
        body: "Least-burdensome alternatives and narrow tailoring matter only after strict scrutiny is triggered by targeting or another recognized trigger.",
      },
    ],
    leadMeSteps: [
      "Name the claim.",
      "Confirm sincerity.",
      "Confirm burden.",
      "Reject balancing.",
      "Reject impact alone.",
      "Reject premature least-burden analysis.",
      "Look for targeting.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Smith Framework",
        prompt:
          "A neutral government permit incidentally destroys a sincere worship site on public land. What must the religious group show for a First Amendment Free Exercise win?",
        answer:
          "The group must show the government action was aimed at suppressing or targeting religious practice.",
      },
      {
        title: "Impact Versus Intent",
        prompt:
          "Why is severe impact on one religious community not enough by itself?",
        answer:
          "The First Amendment Free Exercise claim requires targeting or suppression of religion, not merely adverse impact from neutral action.",
      },
      {
        title: "Least-Burden Trap",
        prompt: "Why is 'the government could use a less burdensome site' premature?",
        answer:
          "Least-burdensome alternatives are part of strict scrutiny; strict scrutiny is not triggered unless the action targets religion or another trigger applies.",
      },
    ],
  },
  {
    questionId: "20153",
    transformId: "20153_lampstand_labs",
    title: "Neutral Secular Aid Survives",
    selectorCode: "44040501",
    selectorMatch: "exact",
    outlineCode: "44040501",
    sourceOutlineCode: "44040501",
    coverageGroup: "free_exercise",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Congress funds secular-use educational equipment for religious and nonreligious private schools on equal terms. Should a federal court enjoin the spending?",
    stem:
      "Congress enacts the Lampstand Labs Act, which authorizes federal tax funds to buy robotics kits, digital microscopes, and portable planetarium projectors for qualifying private schools. The kits are available on identical terms to private schools with religious missions and to secular private schools. The Act states that every donated kit must be used only for secular instruction and secular academic activities. Mary and Peter, federal taxpayers whose children attend public schools in the state, sue in federal court for an order enjoining the federal government from spending tax funds on kits that will go to Christian and other religious private schools. They argue that the spending is unconstitutional. Should the court issue the requested injunction?",
    choices: [
      {
        letter: "A",
        text: "Yes, because education is solely a matter for the states.",
        verdict: "trap",
        mold: "states-only spending-power overclaim",
        explanation:
          "A overclaims. Education is often regulated by states, but Congress can spend for the general welfare, including neutral education aid.",
      },
      {
        letter: "B",
        text: "No, because the Act restricts the donated kits to secular educational use.",
        verdict: "correct",
        mold: "neutral secular-use aid",
        explanation:
          "B is correct. The program treats religious and secular private schools alike and restricts the donated equipment to secular educational use, so the requested injunction should not issue on this Establishment Clause theory.",
      },
      {
        letter: "C",
        text: "No, because Mary and Peter lack standing to challenge federal spending.",
        verdict: "trap",
        mold: "right result wrong threshold",
        explanation:
          "C reaches the right no-injunction result for the wrong reason. Federal taxpayers can have standing under the Establishment Clause exception for congressional taxing-and-spending challenges.",
      },
      {
        letter: "D",
        text: "Yes, because using public funds to buy equipment for religious private schools violates the Establishment Clause.",
        verdict: "trap",
        mold: "per se establishment overclaim",
        explanation:
          "D treats all public aid reaching religious schools as automatically unconstitutional. Neutral aid limited to secular educational use is not a per se establishment.",
      },
    ],
    answerFlow: [
      "Read the requested remedy: an injunction against federal spending.",
      "Classify the constitutional claim: Establishment Clause challenge to school aid.",
      "Confirm the program is neutral: religious and secular private schools receive the same terms.",
      "Confirm the use restriction: the equipment must be used only for secular instruction and academic activities.",
      "Cut A because Congress is not categorically barred from spending on education.",
      "Cut C because the taxpayer-standing trap does not solve an Establishment Clause challenge to congressional spending.",
      "Cut D because aid to religious schools is not automatically unconstitutional.",
      "Choose B because it gives the no-injunction result for the correct neutral, secular-use reason.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is neutral secular-use educational aid versus per se Establishment Clause invalidity.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with states-only federalism, standing dismissal, and public-money absolutism.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are equal terms for religious and secular schools plus a secular-use restriction.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: picking the right yes/no outcome without grading the because.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-ESTABLISHMENT-NEUTRAL-AID-01",
        body: "Neutral educational aid available to religious and nonreligious schools on equal terms is not automatically an Establishment Clause violation when the aid is restricted to secular educational use.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-RELIGION-AID-BECAUSE-01",
        body: "In yes/no injunction questions, grade the reason after the result; a no answer with a false standing reason still loses.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-TAXPAYER-STANDING-FLAST-01",
        body: "Federal taxpayer standing is usually barred, but Establishment Clause challenges to congressional taxing-and-spending measures can fit the Flast exception.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-SPENDING-EDUCATION-01",
        body: "Education is not solely a state function for spending-power purposes; Congress may spend for the general welfare.",
      },
    ],
    leadMeSteps: [
      "Name the claim.",
      "Check the remedy.",
      "Find neutrality.",
      "Find secular-use restriction.",
      "Reject states-only.",
      "Reject standing dismissal.",
      "Reject per se establishment.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Neutral Aid",
        prompt:
          "Congress buys secular-use science kits for religious and nonreligious private schools on equal terms. Is that automatically an Establishment Clause violation?",
        answer:
          "No. Neutral, secular-use aid is not automatically unconstitutional merely because religious schools receive it on equal terms.",
      },
      {
        title: "Standing Trap",
        prompt:
          "Why is 'federal taxpayers lack standing' a bad reason in an Establishment Clause challenge to congressional spending?",
        answer:
          "The Flast exception can permit federal taxpayer standing for Establishment Clause challenges to congressional taxing-and-spending measures.",
      },
      {
        title: "Outcome Versus Reason",
        prompt:
          "Two choices say no injunction. One says no because of secular-use neutral aid; the other says no because taxpayers lack standing. Which reason wins?",
        answer:
          "The secular-use neutral-aid reason wins; the standing reason is the trap.",
      },
    ],
  },
  {
    questionId: "20231",
    transformId: "20231_crown_above_caesars",
    title: "Belief Cannot Be Punished",
    selectorCode: "44040501",
    selectorMatch: "exact",
    outlineCode: "44040501",
    sourceOutlineCode: "44040501",
    coverageGroup: "free_exercise",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "Can a state criminalize holding or teaching a religious belief because conduct inspired by that belief can be regulated?",
    stem:
      'During a private Bible-study art class in a rented storefront, Esther teaches a creed she calls "Crown Above Caesars": that Christ\'s authority is higher than any earthly government. A state statute makes it a misdemeanor to hold or teach that creed. After charging Esther, the state argues that because it may regulate unlawful acts committed by people who invoke the creed, it may also forbid the creed itself. What is the best constitutional response?',
    choices: [
      {
        letter: "A",
        text: "The law is invalid only if it also violates the Establishment Clause.",
        verdict: "trap",
        mold: "Establishment-only overclaim",
        explanation:
          "A adds an unnecessary condition. Free Exercise itself answers a statute that punishes religious belief as such.",
      },
      {
        letter: "B",
        text: "The law is valid if the state has a rational basis for deterring unlawful acts committed under the creed.",
        verdict: "trap",
        mold: "conduct-switch bait",
        explanation:
          "B follows the state's conduct frame, but the statute punishes holding or teaching the creed. Conduct is the adjacent issue, not the law being tested.",
      },
      {
        letter: "C",
        text: "The law is unconstitutional because the government may not punish religious belief as such.",
        verdict: "correct",
        mold: "belief-as-such rule",
        explanation:
          "C is correct. The government may regulate conduct under the applicable constitutional standards, but it may not punish religious belief or profession as such.",
      },
      {
        letter: "D",
        text: "The law is valid because the Free Exercise Clause protects only formal church organizations.",
        verdict: "trap",
        mold: "church-only overclaim",
        explanation:
          "D over-narrows Free Exercise. Individuals, not only formal church organizations, are protected in holding and professing religious belief.",
      },
    ],
    answerFlow: [
      "Start with the object of the statute.",
      "The law punishes holding or teaching the creed.",
      "Separate belief/profession from conduct.",
      "Cut B because it answers the conduct question instead of the belief ban.",
      "Cut A because Free Exercise does not need an added Establishment Clause violation.",
      "Cut D because Free Exercise is not limited to formal church organizations.",
      "C directly matches the belief-as-such rule.",
      "Choose C.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Belief and profession as such are protected; conduct is a separate constitutional lane.",
      },
      {
        label: "Purple profile",
        body: "The traps shift to conduct, Establishment-only invalidity, or church-only protection.",
      },
      {
        label: "Blue signal",
        body: "The decisive words are hold or teach, not unlawful acts.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: following the government's conduct justification before locking what the statute actually punishes.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-BELIEF-CONDUCT-01",
        body: "Free Exercise protects religious belief and profession as such. Conduct inspired by belief is a separate lane and may be regulated under the applicable constitutional standard.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-BELIEF-CONDUCT-OBJECT-01",
        body: "First lock the object of the law: belief or conduct. If an answer changes the object from belief to unlawful acts, cut it as the adjacent-call answer.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FREEEX-INDIVIDUALS-01",
        body: "Free Exercise protection is not limited to formal churches; individuals also hold and profess religious beliefs.",
      },
    ],
    leadMeSteps: [
      "Read the call.",
      "Find what the statute punishes.",
      "Name the belief/conduct split.",
      "Cut the conduct-switch answer.",
      "Cut the Establishment-only answer.",
      "Cut the church-only answer.",
      "Match the belief-as-such rule.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Belief Or Conduct",
        prompt:
          "A statute punishes holding or teaching a religious creed. The state defends the law by pointing to unlawful acts inspired by that creed. What is the first move?",
        answer:
          "Lock the object of the statute. It punishes belief or teaching, so conduct-regulation answers are the wrong frame.",
      },
      {
        title: "Only If Trap",
        prompt:
          "An answer says a religion law is invalid only if it also violates the Establishment Clause. What is the problem?",
        answer:
          "The word only overclaims. Free Exercise can independently invalidate punishment of religious belief as such.",
      },
      {
        title: "Church-Only Trap",
        prompt: "Does Free Exercise protect only formal church organizations?",
        answer:
          "No. It protects individual religious belief and profession as well.",
      },
    ],
  },
  {
    questionId: "20981",
    transformId: "20981_lydia-station-fountain",
    title: "Public Display Needs Context",
    selectorCode: "44040501",
    selectorMatch: "exact",
    outlineCode: "44040501",
    sourceOutlineCode: "44040501",
    coverageGroup: "free_exercise",
    seedBucket: "needs_human_review",
    key: "A",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "When a longstanding religious symbol is maintained on public property with civic history and no required religious participation, should the Establishment Clause answer be automatic or context-sensitive?",
    stem:
      "For 92 years, an ichthys-shaped stone fountain has stood in the city's Lydia Station plaza. The fountain was dedicated to volunteers who rescued residents during a historic flood and sits among murals and plaques honoring firefighters, nurses, and other local servants. The city cleans the fountain and maintains the plaza, but it does not sponsor prayers there or ask anyone to take part in religious activity. Which statement is most accurate?",
    choices: [
      {
        letter: "A",
        text: "A court should evaluate the fountain's history, setting, and coercive effect rather than use an automatic rule.",
        verdict: "correct",
        mold: "context-sensitive Establishment inquiry",
        explanation:
          "A is correct. Longstanding religiously expressive public displays are judged by history, setting, and coercion, not by an automatic symbol rule.",
      },
      {
        letter: "B",
        text: "The fountain is automatically constitutional because it has stood for many decades.",
        verdict: "trap",
        mold: "age-is-dispositive half-truth",
        explanation:
          "B overuses a real fact. Age matters to the context inquiry, but it does not automatically decide the Establishment Clause issue.",
      },
      {
        letter: "C",
        text: "The fountain is constitutional only if the city adds comparable symbols from every major faith.",
        verdict: "trap",
        mold: "fabricated all-faiths requirement",
        explanation:
          "C invents a condition. The Constitution does not require a city to add symbols from every major faith before a longstanding civic display can remain.",
      },
      {
        letter: "D",
        text: "The fountain is automatically unconstitutional because it uses a Christian symbol on city property.",
        verdict: "trap",
        mold: "automatic invalidity overclaim",
        explanation:
          "D is the dominant trap. A Christian symbol on public property triggers Establishment Clause analysis, but it does not automatically establish a violation.",
      },
    ],
    answerFlow: [
      "Name the issue: Establishment Clause public religious display.",
      "Notice the city maintenance and public plaza facts.",
      "Notice the religious symbol, but do not stop there.",
      "Use the age, civic dedication, surrounding displays, and no-participation facts.",
      "Cut automatic invalidity.",
      "Cut automatic validity from age alone.",
      "Cut the invented all-faiths requirement.",
      "Choose A because it preserves the context inquiry.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is automatic symbol invalidity versus context-sensitive Establishment Clause review.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with three shortcuts: automatic invalidity, automatic validity, and an invented equal-symbols condition.",
      },
      {
        label: "Blue signal",
        body: "The stem gives history, civic setting, and no required religious activity because those facts matter.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating a religious symbol on public property as the answer instead of the issue trigger.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-RELIGIOUS-SYMBOLS-01",
        body: "A religious symbol on public property is not automatically unconstitutional, and age alone is not automatically dispositive. For longstanding public monuments, symbols, and practices, the Establishment Clause analysis is history-focused and context-sensitive.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-AUTOMATIC-RULE-01",
        body: "When three choices try to end an Establishment Clause display case with automatically or only if, cut those extremes first and keep the answer that weighs the stem's context facts.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-ESTABLISHMENT-COERCION-CONTEXT-01",
        body: "No required religious participation is a context fact; it does not create a one-word test, but it helps reject automatic invalidity.",
      },
    ],
    leadMeSteps: [
      "Name the clause.",
      "Find the government actor.",
      "Find the religious symbol.",
      "Find the history and civic setting.",
      "Find the no-coercion fact.",
      "Cut automatic answers.",
      "Reject the invented all-faiths condition.",
      "Pick A.",
    ],
    drillSeeds: [
      {
        title: "Public Display Rule",
        prompt:
          "A longstanding religious symbol sits on public property with civic history and no required religious activity. Is it automatically unconstitutional?",
        answer:
          "No. The court evaluates history, setting, and coercive effect rather than using an automatic symbol rule.",
      },
      {
        title: "Age Trap",
        prompt:
          "Why is 'it is old, so it is automatically valid' wrong in an Establishment Clause display question?",
        answer:
          "Age is relevant context, but it is not a complete constitutional test by itself.",
      },
      {
        title: "All-Faiths Trap",
        prompt:
          "Does the city have to add comparable symbols from every major faith to keep a longstanding civic display?",
        answer:
          "No. That is an invented all-symbols requirement, not the Establishment Clause rule.",
      },
    ],
  },
  {
    questionId: "22592",
    transformId: "22592_house_fellowship_lamb_rite",
    title: "Sincerity Yes, Reasonableness No",
    selectorCode: "44040501",
    selectorMatch: "exact",
    outlineCode: "44040501",
    sourceOutlineCode: "44040501",
    coverageGroup: "free_exercise",
    seedBucket: "needs_human_review",
    key: "C",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "In a Free Exercise challenge, which inquiry is forbidden when a claimant says a religious practice required violating an animal-cruelty law?",
    stem:
      'A state statute makes it unlawful to kill an animal "by a method that inflicts needless pain or suffering." Daniel is prosecuted after he suffocates a lamb during a private faith-fellowship ceremony that he says his religious community requires. Daniel argues that applying the statute to him violates his free exercise of religion. Which of the following may the court NOT consider in deciding the constitutional issue?',
    choices: [
      {
        letter: "A",
        text: "Whether the lamb rite has been practiced by the fellowship for many years.",
        verdict: "trap",
        mold: "history-as-forbidden-inquiry trap",
        explanation:
          "A overextends the rule. A court may consider history or tradition as evidence bearing on sincerity or religious character; that is not the same as judging whether the belief is reasonable.",
      },
      {
        letter: "B",
        text: "Whether Daniel is sincere in the religious belief that requires the lamb rite.",
        verdict: "trap",
        mold: "sincerity-reasonableness confusion",
        explanation:
          "B confuses two different inquiries. Courts may test whether Daniel honestly holds the asserted belief, but they may not decide whether the belief itself makes sense.",
      },
      {
        letter: "C",
        text: "Whether the religious belief requiring the lamb rite is reasonable.",
        verdict: "correct",
        mold: "forbidden belief-evaluation inquiry",
        explanation:
          "C is correct. Free Exercise doctrine permits sincerity review, but courts may not grade the reasonableness, truth, or logic of a religious belief.",
      },
      {
        letter: "D",
        text: "Whether applying the statute is necessary to protect a compelling state interest.",
        verdict: "trap",
        mold: "legal-scrutiny-not-belief-evaluation",
        explanation:
          "D is not the forbidden inquiry. Compelling-interest review is not automatic for every neutral, generally applicable law, but government-interest review may be considered when constitutionality is being decided.",
      },
    ],
    answerFlow: [
      "Read the negative call: identify the inquiry the court may not consider.",
      "Separate belief evaluation from surrounding legal inquiries.",
      "Cut A because tradition can be relevant without judging reasonableness.",
      "Cut B because sincerity is a permissible threshold inquiry.",
      "Cut D because government-interest review is legal scrutiny, not belief evaluation.",
      "Choose C because it asks the court to judge whether the religious belief is reasonable.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "Belief reasonableness is forbidden; sincerity, tradition, and government-interest review are different inquiries.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students to treat every look at religion as forbidden.",
      },
      {
        label: "Blue signal",
        body: "The word reasonable points at the belief itself, not Daniel's honesty or the state's justification.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: turning the no-reasonableness rule into a no-inquiry-at-all rule.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-FREEEX-REASONABLENESS-01",
        body: "Courts may test sincerity, but they may not decide whether a religious belief is reasonable, logical, true, or sensible.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-FREEEX-SINCERITY-01",
        body: "Sincerity asks whether the claimant honestly holds the belief; reasonableness asks whether judges think the belief makes sense.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-NEGATIVE-CALL-01",
        body: "In a NOT-consider call, pick the legally forbidden inquiry, not an inquiry that is merely non-dispositive.",
      },
    ],
    leadMeSteps: [
      "Spot the negative call.",
      "Name the claim: Free Exercise.",
      "Separate sincerity from reasonableness.",
      "Separate legal scrutiny from belief evaluation.",
      "Reject no-inquiry overextension.",
      "Pick C.",
    ],
    drillSeeds: [
      {
        title: "Sincerity Versus Reasonableness",
        prompt:
          "In a Free Exercise claim, what can a court test: sincerity or reasonableness of the belief?",
        answer:
          "The court may test sincerity, but it may not judge the belief's reasonableness.",
      },
      {
        title: "Negative Call Discipline",
        prompt:
          "When the call asks what the court may NOT consider, why is a merely non-dispositive factor not enough?",
        answer:
          "Because the answer must be a forbidden inquiry, not just a factor that does not always decide the case.",
      },
      {
        title: "Government Interest Trap",
        prompt: "Why is compelling-interest review not the forbidden inquiry here?",
        answer:
          "It is legal scrutiny of the state's justification, not a judgment about whether the religious belief is reasonable.",
      },
    ],
  },
  {
    questionId: "14223",
    transformId: "14223_library-bulletin",
    title: "Commercial Speech Needs Fit",
    selectorCode: "44040502",
    selectorMatch: "exact",
    outlineCode: "44040502",
    sourceOutlineCode: "44040502",
    coverageGroup: "first_amendment_speech_forum",
    seedBucket: "needs_human_review",
    key: "D",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A public library removes only commercial-ad postings from bulletin boards, citing clutter, but the policy clears only 10% of slots with no proof commercial flyers create more clutter. Is the policy constitutional?",
    stem:
      "A public library board enacted a policy removing from its branch lobbies all bulletin-board postings that consist entirely of commercial advertisements for for-profit services. The policy was enacted because of a concern about the adverse visual effects of clutter and paper waste from flyers posted on the library bulletin boards. However, the library board continued to allow postings for community events, church announcements, charitable notices, and other non-commercial matters on the same bulletin boards. As a result of the policy, 15 of the 150 bulletin-board slots across the library system were cleared. Is this library-board policy constitutional?",
    choices: [
      {
        letter: "A",
        text: "Yes, because regulations of commercial speech are subject only to the requirement that they be rationally related to a legitimate state goal, and that requirement is satisfied here.",
        verdict: "trap",
        mold: "rational-basis tier error",
        explanation:
          "A uses too low a standard. Truthful, lawful commercial speech gets First Amendment protection under the commercial-speech framework, not mere rational-basis review.",
      },
      {
        letter: "B",
        text: "Yes, because the library board has a compelling interest in protecting the appearance of its lobbies and reducing paper waste, and such a ban is necessary to vindicate this interest.",
        verdict: "trap",
        mold: "strict-scrutiny tier error",
        explanation:
          "B uses too high a standard. Commercial-speech regulations do not automatically require the compelling-interest and necessary-means language of strict scrutiny.",
      },
      {
        letter: "C",
        text: "No, because it does not constitute the least restrictive means with which to reduce clutter and paper waste in the library lobbies.",
        verdict: "trap",
        mold: "right outcome wrong tailoring",
        explanation:
          "C reaches the right no answer for the wrong reason. The commercial-speech test requires a reasonable fit, not the least restrictive means.",
      },
      {
        letter: "D",
        text: "No, because there is not a reasonable fit between the legitimate interest of the library board in reducing clutter and paper waste and the means it chose to advance that interest.",
        verdict: "correct",
        mold: "reasonable-fit failure",
        explanation:
          "D is correct. Clearing only 15 of 150 slots, with no evidence that commercial flyers create more clutter than the flyers left in place, does not reasonably fit the board's clutter-and-waste interest.",
      },
    ],
    answerFlow: [
      "Classify the speech: commercial advertising for for-profit services.",
      "Use the commercial-speech framework, not rational basis or strict scrutiny.",
      "Accept that reducing clutter and paper waste can be a legitimate and substantial interest.",
      "Ask whether the policy directly advances that interest with a reasonable fit.",
      "Cut A because rational basis is too low.",
      "Cut B because strict scrutiny is too high.",
      "Cut C because least restrictive means is not the commercial-speech tailoring test.",
      "Choose D because the 15-of-150 clearance and missing proof show no reasonable fit.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is commercial-speech intermediate scrutiny and reasonable fit.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with wrong-tier answers and a right-result wrong-reason least-restrictive-means choice.",
      },
      {
        label: "Blue signal",
        body: "The decisive facts are commercial advertisements, 15 of 150 slots, and no evidence that commercial flyers cause more clutter.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: swapping among scrutiny labels without locking the commercial-speech test.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-COMMERCIAL-SPEECH-01",
        body: "Truthful, lawful commercial speech may be regulated only when the regulation serves a substantial government interest, directly advances that interest, and has a reasonable fit with the means chosen.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-COMMERCIAL-SPEECH-TIER-01",
        body: "Commercial speech is not rational basis and not strict scrutiny; use the intermediate commercial-speech framework.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-REASONABLE-FIT-NOT-LRM-01",
        body: "Commercial-speech tailoring requires reasonable fit, not least restrictive means.",
      },
    ],
    leadMeSteps: [
      "Classify speech.",
      "Name commercial-speech test.",
      "Reject rational basis.",
      "Reject strict scrutiny.",
      "Reject least restrictive means.",
      "Check direct advancement.",
      "Check reasonable fit.",
      "Pick D.",
    ],
    drillSeeds: [
      {
        title: "Commercial Speech Tier",
        prompt:
          "A city regulates truthful commercial advertisements. What scrutiny lane should you use?",
        answer:
          "Use the commercial-speech framework: substantial interest, direct advancement, and reasonable fit.",
      },
      {
        title: "Reasonable Fit",
        prompt:
          "A clutter policy removes only 10% of flyers and gives no proof that those flyers create more clutter. What prong is weak?",
        answer:
          "Reasonable fit and direct advancement are weak because the means barely address the stated problem.",
      },
      {
        title: "Least Means Trap",
        prompt:
          "Why is 'not the least restrictive means' a trap in a commercial-speech question?",
        answer:
          "Least restrictive means is strict-scrutiny language; commercial speech requires a reasonable fit.",
      },
    ],
  },
  {
    questionId: "14224",
    transformId: "14224_heritage-row-banner",
    title: "Content Neutral Still Needs Fit",
    selectorCode: "44040502",
    selectorMatch: "exact",
    outlineCode: "44040502",
    sourceOutlineCode: "44040502",
    coverageGroup: "first_amendment_speech_forum",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A city applies a color and size limit to all signs in a historic district. What is the political speaker's strongest First Amendment argument?",
    stem:
      "Residents of a city complained that bright signs distracted drivers on the narrow streets of Heritage Row and clashed with the district's historic storefronts. In response, the city council enacted an ordinance requiring any sign or visual display visible from the district's public streets to be black and white and no more than four feet long or wide. A political party wants to hang a six-foot red, white, and blue campaign banner in front of its rented office in Heritage Row. The party files suit challenging the ordinance as applied to the banner. Which argument is most useful for the political party?",
    choices: [
      {
        letter: "A",
        text: "The ordinance is not the least restrictive means of promoting a compelling government interest.",
        verdict: "trap",
        mold: "strict-scrutiny overstatement",
        explanation:
          "A uses strict-scrutiny language. The ordinance regulates signs without reference to message, so the better lane is content-neutral time, place, and manner scrutiny.",
      },
      {
        letter: "B",
        text: "The ordinance is not narrowly tailored to further an important government interest, nor does it leave open alternative channels of communication.",
        verdict: "correct",
        mold: "time-place-manner test",
        explanation:
          "B is correct. A content-neutral sign regulation in a public forum must be narrowly tailored to an important government interest and leave open adequate alternative channels.",
      },
      {
        letter: "C",
        text: "The ordinance imposes a prior restraint on political expression.",
        verdict: "trap",
        mold: "prior-restraint mislabel",
        explanation:
          "C mislabels the problem. The ordinance does not require official permission before speaking; it sets generally applicable color and size limits.",
      },
      {
        letter: "D",
        text: "The ordinance effectively favors some categories of speech over others.",
        verdict: "trap",
        mold: "content-discrimination leap",
        explanation:
          "D leaps past the text. The ordinance applies to any sign or visual display visible from the street, regardless of subject or viewpoint.",
      },
    ],
    answerFlow: [
      "Classify the ordinance: it regulates sign color and size, not message.",
      "That points to a content-neutral time, place, and manner lane.",
      "Do not use strict scrutiny unless the regulation is content based or otherwise triggers that tier.",
      "Cut A because least restrictive means and compelling interest are too demanding here.",
      "Cut C because there is no permit or licensing scheme.",
      "Cut D because the ordinance does not classify speech by subject or viewpoint.",
      "Ask whether the rule is narrowly tailored and leaves open alternatives.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is content-neutral time/place/manner scrutiny for sign regulation.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with strict scrutiny, prior restraint, and content-discrimination labels.",
      },
      {
        label: "Blue signal",
        body: "The decisive words are any sign or visual display, black and white, and four feet; the rule is message-neutral but broad.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: treating political speech facts as automatic strict scrutiny without checking what the ordinance regulates.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-TPM-01",
        body: "A content-neutral time, place, or manner regulation of speech must be narrowly tailored to serve an important or significant government interest and must leave open adequate alternative channels of communication.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-CONTENT-NEUTRAL-SIGNS-01",
        body: "A sign rule based on size, color, location, or format can be content neutral even when it affects political speech.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-PRIOR-RESTRAINT-01",
        body: "Prior restraint usually turns on permission before speech; a generally applicable sign-size rule is not a prior restraint just because it limits expression.",
      },
    ],
    leadMeSteps: [
      "Find what the ordinance regulates.",
      "Check content neutrality.",
      "Reject strict scrutiny.",
      "Reject prior restraint.",
      "Reject content-favoring leap.",
      "Apply time/place/manner scrutiny.",
      "Check alternatives.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Content Neutral First",
        prompt:
          "A sign ordinance limits size and color for every sign in a historic district. Does the political speaker's identity alone trigger strict scrutiny?",
        answer:
          "No. First check whether the rule is content neutral; if it is, use time, place, and manner scrutiny.",
      },
      {
        title: "Prior Restraint Cut",
        prompt:
          "Why is a sign-size ordinance not automatically a prior restraint?",
        answer:
          "Because it does not require official permission before speech; it imposes generally applicable format limits.",
      },
      {
        title: "Alternative Channels",
        prompt:
          "What must a content-neutral sign rule leave open?",
        answer:
          "Adequate alternative channels of communication.",
      },
    ],
  },
  {
    questionId: "17574",
    transformId: "17574_christian_podcast_school_board",
    title: "Advance Approval Is Prior Restraint",
    selectorCode: "44040502",
    selectorMatch: "exact",
    outlineCode: "44040502",
    sourceOutlineCode: "44040502",
    coverageGroup: "first_amendment_speech_forum",
    seedBucket: "needs_human_review",
    key: "B",
    reviewStatus: "seed_candidate_needs_human_review",
    distilledCoreQuestion:
      "A pretrial court order requires a podcaster to obtain a public official's approval before publishing future civic commentary. What First Amendment doctrine is implicated?",
    stem:
      "A state court in Texas entered a pretrial order in a defamation case brought by Paul, a local school-board member. The order bars Mary, a Christian podcaster in Houston who publishes weekly commentary about local civic affairs, from publishing any future podcast episodes about Paul unless Paul first reviews and approves the episode. Mary's podcast earns revenue from third-party ads. What First Amendment doctrine is most directly implicated?",
    choices: [
      {
        letter: "A",
        text: "Rational basis, because defamation is a tort.",
        verdict: "trap",
        mold: "rational-basis procedural frame",
        explanation:
          "A follows the tort label instead of the speech restraint. A prepublication order is not ordinary after-the-fact defamation liability.",
      },
      {
        letter: "B",
        text: "Prior restraint, because the order requires advance approval before publication.",
        verdict: "correct",
        mold: "advance-approval restraint",
        explanation:
          "B is correct. A court order requiring advance approval before future publication is the classic prior-restraint problem.",
      },
      {
        letter: "C",
        text: "Commercial speech, because the podcaster earns ad revenue.",
        verdict: "trap",
        mold: "monetization-to-commercial-speech trap",
        explanation:
          "C overreads the ad-revenue fact. Civic commentary about a school-board member is not commercial advertising merely because the show is monetized.",
      },
      {
        letter: "D",
        text: "No First Amendment doctrine, because podcasts are not newspapers.",
        verdict: "trap",
        mold: "medium-not-press trap",
        explanation:
          "D is wrong because First Amendment protection is not limited to newspapers. Podcasts, blogs, newsletters, and other media can all raise prior-restraint issues.",
      },
    ],
    answerFlow: [
      "Start with the government action: a court order.",
      "Ask when the order operates: before publication.",
      "Ask what it requires: approval before future speech about Paul.",
      "That is prior restraint.",
      "Cut A because the tort posture does not erase the prepublication restraint.",
      "Cut C because ad revenue does not turn civic commentary into commercial speech.",
      "Cut D because the First Amendment is not limited to newspapers.",
      "Choose B.",
    ],
    locks: [
      {
        label: "Red axis",
        body: "The issue is advance approval before publication versus after-the-fact defamation liability.",
      },
      {
        label: "Purple profile",
        body: "The answer set tempts students with tort posture, ad revenue, and medium-based press misconceptions.",
      },
      {
        label: "Blue signal",
        body: "The decisive words are unless Paul first reviews and approves the episode.",
      },
      {
        label: "Orange repair",
        body: "Student habit to repair: letting red-herring facts about medium or revenue overpower the prepublication approval trigger.",
      },
    ],
    keys: [
      {
        kind: "Gold Key",
        id: "GK-CONLAW-PRIOR-RESTRAINT-01",
        body: "A court order that requires advance approval before speech is published is a prior restraint and carries a heavy presumption against constitutional validity.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-MONETIZED-CIVIC-SPEECH-01",
        body: "Ad revenue does not convert civic commentary about public officials into commercial speech.",
      },
      {
        kind: "Silver Key",
        id: "SK-CONLAW-MEDIUM-NEUTRAL-PRESS-01",
        body: "First Amendment speech and press protections are not limited to institutional newspapers.",
      },
    ],
    leadMeSteps: [
      "Find the order.",
      "Find the timing.",
      "Find the approval condition.",
      "Name prior restraint.",
      "Reject tort-label drift.",
      "Reject ad-revenue drift.",
      "Reject newspaper-only drift.",
      "Pick B.",
    ],
    drillSeeds: [
      {
        title: "Prior Restraint Trigger",
        prompt:
          "A court order bars a speaker from publishing future commentary unless the subject first approves it. What doctrine is triggered?",
        answer: "Prior restraint.",
      },
      {
        title: "Ad Revenue Trap",
        prompt:
          "Does earning ad revenue turn civic commentary about a public official into commercial speech?",
        answer:
          "No. Monetization does not change civic commentary into advertising.",
      },
      {
        title: "Medium Trap",
        prompt: "Does prior-restraint doctrine protect only newspapers?",
        answer:
          "No. The First Amendment protects speakers across media, including podcasts and blogs.",
      },
    ],
  },
];

export function getConLawQuestionDetail(questionId: string) {
  return (
    conLawQuestionDetails.find((question) => question.questionId === questionId) ??
    null
  );
}

export function hasConLawQuestionDetail(questionId: string) {
  return conLawQuestionDetails.some(
    (question) => question.questionId === questionId,
  );
}
