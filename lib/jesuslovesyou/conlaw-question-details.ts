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
