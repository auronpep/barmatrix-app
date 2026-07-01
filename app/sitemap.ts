import type { MetadataRoute } from "next";
import {
  JESUSLOVESYOU_ROUTE_PREFIX,
  evidencePilotCodeParams,
} from "@/lib/jesuslovesyou/pilot-data";
import { evidenceSeedQuestionParams } from "@/lib/jesuslovesyou/evidence-question-details";

const LAST_MODIFIED = new Date("2026-06-05T00:00:00.000Z");

const ROUTES = [
  "/",
  "/about",
  "/app",
  "/mobile-apps",
  "/how-it-works",
  "/pricing",
  "/Jesuslovesyou",
  "/Jesuslovesyou/evidence-pilot-01",
  "/Jesuslovesyou/evidence-pilot-01/seeds",
  "/diagnostic",
  "/foundations",
  "/mastery",
  "/coach",
  "/certification",
  "/red-zones",
  "/traps",
  "/tensions",
  "/subjects/civil-procedure",
  "/subjects/constitutional-law",
  "/subjects/contracts",
  "/subjects/criminal-law",
  "/subjects/evidence",
  "/subjects/real-property",
  "/subjects/torts",
  "/partners",
  "/tiktok",
  "/webinar",
  "/waitlist",
  "/faq",
  "/support",
  "/privacy",
  "/refund",
  "/terms",
] as const;

const NICHE_ROUTES = [
  "/for",
  "/for/repeat-takers",
  "/for/failed-by-a-few-points",
  "/for/working-professionals",
  "/for/foreign-trained-attorneys",
  "/for/full-course-supplement",
  "/for/california-july-2026",
] as const;

const COMPARISON_ROUTES = [
  "/alternatives/adaptibar",
  "/alternatives/uworld-mbe-qbank",
  "/alternatives/mbe-question-bank",
  "/barbri-mbe-companion",
  "/themis-uworld-mbe-companion",
] as const;

const CAMPAIGN_ROUTES = [
  "/campaign.html",
  "/lp-failed-by-6.html",
  "/lp-four-traps.html",
  "/lp-diagnostic-map.html",
  "/lp-wrong-answer-forensics.html",
  "/lp-wrong-answers.html",
  "/lp-wrong-answers-not-random.html",
  "/lp-red-zone.html",
  "/lp-red-zone-drills.html",
  "/lp-c3-cut-clash-call.html",
  "/lp-confidence-calibration.html",
  "/lp-timed-mixed-sets.html",
  "/lp-foundations-course.html",
  "/lp-boot-camp.html",
  "/lp-priced-right.html",
  "/lp-pattern-mastery-board.html",
  "/lp-repeat-taker-rebuild.html",
  "/lp-working-student.html",
  "/lp-final-sprint.html",
  "/lp-evidence-hearsay-purpose.html",
  "/lp-contracts-battle-forms.html",
  "/lp-torts-foreseeability.html",
  "/lp-civpro-summary-judgment.html",
  "/lp-crimpro-vehicle-search.html",
  "/lp-conlaw-standing.html",
  "/lp-property-recording.html",
  "/lp-reddit-barprep.html",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const appRoutes = ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : 0.7,
  }));
  const nicheRoutes = NICHE_ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const comparisonRoutes = COMPARISON_ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
  const campaignRoutes = CAMPAIGN_ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: route === "/campaign.html" ? 0.8 : 0.65,
  }));
  const evidencePilotRoutes = evidencePilotCodeParams.map(({ code }) => ({
    url: `https://barmatrix.app${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/${code}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));
  const evidenceQuestionRoutes = evidenceSeedQuestionParams.map(
    ({ questionId }) => ({
      url: `https://barmatrix.app${JESUSLOVESYOU_ROUTE_PREFIX}/evidence-pilot-01/seeds/${questionId}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );
  return [
    ...appRoutes,
    ...nicheRoutes,
    ...comparisonRoutes,
    ...campaignRoutes,
    ...evidencePilotRoutes,
    ...evidenceQuestionRoutes,
  ];
}
