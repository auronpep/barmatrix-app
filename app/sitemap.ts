import type { MetadataRoute } from "next";

const LAST_MODIFIED = new Date("2026-06-02T00:00:00.000Z");

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

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `https://barmatrix.app${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
