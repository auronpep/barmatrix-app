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
