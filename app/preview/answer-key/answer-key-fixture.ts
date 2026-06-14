// Static fixture for the Answer Key debrief preview — the Damascus Alley
// easement-remedy item (15035), ported from the design handoff's BM_AK dataset.
// Illustrative only; not served from the live bank. The Phase-2 API will produce
// this shape from c3_annotations + answer_choices + gold/silver keys.

import type { DebriefData } from "@/components/redesign/answer-key-types";

export const DAMASCUS_ALLEY: DebriefData = {
  qid: "15035_damascus_alley",
  subject: "Real Property",
  topic: "Rights in Land",
  subtopic: "Easements — termination / remedies for misuse",
  outlineCode: "81020105",
  outlinePath: "Non-Possessory Interests › Easements › Termination & Modification",
  difficultyBand: "Trap Repair",
  mechanic: "Violation-vs-remedy · scope misuse offered as termination",
  governingLane: "Violation vs. remedy",

  correctLetter: "D",
  dominantTrap: "A",
  residual: "D",
  callVerb: "terminate",
  call: "The most likely result in this action is that the court will hold for:",
  callResolution:
    "Remedy-call focus controls. Termination is the wrong remedy for ordinary overuse — so the dominant estate holder, Barnabas, wins.",
  keyLegalQuestion:
    "In an action to TERMINATE an easement, does heavier use — or scope-violating parking — forfeit the easement, or is the remedy only an injunction or damages?",
  distilledCore:
    "A deeded access easement is used more heavily after development, and visitors park along the easement area; in an action to terminate the easement, who wins?",
  reviewTruth:
    "Misuse or expanded use of an easement usually supports damages or an injunction — not termination of the easement.",
  prediction:
    "Barnabas wins unless the facts justify forfeiture. The facts show congestion and possible misuse — they do not show the deeded access easement is terminated.",
  finalScript:
    "The word is terminate. Parking in the alley may be misuse, but misuse does not usually kill the easement — it points to injunction or damages. Self-help is a side issue. D.",
  programFrame:
    "This is a Real Property easement-remedy question. The trap is not whether the alley use is annoying or even improper. The trap is the requested remedy: termination.",

  stemSegments: [
    "Barnabas owns Damascus Yard, a converted riverfront warehouse parcel used for a small Christian bookbinding studio and apartment. The parcel is boxed in by other lots, and its only access to a public street is a ",
    { t: "deeded easement", mark: "underline", type: "easement", note: "A valid deeded access easement — the very thing Lydia is trying to kill." },
    " over Lydia’s 18-foot loading alley. Lydia owns the neighboring parcel. Barnabas paved the alley route, and for ",
    { t: "14 years the alley was used without incident", mark: "highlight", type: "baseline", note: "Long, peaceful baseline use establishes the easement is real and settled." },
    ". Last spring, as permitted by the zoning ordinance, Barnabas built a ",
    { t: "140-seat Bible-map escape room and coffee courtyard", mark: "highlight", type: "expanded", note: "Use got heavier. Heavier use ≠ forfeiture." },
    " on Damascus Yard, using all available space on the parcel. The attraction became popular. On Saturday evenings, visitors overflowed the courtyard’s parking area and ",
    { t: "parked along the loading alley for hours", mark: "circle", type: "bait", note: "DOMINANT TRAP. The vivid scope-misuse fact. It feels decisive — it isn’t." },
    ". After three Saturdays of congestion, Lydia ",
    { t: "stretched a chain across the alley", mark: "strike", type: "selfhelp", note: "Self-help red herring. Not an automatic bar to an otherwise-available remedy." },
    " on Saturday evenings to block anyone seeking access to Damascus Yard. Barnabas objected. Lydia brought an appropriate ",
    { t: "action to terminate the easement", mark: "circle", type: "call", note: "THE CALL. The remedy sought is termination. Lock this before you read the choices." },
    ".",
  ],

  triggerFacts: [
    { fact: "Deeded access easement over Lydia’s loading alley", role: "Existence of easement", use: "There is a valid easement to protect.", type: "easement" },
    { fact: "Used without incident for 14 years", role: "Baseline use", use: "A settled baseline use existed.", type: "baseline" },
    { fact: "New 140-seat Bible-map escape room & coffee courtyard", role: "Expanded dominant-parcel use", use: "Use became heavier.", type: "expanded" },
    { fact: "Visitors parked along the alley for hours", role: "Possible scope misuse", use: "Dominant trap: a vivid scope/misuse fact.", type: "bait" },
    { fact: "Lydia sued to terminate the easement", role: "Remedy call", use: "The remedy call controls the answer.", type: "call" },
  ],

  choices: [
    {
      letter: "A", correct: false, dominant: true,
      text: "Lydia, because the patrons’ parking along the alley exceeded the scope of the easement.",
      keyPhrase: "exceeded the scope", keyType: "bait",
      verdict: "A violation — not a remedy",
      studentLabel: "Scope fact, wrong remedy",
      mold: "bait_doctrine", moldFamily: "ISSUE_SENSE",
      c3Signal: "The choice answers whether the use may be improper, but the call asks termination.",
      pull: "It sells the vivid parking fact. A student sees cars lining the alley for hours and treats that scope violation as a complete answer.",
      breaker: "Even if parking along the alley is beyond the scope of an access easement, the remedy is normally an injunction or damages — not termination. A violation-level reason is not enough when the call asks for forfeiture.",
      trueResponsive: "Lydia may obtain an injunction or damages for improper parking if the parking exceeds the easement’s scope.",
      lawyer: "A parking/scope violation may support damages or an injunction, but does not ordinarily forfeit the easement.",
      fullWrong: "This is the dominant trap. It sells the vivid parking fact. A student sees cars along the alley and treats that as a complete answer. Even if parking along the alley is beyond the scope of an access easement, the remedy is normally an injunction or damages, not termination. A violation-level reason is not enough when the call asks for forfeiture.",
      recovery: "Say: “This proves possible misuse. Does it prove termination?”",
      redZone: { id: "RZ-RP-VVR", label: "Violation-vs-Remedy", rank: 1 },
    },
    {
      letter: "B", correct: false, dominant: false,
      text: "Barnabas, because Lydia’s use of self-help bars her from equitable relief.",
      keyPhrase: "self-help bars her from equitable relief", keyType: "selfhelp",
      verdict: "Invented rule",
      studentLabel: "Invented self-help penalty",
      mold: "flat_misstatement", moldFamily: "EAR_FALSITY",
      c3Signal: "The answer asserts a broad penalty rule not supplied by the stem or the C3 deck.",
      pull: "This sells a punishment story. Lydia chained the alley, so it feels fair to deny her relief.",
      breaker: "The answer invents a broad self-help penalty. The facts do not make self-help an automatic bar to an otherwise-available property remedy.",
      trueResponsive: "Barnabas wins because the requested remedy is termination, and ordinary overuse does not terminate the easement.",
      lawyer: "Self-help does not automatically bar every equitable remedy.",
      fullWrong: "This sells a punishment story. Lydia chained the alley, so it feels fair to deny her relief. The breaker is that the answer invents a broad self-help penalty. The facts do not make self-help an automatic bar to an otherwise available property remedy.",
      recovery: "Demand a real rule before using self-help as a total bar.",
      redZone: { id: "RZ-RP-SELFHELP", label: "Invented Penalty Rules", rank: 4 },
    },
    {
      letter: "C", correct: false, dominant: false,
      text: "Lydia, because Barnabas excessively expanded the use of the dominant parcel.",
      keyPhrase: "excessively expanded the use", keyType: "expanded",
      verdict: "Overuse ≠ forfeiture",
      studentLabel: "Overuse pushed to forfeiture",
      mold: "extreme_of_range", moldFamily: "EAR_OVERCLAIM",
      c3Signal: "The answer takes a heavier-use fact and turns it into the strongest possible remedy.",
      pull: "This sells the dramatic-change story. The new business use looks far heavier than the old bookbinding studio.",
      breaker: "The remedy jump. Increased intensity of use may be controlled, but it does not ordinarily forfeit the easement.",
      trueResponsive: "Lydia may seek an injunction or damages if the expanded use unreasonably burdens the alley.",
      lawyer: "Expanded use of the dominant parcel does not ordinarily terminate the easement.",
      fullWrong: "This sells the dramatic-change story. The new business use looks much heavier than the old studio use. The breaker is the remedy jump. Increased use may be controlled, but it does not ordinarily forfeit the easement.",
      recovery: "Do not let heavier use become forfeiture without the Gold Key.",
      redZone: { id: "RZ-RP-VVR", label: "Violation-vs-Remedy", rank: 1 },
    },
    {
      letter: "D", correct: true, dominant: false,
      text: "Barnabas, because expanded use of the easement does not terminate the easement.",
      keyPhrase: "does not terminate the easement", keyType: "call",
      verdict: "True & responsive",
      studentLabel: "True and responsive",
      mold: null, moldFamily: null,
      c3Signal: "The answer names the remedy result: no termination.",
      pull: "It names the remedy result the call asks for: no termination.",
      breaker: "It directly answers the termination call and applies the Gold Key — ordinary misuse points to injunction or damages, not forfeiture.",
      trueResponsive: "This is already the true and responsive answer.",
      lawyer: "This is the credited rule and result for ordinary easement overuse/misuse.",
      fullRight: "D is the best answer. Barnabas wins the termination action. The facts give heavier weekend use and parking congestion. Those facts may support a narrower remedy against improper parking or unreasonable interference. They do not, by themselves, extinguish the deeded access easement.",
      recovery: null,
      redZone: null,
    },
  ],

  molds: [
    { code: "bait_doctrine", family: "ISSUE_SENSE", choice: "A", tone: "bait", label: "Bait Doctrine", definition: "A real, true-sounding legal idea that answers the wrong question. It proves a side-issue (here: a scope violation) while the call asks something else (termination).", tell: "“That’s a correct statement of law… but is it responsive to the call?”" },
    { code: "extreme_of_range", family: "EAR_OVERCLAIM", choice: "C", tone: "expanded", label: "Extreme of Range", definition: "Takes a genuine concern and pushes it to its harshest possible outcome — turning ‘heavier use’ into the most drastic remedy, forfeiture.", tell: "“The concern is real, but is this the most extreme version of it?”" },
    { code: "flat_misstatement", family: "EAR_FALSITY", choice: "B", tone: "selfhelp", label: "Flat Misstatement", definition: "Asserts a rule that simply isn’t the law. It sounds lawyerly and morally satisfying, but the stem and the deck never supply the rule.", tell: "“Where is that rule actually coming from? Did anything teach it?”" },
    { code: "correct_answer", family: "RESPONSIVE", choice: "D", tone: "call", label: "True & Responsive", definition: "States the law correctly AND answers the exact remedy the call asks about. Both filters pass.", tell: "“True. And responsive to the call. Lock it.”" },
  ],

  cut: [
    { letter: "B", mold: "flat_misstatement", note: "“Self-help bars equitable relief” is a flat rule assertion — no taught support." },
    { letter: "C", mold: "extreme_of_range", note: "Turns heavier use into termination. Pushes a real concern too far." },
    { letter: "A", mold: "bait_doctrine", note: "May prove a scope problem, but the call is termination. It answers the violation link, not the remedy link." },
  ],
  clash: "Misuse remedy  vs.  termination remedy.",

  goldKey: {
    id: "GK-REAL_PROPERTY-EASEMENT-MISUSE-01", kind: "Black-letter rule",
    statement: "Misuse, overuse, or expanded use of an easement ordinarily does not terminate the easement. The servient owner’s normal remedy is damages or an injunction against the misuse — not forfeiture.",
    unlocks: "Scope-or-overuse reasons offered as a basis for terminating the easement.",
    trigger: "A servient owner asks to terminate an access easement after heavier or messier use.",
    testedChoice: "A",
    authority: "Penn Bowling Recreation Ctr. v. Hot Shoppes, 179 F.2d 64 · Vieth v. Dorsch, 274 Wis. 17 · Sommer v. Misty Valley, LLC",
  },
  silverKey: {
    id: "SK-REAL_PROPERTY-DAMASCUS-ALLEY-01", kind: "Navigation move",
    statement: "Lock the remedy in the call. A choice that proves misuse or scope overage has not answered a termination action unless it explains why the easement is forfeited.",
    navigates: "The violation-versus-remedy trap in an easement-termination call.",
    trigger: "Answer choices say the use exceeded the scope, but the call asks who wins an action to terminate.",
    testedChoice: "A", outlineCode: "81020105",
  },

  tension: {
    axis: "Whether a proved misuse supplies the requested termination remedy.",
    resolver: "The call asks termination — not whether some lesser remedy might be available.",
  },

  remediation: {
    cardId: "REM-RP-EASEMENT-REMEDY-01", title: "Easement misuse remedy ladder",
    signal: "The servient owner asks to terminate after heavier use or messy parking.",
    studentMove: "Separate the violation question from the remedy question.",
    tinyRule: "Misuse or overuse usually leads to injunction or damages, not forfeiture.",
    confidence: "ANCHOR ASSISTED",
    queueTitle: "Violation-vs-Remedy · Easement Repair",
    queueMeta: "6 questions · ~11 min · spaced repetition active",
  },

  redZone: { id: "RZ-RP-VVR", label: "Violation-vs-Remedy", rank: 1 },
};
