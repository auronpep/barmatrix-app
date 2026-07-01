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
