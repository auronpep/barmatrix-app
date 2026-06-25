import { chromium, expect } from "@playwright/test";

const baseUrl = process.env.LEADME_SMOKE_URL ?? "http://127.0.0.1:3024";
const screenshot = process.env.LEADME_SMOKE_SCREENSHOT;
const debug = process.env.LEADME_SMOKE_DEBUG === "1";

const teachStep = {
  step_id: "leadme-v5-lm-torts-assault-000",
  order: 1,
  main_item_id: "leadme-v5-intentional-torts",
  kind: "lesson_slice",
  title: "Assault Teach First",
  prompt: "Read this first. The next cards check whether you picked it up.",
  estimated_seconds: 45,
  content_ref: { type: "leadme_v5_candidate", id: "LM-TORTS-ASSAULT-000", label: "ASSAULT-000" },
  action: { label: "Continue" },
  xp: 10,
  source: "daily",
  completed: false,
  leadme_v5_item: {
    item_id: "LM-TORTS-ASSAULT-000",
    item_type: "instruction",
    task_type: "acknowledge",
    micro_task_kind: "lead_me",
    coverage_role: "memory_line",
    layout: "standard",
    title: "Assault Teach First",
    prompt: "Read this first. The next cards check whether you picked it up.",
    front_blocks: [
      { type: "text", markdown: "Assault requires apprehension of imminent contact." },
      { type: "callout", markdown: "First move: Did the plaintiff reasonably apprehend imminent contact?" },
      { type: "warning", markdown: "Common trap: no assault because there was no touching" },
      { type: "repair", markdown: "Repair move: use apprehension of imminent contact, not actual contact." },
    ],
    options: [],
  },
};

const gateStep = {
  step_id: "leadme-v5-lm-torts-assault-001",
  order: 2,
  main_item_id: "leadme-v5-intentional-torts",
  kind: "lesson_slice",
  title: "Assault Rule Lock",
  prompt: "Did the plaintiff reasonably apprehend imminent contact?",
  estimated_seconds: 45,
  content_ref: { type: "leadme_v5_candidate", id: "LM-TORTS-ASSAULT-001", label: "ASSAULT-001" },
  action: { label: "Work this card" },
  xp: 10,
  source: "daily",
  completed: false,
  leadme_v5_item: {
    item_id: "LM-TORTS-ASSAULT-001",
    item_type: "micro_task",
    task_type: "multiple_choice",
    micro_task_kind: "gate_check",
    coverage_role: "rule_anchor",
    layout: "standard",
    title: "Assault Rule Lock",
    prompt: "Did the plaintiff reasonably apprehend imminent contact?",
    front_blocks: [
      { type: "text", markdown: "Assault requires apprehension of imminent contact." },
      { type: "callout", markdown: "Pick the legal gate. This is a scaffold, not an MBE answer choice." },
    ],
    options: [
      { id: "G1", label: "Ask whether the defendant was careless." },
      { id: "G2", label: "Did the plaintiff reasonably apprehend imminent contact?" },
      { id: "G3", label: "Ask whether the plaintiff won damages." },
      { id: "G4", label: "Ask whether a nearby doctrine sounds familiar." },
    ],
  },
};

const trapStep = {
  step_id: "leadme-v5-lm-torts-assault-002",
  order: 3,
  main_item_id: "leadme-v5-intentional-torts",
  kind: "lesson_slice",
  title: "Assault Trap Hunt",
  prompt: "Tap the trap signal.",
  estimated_seconds: 45,
  content_ref: { type: "leadme_v5_candidate", id: "LM-TORTS-ASSAULT-002", label: "ASSAULT-002" },
  action: { label: "Work this card" },
  xp: 10,
  source: "daily",
  completed: false,
  leadme_v5_item: {
    item_id: "LM-TORTS-ASSAULT-002",
    item_type: "signal_drill",
    task_type: "identify_phrase",
    micro_task_kind: "wrong_answer_cut",
    coverage_role: "trap_spotter",
    layout: "standard",
    title: "Assault Trap Hunt",
    prompt: "Tap the trap signal.",
    front_blocks: [
      { type: "text", markdown: "Assault requires apprehension of imminent contact." },
      { type: "warning", markdown: "Trap hunt: choose the broken phrase, not the legally correct phrase." },
    ],
    options: [
      { id: "S1", label: "Did the plaintiff reasonably apprehend imminent contact?" },
      { id: "S2", label: "use apprehension of imminent contact, not actual contact" },
      { id: "S3", label: "no assault because there was no touching" },
      { id: "S4", label: "Assault requires apprehension of imminent contact." },
    ],
  },
};

const answerStep = {
  ...trapStep,
  step_id: "leadme-v5-lm-torts-assault-005",
  order: 4,
  title: "Assault Answer Check",
  prompt: "Which answer should survive?",
  content_ref: { type: "leadme_v5_candidate", id: "LM-TORTS-ASSAULT-005", label: "ASSAULT-005" },
  leadme_v5_item: {
    item_id: "LM-TORTS-ASSAULT-005",
    item_type: "assessment_gate",
    task_type: "multiple_choice",
    micro_task_kind: "mastery_gate",
    coverage_role: "mastery_gate",
    layout: "standard",
    title: "Assault Answer Check",
    prompt: "Which answer should survive?",
    front_blocks: [{ type: "text", markdown: "A defendant swings and misses." }],
    options: [
      { id: "A", label: "Did the defendant touch the plaintiff?" },
      { id: "B", label: "Was the plaintiff physically injured?" },
      { id: "C", label: "Did the plaintiff apprehend imminent contact?" },
      { id: "D", label: "Was the defendant careless?" },
    ],
  },
};

const steps = [teachStep, gateStep, trapStep, answerStep];

function stepIndex(currentStep) {
  return Math.max(0, steps.findIndex((step) => step.step_id === currentStep.step_id));
}

function response(currentStep) {
  const completedSteps = stepIndex(currentStep);
  return {
    enrolled: true,
    status: "active",
    refunded: false,
    student_id: "student_preview",
    day_key: "2026-06-24",
    timezone: "America/Los_Angeles",
    rollover_hour: 3,
    day_summaries: [],
    gamification: null,
    plan: {
      plan_key: "leadme-v5-intentional-torts-pilot",
      day_index: 1,
      title: "Intentional Torts Pilot Path",
      main_items: [{
        main_item_id: "leadme-v5-intentional-torts",
        order: 1,
        title: "Intentional Torts Pilot Path",
        description: "LeadMe V5 pilot for intentional torts.",
        selectable: false,
        status: "active",
        completed_steps: completedSteps,
        step_count: steps.length,
      }],
      steps: steps.map((step, index) => ({ ...step, completed: index < completedSteps })),
      current_step: currentStep,
      metrics: {
        total_daily_steps: steps.length,
        completed_daily_steps: completedSteps,
        progress_pct: Math.round((completedSteps / steps.length) * 100),
      },
      catchup: { pending_count: 0, injected_count: 0 },
    },
  };
}

const resultByStep = {
  [gateStep.step_id]: {
    item_id: "LM-TORTS-ASSAULT-001",
    item_type: "micro_task",
    task_type: "multiple_choice",
    micro_task_kind: "gate_check",
    title: "Assault Rule Lock",
    selected_response: "G2",
    selected_label: "correct gate",
    correct: true,
    correct_responses: [{ id: "G2", label: "Did the plaintiff reasonably apprehend imminent contact?" }],
    feedback_blocks: [{ type: "feedback", markdown: "Correct. That is the assault gate." }],
  },
};

function resultForStep(stepId, selectedResponse) {
  if (stepId === trapStep.step_id && selectedResponse === "S1") {
    return {
      item_id: "LM-TORTS-ASSAULT-002",
      item_type: "signal_drill",
      task_type: "identify_phrase",
      micro_task_kind: "wrong_answer_cut",
      title: "Assault Trap Hunt",
      selected_response: "S1",
      selected_label: "legally correct phrase",
      correct: false,
      correct_responses: [{ id: "S3", label: "no assault because there was no touching" }],
      feedback_blocks: [{ type: "feedback", markdown: "That phrase is useful law work, but this mode asked for the broken phrase." }],
    };
  }
  if (stepId === trapStep.step_id) {
    return {
    item_id: "LM-TORTS-ASSAULT-002",
    item_type: "signal_drill",
    task_type: "identify_phrase",
    micro_task_kind: "wrong_answer_cut",
    title: "Assault Trap Hunt",
    selected_response: "S3",
    selected_label: "trap signal identified",
    correct: true,
    correct_responses: [{ id: "S3", label: "no assault because there was no touching" }],
    feedback_blocks: [{ type: "feedback", markdown: "Correct. The trap is no assault because there was no touching." }],
    };
  }
  return resultByStep[stepId] ?? null;
}

function expectedResponseFor(stepId) {
  if (stepId === teachStep.step_id) return undefined;
  if (stepId === gateStep.step_id) return "G2";
  if (stepId === trapStep.step_id) return ["S1", "S3"];
  return "C";
}

function completionResponseFor(stepId, selectedResponse) {
  const completedIndex = steps.findIndex((step) => step.step_id === stepId);
  const result = resultForStep(stepId, selectedResponse);
  const nextStep = result?.correct === false
    ? steps[completedIndex]
    : steps[Math.min(completedIndex + 1, steps.length - 1)];
  currentApiStep = nextStep;
  return {
    ok: true,
    completed_step_id: stepId,
    completion_gamification: null,
    leadme_v5_result: result,
    ...response(nextStep),
  };
}

async function clickAndWaitForCompletion(page, locator) {
  const completionPromise = page.waitForResponse((response) =>
    response.url().includes("/api/me/day-plan/steps/")
    && response.url().endsWith("/complete"),
  );
  await locator.click();
  await completionPromise;
}

let currentApiStep = teachStep;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let completionRequests = 0;
let dayPlanRequests = 0;

if (debug) {
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("/api/me/day-plan")) {
      console.log("request", request.method(), url);
    }
  });
  page.on("response", (response) => {
    const url = response.url();
    if (url.includes("/api/me/day-plan")) {
      console.log("response", response.status(), url);
    }
  });
  page.on("console", (message) => {
    console.log("browser-console", message.type(), message.text());
  });
}

await page.route("**/api/me/day-plan", async (route) => {
  dayPlanRequests += 1;
  await route.fulfill({ json: response(currentApiStep) });
});

await page.route("**/api/me/day-plan/steps/**/complete", async (route) => {
  completionRequests += 1;
  const body = route.request().postDataJSON() ?? {};
  const stepId = decodeURIComponent(route.request().url().match(/\/steps\/([^/]+)\/complete$/)?.[1] ?? "");
  const expectedResponse = expectedResponseFor(stepId);
  if (expectedResponse === undefined && Object.hasOwn(body, "selected_response")) {
    await route.fulfill({ status: 400, json: { error: "unexpected selected_response" } });
    return;
  }
  if (Array.isArray(expectedResponse) && !expectedResponse.includes(body.selected_response)) {
    await route.fulfill({ status: 400, json: { error: "unexpected selected_response" } });
    return;
  }
  if (typeof expectedResponse === "string" && body.selected_response !== expectedResponse) {
    await route.fulfill({ status: 400, json: { error: "unexpected selected_response" } });
    return;
  }
  await route.fulfill({ json: completionResponseFor(stepId, body.selected_response) });
});

await page.goto(`${baseUrl}/dashboard/path`);
await expect(page.getByText("Teach First").first()).toBeVisible();
await expect(page.getByText("Read this first. The next cards check whether you picked it up.").first()).toBeVisible();
await expect(page.locator("[data-leadme-option-style]")).toHaveCount(0);
await clickAndWaitForCompletion(
  page,
  page.getByRole("button", { name: "Continue" }),
);
if (completionRequests !== 1) {
  throw new Error(`Expected one completion request after teach card, saw ${completionRequests}. Day-plan requests: ${dayPlanRequests}.`);
}
await expect(page.getByText("Rule Lock").first()).toBeVisible();
await expect(page.getByText("This is not an MBE answer choice")).toBeVisible();
await expect(page.locator('[data-leadme-option-style="gate"]').first()).toBeVisible();
await expect(page.locator('[data-leadme-option-style="answer"]')).toHaveCount(0);
await expect(page.getByText("Gate 1")).toBeVisible();
await clickAndWaitForCompletion(
  page,
  page.getByRole("button", { name: /Gate 2: Did the plaintiff reasonably apprehend imminent contact/i }),
);
if (completionRequests !== 2) {
  throw new Error(`Expected two completion requests after gate, saw ${completionRequests}. Day-plan requests: ${dayPlanRequests}.`);
}
await expect(page.getByText("Trap Hunt").first()).toBeVisible();
await expect(page.getByRole("button", { name: "Next task" })).toHaveCount(0);
await expect(page.getByText("This is not an MBE answer choice")).toBeVisible();
await expect(page.locator('[data-leadme-option-style="signal"]').first()).toBeVisible();
await expect(page.getByText("Signal 1")).toBeVisible();
await clickAndWaitForCompletion(
  page,
  page.getByRole("button", { name: /Signal 1: Did the plaintiff reasonably apprehend imminent contact/i }),
);
if (completionRequests !== 3) {
  throw new Error(`Expected three completion requests after wrong signal, saw ${completionRequests}. Day-plan requests: ${dayPlanRequests}.`);
}
await expect(page.getByText("Not yet").first()).toBeVisible();
await expect(page.getByText("Assault Trap Hunt").first()).toBeVisible();
await expect(page.getByRole("button", { name: /Signal 3: no assault because there was no touching/i })).toBeEnabled();
await expect(page.getByRole("button", { name: "Next task" })).toHaveCount(0);
await clickAndWaitForCompletion(
  page,
  page.getByRole("button", { name: /Signal 3: no assault because there was no touching/i }),
);
if (completionRequests !== 4) {
  throw new Error(`Expected four completion requests after signal retry, saw ${completionRequests}. Day-plan requests: ${dayPlanRequests}.`);
}
await expect(page.getByText("Assault Answer Check").first()).toBeVisible();
await expect(page.getByRole("button", { name: "Next task" })).toHaveCount(0);
await expect(page.locator('[data-leadme-option-style="answer"]').first()).toBeVisible();

if (screenshot) {
  await page.screenshot({ path: screenshot });
}

await browser.close();
