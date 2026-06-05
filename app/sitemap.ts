import type { MetadataRoute } from "next";

const LAST_MODIFIED = new Date("2026-06-05T00:00:00.000Z");

const ROUTES = [
  "/",
  "/about",
  "/app",
  "/how-it-works",
  "/pricing",
  "/diagnostic",
  "/foundations",
  "/mastery",
  "/coach",
  "/certification",
  "/red-zones",
  "/traps",
  "/tensions",
  "/boot-camps",
  "/timed-sets",
  "/subjects/civil-procedure",
  "/subjects/constitutional-law",
  "/subjects/contracts",
  "/subjects/criminal-law",
  "/subjects/evidence",
  "/subjects/real-property",
  "/subjects/torts",
  "/partners",
  "/waitlist",
  "/faq",
  "/privacy",
  "/terms",
] as const;

const CAMPAIGN_ROUTES = [
  "/campaign.html",
  "/lp-diagnostic-map.html",
  "/lp-wrong-answer-forensics.html",
  "/lp-red-zone-drills.html",
  "/lp-c3-cut-clash-call.html",
  "/lp-confidence-calibration.html",
  "/lp-timed-mixed-sets.html",
  "/lp-foundations-course.html",
  "/lp-boot-camp.html",
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
  const campaignRoutes = CAMPAIGN_ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: route === "/campaign.html" ? 0.8 : 0.65,
  }));
  return [...appRoutes, ...campaignRoutes];
}
