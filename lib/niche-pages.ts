// Niche landing pages for direct-traffic campaigns (/for/<slug>).
// New audience-specific copy — extends, never edits, the locked copy in lib/copy.ts.
// Claims must stay inside the locked boundaries: multiple-choice only, complements a
// full course, no outcome guarantees (see DISCLAIMER in lib/copy.ts).

export interface HeadlineSegment {
  text: string;
  style?: "italic" | "red";
}

export interface NichePage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  stamps: [string, string, string];
  eyebrow: string;
  headline: HeadlineSegment[];
  subhead: string;
  painLabel: string;
  painHeadline: HeadlineSegment[];
  painBody: string;
  painPoints: Array<[string, string]>;
  fitLabel: string;
  fitHeadline: HeadlineSegment[];
  fitSteps: Array<{ num: string; title: string; body: string }>;
  diagnosticHeadline: HeadlineSegment[];
  diagnosticBody: string;
  diagnosticBullets: string[];
  faq: Array<{ q: string; a: string }>;
}

export const NICHE_PAGES: NichePage[] = [
  {
    slug: "repeat-takers",
    metaTitle: "MBE repair for repeat takers",
    metaDescription:
      "You already did the questions. BarMatrix diagnoses the wrong-answer patterns that survived your last prep cycle and assigns targeted repair drills. Free MBE Trap Diagnostic.",
    stamps: ["AUDIENCE · REPEAT TAKERS", "JULY 2026 CYCLE", "EDITION : LAUNCH"],
    eyebrow: "▌ FOR REPEAT TAKERS",
    headline: [
      { text: "You didn't fail for lack of " },
      { text: "questions.", style: "italic" },
      { text: " You failed on " },
      { text: "repeat traps.", style: "red" },
    ],
    subhead:
      "You finished a full course. You did thousands of questions. The misses that cost you points last cycle were not random — they cluster on a small set of recurring trap patterns. BarMatrix finds yours and assigns the drills that repair them.",
    painLabel: "▌ Why Last Cycle Didn't Convert · 01",
    painHeadline: [
      { text: "Another full course replays the " },
      { text: "same cycle.", style: "red" },
    ],
    painBody:
      "Re-enrolling in the same broad review treats every topic as equally broken. It isn't. Your last score sheet already tells a narrower story — if someone reads the wrong answers forensically.",
    painPoints: [
      ["repeated your full course", "and re-reviewed rules you already know"],
      ["did more mixed sets", "and reinforced the same trap responses"],
      ["read the explanations", "and never saw the pattern across misses"],
      ["studied longer hours", "without knowing which patterns misfire"],
      ["trusted the percentage", "when the wrong-answer types held the signal"],
    ],
    fitLabel: "▌ The Rebuild · 02",
    fitHeadline: [
      { text: "A second cycle should be " },
      { text: "narrower,", style: "italic" },
      { text: " not longer." },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Diagnose what survived",
        body: "The free MBE Trap Diagnostic is weighted toward high-attractiveness wrong answers — the trap types most likely to have survived your previous prep cycle.",
      },
      {
        num: "STEP 02",
        title: "Map your carry-over traps",
        body: "Your misses are plotted on the Tension Matrix so you can see which rule-x-exception pivots keep pulling you in, instead of guessing from a raw percentage.",
      },
      {
        num: "STEP 03",
        title: "Repair, don't re-review",
        body: "Each tagged miss links to a Red-Zone Drill that hits the same tension point until it stops misfiring — targeted repair instead of another undirected review pass.",
      },
    ],
    diagnosticHeadline: [
      { text: "Start with your " },
      { text: "trap profile,", style: "red" },
      { text: " not another syllabus." },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic builds your Red-Zone Map from your actual misses — the fastest way to see what your last cycle left unrepaired.",
    diagnosticBullets: [
      "Personal Red-Zone Map built from your misses",
      "Top trap patterns ranked by attractiveness",
      "Forensic tags explaining why each miss was attractive",
      "Sample assigned drills — try before you buy",
      "Designed to run alongside any full course you re-enroll in",
    ],
    faq: [
      {
        q: "I already did thousands of questions. How is this different?",
        a: "BarMatrix doesn't add volume. It reads the type of wrong answer you choose — stale rule, wrong timing, wrong party, omitted exception — and assigns drills that target those specific patterns.",
      },
      {
        q: "Do I still need a full bar course?",
        a: "BarMatrix is multiple-choice only and is designed to complement a full bar course, not replace it. Many repeat takers pair it with their existing course materials.",
      },
      {
        q: "What does the diagnostic cost?",
        a: "The MBE Trap Diagnostic is free. Full repair access is BarMatrix Flagship at $999, with a payment plan of $500 today plus $499 in 30 days.",
      },
    ],
  },
  {
    slug: "failed-by-a-few-points",
    metaTitle: "Failed the bar by a few points? Repair the misses that did it",
    metaDescription:
      "A near-miss result usually comes down to a handful of recurring MBE trap patterns. BarMatrix diagnoses yours and assigns targeted repair drills. Free MBE Trap Diagnostic.",
    stamps: ["AUDIENCE · NEAR MISS", "JULY 2026 CYCLE", "EDITION : LAUNCH"],
    eyebrow: "▌ FOR THE NEAR MISS",
    headline: [
      { text: "A few points is not a " },
      { text: "knowledge gap.", style: "italic" },
      { text: " It's a " },
      { text: "pattern.", style: "red" },
    ],
    subhead:
      "When the margin is a handful of points, the answer is rarely \"study everything again.\" A small number of recurring trap patterns — repeated across subjects — is usually doing the damage. BarMatrix isolates them and assigns the repair.",
    painLabel: "▌ The Near-Miss Problem · 01",
    painHeadline: [
      { text: "Close results get the " },
      { text: "least precise", style: "red" },
      { text: " advice." },
    ],
    painBody:
      "\"Just do more questions\" is the default prescription for a near miss. But if a trap pattern misfires once per subject per session, that alone can account for the margin — and volume practice keeps reinforcing it.",
    painPoints: [
      ["narrowed to two", "and picked the attractive wrong answer"],
      ["knew the rule cold", "and missed the timing trigger"],
      ["spotted the doctrine", "and skipped the exception that controlled"],
      ["moved fast on familiar facts", "and applied the stale rule"],
      ["lost the same point", "in three different subjects, one pattern"],
    ],
    fitLabel: "▌ The Margin Plan · 02",
    fitHeadline: [
      { text: "Find the patterns worth " },
      { text: "exactly the margin.", style: "italic" },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Diagnose the leak",
        body: "The free diagnostic is weighted toward the highest-attractiveness wrong answers — the trap types that most often account for narrow margins.",
      },
      {
        num: "STEP 02",
        title: "Rank by cost",
        body: "Your Red-Zone Map ranks your trap patterns by attractiveness, so you spend your remaining weeks on the misses that recur — not on a full re-review.",
      },
      {
        num: "STEP 03",
        title: "Repair the recurring few",
        body: "Targeted Red-Zone Drills hit each tension point repeatedly until the trap response stops firing, then timed mixed sets confirm it holds under pressure.",
      },
    ],
    diagnosticHeadline: [
      { text: "See where the " },
      { text: "points went.", style: "red" },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic shows your most attractive trap patterns, built from your actual misses — before you commit to any prep plan.",
    diagnosticBullets: [
      "Personal Red-Zone Map (dashboard)",
      "Trap patterns ranked by attractiveness",
      "Forensic tags on every miss — why it looked right",
      "Sample assigned drills — try before you buy",
      "Works alongside whatever course you already used",
    ],
    faq: [
      {
        q: "I was only a few points away. Is a $999 program overkill?",
        a: "Start with the free diagnostic — it costs nothing and shows your trap profile. The Flagship is for examinees who want the full 2,400-question forensic bank and assigned repair path. A payment plan ($500 + $499) is available.",
      },
      {
        q: "Can a few trap patterns really account for a failing margin?",
        a: "Trap patterns recur across subjects. A single pattern that misfires once per subject can cost several scaled points across the MBE. BarMatrix maps which patterns recur in your misses; no outcome is guaranteed.",
      },
      {
        q: "Does this cover essays?",
        a: "No. BarMatrix is multiple-choice only and is designed to complement a full bar course, not replace it.",
      },
    ],
  },
  {
    slug: "working-professionals",
    metaTitle: "MBE prep for working professionals — repair, not volume",
    metaDescription:
      "Studying for the bar around a full-time job? BarMatrix replaces undirected question volume with diagnosed, assigned repair drills. Free MBE Trap Diagnostic.",
    stamps: ["AUDIENCE · WORKING STUDY", "JULY 2026 CYCLE", "EDITION : LAUNCH"],
    eyebrow: "▌ FOR WORKING PROFESSIONALS",
    headline: [
      { text: "You don't have " },
      { text: "volume hours.", style: "italic" },
      { text: " Spend the hours you have on " },
      { text: "diagnosed repair.", style: "red" },
    ],
    subhead:
      "Studying around a job means every session has to count. BarMatrix tells you which trap patterns are costing you points and assigns the exact drill for each one — so a 45-minute evening session repairs something specific instead of redoing random sets.",
    painLabel: "▌ The Working-Study Problem · 01",
    painHeadline: [
      { text: "Broad review assumes " },
      { text: "unlimited hours.", style: "red" },
    ],
    painBody:
      "Full courses are built for full-time students. When you have ninety minutes a night, undirected review cycles are the most expensive possible way to spend them.",
    painPoints: [
      ["study after work", "and spend it re-reading rules you know"],
      ["do a random 25-question set", "and repair nothing specific"],
      ["fall behind the course calendar", "and triage by guesswork"],
      ["lose weekends to review", "without knowing what's broken"],
      ["measure progress in hours", "instead of repaired patterns"],
    ],
    fitLabel: "▌ The Time-Boxed Plan · 02",
    fitHeadline: [
      { text: "Every session gets an " },
      { text: "assignment.", style: "italic" },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Diagnose once",
        body: "A short free diagnostic — not a simulated exam day — maps your trap patterns and builds your Red-Zone Map.",
      },
      {
        num: "STEP 02",
        title: "Open to an assignment",
        body: "Every session starts with an assigned Red-Zone Drill targeting your highest-cost pattern. No deciding what to study at 9pm after work.",
      },
      {
        num: "STEP 03",
        title: "Repair in micro-sets",
        body: "Drills are targeted micro-sets built around one tension point — sized for an evening, not a study hall. Timed mixed sets confirm repairs hold.",
      },
    ],
    diagnosticHeadline: [
      { text: "One short diagnostic. A plan for " },
      { text: "every session after.", style: "red" },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic builds your Red-Zone Map so your limited study hours go to the patterns that are actually costing you points.",
    diagnosticBullets: [
      "Personal Red-Zone Map (dashboard)",
      "Assigned drills — no session planning required",
      "Targeted micro-sets sized for evenings",
      "Forensic tags explaining every miss",
      "Companion path with your existing bar course",
    ],
    faq: [
      {
        q: "How much time does BarMatrix take per day?",
        a: "Red-Zone Drills are targeted micro-sets built around a single tension point. They're designed to make short sessions productive; you control the schedule.",
      },
      {
        q: "Does it replace my bar course?",
        a: "No. BarMatrix is multiple-choice only and complements a full bar course. It directs the MBE portion of your limited study time.",
      },
      {
        q: "What does it cost?",
        a: "The diagnostic is free. BarMatrix Flagship is $999, with a payment plan of $500 today plus $499 in 30 days.",
      },
    ],
  },
  {
    slug: "foreign-trained-attorneys",
    metaTitle: "MBE traps for foreign-trained and LLM attorneys",
    metaDescription:
      "Trained outside the U.S.? The MBE tests trap patterns, not just rules. BarMatrix maps the recurring rule-exception pivots and repairs your specific misses. Free diagnostic.",
    stamps: ["AUDIENCE · FOREIGN-TRAINED", "JULY 2026 CYCLE", "EDITION : LAUNCH"],
    eyebrow: "▌ FOR FOREIGN-TRAINED & LLM ATTORNEYS",
    headline: [
      { text: "You learned the rules. The MBE tests the " },
      { text: "exceptions", style: "italic" },
      { text: " — and the " },
      { text: "traps around them.", style: "red" },
    ],
    subhead:
      "Foreign-trained attorneys often know black-letter law cold and still lose points to answer-choice engineering: the attractive option that states a true rule from the wrong context. BarMatrix diagnoses exactly which trap patterns pull you in and assigns the repair drills.",
    painLabel: "▌ The Foreign-Trained Gap · 01",
    painHeadline: [
      { text: "The gap isn't " },
      { text: "knowledge.", style: "red" },
      { text: " It's trap recognition." },
    ],
    painBody:
      "U.S.-trained students absorb MBE answer-choice patterns over three years of multiple-choice exams. If your legal training tested essays or oral exams, the trap conventions are the unfamiliar part — and they're learnable as a finite set.",
    painPoints: [
      ["state the rule correctly", "and miss the American exception"],
      ["translate from your home system", "and apply the near-miss doctrine"],
      ["pick the legally true answer", "that doesn't answer the call"],
      ["trust the formal rule", "where the MBE tests the majority approach"],
      ["read carefully but slowly", "and lose the timing trigger under pressure"],
    ],
    fitLabel: "▌ The Pattern Plan · 02",
    fitHeadline: [
      { text: "Learn the trap conventions as a " },
      { text: "finite set.", style: "italic" },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Diagnose your trap profile",
        body: "The free diagnostic identifies which wrong-answer types pull you in — often different patterns than U.S.-trained takers show.",
      },
      {
        num: "STEP 02",
        title: "See the forensics",
        body: "Wrong Answer Forensics explains why the attractive answer looked right before explaining why it fails — making the American testing convention explicit instead of assumed.",
      },
      {
        num: "STEP 03",
        title: "Drill the pivots",
        body: "Red-Zone Drills target the rule-x-exception pivots the MBE reuses, so recognition becomes automatic before exam day.",
      },
    ],
    diagnosticHeadline: [
      { text: "Map the conventions " },
      { text: "nobody taught you.", style: "red" },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic shows which trap patterns pull you in — your starting map for the multiple-choice conventions of the American bar exam.",
    diagnosticBullets: [
      "Personal Red-Zone Map (dashboard)",
      "Trap patterns ranked by attractiveness",
      "Forensics that make U.S. testing conventions explicit",
      "Sample assigned drills — try before you buy",
      "Companion path with your existing bar course",
    ],
    faq: [
      {
        q: "Is BarMatrix designed for foreign-trained attorneys?",
        a: "BarMatrix works for any MBE taker. Its forensic approach — explaining why wrong answers look right — is especially useful when U.S. multiple-choice conventions are the unfamiliar part.",
      },
      {
        q: "Does it teach black-letter law from scratch?",
        a: "No. BarMatrix is a diagnostic repair system that complements a full bar course. Use your course for first-pass rule coverage; use BarMatrix to repair recurring trap patterns.",
      },
      {
        q: "Does it cover the essays or performance tests?",
        a: "No. BarMatrix is multiple-choice only.",
      },
    ],
  },
  {
    slug: "full-course-supplement",
    metaTitle: "Your bar course isn't broken. Your MBE feedback loop is.",
    metaDescription:
      "Enrolled in a full bar course but your MBE percentage plateaued? BarMatrix adds the forensic diagnosis layer your question bank doesn't have. Free MBE Trap Diagnostic.",
    stamps: ["AUDIENCE · COURSE COMPANION", "JULY 2026 CYCLE", "EDITION : LAUNCH"],
    eyebrow: "▌ FOR FULL-COURSE STUDENTS",
    headline: [
      { text: "Keep your course. Add the " },
      { text: "diagnosis layer", style: "red" },
      { text: " it doesn't have." },
    ],
    subhead:
      "Your full course covers the law. But when its question bank marks you wrong, you get an explanation — not a diagnosis. BarMatrix reads your wrong answers forensically, maps the recurring trap patterns, and assigns the drills that repair them. Alongside your course, not instead of it.",
    painLabel: "▌ The Question-Bank Gap · 01",
    painHeadline: [
      { text: "\"Read the explanation\" is not a " },
      { text: "repair plan.", style: "red" },
    ],
    painBody:
      "Big-course question banks report percentages by subject. But your misses don't cluster by subject — they cluster by trap pattern, across subjects. That layer is invisible in a standard bank.",
    painPoints: [
      ["follow the course calendar", "and your MBE percentage plateaus anyway"],
      ["read every explanation", "and repeat the trap two weeks later"],
      ["see your Evidence score", "but not the purpose-of-offer pattern behind it"],
      ["finish the assigned sets", "with no idea which misses will recur"],
      ["trust subject percentages", "while one pattern leaks points in four subjects"],
    ],
    fitLabel: "▌ The Companion Plan · 02",
    fitHeadline: [
      { text: "Course for coverage. BarMatrix for " },
      { text: "repair.", style: "italic" },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Keep your calendar",
        body: "Stay on your full course's schedule for lectures, outlines, and essays. BarMatrix is multiple-choice only and runs as a companion path.",
      },
      {
        num: "STEP 02",
        title: "Diagnose the plateau",
        body: "The free diagnostic maps why your bank percentage stalled: the specific wrong-answer patterns your course's explanations don't aggregate.",
      },
      {
        num: "STEP 03",
        title: "Repair in parallel",
        body: "Assigned Red-Zone Drills target your trap patterns in short sets that fit around your course workload — repair without abandoning coverage.",
      },
    ],
    diagnosticHeadline: [
      { text: "Find out why the percentage " },
      { text: "stopped moving.", style: "red" },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic shows the trap patterns behind your plateaued bank score — the layer your course percentage can't show you.",
    diagnosticBullets: [
      "Personal Red-Zone Map (dashboard)",
      "Cross-subject trap patterns your bank can't surface",
      "Forensic tags explaining why each miss was attractive",
      "Companion path designed around an existing course",
      "Sample assigned drills — try before you buy",
    ],
    faq: [
      {
        q: "Does BarMatrix replace my bar course?",
        a: "No — by design. BarMatrix is multiple-choice only and is built to complement a full bar course. Keep your course for coverage, essays, and schedule.",
      },
      {
        q: "How is this different from my course's question bank?",
        a: "Question banks explain the right answer. BarMatrix diagnoses your wrong answer — tagging why it was attractive and which recurring pattern it belongs to, then assigning a targeted repair drill.",
      },
      {
        q: "What does it cost on top of my course?",
        a: "The diagnostic is free. BarMatrix Flagship is $999, with a payment plan of $500 today plus $499 in 30 days. July-cycle cohort seats are limited.",
      },
    ],
  },
  {
    slug: "california-july-2026",
    metaTitle: "California Bar July 2026 — MBE trap repair cohort",
    metaDescription:
      "Sitting for the California Bar in July 2026? BarMatrix's one-cohort MBE repair system diagnoses your trap patterns and assigns targeted drills. Free diagnostic.",
    stamps: ["CALIFORNIA · JULY 2026", "ONE COHORT", "EDITION : LAUNCH"],
    eyebrow: "▌ CALIFORNIA · JULY 2026 EXAMINEES",
    headline: [
      { text: "One exam date. One cohort. A " },
      { text: "finite set", style: "italic" },
      { text: " of " },
      { text: "MBE traps.", style: "red" },
    ],
    subhead:
      "BarMatrix runs a single cohort built around the July 2026 cycle. Between now and exam day, the plan is narrow: diagnose your recurring MBE trap patterns, repair them with assigned drills, and confirm the repairs hold in timed mixed sets.",
    painLabel: "▌ The Countdown Problem · 01",
    painHeadline: [
      { text: "The weeks left don't fit an " },
      { text: "undirected plan.", style: "red" },
    ],
    painBody:
      "With a fixed exam date, every undirected review cycle has a real cost. The MBE half of your scaled score turns on a bounded set of recurring trap patterns — which makes it the most repairable part of the exam in the time remaining.",
    painPoints: [
      ["count down to July", "with a plan that isn't ranked by cost"],
      ["split time across subjects", "while one pattern leaks points in all of them"],
      ["save timed sets for the end", "and discover the traps too late"],
      ["review what feels weak", "instead of what's measured weak"],
      ["do one more full pass", "when the misses needed targeted repair"],
    ],
    fitLabel: "▌ The Cycle Plan · 02",
    fitHeadline: [
      { text: "Built around " },
      { text: "this cycle,", style: "italic" },
      { text: " not a subscription." },
    ],
    fitSteps: [
      {
        num: "STEP 01",
        title: "Diagnose now",
        body: "The free MBE Trap Diagnostic builds your Red-Zone Map today — the earlier the diagnosis, the more repair cycles fit before July.",
      },
      {
        num: "STEP 02",
        title: "Repair through the cycle",
        body: "Assigned Red-Zone Drills, boot camps, and the Pattern Mastery Board track each trap pattern from misfiring to repaired across the months remaining.",
      },
      {
        num: "STEP 03",
        title: "Sprint to exam day",
        body: "The final sprint path shifts to timed mixed sets that confirm your repairs hold under exam-day pacing.",
      },
    ],
    diagnosticHeadline: [
      { text: "July is fixed. Your " },
      { text: "trap profile", style: "red" },
      { text: " isn't — yet." },
    ],
    diagnosticBody:
      "The free MBE Trap Diagnostic is the fastest way to see your Red-Zone Map and decide how to spend the weeks between now and the July exam.",
    diagnosticBullets: [
      "Personal Red-Zone Map (dashboard)",
      "Top trap patterns ranked by attractiveness",
      "A repair path scoped to the July 2026 cycle",
      "Final sprint path for the last weeks",
      "Companion path with your existing bar course",
    ],
    faq: [
      {
        q: "Is BarMatrix only for California examinees?",
        a: "The July 2026 cohort is built around the California cycle, but the MBE is a multistate exam — students in any MBE jurisdiction can use it.",
      },
      {
        q: "Is enrollment really limited?",
        a: "Yes. There is one July-cycle cohort with limited seats. Enrollment closes when capacity is reached.",
      },
      {
        q: "What about the California essays and performance test?",
        a: "BarMatrix is multiple-choice only and complements a full bar course. It does not cover essays or performance tests.",
      },
    ],
  },
];

export function getNichePage(slug: string): NichePage | undefined {
  return NICHE_PAGES.find((p) => p.slug === slug);
}
